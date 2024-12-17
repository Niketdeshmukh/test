const { remote } = require("webdriverio");
(async function logout(){
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

          const clearButton = await driver.$(
            '//android.widget.ScrollView/android.view.View[1]/android.view.View[1]/android.widget.Button'
          );
          await clearButton.click();
          await driver.pause(1000);

          const noButton = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_no_btn"]');
          await noButton.click();
          

        
    } catch (error) {
        console.log('An error occured', error);
        
    }
})();