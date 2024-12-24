import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from './driverSetup.mjs';
(async function documentUploadTest() {

    describe('Document Upload Flow', function () {
        let driver;
        before(async function () {
            console.log("Setting up driver...");
            this.timeout(30000);
            driver = await initializeDriver();
            console.log('Driver setup complete, waiting for the app to load...');
            await driver.pause(2000);  // Adjust pause time if necessary
        });

        it('should complete the document upload process', async function () {
            console.log("Step 1: Clicking on the initial button.");
            // const initialButton = await driver.$('//android.widget.ScrollView/android.view.View[2]/android.view.View/android.view.View[1]/android.widget.Button');
            // await initialButton.click();
            await driver.pause(1000);

            console.log("Step 2: Clicking on the Document button.");
            const documentButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.view.View/android.view.View/android.widget.Button');
            await documentButton.click();

            console.log("Step 3: Clicking on the Add Document button.");
            const addDocumentButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button');
            await addDocumentButton.click();

            console.log("Step 4: Clicking on Insurance certificate option.");
            const Insurancecertificate = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/ic_btn"]');
            await Insurancecertificate.click();

            console.log("Step 5: Checking if the Upload button is enabled.");
            const uploadButton = await driver.$('//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_upload_btn"]');
            const isUploadEnabled = await uploadButton.isEnabled();
            console.log(`Upload button enabled: ${isUploadEnabled}`);

            if (isUploadEnabled) {
                console.log("Step 6: Clicking on the enabled Upload button.");
                await uploadButton.click();

                console.log("Step 7: Navigating to the SD card and selecting the first PDF.");
                const file = await driver.$('(//android.widget.LinearLayout[@resource-id="com.google.android.documentsui:id/nameplate"])[2]/android.widget.RelativeLayout');
                await file.waitForDisplayed({ timeout: 5000 });
                console.log("PDF file found.");
                await file.click();
                await driver.pause(3000);

                console.log("Step 8: Focusing on the File Name field and entering 'Insurance certificate'.");
                const fileNameField = await driver.$('//android.widget.EditText[@resource-id="com.simpleenergy.app:id/document_title2_edittext"]');
                await fileNameField.setValue("Insurance");

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
                    const back = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button');
                    await back.click();
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
