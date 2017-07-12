export type AUTO_ID = "AUTO_ID";

export class Logger {
    private _enabled: boolean;
    private _area: string | undefined;
    private _name: string;
    private _id: number | undefined;
    private _log;
    private _warn;
    private _error;

    private static ids: {[key: string]: number} = {};

    static AUTO_ID = "AUTO_ID";

    constructor(area: string, name: string, id: number) {
        this._enabled = true;
        this._area = area;
        this._name = name;
        this._id = id;

        const prefix = this.buildPrefix();
        this._log = console.log.bind(console, "LOG " + prefix);
        this._warn = console.warn.bind(console, "WRN " + prefix);
        this._error = console.error.bind(console, "ERR " + prefix);
    }

    get log() {
        if(!this._enabled) {
            return noop;
        }

        return this._log;
    }

    get warn() {
        if(!this._enabled) {
            return noop;
        }

        return this._warn;
    }

    get error() {
        if(!this._enabled) {
            return noop;
        }

        return this._error;
    }

    static create(name: string, id?: number|AUTO_ID);
    static create(area: string, name: string, id?: number|AUTO_ID)
    static create(area, name?, id?) {
        if(arguments.length == 2) {
            if(typeof name == "number" || name == Logger.AUTO_ID) {
                id = name;
                name = area;
                area = undefined;
            }
        }
        else if(arguments.length == 1) {
            name = area;
            area = undefined;
        }

        if(id == Logger.AUTO_ID) {
            id = Logger.generateUniqueId(area, name);
        }

        return new Logger(area, name, id);
    }

    private static generateUniqueId(area: string, name: string) {
        const key = area + "_" + name;
        let nextId = Logger.ids[key];
        if(!nextId) {
            nextId = 0;
        }

        nextId = Logger.ids[key] = nextId + 1;

        return nextId;
    }

    private buildPrefix() {
        const area = (this._area ? "[" + this._area + "]" + " " : "");
        const name = this._name;
        const id = (this._id ? "(" + this._id + ")" : "");
        return `${area}${name}${id}>`;
    }
}

function noop() {
}

