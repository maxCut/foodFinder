var path = require("path");
var express = require("express");
const { allowedNodeEnvironmentFlags } = require("process");
var app = express();
var port = process.env.PORT || 3000;
var dir = path.join(__dirname, "../react_client/build");

app.use("/shared", express.static(path.join(__dirname, "../shared")));
app.use(express.static(dir));

app.listen(port, function () {
    console.log("Listening on http://localhost:" + port + "/");
});
app.get("*", (req, res) => {
    res.sendFile(path.resolve(`${__dirname}/../react_client/build/index.html`));
});
