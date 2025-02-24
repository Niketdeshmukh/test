import { expect } from 'chai';
import { initializeDriver } from '../driverSetup.mjs';

describe('Logo Validation', function () {
    let driver;
    
    before(async function () {
        this.timeout(30000);
        driver = await initializeDriver();
    });

    it('should display the dashboard logo', async function () {
        this.timeout(30000);
        const logo = await driver.$('//android.widget.ImageView[@content-desc="Dashboard logo"]');
        await logo.waitForDisplayed({ timeout: 15000 });
        const isLogoDisplayed = await logo.isDisplayed();
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
