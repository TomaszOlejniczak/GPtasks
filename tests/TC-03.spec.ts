import { test, expect } from '@playwright/test';
import { FormFillPage } from '../pages/formFill.page.ts';

test('TC-03', async ({ page }) => {
  const formPage = new FormFillPage(page);

  // Go to starting address
  await formPage.goToUrl();

  // Track if the request is sent
  formPage.trackRequest();

  // Fill the form with an invalid phone number
  await formPage.fillPhoneNumberField('12345665');

  // Confirm the form
  await formPage.clickNextButton();

  // Expect wrong phone number and blank fields message
  await page.waitForTimeout(2000);
  await formPage.clickNextButton();
  await expect(page.getByText('Niepoprawny numer telefonu. Numer powinien zawierać 9 cyfr, z opcjonalnym kierunkowym +48 lub +380 na początku.')).toBeVisible();
  await expect(formPage.allFieldsError).toBeVisible();

  // Wait for in case of slowed connection
  await page.waitForTimeout(2000);

  // Check if the request has been sent
  expect(formPage.isRequestSent()).toBe(false);

  // Ensure that it stays on the initial view
  await expect(formPage.fillTheData).toBeVisible();
});