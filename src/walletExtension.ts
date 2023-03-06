import { ethers } from "ethers";
import { Eip1193Provider, Provider } from "ethers/types/providers";
import counterContract from "./counterContract.json";

declare global {
  interface Window {
    ethereum: Eip1193Provider & Provider;
  }
}

export async function init() {
  let contractInstance: any;
  let accounts: any;

  const provider = new ethers.BrowserProvider(window.ethereum);

  const connectButton = document.querySelector("#connect-button")!;
  const switchNetworkButton = document.querySelector("#switch-network-button")!;
  const signMsgButton = document.querySelector("#sign-msg-button")!;
  const transferFundsButton = document.querySelector("#transfer-funds-button")!;
  const callContractButton = document.querySelector("#call-contract-button")!;

  const connectStatus = document.querySelector<HTMLInputElement>("#connect-status")!;
  const networkSwitchStatus = document.querySelector<HTMLInputElement>("#network-status")!;
  const signMsgStatus = document.querySelector<HTMLInputElement>("#sign-msg-status")!;
  const transferFundsStatus = document.querySelector<HTMLInputElement>("#transfer-funds-status")!;
  const callContractStatus = document.querySelector<HTMLInputElement>("#call-contract-status")!;

  window.ethereum.on("chainChanged", function (chainId) {
    // Coinbase Wallet returns chainid as Int while Metamask returns a Hex
    const parsedChainId = Number.isInteger(chainId) ? parseInt(chainId).toString() : parseInt(chainId, 16).toString();
    networkSwitchStatus.value = parsedChainId;
  });

  connectButton.addEventListener("click", async function () {
    accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    contractInstance = new ethers.Contract(
      counterContract.address,
      counterContract.abi,
      await provider.getSigner(accounts[0])
    );

    connectStatus.value = "connected";
  });

  networkSwitchStatus.value = parseInt(await window.ethereum.request({ method: "eth_chainId" })).toString();
  switchNetworkButton.addEventListener("click", async function () {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7A69" }],
    });
  });

  signMsgButton.addEventListener("click", async function () {
    const accounts = await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner(accounts[0]);
    await signer.signMessage("TEST");
    signMsgStatus.value = "signed";
  });

  callContractButton.addEventListener("click", async function () {
    if (!contractInstance) {
      callContractStatus.value = "connect first";
      return;
    }
    await contractInstance.increase({ from: accounts[0] });
    callContractStatus.value = "call executed";
  });

  transferFundsButton.addEventListener("click", async function () {
    const accounts = await provider.send("eth_requestAccounts", []);
    await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [{ to: accounts[0], from: accounts[0], value: "10000000000000000" }],
    });

    transferFundsStatus.value = "transferred";
  });
}
