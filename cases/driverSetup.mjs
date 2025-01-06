import { remote } from 'webdriverio';
import { execSync } from 'child_process';

// Function to fetch device name using ADB
function getDeviceName() {
  try {
    const output = execSync('adb devices', { encoding: 'utf-8' });
    const lines = output.split('\n');
    for (const line of lines) {
      if (line.includes('device') && !line.includes('List of devices attached') && !line.includes('offline')) {
        return line.split(/\s+/)[0]; // Extract device name (first word in the line)
      }
    }
    throw new Error('No connected devices found.');
  } catch (error) {
    console.error('Error fetching device name:', error.message);
    throw error;
  }
}


// Function to fetch platform version using ADB
function getPlatformVersion() {
  try {
    const output = execSync('adb shell getprop ro.build.version.release', { encoding: 'utf-8' });
    return output.trim(); // Return the platform version
  } catch (error) {
    console.error('Error fetching platform version:', error.message);
    throw error;
  }
}

// Initialize WebDriver with dynamic capabilities
export async function initializeDriver() {
  console.log('Setting up driver...');
  
  const deviceName = getDeviceName();
  const platformVersion = getPlatformVersion();

  const capabilities = {
    platformName: 'Android',
    'appium:deviceName': deviceName,
    'appium:platformVersion': platformVersion,
    'appium:app': './supershare.apk', // Path to your APK
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 120000,
    'appium:ensureWebviewsHavePages': true,
    'appium:nativeWebScreenshot': true,
    'appium:noReset': true,
    'appium:ignoreHiddenApiPolicyError': true,
    'appium:uiautomator2ServerLaunchTimeout': 120000, 

  };

  const driver = await remote({
    logLevel: 'info',
    path: '/',
    port: 4725,
    capabilities,
  });

  console.log('Driver setup complete, waiting for the app to load...');
  await driver.pause(2000);
  return driver;
}
