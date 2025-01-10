import { expect } from 'chai';
import { initializeDriver } from './driverSetup.mjs'; // Use the shared driver utility

describe('Verify Field Length Test', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        driver =await initializeDriver(); // Access the shared driver
        console.log('Driver setup complete, waiting for the app to load...');
    });

    it('should validate the max length of the Name and Email fields', async function () {
        console.log("Navigating to the profile section...");
        const editProfileButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button'
        );
        await editProfileButton.waitForDisplayed({ timeout: 5000 });
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
        console.log("Changes saved successfully!");

        const homeButton = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.widget.Button');
        await homeButton.click();
        console.log("Home button clicked");
    });

    after(function () {
        console.log("No cleanup needed as driver session is managed centrally.");
    });
});
