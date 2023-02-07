"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRAVA_REDIRECT_URI_DEFAULT = exports.STRAVA_CLIENT_SECRET_DEFAULT = exports.STRAVA_CLIENT_ID_DEFAULT = exports.STRAVA_ACCESS_TOKEN_DEFAULT = exports.BARK_KEY_DEFAULT = exports.RQ_ROUTES_DEFAULT = exports.UA_DEFAULT = exports.RQ_HOST_DEFAULT = exports.RQ_PASSWORD_DEFAULT = exports.RQ_USERNAME_DEFAULT = exports.RQ_CSRF_TOKEN_DEFAULT = exports.RQ_COOKIE_DEFAULT = exports.RQ_USERID_DEFAULT = exports.GOOGLE_SHEET_ID_DEFAULT = exports.GOOGLE_API_PRIVATE_KEY_DEFAULT = exports.GOOGLE_API_CLIENT_EMAIL_DEFAULT = exports.GARMIN_URL_DEFAULT = exports.GARMIN_MIGRATE_START_DEFAULT = exports.GARMIN_MIGRATE_NUM_DEFAULT = exports.GARMIN_GLOBAL_PASSWORD_DEFAULT = exports.GARMIN_GLOBAL_USERNAME_DEFAULT = exports.GARMIN_PASSWORD_DEFAULT = exports.GARMIN_USERNAME_DEFAULT = exports.AESKEY_DEFAULT = exports.DB_FILE_PATH = exports.DOWNLOAD_DIR = exports.FILE_SUFFIX = void 0;
exports.FILE_SUFFIX = {
    FIT: 'fit',
    GPX: 'gpx',
    TCX: 'tcx',
};
exports.DOWNLOAD_DIR = './garmin_fit_files';
exports.DB_FILE_PATH = './db/garmin.db';
exports.AESKEY_DEFAULT = 'aaaaabbbbbcccc';
exports.GARMIN_USERNAME_DEFAULT = 'yu.ivan@gmail.com';
exports.GARMIN_PASSWORD_DEFAULT = 'Huawei123';
exports.GARMIN_GLOBAL_USERNAME_DEFAULT = 'yu.ivan@gmail.com';
exports.GARMIN_GLOBAL_PASSWORD_DEFAULT = 'Huawei123';
exports.GARMIN_MIGRATE_NUM_DEFAULT = '';
exports.GARMIN_MIGRATE_START_DEFAULT = '';
exports.GARMIN_URL_DEFAULT = {
    'BASE_URL': 'https://connect.garmin.cn',
    'ACTIVITY_URL': 'https://connect.garmin.cn/modern/activity/',
    'SSO_URL_ORIGIN': 'https://sso.garmin.com',
    'SSO_URL': 'https://sso.garmin.cn/sso',
    'MODERN_URL': 'https://connect.garmin.cn/modern',
    'SIGNIN_URL': 'https://sso.garmin.cn/sso/signin',
    'CSS_URL': 'https://static.garmincdn.cn/cn.garmin.connect/ui/css/gauth-custom-v1.2-min.css',
};
exports.GOOGLE_API_CLIENT_EMAIL_DEFAULT = '';
exports.GOOGLE_API_PRIVATE_KEY_DEFAULT = '';
exports.GOOGLE_SHEET_ID_DEFAULT = '';
exports.RQ_USERID_DEFAULT = '';
exports.RQ_COOKIE_DEFAULT = '';
exports.RQ_CSRF_TOKEN_DEFAULT = '';
exports.RQ_USERNAME_DEFAULT = '';
exports.RQ_PASSWORD_DEFAULT = '';
exports.RQ_HOST_DEFAULT = 'https://www.runningquotient.cn/';
exports.UA_DEFAULT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36';
exports.RQ_ROUTES_DEFAULT = {
    LOGIN: '/user/login',
    OVERVIEW: '/training/getOverView',
    UPDATE: 'training/update-overview?userId=',
};
exports.BARK_KEY_DEFAULT = '';
exports.STRAVA_ACCESS_TOKEN_DEFAULT = '';
exports.STRAVA_CLIENT_ID_DEFAULT = '';
exports.STRAVA_CLIENT_SECRET_DEFAULT = '';
exports.STRAVA_REDIRECT_URI_DEFAULT = '';
//# sourceMappingURL=constant.js.map