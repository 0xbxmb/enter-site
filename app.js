/**
 * Created by e.popov on 15.07.2014.
 */

var express = require("express"),
    app = express(),
    vidStreamer = require("vid-streamer"),
    port = process.env.PORT || 80,
    settings = {
        "forceDownload": false,
        "rootPath": "videos/",
        "server": 'app.js'
    };

app.use(express.static(__dirname));

app.get("/videos/", vidStreamer.settings(settings));
app.listen(port);
console.log("app.js up and running on port " + port);
