const { remote } = require("webdriverio");
const fs = require("fs");

(async function profileButtonTest() {
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
    console.log("Waiting for the 'profile button' to appear...");

    // Wait for the profile button to appear
    await driver.waitUntil(
      async () => {
        const profileButton = await driver.$(
          "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[3]/android.view.View[2]"
        );
        return await profileButton.isExisting();
      },
      {
        timeout: 15000,
        timeoutMsg: "'profile button' not found within 15 seconds.",
      }
    );

    console.log("'profile button' found. Clicking the button...");

    // Click the profile button
    const profileButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[3]/android.view.View[2]"
    );
    await profileButton.click();

    console.log("profile button clicked, navigating to the next screen!");


  } catch (err) {
    console.error("An error occurred during the profile button test:", err.message);
  } finally {
    console.log("Ending the profile button test session...");
    await driver.deleteSession();
  }
})();
