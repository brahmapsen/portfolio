// const { ethers } = require('hardhat');

// require('hardhat');
require('@nomicfoundation/hardhat-toolbox');

async function main() {
  const amountInWei = ethers.utils.parseEther('10');
  console.log('Amount in Wei:', amountInWei.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
