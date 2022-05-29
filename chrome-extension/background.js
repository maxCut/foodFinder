chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled...');
  alert("Hello, world!");
  // create alarm after extension is installed / upgraded
  chrome.alarms.create('refresh', { periodInMinutes: 3 });
});


window.perfWatch = {};

chrome.runtime.onMessage.addListener(
    (message,sender,sendResponse)=> 
    {
        console.log("got message");
    }
);

chrome.alarms.onAlarm.addListener((alarm) => {
  alert("Hello, world!");
});
