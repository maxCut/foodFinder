 function getFirstGreaterThanTarget(target, arr) {
    lowerBound = 0;
    upperBound = arr.length;
    if (arr[lowerBound] > target) {
        return arr[lowerBound];
    }
    while (lowerBound < upperBound) {
        pivot = Math.floor((lowerBound + upperBound) / 2);
        if (arr[pivot] == target) {
            return arr[pivot + 1];
        } else if (arr[pivot] < target) {
            lowerBound = pivot;
        } else {
            upperBound = pivot;
        }
        if (upperBound == lowerBound) {
            return arr[upperBound + 1];
        }
        if (upperBound - lowerBound == 1) {
            return arr[upperBound];
        }
    }
  }
  
   function getClosingTagFromTag(html,target,type)
  {
    const arr = [
        ...html.matchAll(new RegExp("<[^<>]*" +type + "[^<>]*>", "gi")),
    ].map((a) => a.index);
  
    const allTags = [...html.matchAll(new RegExp("<[^<>]+>", "gi"))].map(
      (a) => a.index
  );
  
    lowerBound = 0;
    upperBound = arr.length;
    if (arr[lowerBound] > target) {
        return arr[lowerBound];
    }
    let retIndex = 0;
    while (lowerBound < upperBound) {
        pivot = Math.floor((lowerBound + upperBound) / 2);
        if (arr[pivot] == target) {
          retIndex = pivot;
          break;
        } else if (arr[pivot] < target) {
            lowerBound = pivot;
        } else {
            upperBound = pivot;
        }
        if (upperBound == lowerBound) {
            retIndex = upperBound;
            break
        }
        if (upperBound - lowerBound == 1) {
          retIndex = lowerBound;
          break
        }
    }
    let diff = 1
    let guessIndex = retIndex +1
    let tagStart = -1
    let tagEnd = -1
    let tagValue = ""
    while(diff>0&&guessIndex<arr.length)
    {
      tagStart = arr[guessIndex]
      tagEnd = getFirstGreaterThanTarget(tagStart,allTags)
      tagValue = html.substring(tagStart,tagEnd)
      if(tagValue.includes('</')||tagValue.includes('/>'))
      {
        diff-=1
      }
      else
      {
        diff+=1
      }
      guessIndex+=1
    }
    return tagEnd
  }
  
   function parseHtmlForTagsThatContainSubString(html, searchword) {
    allTags = [...html.matchAll(new RegExp("<[^<>]+>", "gi"))].map(
        (a) => a.index
    );
    searchwordTags = [
        ...html.matchAll(new RegExp("<[^<>]*" + searchword + "[^<>]*>", "gi")),
    ].map((a) => {return a.index});
    retTags = [];
    searchwordTags.forEach((index) => {
        closeIndex = getFirstGreaterThanTarget(index, allTags);
        retTags.push(html.substring(index, closeIndex));
    });
    return retTags;
  }

  async function parseURLForTagsThatContainSubstringAndReturnInnerHTML(url,searchword)
  {
    url = url.startsWith("http://") || url.startsWith("https://") ? url : "http://" + url

    let response = await fetch(url, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json; charset=utf-8',
        }
    })

    const html = await response.text();

    allTags = [...html.matchAll(new RegExp("<[^<>]+>", "gi"))].map(
        (a) => a.index
    );

    const searchwordTags = [
        ...html.matchAll(new RegExp("<[^<>]*" + searchword + "[^<>]*>", "gi")),
    ].map((a) => {return a.index});
    if(searchwordTags.length<1)
    {
        console.log("cant find")
        return ""
    }

    retTags = [];
    for(i = 0; i<searchwordTags.length;i++)
    {
        const searchwordTag = searchwordTags[i]
        const closeIndex = getFirstGreaterThanTarget(searchwordTag, allTags);
        const tag = html.substring(searchwordTag,closeIndex);
        const type = tag.substring(1,tag.indexOf(" "))
        retTags.push(html.substring(searchwordTag,getClosingTagFromTag(html, searchwordTag,type)))

    }
    return retTags
  }


export default {
    getFirstGreaterThanTarget,
    getClosingTagFromTag,
    parseHtmlForTagsThatContainSubString,
    parseURLForTagsThatContainSubstringAndReturnInnerHTML,
  }