import { FullConfig } from "@playwright/test";
import { CoinbaseWallet, MetaMaskWallet, OfficialOptions } from "@tenkeylabs/dappwright";

const walletTypes = {
  metamask: MetaMaskWallet,
  coinbase: CoinbaseWallet,
};

/**
 * Download every project's wallet extension before any worker starts.
 *
 * Workers download on demand if you skip this, but then a cold cache has to finish inside a
 * test's timeout while the rest of the suite competes for the machine. Fetching up front keeps
 * that cost out of the tests and leaves each worker with nothing to do but read the cache.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const downloads = config.projects.map(async (project) => {
    const options = project.metadata as OfficialOptions;
    const wallet = walletTypes[options.wallet];
    if (wallet) await wallet.download(options);
  });

  await Promise.all(downloads);
}
