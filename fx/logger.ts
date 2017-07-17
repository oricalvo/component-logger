export type AUTO_ID = "AUTO_ID";

export interface ILoggerActions {
    log(...args);
}

export interface ILoggerArea {
    (message: string): ILoggerActions;
    create(type: string): ILoggerType;
    enable(enabled: boolean|undefined);
}

export interface ILoggerType {
    (message: string): ILoggerActions;
    create(id: number|AUTO_ID): ILogger;
    enable(enabled: boolean|undefined);
}

export interface ILogger {
    (message: string): ILoggerActions;
    enable(enabled: boolean|undefined);
}

export class Logger {
    private _parent: Logger;
    private _enabled: boolean|undefined;
    private _name: string;
    private _message: string;
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

    constructor(parent: Logger, name: string) {
        this._parent = parent;
        this._enabled = undefined;
        this._name = name;
        this._message = "";

        const prefix = this.buildPrefix();
        this._log = console.log.bind(console, (Logger.options.showLogType ? "LOG " : "") + prefix);
        this._warn = console.warn.bind(console, (Logger.options.showLogType ? "WRN " : "") + prefix);
        this._error = console.error.bind(console, (Logger.options.showLogType ? "ERR " : "") + prefix);
        this._prf = console.log.bind(console, (Logger.options.showLogType ? "PRF " : "") + prefix);
    }

    enable(enabled: boolean|undefined) {
        this._enabled = enabled;
    }

    private isEnabled() {
        if(this._enabled!==undefined) {
            return this._enabled;
        }

        if(this._parent) {
            return this._parent.isEnabled();
        }

        return true;
    }

    get log() {
        if(!this.isEnabled()) {
            return noop;
        }

        this.serverLog(this._message);

        return this._log.bind(undefined, this._message);
    }

    private serverLog(message) {
        // const item = {
        //     sessionId: Logger._sessionId,
        //     name: this.getNames(),
        //     message: message,
        // };
        //
        // if(this.ensureSession()) {
        //     Logger.sendToServer(item);
        // }
        // else {
        //     Logger._queue.push(item);
        // }
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
        if(!this.isEnabled()) {
            return noop;
        }

        this.ensureSession();

        return this._warn;
    }

    get error() {
        if(!this.isEnabled()) {
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

    static forArea(area: string): ILoggerArea {
        const logger = new Logger(null, area);

        const retVal: any = function(message: string) {
            logger._message = message;

            return logger;
        }

        retVal.create = function(name) {
            return Logger.forType(logger, name);
        }

        retVal.enable = function(enabled: boolean|undefined) {
            logger.enable(enabled);
        }

        return retVal;
    }

    static forType(parent: Logger, type: string): ILoggerType {
        const logger = new Logger(parent, type);

        const retVal: any = function(message: string) {
            logger._message = message;

            return logger;
        }

        retVal.create = function(id: number|AUTO_ID) {
            return Logger.forInstance(logger, id);
        }

        retVal.enable = function(enabled: boolean|undefined) {
            logger.enable(enabled);
        }

        return retVal;
    }

    static forInstance(parent: Logger, id: number|AUTO_ID): ILogger {
        return Logger.create(parent, id);
    }

    static create(parent: Logger, name): ILogger {
        if(name == Logger.AUTO_ID) {
            name = Logger.generateUniqueId.apply(undefined, parent.getNames());
        }

        const logger = new Logger(parent, name);

        const retVal: any = function(message: string) {
            logger._message = message;

            return logger;
        }

        retVal.enable = function(enabled: boolean|undefined) {
            logger.enable(enabled);
        }

        return retVal;
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

    private doGetNames(names: string[]) {
        if(this._parent) {
            this._parent.doGetNames(names);
        }

        names.push(this._name);
    }

    private getNames() {
        const names = [];

        this.doGetNames(names);

        return names;
    }

    private buildPrefix() {
        const names = this.getNames();

        // for(let i=0; i<names.length; i++) {
        //     names[i] = names[i] + ">";
        // }

        return names.join(":") + ">";

        // const parent = (this._parent ? "[" + this._parent.buildPrefix() + "]" + " " : "");
        // const name = this._name;
        // //const id = (this._id ? "(" + this._id + ")" : "");
        // return `${parent}${name}>`;
    }
}

function noop() {
}

export interface LoggerOptions {
    showLogType?: boolean;
}
