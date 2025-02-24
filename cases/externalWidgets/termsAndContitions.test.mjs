import { initializeDriver } from '../driverSetup.mjs';
(async function termsAndConditions() {

    describe('Ridirect on clicking T&C ', function () {
        let driver;
        before(async function () {
            this.timeout(30000);
            driver = await initializeDriver();
        })
        it('should redirect to browser',async function(){
            const profileButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]');
            await profileButton.click();
            const termsAndConditionsbutton = await driver.$('//android.widget.TextView[@text="Terms & Conditions"]');
            await termsAndConditionsbutton.click();
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
