// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract UserWallet is ReentrancyGuard {
    using SafeERC20 for IERC20;

    event WalletInitialized(string indexed username, uint256 indexed walletId);
    event ExecutionSuccess(address indexed target, uint256 value, bytes data);
    event ExecutionFailure(address indexed target, uint256 value, bytes data, string reason);
    event TokensReceived(address indexed token, address indexed from, uint256 amount);
    event TokensSent(address indexed token, address indexed to, uint256 amount);

    string public username;
    address public manager; 
    uint256 public walletId;
    bool private _initialized;

    modifier onlyManager() {
        require(msg.sender == manager, "UserWallet: Not manager");
        _;
    }

    modifier onlyInitialized() {
        require(_initialized, "UserWallet: Not initialized");
        _;
    }

    function initialize(string calldata _username, uint256 _walletId) external {
        require(!_initialized, "UserWallet: Already initialized");
        require(bytes(_username).length > 0, "UserWallet: Invalid username");
        require(_walletId > 0, "UserWallet: Invalid wallet ID");

        username = _username;
        manager = msg.sender;
        walletId = _walletId;
        _initialized = true;

        emit WalletInitialized(_username, _walletId);
    }

    function execute(
        address target,
        uint256 value,
        bytes calldata data
    ) external onlyManager onlyInitialized nonReentrant returns (bool success, bytes memory returnData) {
        require(target != address(0), "UserWallet: Invalid target");
        require(address(this).balance >= value, "UserWallet: Insufficient ETH balance");

        // Update activity in manager
        try IWalletManager(manager).updateWalletActivity(address(this)) {} catch {}

        (success, returnData) = target.call{value: value}(data);
        
        if (success) {
            emit ExecutionSuccess(target, value, data);
        } else {
            string memory reason = _getRevertReason(returnData);
            emit ExecutionFailure(target, value, data, reason);
        }
    }

    function batchExecute(
        address[] calldata targets,
        uint256[] calldata values,
        bytes[] calldata data
    ) external onlyManager onlyInitialized nonReentrant returns (bool[] memory successes) {
        require(
            targets.length == values.length && values.length == data.length,
            "UserWallet: Array length mismatch"
        );
        require(targets.length > 0, "UserWallet: Empty arrays");

        successes = new bool[](targets.length);

        // Update activity in manager
        try IWalletManager(manager).updateWalletActivity(address(this)) {} catch {}

        for (uint256 i = 0; i < targets.length; i++) {
            if (targets[i] == address(0) || address(this).balance < values[i]) {
                successes[i] = false;
                continue;
            }

            (bool success, bytes memory returnData) = targets[i].call{value: values[i]}(data[i]);
            successes[i] = success;

            if (success) {
                emit ExecutionSuccess(targets[i], values[i], data[i]);
            } else {
                string memory reason = _getRevertReason(returnData);
                emit ExecutionFailure(targets[i], values[i], data[i], reason);
            }
        }
    }

    function transferETH(
        address payable to,
        uint256 amount
    ) external onlyManager onlyInitialized nonReentrant {
        require(to != address(0), "UserWallet: Invalid recipient");
        require(address(this).balance >= amount, "UserWallet: Insufficient balance");

        // Update activity in manager
        try IWalletManager(manager).updateWalletActivity(address(this)) {} catch {}

        to.transfer(amount);
        emit TokensSent(address(0), to, amount);
    }

    function transferToken(
        address token,
        address to,
        uint256 amount
    ) external onlyManager onlyInitialized nonReentrant {
        require(token != address(0), "UserWallet: Invalid token");
        require(to != address(0), "UserWallet: Invalid recipient");

        // Update activity in manager
        try IWalletManager(manager).updateWalletActivity(address(this)) {} catch {}

        IERC20(token).safeTransfer(to, amount);
        emit TokensSent(token, to, amount);
    }

    function getETHBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function isActive() external view returns (bool) {
        if (!_initialized || manager == address(0)) return false;
        
        try IWalletManager(manager).isActiveWalletByAddress(address(this)) returns (bool active) {
            return active;
        } catch {
            return false;
        }
    }

    receive() external payable {
        emit TokensReceived(address(0), msg.sender, msg.value);
    }

    fallback() external payable {
        emit TokensReceived(address(0), msg.sender, msg.value);
    }

    function _getRevertReason(bytes memory returnData) private pure returns (string memory reason) {
        if (returnData.length < 68) return "Transaction reverted silently";

        assembly {
            returnData := add(returnData, 0x04)
        }
        return abi.decode(returnData, (string));
    }
}

interface IWalletManager {
    function updateWalletActivity(address walletAddress) external;
    function isActiveWalletByAddress(address walletAddress) external view returns (bool);
}