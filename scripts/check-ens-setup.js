const { ethers } = require('ethers');

// Configuration
const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/Iylkh0nK5WGuh1Erax1tcyZROWcPmxi2';
const PRIVATE_KEY = '0x213adbcecef4667ef52d2e243c8f912f051685660f7c6d223b7c8babf948e151';
const ETH_REGISTRAR_CONTROLLER_ADDRESS = '0xFED6a969AaA60E4961FCD3EBF1A2e8913ac65B72';

// Contract ABI
const ETH_REGISTRAR_CONTROLLER_ABI = [
  "function available(string name) view returns (bool)",
  "function rentPrice(string name, uint256 duration) view returns (uint256)"
];

async function checkENSSetup() {
  console.log('🔍 Checking ENS Registration Setup...\n');
  
  try {
    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const controller = new ethers.Contract(
      ETH_REGISTRAR_CONTROLLER_ADDRESS,
      ETH_REGISTRAR_CONTROLLER_ABI,
      provider
    );

    // Check wallet balance
    console.log('💰 Wallet Information:');
    console.log('Address:', wallet.address);
    
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = ethers.formatEther(balance);
    console.log('Balance:', balanceInEth, 'ETH');
    
    if (parseFloat(balanceInEth) < 0.01) {
      console.log('❌ Insufficient balance for ENS registration!');
      console.log('\n🚰 Get Sepolia ETH from these faucets:');
      console.log('• https://sepoliafaucet.com/');
      console.log('• https://www.alchemy.com/faucets/ethereum-sepolia');
      console.log('• https://sepolia-faucet.pk910.de/');
      console.log('\nSend Sepolia ETH to:', wallet.address);
    } else {
      console.log('✅ Wallet has sufficient balance for ENS registration');
    }

    // Test ENS availability check
    console.log('\n🔍 Testing ENS Availability Check:');
    const testName = 'testname123456789';
    try {
      const isAvailable = await controller.available(testName);
      console.log(`Name "${testName}.eth" available:`, isAvailable);
      
      if (isAvailable) {
        // Get registration price
        const duration = 31536000; // 1 year
        const price = await controller.rentPrice(testName, duration);
        console.log('Registration price:', ethers.formatEther(price), 'ETH');
        
        // Test secret generation (the fix for the error)
        const secret = ethers.hexlify(ethers.randomBytes(32));
        console.log('Generated secret (sample):', secret.substring(0, 10) + '...');
      }
      
      console.log('✅ ENS contract connection working');
    } catch (error) {
      console.log('❌ ENS contract connection failed:', error.message);
    }

    // Network information
    console.log('\n🌐 Network Information:');
    const network = await provider.getNetwork();
    console.log('Chain ID:', network.chainId.toString());
    console.log('Network Name:', network.name);
    
    if (network.chainId.toString() !== '11155111') {
      console.log('❌ Wrong network! Expected Sepolia (11155111)');
    } else {
      console.log('✅ Connected to Sepolia testnet');
    }

  } catch (error) {
    console.error('❌ Setup check failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run the check
checkENSSetup().then(() => {
  console.log('\n✨ Setup check complete!');
}).catch(console.error);
