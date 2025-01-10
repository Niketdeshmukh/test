import { initializeDriver } from './driverSetup.mjs';
(async function termsAndConditions() {

    describe('Ridirect on clicking Owners Manual ', function () {
        let driver;
        before(async function () {
            this.timeout(30000);
            driver = await initializeDriver();
        })
        it('should redirect to browser',async function(){
            const ownersManualButton = await driver.$(`//android.widget.TextView[@text="Owner's Manual"]`);
            await ownersManualButton.click();
            await driver.pause(5000)
            await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
            
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
