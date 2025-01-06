import { setupEnvironment } from './setup.mjs';
import { expect } from 'chai';
import { initializeDriver, getDriver } from './driverManager.mjs';
import { generateCapabilities, getConnectedDevices } from './deviceCapabilities.mjs'; // Import the required functions
// import './testingdevice.test.mjs'; // Import other test cases
// import './basic.test.mjs';
// import './validateLogo.test.mjs';
// import './logout.test.mjs'
// import './vuninstall.test.mjs';
// import './testingdevice.test.mjs'002.test.mjs'
// import './vv16.test.mjs';
// import './32.test.mjs'
// import './37.test.mjs'
import './validatingEmptyFeilds.test.mjs'
// import './38.test.mjs'
import './43.test.mjs'
import './vv59.test.mjs';
// import './vvvvchosedefaultvehicle.test.mjs'
// import './vvdashboard.test.mjs'
// import './renamemodel.test.mjs'
// import './vvveditaddress.test.mjs'
// import './50.test.mjs'
// import './62.test.mjs'
// import './DLuploading.test.mjs'
// import './RCuploading.test.mjs'
// import './ICuploading.test.mjs'



describe('Master Test Suite', function () {
    let driver;
    this.timeout(80000); 
    let globalCapibilities;
    before(async function () {
        console.log('Setting up environment...');
        await setupEnvironment(); // Ensure devices and app are ready
        console.log('Environment setup complete.');
        console.log('Setting up environment...');
        const devices = getConnectedDevices();
        if (devices.length === 0) {
            throw new Error('No devices connected. Please connect a device to proceed.');
        }
        const deviceId = devices[0];
        globalCapibilities = generateCapabilities(deviceId);
        await initializeDriver(globalCapibilities);
    });

    it('should initialize the shared driver', async function () {
        const currentDriver = await getDriver(); // This should return the initialized driver
        expect(currentDriver).to.not.be.null;
    });

    it('should execute all test cases sequentially', async function () {
        console.log('Executing test cases...');
    });

    after(async function () {
        console.log('Cleaning up...');
        if (driver) {
            await driver.deleteSession();
            console.log('Driver session closed.');
        } else {
            console.log('Driver session was not created. Skipping cleanup.');
        }
    });
});

