const { remote } = require('webdriverio');
const assert = require('assert');
const fs = require('fs');

(async function example() {
  const capabilities = {
    platformName: "Android",
    'appium:deviceName': "emulator-5554", // Prefixed with 'appium:'
    'appium:app': "./dev-release.apk", // Prefixed with 'appium:'
    'appium:automationName': "UiAutomator2", // Prefixed with 'appium:'
    'appium:newCommandTimeout': 300, // Prefixed with 'appium:'
    'appium:ensureWebviewsHavePages': true, // Prefixed with 'appium:'
    'appium:nativeWebScreenshot': true, // Prefixed with 'appium:'
    'appium:noReset': true, // Prefixed with 'appium:'
    'appium:ignoreHiddenApiPolicyError': true // Prefixed with 'appium:'
  };

  // Create the WebDriverIO session directly
  const driver = await remote({
    logLevel: "info",
    path: "/", // Appium server path
    port: 4725, // Appium server port
    capabilities
  });

  try {
    // Wait for the app to load and confirm the launch
    await driver.waitUntil(async () => {
      const button = await driver.$("//android.widget.Button"); // Updated to use $
      return await button.isExisting(); // Check if the button exists
    }, 10000);
    console.log("App Launched Successfully!");

    // Find the button element using XPath
    const button = await driver.$('android.widget.Button');
    
    // Click the button
    await button.click();

    // Wait for the new screen to load or for any indication that the app has transitioned
    await driver.waitUntil(async () => {
      const button1 = await driver.$("//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button");
      return await button1.isExisting(); // Check if the button exists
    }, 5000);

    // Find the button element using XPath
    const button1 = await driver.$("//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button");
    
    // Click the button
    await button1.click();

    console.log("Button clicked, app moved to the next screen!");

    // Capture a screenshot after performing the actions
    const screenshot = await driver.takeScreenshot();
    fs.writeFileSync('screenshot.png', screenshot, 'base64');
    console.log('Screenshot taken and saved as screenshot.png');
    
  } catch (err) {
    console.log('Error: ', err);
  } finally {
    await driver.deleteSession();
  }
})();
