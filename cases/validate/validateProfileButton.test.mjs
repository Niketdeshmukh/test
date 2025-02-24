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
        }
    });

    it("should find and click the Profile button", async function () {
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
        expect(isProfileButtonPresent).to.be.true;
        const profileButton = await driver.$(profileButtonSelector);
        await profileButton.click();
    });
});
