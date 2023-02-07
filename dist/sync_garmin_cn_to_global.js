"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("./constant");
const garmin_cn_1 = require("./utils/garmin_cn");
const axios = require('axios');
const core = require('@actions/core');
const BARK_KEY = process.env.BARK_KEY ?? constant_1.BARK_KEY_DEFAULT;
try {
    (0, garmin_cn_1.syncGarminCN2GarminGlobal)();
}
catch (e) {
    axios.get(`https://api.day.app/${BARK_KEY}/Garmin CN -> Garmin Global 同步数据运行失败了，快去检查！/${e.message}`);
    core.setFailed(e.message);
    throw new Error(e);
}
//# sourceMappingURL=sync_garmin_cn_to_global.js.map