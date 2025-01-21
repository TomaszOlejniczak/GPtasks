import { test, expect } from '@playwright/test';
import { FormFillPage } from '../pages/formFill.page.ts';

test('TC-02', async ({ page }) => {
  const formPage = new FormFillPage(page);

  // Go to starting address
  await formPage.goToUrl();

  // Track if the request is sent
  formPage.trackRequest();

  // Function to fill the email field
  const fillEmailField = async (email: string) => {
    const emailField = page.locator('input[name="email"]');
    await emailField.click();
    await emailField.fill(email);
  };

  // Fill the form with an invalid email
  await fillEmailField('user#example.com');

  // Confirm the form
  await formPage.clickNextButton();

  // Expect error message for invalid email and unfilled fields
  await expect(page.getByText('Nieprawidłowy adres e-mail')).toBeVisible();
  await expect(formPage.allFieldsError).toBeVisible();

  // Wait for in case of slowed connection
  await page.waitForTimeout(2000);

  // Check if the request has been sent
  expect(formPage.isRequestSent()).toBe(false);

  // Ensure that it stays on the initial view
  await expect(formPage.fillTheData).toBeVisible();
});

