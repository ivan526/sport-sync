"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSession = exports.encryptSession = exports.getSessionFromDB = exports.updateSessionToDB = exports.saveSessionToDB = exports.getDB = exports.initDB = void 0;
const constant_1 = require("../constant");
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const CryptoJS = require('crypto-js');
const GARMIN_USERNAME = process.env.GARMIN_USERNAME ?? constant_1.GARMIN_USERNAME_DEFAULT;
const AESKEY = process.env.AESKEY ?? 'Huawwwwwsdf';
const initDB = async () => {
    const db = await (0, exports.getDB)();
    await db.exec(`CREATE TABLE IF NOT EXISTS garmin_session (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user VARCHAR(20),
            region VARCHAR(20),
            session  TEXT
        )`);
};
exports.initDB = initDB;
const getDB = async () => {
    console.log('---getDB---');
    return await (0, sqlite_1.open)({
        filename: './db/garmin.db',
        driver: sqlite3_1.default.Database,
    });
};
exports.getDB = getDB;
const saveSessionToDB = async (type, session) => {
    const db = await (0, exports.getDB)();
    const encryptedSessionStr = (0, exports.encryptSession)(session);
    await db.run(`INSERT INTO garmin_session (user,region,session) VALUES (?,?,?)`, GARMIN_USERNAME, type, encryptedSessionStr);
};
exports.saveSessionToDB = saveSessionToDB;
const updateSessionToDB = async (type, session) => {
    const db = await (0, exports.getDB)();
    const encryptedSessionStr = (0, exports.encryptSession)(session);
    await db.run('UPDATE garmin_session SET session = ? WHERE user = ? AND region = ?', encryptedSessionStr, GARMIN_USERNAME, type);
};
exports.updateSessionToDB = updateSessionToDB;
const getSessionFromDB = async (type) => {
    const db = await (0, exports.getDB)();
    const queryResult = await db.get('SELECT session FROM garmin_session WHERE user = ? AND region = ? ', GARMIN_USERNAME, type);
    if (!queryResult) {
        return undefined;
    }
    const encryptedSessionStr = queryResult?.session;
    return (0, exports.decryptSession)(encryptedSessionStr);
};
exports.getSessionFromDB = getSessionFromDB;
const encryptSession = (session) => {
    const sessionStr = JSON.stringify(session);
    return CryptoJS.AES.encrypt(sessionStr, AESKEY).toString();
};
exports.encryptSession = encryptSession;
const decryptSession = (sessionStr) => {
    const bytes = CryptoJS.AES.decrypt(sessionStr, AESKEY);
    const session = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(session);
};
exports.decryptSession = decryptSession;
//# sourceMappingURL=sqlite.js.map