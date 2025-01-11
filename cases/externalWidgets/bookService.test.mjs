import { initializeDriver } from '../driverSetup.mjs';
(async function bookService() {

    describe('Ridirect on clicking book service ', function () {
        let driver;
        before(async function () {
            console.log("setting up driver...");
            this.timeout(30000);
            driver = await initializeDriver();
        })
        it('should redirect to phone dailer', async function () {
            const bookServiceButton = await driver.$(`//android.view.View[@content-desc="service Icon"]`);
            await bookServiceButton.click();
            await driver.pause(5000)
            await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });

        })
        after(async function () {
            console.log('Closing driver session');
            if (driver) {
                await driver.deleteSession();
                console.log('Driver session closed');
            } else {
                console.log('Driver session not created. Skipping session cleanup');

            }
        })
    })
})();
