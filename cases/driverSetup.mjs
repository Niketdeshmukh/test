import { remote } from 'webdriverio';
import { execSync } from 'child_process';

function restartADB() {
  console.log('Restarting ADB server...');
  try {
    const output = execSync('adb devices', { encoding: 'utf-8' });

    if (!output.includes('device') || output.includes('unauthorized')) {
      console.warn('ADB is not connected properly. Restarting ADB...');
      execSync('adb kill-server');
      execSync('adb start-server');

      let retries = 5;
      while (retries > 0) {
        const checkOutput = execSync('adb devices', { encoding: 'utf-8' });
        if (checkOutput.includes('device') && !checkOutput.includes('unauthorized')) {
          console.log('ADB restarted successfully and device is recognized.');
          return;
        }
        console.warn('Waiting for device to be recognized...');
        execSync('sleep 3');
        retries--;
      }

      throw new Error('Device not recognized after restarting ADB.');
    } else {
      console.log('ADB is already running and device is connected.');
    }
  } catch (error) {
    console.error('Error checking ADB status:', error.message);
    throw error;
  }
}



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
    // console.warn(`No connected devices found. Retrying in ${delay / 1000} seconds...`);
    // execSync(`sleep ${delay / 1000}`);
  } catch (error) {
    console.error('Error fetching device name:', error.message);
    throw error;
  }
}

// Function to fetch platform version using ADB
function getPlatformVersion() {
  let retries = 3;
  while (retries > 0) {
    try {
      const output = execSync('adb shell getprop ro.build.version.release', { encoding: 'utf-8' }).trim();
      if (output) {
        console.log(`Platform version detected: ${output}`);
        return output;
      }
    } catch (error) {
      console.warn(`Error fetching platform version. Retrying... (${retries} attempts left)`);
      execSync('sleep 3');
      retries--;
    }
  }
  throw new Error('Failed to fetch platform version after multiple attempts.');
}


// Initialize WebDriver with dynamic capabilities
export async function initializeDriver() {
  console.log('Setting up driver...');
  
  // Restart ADB server before initializing driver
  restartADB();

  const deviceName = getDeviceName();
  const platformVersion = getPlatformVersion();

  const capabilities = {
    platformName: 'Android',
    'appium:deviceName': deviceName,
    'appium:platformVersion': platformVersion,
    'appium:app': '/home/niketdeshmukh/Desktop/TEST/tests/supershare.apk', // Path to your APK
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 0,
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
