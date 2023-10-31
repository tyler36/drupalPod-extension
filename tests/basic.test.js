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

test("it sets drupalPod repo options", async () => {
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
  await input.type('https://github.com/shaal/update-repo');
  await page.click('button[type="submit"]');

  // ASSERT value matches
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);
  let value = await page.$eval(selectorDrupalPodRepo, (input) => input.value);
  expect(value).toEqual('https://github.com/shaal/update-repo');
});

test("it contains drupal core options", async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);

  let selectorDrupalCore = "#drupal-core";
  await page.waitForSelector(selectorDrupalCore);

  // ASSERT current options.
  let selectOptions = await page.evaluate(() => {
    let selectElement  = document.getElementById("drupal-core");
    return Array.from(selectElement.options).map(
      (option) => option.value
    );
  });
  expect(["9.5.9", "9.5.x", "10.0.9", "10.0.x", "10.1.x", "11.x"]).toEqual(
    expect.arrayContaining(selectOptions)
  );
});


test("it sets drupal core options", async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);

  let selectorDrupalCore = "#drupal-core";

  // ASSERT default
  await page.waitForSelector(selectorDrupalCore + " option");
  selectedOption = await page.evaluate(() => {
    let select = document.getElementById("drupal-core");
    let selected = select.options[select.selectedIndex];
    return selected.value;
  });
  expect(selectedOption).toEqual("10.1.x");

  // Save value
  let input = await page.$(selectorDrupalCore);
  await input.select(selectorDrupalCore, "11.x");
  await page.click('button[type="submit"]');

  // ASSERT value matches
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);
  await page.waitForSelector(selectorDrupalCore + " option");
  selectedOption = await page.evaluate(() => {
    let select = document.getElementById("drupal-core");
    let selected = select.options[select.selectedIndex];
    return selected.value;
  });
  expect(selectedOption).toEqual("11.x");
});

test('it sets profile options', async () => {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);

  let selectorProfile = '#drupal-profile';

  // ASSERT default
  await page.waitForSelector(selectorProfile + ' option');
  selectedOption = await page.evaluate(() => {
    let select = document.getElementById('drupal-profile');
    let selected = select.options[select.selectedIndex];
    return selected.value;
  });
  expect(selectedOption).toEqual('standard');

  // Save value
  let input = await page.$(selectorProfile);
  await input.select(selectorProfile, 'demo_umami');
  await page.click('button[type="submit"]');

  // ASSERT value matches
  await page.goto(`chrome-extension://${EXTENSION_ID}/options.html`);
  await page.waitForSelector(selectorProfile + ' option');
  selectedOption = await page.evaluate(() => {
    let select = document.getElementById('drupal-profile');
    let selected = select.options[select.selectedIndex];
    return selected.value;
  });
  expect(selectedOption).toEqual('demo_umami');
});
