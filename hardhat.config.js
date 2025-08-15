require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = "7a144970df587be6707097ac06cb092182d32ce6d30b15d9f2df8c4200ce897f";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    monadTestnet: {
      url: "https://testnet-rpc.monad.xyz",
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 10143,
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      monadTestnet: "dummy", // Monad testnet doesn't require API key
    },
    customChains: [
      {
        network: "monadTestnet",
        chainId: 10143,
        urls: {
          apiURL: "https://testnet.monadexplorer.com/api",
          browserURL: "https://testnet.monadexplorer.com",
        },
      },
    ],
  },
};

