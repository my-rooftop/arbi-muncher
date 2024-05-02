const { ethers } = require("hardhat");

async function main() {

    const camelotRouterAddress = "0xc873fEcbd354f5A56E00E710B90EF4201db2448d";
    const gmxReaderAddress = "0x22199a49A999c351eF7927602CFB187ec3cae489";
    const gmxRouterAddress = "0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064";
    const vaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
  // 배포에 사용할 계정 가져오기
  const [deployer] = await ethers.getSigners();

  // 배포할 스마트 계약 인스턴스 생성
  const ContractToDeploy = await ethers.getContractFactory("ArbiMuncher");

  console.log("Deploying contracts with the account:", deployer.address);

  // 스마트 계약 배포
  const contract = await ContractToDeploy.deploy(gmxRouterAddress, gmxReaderAddress, vaultAddress, camelotRouterAddress);
  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());


  //---------//
  const tokenIn = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
  const tokenMiddle = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";


  const amount = ethers.parseEther("1");

  const uniMinAmountOut = await contract.getAmountOutMin(tokenIn, tokenMiddle, amount);
  console.log("UniSwap Minimum Amount Out:", uniMinAmountOut);

  // GMX에서의 최소 수량 조회
  const gmxMinAmountOut = await contract.getAmountOutMinGmx(tokenIn, tokenMiddle, amount);
  console.log("GMX Minimum Amount Out:", gmxMinAmountOut);
}

// 배포 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
