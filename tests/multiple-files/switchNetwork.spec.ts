import { expect } from "@playwright/test";
import { test } from "./helpers/walletTest";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8080");
});

test("should be on the correct network", async ({ page }) => {
  const networkSwitchStatus = await page.inputValue("#network-switch-status");

  expect(networkSwitchStatus).toEqual("31337");
});
