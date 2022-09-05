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
    var signOn;
    await fetch(
        `https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo`
    )
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

async function fetchOffer(element) {
    return await fetch(
        `https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=foodfinder00-20`
    )
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, "text/html");
            let tags = doc.querySelectorAll("[data-fresh-add-to-cart]");

            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                let addToCart = JSON.parse(tag.dataset["freshAddToCart"]);

                if (addToCart.asin == element.asin) {
                    token = addToCart.csrfToken;
                    offer = addToCart.offerListingID;
                    return [offer, token];
                }
            }
        });
}

async function addFirstListedItemToCart(element) {
    for (const option of element) {
        try {
            [offer, token] = await fetchOffer(option);
        } catch {
            continue;
        }
        if (offer) {
            let body = {
                asin: option.asin,
                brandId: "QW1hem9uIEZyZXNo",
                clientID: "fresh-nereid",
                offerListingID: offer,
                quantity: option.quantity,
                csrfToken: token,
            };

            try {
                const response = await fetch(
                    "https://www.amazon.com/alm/addtofreshcart",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                        },
                        body: JSON.stringify(body),
                    }
                );
            } catch {
                console.log(`error getting store item ${option.asin}`);
                continue;
            }
            console.log(option);
            return;
        }
    }
    console.log("failed to find a valid option for this ingredient");
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

    const promises = [];
    for (const element of asin_set) {
        promises.push(addFirstListedItemToCart(element));
    }
    await Promise.all(promises);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            "notifyLoadCartCompleted",
            function (response) {}
        );
    });
}
