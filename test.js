const { Builder, By, until } = require('selenium-webdriver');
const { AppiumDriver } = require('appium');  // Ensure Appium is required for your test
const assert = require('assert');

(async function example() {
  const driver = await new Builder()
    .usingServer('http://localhost:4723/wd/hub')  // Ensure Appium server is running
    .withCapabilities({
      platformName: 'Android',
      deviceName: 'emulator-5554',  // Emulator ID
      app: './dev-release.apk',  // Path to your app
      automationName: 'UiAutomator2',  // For Android automation
      newCommandTimeout: 300,
      ensureWebviewsHavePages: true,
      nativeWebScreenshot: true,
      noReset: true,
      ignoreHiddenApiPolicyError: true
    })
    .forBrowser('android')
    .build();

  try {
    // Wait for the app to load and confirm the launch
    await driver.wait(until.elementLocated(By.xpath("//android.widget.Button")), 10000);
    console.log("App Launched Successfully!");

    // Find the button element using XPath
    const button = await driver.findElement(By.xpath("//android.widget.Button"));
    
    // Click the button
    await button.click();

    // Wait for the new screen to load or for any indication that the app has transitioned
    await driver.wait(until.elementLocated(By.xpath("//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button")), 5000);

     // Find the button element using XPath
     const button1 = await driver.findElement(By.xpath("//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button"));
    
     // Click the button
     await button1.click();

    // Log the transition
    console.log("Button clicked, app moved to the next screen!");

  } catch (err) {
    console.log('Error: ', err);
  } finally {
    await driver.quit();
  }
})();
