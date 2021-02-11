// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
        console.log("on before listener");
        getSavedItem((language) => {
        if (language) {
            console.log("saved language is " + language)
            chrome.tabs.update(details.tabId, { url: details.url + "#" + language });
        }
        });

    });

var wiktionaryFilterLanguage = "dmp.wiktionaryFilter.Language";
var wiktionaryFilterDisable = "dmp.wiktionaryFitler.Disable"
var wiktionaryFilterPrune = "dmp.wiktionaryFilter.Prune";
var wiktionaryFilterPruneExcept = "dmp.wiktionaryFitler.PruneExcept";

function getSavedItem(key, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(key, (items) => {
    callback(chrome.runtime.lastError ? null : items[key]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveItem(key, value) {
  var items = {};
  items[key] = value;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);

  //console.log("saving language: " + language)
}


/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    callback();
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
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
  getCurrentTabUrl((url) => {
    var languageInput = document.getElementById('language');
    var disableCheckbox = document.getElementById("disable");
    var pruneCheckbox = document.getElementById("prune");
    var pruneExceptInput = document.getElementById('prune-except');

    getSavedItem(wiktionaryFilterLanguage, (language) => {
      if (language) {
        //console.log("saved language is " + language)
        languageInput.value = language;
      }
    });

    getSavedItem(wiktionaryFilterDisable, (disabled) => {
      if (disabled) {
        //console.log("saved language is " + language)
        disableCheckbox.checked = disabled;
      }
      else {
        disableCheckbox.checked = false;
      }
    });

    getSavedItem(wiktionaryFilterPrune, (prune) => {
      if (prune) {
        pruneCheckbox.checked = prune;
      }
      else {
        pruneCheckbox.checked = false;
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
      //changeBackgroundColor(dropdown.value);
      saveItem(wiktionaryFilterLanguage, languageInput.value);
    });

    disableCheckbox.addEventListener('change', () => {
      //changeBackgroundColor(dropdown.value);
      saveItem(wiktionaryFilterDisable, disableCheckbox.checked);
    });

    pruneCheckbox.addEventListener('change', () => {
      saveItem(wiktionaryFilterPrune, pruneCheckbox.checked);
    });

    pruneExceptInput.addEventListener('change', () => {
      saveItem(wiktionaryFilterPruneExcept, pruneExceptInput.value);
    });
  });
});
