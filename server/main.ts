import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import * as loki from "lokijs";

const app = express();

let nextSessionId = 1;
const dbs: {[sessionId: number]: any} = {};

app.use(cors());
app.use(bodyParser.json());

app.post("/session", function(req, res) {
    console.log("API /session", req.body);

    const sessionId = nextSessionId++;

    const db = new loki("session" + sessionId + ".json", {
        autosave: true,
        autosaveInterval: 4000
    });
    const logs = db.addCollection("logs");

    dbs[sessionId] = {
        db: db,
        logs: logs,
    };

    res.json({
        sessionId: sessionId,
    });
});

app.post("/log", function(req, res) {
    console.log("API /log", req.body);

    const item = req.body;
    const sessionId = item.sessionId;
    if(!sessionId) {
        res.status(405);
        res.statusMessage = "sessionId is missing";
        res.end();
        return;
    }

    const entry = dbs[sessionId];
    if(!entry) {
        res.status(405);
        res.statusMessage = "Invalid sessionId " + sessionId;
        res.end();
        return;
    }

    entry.logs.insert(item);

    res.end();
});

app.listen(3300, function() {
    console.log("Server is running");
});
