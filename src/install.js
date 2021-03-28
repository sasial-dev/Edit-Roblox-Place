const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const resolve = require('resolve-dir')

const questions = [{
  type: 'confirm',
  name: 'configFile',
  message: 'Would you like edit-roblox-place to create a configuration file at ~/.edit-roblox-place/config.json?'
}]

if (!fs.existsSync((resolve('~/.edit-roblox-place/config.json')))) {
  console.log(chalk.bold('Thank you for installing edit-roblox-place!'))
  inquirer.prompt(questions).then((answers) => {
    if (answers.configFile === true) {
      console.log(chalk.bold('Creating the config file.'))
      fs.mkdirSync((resolve('~/.edit-roblox-place')), {
        recursive: true
      })
      fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify({
        favourites: {}
      }))
    }
  })
}
