var path = require("path");
var express = require("express");
var app = express();

var dir = path.join(__dirname, "../client");

app.use(express.static(dir));

app.listen(3000, function () {
    console.log("Listening on http://localhost:3000/");
});

app.get("*", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});
