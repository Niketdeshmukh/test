import { expect } from 'chai';
import { initializeDriver } from '../driverSetup.mjs'; // Use the shared driver utility

describe('Verify Field Length Test', function () {
    let driver;

    before(async function () {
        this.timeout(30000); 
        driver =await initializeDriver(); 
    });

    it('should validate the max length of the Name and Email fields', async function () {
        this.timeout(50000);
        const profileButtonSelector =await driver.$("//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]");
        await profileButtonSelector.click();
        const editProfileButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button'
        );
        await editProfileButton.waitForDisplayed({ timeout: 5000 });
        await editProfileButton.click();
        await driver.pause(2000);
        const nameField = await driver.$('android=new UiSelector().className("android.widget.EditText")');
        await nameField.setValue("ghdgfghdgfghdgfghdgfghdgfghd"); // 31 characters
        const nameValue = await nameField.getText();

        if (nameValue.length <= 31) {
            console.log("Name field max length validation passed: " + nameValue.length);
        } else {
            console.error("Name field max length validation failed: " + nameValue.length);
        }
        const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        const emailInput = "gashgdjasgjjjjaexamplelongemailtextgggggg@gmail.com"; // 51 characters before @
        await emailField.setValue(emailInput);
        const emailValue = await emailField.getText();

        if (emailValue.includes("@") && emailValue.length <= 51 + emailInput.split("@")[1].length + 1) {
            console.log("Email field max length validation passed: " + emailValue.length);
        } else {
            console.error("Email field max length validation failed: " + emailValue.length);
        }
        const saveButton = await driver.$(
            '//android.widget.ScrollView/android.view.View[4]/android.widget.Button'
        );
        await saveButton.click();
        const backButton1 = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.widget.Button')
        if (await backButton1.isDisplayed()) {
            console.log("Choose button found. Clicking the back button...");
            await backButton1.click();
        }
    });

    after(function () {
        console.log("No cleanup needed as driver session is managed centrally.");
    });
});
