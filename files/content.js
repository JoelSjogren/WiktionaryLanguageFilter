chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(`Got message! ${msg}`);
    if (msg.text === 'scroll' && msg.language) {
        console.log(`Finding ${msg.language}`);

        // Each language header has an id attribute matching the displayed language - easy!
        var header = document.getElementById(msg.language);

        if (header) {
            console.log("found it!")
	    if (document.URL.indexOf("#") < 0) {
		header.scrollIntoView(true);
	    } else {
		console.log("but ignoring it!")
	    }
        }
        else {
            console.log(`Unable to find ${msg.language}`);
        }
    }

    if (msg.text === 'prune') {
        
        // Avoid pruning everything
        if (allLanguagesWouldBePruned(msg.pruneExcept)) {
            document.getElementById("bodyContent").insertAdjacentText("afterbegin", "(Note: Pruning temporarily disabled because no results matched.)");
            return;
        }

        // prune table of contents
        pruneTOC(msg.pruneExcept);

        // prune body
        let l = document.querySelectorAll("H2");
        for (var i = 0; i < l.length; i++) {
            var e = l[i];
            if (shouldBePruned(e, msg.pruneExcept)) {
                pruneSection(e);
            }
        }

        // prune categories at the end
        pruneCategories(msg.pruneExcept);

	// prune all tables of translations
	pruneTranslations(msg.pruneExcept);
    }
});

function allLanguagesWouldBePruned(pruneExcept) {
    return !pruneExcept.some((lang) => document.getElementById(lang));
}


// BODY

function shouldBePruned(e, pruneExcept) {
    if (e.children.length < 2) return false;
    let e0 = e.children[0], e1 = e.children[1];
    if (e0.className == "mw-headline") {
        return (pruneExcept.indexOf(e0.textContent) < 0);
    }
    if (e1.className == "mw-headline") {
        return (pruneExcept.indexOf(e1.textContent) < 0);
    }
    return false;
}

function pruneSection(e) {
    let pruneThis = function (e) {
        var f = e.nextSibling;
        e.remove();
        return f || { tagName: "H2" };
    }
    while ((e = pruneThis(e)).tagName != "H2");
    return e;
}


// TOC

function pruneTOC(pruneExcept) {
    let toc = Array.from(document.querySelector("H2").parentElement.nextElementSibling.children);

    for (var i = 0; i < toc.length; i++) {
        let e = toc[i]; // current toc entry
        let lang = e.getElementsByClassName("toctext")[0].innerHTML;
        if (pruneExcept.indexOf(lang) >= 0) continue;
        e.remove();
    }
}


// CATEGORIES

function pruneCategories(pruneExcept) {
    let cats = Array.from(document.getElementById('catlinks').children[0].children[1].children);

    for (var i = 0; i < cats.length; i++) {
        if (leaveCategory(cats[i], pruneExcept)) continue;
        cats[i].remove();
    }
}

function leaveCategory(cat, pruneExcept) {
    return pruneExcept.some((lang) => cat.textContent.indexOf(lang) >= 0);
}


// TRANSLATIONS

function pruneTranslations(pruneExcept) {
    forEachTry(document.getElementsByClassName("translations"), (table) => {
	forEachTry(table.children[0].children[0].children, (col) => {
	    forEachTry(col.children[0].children, (entry) => {
		if (!translationLanguageMatches(entry, pruneExcept)) {
		    entry.remove();
		}
	    });
	});
    });
}

function forEachTry(xs, f) {
    try {
	Array.from(xs).forEach((x) => {
	    try {
		f(x);
	    } catch (e) {
		
	    }
	});
    } catch (e) {
	
    }
}

function translationLanguageMatches(entry, langs) {
    return langs.some((lang) =>
	entry.childNodes[0].textContent.indexOf(lang + ":") == 0);
}
