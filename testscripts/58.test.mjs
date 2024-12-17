import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Uninstall and Reinstall Test', function () {
  let driver;

  before(async function () {
    this.timeout(30000); // 30 seconds for setup
    const capabilities = {
      platformName: 'Android',
      'appium:deviceName': 'emulator-5554',
      'appium:app': './dev-release.apk', // Path to your APK
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

    console.log('Driver setup complete');
  });

  it('should uninstall and reinstall the app', async function () {
    console.log('Uninstalling the app...');
    await driver.removeApp('com.simpleenergy.app');
    console.log('App uninstalled successfully!');

    // Confirm app is uninstalled by checking if it's not installed
    const isAppInstalledBefore = await driver.isAppInstalled('com.simpleenergy.app');
    expect(isAppInstalledBefore).to.be.false;

    console.log('Reinstalling the app...');
    await driver.installApp('./dev-release.apk');
    console.log('App reinstalled successfully!');

    // Confirm app is installed by checking if it's installed
    const isAppInstalledAfter = await driver.isAppInstalled('com.simpleenergy.app');
    expect(isAppInstalledAfter).to.be.true;
  });

  after(async function () {
    console.log('Ending uninstall and reinstall test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
