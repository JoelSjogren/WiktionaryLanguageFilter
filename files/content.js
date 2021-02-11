chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'prune') {
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
    }
});

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
    let pruneThis = function(e) {
	var f = e.nextSibling;
	e.remove();
	return f || {tagName: "H2"};
    }
    while ((e = pruneThis(e)).tagName != "H2");
    return e;
}

function pruneTOC(pruneExcept) {
    let toc = Array.from(document.querySelector("H2").parentElement.nextElementSibling.children);
    
    for (var i = 0; i < toc.length; i++) {
	let e = toc[i]; // current toc entry
	let lang = e.getElementsByClassName("toctext")[0].innerHTML;
	if (pruneExcept.indexOf(lang) >= 0) continue;
	e.remove();
    }
}

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
