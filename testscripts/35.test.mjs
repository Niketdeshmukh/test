import { expect } from 'chai';
import { remote } from 'webdriverio';

describe('Edit Details Empty Test', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        this.timeout(30000); // 30 seconds for setup
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
            logLevel: 'info',
            path: '/',
            port: 4725,
            capabilities,
        });

        console.log('Driver setup complete, waiting for the app to load...');
        await driver.pause(2000);
    });

    it('should clear the Name and Email fields and attempt to save changes', async function () {
        console.log("Waiting for the 'Edit Details' button to appear...");

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
        await driver.waitUntil(
            async () => {
                const saveButton = await driver.$(
                    'android=new UiSelector().className("android.widget.Button").instance(2)'
                );
                return await saveButton.isExisting();
            },
            {
                timeout: 10000,
                timeoutMsg: "'Save Changes' button not found within 10 seconds.",
            }
        );

        console.log("'Save Changes' button found. Clicking the button...");
        const saveButton = await driver.$(
            'android=new UiSelector().className("android.widget.Button").instance(2)'
        );
        await saveButton.click();

        console.log("Changes can't be saved because of empty fields!");
    });

    after(async function () {
        console.log("Ending the edit details test session...");
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
