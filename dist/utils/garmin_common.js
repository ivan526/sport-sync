"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGarminStatistics = exports.downloadGarminActivity = exports.uploadGarminActivity = void 0;
const fs_1 = __importDefault(require("fs"));
const core = require('@actions/core');
const constant_1 = require("../constant");
const lodash_1 = __importDefault(require("lodash"));
const unzipper = require('unzipper');
const uploadGarminActivity = async (fitFilePath, client) => {
    if (!fs_1.default.existsSync(constant_1.DOWNLOAD_DIR)) {
        fs_1.default.mkdirSync(constant_1.DOWNLOAD_DIR);
    }
    const upload = await client.uploadActivity(fitFilePath);
    console.log('upload to garmin activity', upload);
};
exports.uploadGarminActivity = uploadGarminActivity;
const downloadGarminActivity = async (activityId, client) => {
    if (!fs_1.default.existsSync(constant_1.DOWNLOAD_DIR)) {
        fs_1.default.mkdirSync(constant_1.DOWNLOAD_DIR);
    }
    const activity = await client.getActivity({ activityId: activityId });
    await client.downloadOriginalActivityData(activity, constant_1.DOWNLOAD_DIR);
    const originZipFile = constant_1.DOWNLOAD_DIR + '/' + activityId + '.zip';
    await fs_1.default.createReadStream(originZipFile)
        .pipe(unzipper.Extract({ path: constant_1.DOWNLOAD_DIR }));
    await new Promise(resolve => setTimeout(resolve, 4000));
    const baseFilePath = `${constant_1.DOWNLOAD_DIR}/${activityId}_ACTIVITY`;
    console.log('saved origin FilePath', baseFilePath);
    const fitFilePath = `${baseFilePath}.${constant_1.FILE_SUFFIX.FIT}`;
    const gpxFilePath = `${baseFilePath}.${constant_1.FILE_SUFFIX.GPX}`;
    const tcxFilePath = `${baseFilePath}.${constant_1.FILE_SUFFIX.TCX}`;
    try {
        if (fs_1.default.existsSync(fitFilePath)) {
            return fitFilePath;
        }
        else if (fs_1.default.existsSync(gpxFilePath)) {
            return gpxFilePath;
        }
        else if (fs_1.default.existsSync(tcxFilePath)) {
            return tcxFilePath;
        }
        else {
            const existFiles = fs_1.default.readdirSync(constant_1.DOWNLOAD_DIR, { withFileTypes: true })
                .filter(item => !item.isDirectory())
                .map(item => item.name);
            console.log('fitFilePath not exist, curr existFiles', existFiles);
            throw Error('file not exist ' + fitFilePath);
        }
    }
    catch (err) {
        console.error(err);
        core.setFailed(err);
    }
    return fitFilePath;
};
exports.downloadGarminActivity = downloadGarminActivity;
const getGarminStatistics = async (client) => {
    const acts = await client.getActivities(0, 10);
    const recentRunningAct = lodash_1.default.filter(acts, act => act?.activityType?.typeKey?.includes('running'))[0];
    console.log('recentRunningAct type: ', recentRunningAct.activityType?.typeKey);
    const { activityId, activityName, startTimeLocal, distance, duration, averageSpeed, averageHR, maxHR, averageRunningCadenceInStepsPerMinute, aerobicTrainingEffect, anaerobicTrainingEffect, avgGroundContactTime, avgStrideLength, vO2MaxValue, avgVerticalOscillation, avgVerticalRatio, avgGroundContactBalance, trainingEffectLabel, activityTrainingLoad, } = recentRunningAct;
    const pace = 1 / (averageSpeed / 1000 * 60);
    const pace_min = Math.floor(1 / (averageSpeed / 1000 * 60));
    const pace_second = (pace - pace_min) * 60;
    const pace_second_text = pace_second < 10 ? '0' + pace_second.toFixed(0) : pace_second.toFixed(0);
    return {
        activityId,
        activityName,
        startTimeLocal,
        distance,
        duration,
        averageSpeed,
        averagePace: pace,
        averagePaceText: `${pace_min}:${pace_second_text}`,
        averageHR,
        maxHR,
        averageRunningCadenceInStepsPerMinute,
        aerobicTrainingEffect,
        anaerobicTrainingEffect,
        avgGroundContactTime,
        avgStrideLength,
        vO2MaxValue,
        avgVerticalOscillation,
        avgVerticalRatio,
        avgGroundContactBalance,
        trainingEffectLabel,
        activityTrainingLoad,
        activityURL: constant_1.GARMIN_URL_DEFAULT.ACTIVITY_URL + activityId,
    };
};
exports.getGarminStatistics = getGarminStatistics;
//# sourceMappingURL=garmin_common.js.map