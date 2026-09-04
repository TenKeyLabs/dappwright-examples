import { expect, test as baseTest } from "@playwright/test";
import { bootstrap, Dappwright, getWallet, MetaMaskWallet } from "@tenkeylabs/dappwright";
import { BrowserContext } from "playwright-core";
import { addLocalNetwork } from "../helpers/localNetwork.js";

// The simplest setup: one spec file, one wallet.
//
// The wallet context is worker-scoped rather than test-scoped, so the extension is installed
// and unlocked once for the whole worker instead of once per test. Bootstrapping a wallet is
// slow enough that doing it per test dominates the runtime of a suite this size.
export const test = baseTest.extend<{ wallet: Dappwright }, { walletContext: BrowserContext }>({
  walletContext: [
    async ({}, use) => {
      const [wallet, , context] = await bootstrap("", {
        wallet: "metamask",
        version: MetaMaskWallet.recommendedVersion,
        seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
      });

      // Add the local chain as a custom network and switch to it.
      await addLocalNetwork(wallet);

      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],

  // Hand the wallet's context to Playwright so `page` opens in the browser that has the
  // extension installed.
  context: async ({ walletContext }, use) => {
    await use(walletContext);
  },

  wallet: async ({ walletContext }, use) => {
    const wallet = await getWallet("metamask", walletContext);
    await use(wallet);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be able to connect", async ({ wallet, page }) => {
  await page.click("#connect-button");
  await wallet.approve();

  const connectStatus = page.getByTestId("connect-status");
  await expect(connectStatus).toHaveValue("connected");

  await page.click("#switch-network-button");

  const networkStatus = page.getByTestId("network-status");
  await expect(networkStatus).toHaveValue("31337");
});
