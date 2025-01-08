import { remote } from 'webdriverio';
import { expect } from 'chai';
import { initializeDriver } from './driverSetup.mjs';

describe('Email Validation Test', function () {
  let driver;
  const emailDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'hotmail.co.uk', 'hotmail.fr',
    'msn.com', 'yahoo.fr', 'wanadoo.f', 'orange.fr', 'comcast.n', 'yahoo.co.uk',
    'y.com.br', 'yahoo.co.in', 'live.com', 'rediffmail.com', 'free.fr', 'gmx.de',
    'web.d', 'yandex.ru'
  ];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  before(async function () {
    this.timeout(60000); // Increase timeout for the entire setup
    driver = await initializeDriver();
    console.log('Driver setup complete, waiting for the app to load...');
    await driver.pause(3000); // Increased wait time for the app to load
  });

  it('should validate email addresses and set valid ones', async function () {
    console.log('Navigating to the profile section...');
    const profileButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]"
    );
    await profileButton.waitForDisplayed({ timeout: 30000 }); // Increased timeout for element display
    await driver.pause(1000);
    await profileButton.click();

    console.log('Navigating to the "Edit Details" button...');
    const editButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
    );
    await editButton.click();

    const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
    await emailField.waitForDisplayed({ timeout: 10000 }); // Increased timeout for element display

    for (const domain of emailDomains) {
      const email = `testing@${domain}`;
      const isValidEmail = emailRegex.test(email);

      console.log(`Validation for email ${email}: ${isValidEmail ? 'Valid' : 'Invalid'}`);
      if (isValidEmail) {
        await emailField.clearValue();
        await emailField.setValue(email);
        console.log(`Email ${email} set in the field.`);
      }

      await driver.pause(300); // Reduced pause time between emails
    }

    const backButton = await driver.$('//android.widget.ScrollView/android.view.View[1]/android.widget.Button');
    await backButton.click();
  });

  after(async function () {
    console.log('Ending the Change DP test session...');
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
