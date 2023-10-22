from bs4 import BeautifulSoup
from urllib.request import Request, urlopen
import re

def guessRecipeName(url):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    html_page = urlopen(req).read()
    soup = BeautifulSoup(html_page, 'html.parser')
    print(soup.find_all("h1"))
    return (soup.find("h1")).text

running = True
state = ""
user_input = ""
while(running):
     if(state == ""):
        prompt = "Options\nq: quit app\n1: create new recipe\n"
        user_input = input(prompt)
        if(user_input=='1'):
            state = "1"
     elif(state[0] == '1'):
        prompt = "Enter url\n"
        url = input(prompt)
        guessName = guessRecipeName(url)
        
        prompt = "Enter recipe name [default to " + guessName+ "]\n"
        recipeName = input(prompt)
        if(recipeName == ""):
            recipeName = guessName
        prompt = "Enter image url\n"
        image_url = input(prompt)
        break

    
     if(user_input=='q'):
        running = False
