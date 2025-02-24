import { remote } from 'webdriverio';
import { expect } from 'chai';
import { initializeDriver } from '../driverSetup.mjs';

describe('Email Validation Test', function () {
  let driver;
  const emailDomains = ['free.fr',
    'gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'hotmail.co.uk', 'hotmail.fr',
    'msn.com', 'yahoo.fr', 'wanadoo.f', 'orange.fr', 'comcast.n', 'yahoo.co.uk',
    'y.com.br', 'yahoo.co.in', 'live.com', 'rediffmail.com',  'gmx.de',
    'web.d', 'yandex.ru'
  ];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  before(async function () {
    this.timeout(60000);
    driver = await initializeDriver();
    await driver.pause(3000); 
  });

  it('should validate email addresses and set valid ones', async function () {
    this.timeout(40000); 
    const profileButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.view.View[2]"
    );
    await profileButton.waitForDisplayed({ timeout: 30000 }); // Increased timeout for element display
    await driver.pause(1000);
    await profileButton.click();
    const editButton = await driver.$(
      "//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.widget.ScrollView/android.view.View[2]/android.view.View[2]/android.view.View/android.widget.Button"
    );
    await editButton.click();

    const emailField = await driver.$('//android.widget.ScrollView/android.widget.EditText[2]');
    await emailField.waitForDisplayed({ timeout: 10000 }); // Increased timeout for element display

    for (const domain of emailDomains) {
      const email = `testing@${domain}`;
      const isValidEmail = emailRegex.test(email);
      if (isValidEmail) {
        await emailField.clearValue();
        await emailField.setValue(email);
        console.log(`Email ${email} set in the field.`);
      }

      await driver.pause(100); // Reduced pause time between emails
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
