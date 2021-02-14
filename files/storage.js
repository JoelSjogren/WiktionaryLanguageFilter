const wiktionaryFilterJumpLanguage = "dmp.wiktionaryFilter.Language";
const wiktionaryFilterDisableJump = "dmp.wiktionaryFitler.DisableJump"
const wiktionaryFilterPruneExcept = "dmp.wiktionaryFitler.PruneExcept";
const wiktionaryFilterDisablePrune = "dmp.wiktionaryFitler.DisablePrune";

function getSavedItem(key, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(key, (items) => {
    console.log(`Getting ${key} => ${items[key]}`);
    callback(chrome.runtime.lastError ? null : items[key]);
  });
}

function saveItem(key, value) {
  console.log(`Setting ${key} to ${value}`);
  var items = {};
  items[key] = value;
  chrome.storage.sync.set(items);

  //console.log("saving language: " + language)
}
