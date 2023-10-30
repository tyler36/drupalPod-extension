// import("./example.js");
const puppeteer = require("puppeteer");

const EXTENSION_PATH = "D:/code/platform/chrome/drupalPod";
const EXTENSION_ID = "pjfjhkcfkhbemnbpkakjhmboacefmjjl";

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extension=${EXTENSION_PATH}`,
    ],
  });
});

afterEach(async () => {
  await browser.close();
  browser = undefined;
});

test('it warns when NOT on Drupal issue page', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);

  await page.waitForXPath('//*[contains(text(), "Open an issue page on Drupal.org to see the available options.")]');
});

test("it sets drupalPod repo", async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);

  let selectorDrupalPodRepo = '#drupalpod-repo';
  await page.waitForSelector(selectorDrupalPodRepo);

  // ASSERT default value.
  let placeholder = await page.$eval(selectorDrupalPodRepo, (input) => input.getAttribute('placeholder'));
  expect(placeholder).toEqual("https://github.com/shaal/drupalpod");

  // Save value
  let input = await page.$('#drupalpod-repo');
  await input.click({ clickCount: 3 });
  await input.type('my-drupalpod-repo');
  await page.click('button[type="submit"]');

  // ASSERT value matches
  let value = await page.$eval(selectorDrupalPodRepo, (input) => input.value);
  expect(value).toEqual('my-drupalpod-repo');
});
