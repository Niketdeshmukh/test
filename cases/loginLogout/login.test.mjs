import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';

const OTP_DIGITS = ['1', '2', '3', '4'];
const OTP_FIELDS_XPATHS = [
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[3]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText",
];
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
      this.timeout(60000);
      await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
      await driver.pause(2000);
      const signinButton = await waitForElement(driver, '//android.widget.Button', 10000);
      await signinButton.click();
      await driver.pause(1000);
        const cancelButton = await waitForElement(driver, '//android.widget.ImageView[@content-desc="Cancel"]', 10000);
        
        if (await cancelButton.isDisplayed()) {
          console.log('Cancel button is visible. Clicking the button...');
          await cancelButton.waitForDisplayed({ timeout: 15000 });
          await cancelButton.click();
        } else {
          console.log('Cancel button is not visible. Ending the test with a success message.');
        }
      const numberField = await waitForElement(driver, '//android.widget.EditText', 1000);
      await numberField.click();

      await driver.pause(1000); // Allow the field to be focused

      const PHONE_NUMBER = '9008337447';
      await numberField.setValue(PHONE_NUMBER);

      const submitButton = await waitForElement(driver, '//android.widget.Button', 5000);
      await submitButton.click();
      for (let i = 0; i < OTP_DIGITS.length; i++) {
        const otpField = await driver.$(OTP_FIELDS_XPATHS[i]);

        if (await otpField.waitForExist({ timeout: 15000 })) {
            console.log(`Entering OTP digit '${OTP_DIGITS[i]}' in field ${i + 1}`);
            await otpField.setValue(OTP_DIGITS[i]);
        } else {
            console.warn(`OTP field ${i + 1} not found. Skipping.`);
        }
    }

      const allowButton = await driver.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
      await allowButton.waitForDisplayed({timeout:15000})
      if (await allowButton.isDisplayed()) {
        console.log('Allow button is visible. Clicking the button...');
        await allowButton.waitForDisplayed({timeout:15000})
        await allowButton.click();
      } else {
        console.log('Allow button is not visible. Ending the test with success message.');
      }
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
