import { remote } from 'webdriverio';
import { expect } from 'chai';

// Constants
const APP_CAPABILITIES = {
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554',
  'appium:app': './supershare.apk',
  'appium:automationName': 'UiAutomator2',
  'appium:newCommandTimeout': 300,
  'appium:noReset': true,
  'appium:ignoreHiddenApiPolicyError': true,
};
const OTP_DIGITS = ['1', '2', '3', '4'];
const OTP_FIELDS_XPATHS = [
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[3]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText",
];

// Test Suite
describe('Login Test', function () {
  let driver;

  before(async function () {
    console.log("Setting up driver...");
    this.timeout(30000);

    driver = await remote({
      logLevel: 'info',
      path: '/',
      port: 4725,
      capabilities: APP_CAPABILITIES,
    });

    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(2000);
  });

  it('should log in successfully with OTP', async function () {
    try {
      console.log("Launching the app...");
      await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
      console.log("App launched successfully.");
      await driver.pause(2000);

      // Sign-in button
      const signinButton = await driver.$('//android.widget.Button');
      await signinButton.click();
      await driver.pause(1000);

      // Cancel popup
      console.log('Waiting for popup to appear...');
      const cancelButton = await driver.$('//android.widget.ImageView[@content-desc="Cancel"]');
      await cancelButton.click();
      console.log('Popup canceled, proceeding to login screen...');

      // Phone number input
      const numberField = await driver.$('//android.widget.EditText');
      await numberField.waitForDisplayed({ timeout: 5000 });
      await numberField.click();
      console.log('Focused on number field');

      await driver.pause(1000); // Allow the field to be focused

      const PHONE_NUMBER = '9480356496';
      await numberField.setValue(PHONE_NUMBER);
      console.log(`Entered phone number: ${PHONE_NUMBER}`);

      // Submit button
      const submitButton = await driver.$('//android.widget.Button');
      await submitButton.click();
      console.log('Submitted phone number and waiting for OTP...');
      await driver.pause(3000);

      // Enter OTP digits
      for (let i = 0; i < OTP_DIGITS.length; i++) {
        const otpField = await driver.$(OTP_FIELDS_XPATHS[i]);
        await otpField.waitForDisplayed({ timeout: 7000 });
        await otpField.setValue(OTP_DIGITS[i]);
        console.log(`Entered OTP digit '${OTP_DIGITS[i]}' in field ${i + 1}`);
      }

      await driver.pause(3000);

      // Allow permissions
      const allowButton = await driver.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
      await allowButton.click();
      await driver.pause(1000);

      // Verify dashboard
      console.log('Waiting for dashboard...');
      const dashboardElement = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View');
      await dashboardElement.waitForDisplayed({ timeout: 15000 });
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
