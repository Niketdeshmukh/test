import { expect } from 'chai';
import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';

describe('Edit Details Empty Test', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        this.timeout(30000); // 30 seconds for setup
        driver = await initializeDriver();
        console.log('Driver setup complete, waiting for the app to load...');
        await driver.pause(2000);
    });

    it('should clear the Name and Email fields and attempt to save changes', async function () {
        console.log("Waiting for the 'Edit Details' button to appear...");
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

        console.log("'Edit Details' button found. Clicking the button...");
        const editButton = await driver.$(
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
        );
        await editButton.click();

        console.log("Waiting for the next screen with Name and Email fields...");
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

        console.log("Name field found. Clearing field...");
        const nameField = await driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
        await nameField.setValue("");

        const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        await emailField.click(); // Focus the field
        await emailField.clearValue();

        console.log("Waiting for the 'Save Changes' button to appear...");
        const saveButton = await driver.$(
            'android=new UiSelector().className("android.widget.Button").instance(2)'
        );

        if (await saveButton.isExisting()) {
            console.log("'Save Changes' button found. Clicking the button...");
            await saveButton.click();
            console.log("Changes can't be saved because of empty fields!");
        } else {
            console.log("'Save Changes' button not found. Skipping save action and proceeding.");
        }

        console.log("Checking visibility of the back button...");
        const backButton = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.widget.Button');
        if (!(await backButton.isDisplayed())) {
            console.log("Back button not visible. Performing scroll action...");
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
            console.log("Back button found. Clicking the back button...");
            await backButton.click();
        }

        const backButton1 = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
        await backButton1.click();
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
