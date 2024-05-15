const { ethers } = require("hardhat");
const IERC20 = require("../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const ArbiMuncher = require("../../artifacts/contracts/ArbiMuncher.sol/ArbiMuncher.json");
import {wethAddress, usdcAddress, arbimuncherAddress} from "./config/config";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const privateKey = process.env.privateKey || "";
  const deployer = new ethers.Wallet(privateKey, ethers.provider);

  let tx;

  const weth = new ethers.Contract(wethAddress, IERC20.abi, deployer.provider);
  const usdc = new ethers.Contract(usdcAddress, IERC20.abi, deployer.provider);
  const arbiMuncher = new ethers.Contract(arbimuncherAddress, ArbiMuncher.abi, deployer.provider);

  
 //deposit to arbitrage contract
  tx = await arbiMuncher.connect(deployer).recoverTokens([wethAddress, usdcAddress]);
  await tx.wait();

  let wethBalance = await weth.balanceOf(arbimuncherAddress);
  let usdcBalance = await weth.balanceOf(arbimuncherAddress);

  if(wethBalance == 0 && usdcBalance == 0) {
    console.log("recover success");
  }

}

// 배포 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
