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
        message: 'Would you like edit-roblox-place to create a configuration file at ~/.edit-roblox-place/config.json?'
    }];
if (!fs_1.default.existsSync((expand_tilde_1.default('~/.edit-roblox-place/config.json')))) {
    console.log(chalk_1.default.bold('Thank you for installing edit-roblox-place!'));
    inquirer_1.default.prompt(questions).then((answers) => {
        if (answers.configFile === true) {
            console.log(chalk_1.default.bold('Creating the config file.'));
            try {
                fs_1.default.mkdirSync((expand_tilde_1.default('~/.edit-roblox-place')), {
                    recursive: true
                });
                fs_1.default.writeFileSync((expand_tilde_1.default('~/.edit-roblox-place/config.json')), JSON.stringify({
                    favourites: {}
                }));
            }
            catch (err) {
                console.log(chalk_1.default.redBright(`edit-roblox-place failed to create a config file! Use ${chalk_1.default.white(chalk_1.default.italic('edit-roblox-place -c create'))} to create one. Please note that sudo may be required.`));
            }
        }
    });
}
