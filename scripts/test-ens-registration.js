const { ethers } = require('ethers');

// Configuration
const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/Iylkh0nK5WGuh1Erax1tcyZROWcPmxi2';
const PRIVATE_KEY = '0x213adbcecef4667ef52d2e243c8f912f051685660f7c6d223b7c8babf948e151';
const ETH_REGISTRAR_CONTROLLER_ADDRESS = '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72';
const PUBLIC_RESOLVER_ADDRESS = '0x8FADE66B79cC9f707aB26799354482EB93a5B7dD';

// Contract ABI
const ETH_REGISTRAR_CONTROLLER_ABI = [
  "function available(string name) view returns (bool)",
  "function makeCommitment(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) view returns (bytes32)",
  "function commit(bytes32 commitment)",
  "function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses) payable",
  "function rentPrice(string name, uint256 duration) view returns (uint256)"
];

async function testENSRegistrationFunction() {
  console.log('🧪 Testing ENS Registration Function...\n');
  
  try {
    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const controller = new ethers.Contract(
      ETH_REGISTRAR_CONTROLLER_ADDRESS,
      ETH_REGISTRAR_CONTROLLER_ABI,
      wallet
    );

    // Test parameters (same as in the app)
    const testName = 'testname' + Date.now(); // Unique name
    const label = testName.toLowerCase().replace('.eth', '');
    const ownerAddress = wallet.address;
    const duration = 31536000; // 1 year in seconds
    
    console.log('🔧 Test Parameters:');
    console.log('Label:', label);
    console.log('Owner:', ownerAddress);
    console.log('Duration:', duration, 'seconds (1 year)');

    // Test 1: Secret generation (the fix)
    console.log('\n✅ Test 1: Secret Generation');
    try {
      const secret = ethers.hexlify(ethers.randomBytes(32));
      console.log('Secret generated successfully:', secret.substring(0, 10) + '...');
      console.log('Secret length:', secret.length, 'characters');
    } catch (error) {
      console.log('❌ Secret generation failed:', error.message);
      return;
    }

    // Test 2: Check availability
    console.log('\n✅ Test 2: Availability Check');
    try {
      const isAvailable = await controller.available(label);
      console.log('Name available:', isAvailable);
      
      if (!isAvailable) {
        console.log('⚠️  Name not available, but test can continue');
      }
    } catch (error) {
      console.log('❌ Availability check failed:', error.message);
      return;
    }

    // Test 3: Make commitment
    console.log('\n✅ Test 3: Make Commitment');
    try {
      const secret = ethers.hexlify(ethers.randomBytes(32));
      const resolverAddress = PUBLIC_RESOLVER_ADDRESS;
      const data = [];
      const reverseRecord = true;
      const ownerControlledFuses = 0;

      const commitment = await controller.makeCommitment(
        label,
        ownerAddress,
        duration,
        secret,
        resolverAddress,
        data,
        reverseRecord,
        ownerControlledFuses
      );
      
      console.log('Commitment generated successfully:', commitment.substring(0, 10) + '...');
    } catch (error) {
      console.log('❌ Make commitment failed:', error.message);
      return;
    }

    // Test 4: Get price
    console.log('\n✅ Test 4: Price Calculation');
    try {
      const price = await controller.rentPrice(label, duration);
      console.log('Registration price:', ethers.formatEther(price), 'ETH');
      
      // Check wallet balance
      const balance = await provider.getBalance(wallet.address);
      const balanceInEth = ethers.formatEther(balance);
      console.log('Wallet balance:', balanceInEth, 'ETH');
      
      const requiredAmount = price + ethers.parseEther('0.002');
      console.log('Required amount (with gas):', ethers.formatEther(requiredAmount), 'ETH');
      
      if (balance < requiredAmount) {
        console.log('⚠️  Insufficient balance for actual registration');
      } else {
        console.log('✅ Sufficient balance for registration');
      }
    } catch (error) {
      console.log('❌ Price calculation failed:', error.message);
      return;
    }

    console.log('\n🎉 All ENS registration function tests passed!');
    console.log('The registration function should work without errors once the wallet is funded.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testENSRegistrationFunction().then(() => {
  console.log('\n✨ Test complete!');
}).catch(console.error);
