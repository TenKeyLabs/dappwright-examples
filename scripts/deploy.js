// Deploys Counter to the local chain and writes the address + ABI the dApp imports.
//
// Run `pnpm chain` in another terminal first. The dApp reads src/counterContract.json at build
// time, so re-run `pnpm build` (or `pnpm dev`) afterwards to pick up a new address.
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { ethers } from "ethers";

const RPC_URL = "http://localhost:8545";
const MNEMONIC = "test test test test test test test test test test test junk";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactPath = path.join(root, "artifacts", "contracts", "Counter.sol", "Counter.json");
const outputPath = path.join(root, "src", "counterContract.json");

const artifact = JSON.parse(await readFile(artifactPath, "utf8"));

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = ethers.Wallet.fromPhrase(MNEMONIC).connect(provider);

const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
const contract = await factory.deploy();
await contract.waitForDeployment();

const address = await contract.getAddress();
await writeFile(outputPath, `${JSON.stringify({ abi: artifact.abi, address }, null, 2)}\n`);

console.log(`Counter deployed at ${address}`);
console.log(`Wrote ${path.relative(root, outputPath)}`);
