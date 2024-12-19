const { remote } = require("webdriverio");

(async function validateWalkthroughScreens() {
    const capabilities = {
        platformName: "Android",
        "appium:deviceName": "emulator-5554",
        "appium:app": "./dev-release.apk", // Path to your APK
        "appium:automationName": "UiAutomator2",
        "appium:newCommandTimeout": 300,
        "appium:noReset": true,
        "appium:ignoreHiddenApiPolicyError": true,
    };

    const driver = await remote({
        logLevel: "info",
        path: "/",
        port: 4725,
        capabilities,
    });

    const cardXPaths = [
        "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[1]",
        "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]",
        "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]",
    ];

    try {
        console.log("Launching the app...");
        await driver.executeScript("mobile: activateApp", [{ appId: "com.simpleenergy.app" }]);
        
        console.log("Validating and navigating through cards...");
        const { width, height } = await driver.getWindowRect();
await driver.pause(4000);
        for (let i = 0; i < cardXPaths.length; i++) {
            const element = await driver.$(cardXPaths[i]);
            const isDisplayed = await element.isDisplayed();

            if (isDisplayed) {
                console.log(`Card ${i + 1} is displayed.`);
            } else {
                throw new Error(`Card ${i + 1} is not displayed.`);
            }

            if (i < cardXPaths.length - 1) {
                console.log("Swiping to the next card...");
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

        console.log("Navigating backward...");
        for (let i = cardXPaths.length - 1; i > 0; i--) {
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
        await driver.pause(1000);
        const signinButton = await driver.$('//android.widget.Button');
        await signinButton.click();
        console.log("Navigating to the Enter Mobile Number screen...");
        const enterNumberScreen = await driver.$(`//android.widget.FrameLayout[@resource-id="com.google.android.gms:id/design_bottom_sheet"]/android.widget.LinearLayout`); 
        if (await enterNumberScreen.isDisplayed()) {
            console.log("Successfully navigated to the Enter Mobile Number screen.");
        } else {
            throw new Error("Failed to navigate to the Enter Mobile Number screen.");
        }
        if (await enterNumberScreen.isDisplayed()) {
            console.log("Successfully navigated to the Enter Mobile Number screen.");
            console.log("All three cards are displayed, and the Enter Mobile Number screen is visible.");
        } else {
            throw new Error("Failed to navigate to the Enter Mobile Number screen.");
        }
        
    } catch (error) {
        console.error("An error occurred during the test:", error);
    } finally {
        console.log("Ending session...");
        await driver.deleteSession();
    }
})();
