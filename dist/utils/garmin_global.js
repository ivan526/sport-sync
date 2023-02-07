"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncGarminGlobal2GarminCN = exports.migrateGarminGlobal2GarminCN = exports.getGaminGlobalClient = void 0;
const constant_1 = require("../constant");
const garmin_cn_1 = require("./garmin_cn");
const garmin_common_1 = require("./garmin_common");
const core = require('@actions/core');
const lodash_1 = __importDefault(require("lodash"));
const sqlite_1 = require("./sqlite");
const { GarminConnect } = require('@gooin/garmin-connect');
const GARMIN_GLOBAL_USERNAME = process.env.GARMIN_GLOBAL_USERNAME ?? constant_1.GARMIN_GLOBAL_USERNAME_DEFAULT;
const GARMIN_GLOBAL_PASSWORD = process.env.GARMIN_GLOBAL_PASSWORD ?? constant_1.GARMIN_GLOBAL_PASSWORD_DEFAULT;
const GARMIN_MIGRATE_NUM = process.env.GARMIN_MIGRATE_NUM ?? constant_1.GARMIN_MIGRATE_NUM_DEFAULT;
const GARMIN_MIGRATE_START = process.env.GARMIN_MIGRATE_START ?? constant_1.GARMIN_MIGRATE_START_DEFAULT;
const getGaminGlobalClient = async () => {
    if (lodash_1.default.isEmpty(GARMIN_GLOBAL_USERNAME) || lodash_1.default.isEmpty(GARMIN_GLOBAL_PASSWORD)) {
        const errMsg = '请填写国际区用户名及密码：GARMIN_GLOBAL_USERNAME,GARMIN_GLOBAL_PASSWORD';
        core.setFailed(errMsg);
        return Promise.reject(errMsg);
    }
    const GCClient = new GarminConnect();
    try {
        console.log('----1----');
        await (0, sqlite_1.initDB)();
        console.log('----2----');
        const currentSession = await (0, sqlite_1.getSessionFromDB)('GLOBAL');
        console.log('----3----');
        if (!currentSession) {
            await GCClient.login(GARMIN_GLOBAL_USERNAME, GARMIN_GLOBAL_PASSWORD);
            console.log('----4----');
            await (0, sqlite_1.saveSessionToDB)('GLOBAL', GCClient.sessionJson);
        }
        else {
            try {
                console.log('GarminGlobal: login by saved session');
                await GCClient.restore(currentSession);
            }
            catch (e) {
                console.log('Warn: renew GarminGlobal session..');
                await GCClient.login(GARMIN_GLOBAL_USERNAME, GARMIN_GLOBAL_PASSWORD);
                await (0, sqlite_1.updateSessionToDB)('GLOBAL', GCClient.sessionJson);
            }
        }
        const userInfo = await GCClient.getUserInfo();
        const { username, emailAddress, locale } = userInfo;
        if (!username) {
            throw Error('佳明国际区登录失败，请检查填入的账号密码或您的网络环境');
        }
        console.log('Garmin userInfo global', { username, emailAddress, locale });
        return GCClient;
    }
    catch (err) {
        console.error(err);
        core.setFailed(err);
    }
};
exports.getGaminGlobalClient = getGaminGlobalClient;
const migrateGarminGlobal2GarminCN = async (count = 200) => {
    const actIndex = Number(GARMIN_MIGRATE_START) ?? 0;
    const totalAct = Number(GARMIN_MIGRATE_NUM) ?? count;
    const clientCn = await (0, garmin_cn_1.getGaminCNClient)();
    const clientGlobal = await (0, exports.getGaminGlobalClient)();
    const actSlices = await clientGlobal.getActivities(actIndex, totalAct);
    const runningActs = actSlices;
    for (let j = 0; j < runningActs.length; j++) {
        const act = runningActs[j];
        const filePath = await (0, garmin_common_1.downloadGarminActivity)(act.activityId, clientGlobal);
        console.log(`本次开始向中国区上传第 ${(j + 1)} 条数据，相对总数上传到 ${(j + 1 + actIndex)} 条，  【 ${act.activityName} 】，开始于 【 ${act.startTimeLocal} 】，活动ID: 【 ${act.activityId} 】`);
        await (0, garmin_common_1.uploadGarminActivity)(filePath, clientCn);
    }
};
exports.migrateGarminGlobal2GarminCN = migrateGarminGlobal2GarminCN;
const syncGarminGlobal2GarminCN = async () => {
    const clientCN = await (0, garmin_cn_1.getGaminCNClient)();
    const clientGlobal = await (0, exports.getGaminGlobalClient)();
    const cnActs = await clientCN.getActivities(0, 1);
    let globalActs = await clientGlobal.getActivities(0, 10);
    const latestGlobalActStartTime = globalActs[0]?.startTimeLocal ?? '0';
    const latestCnActStartTime = cnActs[0]?.startTimeLocal ?? '0';
    if (latestCnActStartTime === latestGlobalActStartTime) {
        console.log(`没有要同步的活动内容, 最近的活动:  【 ${globalActs[0]?.activityName} 】, 开始于: 【 ${latestGlobalActStartTime} 】`);
    }
    else {
        lodash_1.default.reverse(globalActs);
        let actualNewActivityCount = 1;
        for (let i = 0; i < globalActs.length; i++) {
            const globalAct = globalActs[i];
            if (globalAct.startTimeLocal > latestCnActStartTime) {
                const filePath = await (0, garmin_common_1.downloadGarminActivity)(globalAct.activityId, clientGlobal);
                console.log(`本次开始向中国区上传第 ${(actualNewActivityCount)} 条数据，【 ${globalAct.activityName} 】，开始于 【 ${globalAct.startTimeLocal} 】，活动ID: 【 ${globalAct.activityId} 】`);
                await (0, garmin_common_1.uploadGarminActivity)(filePath, clientCN);
                await new Promise(resolve => setTimeout(resolve, 1000));
                actualNewActivityCount++;
            }
        }
    }
};
exports.syncGarminGlobal2GarminCN = syncGarminGlobal2GarminCN;
//# sourceMappingURL=garmin_global.js.map