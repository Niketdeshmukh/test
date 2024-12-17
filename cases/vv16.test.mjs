import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Login Test', function () {
  let driver;

  before(async function () {
    console.log("setting up driver...");
            this.timeout(30000);
    const capabilities = {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:app': './dev-release.apk',
      'appium:automationName': 'UiAutomator2',
      'appium:newCommandTimeout': 300,
      'appium:noReset': true,
      'appium:ignoreHiddenApiPolicyError': true,
    };

    driver = await remote({
      logLevel: 'info',
      path: '/',
      port: 4725,
      capabilities,
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
    const signinButton = await driver.$('//android.widget.Button');
    await signinButton.click();
    await driver.pause(1000);
      // Wait for and click on the "Cancel" button (cross) in the popup
      console.log('Waiting for popup to appear...');
      const cancelButton = await driver.$('//android.widget.ImageView[@content-desc="Cancel"]');
      await cancelButton.click();
      console.log('Popup canceled, proceeding to login screen...');

      // Wait for the number field to be displayed and interactable
      const numberField = await driver.$('//android.widget.EditText');
      await numberField.waitForDisplayed({ timeout: 5000 });
      await numberField.click();
      console.log('Focused on number field');

      // Add a small delay before entering the number
      await driver.pause(1000);  // Allow the field to be focused

      // Enter the phone number
      await numberField.setValue('9008337447');
      console.log('Entered phone number: 9008337447');

      // Submit the phone number
      const submitButton = await driver.$('//android.widget.Button');
      await submitButton.click();
      console.log('Submitted phone number and waiting for OTP...');
      await driver.pause(3000);
      // Enter the OTP digits
      // Mapping of OTP fields to their respective OTP values
const otpFieldMappings = [
  {
    xpath: "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.EditText",
    otp: '1'  // OTP digit for the first field
  },
  {
    xpath: "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText",
    otp: '2'  // OTP digit for the second field
  },
  {
    xpath: "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[3]/android.widget.EditText",
    otp: '3'  // OTP digit for the third field
  },
  {
    xpath: "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText",
    otp: '4'  // OTP digit for the fourth field
  }
];

// Iterate over each OTP field and enter the corresponding OTP value
for (const { xpath, otp } of otpFieldMappings) {
    const otpField = await driver.$(xpath);  // Get the OTP field element
    await otpField.waitForDisplayed({ timeout: 7000 });  // Wait for the individual OTP field to be displayed
    await otpField.setValue(otp);  // Enter the specific OTP value
    console.log(`Entered OTP digit '${otp}' in field with XPath: ${xpath}`);
}
      await driver.pause(3000);
      const allowButton = driver.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
      await allowButton.click();
      await driver.pause(1000);
      // Wait for the dashboard to load and confirm redirection
      console.log('Waiting for dashboard...');
      const dashboardElement = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View');
      await dashboardElement.waitForDisplayed({ timeout: 15000 });
      console.log('Successfully redirected to the dashboard!');console.log('Dashboard loaded, proceeding to next test.');
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
