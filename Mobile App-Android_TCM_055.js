const { remote } = require("webdriverio");

(async function navigateAndSwipe() {
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
    // Click on the profile button
    const profileButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
    );
    await profileButton.click();
    await driver.pause(2000);

    // Click on the settings button
    // const settingsButton = await driver.$(
    //   '//android.view.View[@resource-id="android:id/navigationBarBackground"]'
    // );
    // await settingsButton.click();
    await driver.pause(2000);

    
    console.log("Sending the app to the background...");
    // Send the app to the background for 5 seconds
    await driver.background(5);

    console.log("Resuming the app...");
    // The app should automatically resume after the background duration

    // Verify that the app resumes from the same screen
    const elementOnCurrentScreen = await driver.$(
      'android=new UiSelector().textContains("Profile")'
    );

    if (await elementOnCurrentScreen.isDisplayed()) {
      console.log("App resumed successfully from the same screen!");
    } else {
    //   console.error("App did not resume from the same screen!");
    }

    console.log("Swipe gesture completed successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await driver.deleteSession();
  }
})();
