const { remote } = require("webdriverio");

(async function loginTest() {
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

        await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
        console.log("App launched successfully.");
        await driver.pause(2000);
    // const signinButton = await driver.$('//android.widget.Button');
    // await signinButton.click();
    await driver.pause(1000);
    // Wait for and click on the "Cancel" button (cross) in the popup
    console.log("Waiting for popup to appear...");
    const cancelButton = await driver.$('//android.widget.ImageView[@content-desc="Cancel"]');
    await cancelButton.click();
    console.log("Popup canceled, proceeding to login screen...");

    // Wait for the number field to be displayed and interactable
    const numberField = await driver.$('//android.widget.EditText');
    await numberField.waitForDisplayed({ timeout: 5000 });
    await numberField.click();
    console.log("Focused on number field");

    // Add a small delay before entering the number
    await driver.pause(1000);  // Allow the field to be focused

    // Enter the phone number
    await numberField.setValue("9008337447");
    console.log("Entered phone number: 9008337447");
    // Submit the phone number
    const submitButton = await driver.$('//android.widget.Button');
    await submitButton.click();
    console.log("Submitted phone number and waiting for OTP...");

    // Enter the OTP digits
    const otpFields = [
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.EditText",
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText",
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[3]/android.widget.EditText",
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText"
    ];
    const otpDigits = ["1", "2", "3", "4"];

    for (let i = 0; i < otpFields.length; i++) {
      const otpField = await driver.$(otpFields[i]);
      await otpField.setValue(otpDigits[i]);
      console.log(`Entered OTP digit: ${otpDigits[i]}`);
    }
    await driver.pause(5000);
    // Wait for the dashboard to load and confirm redirection
    const allowButton = driver.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
    await allowButton.click();
    await driver.pause(1000);
    console.log("Waiting for dashboard...");
    const dashboardElement = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View');
    await dashboardElement.waitForDisplayed({ timeout: 15000 });
    console.log("Successfully redirected to the dashboard!");
  } catch (err) {
    console.error("An error occurred during the login test:", err.message);
  } finally {
    console.log("Ending the login test session...");
    await driver.deleteSession();
  }
})();
// module.exports =loginTest;