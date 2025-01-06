import { remote } from 'webdriverio';
import { generateCapabilities, getConnectedDevices } from './deviceCapabilities.mjs';

let sharedDriver = null;

export async function initializeDriver(capabilities) {
    if (!sharedDriver) {
        console.log('Initializing driver...');
        sharedDriver = await remote({
            port: 4725,
            capabilities,
        });
        console.log('Driver initialized successfully.');
    }
    return sharedDriver;
}

export function getDriver() {
    if (!sharedDriver) {
        throw new Error('Driver not initialized. Call initializeDriver first.');
    }
    return sharedDriver;
}

export async function cleanupDriver() {
    if (sharedDriver) {
        console.log('Cleaning up driver...');
        await sharedDriver.deleteSession();
        sharedDriver = null;
        console.log('Driver session closed.');
    }
}
