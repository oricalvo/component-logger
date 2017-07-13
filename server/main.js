"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var loki = require("lokijs");
var app = express();
var nextSessionId = 1;
var dbs = {};
app.use(cors());
app.use(bodyParser.json());
app.post("/session", function (req, res) {
    console.log("API /session", req.body);
    var sessionId = nextSessionId++;
    var db = new loki("session" + sessionId + ".json", {
        autosave: true,
        autosaveInterval: 4000
    });
    var logs = db.addCollection("logs");
    dbs[sessionId] = {
        db: db,
        logs: logs,
    };
    res.json({
        sessionId: sessionId,
    });
});
app.post("/log", function (req, res) {
    console.log("API /log", req.body);
    var item = req.body;
    var sessionId = item.sessionId;
    if (!sessionId) {
        res.status(405);
        res.statusMessage = "sessionId is missing";
        res.end();
        return;
    }
    var entry = dbs[sessionId];
    if (!entry) {
        res.status(405);
        res.statusMessage = "Invalid sessionId " + sessionId;
        res.end();
        return;
    }
    entry.logs.insert(item);
    res.end();
});
app.listen(3300, function () {
    console.log("Server is running");
});
//# sourceMappingURL=main.js.map