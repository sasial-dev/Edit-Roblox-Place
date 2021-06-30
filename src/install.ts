import inquirer from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import expandTilde from 'expand-tilde'

const questions = [{
  type: 'confirm',
  name: 'configFile',
  message: 'Would you like edit-roblox-place to create a configuration file at ~/.edit-roblox-place/config.json?'
}]

if (!fs.existsSync((expandTilde('~/.edit-roblox-place/config.json')))) {
  console.log(chalk.bold('Thank you for installing edit-roblox-place!'))
  inquirer.prompt(questions).then((answers) => {
    if (answers.configFile === true) {
      console.log(chalk.bold('Creating the config file.'))
      try {
        fs.mkdirSync((expandTilde('~/.edit-roblox-place')), {
          recursive: true
        })
        fs.writeFileSync((expandTilde('~/.edit-roblox-place/config.json')), JSON.stringify({
          favourites: {}
        }))
      } catch (err) {
        console.log(chalk.redBright(`edit-roblox-place failed to create a config file! Use ${chalk.white(chalk.italic('edit-roblox-place -c create'))} to create one. Please note that sudo may be required.`))
      }
    }
  })
}
