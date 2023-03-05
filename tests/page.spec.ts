import { BrowserContext, expect, test as baseTest } from "@playwright/test";
import dappwright, { Dappwright, MetaMaskWallet } from "@tenkeylabs/dappwright/dist";

export const test = baseTest.extend<{
  context: BrowserContext;
  wallet: Dappwright;
}>({
  context: async ({}, use) => {
    // Launch context with the same session from global-setup
    const { browserContext, wallet } = await dappwright.launch("", {
      wallet: "metamask",
      version: MetaMaskWallet.recommendedVersion,
    });

    // Switch to locally running node
    await wallet.switchNetwork("Localhost 8545");
    // await wallet.addNetwork({
    //   networkName: "Localhost 8545",
    //   rpc: "http://localhost:8545",
    //   chainId: 31337,
    //   symbol: "ETH",
    // });

    await use(browserContext);
    await browserContext.close();
  },
  wallet: async ({ context }, use) => {
    const wallet = await dappwright.getWallet("metamask", context);

    await use(wallet);
  },
});

test.describe("start", () => {
  test.beforeEach(async ({ page }) => {
    dappwright.bootstrap("", {
      wallet: "metamask",
      version: MetaMaskWallet.recommendedVersion,
    });
    await page.goto("http://127.0.0.1:5173/");
  });

  test("something", async ({ page }) => {
    expect(await page.title()).toBe("Vite + TS");
  });
});
