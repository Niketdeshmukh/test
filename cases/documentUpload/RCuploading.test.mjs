import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';
import { execSync } from 'child_process';
(async function documentUploadTest() {

    describe('Document Upload Flow', function () {
        let driver;
        before(async function () {
            console.log("Setting up driver...");
            driver = await initializeDriver();
            try {
                execSync('adb -s emulator-5554 push ./images.pdf /storage/emulated/0/Download/');
            } catch (error) {
                console.error('Error pushing profile picture:', error);
                throw new Error('Failed to push profile picture to emulator Downloads folder');
            }
            console.log('Driver setup complete, waiting for the app to load...');
            await driver.pause(2000);  // Adjust pause time if necessary
        });

        it('should complete the document upload process', async function () {
            this.timeout(40000);

            const documentButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.widget.Button');
            await documentButton.click();

            const addDocumentButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button');

            await addDocumentButton.click();

            const RegistrationCardOption = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/rc_btn"]');
            await RegistrationCardOption.click();

            const uploadButton = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_upload_btn"]');
            const isUploadEnabled = await uploadButton.isEnabled();

            if (isUploadEnabled) {
                await uploadButton.click();
                const directoryOption = await driver.$(`//android.widget.ImageButton[@content-desc="Show roots"]`);
                await driver.pause(1000);
                await directoryOption.click();
                const downloadsFolder = await driver.$('//android.widget.TextView[@resource-id="android:id/title" and @text="Downloads"]');
                // await downloadsFolder.waitForDisplayed({ timeout: 2000 });
                await downloadsFolder.click();
                const file = await driver.$('//android.widget.TextView[@resource-id="android:id/title" and @text="images.pdf"]');
                await file.waitForDisplayed({ timeout: 2000 });
                await file.click();
                await driver.pause(2000);

                const fileNameField = await driver.$('//android.widget.EditText[@resource-id="com.simpleenergy.app:id/document_title2_edittext"]');
                await fileNameField.setValue("Registration");

                const submitButton = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_save_btn"]');
                const isSubmitEnabled = await submitButton.isEnabled();

                if (isSubmitEnabled) {
                    await submitButton.click();
                    await driver.pause(6000);

                    const addedFile = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[1]');
                    const isFileAdded = await addedFile.isDisplayed();

                    const deleteButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[1]/android.view.View/android.widget.Button');
                    await deleteButton.click();

                    const confirmDelete = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_yes_btn"]');
                    await confirmDelete.click();
                    await driver.pause(5000);

                    const backButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
                    await backButton.click();
                } else {
                    console.log("Submit button is not enabled. Exiting process.");
                }
            } else {
                console.log("Upload button is not enabled. Exiting process.");
            }
        });

        after(async function () {
            if (driver) {
                await driver.deleteSession();
                console.log('Driver session closed');
            } else {
                console.log('Driver session not created. Skipping session cleanup');
            }
        });
    });
})();
