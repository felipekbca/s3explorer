
const fs = require("fs");
const path = require('path');
const homedir   = require('os').homedir();
const treeview_path_file = path.join(homedir, '.s3explorer/s3explorer_treeview.json');
const settings_path_file = path.join(homedir, '.s3explorer/settings.json');
const fileJson  = fs.readFileSync(settings_path_file);
const json_settings = JSON.parse(fileJson);

module.exports = {
    ACCESSKEYID: json_settings.AWSAccessKeyID,
    SECRETACCESSKEY: json_settings.AWSSecretAccessKey,
    REGION: json_settings.AWSRegion,
    TREEVIEW_PATH: treeview_path_file,
    SETTINGS_PATH: settings_path_file
};