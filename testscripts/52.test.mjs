import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Edit Address Test', function () {
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

  it('should edit the address successfully', async function () {
    console.log('Navigating to the profile section...');
    const profileButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
    );
    await profileButton.click();
    await driver.pause(2000);

    console.log('Navigating to the addresses section...');
    const addressesButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[1]/android.widget.Button'
    );
    await addressesButton.click();
    await driver.pause(2000);

    console.log('Clicking the edit button for the first address...');
    const editButton = await driver.$('(//android.widget.TextView[@text="Edit"])[1]');
    await editButton.click();
    await driver.pause(2000);

    console.log('Selecting the address field...');
    const addressField = await driver.$('android.widget.EditText');
    await addressField.click();
    await driver.pause(2000);

    console.log('Confirming the address changes...');
    const confirmButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button'
    );
    await confirmButton.click();
    await driver.pause(2000);
  });

  after(async function () {
    console.log('Ending the edit address test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
