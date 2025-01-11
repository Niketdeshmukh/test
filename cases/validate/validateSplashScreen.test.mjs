import { expect } from 'chai';
import { remote } from 'webdriverio';
import { initializeDriver } from './driverSetup.mjs';

describe('Splash Screen Validation', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        this.timeout(30000); // Allow 30 seconds for setup
        driver = await initializeDriver();
        console.log('Driver setup complete, waiting for the app to load...');
    });

    it('should validate the splash screen is visible', async function () {
        console.log('Re-launching the app...');
        await driver.pause(2000)
        await driver.execute('mobile: activateApp', { appId: 'com.simpleenergy.app' });
        console.log('App re-launched successfully. Validating splash screen...');

        const splashScreen = await driver.$('//android.widget.FrameLayout[@resource-id="com.simpleenergy.app:id/exo_subtitles"]/android.view.View');
        await splashScreen.waitForDisplayed({ timeout: 10000 });
        console.log('Splash screen element found. Verifying visibility...');

        const isSplashScreenDisplayed = await splashScreen.isDisplayed();
        console.log('Splash screen visibility:', isSplashScreenDisplayed);

        expect(isSplashScreenDisplayed, 'Splash screen should be visible').to.be.true;

        if (isSplashScreenDisplayed) {
            await driver.pause(2500); // Validate splash screen duration
            console.log('Splash screen duration validated.');
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
