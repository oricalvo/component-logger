export declare class AutoId {
}
export declare const AUTO_ID: AutoId;
export interface ILoggerActions {
    log(): any;
    warn(): any;
    error(): any;
}
export interface ILoggerArea {
    (...args: any[]): ILoggerActions;
    create(type: string): ILoggerType;
    enable(enabled: boolean | undefined): any;
}
export interface ILoggerType {
    (...args: any[]): ILoggerActions;
    create(name: string | AutoId): ILogger;
    enable(enabled: boolean | undefined): any;
}
export interface ILogger {
    (...args: any[]): ILoggerActions;
    enable(enabled: boolean | undefined): any;
}
export declare class Logger {
    private _parent;
    private _enabled;
    private _name;
    private _args;
    private _log;
    private _warn;
    private _error;
    private _prf;
    private static _sessionId;
    private static _sessionPending;
    private static _queue;
    private static ids;
    private static options;
    constructor(parent: Logger, name: string);
    enable(enabled: boolean | undefined): void;
    private isEnabled();
    readonly log: any;
    private serverLog(message);
    private static sendToServer(item);
    readonly warn: any;
    readonly error: any;
    private ensureSession();
    private static processQueue();
    private printProfileSummary(message, begin, end);
    profile(message: any, func: any): any;
    static configure(options: LoggerOptions): void;
    static forType(parent: Logger, type: string): ILoggerType;
    static forInstance(parent: Logger, id: number | AutoId): ILogger;
    static create(parent: Logger, name: any): ILogger;
    private static generateUniqueId(area, name);
    private doGetNames(names);
    private getNames();
    private buildPrefix();
}
export interface LoggerOptions {
    showLogType?: boolean;
}
export declare function forArea(area: string): ILoggerArea;
