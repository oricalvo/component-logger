export declare type AUTO_ID = "AUTO_ID";
export declare class Logger {
    private _enabled;
    private _area;
    private _name;
    private _id;
    private _log;
    private _warn;
    private _error;
    private static ids;
    static AUTO_ID: string;
    constructor(area: string, name: string, id: number);
    readonly log: any;
    readonly warn: any;
    readonly error: any;
    static create(name: string, id?: number | AUTO_ID): any;
    static create(area: string, name: string, id?: number | AUTO_ID): any;
    private static generateUniqueId(area, name);
    private buildPrefix();
}
