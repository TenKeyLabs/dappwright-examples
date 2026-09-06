import { defineConfig } from "@playwright/test";
import { CoinbaseWallet, MetaMaskWallet } from "@tenkeylabs/dappwright";

const seed = "test test test test test test test test test test test junk"; // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts

export default defineConfig({
  // Fetch both extensions before any worker starts, so a cold cache doesn't eat a test timeout.
  globalSetup: "./globalSetup.ts",
  timeout: 120000,
  // MetaMask's add-network flow is occasionally flaky (see tests/helpers/localNetwork.ts). A
  // retry rebuilds the wallet from a fresh profile, which clears it.
  retries: process.env.CI ? 2 : 1,
  webServer: [
    {
      command: "pnpm preview --port 8080",
      url: "http://localhost:8080",
      timeout: 120000,
      reuseExistingServer: true,
    },
    {
      command: "pnpm chain",
      url: "http://localhost:8545",
      timeout: 120000,
      reuseExistingServer: true,
    },
  ],
  projects: [
    {
      name: "MetaMask",
      // One worker per project, but the two projects still run alongside each other. dAppwright
      // coordinates concurrent extension downloads, so the wallets no longer have to be
      // serialised against each other - only the specs within a project share a wallet.
      workers: 1,
      metadata: {
        wallet: "metamask",
        version: MetaMaskWallet.recommendedVersion,
        seed,
      },
    },
    {
      name: "Coinbase",
      workers: 1,
      metadata: {
        wallet: "coinbase",
        version: CoinbaseWallet.recommendedVersion,
        seed,
      },
    },
  ],
});
