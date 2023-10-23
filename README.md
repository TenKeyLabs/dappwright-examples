# dAppwright Examples

This is a test dApp that shows the different ways you can integrate [dAppwright](https://github.com/TenKeyLabs/dappwright) into your test suite.

You can find the different conifurations in the [tests folder](https://github.com/TenKeyLabs/dappwright-examples/tree/main/tests) which includes examples setups for...

- single test
- multiple files
- multiple wallets

## Installation

```bash
git clone https://github.com/TenKeyLabs/dappwright-examples.git
cd dappwright-examples
yarn install
```

## Running the examples

You can run all of the examples with any of these commands

```bash
  yarn test:all
```

Or you can specify an example configuration with...

```bash
  yarn test:single-test
  yarn test:multiple-files
  yarn test:multiple-wallets
```

## Running the dApp

In order to run the test dApp, it requires running both the application and local blockchain which requires two terminal sessions.

```bash
  yarn dev # first terminal
  yarn chain # second terminal
```
