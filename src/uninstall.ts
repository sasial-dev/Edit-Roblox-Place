import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import expandTilde from 'expand-tilde'

const questions = [{
  type: 'confirm',
  name: 'configFile',
  message: 'Would you like edit-roblox-place to remove your configuration file at ~/.edit-roblox-place/config.json?'
}]

if (fs.existsSync((expandTilde('~/.edit-roblox-place/config.json')))) {
  console.log(chalk.bold("Thank you for installing edit-roblox-place. We're sorry to see you go."))
  console.log(`Due to node limitations, the uninstall script is ${chalk.underline('ran during an update')}. If you are updating and not uninstalling, please opt to ${chalk.redBright('keep')} your config file.`)
  inquirer.prompt(questions).then((answers) => {
    if (answers.configFile === true) {
      console.log(chalk.bold('Removing the config file.'))
      try {
        fs.rmSync((expandTilde('~/.edit-roblox-place/config.json')))
        fs.rmdirSync((expandTilde('~/.edit-roblox-place')))
      } catch (err) {
        console.log(chalk.redBright(`edit-roblox-place failed to remove the config file! You can remove the folder and its contents yourself at: ${chalk.white(chalk.italic(expandTilde('~/.edit-roblox-place')))}`))
      }
    }
  })
}
