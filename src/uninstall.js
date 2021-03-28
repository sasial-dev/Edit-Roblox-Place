const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const resolve = require('resolve-dir')

const questions = [{
  type: 'confirm',
  name: 'configFile',
  message: 'Would you like edit-roblox-place to your configuration file at ~/.edit-roblox-place/config.json?'
}]

if (fs.existsSync((resolve('~/.edit-roblox-place/config.json')))) {
  console.log(chalk.bold("Thank you for installing edit-roblox-place. We're sorry to see you go."))
  inquirer.prompt(questions).then((answers) => {
    if (answers.configFile === true) {
      console.log(chalk.bold('Removing the config file.'))
      try {
        fs.rmSync((resolve('~/.edit-roblox-place/config.json')))
        fs.rmdirSync((resolve('~/.edit-roblox-place')))
      } catch(err) {
        console.log(chalk.redBright(`edit-roblox-place failed to remove the config file! You can remove the folder and its contents yourself at: ${chalk.white(chalk.italic(resolve('~/.edit-roblox-place')))}`))
      }
    }
  })
}
