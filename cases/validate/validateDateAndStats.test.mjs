import { remote } from "webdriverio";
import { expect } from "chai";
import { initializeDriver } from '../driverSetup.mjs';
describe('Validate Ride Statistics and Date Logic', function () {
    let driver;
    let widgetStatus = {
        co2SavedWidgets: false,
        moneySavedWidgets: false,
        topSpeedWidgets: false,
        averageSpeedWidgets: false,
        distanceCoveredWidgets: false,
        movingTimeWidgets: false,
        distanceCoveredPerModeWidgets: false
    };
    before(async function () {
        console.log("Setting up driver...");
        this.timeout(30000);
        driver = await initializeDriver();
        console.log('Driver setup complete, waiting for the app to load...');
    });

    it('should validate vertical scrolling and date logic', async function () {
        this.timeout(60000);
        console.log("Launching the app...");
        const homeButton = driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
        await homeButton.click()
        await driver.executeScript("mobile: activateApp", [{ appId: "com.simpleenergy.app" }]);

        console.log("Validating and navigating vertically...");
        const { width, height } = await driver.getWindowRect();

        // Scroll up vertically
        await driver.performActions([
            {
                type: "pointer",
                id: "finger1",
                parameters: { pointerType: "touch" },
                actions: [
                    { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.8 },
                    { type: "pointerDown", button: 0 },
                    { type: "pointerMove", duration: 500, x: width / 2, y: height * 0.1 },
                    { type: "pointerUp", button: 0 },
                ],
            },
        ]);
        await driver.pause(1000);

        console.log("Vertical scrolling completed.");

        const targetElement = await driver.$('//android.view.View[@content-desc="Ride Statistic"]');
        expect(await targetElement.isDisplayed()).to.be.true;
        console.log("Target element is visible after vertical scroll.");

        await targetElement.click();
        console.log("Target element clicked.");
        await driver.pause(1000);

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('en-US', {
            month: 'short',
        })}`;

        const dateElements = await driver.$$('//android.widget.TextView');
        let isDateMatched = false;

        for (const element of dateElements) {
            const text = await element.getText();
            if (text === formattedDate) {
                isDateMatched = true;
                console.log(`Today's date matched: ${formattedDate}`);
                break;
            }
        }

        if (!isDateMatched) {
            console.log(`Today's date (${formattedDate}) was not found on the screen.`);
        }
        const co2SavedWidgets = await driver.$(`//android.widget.TextView[@text="CO2
Saved"]`);
        widgetStatus.co2SavedWidgets = await co2SavedWidgets.isDisplayed();

        // Validate battery widgets
        const moneySavedWidgets = await driver.$(`//android.widget.TextView[@text="Money Saved"]`);
        widgetStatus.moneySavedWidgets = await moneySavedWidgets.isDisplayed();

        // Validate projected range widgets
        const topSpeedWidgets = await driver.$(`//android.widget.TextView[@text="Top
Speed"]`);
        widgetStatus.topSpeedWidgets = await topSpeedWidgets.isDisplayed();

        // Validate top speed widgets
        const averageSpeedWidgets = await driver.$(`//android.widget.TextView[@text="Average
Speed"]`);
        // await averageSpeedWidgets.waitForDisplayed({timeout:10000})
        widgetStatus.averageSpeedWidgets = await averageSpeedWidgets.isDisplayed();

        const distanceCoveredWidgets = await driver.$(`//android.widget.TextView[@text="Distance
Covered"]`);
        widgetStatus.distanceCoveredWidgets = await distanceCoveredWidgets.isDisplayed();

        const movingTimeWidgets = await driver.$(`//android.widget.TextView[@text="Distance
Covered"]`);
        widgetStatus.movingTimeWidgets = await movingTimeWidgets.isDisplayed();

        await driver.performActions([
            {
                type: "pointer",
                id: "finger2", // for scroll down
                parameters: { pointerType: "touch" },
                actions: [
                    // Start near the top of the screen
                    { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.8 },
                    { type: "pointerDown", button: 0 },
                    // Move downwards
                    { type: "pointerMove", duration: 500, x: width / 2, y: height * 0.2 },
                    { type: "pointerUp", button: 0 },
                ],

            },

        ]);

        // await driver.pause(10000); // Allow time to observe the scroll

        await driver.releaseActions(); // Release the pointer actions

        const distanceCoveredPerModeWidgets = await driver.$('//android.widget.TextView[@text="Distance covered (km) per mode "]');
widgetStatus.distanceCoveredPerModeWidgets = await distanceCoveredPerModeWidgets.isDisplayed(); // Update the widgetStatus object
expect(widgetStatus.distanceCoveredPerModeWidgets).to.be.true;


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
        console.log("Scroll down gesture performed.");

        const backButton = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.view.View/android.widget.Button');
        await backButton.click();
        await driver.performActions([
            {
                type: "pointer",
                id: "finger3",
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
    });

    after(async function () {
        console.log('Widget Status:', widgetStatus);
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed');
        } else {
            console.log('Driver session not created. Skipping session cleanup');
        }
    });
});
