// import { JsonRpcProvider } from 'ethers';
const { JsonRpcProvider } = require('ethers');
require('dotenv').config();

async function main() {
  // Connect to the Ethereum network
  const provider = new JsonRpcProvider(process.env.MAINNET_RPC_URL);
  // Get block by number
  const blockNumber = 'latest';
  const block = await provider.getBlock(blockNumber);
  console.log(block);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
