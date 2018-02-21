chrome.browserAction.disable();

function handleBrowserAction (tabId) {
  chrome.browserAction.disable();
  chrome.tabs.get(tabId, function (tab) {
    if (showingTrelloBoard(tab.url)) {
      chrome.browserAction.enable(tab.id);
    }
  });
}

chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
  chrome.browserAction.disable(details.tabId);
  if (showingTrelloBoard(details.url)) {
    chrome.browserAction.enable(details.tabId);
  }
  chrome.tabs.executeScript(null, {file: "getLists.js"});
});

function showingTrelloBoard (url) {
  var thisRegex = new RegExp('trello.com/b/');
  return thisRegex.test(url);
}
