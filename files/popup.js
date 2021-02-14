document.addEventListener('DOMContentLoaded', () => {

  var jumpLanguage = document.getElementById('language');
  var disableJumpCheckbox = document.getElementById("disableJump");
  var disablePruneCheckbox = document.getElementById("disablePrune");
  var pruneExceptInput = document.getElementById('prune-except');

  // Load default values from storage...
  getSavedItem(wiktionaryFilterJumpLanguage, (language) => {
    if (language) {
      jumpLanguage.value = language;
    }
  });

  getSavedItem(wiktionaryFilterDisableJump, (disableJump) => {
    if (disableJump) {
      disableJumpCheckbox.checked = disableJump;
    }
    else {
      disableJumpCheckbox.checked = false;
    }
  });

  getSavedItem(wiktionaryFilterPruneExcept, (pruneExcept) => {
    if (pruneExcept) {
      pruneExceptInput.value = pruneExcept;
    }
  });

  getSavedItem(wiktionaryFilterDisablePrune, (disablePrune) => {
    if (disablePrune) {
      disablePruneCheckbox.checked = disablePrune;
    }
    else {
      disablePruneCheckbox.checked = false;
    }
  });

  jumpLanguage.addEventListener('change', () => {
    saveItem(wiktionaryFilterJumpLanguage, jumpLanguage.value);
  });

  disableJumpCheckbox.addEventListener('change', () => {
    saveItem(wiktionaryFilterDisableJump, disableJumpCheckbox.checked);
  });

  pruneExceptInput.addEventListener('change', () => {
    saveItem(wiktionaryFilterPruneExcept, pruneExceptInput.value);
  });

  disablePruneCheckbox.addEventListener('change', () => {
    //console.log("Disabling prune")
    saveItem(wiktionaryFilterDisablePrune, disablePruneCheckbox.checked);
  });
});

