import { expect, test as baseTest } from "@playwright/test";
import { bootstrap, Dappwright, getWallet, MetaMaskWallet, OfficialOptions } from "@tenkeylabs/dappwright";
import { BrowserContext } from "playwright-core";
import { addLocalNetwork } from "../helpers/localNetwork.js";

// Running the same spec against more than one wallet.
//
// Each wallet is a Playwright project carrying its options in `metadata` (see
// playwright.config.ts), so the fixture below is wallet-agnostic - it just reads whichever
// project it is running under.
export const test = baseTest.extend<{ wallet: Dappwright }, { walletContext: BrowserContext }>({
  walletContext: [
    async ({}, use, testInfo) => {
      const metadata = testInfo.project.metadata as OfficialOptions;

      const [wallet, , context] = await bootstrap("", {
        ...metadata,
        headless: testInfo.project.use.headless,
      });

      // Both projects import the same seed, so they drive the same address on the shared chain.
      // That is fine here because nothing in this spec transacts. Once a test does send
      // transactions, give each project its own derived account (`wallet.switchAccount`) so the
      // two don't collide on a nonce.
      //
      // Note that switchAccount matches on the account's *displayed* name. Use a private seed
      // if you rely on it - Coinbase resolves well-known addresses (such as the ones Hardhat's
      // default mnemonic derives) to their registered .cb.id names rather than "Address N".

      // Coinbase Wallet ships with the local network already configured; MetaMask needs it added.
      if (wallet instanceof MetaMaskWallet) await addLocalNetwork(wallet);

      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],

  context: async ({ walletContext }, use) => {
    await use(walletContext);
  },

  wallet: async ({ walletContext }, use, testInfo) => {
    const { wallet } = testInfo.project.metadata as OfficialOptions;
    await use(await getWallet(wallet, walletContext));
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
