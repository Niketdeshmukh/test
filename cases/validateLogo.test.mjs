import { expect } from 'chai';
import { remote } from 'webdriverio';
import { initializeDriver } from './driverSetup.mjs';
describe('Logo Validation', function () {
    let driver;

    before(async function () {
        console.log('Setting up driver...');
        this.timeout(30000); 
        driver = await initializeDriver();
        console.log('Driver setup complete, waiting for the app to load...');
        await driver.pause(12000);  // Adjust pause time if necessary
    });

    it('should display the dashboard logo', async function () {
        console.log('Running logo validation test...');
        
        const logo = await driver.$('//android.widget.ImageView[@content-desc="Dashboard logo"]');
        console.log('Found logo element. Waiting for logo to be displayed...');
        
        await logo.waitForDisplayed({ timeout: 15000 });  // Wait for the logo to be displayed
        console.log('Logo is displayed, verifying visibility...');
        
        const isLogoDisplayed = await logo.isDisplayed();
        
        console.log('Logo displayed:', isLogoDisplayed);
        expect(isLogoDisplayed, 'Dashboard logo should be visible').to.be.true;
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
