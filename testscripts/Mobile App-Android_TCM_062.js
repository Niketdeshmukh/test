const { remote } = require("webdriverio");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function verifyOrientation() {
  const capabilities = {
    platformName: "Android",
    "appium:deviceName": "emulator-5554",
    "appium:app": "./dev-release.apk",
    "appium:automationName": "UiAutomator2",
    "appium:newCommandTimeout": 300,
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
    console.log("Launching the app...");

    let currentOrientation = await driver.getOrientation();
    console.log(`Initial Orientation: ${currentOrientation}`);

    if (currentOrientation !== "PORTRAIT") {
      console.log("Switching to portrait mode...");
      await driver.setOrientation("PORTRAIT");
    }

    console.log("Enabling auto-rotate feature...");
    try {
      await driver.execute("mobile: shell", {
        command: "settings put system accelerometer_rotation 1",
      });
    } catch (err) {
      console.warn(
        "Could not enable auto-rotate programmatically. Please ensure it is enabled manually."
      );
    }

    console.log("Attempting to switch to landscape mode...");
    await delay(1000); // Adding delay before orientation change
    await driver.setOrientation("LANDSCAPE");

    currentOrientation = await driver.getOrientation();
    console.log(`Orientation after switching to landscape: ${currentOrientation}`);

    if (currentOrientation === "PORTRAIT") {
      console.log("Test Passed: App remains in portrait mode as expected.");
    } else {
      console.error("Test Failed: App switched to landscape mode unexpectedly.");
    }
  } catch (err) {
    console.error("An error occurred during the orientation verification:", err.message);
  } finally {
    console.log("Ending the test session...");
    await driver.deleteSession();
  }
})();
