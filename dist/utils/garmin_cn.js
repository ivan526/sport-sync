"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncGarminCN2GarminGlobal = exports.migrateGarminCN2GarminGlobal = exports.getGaminCNClient = void 0;
const garmin_global_1 = require("./garmin_global");
const constant_1 = require("../constant");
const garmin_common_1 = require("./garmin_common");
const core = require('@actions/core');
const lodash_1 = __importDefault(require("lodash"));
const sqlite_1 = require("./sqlite");
const CryptoJS = require('crypto-js');
const fs = require('fs');
const { GarminConnect } = require('@gooin/garmin-connect-cn');
const GARMIN_USERNAME = process.env.GARMIN_USERNAME ?? constant_1.GARMIN_USERNAME_DEFAULT;
const GARMIN_PASSWORD = process.env.GARMIN_PASSWORD ?? constant_1.GARMIN_PASSWORD_DEFAULT;
const GARMIN_MIGRATE_NUM = process.env.GARMIN_MIGRATE_NUM ?? constant_1.GARMIN_MIGRATE_NUM_DEFAULT;
const GARMIN_MIGRATE_START = process.env.GARMIN_MIGRATE_START ?? constant_1.GARMIN_MIGRATE_START_DEFAULT;
const getGaminCNClient = async () => {
    if (lodash_1.default.isEmpty(GARMIN_USERNAME) || lodash_1.default.isEmpty(GARMIN_PASSWORD)) {
        const errMsg = '请填写中国区用户名及密码：GARMIN_USERNAME,GARMIN_PASSWORD';
        core.setFailed(errMsg);
        return Promise.reject(errMsg);
    }
    const GCClient = new GarminConnect();
    try {
        await (0, sqlite_1.initDB)();
        const currentSession = await (0, sqlite_1.getSessionFromDB)('CN');
        if (!currentSession) {
            await GCClient.login(GARMIN_USERNAME, GARMIN_PASSWORD);
            await (0, sqlite_1.saveSessionToDB)('CN', GCClient.sessionJson);
        }
        else {
            try {
                await GCClient.restore(currentSession);
                console.log('GarminCN: login by saved session');
            }
            catch (e) {
                console.log('Warn: renew  GarminCN Session..');
                await GCClient.login(GARMIN_USERNAME, GARMIN_PASSWORD);
                await (0, sqlite_1.updateSessionToDB)('CN', GCClient.sessionJson);
            }
        }
        const userInfo = await GCClient.getUserInfo();
        const { username, emailAddress, locale } = userInfo;
        if (!username) {
            throw Error('佳明中国区登录失败');
        }
        console.log('Garmin userInfo CN: ', { username, emailAddress, locale });
        return GCClient;
    }
    catch (err) {
        console.error(err);
        core.setFailed(err);
    }
};
exports.getGaminCNClient = getGaminCNClient;
const migrateGarminCN2GarminGlobal = async (count = 200) => {
    const actIndex = Number(GARMIN_MIGRATE_START) ?? 0;
    const totalAct = Number(GARMIN_MIGRATE_NUM) ?? count;
    const clientCN = await (0, exports.getGaminCNClient)();
    const clientGlobal = await (0, garmin_global_1.getGaminGlobalClient)();
    const actSlices = await clientCN.getActivities(actIndex, totalAct);
    const runningActs = actSlices;
    for (let j = 0; j < runningActs.length; j++) {
        const act = runningActs[j];
        const filePath = await (0, garmin_common_1.downloadGarminActivity)(act.activityId, clientCN);
        console.log(`本次开始向国际区上传第 ${j + 1} 条数据，相对总数上传到 ${j + 1 + actIndex} 条，  【 ${act.activityName} 】，开始于 【 ${act.startTimeLocal} 】，活动ID: 【 ${act.activityId} 】`);
        await (0, garmin_common_1.uploadGarminActivity)(filePath, clientGlobal);
    }
};
exports.migrateGarminCN2GarminGlobal = migrateGarminCN2GarminGlobal;
const syncGarminCN2GarminGlobal = async () => {
    const clientCN = await (0, exports.getGaminCNClient)();
    const clientGlobal = await (0, garmin_global_1.getGaminGlobalClient)();
    let cnActs = await clientCN.getActivities(0, 10);
    const globalActs = await clientGlobal.getActivities(0, 1);
    const latestGlobalActStartTime = globalActs[0]?.startTimeLocal ?? '0';
    const latestCnActStartTime = cnActs[0]?.startTimeLocal ?? '0';
    if (latestCnActStartTime === latestGlobalActStartTime) {
        console.log(`没有要同步的活动内容, 最近的活动:  【 ${cnActs[0].activityName} 】, 开始于: 【 ${latestCnActStartTime} 】`);
    }
    else {
        lodash_1.default.reverse(cnActs);
        let actualNewActivityCount = 1;
        for (let i = 0; i < cnActs.length; i++) {
            const cnAct = cnActs[i];
            if (cnAct.startTimeLocal > latestGlobalActStartTime) {
                const filePath = await (0, garmin_common_1.downloadGarminActivity)(cnAct.activityId, clientCN);
                console.log(`本次开始向国际区上传第 ${actualNewActivityCount} 条数据，【 ${cnAct.activityName} 】，开始于 【 ${cnAct.startTimeLocal} 】，活动ID: 【 ${cnAct.activityId} 】`);
                await (0, garmin_common_1.uploadGarminActivity)(filePath, clientGlobal);
                await new Promise(resolve => setTimeout(resolve, 1000));
                actualNewActivityCount++;
            }
        }
    }
};
exports.syncGarminCN2GarminGlobal = syncGarminCN2GarminGlobal;
//# sourceMappingURL=garmin_cn.js.map