# dAppwright Examples

This is a test dApp that shows the different ways you can integrate [dAppwright](https://github.com/TenKeyLabs/dappwright) into your test suite.

You can find the different configurations in the [tests folder](https://github.com/TenKeyLabs/dappwright-examples/tree/main/tests):

| Example                                      | Shows                                                                               |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`single-test`](tests/single-test)           | The smallest working setup - one spec file, one wallet                              |
| [`multiple-files`](tests/multiple-files)     | Sharing a single wallet across several spec files                                   |
| [`multiple-wallets`](tests/multiple-wallets) | Running the same spec against MetaMask and Coinbase as parallel Playwright projects |

## Requirements

Node 22 or newer (see `.nvmrc`), which is what dAppwright itself requires.

## Installation

```bash
git clone https://github.com/TenKeyLabs/dappwright-examples.git
cd dappwright-examples
nvm use
yarn install
```

## Running the examples

Run all of them:

```bash
yarn test:all
```

Or one at a time:

```bash
yarn test:single-test
yarn test:multiple-files
yarn test:multiple-wallets
```

Each config starts the dApp and a local chain for you via Playwright's `webServer`, so there is
nothing to launch first.

### Watching a run

```bash
yarn test:single-test --headed
yarn test:single-test --debug   # step through it
```

## Testing against a local dAppwright checkout

To try these examples against unreleased dAppwright changes rather than the published package:

```bash
cd ../dappwright && yarn build && yarn link
cd ../dappwright-examples && yarn link @tenkeylabs/dappwright
```

To go back to the published version:

```bash
yarn unlink @tenkeylabs/dappwright && yarn install --force
```
