import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';
describe("Profile Button Functionality", function () {
    let driver;

    before(async function () {
        driver = await initializeDriver();
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
