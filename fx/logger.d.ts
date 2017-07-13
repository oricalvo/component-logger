export declare type AUTO_ID = "AUTO_ID";
export declare class Logger {
    private _enabled;
    private _area;
    private _name;
    private _id;
    private _log;
    private _warn;
    private _error;
    private _prf;
    private static _sessionId;
    private static _sessionPending;
    private static _queue;
    private static ids;
    private static options;
    static AUTO_ID: string;
    constructor(area: string, name: string, id: number);
    log(message: string): any;
    private serverLog(message);
    private static sendToServer(item);
    readonly warn: any;
    readonly error: any;
    private ensureSession();
    private static processQueue();
    private printProfileSummary(message, begin, end);
    profile(message: any, func: any): any;
    static configure(options: LoggerOptions): void;
    static create(name: string, id?: number | AUTO_ID): any;
    static create(area: string, name: string, id?: number | AUTO_ID): any;
    private static generateUniqueId(area, name);
    private buildPrefix();
}
export interface LoggerOptions {
    showLogType?: boolean;
}
