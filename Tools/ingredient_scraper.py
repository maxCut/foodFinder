import requests
from bs4 import BeautifulSoup
import json

res = []
with open('/Users/maxmesirow/Desktop/code/foodFinder/shared/ingredients.json') as f:
    d = json.load(f)
    for j in range(len(d)):
        key = d[j]["Key"]
        if(key[0]!='f'):
            continue
        name = d[j]["Name"]
        searchTerm = name.replace(" ", "+")
        URL = "https://www.amazon.com/s?k="+searchTerm+"&rh=p_n_alm_brand_id%3A18075438011"

        HEADERS = ({'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.158 Safari/537.36',
            'Accept-Language': 'en-US, en;q=0.5'})

        page = requests.get(URL, headers=HEADERS)

        soup = BeautifulSoup(page.content, "html.parser")

        options = []
        results = soup.findAll('div', 
                       {'class':['s-asin']})
        for i in range(min(5,len(results))):
            try :
                asin = results[i]['data-asin']
                asinURL = "https://www.amazon.com/dp/"+asin+"/"
                priceDiv = results[i].find('div', {'class':['s-price-instructions-style']})
                wholePrice = priceDiv.find('span', {'class':['a-offscreen']}).text.replace('$','')
                unitSpan = priceDiv.find('span',{'class':['a-size-base']} )
                unitPrice = unitSpan.find('span', {'class':['a-offscreen']}).text.replace('$','')
                unit = unitSpan.text.split('/')[1]
                unit = unit.replace(')','')
                options.append(
                    {'Unit':unit,
                    'Unit_Size':round((float(wholePrice)/float(unitPrice)),2), 
                    'Unit_Price': float(unitPrice),
                    'ASIN': asin,
                    'Link':asinURL,}
                    )
            except:
                continue
        res.append({"Key":key,"Name": name, "Options" : options})
print(json.dumps(res))