const { ethers } = require("hardhat");
const IERC20 = require("../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
import * as dotenv from "dotenv";
import {wethAddress, usdcAddress, arbimuncherAddress} from "./config/config";

dotenv.config();

async function main() {
  const privateKey = process.env.privateKey || "";
  const deployer = new ethers.Wallet(privateKey, ethers.provider);

  let tx;

  const weth = new ethers.Contract(wethAddress, IERC20.abi, deployer.provider);
  const usdc = new ethers.Contract(usdcAddress, IERC20.abi, deployer.provider);

  
 //deposit to arbitrage contract
  let wethBalance = await weth.balanceOf(deployer.address);
  let usdcBalance = await usdc.balanceOf(deployer.address);

  tx = await weth.connect(deployer).transfer(ethers.Typed.address(arbimuncherAddress), wethBalance);
  await tx.wait();
  tx = await usdc.connect(deployer).transfer(ethers.Typed.address(arbimuncherAddress), usdcBalance);
  await tx.wait();
  let muncherWethBalance = await weth.balanceOf(arbimuncherAddress);
  let muncherUsdcBalance = await usdc.balanceOf(arbimuncherAddress);

  if(wethBalance == muncherWethBalance && usdcBalance == muncherUsdcBalance) {
    console.log("deposit success")
  } 

}

// 배포 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
