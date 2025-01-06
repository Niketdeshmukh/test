import { execSync } from 'child_process';

// Function to execute adb command and retrieve output
function getPlatformVersion(deviceId) {
    const adbCommand = `adb -s ${deviceId} shell getprop ro.build.version.sdk`;
    let platformVersion = execSync(adbCommand).toString().trim();

    // Mapping of API levels to Android platform versions
    const apiToVersionMapping = {
        '35': '15.0',
        '34': '14',
        '33': '13',
        '32': '12.1',
        '31': '12',
        '30': '11',
        '29': '10',
        '28': '9',
        '27': '8.1',
        '26': '8.0',
        '25': '7.1',
        '24': '7.0',
        '23': '6.0',
        '22': '5.1',
        '21': '5.0',
        '20': '4.4W',
        '19': '4.4',
        '18': '4.3',
        '17': '4.2',
        '16': '4.1',
        '15': '4.0.3',
        '14': '4.0',
        '13': '3.2',
        '12': '3.1',
        '11': '3.0',
        '10': '2.3.3',
        '9': '2.3',
        '8': '2.2',
        '7': '2.1',
        '6': '2.0.1',
        '5': '2.0',
        '4': '1.6',
        '3': '1.5',
        '2': '1.1',
        '1': '1.0'
    };

    // If the API level exists in the mapping, use the corresponding version
    platformVersion = apiToVersionMapping[platformVersion] || platformVersion;

    return platformVersion;
}


// Function to get device properties dynamically
function getDeviceProperties(deviceId) {
    const properties = {};
    properties.version = getPlatformVersion(deviceId);  // Dynamically fetch SDK version for the device
    return properties;
}

// Function to generate capabilities dynamically
function generateCapabilities(deviceId) {
    const properties = getDeviceProperties(deviceId);

    return {
        "appium:platformName": "Android",
        "appium:deviceName": deviceId,  // Dynamically set device ID
        "appium:platformVersion": properties.version,  // Dynamically set platform version (SDK version)
        "appium:app": "./supershare.apk",  // Replace with your app path
        "appium:automationName": "UiAutomator2",
        // 'appium:appWaitActivity': 'com.simpleenergy.dev.views.splash.InitialActivity',
        "appium:noReset": true,
    "appium:fullReset": false,
    "appium:appActivity": "com.simpleenergy.dev.views.splash.InitialActivity",
    "appium:appWaitActivity": 'com.simpleenergy.app',
    "appium:appWaitDuration": 30000,
    };
}

// Function to get connected devices
function getConnectedDevices() {
    const deviceList = execSync('adb devices').toString();
    const deviceIds = deviceList.split('\n').slice(1).map(line => line.split('\t')[0]).filter(Boolean);
    return deviceIds;
}

// Example usage
const devices = getConnectedDevices();
if (devices.length > 0) {
    devices.forEach(deviceId => {
        const capabilities = generateCapabilities(deviceId);  // Use the correct device

        console.log(`Running tests on device: ${deviceId} (Version: ${capabilities['appium:platformVersion']})`);

        // You can now use these capabilities for WebDriver session setup as before
    });
} else {
    console.log("No devices connected.");
}


export {
    getConnectedDevices,
    getDeviceProperties,
    generateCapabilities,
    getPlatformVersion,
};
