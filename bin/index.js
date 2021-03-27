#! /usr/bin/env node
const packageInfo = require('../package.json')
const { Command } = require('commander')
const opener = require('opener')
const boxen = require('boxen')

const program = new Command()

program.version(packageInfo.version, '-v, --version')
program.option('-p, --place <id>', 'place id to open')

program.parse()

const options = program.opts()
if (Object.keys(options).length === 0) { // Little "hacky" way around checking if the JSON is empty or not
  program.help()
}
if (options.place) {
  console.log(boxen(`Opening place (${options.place}) in Roblox Studio`, { padding: 1, borderColor: 'blue', borderStyle: 'round' }))
  opener(`roblox-studio:1+task:EditPlace+placeId:${options.place}`)
}
