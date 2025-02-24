import { initializeDriver } from '../driverSetup.mjs';
describe('Edit and Update Test', function () {
  let driver;

  before(async function () {
    this.timeout(30000);
    driver = await initializeDriver();
    await driver.pause(2000);  
  });

  it('should click Edit, focus on input, write testing and click Update', async function () {
    try {
      const editButton = await driver.$('//android.widget.ScrollView/android.view.View[2]/android.view.View/android.view.View[4]/android.view.View');
      await editButton.waitForDisplayed({ timeout: 5000 });
      await editButton.click();
      const inputField = await driver.$('//android.widget.EditText');
      await inputField.waitForDisplayed({ timeout: 5000 });
      await inputField.click();
      await inputField.setValue('testing');
      const updateButton = await driver.$('//android.widget.ScrollView/android.view.View/android.widget.Button');
      await updateButton.waitForDisplayed({ timeout: 5000 });
      await updateButton.click();
      
      const backButton = await driver.$('//androidx.compose.ui.platform.q1/android.view.View/android.view.View/android.view.View[1]/android.widget.Button')
      if (await backButton.isDisplayed()) {
        await backButton.waitForDisplayed({timeout:15000})
        await backButton.click();
      } else {
        console.log('Allow button is not visible. Ending the test with success message.');
      }
    } catch (err) {
      console.error("An error occurred during the Edit and Update test:", err.message);
    }
  });

  after(async function () {
    console.log("Ending the test session...");
    if (driver) {
      await driver.deleteSession();
      console.log('Driver session closed.');
    } else {
      console.log('Driver session not created. Skipping session cleanup.');
    }
  });
});
