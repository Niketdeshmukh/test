import { remote } from 'webdriverio';
import { expect } from 'chai';
import { initializeDriver } from '../driverSetup.mjs';

describe('Orientation Test', function () {
  let driver;

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  before(async function () {
    this.timeout(30000); 
    driver = await initializeDriver();
    await driver.pause(2000);
  });

  it('should verify orientation and switch between portrait and landscape', async function () {
    let currentOrientation = await driver.getOrientation();

    // Ensure initial orientation is portrait
    if (currentOrientation !== 'PORTRAIT') {
      await driver.setOrientation('PORTRAIT');
    }
    try {
      await driver.execute('mobile: shell', {
        command: 'settings put system accelerometer_rotation 1',
      });
    } catch (err) {
      console.warn('Could not enable auto-rotate programmatically.');
    }
    await delay(1000); 
    await driver.setOrientation('LANDSCAPE');

    currentOrientation = await driver.getOrientation();

    expect(currentOrientation).to.equal('LANDSCAPE', 'Failed to switch to landscape mode.');
    await driver.setOrientation('PORTRAIT');

    currentOrientation = await driver.getOrientation();

    expect(currentOrientation).to.equal('PORTRAIT', 'Failed to switch back to portrait mode.');
  });

  after(async function () {
    console.log('Ending the orientation test session...');
    const currentOrientation = await driver.getOrientation();
    if (currentOrientation !== 'PORTRAIT') {
      console.log('Resetting orientation to portrait...');
      await driver.setOrientation('PORTRAIT');
    }

    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
