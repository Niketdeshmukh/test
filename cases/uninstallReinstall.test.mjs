import { remote } from "webdriverio";
import { initializeDriver } from './driverSetup.mjs';
(async function uninstallAndReinstall() {

    describe('Unistall and install simple connect', function () {
        let driver;
        before(async function () {
            console.log("setting up driver...");
            this.timeout(30000);
            driver = await initializeDriver();
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
