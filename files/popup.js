// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const wiktionaryFilterLanguage = "dmp.wiktionaryFilter.Language";
const wiktionaryFilterDisable = "dmp.wiktionaryFitler.Disable"

function getSavedItem(key, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(key, (items) => {
    callback(chrome.runtime.lastError ? null : items[key]);
  });
}

function saveItem(key, value) {
  var items = {};
  items[key] = value;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);

}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {

    var languageInput = document.getElementById('language');
    var disableCheckbox = document.getElementById("disable");

    getSavedItem(wiktionaryFilterLanguage, (language) => {
      if (language) {
        languageInput.value = language;
      }
    });

    getSavedItem(wiktionaryFilterDisable, (disabled) => {
      if (disabled) {
        disableCheckbox.checked = disabled;
      }
      else {
        disableCheckbox.checked = false;
      }
    });

    languageInput.addEventListener('change', () => {
      
      if (languageInput.value) {
        console.log("Updating language to " + languageInput.value);
        saveItem(wiktionaryFilterLanguage, languageInput.value);
      }        
    });

    disableCheckbox.addEventListener('change', () => {
      saveItem(wiktionaryFilterDisable, disableCheckbox.checked);
    });

});
