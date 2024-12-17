import { remote } from 'webdriverio';
import fs from 'fs';
import { expect } from 'chai';

describe('Edit Details Test', function () {
    let driver;

    before(async function () {
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

    it('should edit details and save changes successfully', async function () {
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

        console.log("Filling in the Name and Email fields...");
        const nameField = await driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
        await nameField.setValue("testingg");

        const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        await emailField.click();
        await emailField.clearValue();
        await emailField.click();
        await emailField.setValue('testing@gmail.com');

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

        console.log("Changes saved successfully!");
        const homeButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
        await homeButton.click();
        console.log("Home button clicked");
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
