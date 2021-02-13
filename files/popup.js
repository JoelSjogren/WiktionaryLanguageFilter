// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var wiktionaryFilterLanguage = "dmp.wiktionaryFilter.Language";
var wiktionaryFilterDisable = "dmp.wiktionaryFitler.Disable"
var wiktionaryFilterMode = "dmp.wiktionaryFilter.Mode";
var wiktionaryFilterPruneExcept = "dmp.wiktionaryFitler.PruneExcept";

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
  var modeSelect = document.getElementById("mode");
  var pruneExceptInput = document.getElementById('prune-except');

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

  getSavedItem(wiktionaryFilterMode, (mode) => {
    if (mode) {
      modeSelect.value = mode;
    }
    else{
      modeSelect.value = "jump";
    }
  });

  getSavedItem(wiktionaryFilterPruneExcept, (pruneExcept) => {
    if (pruneExcept) {
      pruneExceptInput.value = pruneExcept;
    }
  });

  // Ensure the background color is changed and saved when the dropdown
  // selection changes.
  languageInput.addEventListener('change', () => {
    if (languageInput.value) {
      console.log("Updating language to " + languageInput.value);
      saveItem(wiktionaryFilterLanguage, languageInput.value);
    }
  });

  disableCheckbox.addEventListener('change', () => {
    saveItem(wiktionaryFilterDisable, disableCheckbox.checked);
  });

  pruneExceptInput.addEventListener('change', () => {
    saveItem(wiktionaryFilterPruneExcept, pruneExceptInput.value);
  });

  modeSelect.addEventListener('change', () => {
    saveItem(wiktionaryFilterMode, modeSelect.value);
  });
});

