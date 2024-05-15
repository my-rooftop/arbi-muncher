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

 
  //--------- estimate --------//

  let wethBalance = await weth.balanceOf(arbimuncherAddress);
  let usdcBalance = await usdc.balanceOf(arbimuncherAddress);

  let margin = await arbiMuncher.estimateTradeUniToGmx(wethAddress, usdcAddress, wethBalance);
  let margin2 = await arbiMuncher.estimateTradeGmxToUni(usdcAddress, wethAddress, usdcBalance);
  console.log("margin:", margin, margin2);

//   let amount = await arbiMuncher.connect(deployer).swapUniOwner(wethAddress, usdcAddress, wethBalance);
//   console.log(amount);
    console.log(usdcBalance);
    let amount = await arbiMuncher.connect(deployer).swapGmxOwner(wethAddress, usdcAddress, wethBalance);
    await amount.wait();
    console.log(amount);

}

// 배포 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
