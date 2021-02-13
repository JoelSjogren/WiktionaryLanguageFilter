chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    console.log(`Got message! ${msg}`);
    if (msg.text === 'scroll' && msg.language) {
        console.log(`Finding ${msg.language}`);

        // Each language header has an id attribute matching the displayed language - easy!
        var header = document.getElementById(msg.language);

        if (header) {
            console.log("found it!")
            header.scrollIntoView(true);
        }
        else {
            console.log("Unable to find")
        }
    }
});