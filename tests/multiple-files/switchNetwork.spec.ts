import { expect } from "@playwright/test";
import { test } from "./helpers/walletTest.js";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be on the correct network", async ({ page }) => {
  await page.click("#switch-network-button");

  const networkStatus = page.getByTestId("network-status");
  expect(networkStatus).toHaveValue("31337");
});
