import { getConnectedDevices, generateCapabilities } from './deviceCapabilities.mjs';
import { initializeDriver, cleanupDriver } from './driverManager.mjs';

export async function setupEnvironment() {
    const devices = getConnectedDevices();

    if (devices.length === 0) {
        throw new Error("No devices found. Please connect a device or start an emulator.");
    }

    const deviceId = devices[0]; // Use the first connected device
    const capabilities = generateCapabilities(deviceId);

    console.log(`Preparing environment on device: ${capabilities['appium:deviceName']} (Version: ${capabilities['appium:platformVersion']})`);
    
    const driver = await initializeDriver(capabilities);

    try {
        console.log('.////////////////////////////////////////eafaesfaefefaefeafeafeafafafafafafafafa');
        
    } catch (error) {
        console.error('Error during setup:', error);
    } finally {
        await cleanupDriver();
    }
}
