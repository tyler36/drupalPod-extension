// Array of supported Drupal Core values.
const optionsDrupalCoreVersion = [
  '9.5.9',
  '9.5.x',
  '10.0.9',
  '10.0.x',
  '10.1.x',
  '11.x',
];
const defaultDrupalCoreVersion = '10.1.x';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'fetch-drupalpod-repo') {
    (async function responding() {
      sendResponse({message: await getDrupalPodRepo()});
    })();
  } else if (request.message === 'set-drupalpod-repo') {
    setDrupalPodRepo(request.url);
    sendResponse({message: 'great success'});
  } else if (request.message === 'get-drupal-core-version-options') {
    sendResponse({options: optionsDrupalCoreVersion});
  } else if (request.message === 'fetch-drupal-core-version') {
    (async function responding() {
      sendResponse({message: await getDrupalCoreVersion()});
    })();
  } else if (request.message === 'set-drupal-core-version') {
    setDrupalCoreVersion(request.core);
    sendResponse({message: 'great success'});
  }

  return true;
});

async function getDrupalPodRepo() {
  var p = new Promise((resolve, reject) => {
    chrome.storage.sync.get(['drupalpod_repo'], (options) => {
      resolve(options.drupalpod_repo);
    });
  });

  return await p;
}

async function getDrupalCoreVersion() {
  var p = new Promise((resolve, reject) => {
    chrome.storage.sync.get(['drupal_core_version'], (options) => {
      resolve(options.drupal_core_version);
    });
  });

  return await p;
}

function setDrupalPodRepo(url) {
  chrome.storage.sync.set({drupalpod_repo: url});
}
function setDrupalCoreVersion(core) {
  chrome.storage.sync.set({drupal_core_version: core});
}

// set default
setDrupalPodRepo('https://github.com/shaal/drupalpod');
setDrupalCoreVersion(defaultDrupalCoreVersion);
