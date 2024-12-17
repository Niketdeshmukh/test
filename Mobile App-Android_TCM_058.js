const { remote } = require("webdriverio");

(async function uninstallAndReinstall() {
    const capabilities = {
        platformName: "Android",
        "appium:deviceName": "emulator-5554",
        "appium:app": "./dev-release.apk", // Path to your APK
        "appium:automationName": "UiAutomator2",
        "appium:newCommandTimeout": 300,
        "appium:ensureWebviewsHavePages": true,
        "appium:nativeWebScreenshot": true,
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
        // Uninstall the app
        await driver.removeApp('com.simpleenergy.app'); 
        console.log('App uninstalled successfully!');

        // Reinstall the app
        await driver.installApp("./dev-release.apk"); 
        console.log('App reinstalled successfully!');

    } catch (error) {
        console.log('An error occurred:', error);
    } finally {
        await driver.deleteSession();
    }
})();
