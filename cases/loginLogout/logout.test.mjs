import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';

describe("User Logout Functionality", function () {
    let driver;

    before(async function () {
        driver = await initializeDriver();
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
            '//android.widget.TextView[@text="Logout"]'
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
