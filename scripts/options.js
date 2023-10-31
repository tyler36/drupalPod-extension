function getDrupalPodRepo() {
  const drupalpod_repo_input = document.querySelector('#drupalpod-repo');
  chrome.runtime.sendMessage({message: 'fetch-drupalpod-repo'}, (response) => {
    if (response.message) {
      drupalpod_repo_input.value = response.message;
    } else {
      drupalpod_repo_input.value = drupalpod_repo_input.placeholder;
    }
  });
}

function setDrupalPodRepo(url) {
  chrome.runtime.sendMessage(
    {message: 'set-drupalpod-repo', url: url},
    (response) => {
      return response.message;
    },
  );
}

function buildDrupalCoreOptions() {
  const drupal_core = document.querySelector('#drupal-core');

  const options = chrome.runtime.sendMessage(
    {message: 'get-drupal-core-version-options'},
    (response) => {
      response.options.forEach((option) => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        drupal_core.appendChild(optionElement);
      });
    },
  );
}

function getDrupalCoreVersion() {
  const drupal_core = document.querySelector('#drupal-core');
  chrome.runtime.sendMessage(
    {message: 'fetch-drupal-core-version'},
    (response) => {
      if (response.message) {
        drupal_core.value = response.message;
      }
    },
  );
}

function setDrupalCoreVersion(core) {
  chrome.runtime.sendMessage(
    {message: 'set-drupal-core-version', core: core},
    (response) => {
      return response.message;
    },
  );
}

function getDrupalProfile() {
  const drupal_profile = document.querySelector('#drupal-profile');
  chrome.runtime.sendMessage({message: 'fetch-drupal-profile'}, (response) => {
    if (response.message) {
      drupal_profile.value = response.message;
    }
  });
}

function setDrupalProfile(profile) {
  chrome.runtime.sendMessage(
    {message: 'set-drupal-profile', profile: profile},
    (response) => {
      return response.message;
    },
  );
}

// Initiate display form
document.addEventListener('DOMContentLoaded', () => {
  // Read initial value from storage
  getDrupalPodRepo();
  buildDrupalCoreOptions();
  getDrupalCoreVersion();
  getDrupalProfile();

  document.getElementById('form').addEventListener('submit', () => {
    const drupalpod_repo_input = document.querySelector('#drupalpod-repo');
    const drupalpod_repo =
      drupalpod_repo_input.value || drupalpod_repo_input.placeholder;
    setDrupalPodRepo(drupalpod_repo);

    const drupal_core_version = document.querySelector('#drupal-core');
    const core = drupal_core_version.value;
    setDrupalCoreVersion(core);

    const drupal_profile = document.querySelector('#drupal-profile');
    const profile = drupal_profile.value;
    setDrupalProfile(profile);

    document.getElementById('form-status').innerText = 'Value saved';
  });
});
