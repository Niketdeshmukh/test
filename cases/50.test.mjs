import { remote } from 'webdriverio';
import { expect } from 'chai';
import { initializeDriver } from './driverSetup.mjs';

describe('Logout Test', function () {
  let driver;

  before(async function () {
    this.timeout(30000); // 30 seconds for setup
    driver = await initializeDriver();
    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(2000);
  });

  it('should perform the logout operation', async function () {
    console.log('Navigating to the profile section...');
    // const profileButton = await driver.$(
    //   '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]'
    // );
    // await profileButton.click();
    // await driver.pause(2000);

    console.log('Navigating to the addresses section...');
    const addressesButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.widget.ScrollView/android.view.View/android.view.View[1]/android.widget.Button'
    );
    await addressesButton.click();
    await driver.pause(2000);

    console.log('Attempting to clear address...');
    const clearButton = await driver.$(
      '//android.widget.ScrollView/android.view.View[1]/android.view.View[1]/android.widget.Button'
    );
    await clearButton.click();
    await driver.pause(1000);

    console.log('Cancelling address clearing...');
    const noButton = await driver.$(
      '//android.widget.TextView[@resource-id="com.simpleenergy.app:id/clear_dialog_no_btn"]'
    );
    await noButton.click();
    const backButton = await driver.$(
      '//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button'
  );
  await backButton.click();
  console.log("Back button clicked.");
  const Homebutton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[1]/android.view.View[2]');
  await Homebutton.click();
  });

  after(async function () {
    console.log('Ending the logout test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
