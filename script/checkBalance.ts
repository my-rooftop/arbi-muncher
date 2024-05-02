import hre from "hardhat";

async function main() {
  // 폴리곤 네트워크에 연결
  const provider = hre.ethers.provider;
  
  // 조회할 지갑 주소
  const walletAddress = "0x9836C0AA45f64DDc852A675858EBB59213F7aA82";

  // 지갑 주소에서 잔고 조회
  const balance = await provider.getBalance(walletAddress);

  console.log(`폴리곤 잔고: ${balance} matic`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("잔고 조회 중 오류 발생:", error);
    process.exit(1);
  });
