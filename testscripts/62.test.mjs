import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Orientation Test', function () {
  let driver;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  before(async function () {
    this.timeout(30000); // Set timeout for the setup

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

  it('should verify orientation and switch between portrait and landscape', async function () {
    console.log('Launching the app...');
    let currentOrientation = await driver.getOrientation();
    console.log(`Initial Orientation: ${currentOrientation}`);

    if (currentOrientation !== 'PORTRAIT') {
      console.log('Switching to portrait mode...');
      await driver.setOrientation('PORTRAIT');
    }

    console.log('Enabling auto-rotate feature...');
    try {
      await driver.execute('mobile: shell', {
        command: 'settings put system accelerometer_rotation 1',
      });
    } catch (err) {
      console.warn('Could not enable auto-rotate programmatically.');
    }

    console.log('Attempting to switch to landscape mode...');
    await delay(1000); // Adding delay before orientation change
    await driver.setOrientation('LANDSCAPE');

    currentOrientation = await driver.getOrientation();
    console.log(`Orientation after switching to landscape: ${currentOrientation}`);

    if (currentOrientation === 'PORTRAIT') {
      console.log('Test Passed: App remains in portrait mode as expected.');
    } else {
      console.error('Test Failed: App switched to landscape mode unexpectedly.');
    }
  });

  after(async function () {
    console.log('Ending the orientation test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
