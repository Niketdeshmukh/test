import { initializeDriver } from '../driverSetup.mjs';
(async function rsa() {

    describe('Ridirect on clicking roadside assistance ', function () {
        let driver;
        before(async function () {
            console.log("setting up driver...");
            this.timeout(30000);
            driver = await initializeDriver();
        })
        it('should redirect to phone dailer', async function () {
            const homebutton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
            await homebutton.click();
            await driver.pause(2000)
            const { width, height } = await driver.getWindowRect();

            await driver.performActions([
                {
                    type: "pointer",
                    id: "finger1",
                    parameters: { pointerType: "touch" },
                    actions: [
                        { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.8 },
                        { type: "pointerDown", button: 0 },
                        { type: "pointerMove", duration: 500, x: width / 2, y: height * 0.1 },
                        { type: "pointerUp", button: 0 },
                    ],
                },
            ]);
            const rdabutton = await driver.$(`//android.view.View[@content-desc="phone icon"]`);
            await rdabutton.click();
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
