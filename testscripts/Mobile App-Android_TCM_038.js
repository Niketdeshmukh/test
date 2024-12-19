const { remote } = require("webdriverio");
const path = require("path");

(async function changeDPTest() {
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
    console.log("Clicking the edit button...");

    const editButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
    );
    await editButton.click();

    console.log("Edit button clicked, waiting for the next screen...");

    // Wait for the Change DP button
    await driver.waitUntil(
      async () => {
        const changeDPButton = await driver.$(
          '//android.widget.ScrollView/android.view.View[3]/android.widget.Button'
        );
        return await changeDPButton.isExisting();
      },
      {
        timeout: 15000,
        timeoutMsg: "Change DP button not found within 15 seconds.",
      }
    );

    console.log("Change DP button found. Clicking the button...");

    const changeDPButton = await driver.$(
      '//android.widget.ScrollView/android.view.View[3]/android.widget.Button'
    );
    await changeDPButton.click();

    console.log("Change DP button clicked, now interacting with file picker...");

    // Wait for the file picker to open
    const filePicker = await driver.$("//android.widget.TextView"); // Adjust based on your file picker
    await filePicker.waitForExist({ timeout: 10000 });

    console.log("File picker found, selecting the image...");

    // Step 1: Open Downloads folder
    const downloadsFolderXPath = '//android.widget.RelativeLayout'; // Ensure this is the correct XPath for the folder
    await driver.$(downloadsFolderXPath).waitForExist({ timeout: 5000 }); // Wait for Downloads folder to appear
    await driver.$(downloadsFolderXPath).click(); // Open Downloads folder

    // Step 2: Wait for the list of files to load (if necessary)
    // await driver.$('//android.widget.ListView').waitForExist({ timeout: 5000 });

    // Step 3: Find and click the image file (simpleconnect.png)
    const imageXPath = '//android.widget.ImageView[@content-desc="Photo taken on Dec 10, 2024 4:57:13 PM"]'; // Ensure the XPath matches the image's content-desc
    await driver.$(imageXPath).waitForExist({ timeout: 5000 }); // Wait for the image element to appear
    await driver.$(imageXPath).click(); // Click the image
    const saveChangesButton = await driver.$(
        "//android.widget.ScrollView/android.view.View[3]/android.widget.Button"
      );
      await saveChangesButton.waitForExist({ timeout: 5000 });
  
      console.log("Save Changes button found, clicking it...");
      await saveChangesButton.click();
  
      console.log("Save Changes button clicked successfully!");
    console.log("Profile picture updated successfully!");
  } catch (err) {
    console.error("An error occurred:", err.message);
  } finally {
    console.log("Ending the test session...");
    await driver.deleteSession();
  }
})();
