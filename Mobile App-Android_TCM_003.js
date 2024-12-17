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
        // Wait for the app to load (you can adjust the wait time as needed)
        await driver.pause(2000);

        // Find the logo using its XPath
        const logo = await driver.$('//android.widget.ImageView[@content-desc="Dashboard logo"]');
        
        // Check if the logo is displayed
        const isLogoDisplayed = await logo.isDisplayed();

        if (isLogoDisplayed) {
            console.log('Dashboard logo is displayed.');
        } else {
            console.log('Dashboard logo is not displayed.');
        }
    } catch (error) {
        console.log('An error occurred:', error);
    } finally {
        await driver.deleteSession();
    }
})();
