console.log("content script");
document.addEventListener("purchaseRequest", function (event) {
    console.log(event.detail);
    //chrome.storage.local.set({ "message": event.detail }, function () { })
    sendMessageToBackground(event.detail);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request);
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
