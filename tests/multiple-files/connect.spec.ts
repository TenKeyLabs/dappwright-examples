import { expect } from "@playwright/test";
import { test } from "./helpers/walletTest";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be able to connect", async ({ wallet, page }) => {
  await page.click("#connect-button");
  await wallet.approve();

  const connectStatus = await page.inputValue("#connect-status");

  expect(connectStatus).toEqual("connected");
});
