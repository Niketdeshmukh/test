import { initializeDriver } from '../driverSetup.mjs';
describe('Edit Details Test', function () {
    let driver;

    before(async function () {
        this.timeout(30000); 
        driver = await initializeDriver();
        await driver.pause(2000);
    });

    it('should edit details and save changes successfully', async function () {
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
        const editButton = await driver.$(
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
        );
        await editButton.click();
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
        const nameField = await driver.$(
            'android=new UiSelector().className("android.widget.EditText")'
        );
        await nameField.setValue("testingg");

        const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
        await emailField.click();
        await emailField.clearValue();
        await emailField.click();
        await emailField.setValue('testing@gmail.com');
        const saveButton = await driver.$(
            `//android.widget.TextView[@text="SAVE CHANGES"]`
        );
        await saveButton.click();
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
