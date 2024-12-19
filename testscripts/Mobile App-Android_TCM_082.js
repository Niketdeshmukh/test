const { remote, buttonValue } = require("webdriverio");

(async function manageAddress() {
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

    let driver;

    try {
        // Start the session with WebDriverIO
        driver = await remote({
            logLevel: "info",
            path: "/",
            port: 4725,
            capabilities,
        });

        // Step 1: Click on the Profile button
        const profileButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[3]/android.view.View[2]'
        );
        await profileButton.click();
        console.log("Profile button clicked.");
        await driver.pause(2000);

        // Step 2: Click on the Address button
        const addressButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[1]/android.widget.Button'
        );
        await addressButton.click();
        console.log("Address button clicked.");
        await driver.pause(2000);

        // Step 3: Click on the Edit button for the Home address
        const editHomeButton = await driver.$(
            '//android.widget.ScrollView/android.view.View[1]/android.view.View[3]/android.widget.Button'
        );
        await editHomeButton.click();
        console.log("Edit Home button clicked.");
        await driver.pause(2000);

        // Step 4: Set the fixed address into the EditText field for Home address
        const fixedAddress = "252, Sucasa Golden Park, 4th Main Road, Rams Lake View Meadows, Vinayak Nagar, Kattigenahalli, Bengaluru, Karnataka. 33 m from OYO Hotel, Pin-560063 (India)";
        const homeAddressEditText = await driver.$('//android.widget.EditText');
        await homeAddressEditText.setValue(fixedAddress); // Setting the fixed address
        console.log('Home address updated with the fixed address:', fixedAddress);

        // Step 5: Check if the Confirm button is enabled
        const confirmButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button'
        );
        const isEnabled = await confirmButton.isEnabled();
        if (isEnabled) {
            console.log("Confirm button is enabled. Clicking it.");
            await confirmButton.click();
            await driver.pause(2000); // Wait for 2 seconds after clicking
            console.log('Address update confirmed!');
        } else {
            console.log("Confirm button is not enabled.");
        }
        const backbutton = driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
        await backbutton.click();

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // End the session
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session ended.');
        }
    }
})();
