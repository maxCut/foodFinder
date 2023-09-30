running = True
state = ""
while(running):
     if(state == ""):
        prompt = "Options\nq: quit app\nn: create new recipe\n"
        user_input = input(prompt)
        if(user_input=='q'):
             running = False
        elif(user_input=='n'):
            state = "n"