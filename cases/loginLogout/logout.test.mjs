import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';

describe("User Logout Functionality", function () {
    let driver;

    before(async function () {
        driver = await initializeDriver();
    });

    after(async function () {
        if (driver) {
            await driver.deleteSession();
        }
    });

    it("should successfully log out the user", async function () {
        this.timeout(30000);
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
        const logoutButton = await driver.$(
            '//android.widget.TextView[@text="Logout"]'
        );
        await logoutButton.click();
        await driver.pause(1000);
        const confirmButton = await driver.$(
            '//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_yes_btn"]'
        );
        await confirmButton.waitForDisplayed({ timeout: 5000 });
    
        const isDisplayed = await confirmButton.isDisplayed();
        expect(isDisplayed).to.be.true;
    
        await confirmButton.click();
    });
    
});
