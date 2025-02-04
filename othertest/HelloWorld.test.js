const { expect } = require('chai');
const hre = require('hardhat');
require('@nomicfoundation/hardhat-toolbox/network-helpers');

describe('HelloWorld', function () {
  it('Should print a hello world greeting', async function () {
    /* Deploy the helloWorld contract */
    const helloWorldFactory = await ethers.getContractFactory('HelloWorld');
    const helloWorld = await helloWorldFactory.deploy('World!');
    // await helloWorld.deployed();

    // const helloWorld = await hre.ethers.deployContract('HelloWorld', [message], {
    //   value: 'World!',
    // });

    const greeting = await helloWorld.greet();
    expect(greeting).is.equal('Hello World!');
  });
});

// const lock = await hre.ethers.deployContract('Lock', [unlockTime], {
//   value: lockedAmount,
// });
