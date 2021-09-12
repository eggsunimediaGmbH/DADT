// DevTools page -- devtools.js
// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
  name: "deniz-dev-tools",
});

backgroundPageConnection.postMessage({
  name: "init",
  tabId: chrome.devtools.inspectedWindow.tabId,
});

backgroundPageConnection.onMessage.addListener(function(message) {
  callbacks.forEach((clb) => {
    clb(message);
  });
});

let callbacks = [];
function registerCallback(callback) {
  callbacks.push(callback);
  return callback.length - 1;
}

function removeCallback(index) {
  callbacks.splice(index, 1);
}

export { registerCallback, removeCallback };
