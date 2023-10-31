/**
 * Array of supported Drupal Core values.
 */
const optionsDrupalCoreVersion = [
  '9.5.9',
  '9.5.x',
  '10.0.9',
  '10.0.x',
  '10.1.x',
  '11.x',
];
const defaultDrupalCoreVersion = '10.1.x';
const defaultDrupalProfile = 'standard';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'fetch-drupalpod-repo') {
    (async function responding() {
      sendResponse({message: await getDrupalPodRepo()});
    })();
  }

  if (request.message === 'set-drupalpod-repo') {
    setDrupalPodRepo(request.url);
    sendResponse({message: 'great success'});
  }

  if (request.message === 'get-drupal-core-version-options') {
    sendResponse({options: optionsDrupalCoreVersion});
  }

  if (request.message === 'fetch-drupal-core-version') {
    (async function responding() {
      sendResponse({message: await getDrupalCoreVersion()});
    })();
  }

  if (request.message === 'set-drupal-core-version') {
    setDrupalCoreVersion(request.core);
    sendResponse({message: 'great success'});
  }

  if (request.message === 'fetch-drupal-profile') {
    (async function responding() {
      sendResponse({message: await getDrupalProfile()});
    })();
  }

  if (request.message === 'set-drupal-profile') {
    setDrupalProfile(request.profile);
    sendResponse({message: 'great success'});
  }

  return true;
});

async function getDrupalPodRepo() {
  return getOptionFromStorage('drupalpod_repo');
}

async function getDrupalCoreVersion() {
  return getOptionFromStorage('drupal_core_version');
}

async function getDrupalProfile() {
  return getOptionFromStorage('drupal_profile');
}

/**
 * Get the option 'name' from Chrome storage.
 *
 * @param string name
 * @returns
 */
async function getOptionFromStorage(name) {
  var p = new Promise((resolve, reject) => {
    chrome.storage.sync.get([name], (options) => {
      resolve(options[name]);
    });
  });

  return await p;
}

/**
 * Set the default DrupalPod repo.
 * This generally will not need changing.
 *
 * @param string url
 */
function setDrupalPodRepo(url) {
  setOptions({drupalpod_repo: url});
}

/**
 * Set the default Drupal Core version.
 *
 * @param string core
 */
function setDrupalCoreVersion(core) {
  setOptions({drupal_core_version: core});
}

/**
 * Set the default Drupal profile.
 * This generally will not need changing.
 *
 * @param string url
 */
function setDrupalProfile(profile) {
  setOptions({drupal_profile: profile});
}

/**
 * Helper function to save settings.
 * @param object options
 */
function setOptions(options) {
  chrome.storage.sync.set(options);
};

// set default
setDrupalPodRepo('https://github.com/shaal/drupalpod');
setDrupalCoreVersion(defaultDrupalCoreVersion);
setDrupalProfile(defaultDrupalProfile);
