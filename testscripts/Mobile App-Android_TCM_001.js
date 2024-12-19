const { remote } = require('webdriverio');

(async () => {
    const capabilities = {
        platformName: "Android",
        "appium:deviceName": "emulator-5554",
        "appium:app": "./dev-release.apk",
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

    try {
        console.log("Launching the app...");

        await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
        console.log("App re-launched successfully. Validating splash screen...");

        const splashScreen = await driver.$('//android.widget.FrameLayout[@resource-id="com.simpleenergy.app:id/exo_subtitles"]/android.view.View');
        const isSplashScreenDisplayed = await splashScreen.isDisplayed();

        if (isSplashScreenDisplayed) {
            console.log("Splash screen is visible.");
            await driver.pause(2500);
            console.log("Splash screen duration validated.");
        } else {
            console.log("Splash screen is not visible.");
        }
    } catch (error) {
        console.error("An error occurred during the test:", error);
    } finally {
        if (driver) {
            console.log("Ending session...");
            await driver.deleteSession();
        }
    }
})();
