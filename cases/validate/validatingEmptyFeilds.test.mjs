import { expect } from 'chai';
import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';

describe('Edit Details Empty Test', function () {
    let driver;

    before(async function () {
        this.timeout(40000); // 30 seconds for setup
        driver = await initializeDriver();
        await driver.pause(2000);
    });

    it('should clear the Name and Email fields and attempt to save changes', async function () {
        this.timeout(30000); 
        const profileButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]');
        await profileButton.click();

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
        const editButton = await driver.$(
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
        );
        await editButton.click();
        await driver.waitUntil(
            async () => {
                const nameField = await driver.$(
                    'android=new UiSelector().className("android.widget.EditText")'
                );
                return await nameField.isDisplayed();
            },
            {
                timeout: 20000,
                timeoutMsg: "Name field not found within 20 seconds.",
            }
        );
        const nameField = await driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
        await nameField.setValue("");

        const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        await emailField.click(); 
        await emailField.clearValue();
        const saveButton = await driver.$(
            'android=new UiSelector().className("android.widget.Button").instance(2)'
        );

        if (await saveButton.isExisting()) {
            await saveButton.click();
        } else {
            console.log("'Save Changes' button not found. Skipping save action and proceeding.");
        }
        const backButton = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.widget.Button');
        if (!(await backButton.isDisplayed())) {
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

        if (await backButton.isDisplayed()) {
            await driver.pause(2000);
            await backButton.click();
        }
    });

    after(async function () {
        console.log("Ending the edit details test session...");
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
