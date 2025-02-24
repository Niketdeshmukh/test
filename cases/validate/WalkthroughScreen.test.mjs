import { expect } from 'chai';
import { remote } from 'webdriverio';
import { initializeDriver } from '../driverSetup.mjs';
describe('Walkthrough Screens Validation', function () {
    let driver;

    before(async function () {
        this.timeout(30000); 
        driver = await initializeDriver();
    });

    it('should validate and navigate through walkthrough screens', async function () {
        const cardXPaths = [
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]",
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]",
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]",
        ];
        await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
        const { width, height } = await driver.getWindowRect();
        await driver.pause(4000);

        for (let i = 0; i < cardXPaths.length; i++) {
            const element = await driver.$(cardXPaths[i]);
            const isDisplayed = await element.isDisplayed();
        
            expect(isDisplayed, `Card ${i + 1} should be displayed`).to.be.true;
        
            if (i < cardXPaths.length - 1) {
                await driver.performActions([
                    {
                        type: "pointer",
                        id: "finger1",
                        parameters: { pointerType: "touch" },
                        actions: [
                            { type: "pointerMove", duration: 0, x: width * 0.9, y: height / 2 },
                            { type: "pointerDown", button: 0 },
                            { type: "pointerMove", duration: 500, x: width * 0.1, y: height / 2 },
                            { type: "pointerUp", button: 0 },
                        ],
                    },
                ]);
                await driver.pause(1000);
            } else {
                console.log('Completed all swipes. Exiting loop.');
            }
        }
        
        console.log('Successfully validated walkthrough screens and navigation.');
    });

    after(async function () {
        console.log('Closing driver session...');
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
