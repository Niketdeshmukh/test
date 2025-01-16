import { expect } from 'chai';
import { remote } from 'webdriverio';
import { execSync } from 'child_process'; // Import for executing adb commands
import { initializeDriver } from '../driverSetup.mjs';

describe('Change DP Test', function () {
    let driver;

    before(async function () {
        this.timeout(40000);
        driver = await initializeDriver();
        console.log(driver)
        
        try {
    // Push file to emulator
    const adbCommand = `adb -s emulator-5554 push ./assets/images.jpeg /storage/emulated/0/Download/`;
    execSync(adbCommand);
    console.log("Picture uploaded successfully");

    // Wait for the app to be ready
    await driver.pause(5000);

    // Locate the element (use a more reliable locator if available)
    const profilePicture = await driver.$("android=new UiSelector().resourceId('com.simpleenergy.app:id/profilePicture')");
    await profilePicture.click();
    console.log("Profile picture updated");

} catch (error) {
    console.error("Error occurred:", error.message);
    throw new Error("Failed to change the profile picture.");
}

    });

    it('should change the profile picture', async function () {
        this.timeout(40000);
        const profileButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]');
        await profileButton.click();
        const editButton = await driver.$(
            `//android.widget.TextView[@text="edit details"]`
        );
        await editButton.click();

        await driver.waitUntil(
            async () => {
                const changeDPButton = await driver.$(
                    '//android.widget.ScrollView/android.view.View[3]/android.widget.Button'
                );
                return await changeDPButton.isExisting();
            },
            {
                timeout: 15000,
                timeoutMsg: "Change DP button not found within 15 seconds.",
            }
        );

        console.log("Clicking the Change DP button...");
        const changeDPButton = await driver.$(
            '//android.widget.ScrollView/android.view.View[3]/android.widget.Button'
        );
        await changeDPButton.click();
        const allowButton = await driver.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
        if(await allowButton.isDisplayed()){
            await allowButton.click();
        }
        const filePicker = await driver.$("//android.widget.TextView");
        await filePicker.waitForExist({ timeout: 10000 });

        const downloadsFolderXPath = '//android.widget.RelativeLayout';
        await driver.$(downloadsFolderXPath).waitForExist({ timeout: 5000 });
        await driver.$(downloadsFolderXPath).click();

        const imageFileXPath = '//android.widget.ImageView[@content-desc="Photo taken on Dec 26, 2024 2:57 PM"]';
        await driver.pause(2000);
        const imageFiles = await driver.$$(imageFileXPath);// Select all matching image elements
        console.log({imageFiles});
        
        if (imageFiles.length > 0) {
            console.log("Selecting the first available image...");
            await imageFiles[0].click();
        } else {
            throw new Error('No image files found in the Downloads folder.');
        }
        console.log("Waiting for Save Changes button...");
        const saveChangesButton = await driver.$(
            "//android.widget.ScrollView/android.view.View[3]/android.widget.Button"
        );
        await saveChangesButton.waitForExist({ timeout: 5000 });

        console.log("Saving the changes...");
        await saveChangesButton.click();
    });

    after(async function () {
        console.log('Ending the Change DP test session...');
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
