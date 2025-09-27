// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract WalletManager is Ownable, ReentrancyGuard, Pausable {
    using Clones for address;

    event WalletCreated(
        string indexed username,
        address indexed wallet,
        uint256 indexed walletId,
        uint256 timestamp
    );
    
    event WalletStatusUpdated(
        address indexed wallet,
        bool active,
        uint256 timestamp
    );

    struct WalletInfo {
        address walletAddress;
        string username;
        bool active;
        uint256 createdAt;
        uint256 lastActivity;
    }

    address public walletImplementation; // Template contract for cloning
    uint256 private _walletIdCounter;
    
    mapping(string => address) public usernameToWallet; // username => wallet ID
    mapping(address => uint256) public walletToId; // wallet address => wallet ID
    mapping(uint256 => WalletInfo) public wallets; // wallet ID => wallet info 
    mapping(address => bool) public authorizedCallers; // Backend services that can create wallets
    
    modifier onlyAuthorized() {
        require(
            authorizedCallers[msg.sender] || msg.sender == owner(),
            "WalletManager: Not authorized"
        );
        _;
    }

    modifier validWalletId(uint256 walletId) {
        require(walletId > 0 && walletId <= _walletIdCounter, "WalletManager: Invalid wallet ID");
        _;
    }

    modifier validUsername(string calldata username) {
        require(bytes(username).length > 0, "WalletManager: Empty username");
        require(bytes(username).length <= 50, "WalletManager: Username too long");
        _;
    }

    constructor(address _walletImplementation) Ownable(msg.sender){
        require(_walletImplementation != address(0), "WalletManager: Invalid implementation");
        walletImplementation = _walletImplementation;
        _walletIdCounter = 0;
    }

    function createWallet(
        string calldata username
    ) external onlyAuthorized whenNotPaused nonReentrant validUsername(username) returns (uint256 walletId, address walletAddress) {
        require(usernameToWallet[username] == address(0), "WalletManager: Username already has wallet");

        _walletIdCounter++;
        walletId = _walletIdCounter;
        walletAddress = walletImplementation.clone();
        (bool success, ) = walletAddress.call(
            abi.encodeWithSignature("initialize(string,uint256)", username, walletId)
        );
        require(success, "WalletManager: Wallet initialization failed");
        wallets[walletId] = WalletInfo({
            walletAddress: walletAddress,
            username: username,
            active: true,
            createdAt: block.timestamp,
            lastActivity: block.timestamp
        });
        usernameToWallet[username] = walletAddress ;
        walletToId[walletAddress] = walletId;

        emit WalletCreated(username, walletAddress, walletId, block.timestamp);
    }

    function getWalletByUsername(string calldata username) external view returns (address walletAddress) {
        walletAddress = usernameToWallet[username];
    }

    // function getWalletInfoByUsername(string calldata username) external view returns (WalletInfo memory) {
    //     uint256 walletId = usernameToWallet[username];
    //     require(walletId > 0, "WalletManager: Wallet not found");
    //     return wallets[walletId];
    // }

    function getWalletInfo(uint256 walletId) external view validWalletId(walletId) returns (WalletInfo memory) {
        return wallets[walletId];
    }

    function getWalletInfoByAddress(address walletAddress) external view returns (WalletInfo memory) {
        uint256 walletId = walletToId[walletAddress];
        require(walletId > 0, "WalletManager: Wallet not found");
        return wallets[walletId];
    }

    function updateWalletActivity(address walletAddress) external onlyAuthorized {
        uint256 walletId = walletToId[walletAddress];
        require(walletId > 0, "WalletManager: Wallet not found");
        wallets[walletId].lastActivity = block.timestamp;
    }

    // /**
    //  * @dev Sets wallet active/inactive status
    //  * @param username The username
    //  * @param active The new status
    //  */
    // function setWalletStatus(
    //     string calldata username,
    //     bool active
    // ) external onlyAuthorized {
    //     uint256 walletId = usernameToWallet[username];
    //     require(walletId > 0, "WalletManager: Wallet not found");
        
    //     wallets[walletId].active = active;
    //     emit WalletStatusUpdated(wallets[walletId].walletAddress, active, block.timestamp);
    // }

    // /**
    //  * @dev Checks if a wallet exists and is active by username
    //  * @param username The username
    //  * @return True if wallet exists and is active
    //  */
    // function isActiveWallet(string calldata username) external view returns (bool) {
    //     uint256 walletId = usernameToWallet[username];
    //     return walletId > 0 && wallets[walletId].active;
    // }

    // /**
    //  * @dev Checks if a wallet exists and is active by address
    //  * @param walletAddress The wallet address
    //  * @return True if wallet exists and is active
    //  */
    // function isActiveWalletByAddress(address walletAddress) external view returns (bool) {
    //     uint256 walletId = walletToId[walletAddress];
    //     return walletId > 0 && wallets[walletId].active;
    // }

    function hasWallet(string calldata username) external view returns (bool) {
        return usernameToWallet[username] != address(0);
    }

    function getTotalWallets() external view returns (uint256) {
        return _walletIdCounter;
    }

    function addAuthorizedCaller(address caller) external onlyOwner {
        require(caller != address(0), "WalletManager: Invalid caller address");
        authorizedCallers[caller] = true;
    }

    function removeAuthorizedCaller(address caller) external onlyOwner {
        authorizedCallers[caller] = false;
    }

    function updateImplementation(address newImplementation) external onlyOwner {
        require(newImplementation != address(0), "WalletManager: Invalid implementation");
        walletImplementation = newImplementation;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyRecover(
        address token,
        address to,
        uint256 amount
    ) external onlyOwner {
        require(to != address(0), "WalletManager: Invalid recipient");
        
        if (token == address(0)) {
            payable(to).transfer(amount);
        } else {
            (bool success, ) = token.call(
                abi.encodeWithSignature("transfer(address,uint256)", to, amount)
            );
            require(success, "WalletManager: Token transfer failed");
        }
    }
}