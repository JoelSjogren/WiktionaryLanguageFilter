var wiktionaryFilterLanguage = "dmp.wiktionaryFilter.Language";
var wiktionaryFilerDisable = "dmp.wiktionaryFitler.Disable"

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