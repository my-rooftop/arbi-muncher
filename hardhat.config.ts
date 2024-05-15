import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    polygon: {
      url: process.env.POLYGON_URL || "https://polygon-rpc.com",
      accounts: process.env.privateKey ? [process.env.privateKey] : [],
    },
    arbitrum: {
      url: process.env.ARBITRUM_URL || "https://arb1.arbitrum.io/rpc",
      accounts: process.env.privateKey ? [process.env.privateKey] : [],
    },
    gnosis: {
      url: process.env.GNOSIS_URL || "https://rpc.gnosischain.com",
      accounts: process.env.privateKey ? [process.env.privateKey] : [],
    },
    hardhat: {
      forking: {
        url: "https://arb1.arbitrum.io/rpc",
        blockNumber: 211435038,
      },
      blockGasLimit: 0x1fffffffffff,
      gasPrice: 0,
      initialBaseFeePerGas: 0,
      allowUnlimitedContractSize: true,
      hardfork: "london",
    }
  },
};

export default config;
