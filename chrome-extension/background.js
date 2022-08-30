chrome.runtime.onInstalled.addListener(() => {
    console.log("onInstalled...");
});

window.perfWatch = {};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type == "foodFinderMessage") {
        if (request.subtype == "ASIN_addToCart_request") {
            addItemsToFreshCart(request.ASIN_set).then;
            {
                sendResponse("success");
                return;
            }
        }
    }

    sendResponse("unknown request");
});

async function checkIfAmazonLoggedIn() {
    storeUrl = "https://www.amazon.com";

    var signOn;
    await fetch(`${storeUrl}/alm/storefront?almBrandId=QW1hem9uIEZyZXNo`)
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            signOn = doc.getElementById("nav-link-accountList");
        })
        .catch((err) => {});

    if (!signOn) {
        return false;
    }
    return signOn.getAttribute("data-nav-ref") != "nav_ya_signin";
}

async function fetchOffer(element, storeUrl) {
    return await fetch(
        `${storeUrl}/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=foodfinder00-20`
    )
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let els = doc.querySelectorAll("[data-fresh-add-to-cart]");

            for (let i = 0; i < els.length; i++) {
                let el = els[i];
                let a2c = JSON.parse(el.dataset["freshAddToCart"]);

                if (a2c.asin == element.asin) {
                    token = a2c.csrfToken;
                    offer = a2c.offerListingID;
                    return [offer, token];
                }
            }
        });
}

async function addItemsToFreshCart(asin_set) {
    if (!(await checkIfAmazonLoggedIn())) {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    "notifyLoadCartFailed",
                    function (response) {}
                );
            }
        );
        return;
    }
    storeUrl = "https://www.amazon.com";
    addAPI = "https://www.amazon.com/alm/addtofreshcart";

    for (const element of asin_set) {
        [offer, token] = await fetchOffer(element, storeUrl);

        let body = {
            asin: element.asin,
            brandId: "QW1hem9uIEZyZXNo",
            clientID: "fresh-nereid",
            offerListingID: offer,
            quantity: element.quantity,
            csrfToken: token,
        };

        await fetch(addAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(body),
        });
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "notifyLoadCartCompleted",
            function (response) {}
        );
    });
}
