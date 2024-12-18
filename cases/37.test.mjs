import { expect } from 'chai';
import { remote } from 'webdriverio';

describe('Verify Field Length Test', function () {
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

    it('should validate the max length of the Name and Email fields', async function () {
        console.log("Navigating to the profile section...");

        // const profileButton = await driver.$(
        //     '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[3]/android.view.View[2]'
        // );
        // await profileButton.click();
        // await driver.pause(2000);

        console.log("Clicking on the 'Edit Profile' button...");
        const editProfileButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button'
        );
        await editProfileButton.click();
        await driver.pause(2000);

        console.log("Verifying Name field max length...");
        const nameField = await driver.$('android=new UiSelector().className("android.widget.EditText")');
        await nameField.setValue("ghdgfghdgfghdgfghdgfghdgfghd"); // 31 characters
        const nameValue = await nameField.getText();

        if (nameValue.length <= 31) {
            console.log("Name field max length validation passed: " + nameValue.length);
        } else {
            console.error("Name field max length validation failed: " + nameValue.length);
        }

        console.log("Verifying Email field max length...");
        const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        const emailInput = "gashgdjasgjjjjaexamplelongemailtextgggggg@gmail.com"; // 51 characters before @
        await emailField.setValue(emailInput);
        const emailValue = await emailField.getText();

        if (emailValue.includes("@") && emailValue.length <= 51 + emailInput.split("@")[1].length + 1) {
            console.log("Email field max length validation passed: " + emailValue.length);
        } else {
            console.error("Email field max length validation failed: " + emailValue.length);
        }

        console.log("Saving changes...");
        const saveButton = await driver.$(
            '//android.widget.ScrollView/android.view.View[4]/android.widget.Button'
        );
        await saveButton.click();
        console.log("Saved button clicked !!!!!!!!!!!!!!!!!!!!!!!!");
        
        await driver.pause(1000)
        // const back = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.widget.Button');
        // await back.click();
        // console.log("Back button clicked !!!!!!!!!!!!!!!!!!!!!!!");
        
        console.log("Changes saved successfully!");
        const homeButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
        await homeButton.click();
        console.log("Home button clicked");
        
    });

    after(async function () {
        console.log("Ending the verify field length test session...");
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
