#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const commander_1 = require("commander");
const opener_1 = __importDefault(require("opener"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const resolve_dir_1 = __importDefault(require("resolve-dir"));
const cli_table_1 = __importDefault(require("cli-table"));
const semver_1 = __importDefault(require("semver"));
const semver_diff_1 = __importDefault(require("semver-diff"));
const latest_version_1 = __importDefault(require("latest-version"));
function checkVersion() {
    return new Promise((resolve, reject) => {
        latest_version_1.default(package_json_1.default.name).then(moduleVersion => {
            if (semver_1.default.lt(package_json_1.default.version, moduleVersion)) {
                const tableClass = new cli_table_1.default({
                    style: {
                        'padding-left': 5,
                        'padding-right': 5
                    },
                    chars: {
                        'top-left': '╭',
                        'top-right': '╮',
                        'bottom-right': '╯',
                        'bottom-left': '╰'
                    }
                });
                let updateType = semver_diff_1.default(package_json_1.default.version, moduleVersion);
                updateType = updateType.charAt(0).toUpperCase() + updateType.slice(1);
                const msg = {
                    updateAvailable: `${updateType} update available ${chalk_1.default.grey.dim(package_json_1.default.version)} → ${chalk_1.default.green(moduleVersion)}`,
                    runUpdate: `Run ${chalk_1.default.cyan(`npm i ${package_json_1.default.name} -g`)} to update`,
                };
                tableClass.push([`${msg.updateAvailable}\n${msg.runUpdate}`]);
                resolve(tableClass);
            }
        }).catch(err => {
            reject("Error finding version: " + err);
        });
    });
}
const program = new commander_1.Command();
program
    .version(package_json_1.default.version, '-v, --version')
    .option('-p, --place <id>', 'place id to open')
    .option('-f, --favourite <name...>', 'favourite to use')
    .option('-c, --config [create | list | add | remove]', 'open the interactive config wizard. You can skip this by appending -p & -f options if you wish. Append list to list the current config. Append create to create the config file, if you did not create it at install.');
const questions = [{
        type: 'input',
        name: 'configName',
        message: 'Type in the name you would like to put this favourite as.'
    },
    {
        type: 'input',
        name: 'configPlace',
        message: 'Type in the placeid for this favourite.',
        validate: function (value) {
            const pass = value.match(/^\d+$/);
            if (pass) {
                return true;
            }
            return 'Please enter a valid place id!';
        }
    },
    {
        type: 'checkbox',
        name: 'configName',
        message: 'Select the favourite you would like to remove.'
    }
];
program.parse();
let runUpdate = true;
const options = program.opts();
if (options.config) {
    if (fs_1.default.existsSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')))) {
        if (options.config === 'list') {
            const tableClass = new cli_table_1.default({
                head: [chalk_1.default.cyan.bold('Favourite'), chalk_1.default.cyan.bold('Place ID')],
                chars: {
                    'top-left': '╭',
                    'top-right': '╮',
                    'bottom-right': '╯',
                    'bottom-left': '╰'
                }
            });
            const tableJSON = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
            const keys = Object.keys(tableJSON.favourites);
            let i;
            for (i = 0; i < keys.length; i++) {
                const object = {};
                object[keys[i]] = tableJSON.favourites[keys[i]];
                tableClass.push(object);
            }
            console.log(tableClass.toString());
        }
        else if (options.config === 'create') {
            if (!fs_1.default.existsSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')))) {
                console.log(chalk_1.default.bold('Creating the config file.'));
                fs_1.default.mkdirSync((resolve_dir_1.default('~/.edit-roblox-place')), {
                    recursive: true
                });
                fs_1.default.writeFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')), JSON.stringify({
                    favourites: {}
                }));
            }
        }
        else if (options.config === 'remove') {
            const file = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
            const question = questions[2];
            question.choices = Object.keys(file.favourites);
            inquirer_1.default.prompt([question]).then((answers) => {
                let i;
                for (i = 0; i < answers.configName.length; i++) {
                    delete file.favourites[answers.configName[i]]; // Is there any better way to do this? This feels wrong!
                }
                fs_1.default.writeFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')), JSON.stringify(file));
                console.log('Edited the config file.');
            });
        }
        else {
            if (options.place && options.favourite) {
                const answers = {
                    configName: options.favourite.toLowerCase(),
                    configPlace: options.place
                };
                const file = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
                file.favourites[answers.configName] = answers.configPlace;
                fs_1.default.writeFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')), JSON.stringify(file));
                console.log('Edited the config file.');
            }
            else if (options.place) {
                inquirer_1.default.prompt([questions[0]]).then((answers) => {
                    answers.configPlace = options.place;
                    answers.configName = answers.configName.toLowerCase();
                    const file = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
                    file.favourites[answers.configName] = answers.configPlace;
                    fs_1.default.writeFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')), JSON.stringify(file));
                    console.log('Edited the config file.');
                });
            }
            else if (options.favourite) {
                inquirer_1.default.prompt([questions[1]]).then((answers) => {
                    answers.configName = options.favourite.toLowerCase();
                    const file = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
                    file.favourites[answers.configName] = answers.configPlace;
                    fs_1.default.writeFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')), JSON.stringify(file));
                    console.log('Edited the config file.');
                });
            }
            else {
                inquirer_1.default.prompt([questions[0], questions[1]]).then((answers) => {
                    answers.configName = answers.configName.toLowerCase();
                    const file = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
                    file.favourites[answers.configName] = answers.configPlace;
                    fs_1.default.writeFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')), JSON.stringify(file));
                    console.log('Edited the config file.');
                });
            }
        }
    }
    else {
        console.log(chalk_1.default.redBright(`You need to have a config file created! Use ${chalk_1.default.white(chalk_1.default.italic('node node_modules/edit-roblox-place/src/install.js'))} to create one.`));
    }
}
else if (options.place) {
    const tableClass = new cli_table_1.default({
        style: {
            'padding-left': 5,
            'padding-right': 5
        },
        chars: {
            'top-left': '╭',
            'top-right': '╮',
            'bottom-right': '╯',
            'bottom-left': '╰'
        }
    });
    tableClass.push([chalk_1.default.cyan.bold(`Opening place (${options.place}) in Roblox Studio`)]);
    console.log(tableClass.toString());
    opener_1.default(`roblox-studio:1+task:EditPlace+placeId:${options.place}`);
}
else if (options.favourite) {
    if (fs_1.default.existsSync((resolve_dir_1.default('~/.edit-roblox-place/config.json')))) {
        options.favourite = options.favourite[0] ? options.favourite.join(' ') : options.favourite;
        const configFile = JSON.parse(fs_1.default.readFileSync((resolve_dir_1.default('~/.edit-roblox-place/config.json'))));
        if (configFile.favourites[options.favourite.toLowerCase()]) {
            const tableClass = new cli_table_1.default({
                style: {
                    'padding-left': 5,
                    'padding-right': 5
                },
                chars: {
                    'top-left': '╭',
                    'top-right': '╮',
                    'bottom-right': '╯',
                    'bottom-left': '╰'
                }
            });
            tableClass.push([chalk_1.default.cyan.bold(`Opening place (${configFile.favourites[options.favourite.toLowerCase()]}) in Roblox Studio`)]);
            console.log(tableClass.toString());
            opener_1.default(`roblox-studio:1+task:EditPlace+placeId:${configFile.favourites[options.favourite.toLowerCase()]}`);
        }
        else {
            console.log(chalk_1.default.redBright(`${options.favourite.toLowerCase()} is not a valid favourite. Use ${chalk_1.default.white(chalk_1.default.italic('edit-roblox-place -c list'))} to get a list of your favourites.`));
        }
    }
    else {
        console.log(chalk_1.default.redBright(`You need to have a config file created! Use ${chalk_1.default.white(chalk_1.default.italic('edit-roblox-place -c create'))} to create one.`));
    }
}
else {
    runUpdate = false;
    program
        .addHelpText('beforeAll', chalk_1.default.redBright('You need to use an option!'))
        .help();
}
if (runUpdate) {
    checkVersion().then(version => {
        console.log(version.toString());
    });
}
