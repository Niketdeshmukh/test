import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Navigate and Swipe Test', function () {
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

  it('should navigate, send app to background, and resume successfully', async function () {
    console.log('Navigating to the profile section...');
    const profileButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
    );
    await profileButton.click();
    await driver.pause(2000);

    console.log('Sending the app to the background...');
    await driver.background(5);

    console.log('Resuming the app...');
    const elementOnCurrentScreen = await driver.$(
      'android=new UiSelector().textContains("Profile")'
    );

    if (await elementOnCurrentScreen.isDisplayed()) {
      console.log('App resumed successfully from the same screen!');
      expect(await elementOnCurrentScreen.isDisplayed()).to.be.true;
    } else {
      throw new Error('Failed to resume on the correct screen');
    }
  });

  after(async function () {
    console.log('Ending the navigate and swipe test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
