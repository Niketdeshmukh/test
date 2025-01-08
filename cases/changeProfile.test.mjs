import { expect } from 'chai';
import { remote } from 'webdriverio';
import { execSync } from 'child_process'; // Import for executing adb commands
import { initializeDriver } from './driverSetup.mjs';

describe('Change DP Test', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        this.timeout(30000); // 30 seconds for setup
        driver = await initializeDriver();
        console.log('Driver setup complete, waiting for the app to load...');
        
        // Push the profile picture to the correct Downloads folder on the emulator
        console.log('Pushing profile picture to emulator Downloads folder...');
        try {
            // Push the image to the emulator's internal storage Downloads folder
            execSync('adb -s emulator-5554 push ./images.jpeg /storage/emulated/0/Download/');
            console.log('Profile picture pushed successfully to the Downloads folder.');
        } catch (error) {
            console.error('Error pushing profile picture:', error);
            throw new Error('Failed to push profile picture to emulator Downloads folder');
        }

        await driver.pause(2000);
    });

    it('should change the profile picture', async function () {
        console.log("Clicking the Edit button...");
        const profileButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]');
        await profileButton.click();
        const editButton = await driver.$(
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
        );
        await editButton.click();

        console.log("Waiting for the Change DP button...");
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

        console.log("Waiting for file picker to appear...");
        const filePicker = await driver.$("//android.widget.TextView");
        await filePicker.waitForExist({ timeout: 10000 });

        console.log("Selecting the Downloads folder...");
        const downloadsFolderXPath = '//android.widget.RelativeLayout';
        await driver.$(downloadsFolderXPath).waitForExist({ timeout: 5000 });
        await driver.$(downloadsFolderXPath).click();

        console.log("Looking for image files in the Downloads folder...");
        const imageFileXPath = '//android.widget.ImageView[contains(@content-desc, ".png") or contains(@content-desc, ".jpeg") or contains(@content-desc, ".jpg")]';
        const imageFiles = await driver.$$(`${imageFileXPath}`); // Select all matching image elements
        
        if (imageFiles.length > 0) {
            console.log("Selecting the first available image...");
            await imageFiles[0].click();  // Click the first image found
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
