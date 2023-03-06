import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet, OfficialOptions } from "@tenkeylabs/dappwright";

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use, testInfo) => {
    // Launch context with extension and playwright project params
    const metadata = testInfo.project.metadata as OfficialOptions;
    const [wallet, _, context] = await dappwright.bootstrap("", {
      ...metadata,
      headless: testInfo.project.use.headless,
    });

    // Coinbase Wallet already this network set.
    if (wallet instanceof MetaMaskWallet) {
      // Add Hardhat as a custom network.
      await wallet.addNetwork({
        networkName: "Hardhat",
        rpc: "http://localhost:8546",
        chainId: 31337,
        symbol: "ETH",
      });
    }

    await use(context);
  },

  wallet: async ({ context }, use, testInfo) => {
    const walletId = testInfo.project.metadata.wallet;
    const metamask = await dappwright.getWallet(walletId, context);

    await use(metamask);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be able to connect", async ({ wallet, page }) => {
  await page.click("#connect-button");
  await wallet.approve();

  const connectStatus = page.getByTestId("connect-status");
  expect(connectStatus).toHaveValue("connected");

  await page.click("#switch-network-button");

  const networkStatus = page.getByTestId("network-status");
  expect(networkStatus).toHaveValue("31337");
});
