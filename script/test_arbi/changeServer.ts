const { ethers } = require("hardhat");
const IERC20 = require("../../artifacts/contracts/interfaces/IERC20.sol/IERC20.json");
const ArbiMuncher = require("../../artifacts/contracts/ArbiMuncher.sol/ArbiMuncher.json");
import {arbimuncherAddress} from "./config/config";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const privateKey = process.env.privateKey || "";
    const deployer = new ethers.Wallet(privateKey, ethers.provider);

    let tx;

    const arbiMuncher = new ethers.Contract(arbimuncherAddress, ArbiMuncher.abi, deployer.provider);


    const newServer = "0x9836C0AA45f64DDc852A675858EBB59213F7aA82";
    tx = await arbiMuncher.connect(deployer).changeServerAddress(newServer);
    await tx.wait();
    
    let server = await arbiMuncher.server();
    
    if(server == newServer) {
        console.log("server change success");
    }

}

// 배포 스크립트 실행
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
