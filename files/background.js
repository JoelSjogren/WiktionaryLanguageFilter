// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Notes on storage.js - the background script has access to it but popup.js does not.  Perhaps because the background scripts are not permanently loaded?

// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {

        // Determine when the options dialog can be displayed
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'wiktionary.org' },
          })
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

(function () {

  // https://github.com/sjmulder/urlrewrite-chrome/blob/master/extension/background.js
  // I had to use onCompleted instead of onBeforeNavigate because the top-right search box first does a GET to a search page which then sends a 304 back to the client with the eventual location.
  // onBeforeNaviate response to the initial GET whereas onCommitted and beyond are responding to the location specified by the 304.
  chrome.webNavigation.onCompleted.addListener(function (details) {
    console.log("in! " + details.url);

    if (details.url.indexOf("wiktionary.org/wiki") < 0) return;
    if (details.url.indexOf("wiktionary.org/wiki/Appendix:") >= 0) return;

    getSavedItem(wiktionaryFilerDisable, (disabled) => {

      console.log("disabled? " + disabled);

      if (disabled) return;

      getSavedItem(wiktionaryFilterMode, (mode) => {
        if (!mode) {
          console.log("mode is not set!");
          return;
        };

        if (mode === "prune") {
          getSavedItem(wiktionaryFilterPruneExcept, (pruneExcept) => {
            
            let pruneExceptList 
              = pruneExcept
                .split(',')
                .map((s) => s.trim());

            chrome.tabs.sendMessage(details.tabId, {
              text: 'prune',
              pruneExcept: pruneExceptList
            }, null);
          });
        }
        else {
          getSavedItem(wiktionaryFilterLanguage, (language) => {
            if (language) {
              console.log(`Sending scroll message for  '${language}'`)

              chrome.tabs.sendMessage(details.tabId, {
                text: 'scroll',
                language: language
              }, null);
            }
            else {
              console.log("Language not set!");
            }
          });
        }
      });
    });
  });
})();

