import { expect } from 'chai';
import { remote } from 'webdriverio';

describe('Walkthrough Screens Validation', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        this.timeout(30000); // Allow 30 seconds for setup
        const capabilities = {
            platformName: "Android",
            "appium:deviceName": "emulator-5554",
            "appium:app": "./dev-release.apk",
            "appium:automationName": "UiAutomator2",
            "appium:newCommandTimeout": 300,
            "appium:noReset": true,
            "appium:ignoreHiddenApiPolicyError": true,
        };

        driver = await remote({
            logLevel: 'info',
            path: '/',
            port: 4725,
            capabilities,
        });

        console.log('Driver setup complete, waiting for the app to load...');
    });

    it('should validate and navigate through walkthrough screens', async function () {
        const cardXPaths = [
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]",
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]",
            "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]",
        ];

        console.log('Launching the app...');
        await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
        const { width, height } = await driver.getWindowRect();
        await driver.pause(4000);

        for (let i = 0; i < cardXPaths.length; i++) {
            const element = await driver.$(cardXPaths[i]);
            const isDisplayed = await element.isDisplayed();

            expect(isDisplayed, `Card ${i + 1} should be displayed`).to.be.true;

            if (i < cardXPaths.length - 1) {
                console.log(`Swiping to card ${i + 2}...`);
                await driver.performActions([
                    {
                        type: "pointer",
                        id: "finger1",
                        parameters: { pointerType: "touch" },
                        actions: [
                            { type: "pointerMove", duration: 0, x: width * 0.8, y: height / 2 },
                            { type: "pointerDown", button: 0 },
                            { type: "pointerMove", duration: 500, x: width * 0.4, y: height / 2 },
                            { type: "pointerUp", button: 0 },
                        ],
                    },
                ]);
                await driver.pause(2000);
            }
        }

        console.log('Navigating backward through cards...');
        for (let i = cardXPaths.length - 1; i > 0; i--) {
            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x: width * 0.4, y: height / 2 },
                        { type: "pointerDown", button: 0 },
                        { type: "pointerMove", duration: 500, x: width * 0.8, y: height / 2 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            await driver.pause(2000);
        }

        console.log('Navigating to the Enter Mobile Number screen...');
        const signinButton = await driver.$('//android.widget.Button');
        await signinButton.click();

        const enterNumberScreen = await driver.$(
            '//android.widget.FrameLayout[@resource-id="com.google.android.gms:id/design_bottom_sheet"]/android.widget.LinearLayout'
        );

        const isScreenDisplayed = await enterNumberScreen.isDisplayed();
        expect(isScreenDisplayed, 'Enter Mobile Number screen should be visible').to.be.true;
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
