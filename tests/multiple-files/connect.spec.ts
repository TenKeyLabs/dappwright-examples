import { expect } from "@playwright/test";
import { test } from "./helpers/walletTest.js";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be able to connect", async ({ wallet, page }) => {
  await page.click("#connect-button");
  await wallet.approve();

  const connectStatus = page.getByTestId("connect-status");
  expect(connectStatus).toHaveValue("connected");
});
