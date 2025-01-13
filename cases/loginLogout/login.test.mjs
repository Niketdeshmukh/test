import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';

describe('Login Test', function () {
  let driver;

  before(async function () {
    this.timeout(60000);
    driver = await initializeDriver();
    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(2000);
  });

  it('should log in successfully with phone number', async function () {
    try {
      await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
      await driver.pause(2000);
      const signinButton = await waitForElement(driver, '//android.widget.Button', 10000);
      await signinButton.click();
      await driver.pause(1000);

      const cancelButton = await waitForElement(driver, '//android.widget.ImageView[@content-desc="Cancel"]', 10000);
      if(await allowButton.isDisplayed()){
        await allowButton.click();
      }

      const numberField = await waitForElement(driver, '//android.widget.EditText', 1000);
      await numberField.click();

      await driver.pause(1000); // Allow the field to be focused

      const PHONE_NUMBER = '9008337447';
      await numberField.setValue(PHONE_NUMBER);

      const submitButton = await waitForElement(driver, '//android.widget.Button', 5000);
      await submitButton.click();
    } catch (err) {
      console.error('An error occurred during the login test:', err.message);
    }
  });

  after(async function () {
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});

// Utility function to wait for an element
async function waitForElement(driver, xpath, timeout) {
  try {
    const element = await driver.$(xpath);
    await element.waitForDisplayed({ timeout });
    return element;
  } catch (error) {
    console.error(`Element not found for XPath: ${xpath} within ${timeout}ms`);
    throw error;
  }
}
