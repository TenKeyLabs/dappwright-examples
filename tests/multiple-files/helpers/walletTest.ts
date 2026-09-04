import { test as baseTest } from "@playwright/test";
import { bootstrap, Dappwright, getWallet, MetaMaskWallet } from "@tenkeylabs/dappwright";
import { BrowserContext } from "playwright-core";
import { addLocalNetwork } from "../../helpers/localNetwork.js";

// Sharing one wallet across several spec files.
//
// The wallet context is worker-scoped, so Playwright builds it once per worker and every spec
// file that runs on that worker reuses it. Pair this with `workers: 1` in the config (see
// playwright.config.ts) and the whole suite bootstraps a single wallet.
//
// This used to require stashing the context in a module-level variable, because a test-scoped
// fixture is torn down between files. Worker scope is the supported way to do it now - the
// fixture below is the whole mechanism.
export const test = baseTest.extend<{ wallet: Dappwright }, { walletContext: BrowserContext }>({
  walletContext: [
    async ({}, use) => {
      const [wallet, , context] = await bootstrap("", {
        wallet: "metamask",
        version: MetaMaskWallet.recommendedVersion,
        seed: "test test test test test test test test test test test junk", // Hardhat's default https://hardhat.org/hardhat-network/docs/reference#accounts
      });

      await addLocalNetwork(wallet);

      await use(context);
      await context.close();
    },
    { scope: "worker" },
  ],

  context: async ({ walletContext }, use) => {
    await use(walletContext);
  },

  wallet: async ({ walletContext }, use) => {
    const wallet = await getWallet("metamask", walletContext);
    await use(wallet);
  },
});
