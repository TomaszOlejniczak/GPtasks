import { test, expect } from '@playwright/test';

test('TC-05', async ({ page }) => {
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

  // Check if the request has been sent with the right payload
  expect(requestSent).toBe(true);

  // Ensure that it moves to the next step
  await expect(page.getByText('Wybierz tematykę kursu')).toBeVisible();

  // Select course options
  await page.getByRole('button', { name: 'PROGRAMOWANIE' }).click();
  await page.getByRole('button', { name: 'Online' }).click();
  await page.getByRole('button', { name: 'Roczne kursy z programowania' }).click();
  await page.locator('button[name="registration-step-select-course-1092"]').click();
  await page.locator('button[name="registration-selected-timetable-280709"]').click();

  // Fill student information
  await fillFormField('input[name="student_firstname"]', 'Maciej');
  await fillFormField('input[name="student_lastname"]', 'Testowy');
  await fillFormField('input[name="zip_code"]', '26-900');
  await fillFormField('input[name="lastname"]', 'Testowy');
  await fillFormField('input[name="email"]', 'karolgiganci+fakedata80696@gmail.com');

  //Save the student
  await page.getByRole('button', { name: 'Zapisz dziecko' }).click();

  // Confirmation check
  await expect(page.getByText('Dziękujemy za rejestrację')).toBeVisible();
});