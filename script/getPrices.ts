import { ethers } from "hardhat";

const reader_abi = require("../artifacts/contracts/interfaces/gmx/IGmxReader.sol/IGmxReader.json");
const unirouter_abi = require("../artifacts/contracts/interfaces/camelot/IRouter.sol/IUniswapV2Router.json");

async function main() {
    
    // Reader 컨트랙트 주소
    const readerAddress = "0x22199a49A999c351eF7927602CFB187ec3cae489";
    const camelotRouterAddress = "0xc873fEcbd354f5A56E00E710B90EF4201db2448d";
    
    // Hardhat 또는 Ethers.js provider로부터 계정 가져오기
    const [deployer] = await ethers.getSigners();
    
    // IReader.sol 컨트랙트 인스턴스 생성
    const readerContract = new ethers.Contract(
        readerAddress,
        reader_abi.abi,
        deployer
    );

    const routerContract = new ethers.Contract(
        camelotRouterAddress,
        unirouter_abi.abi,
        deployer
    );

    // 조회할 정보 입력
    const vaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
    const tokenInAddress = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1";
    const tokenOutAddress = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
    const amountIn = ethers.parseEther("1"); // 1 이더를 원하는 경우

    // getAmountOut 함수 호출
    const [daOut, fee] = await readerContract.getAmountOut(
        vaultAddress,
        tokenInAddress,
        tokenOutAddress,
        amountIn
    );

    const [daiIn, ethIn] = await routerContract.getAmountsOut(daOut, [tokenOutAddress, tokenInAddress]);

    console.log("dai Out:", daOut.toString()); 
    console.log("eth In:", ethIn.toString());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error:", error);
    process.exit(1);
});
