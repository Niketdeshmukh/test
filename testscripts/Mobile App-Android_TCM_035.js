const { remote } = require("webdriverio");
const fs = require("fs");

(async function editDetailsEmptyTest() {
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
    console.log("Waiting for the 'Edit Details' button to appear...");

    // Wait for the Edit Details button to appear
    await driver.waitUntil(
      async () => {
        const editButton = await driver.$(
          "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
        );
        return await editButton.isExisting();
      },
      {
        timeout: 15000,
        timeoutMsg: "'Edit Details' button not found within 15 seconds.",
      }
    );

    console.log("'Edit Details' button found. Clicking the button...");

    // Click the Edit Details button
    const editButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
    );
    await editButton.click();

    console.log("Waiting for the next screen with Name and Email fields...");

    // Wait for the Name field to appear using UiSelector with class 'android.widget.EditText'
    await driver.waitUntil(
      async () => {
        const nameField = await driver.$(
          'android=new UiSelector().className("android.widget.EditText")'
        );
        return await nameField.isDisplayed();
      },
      {
        timeout: 20000,
        timeoutMsg: "Name field not found within 20 seconds.",
      }
    );

    console.log("Name field found. clearing feild");

    // Enter "niket" into the Name field using UiSelector
    const nameField = await driver.$(
      'android=new UiSelector().className("android.widget.EditText")'
    );
    await nameField.setValue("");

    // Wait for the Email field to appear using UiSelector
    // Wait for the Email field to appear using UiSelector
    const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
    await emailField.click(); // Focus the field
    await emailField.clearValue();
    await emailField.click(); // Focus the field
    await emailField.setValue('');
    
    await driver.waitUntil(
        async () => {
          const nameField = await driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
          );
          return await nameField.isDisplayed();
        },
        {
          timeout: 20000,
          timeoutMsg: "Name field not found within 20 seconds.",
        }
      );
  

    // Wait for the Save Changes button to appear using UiSelector
    console.log("Waiting for the 'Save Changes' button to appear...");
    await driver.waitUntil(
      async () => {
        const saveButton = await driver.$(
          'android=new UiSelector().className("android.widget.Button").instance(2)'
        );
        return await saveButton.isExisting();
      },
      {
        timeout: 10000,
        timeoutMsg: "'Save Changes' button not found within 10 seconds.",
      }
    );

    console.log("'Save Changes' button found. Clicking the button...");

    // Click the Save Changes button
    const saveButton = await driver.$(
      'android=new UiSelector().className("android.widget.Button").instance(2)'
    );
    await saveButton.click();

    console.log("Changes can't save because of empty fields!");

    // Take a screenshot after clicking the 'Save Changes' button
    // const screenshot = await driver.takeScreenshot();
    // fs.writeFileSync("save_changes_screenshot.png", screenshot, "base64");
    // console.log("Screenshot taken and saved as save_changes_screenshot.png");

  } catch (err) {
    console.error("An error occurred during the edit details test:", err.message);
  } finally {
    console.log("Ending the edit details test session...");
    await driver.deleteSession();
  }
})();
