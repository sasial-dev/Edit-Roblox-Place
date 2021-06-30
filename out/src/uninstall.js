"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const expand_tilde_1 = __importDefault(require("expand-tilde"));
const questions = [{
        type: 'confirm',
        name: 'configFile',
        message: 'Would you like edit-roblox-place to remove your configuration file at ~/.edit-roblox-place/config.json?'
    }];
if (fs_1.default.existsSync((expand_tilde_1.default('~/.edit-roblox-place/config.json')))) {
    console.log(chalk_1.default.bold("Thank you for installing edit-roblox-place. We're sorry to see you go."));
    console.log(`Due to node limitations, the uninstall script is ${chalk_1.default.underline('ran during an update')}. If you are updating and not uninstalling, please opt to ${chalk_1.default.redBright('keep')} your config file.`);
    inquirer_1.default.prompt(questions).then((answers) => {
        if (answers.configFile === true) {
            console.log(chalk_1.default.bold('Removing the config file.'));
            try {
                fs_1.default.rmSync((expand_tilde_1.default('~/.edit-roblox-place/config.json')));
                fs_1.default.rmdirSync((expand_tilde_1.default('~/.edit-roblox-place')));
            }
            catch (err) {
                console.log(chalk_1.default.redBright(`edit-roblox-place failed to remove the config file! You can remove the folder and its contents yourself at: ${chalk_1.default.white(chalk_1.default.italic(expand_tilde_1.default('~/.edit-roblox-place')))}`));
            }
        }
    });
}
