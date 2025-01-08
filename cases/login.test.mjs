import { remote } from 'webdriverio';
import { initializeDriver } from './driverSetup.mjs';

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
    console.log("Setting up driver...");
    this.timeout(30000);
    driver = await initializeDriver();
    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(2000);
  });

  it('should log in successfully with OTP', async function () {
    try {
      console.log("Launching the app...");
      await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
      console.log("App launched successfully.");
      await driver.pause(2000);

      // Wait and interact with Sign-in button
      const signinButton = await waitForElement(driver, '//android.widget.Button', 10000);
      await signinButton.click();
      await driver.pause(1000);

      // Cancel popup
      console.log('Waiting for popup to appear...');
      const cancelButton = await waitForElement(driver, '//android.widget.ImageView[@content-desc="Cancel"]', 10000);
      await cancelButton.click();
      console.log('Popup canceled, proceeding to login screen...');

      // Phone number input
      const numberField = await waitForElement(driver, '//android.widget.EditText', 10000);
      await numberField.click();
      console.log('Focused on number field');

      await driver.pause(1000); // Allow the field to be focused

      const PHONE_NUMBER = '9480356496';
      await numberField.setValue(PHONE_NUMBER);
      console.log(`Entered phone number: ${PHONE_NUMBER}`);

      // Submit button
      const submitButton = await waitForElement(driver, '//android.widget.Button', 10000);
      await submitButton.click();
      console.log('Submitted phone number and waiting for OTP...');
      await driver.pause(3000);

      // Enter OTP digits
      for (let i = 0; i < OTP_DIGITS.length; i++) {
        const otpField = await driver.$(driver, OTP_FIELDS_XPATHS[i]);
        await otpField.waitForDisplayed({ timeout: 15000 });
        await otpField.setValue(OTP_DIGITS[i]);
        console.log(`Entered OTP digit '${OTP_DIGITS[i]}' in field ${i + 1}`);
      }

      await driver.pause(3000);

      // Allow permissions
      const allowButton = await waitForElement(driver, '//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]', 10000);
      await allowButton.click();
      await driver.pause(1000);

      // Verify dashboard
      console.log('Waiting for dashboard...');
      const dashboardElement = await waitForElement(driver, '//androidx.compose.ui.platform.q1/android.view.View/android.view.View', 15000);
      console.log('Successfully redirected to the dashboard!');
    } catch (err) {
      console.error('An error occurred during the login test:', err.message);
    }
  });

  after(async function () {
    console.log('Ending the login test session...');
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
