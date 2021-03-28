#! /usr/bin/env node

const packageInfo = require('../package.json')
const {
  Command
} = require('commander')
const opener = require('opener')
const boxen = require('boxen')
const inquirer = require('inquirer')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const resolve = require('resolve-dir')
const Table = require('cli-table')

const program = new Command()

program
  .version(packageInfo.version, '-v, --version')
  .option('-p, --place <id>', 'place id to open')
  .option('-f, --favourite <name>', 'favourite to use')
  .option('-c, --config [list | add | remove]', 'open the interactive config wizard. You can skip this by appending -p & -f options if you wish. Append list to list the current config.')

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
    const pass = value.match(
      /^\d+$/
    )
    if (pass) {
      return true
    }

    return 'Please enter a valid place id!'
  }
},
{
  type: 'checkbox',
  name: 'configName',
  message: 'Type in the name of the favourite you would like to remove.'
}
]

program.parse()

if (!process.argv.slice(2)[0]) {
  program.help()
}

const options = program.opts()
if (options.config) {
  if (fs.existsSync(path.normalize(resolve('~/.edit-roblox-place/config.json')))) {
    if (options.config === 'list') {
      const tableClass = new Table({
        head: [chalk.blueBright.bold('Favourite'), chalk.blueBright.bold('Place ID')],
        chars: {
          'top-left': '╭',
          'top-right': '╮',
          'bottom-right': '╯',
          'bottom-left': '╰'
        }
      })
      const tableJSON = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
      const keys = Object.keys(tableJSON.favourites)
      let i
      for (i = 0; i < keys.length; i++) {
        const object = {}
        object[keys[i]] = tableJSON.favourites[keys[i]]
        tableClass.push(object)
      }
      console.log(tableClass.toString())
    } else if (options.config === 'remove') {
      const file = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
      const question = questions[2]
      question.choices = Object.keys(file.favourites)
      inquirer.prompt([question]).then((answers) => {
        let i
        for (i = 0; i < answers.configName.length; i++) {
          delete file.favourites[answers.configName[i]] // Is there any better way to do this? This feels wrong!
        }
        fs.writeFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
        console.log('Edited the config file.')
      })
    } else {
      if (options.place && options.favourite) {
        const answers = {
          configName: options.favourite.toLowerCase(),
          configPlace: options.place
        }
        const file = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
        file.favourites[answers.configName] = answers.configPlace
        fs.writeFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
        console.log('Edited the config file.')
      } else if (options.place) {
        inquirer.prompt([questions[0]]).then((answers) => {
          answers.configPlace = options.place
          answers.configName = answers.configName.toLowerCase()
          const file = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
          file.favourites[answers.configName] = answers.configPlace
          fs.writeFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
          console.log('Edited the config file.')
        })
      } else if (options.favourite) {
        inquirer.prompt([questions[1]]).then((answers) => {
          answers.configName = options.favourite.toLowerCase()
          const file = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
          file.favourites[answers.configName] = answers.configPlace
          fs.writeFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
          console.log('Edited the config file.')
        })
      } else {
        inquirer.prompt([questions[0], questions[1]]).then((answers) => {
          answers.configName = answers.configName.toLowerCase()
          const file = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
          file.favourites[answers.configName] = answers.configPlace
          fs.writeFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
          console.log('Edited the config file.')
        })
      }
    }
  } else {
    console.log(chalk.redBright(`You need to have a config file created! Use ${chalk.white(chalk.italic('node node_modules/edit-roblox-place/src/install.js'))} to create one.`))
  }
} else if (options.place) {
  console.log(boxen(`Opening place (${options.place}) in Roblox Studio`, {
    padding: 1,
    borderColor: 'blue',
    borderStyle: 'round'
  }))
  opener(`roblox-studio:1+task:EditPlace+placeId:${options.place}`)
} else if (options.favourite) {
  if (fs.existsSync(path.normalize(resolve('~/.edit-roblox-place/config.json')))) {
    const configFile = JSON.parse(fs.readFileSync(path.normalize(resolve('~/.edit-roblox-place/config.json'))))
    console.log(boxen(`Opening place (${configFile.favourites[options.favourite.toLowerCase()]}) in Roblox Studio`, {
      padding: 1,
      borderColor: 'blue',
      borderStyle: 'round'
    }))
    opener(`roblox-studio:1+task:EditPlace+placeId:${configFile.favourites[options.favourite.toLowerCase()]}`)
  } else {
    console.log(chalk.redBright(`You need to have a config file created! Use ${chalk.white(chalk.italic('node node_modules/edit-roblox-place/src/install.js'))} to create one.`))
  }
} else {
  program
    .addHelpText('beforeAll', chalk.redBright('You need to use an option!'))
    .help()
}
