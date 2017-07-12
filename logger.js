"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger = (function () {
    function Logger(area, name, id) {
        this._enabled = true;
        this._area = area;
        this._name = name;
        this._id = id;
        var prefix = this.buildPrefix();
        this._log = console.log.bind(console, "LOG " + prefix);
        this._warn = console.warn.bind(console, "WRN " + prefix);
        this._error = console.error.bind(console, "ERR " + prefix);
    }
    Object.defineProperty(Logger.prototype, "log", {
        get: function () {
            if (!this._enabled) {
                return noop;
            }
            return this._log;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Logger.prototype, "warn", {
        get: function () {
            if (!this._enabled) {
                return noop;
            }
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
            return this._error;
        },
        enumerable: true,
        configurable: true
    });
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
        return new Logger(area, name, id);
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
    return Logger;
}());
Logger.ids = {};
Logger.AUTO_ID = "AUTO_ID";
exports.Logger = Logger;
function noop() {
}
//# sourceMappingURL=logger.js.map