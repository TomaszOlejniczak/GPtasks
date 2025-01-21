import { test, expect } from '@playwright/test';

test('TC-04', async ({ page }) => {
  // Go to starting address
  await page.goto('https://devtest.giganciprogramowania.edu.pl/zapisz-sie');

  // Track if the request is sent
  let requestSent = false;
  page.on('request', (request) => {
    if (request.url().includes('/api/Lead/CreateRegistrationFormLead') && request.method() === 'POST') {
      requestSent = true;
    }
  });

  // Function to fill the form fields
  const fillFormField = async (selector: string, value: string) => {
    const field = page.locator(selector);
    await field.click();
    await field.fill(value);
  };

  // Function to click the "Dalej" button
  const clickNextButton = async () => {
    await page.getByRole('button', { name: 'Dalej' }).click();
  };

  // Fill the form with valid data
  await fillFormField('input[name="parentName"]', 'Artur');
  await fillFormField('input[name="email"]', 'karolgiganci+fakedata80696@gmail.com');
  await fillFormField('input[name="phoneNumber"]', '123456651');
  await fillFormField('input[name="birthYear"]', '2005');
  await page.locator('label').filter({ hasText: 'Akceptuję regulamin oraz' }).locator('span').first().click();
  await page.locator('label').filter({ hasText: 'Wyrażam zgodę na otrzymywanie' }).locator('span').first().click();

  // Confirm the form
  await clickNextButton();

  // Wait for in case of slowed connection
  await page.waitForTimeout(2000);

  // Ensure that the tick icon is visible, indicating successful completion
  const tickIcon = page.locator('svg.feature_registration-menu__item-tick.icon.icon-tick').first();
  await expect(tickIcon).toBeVisible();

  // Check if the request has been sent
  expect(requestSent).toBe(true);
});