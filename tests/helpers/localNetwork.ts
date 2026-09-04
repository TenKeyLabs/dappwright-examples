import { Dappwright } from "@tenkeylabs/dappwright";

// MetaMask validates a custom network's name against its own chain list and rejects a mismatch.
// Chain id 31337 - the id Hardhat's node uses - is GoChain Testnet in that list, so that is the
// name the network has to be added under.
export const localNetwork = {
  networkName: "GoChain Testnet",
  rpc: "http://localhost:8545",
  chainId: 31337,
  symbol: "GO",
};

/**
 * Add the local chain to MetaMask and switch to it.
 *
 * Coinbase Wallet ships with the local network already configured and does not need this.
 *
 * Note: MetaMask's add-network flow is occasionally flaky - the form can fail to complete, or the
 * switch dAppwright performs on the way out can race the confirmation dialog that follows a save.
 * The configs set `retries` for that reason. A retry rebuilds the worker fixture against a fresh
 * profile, which is a cleaner recovery than trying to unpick a half-finished form.
 */
export const addLocalNetwork = async (wallet: Dappwright): Promise<void> => {
  await wallet.addNetwork(localNetwork);
};
