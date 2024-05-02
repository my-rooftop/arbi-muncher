// const { ethers } = require("hardhat");
// const { expect } = require("chai");

// describe("ArbiMuncher", function () {
//   let arbMuncher:any;

//   // 계약을 배포한 후에 테스트하기 전에 호출됩니다.
//   before(async function () {
//     const ContractToDeploy = await ethers.getContractFactory("ArbiMuncher");
//     const [deployer] = await ethers.getSigners();

//     const camelotRouterAddress = "0xc873fEcbd354f5A56E00E710B90EF4201db2448d";
//     const gmxReaderAddress = "0x22199a49A999c351eF7927602CFB187ec3cae489";
//     const gmxRouterAddress = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064";
//     const vaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";

//     arbMuncher = await ContractToDeploy.deploy(gmxRouterAddress, gmxReaderAddress, vaultAddress, camelotRouterAddress);
//     await arbMuncher.waitForDeployment();
//   });

//   // getAmountOutMin 함수를 테스트합니다.
//   describe("getAmountOutMin", function () {
//     it("should return the minimum amount out for UniSwap", async function () {
//       const tokenIn = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
//       const tokenOut = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
//       const amount = ethers.utils.parseEther("1");

//       const minAmountOut = await arbMuncher.getAmountOutMin(tokenIn, tokenOut, amount);
      
//       // 예상되는 최소 수량은 여기에 기입하세요.
//       const expectedMinAmountOut = ethers.utils.parseEther("0.5");

//       // 예상되는 최소 수량과 실제 계산된 최소 수량이 일치하는지 확인합니다.
//       expect(minAmountOut).to.equal(expectedMinAmountOut);
//     });
//   });

//   // getAmountOutMinGmx 함수를 테스트합니다.
//   describe("getAmountOutMinGmx", function () {
//     it("should return the minimum amount out for GMX", async function () {
//       const tokenIn = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
//       const tokenOut = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
//       const amount = ethers.utils.parseEther("1");

//       const minAmountOut = await arbMuncher.getAmountOutMinGmx(tokenIn, tokenOut, amount);

//       // 예상되는 최소 수량은 여기에 기입하세요.
//       const expectedMinAmountOut = ethers.utils.parseEther("0.5");

//       // 예상되는 최소 수량과 실제 계산된 최소 수량이 일치하는지 확인합니다.
//       expect(minAmountOut).to.equal(expectedMinAmountOut);
//     });
//   });
// });
