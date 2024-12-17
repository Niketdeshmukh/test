const { remote } = require("webdriverio");
const assert = require("assert");
const fs = require("fs");

(async function example() {
  const capabilities = {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:app": "./dev-release.apk",
    "appium:automationName": "UiAutomator2",
    "appium:newCommandTimeout": 300,
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:noReset": true,
    "appium:ignoreHiddenApiPolicyError": true,
  };

  const driver = await remote({
    logLevel: "info",
    path: "/",
    port: 4725,
    capabilities,
  });

  try {
    console.log("Waiting for the login button to appear...");

    // Wait for the login button to appear
    await driver.waitUntil(
      async () => {
        const button = await driver.$("//android.widget.Button");
        return await button.isExisting();
      },
      {
        timeout: 10000,
        timeoutMsg: "Login button not found within 10 seconds.",
      }
    );

    console.log("Login button found. Clicking the button...");
    const button = await driver.$("//android.widget.Button");
    await button.click();

    console.log("Waiting for the next screen button to appear...");

    // Wait for the next screen button to appear
    await driver.waitUntil(
      async () => {
        const button1 = await driver.$(
          "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button"
        );
        return await button1.isExisting();
      },
      {
        timeout: 15000,
        timeoutMsg: "Next screen button not found within 15 seconds.",
      }
    );

    console.log("Next screen button found. Clicking the button...");
    const button1 = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button"
    );
    await button1.click();

    console.log("Button clicked, app moved to the next screen!");

  } catch (err) {
    console.error("An error occurred during the test:", err.message);
  } finally {
    console.log("Ending the session...");
    await driver.deleteSession();
  }
})();
