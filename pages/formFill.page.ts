import { Page, Locator } from '@playwright/test';

export class FormFillPage {
  private page: Page;
  private requestSent: boolean;
  public allFieldsError: Locator;
  private requiredFieldMessages: Locator;
  public fillTheData: Locator;
  private url: string;

  constructor(page: Page) {
    this.page = page;
    this.requestSent = false;
    this.allFieldsError = this.page.getByText('Prosimy uzupełnić wszystkie wymagane pola.');
    this.requiredFieldMessages = this.page.locator('text=Pole jest wymagane');
    this.fillTheData = this.page.getByText('Wypełnij dane');
    this.url = 'https://devtest.giganciprogramowania.edu.pl/zapisz-sie';
  }

  public trackRequest(): void {
    this.page.on('request', (request) => {
      if (request.url().includes('/api/Lead/CreateRegistrationFormLead') && request.method() === 'POST') {
        this.requestSent = true;
      }
    });
  }

  public isRequestSent(): boolean {
    return this.requestSent;
  }

  public async goToUrl(): Promise<void> {
    await this.page.goto(this.url);
  }

  public async clickNextButton(): Promise<void> {
    await this.page.getByRole('button', { name: 'Dalej' }).click();
  }

  public async getRequiredFieldMessagesCount(): Promise<number> {
    const messages = await this.requiredFieldMessages.count();
    return messages;
  }

  public async fillEmailField(email: string): Promise<void> {
    const emailField = this.page.locator('input[name="email"]');
    await emailField.click();
    await emailField.fill(email);
  }

  public async fillPhoneNumberField(phoneNumber: string): Promise<void> {
    const phoneNumberField = this.page.locator('input[name="phoneNumber"]');
    await phoneNumberField.click();
    await phoneNumberField.fill(phoneNumber);
  }
}