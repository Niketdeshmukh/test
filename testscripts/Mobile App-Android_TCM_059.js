const { remote } = require("webdriverio");

const emailDomains = [
  "gmail.com", "yahoo.com", "hotmail.com", "aol.com", "hotmail.co.uk", "hotmail.fr",
  "msn.com", "yahoo.fr", "wanadoo.f", "orange.fr", "comcast.n", "yahoo.co.uk",
  "y.com.br", "yahoo.co.in", "live.com", "rediffmail.com", "free.fr", "gmx.de",
  "web.d", "yandex.ru"
];

// Regex pattern for validating email
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Helper function to introduce delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async function editDetailsTest() {
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

  const results = [];

  try {
    const profileButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[3]/android.view.View[2]"
    );
    await driver.pause(1000);
    await profileButton.click();

    console.log("Profile button clicked, navigating to the next screen!");

    console.log("Waiting for the 'Edit Details' button to appear...");
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
    const editButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
    );
    await editButton.click();

    console.log("Waiting for the next screen with Email fields...");
    const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
    await emailField.click(); // Focus the field

    for (const domain of emailDomains) {
      const email = `testing@${domain}`;
      const isValidEmail = emailRegex.test(email);

      // Log validation
      const validationMessage = `Validation for email ${email}: ${
        isValidEmail ? "Valid" : "Invalid"
      }`;
      console.log(validationMessage);

      results.push({
        email,
        isValid: isValidEmail,
      });

      if (isValidEmail) {
        await emailField.clearValue();
        await emailField.setValue(email);
        console.log(`Email ${email} set in the field.`);
      } else {
        console.log(`Email ${email} is invalid and not set in the field.`);
      }

      // Introduce a delay of 0.5 seconds
      await delay(500);
    }

    // Log the final results
    console.log("\nSummary of Email Validation Results:");
    results.forEach((result) =>
      console.log(`Email: ${result.email} - ${result.isValid ? "Valid" : "Invalid"}`)
    );
  } catch (err) {
    console.error("An error occurred during the edit details test:", err.message);
  } finally {
    console.log("Ending the edit details test session...");
    await driver.deleteSession();
  }
})();
