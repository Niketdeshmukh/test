import { remote } from "webdriverio";
import { expect } from "chai";

describe("User Logout Functionality", function () {
    let driver;

    // Define driver capabilities
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

    before(async function () {
        // Start WebDriverIO session
        driver = await remote({
            logLevel: "info",
            path: "/",
            port: 4725,
            capabilities,
        });
    });

    after(async function () {
        // End WebDriverIO session
        if (driver) {
            await driver.deleteSession();
            console.log("Driver session ended.");
        }
    });

    it("should successfully log out the user", async function () {
        // Click on the Profile button
        const profileButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
        );
        await profileButton.click();
        await driver.pause(2000);
        const { width, height } = await driver.getWindowRect();
        await driver.performActions([
            {
                type: "pointer",
                id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                    { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.8 },
                    { type: "pointerDown", button: 0 },
                    { type: "pointerMove", duration: 500, x: width / 2, y: height * 0.1 },
                    { type: "pointerUp", button: 0 },
                ],
            },
        ]);
        await driver.pause(2000);
        // Click on the Logout button
        const logoutButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[4]/android.widget.Button'
        );
        await logoutButton.click();
        await driver.pause(1000);
    
        // Confirm the logout action
        const confirmButton = await driver.$(
            '//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_yes_btn"]'
        );
    
        // Wait explicitly for the confirm button to appear
        await confirmButton.waitForDisplayed({ timeout: 5000 });
    
        const isDisplayed = await confirmButton.isDisplayed();
        expect(isDisplayed).to.be.true; // Validate that confirm button is displayed
    
        await confirmButton.click();
        console.log("Logout successfully!");
    });
    
});
