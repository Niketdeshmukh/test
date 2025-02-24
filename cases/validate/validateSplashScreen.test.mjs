import { expect } from 'chai';
import { remote } from 'webdriverio';
import { initializeDriver } from './driverSetup.mjs';

describe('Splash Screen Validation', function () {
    let driver;

    before(async function () {
        this.timeout(30000); 
        driver = await initializeDriver();
    });

    it('should validate the splash screen is visible', async function () {
        await driver.pause(2000)
        await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
        const splashScreen = await driver.$('//android.widget.FrameLayout[@resource-id="com.simpleenergy.app:id/exo_subtitles"]/android.view.View');
        await splashScreen.waitForDisplayed({ timeout: 10000 });
        const isSplashScreenDisplayed = await splashScreen.isDisplayed();
        expect(isSplashScreenDisplayed, 'Splash screen should be visible').to.be.true;
        if (isSplashScreenDisplayed) {
            await driver.pause(2500); 
        }
    });

    after(async function () {
        console.log('Closing driver session...');
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
