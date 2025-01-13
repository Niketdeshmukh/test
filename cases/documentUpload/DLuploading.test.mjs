import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';
import { execSync } from 'child_process'; 
(async function documentUploadTest() {

    describe('Document Upload Flow', function () {
        let driver;
        before(async function () {
            this.timeout(60000);
        driver = await initializeDriver();
        
        try {
            execSync('adb -s emulator-5554 push ./images.pdf /storage/emulated/0/Download/');
        } catch (error) {
            console.error('Error pushing profile picture:', error);
            throw new Error('Failed to push profile picture to emulator Downloads folder');
        }
        // await driver.pause(2000);
        });

        it('should complete the document upload process', async function () {
            this.timeout(40000); 
            console.log("Step 1: Clicking on the initial button.");
            const initialButton = await driver.$('//android.widget.ScrollView/android.view.View[2]/android.view.View/android.view.View[1]/android.widget.Button');
            if (!(await initialButton.isDisplayed())) {
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
    
            await initialButton.click();
            // await driver.pause(1000);

            console.log("Step 2: Clicking on the Document button.");
            const documentButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.widget.Button');
            await documentButton.click();

            console.log("Step 3: Clicking on the Add Document button.");
            const addDocumentButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button');
            await addDocumentButton.click();

            console.log("Step 4: Clicking on Driver Licence option.");
            const driverLicenceOption = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/dl_btn"]');
            await driverLicenceOption.click();

            console.log("Step 5: Checking if the Upload button is enabled.");
            const uploadButton = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_upload_btn"]');
            const isUploadEnabled = await uploadButton.isEnabled();
            console.log(`Upload button enabled: ${isUploadEnabled}`);

            if (isUploadEnabled) {
                console.log("Step 6: Clicking on the enabled Upload button.");
                await uploadButton.click();
                const directoryOption = await driver.$(`//android.widget.ImageButton[@content-desc="Show roots"]`);
                await driver.pause(1000);
                await directoryOption.click();
                const downloadsFolder = await driver.$('//android.widget.TextView[@resource-id="android:id/title" and @text="Downloads"]');
                // await downloadsFolder.waitForDisplayed({ timeout: 2000 });
                await downloadsFolder.click();
                console.log("Step 7: Navigating to the SD card and selecting the first PDF.");
                const file = await driver.$('//android.widget.TextView[@resource-id="android:id/title" and @text="images.pdf"]');
                await file.waitForDisplayed({ timeout: 2000 });
                console.log("PDF file found.");
                await file.click();
                await driver.pause(2000);
                  
                const fileNameField = await driver.$('//android.widget.EditText[@resource-id="com.simpleenergy.app:id/document_title2_edittext"]');
                await fileNameField.waitForDisplayed({timeout:10000})
                await fileNameField.click();
                await fileNameField.setValue("Driving Licence");

                console.log("Step 9: Checking if the Submit button is enabled.");
                const submitButton = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_save_btn"]');
                const isSubmitEnabled = await submitButton.isEnabled();
                console.log(`Submit button enabled: ${isSubmitEnabled}`);

                if (isSubmitEnabled) {
                    console.log("Step 10: Clicking the Submit button.");
                    await submitButton.click();
                    await driver.pause(6000);
                    console.log("Document successfully submitted.");

                    console.log("Step 11: Confirming the file is added.");
                    const addedFile = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[1]');
                    const isFileAdded = await addedFile.isDisplayed();
                    console.log(`File added: ${isFileAdded}`);

                    console.log("Step 12: Clicking the Delete button.");
                    const deleteButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View[1]/android.view.View/android.widget.Button');
                    await deleteButton.click();

                    console.log("Step 13: Confirming deletion.");
                    const confirmDelete = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_yes_btn"]');
                    await confirmDelete.click();
                    await driver.pause(5000);

                    console.log("Step 14: Clicking the Back button.");
                    const backButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
                    await backButton.click();
                    console.log("Process completed.");
                } else {
                    console.log("Submit button is not enabled. Exiting process.");
                }
            } else {
                console.log("Upload button is not enabled. Exiting process.");
            }
        });

        after(async function () {
            console.log('Closing driver session');
            if (driver) {
                await driver.deleteSession();
                console.log('Driver session closed');
            } else {
                console.log('Driver session not created. Skipping session cleanup');
            }
        });
    });
})();
