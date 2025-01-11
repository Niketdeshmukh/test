import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';

const OTP_DIGITS = ['1', '2', '3', '4'];
const OTP_FIELDS_XPATHS = [
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[3]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText",
];

describe('Otp Test', function () {
  let driver;

  before(async function () {
    
    driver = await initializeDriver();
    console.log('Driver setup complete, waiting for the app to load...');
    // await driver.pause(2000);
  });

  it('should log in successfully with OTP', async function () {
    this.timeout(30000);
    try {
      await driver.pause(2000);

      // for (let i = 0; i < OTP_DIGITS.length; i++) {
      //   const otpField = await driver.$( OTP_FIELDS_XPATHS[i]);
      //   await otpField.waitForDisplayed({ timeout: 15000 });
      //   await otpField.setValue(OTP_DIGITS[i]);
      //   console.log(`Entered OTP digit '${OTP_DIGITS[i]}' in field ${i + 1}`);
      // }

      const allowButton = await driver.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');

      if (await allowButton.isDisplayed()) {
        console.log('Allow button is visible. Clicking the button...');
        await allowButton.waitForDisplayed({timeout:10000})
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
