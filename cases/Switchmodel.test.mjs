import { remote } from 'webdriverio';
import { expect } from 'chai';

describe('Edit and Update Test', function () {
  let driver;

  before(async function () {
    console.log("Setting up driver...");
    this.timeout(30000);
    const capabilities = {
      platformName: "Android",
      "appium:deviceName": "emulator-5554",
      "appium:app": "./dev-release.apk", // Path to your APK
      "appium:automationName": "UiAutomator2",
      "appium:newCommandTimeout": 300,
      "appium:noReset": true,
      "appium:ignoreHiddenApiPolicyError": true,
    };

    driver = await remote({
      logLevel: "info",
      path: "/",
      port: 4725,
      capabilities,
    });

    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(2000);  // Adjust pause time if necessary
  });

  it('should click Edit, focus on input, write testing and click Update', async function () {
    try {
      console.log("Launching the app...");
      await driver.executeScript("mobile: activateApp", [{ appId: "com.simpleenergy.app" }]);

      console.log("Clicking on Edit button...");
      const editButton = await driver.$('//android.widget.ScrollView/android.view.View[2]/android.view.View/android.view.View[4]/android.view.View');
      await editButton.waitForDisplayed({ timeout: 5000 });
      await editButton.click();
      console.log("Clicked on Edit button.");

      console.log("Focusing on the input field...");
      const inputField = await driver.$('//android.widget.EditText');
      await inputField.waitForDisplayed({ timeout: 5000 });
      await inputField.click();
      await inputField.setValue('testing');
      console.log("Entered text 'testing' in the input field.");

      console.log("Clicking on Update button...");
      const updateButton = await driver.$('//android.widget.ScrollView/android.view.View/android.widget.Button');
      await updateButton.waitForDisplayed({ timeout: 5000 });
      await updateButton.click();
      console.log("Clicked on Update button.");
      
      await driver.pause(2000); // Allow time for the update action to complete

    } catch (err) {
      console.error("An error occurred during the Edit and Update test:", err.message);
    }
  });

  after(async function () {
    console.log("Ending the test session...");
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
