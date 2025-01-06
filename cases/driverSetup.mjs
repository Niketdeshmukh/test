import { remote } from 'webdriverio';

export async function initializeDriver() {
  console.log('Setting up driver...');
  const capabilities = {
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:app': './supershare.apk',
    'appium:platformVersion': '15.0', // Path to your APK
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
