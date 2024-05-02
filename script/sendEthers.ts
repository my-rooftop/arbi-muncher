import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  // 보낼 계정의 개인 키
  const privateKey = process.env.privateKey || "";
  // 보낼 계정의 개인 키로부터 Wallet 생성
  const senderWallet = new ethers.Wallet(privateKey, ethers.provider);

  // 수신 계정 주소
  const recipientAddress = "0x4a1162E06f6E097b50759C52dd5eE82fc6Fd0D7F";
  
  // 이더를 수신 계정으로 보내기
  const tx = await senderWallet.sendTransaction({
    to: recipientAddress,
    value: ethers.parseEther("0.000001"), // 1 ETH 전송
  });

  console.log("Transaction hash:", tx.hash);

  // 트랜잭션의 해시를 이용하여 블록체인에서 해당 트랜잭션을 확인
  const txReceipt = await tx.wait();
  console.log("Transaction receipt:", txReceipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error sending ether:", error);
    process.exit(1);
  });
