const { expect } = require('chai');
const { ethers } = require('hardhat');

const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const DAI_DECIMALS = 18;
const SwapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

const ercAbi = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',
  'function deposit() public payable',
  'function approve(address spender, uint256 amount) returns (bool)',
];

describe('AssetManager', function () {
  it('Should provide a caller with more DAI than they started with after a swap', async function () {
    /* Deploy the assetManagerFactory contract */
    const assetManagerFactory = await ethers.getContractFactory('AssetManager');
    const assetManager = await assetManagerFactory.deploy(SwapRouterAddress);
    // const assetManager = await assetManagerDeployment.deployed;
    assetManagerAddress = await assetManager.getAddress();
    console.log(' AssetManager address:', assetManagerAddress);

    // const assetManager = await hre.ethers.deployContract(
    //   'AssetManager',
    //   [ISwapRouter],
    //   {
    //     value: SwapRouterAddress,
    //   }
    // );

    /* Connect to weth9 and wrap some eth  */
    let signers = await ethers.getSigners();
    const WETH = new ethers.Contract(WETH_ADDRESS, ercAbi, signers[0]);
    console.log('Signer:', signers[0].address);

    const deposit = await WETH.deposit({
      value: ethers.parseEther('10'),
    });
    await deposit.wait();

    /* Check Initial DAI Balance */
    const DAI = new hre.ethers.Contract(DAI_ADDRESS, ercAbi, signers[0]);
    const expandedDAIBalanceBefore = await DAI.balanceOf(signers[0].address);
    const DAIBalanceBefore = Number(
      hre.ethers.formatUnits(expandedDAIBalanceBefore, DAI_DECIMALS)
    );
    console.log('DAIBalanceBefore:', DAIBalanceBefore);

    /* Approve the swapper contract to spend weth9 for me */
    await WETH.approve(assetManagerAddress, hre.ethers.parseEther('1'));
    console.log('Approved the assetManager contract to spend weth9');

    /* Execute the swap */
    const amountIn = hre.ethers.parseEther('0.1');
    const swap = await assetManager.swapWETHForDAI(amountIn, {
      gasLimit: 300000,
    });
    swap.wait();
    console.log('Swap complete');

    /* Check DAI end balance */
    const expandedDAIBalanceAfter = await DAI.balanceOf(signers[0].address);
    const DAIBalanceAfter = Number(
      hre.ethers.formatUnits(expandedDAIBalanceAfter, DAI_DECIMALS)
    );
    console.log('DAIBalanceAfter:', DAIBalanceAfter);

    /* Test that we now have more DAI than when we started */
    expect(DAIBalanceAfter).is.greaterThan(DAIBalanceBefore);
  });
});
