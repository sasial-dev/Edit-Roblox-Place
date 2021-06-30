#! /usr/bin/env node

const packageInfo = require('../package.json')
const {
  Command
} = require('commander')
const opener = require('opener')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const resolve = require('resolve-dir')
const Table = require('cli-table')
const semver = require('semver')
const semverDiff = require('semver-diff')
const latestVersion = require('latest-version');

function checkVersion() {
  return new Promise((resolve, reject) => {
    latestVersion(packageInfo.name).then(moduleVersion => {
      if (semver.lt(packageInfo.version, moduleVersion)) {
        const tableClass = new Table({
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
        })
        let updateType = semverDiff(packageInfo.version, moduleVersion)
        updateType = updateType.charAt(0).toUpperCase() + updateType.slice(1)
        const msg = {
          updateAvailable: `${updateType} update available ${chalk.grey.dim(packageInfo.version)} → ${chalk.green(moduleVersion)}`,
          runUpdate: `Run ${chalk.cyan(`npm i ${packageInfo.name} -g`)} to update`,
        };
        tableClass.push([`${msg.updateAvailable}\n${msg.runUpdate}`])
        resolve(tableClass)
      }
    }).catch(err => {
      reject("Error finding version: "+err)
    })
  });
}

const program = new Command()

program
  .version(packageInfo.version, '-v, --version')
  .option('-p, --place <id>', 'place id to open')
  .option('-f, --favourite <name...>', 'favourite to use')
  .option('-c, --config [create | list | add | remove]', 'open the interactive config wizard. You can skip this by appending -p & -f options if you wish. Append list to list the current config. Append create to create the config file, if you did not create it at install.')

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
    message: 'Select the favourite you would like to remove.'
  }
]

program.parse()

let runUpdate = true
const options = program.opts()
if (options.config) {
  if (fs.existsSync((resolve('~/.edit-roblox-place/config.json')))) {
    if (options.config === 'list') {
      const tableClass = new Table({
        head: [chalk.cyan.bold('Favourite'), chalk.cyan.bold('Place ID')],
        chars: {
          'top-left': '╭',
          'top-right': '╮',
          'bottom-right': '╯',
          'bottom-left': '╰'
        }
      })
      const tableJSON = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
      const keys = Object.keys(tableJSON.favourites)
      let i
      for (i = 0; i < keys.length; i++) {
        const object = {}
        object[keys[i]] = tableJSON.favourites[keys[i]]
        tableClass.push(object)
      }
      console.log(tableClass.toString())
    } else if (options.config === 'create') {
      if (!fs.existsSync((resolve('~/.edit-roblox-place/config.json')))) {
        console.log(chalk.bold('Creating the config file.'))
        fs.mkdirSync((resolve('~/.edit-roblox-place')), {
          recursive: true
        })
        fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify({
          favourites: {}
        }))
      }
    } else if (options.config === 'remove') {
      const file = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
      const question = questions[2]
      question.choices = Object.keys(file.favourites)
      inquirer.prompt([question]).then((answers) => {
        let i
        for (i = 0; i < answers.configName.length; i++) {
          delete file.favourites[answers.configName[i]] // Is there any better way to do this? This feels wrong!
        }
        fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
        console.log('Edited the config file.')
      })
    } else {
      if (options.place && options.favourite) {
        const answers = {
          configName: options.favourite.toLowerCase(),
          configPlace: options.place
        }
        const file = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
        file.favourites[answers.configName] = answers.configPlace
        fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
        console.log('Edited the config file.')
      } else if (options.place) {
        inquirer.prompt([questions[0]]).then((answers) => {
          answers.configPlace = options.place
          answers.configName = answers.configName.toLowerCase()
          const file = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
          file.favourites[answers.configName] = answers.configPlace
          fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
          console.log('Edited the config file.')
        })
      } else if (options.favourite) {
        inquirer.prompt([questions[1]]).then((answers) => {
          answers.configName = options.favourite.toLowerCase()
          const file = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
          file.favourites[answers.configName] = answers.configPlace
          fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
          console.log('Edited the config file.')
        })
      } else {
        inquirer.prompt([questions[0], questions[1]]).then((answers) => {
          answers.configName = answers.configName.toLowerCase()
          const file = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
          file.favourites[answers.configName] = answers.configPlace
          fs.writeFileSync((resolve('~/.edit-roblox-place/config.json')), JSON.stringify(file))
          console.log('Edited the config file.')
        })
      }
    }
  } else {
    console.log(chalk.redBright(`You need to have a config file created! Use ${chalk.white(chalk.italic('node node_modules/edit-roblox-place/src/install.js'))} to create one.`))
  }
} else if (options.place) {
  const tableClass = new Table({
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
  })
  tableClass.push([chalk.cyan.bold(`Opening place (${options.place}) in Roblox Studio`)])
  console.log(tableClass.toString())
  opener(`roblox-studio:1+task:EditPlace+placeId:${options.place}`)
} else if (options.favourite) {
  if (fs.existsSync((resolve('~/.edit-roblox-place/config.json')))) {
    options.favourite = options.favourite[0] ? options.favourite.join(' ') : options.favourite
    const configFile = JSON.parse(fs.readFileSync((resolve('~/.edit-roblox-place/config.json'))))
    if (configFile.favourites[options.favourite.toLowerCase()]) {
      const tableClass = new Table({
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
      })
      tableClass.push([chalk.cyan.bold(`Opening place (${configFile.favourites[options.favourite.toLowerCase()]}) in Roblox Studio`)])
      console.log(tableClass.toString())
      opener(`roblox-studio:1+task:EditPlace+placeId:${configFile.favourites[options.favourite.toLowerCase()]}`)
    } else {
      console.log(chalk.redBright(`${options.favourite.toLowerCase()} is not a valid favourite. Use ${chalk.white(chalk.italic('edit-roblox-place -c list'))} to get a list of your favourites.`))
    }
  } else {
    console.log(chalk.redBright(`You need to have a config file created! Use ${chalk.white(chalk.italic('edit-roblox-place -c create'))} to create one.`))
  }
} else {
  runUpdate = false
  program
    .addHelpText('beforeAll', chalk.redBright('You need to use an option!'))
    .help()
}
if (runUpdate) {
  checkVersion().then(version => {
    console.log(version.toString())
  })
}
