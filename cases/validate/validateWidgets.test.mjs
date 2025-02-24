import { initializeDriver } from '../driverSetup.mjs';
(async function bookService() {

    describe('Validate Widgets for home screen', function () {
        let driver;
        let widgetStatus = {
            vehicleCard: false,
            card: false,
            batteryWidgets: false,
            projectedRangeWidgets: false,
            topSpeedWidgets: false,
            averageSpeedWidgets: false,
            rideStatisticsWidgets: false,
            roadsideAssistanceWidgets: false,
            bookServicesWidgets: false
        };

        before(async function () {
            this.timeout(30000);
            driver = await initializeDriver();
        });

        it('should validate widgets', async function () {
            try {
                const vehicleCard = await driver.$('//android.widget.ScrollView/android.view.View[2]/android.view.View');
                widgetStatus.vehicleCard = await vehicleCard.isDisplayed();

                const card = await driver.$('//android.widget.ScrollView/android.view.View[2]/android.view.View/android.view.View[1]/android.widget.Button');
                widgetStatus.card = await card.isDisplayed();

                const batteryWidgets = await driver.$('//android.widget.ScrollView/android.view.View[3]/android.view.View');
                widgetStatus.batteryWidgets = await batteryWidgets.isDisplayed();

                const projectedRangeWidgets = await driver.$('//android.widget.ScrollView/android.view.View[4]');
                widgetStatus.projectedRangeWidgets = await projectedRangeWidgets.isDisplayed();

                const topSpeedWidgets = await driver.$(`//android.widget.TextView[@text="Top
Speed"]`);
                await topSpeedWidgets.waitForDisplayed({timeout:10000})
                widgetStatus.topSpeedWidgets = await topSpeedWidgets.isDisplayed();

                const averageSpeedWidgets = await driver.$(`//android.widget.TextView[@text="Average
Speed"]`);
                widgetStatus.averageSpeedWidgets = await averageSpeedWidgets.isDisplayed();

                const { width, height } = await driver.getWindowRect();

                await driver.performActions([
                    {
                        type: "pointer",
                        id: "finger1",
                        parameters: { pointerType: "touch" },
                        actions: [
                            { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.8 },
                            { type: "pointerDown", button: 0 },
                            { type: "pointerMove", duration: 500, x: width / 2, y: height * 0.1 },
                            { type: "pointerUp", button: 0 },
                        ],
                    },
                ]);

                const rideStatisticsWidgets = await driver.$('//android.view.View[@content-desc="Ride Statistic"]');
                widgetStatus.rideStatisticsWidgets = await rideStatisticsWidgets.isDisplayed();

                const roadsideAssistanceWidgets = await driver.$('//android.widget.ScrollView/android.view.View[4]');
                widgetStatus.roadsideAssistanceWidgets = await roadsideAssistanceWidgets.isDisplayed();

                const bookServicesWidgets = await driver.$('//android.widget.TextView[@text="Service"]');
                widgetStatus.bookServicesWidgets = await bookServicesWidgets.isDisplayed();

            } catch (error) {
                console.error('An error occurred while validating widgets:', error.message);
            }
        });

        after(async function () {
            console.log('Widget Status:', widgetStatus);
            if (driver) {
                await driver.deleteSession();
            }
        });
    });
})();
