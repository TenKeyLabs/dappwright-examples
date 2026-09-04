/** @type import('hardhat/config').HardhatUserConfig */
export default {
  solidity: '0.8.28',
  networks: {
    // Hardhat 3 requires each network to declare how it is backed, and no longer reserves a
    // network named "hardhat" - the node is started with `--network chain`
    chain: {
      type: 'edr-simulated',
      chainId: 31337,
      accounts: {
        // Hardhat's default test mnemonic. This must stay in sync with the seed the wallets
        // import in the test configs - the dapp and the wallets have to agree on which
        // accounts exist and are funded.
        mnemonic: 'test test test test test test test test test test test junk',
        accountsBalance: '10000000000000000000000',
      },
      loggingEnabled: false,
    },
  },
};
