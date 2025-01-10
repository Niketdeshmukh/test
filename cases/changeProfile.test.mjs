import { expect } from 'chai';
import { remote } from 'webdriverio';
import { execSync } from 'child_process'; // Import for executing adb commands
import { initializeDriver } from './driverSetup.mjs';

describe('Change DP Test', function () {
    let driver;

    before(async function () {
        this.timeout(30000);
        driver = await initializeDriver();
        
        try {
            execSync('adb -s emulator-5554 push ./images.jpeg /storage/emulated/0/Download/');
        } catch (error) {
            console.error('Error pushing profile picture:', error);
            throw new Error('Failed to push profile picture to emulator Downloads folder');
        }
        await driver.pause(2000);
    });

    it('should change the profile picture', async function () {
        const profileButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]');
        await profileButton.click();
        const editButton = await driver.$(
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
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
        }sd

        // console.log("Waiting for Save Changes button...");
        // const saveChangesButton = await driver.$(
        //     "//android.widget.ScrollView/android.view.View[3]/android.widget.Button"
        // );
        // await saveChangesButton.waitForExist({ timeout: 5000 });

        // console.log("Saving the changes...");
        // await saveChangesButton.click();
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