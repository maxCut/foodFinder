var path = require("path");
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
var dir = path.join(__dirname, "../client");

app.use(express.static(dir));

app.listen(port, function () {
    console.log("Listening on http://localhost:" + port + "/");
});
app.get("*", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../client/index.html`));
});
