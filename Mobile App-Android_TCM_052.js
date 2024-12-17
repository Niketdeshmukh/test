const { remote } = require("webdriverio");

(async function editAddress()  {
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

  // Wait for the profile button to be clickable and then click
  const profileButton = await driver.$(
    '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
  );
  await profileButton.click();
  await driver.pause(2000); // 2 seconds delay

  // Click on the "Addresses" button
  const addressesButton = await driver.$(
    '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[1]/android.widget.Button'
  );
  await addressesButton.click();
  await driver.pause(2000); // 2 seconds delay

  // Click on the "Edit" button
  const editButton = await driver.$('(//android.widget.TextView[@text="Edit"])[1]');
  await editButton.click();
  await driver.pause(2000); // 2 seconds delay

  // Click on the address field (using XPath)
  const addressField = await driver.$(
    'android.widget.EditText'
  );
  await addressField.click();
  await driver.pause(2000); // 2 seconds delay

  // Click on the "Confirm Location" button
  const confirmButton = await driver.$(
    '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button'
  );
  await confirmButton.click();
  await driver.pause(2000); // 2 seconds delay

  // End the session
  await driver.deleteSession();
})();
