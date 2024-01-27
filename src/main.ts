import "./style.css";
import { init } from "./walletExtension";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://playwright.dev/" target="_blank">
      <img src="/playwright.png" class="logo" alt="Playwright logo" />
    </a>
    <a href="https://www.coinbase.com/wallet/" target="_blank">
      <img src="/coinbase.png" class="logo" alt="Playwright logo" />
    </a>
    <a href="https://metamask.io/" target="_blank">
      <img src="/metamask.webp" class="logo" alt="Playwright logo" />
    </a>
    <h1>dAppwright test dApp</h1>
    <div class="card">
    <div>
      <button id="connect-button">Connect Wallet</button>
      <br>
      <input disabled id="connect-status" data-testid="connect-status"></input>
    </div>
    <div>
      <button id="switch-network-button">Switch Network</button>
      <br>
      <input disabled id="network-status" data-testid="network-status"></input>
    </div>
    <div>
      <button id="sign-msg-button">Sign Message</button>
      <br>
      <input disabled id="sign-msg-status" data-testid="sign-msg-status"></input>
    </div>
    <div>
      <button id="call-contract-button">Call Contract</button>
      <br>
      <input disabled id="call-contract-status" data-testid="call-contract-status"></input>
    </div>
    <div>
      <button id="transfer-funds-button">Transfer Funds</button>
      <br>
      <input disabled id="transfer-funds-status" data-testid="transfer-funds-status"></input>
    </div>
    </div>
    <!--
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    -->
  </div>
`;

init();
