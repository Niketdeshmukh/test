import { remote } from "webdriverio";
import { expect } from "chai";

describe("Profile Button Functionality", function () {
    let driver;

    before(async function () {
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

        driver = await remote({
            logLevel: "info",
            path: "/",
            port: 4725,
            capabilities,
        });
    });

    after(async function () {
        if (driver) {
            await driver.deleteSession();
            console.log("Driver session ended.");
        }
    });

    it("should find and click the Profile button", async function () {
        console.log("Waiting for the 'profile button' to appear...");

        // Wait for the profile button to appear
        const profileButtonSelector =
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]";

        const isProfileButtonPresent = await driver.waitUntil(
            async () => {
                const profileButton = await driver.$(profileButtonSelector);
                return await profileButton.isExisting();
            },
            {
                timeout: 15000,
                timeoutMsg: "'Profile button' not found within 15 seconds.",
            }
        );

        // Assert the button exists
        expect(isProfileButtonPresent).to.be.true;
        console.log("'Profile button' found.");

        // Click the Profile button
        const profileButton = await driver.$(profileButtonSelector);
        await profileButton.click();
        console.log("Profile button clicked, navigating to the next screen!");
    });
});
