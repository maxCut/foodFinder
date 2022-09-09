document.addEventListener("purchaseRequest", function (event) {
    //chrome.storage.local.set({ "message": event.detail }, function () { })
    sendMessageToBackground(event.detail);
});

let currentVersion = chrome.runtime.getManifest().version;
document.dispatchEvent(
    new CustomEvent("chefBopInformation", {
        detail: {
            sender: "chef-bop",
            message_name: "version",
            message: currentVersion,
        },
    })
);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request == "notifyLoadCartCompleted") {
        var event = new CustomEvent("purchaseRequestSuccess", {
            detail: "success",
        });
        document.dispatchEvent(event);
    }
    if (request == "notifyLoadCartFailed") {
        var event = new CustomEvent("purchaseRequestFailed", {
            detail: "fail",
        });
        document.dispatchEvent(event);
    }
});

function sendMessageToBackground(cart) {
    //chrome.runtime.sendMessage({type:"foodFinderMessage",subtype:"ASIN_addToCart_request",ASIN_set:[{asin:"B079M54HW4", quantity:1}]},() => {
    chrome.runtime.sendMessage(
        {
            type: "foodFinderMessage",
            subtype: "ASIN_addToCart_request",
            ASIN_set: cart,
        },
        (response) => {}
    );
}
