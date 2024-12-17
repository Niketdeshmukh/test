import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Logout Test', function () {
  let driver;

  before(async function () {
    this.timeout(30000); // 30 seconds for setup
    const capabilities = {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:app': './dev-release.apk',
      'appium:automationName': 'UiAutomator2',
      'appium:newCommandTimeout': 300,
      'appium:ensureWebviewsHavePages': true,
      'appium:nativeWebScreenshot': true,
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

  it('should log out successfully', async function () {
    console.log('Navigating to the profile section...');
    const profileButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
    );
    await profileButton.click();
    await driver.pause(2000);

    console.log('Navigating to the logout button...');
    const logoutButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[4]/android.widget.Button'
    );
    await logoutButton.click();
    await driver.pause(1000);

    console.log('Confirming logout...');
    const confirmButton = await driver.$(
      '//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_yes_btn"]'
    );
    await confirmButton.click();
    console.log('Logout successfully!');
  });

  after(async function () {
    console.log('Ending the logout test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
