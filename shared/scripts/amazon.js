async function checkIfAmazonLoggedIn() {
    var signOn;
    await fetch(
        `https://www.amazon.com/alm/storefront?almBrandId=QW1hem9uIEZyZXNo`
    )
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            tags = parseHtmlForTagsThatContainSubString(
                html,
                "nav-link-accountList"
            );
            if (tags.length > 0) {
                signOn = tags[0];
            }
        })
        .catch((err) => {});

    if (!signOn) {
        return false;
    }
    return signOn.includes('data-nav-ref="nav_youraccount_btn"');
}

async function fetchOffer(element) {
    return await fetch(
        `https://www.amazon.com/gp/product/${element.asin}?almBrandId=QW1hem9uIEZyZXNo&fpw=alm&linkCode=ll1&tag=foodfinder00-20`
    )
        .then((response) => {
            return response.text();
        })
        .then((html) => {
            let tags = parseHtmlForTagsThatContainSubString(
                html,
                "data-fresh-add-to-cart"
            );

            for (let i = 0; i < tags.length; i++) {
                let tag = tags[i];
                let addToCartStartIndex = tag.search("{&quot;");
                let addToCartStopIndex = tag.search("&quot;}") + 7;
                let unformatedString = tag.substring(
                    addToCartStartIndex,
                    addToCartStopIndex
                );
                let formatedString = unformatedString.replaceAll("&quot;", '"');
                let addToCart = JSON.parse(formatedString);

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
                await fetch("https://www.amazon.com/alm/addtofreshcart", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                    body: JSON.stringify(body),
                });
            } catch {
                continue;
            }
            return;
        }
    }
}

async function addItemsToFreshCart(asin_set) {
    if (!(await checkIfAmazonLoggedIn())) {
        chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
                try {
                    chrome.tabs.sendMessage(
                        tabs[0].id,
                        "notifyLoadCartFailed",
                        function (response) {}
                    );
                } catch {}
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
        try {
            chrome.tabs.sendMessage(
                tabs[0].id,
                "notifyLoadCartCompleted",
                function (response) {}
            );
        } catch {}
    });
}