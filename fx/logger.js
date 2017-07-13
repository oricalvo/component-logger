"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = (function () {
    function Logger(area, name, id) {
        this._enabled = true;
        this._area = area;
        this._name = name;
        this._id = id;
        var prefix = this.buildPrefix();
        this._log = console.log.bind(console, (Logger.options.showLogType ? "LOG " : "") + prefix);
        this._warn = console.warn.bind(console, (Logger.options.showLogType ? "WRN " : "") + prefix);
        this._error = console.error.bind(console, (Logger.options.showLogType ? "ERR " : "") + prefix);
        this._prf = console.log.bind(console, (Logger.options.showLogType ? "PRF " : "") + prefix);
    }
    Logger.prototype.log = function (message) {
        if (!this._enabled) {
            return noop;
        }
        this.serverLog(message);
        return this._log.bind(undefined, message);
    };
    Logger.prototype.serverLog = function (message) {
        var item = {
            sessionId: Logger._sessionId,
            area: this._area,
            name: this._name,
            id: this._id,
            message: message,
        };
        if (this.ensureSession()) {
            Logger.sendToServer(item);
        }
        else {
            Logger._queue.push(item);
        }
    };
    Logger.sendToServer = function (item) {
        fetch("http://localhost:3300/log", {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };
    Object.defineProperty(Logger.prototype, "warn", {
        get: function () {
            if (!this._enabled) {
                return noop;
            }
            this.ensureSession();
            return this._warn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "error", {
        get: function () {
            if (!this._enabled) {
                return noop;
            }
            this.ensureSession();
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
    Logger.prototype.ensureSession = function () {
        if (Logger._sessionId && Logger._sessionPending) {
            return true;
        }
        if (!Logger._sessionPending) {
            Logger._sessionPending = fetch("http://localhost:3300/session", {
                method: "POST",
                body: "",
            }).then(function (res) { return res.json(); }).then(function (res) {
                Logger._sessionId = res.sessionId;
                Logger.processQueue();
            });
        }
        return false;
    };
    Logger.processQueue = function () {
        for (var _i = 0, _a = Logger._queue; _i < _a.length; _i++) {
            var item = _a[_i];
            item.sessionId = Logger._sessionId;
            Logger.sendToServer(item);
        }
    };
    Logger.prototype.printProfileSummary = function (message, begin, end) {
        this._prf(message, (end - begin));
    };
    Logger.prototype.profile = function (message, func) {
        var _this = this;
        var begin = performance.now();
        var retVal = func();
        var end = performance.now();
        this.printProfileSummary("SYNC " + message, begin, end);
        if (retVal && retVal.then) {
            retVal.then(function () {
                var end = performance.now();
                _this.printProfileSummary("ASYNC " + message, begin, end);
            }, function () {
                var end = performance.now();
                _this.printProfileSummary("ASYNC " + message, begin, end);
            });
        }
        return retVal;
    };
    Logger.configure = function (options) {
        Object.assign(Logger.options, options);
    };
    Logger.create = function (area, name, id) {
        if (arguments.length == 2) {
            if (typeof name == "number" || name == Logger.AUTO_ID) {
                id = name;
                name = area;
                area = undefined;
            }
        }
        else if (arguments.length == 1) {
            name = area;
            area = undefined;
        }
        if (id == Logger.AUTO_ID) {
            id = Logger.generateUniqueId(area, name);
        }
        var logger = new Logger(area, name, id);
        return logger;
    };
    Logger.generateUniqueId = function (area, name) {
        var key = area + "_" + name;
        var nextId = Logger.ids[key];
        if (!nextId) {
            nextId = 0;
        }
        nextId = Logger.ids[key] = nextId + 1;
        return nextId;
    };
    Logger.prototype.buildPrefix = function () {
        var area = (this._area ? "[" + this._area + "]" + " " : "");
        var name = this._name;
        var id = (this._id ? "(" + this._id + ")" : "");
        return "" + area + name + id + ">";
    };
    Logger._queue = [];
    Logger.ids = {};
    Logger.options = {
        showLogType: false,
    };
    Logger.AUTO_ID = "AUTO_ID";
    return Logger;
}());
exports.Logger = Logger;
function noop() {
}
//# sourceMappingURL=logger.js.map