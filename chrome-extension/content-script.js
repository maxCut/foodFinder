console.log("here");
document.addEventListener("set", function(event)
{
    console.log(event.detail)
    chrome.storage.local.set({"message":event.detail},function(){})
});

document.addEventListener("get", function(event)
{
    console.log(event.detail)
    chrome.storage.local.get(["message"],function(result){
        console.log("got data")
        console.log(result.message)
    })
});