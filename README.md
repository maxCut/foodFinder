Instructions: - Web:
The website has two components, the client and the server. Since the site is currently static, the servers job is to host needed files and redirect to display the client. - Client:
The client side of the code is based around the "index.html" file. This is the base of all the code. Note there are some assets that are shared amongst other areas such as mobile. This is in "shared" folder. If something can be shared with mobile or chrome-extension the asset should be moved there.

            Testing: for short u/i tests you can open index.html directly with your chrome browser to see u/i changes
        - Server:
            The server is a node express script. It hosts files and connects site to the client.
            Packages are managed by npm. If you need a new package run npm install package. Then push that change. Do not use npm install -g.

            Initial set up: Run npm install to download all needed packages (express, node, ect). You may need to install some stuff on your computer. Follow this guide to get set up https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
            Testing: to run the server locally run npm start. You should always test this if you move a part of the code to a new directory outside of client, or refference a part of the code outside of client.

        - Chrome Extension:
            The chrome extension is currently used to communicate with amazon api and avoid CORS violation. If you need to make a change make the change locally then test by
            going to Chrome://extensions the select load unpacked extension and select the chrome-extension folder.

        - Mobile:
            Mobile is written in react-native. The goal here is to share code with Client. This will allow us to avoid duplicate code.

            Initial setup: First follow this guide to make sure you can use react on your OS https://reactnative.dev/docs/environment-setup

            Testing: In the mobile/main_app directory run "npx react-native start" then in another powershell/terminal instance run "npx react-native run-android". This will run an android instance of the app. In order to test IOS you need a mac.
