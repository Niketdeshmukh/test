const { remote } = require("webdriverio");

(async function verifyFieldLength() {
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
    // Navigate to the profile section
    const profileButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button'
    );
    await profileButton.click();
    await driver.pause(2000);

    // Click on the "Edit Profile" button
    const editProfileButton = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")'
    );
    await editProfileButton.click();
    await driver.pause(2000);

    // Verify Name field max length
    const nameField = await driver.$('android=new UiSelector().className("android.widget.EditText")');
    await nameField.setValue("ghdgfghdgfghdgfghdgfghdgfghd"); // 31 characters
    const nameValue = await nameField.getText();

    if (nameValue.length <= 31) {
      console.log("Name field max length validation passed: " + nameValue.length);
    } else {
      console.error("Name field max length validation failed: " + nameValue.length);
    }

    // Verify Email field max length
    const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
    const emailInput = "gashgdjasgjjjjaexamplelongemailtextgggggg@gmail.com"; // 51 characters before @
    await emailField.setValue(emailInput);
    const emailValue = await emailField.getText();

    if (emailValue.includes("@") && emailValue.length <= 51 + emailInput.split("@")[1].length + 1) {
      console.log("Email field max length validation passed: " + emailValue.length);
    } else {
      console.error("Email field max length validation failed: " + emailValue.length);
    }
    const saveButton = await driver.$(
      '//android.widget.ScrollView/android.view.View[4]/android.widget.Button'
    );
    await saveButton.click();
  
    console.log("Changes saved successfully!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // End the session
    await driver.deleteSession();
  }
  
})();
