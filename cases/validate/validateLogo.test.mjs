import { expect } from 'chai';
import { initializeDriver } from '../driverSetup.mjs';

describe('Logo Validation', function () {
    let driver;
    
    before(async function () {
        driver = await initializeDriver();
    });

    it('should display the dashboard logo', async function () {
        this.timeout(30000);
        console.log('Running logo validation test...');
        
        const logo = await driver.$('//android.widget.ImageView[@content-desc="Dashboard logo"]');
        console.log('Found logo element. Waiting for logo to be displayed...');
        
        await logo.waitForDisplayed({ timeout: 15000 });
        console.log('Logo is displayed, verifying visibility...');
        
        const isLogoDisplayed = await logo.isDisplayed();
        console.log('Logo displayed:', isLogoDisplayed);
        
        expect(isLogoDisplayed, 'Dashboard logo should be visible').to.be.true;
    });

    after(async function () {
        console.log("Ending the edit details test session...");
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session not created. Skipping session cleanup.');
        }
    });
});
