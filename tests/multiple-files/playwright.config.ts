import { defineConfig } from "@playwright/test";

export default defineConfig({
  // One worker so every spec file lands on the same worker and shares the wallet the
  // worker-scoped fixture builds (see helpers/walletTest.ts).
  workers: 1,
  timeout: 120000,
  // MetaMask's add-network flow is occasionally flaky (see tests/helpers/localNetwork.ts). A
  // retry rebuilds the wallet from a fresh profile, which clears it.
  retries: process.env.CI ? 2 : 1,
  webServer: [
    {
      command: "yarn preview --port 8080",
      url: "http://localhost:8080",
      timeout: 120000,
      reuseExistingServer: true,
    },
    {
      command: "yarn chain",
      url: "http://localhost:8545",
      timeout: 120000,
      reuseExistingServer: true,
    },
  ],
});
