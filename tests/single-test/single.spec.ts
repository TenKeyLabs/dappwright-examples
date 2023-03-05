import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright";

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    // Launch context with extension
    const [wallet, _, context] = await dappwright.bootstrap("", {
      wallet: "metamask",
      version: MetaMaskWallet.recommendedVersion,
      seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
    });

    // Add Hardhat as a custom network
    await wallet.addNetwork({
      networkName: "Hardhat",
      rpc: "http://localhost:8546",
      chainId: 31337,
      symbol: "ETH",
    });

    await use(context);
    await context.close();
  },

  wallet: async ({ context }, use) => {
    const metamask = await dappwright.getWallet("metamask", context);

    await use(metamask);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be able to connect", async ({ wallet, page }) => {
  await page.click("#connect-button");
  await wallet.approve();

  const connectStatus = await page.inputValue("#connect-status");
  const networkSwitchStatus = await page.inputValue("#network-switch-status");

  expect(connectStatus).toEqual("connected");
  expect(networkSwitchStatus).toEqual("31337");
});
