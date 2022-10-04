const webdriver = require('selenium-webdriver');
const { until } = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
const LambdaTestRestClient = require('@lambdatest/node-rest-client');

const username = process.env.LT_USERNAME || 'Your Username';
const accessKey = process.env.LT_ACCESS_KEY || 'Your Access Key';

const AutomationClient = LambdaTestRestClient.AutomationClient({
    username,
    accessKey
});

const capabilities = {
    "browserName": "Chrome",
	"browserVersion": "105.0",
	"LT:Options": {
		"username": "Your Username",
		"accessKey": "Your Access Key",
		"platformName": "Windows 10",
		"project": "Untitled",
		"selenium_version": "4.0.0",
		"w3c": true
	}
};

const getElementById = async (webdriver, id, timeout = 5000) => {
    const elementId = await webdriver.wait(until.elementLocated(By.id(id)), timeout);

    return await webdriver.wait(until.elementIsVisible(elementId), timeout);
};

const getElementByName = async (webdriver, name, timeout = 5000) => {
    const elementName = await webdriver.wait(until.elementLocated(By.name(name)), timeout);

    return await webdriver.wait(until.elementIsVisible(elementName), timeout);
};

let sessionId = null;

describe('Registration Page Tests', () => {
    let driver;
    beforeAll(async () => {
        var driver = new webdriver.Builder()

        .usingServer(
        'https://' + username + ':' + accessKey + '@hub.lambdatest.com/wd/hub'
        )
        .withCapabilities(capabilities)
        .build();

        await driver.getSession().then(function(session) {
            sessionId = session.id_;
        });

        await driver.get(`https://ecommerce-playground.lambdatest.io/index.php?route=account/register`);
    }, 50000);

    afterAll(async () => {
        await driver.quit();
    }, 40000);

    test('Tests', async () => {
        try {
            const firstName = await getElementById(driver, 'input-firstname');
            await firstName.send_keys("James");
      
            const lastName = await getElementById(driver, 'input-lastname');
            await lastName.send_keys("Doe");
      
            const email = await getElementById(driver, 'input-email');
            await email.send_keys("james@gmail.com");

            const telephone = await getElementById(driver, 'input-telephone');
            await telephone.send_keys("+176455454542");

            const password = await getElementById(driver, 'input-password');
            await password.send_keys("12345");

            const confirmPassword = await getElementById(driver, 'input-confirm');
            await confirmPassword.send_keys("12345");

            const agree = await getElementById(driver, 'input-agree');
            await agree.click();

            const continueBtn = await getElementByName(driver, 'btn');
            await continueBtn.click();
        } catch (err) {
            await updateJob(sessionId, 'failed');
            await webdriverErrorHandler(err, driver);
            throw err;
        }
    }, 35000);
});

async function webdriverErrorHandler(err, driver) {
    console.error('Unhandled exception! ' + err.message);
    if (driver && sessionId) {
        try {
          await driver.quit();
        } catch (_) {}
        await updateJob(sessionId, 'failed');
    }
}

function updateJob(sessionId, status) {
    return new Promise((resolve, reject) => {
      AutomationClient.updateSessionById(
        sessionId,
        { status_ind: status },
        err => {
          if (err) return reject(err);
          return resolve();
        }
      );
    });
}