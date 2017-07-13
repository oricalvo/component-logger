export type AUTO_ID = "AUTO_ID";

export class Logger {
    private _enabled: boolean;
    private _area: string | undefined;
    private _name: string;
    private _id: number | undefined;
    private _log;
    private _warn;
    private _error;
    private _prf;

    private static _sessionId: number;
    private static _sessionPending: Promise<void>;
    private static _queue: any[] = [];
    private static ids: {[key: string]: number} = {};
    private static options: LoggerOptions = {
        showLogType: false,
    }

    static AUTO_ID = "AUTO_ID";

    constructor(area: string, name: string, id: number) {
        this._enabled = true;
        this._area = area;
        this._name = name;
        this._id = id;

        const prefix = this.buildPrefix();
        this._log = console.log.bind(console, (Logger.options.showLogType ? "LOG " : "") + prefix);
        this._warn = console.warn.bind(console, (Logger.options.showLogType ? "WRN " : "") + prefix);
        this._error = console.error.bind(console, (Logger.options.showLogType ? "ERR " : "") + prefix);
        this._prf = console.log.bind(console, (Logger.options.showLogType ? "PRF " : "") + prefix);
    }

    log(message: string) {
        if(!this._enabled) {
            return noop;
        }

        this.serverLog(message);

        return this._log.bind(undefined, message);
    }

    private serverLog(message) {
        const item = {
            sessionId: Logger._sessionId,
            area: this._area,
            name: this._name,
            id: this._id,
            message: message,
        };

        if(this.ensureSession()) {
            Logger.sendToServer(item);
        }
        else {
            Logger._queue.push(item);
        }
    }

    private static sendToServer(item) {
        fetch("http://localhost:3300/log", {
            method: "POST",
            body: JSON.stringify(item),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    get warn() {
        if(!this._enabled) {
            return noop;
        }

        this.ensureSession();

        return this._warn;
    }

    get error() {
        if(!this._enabled) {
            return noop;
        }

        this.ensureSession();

        return this._error;
    }

    private ensureSession() {
        if(Logger._sessionId && Logger._sessionPending) {
            return true;
        }

        if(!Logger._sessionPending) {
            Logger._sessionPending = fetch("http://localhost:3300/session", {
                method: "POST",
                body: "",
            }).then(res => res.json()).then(res => {
                Logger._sessionId = res.sessionId;

                Logger.processQueue();
            });
        }

        return false;
    }

    private static processQueue() {
        for(let item of Logger._queue) {
            item.sessionId = Logger._sessionId;

            Logger.sendToServer(item);
        }
    }

    private printProfileSummary(message: string, begin: number, end: number) {
        this._prf(message, (end - begin));
    }

    profile(message, func) {
        const begin = performance.now();
        const retVal = func();
        const end = performance.now();
        this.printProfileSummary("SYNC " + message, begin, end);

        if(retVal && retVal.then) {
            retVal.then(()=> {
                const end = performance.now();
                this.printProfileSummary("ASYNC " + message, begin, end);
            }, ()=> {
                const end = performance.now();
                this.printProfileSummary("ASYNC " + message, begin, end);
            });
        }

        return retVal;
    }

    static configure(options: LoggerOptions) {
        Object.assign(Logger.options, options);
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

        const logger = new Logger(area, name, id);
        return logger;
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

export interface LoggerOptions {
    showLogType?: boolean;
}
