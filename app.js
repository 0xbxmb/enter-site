/**
 * Created by e.popov on 15.07.2014.
 */

var express = require("express"),
    app = express(),
    vidStreamer = require("vid-streamer"),
    port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/videos/", vidStreamer);
app.listen(port);
console.log("VidStreamer.js up and running on port 3000");