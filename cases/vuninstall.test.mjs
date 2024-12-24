import { remote } from "webdriverio";
(async function uninstallAndReinstall() {

    describe('Unistall and install simple connect', function () {
        let driver;
        before(async function () {
            console.log("setting up driver...");
            this.timeout(30000);
            const capabilities = {
                platformName: "Android",
                "appium:deviceName": "emulator-5554",
                "appium:app": "./supershare.apk", // Path to your APK
                "appium:automationName": "UiAutomator2",
                "appium:newCommandTimeout": 300,
                "appium:ensureWebviewsHavePages": true,
                "appium:nativeWebScreenshot": true,
                "appium:noReset": true,
                "appium:ignoreHiddenApiPolicyError": true,
            };

             driver = await remote({
                logLevel: "info",
                path: "/",
                port: 4725,
                capabilities,
            });
            console.log('Driver setup complete, waiting for the app to load...');
        await driver.pause(2000);  // Adjust pause time if necessary
        })
        it('should uninstall and install the app',async function(){
            console.log('Running log');
            await driver.removeApp('com.simpleenergy.app');
        console.log('App uninstalled successfully!');

        // Reinstall the app
        await driver.installApp("./supershare.apk");
        console.log('App reinstalled successfully!');
            
        })
        after(async function(){
            console.log('Closing driver session');
            if(driver){
                await driver.deleteSession();
                console.log('Driver session closed');
            }else{
                console.log('Driver session not created. Skipping session cleanup');
                
            }
        })
    })
})();
