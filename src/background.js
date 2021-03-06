var menus = [chrome.contextMenus.create({"title": "Table...", "contexts": ["all"]})];

menus.push(chrome.contextMenus.create({ "title": "Select Row",    "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() { menuClick("selectRow")    }}));
menus.push(chrome.contextMenus.create({ "title": "Select Column", "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() { menuClick("selectColumn") }}));
menus.push(chrome.contextMenus.create({ "title": "Select Table",  "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() { menuClick("selectTable")  }}));
menus.push(chrome.contextMenus.create({ "type": "separator",      "parentId": menus[0], "enabled": false, "contexts": ["all"] }));
menus.push(chrome.contextMenus.create({ "title": "Copy",          "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() { menuClick("copyRich")     }}));
menus.push(chrome.contextMenus.create({ "title": "Copy as HTML",  "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() { menuClick("copyHTML")     }}));
menus.push(chrome.contextMenus.create({ "title": "Copy as Text",  "parentId": menus[0], "enabled": false, "contexts": ["all"], "onclick": function() { menuClick("copyText")     }}));

// Menu selection - dispatch the message to the content.js
function menuClick(cmd) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {menuCommand: cmd},
            function(response) {});
    });
}

// Content command - handle a message from the content.js
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    switch(message.command) {
        case "copyText":
            var t = document.getElementById("___tableselect_clipboard___");
            t.value = message.content;
            t.focus();
            t.select();
            document.execCommand("copy");
            t.value = "";
            sendResponse({});
            break;
        case "copyRich":
            var t = document.getElementById("___tableselect_div___");
            t.contentEditable = true;
            t.innerHTML = message.content;
            var range = document.createRange();
            range.selectNodeContents(t);
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand("copy");
            t.innerHTML = "";
            sendResponse({});
            break;
        case "updateMenu":
            menus.forEach(function(id) {
                chrome.contextMenus.update(id, {enabled:message.enabled});
            });
            break;
    }
});

