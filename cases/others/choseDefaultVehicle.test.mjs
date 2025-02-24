import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';
describe("Switching between vehicles models", function () {
    let driver;

    before(async function () {
        this.timeout(30000);
        driver = await initializeDriver();
    });

    it("should change the default vehicle", async function () {
        this.timeout(30000); 
        const homeButton = driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
        await homeButton.click();

        await driver.pause(2000);
        const chooseButton=await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[2]/android.view.View')
        if (!(await chooseButton.isDisplayed())) {
            const { width, height } = await driver.getWindowRect();
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.2 },
                        { type: "pointerDown", button: 0 },
                        { type: "pointerMove", duration: 500, x: width / 2, y: height * 0.8 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.releaseActions();
        }

        if (await chooseButton.isDisplayed()) {
            await chooseButton.click();
        }

        await driver.pause(3000);
        const vehicleCardButton = await driver.$(
            '(//android.widget.ImageView[@content-desc="Vehicle Color"])[1]'
        );
        await vehicleCardButton.click();
        console.log("Edit Home button clicked.");
        await driver.pause(2000);
        const setDefaultButton = await driver.$(
            '//android.widget.Button'
        );
        await setDefaultButton.waitForDisplayed({timeout:10000})
        await setDefaultButton.click();
        const confirmButton= await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_yes_btn"]');
        if(await confirmButton.isDisplayed()){
            await confirmButton.click();
        }
        const backButton = driver.$('//android.widget.Button');
        await backButton.click();
    });

    after(async function () {
        console.log("Ending the test session...");
        if (driver) {
            await driver.deleteSession();
            console.log("Driver session ended.");
        }
    });
});
