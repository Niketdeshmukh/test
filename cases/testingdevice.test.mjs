import { remote } from "webdriverio";
import { getConnectedDevices, generateCapabilities } from "./deviceCapabilities.mjs";

const appId = "com.simpleenergy.app";  // Replace with your app's package name
const appPath = "./supershare.apk";   // Replace with the correct path to your APK file
const OTP_DIGITS = ['1', '2', '3', '4'];
const OTP_FIELDS_XPATHS = [
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[2]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[3]/android.widget.EditText",
  "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[4]/android.widget.EditText",
];

async function waitForElement(client, selector, timeout = 5000) {
    const element = await client.$(selector);
    await element.waitForExist({ timeout });
    return element;
}

(async function main() {
    const devices = getConnectedDevices();

    if (devices.length === 0) {
        console.error("No devices found. Please connect a device or start an emulator.");
        return;
    }

    for (const deviceId of devices) {
        const capabilities = generateCapabilities(deviceId);

        console.log(`Running tests on device: ${capabilities['appium:deviceName']} (Version: ${capabilities['appium:platformVersion']})`);

        const client = await remote({
            port: 4725,
            capabilities: capabilities,
        });

        async function waitForAppToLaunch(driver) {
            try {
                await driver.waitUntil(
                    async () => (await driver.$('//android.widget.Button')).isDisplayed(),
                    {
                        timeout: 30000, // 30 seconds
                        timeoutMsg: 'App did not launch in time',
                    }
                );
            } catch (error) {
                console.error('App failed to launch properly:', error.message);
                throw error;
            }
        }

        try {
            // console.log(`Uninstalling app ${appId}...`);
            // await client.removeApp(appId);
            // console.log("App uninstalled successfully.");

            // console.log("Reinstalling the app...");
            // await client.installApp(appPath);
            // console.log("App installed successfully!");

            // // Launch the app
            // await client.execute('mobile: activateApp', {
            //     appPackage: appId,
            //     appId: appId
            // });
            // console.log("App launched successfully!");
            // waitForAppToLaunch(client);
            // await client.pause(10000);

            // Wait for the sign-in button to appear and be visible
            const signinButton = await waitForElement(client, '//android.widget.Button');
            await signinButton.waitForDisplayed({ timeout: 35000 }); // Wait for the button to be displayed

            const cancelButton = await client.$('//android.widget.ImageView[@content-desc="Cancel"]');
            const isCancelButtonDisplayed = await cancelButton.isDisplayed().catch(() => false); // Catch error if element not found

            if (await signinButton.isDisplayed()) {
                console.log("Sign-in button is visible. Proceeding with the test...");

                // Click the sign-in button
                await signinButton.click();
                // Wait for the cancel popup to appear and handle it
                if (isCancelButtonDisplayed) {
                    await cancelButton.click();
                    console.log('Popup canceled, proceeding to login screen...');
                } else {
                    console.log('Cancel button not visible, skipping popup.');
                }

                // Enter phone number
                const numberField = await client.$('//android.widget.EditText');
                await numberField.waitForDisplayed({ timeout: 5000 });
                await numberField.setValue('9480356496');
                console.log("Phone number entered.");

                // Submit phone number
                const submitButton = await client.$('//android.widget.Button');
                await submitButton.waitForDisplayed({ timeout: 5000 });
                await submitButton.click();
                console.log("Submitted phone number and waiting for OTP...");
                await client.pause(3000);

                // Enter OTP digits
                for (let i = 0; i < OTP_DIGITS.length; i++) {
                    const otpField = await client.$(OTP_FIELDS_XPATHS[i]);
                    await otpField.waitForDisplayed({ timeout: 7000 });
                    await otpField.setValue(OTP_DIGITS[i]);
                    console.log(`Entered OTP digit '${OTP_DIGITS[i]}' in field ${i + 1}`);
                }

                // Wait for permissions dialog and grant permission
                const allowButton = await client.$('//android.widget.Button[@resource-id="com.android.permissioncontroller:id/permission_allow_button"]');
                await allowButton.waitForDisplayed({ timeout: 7000 });
                await allowButton.click();
                console.log("Permissions granted.");

                // Verify the dashboard screen
                const dashboardElement = await client.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View');
                await dashboardElement.waitForDisplayed({ timeout: 15000 });
                console.log("Dashboard loaded successfully!");
            } else {
                console.log("Sign-in button not visible, waiting for the app to launch.");
            }

        } catch (err) {
            console.error("Error during test execution:", err);
        } finally {
            await client.deleteSession();
        }
    }
})();
