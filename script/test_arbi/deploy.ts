const { ethers } = require("hardhat");
const IERC20 = require("../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
import * as dotenv from "dotenv";
import {camelotRouterAddress, gmxReaderAddress, gmxRouterAddress, vaultAddress, wethAddress, usdcAddress, serverAddress} from "./config/config";

dotenv.config();

async function main() {
  const privateKey = process.env.privateKey || "";
  const deployer = new ethers.Wallet(privateKey, ethers.provider);

  let tx;
  let arbimuncherAddress;

  const weth = new ethers.Contract(wethAddress, IERC20.abi, deployer.provider);
  const usdc = new ethers.Contract(usdcAddress, IERC20.abi, deployer.provider);

 

  // 배포할 스마트 계약 인스턴스 생성
  const ContractToDeploy = await ethers.getContractFactory("ArbiMuncher");

  console.log("Deploying contracts with the account:", deployer.address);

  // 스마트 계약 배포
  const contract = await ContractToDeploy.deploy(gmxRouterAddress, gmxReaderAddress, vaultAddress, camelotRouterAddress, serverAddress);
  await contract.waitForDeployment();
  arbimuncherAddress = await contract.getAddress();
  console.log("Contract deployed to:", arbimuncherAddress);

}

// 배포 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
