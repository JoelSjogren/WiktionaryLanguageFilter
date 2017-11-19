// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: 'wiktionary.org/wiki' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

//console.log("in background global");

(function() {
	
    // https://github.com/sjmulder/urlrewrite-chrome/blob/master/extension/background.js
    // I had to use onCompleted instead of onBeforeNavigate because the top-right search box first does a GET to a search page which then sends a 304 back to the client with the eventual location.
    // onBeforeNaviate response to the initial GET whereas onCommitted and beyond are responding to the location specified by the 304.
    chrome.webNavigation.onCompleted.addListener(function(details) {

        if (details.url.indexOf("wiktionary.org/wiki") < 0) return;
        
        getSavedItem(wiktionaryFilerDisable, (disabled) => {

            if (disabled) return;
            
            getSavedItem(wiktionaryFilterLanguage, (language) => {
                // Don't append if there is already a hash navigation applied or if we're on a special page like "Appendix:Glossary"
                if (language && details.url.indexOf("#") < 0) {
                    chrome.tabs.update(details.tabId, { url: details.url + "#" + language });
                }
                });

        });
    });

})();

