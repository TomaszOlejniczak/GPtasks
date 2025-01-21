import { test, expect } from '@playwright/test';
import { FormFillPage } from '../pages/formFill.page.ts';

test('TC-01', async ({ page }) => {
  const formPage = new FormFillPage(page);

  // Go to starting address
  await formPage.goToUrl();

  // Track if the request is sent
  formPage.trackRequest();

  // Confirm the form without filling it
  await formPage.clickNextButton();

  // Expect main blank form message and 6 blank fields messages for each unfilled field
  const requiredFieldMessagesCount = await formPage.getRequiredFieldMessagesCount();
  expect(requiredFieldMessagesCount).toBe(6);

  // Confirm the form again
  await formPage.clickNextButton();

  // Expect error message for unfilled fields
  await expect(formPage.allFieldsError).toBeVisible();

  // Wait for in case of slowed connection
  await page.waitForTimeout(2000);

  // Check if the request has been sent
  expect(formPage.isRequestSent()).toBe(false);

  // Ensure that it stays on the initial view
  await expect(formPage.fillTheData).toBeVisible();
});