import { expect } from "chai";
import { remote } from "webdriverio";
import { initializeDriver } from '../driverSetup.mjs';
describe("Manage Address Test", function () {
    let driver;

    before(async function () {
        console.log("Setting up the driver...");
        this.timeout(30000); // Allowing enough time for driver setup
        driver = await initializeDriver();
        console.log("Driver setup complete.");
    });

    it("should update the Home address", async function () {
        this.timeout(30000); // Allowing enough time for the test steps

        // Step 1: Click on the Profile button
        const profileButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]'
        );
        await profileButton.click();
        await driver.pause(2000);

        // Step 2: Click on the Address button
        const addressButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[1]/android.widget.Button'
        );
        await addressButton.click();
        await driver.pause(2000);

        // Step 3: Click on the Edit button for the Home address
        const editHomeButton = await driver.$(
            '//android.widget.ScrollView/android.view.View[1]/android.view.View[3]/android.widget.Button'
        );
        await editHomeButton.click();
        await driver.pause(2000);

        // Step 4: Set the fixed address into the EditText field for Home address
        const fixedAddress = "252, Sucasa Golden Park, 4th Main Road, Rams Lake View Meadows, Vinayak Nagar, Kattigenahalli, Bengaluru, Karnataka. 33 m from OYO Hotel, Pin-560063 (India)";
        const homeAddressEditText = await driver.$('//android.widget.EditText');
        await homeAddressEditText.setValue(fixedAddress); // Setting the fixed address
        console.log("Home address updated with the fixed address:", fixedAddress);

        // Step 5: Check if the Confirm button is enabled
        const confirmButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.Button'
        );
        const isEnabled = await confirmButton.isEnabled();

        expect(isEnabled).to.be.true;

        await confirmButton.click();
        await driver.pause(2000); 
        const backButton = await driver.$(
            '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button'
        );
        await backButton.click();
        const backButton1 = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.widget.Button');
        await backButton1.click();
    });

    after(async function () {
        console.log("Ending the test session...");
        if (driver) {
            await driver.deleteSession();
            console.log("Driver session ended.");
        }
    });
});
