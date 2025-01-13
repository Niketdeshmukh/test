import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';


describe('Otp Test', function () {
  let driver;

  before(async function () {
    
    driver = await initializeDriver();
    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(2000);
  });

  it('should log in successfully with OTP', async function () {
    this.timeout(30000);
    try {

      

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
