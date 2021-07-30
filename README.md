<div align="center">

# Edit Roblox Place
A powerful, interactive CLI (Command Line Interface) to help you open Roblox Studio places. 

<a href="https://github.com/Lundstrong/Edit-Roblox-Place/blob/master/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/Lundstrong/Edit-Roblox-Place"></a>
<a href="https://standardjs.com"><img alt="JavaScript Style Guide" src="https://img.shields.io/badge/code_style-standard-brightgreen.svg"></a>
<img alt="npm" src="https://img.shields.io/npm/v/edit-roblox-place">
<img alt="David" src="https://img.shields.io/david/Lundstrong/Edit-Roblox-Place">
<img alt="David" src="https://img.shields.io/david/dev/Lundstrong/edit-roblox-place">
<a href="https://app.fossa.com/projects/git%2Bgithub.com%2FLundstrong%2FEdit-Roblox-Place?ref=badge_shield"><img alt="FOSSA Status" src="https://app.fossa.com/api/projects/git%2Bgithub.com%2FLundstrong%2FEdit-Roblox-Place.svg?type=shield"></a>
</div>

## Getting Started

### Prerequisites

You must have [node](https://nodejs.org/) installed if you are installing through npm. It must be **at least** version 12.20, 14.14, or 16.0. (This package has dependencies that are [Pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c))

### Reccomended Installation

Use the package manager [npm](https://npmjs.com/) to install edit-roblox-place.

```bash
npm install edit-roblox-place --global
```

### Other Installation
Binaries are avaliable for versions 1.1.2 and above. To download them, go to the release page, and download the version for your operating system. You can then use it as a command line argument (Example: `./edit-roblox-place --help`)

Or add it to your path in [windows](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/), [mac and linux](https://opensource.com/article/17/6/set-path-linux). With more information provided [here](https://wpbeaches.com/how-to-add-to-the-shell-path-in-macos-using-terminal/) for mac users.
It is suggested to use node, but if you have added edit-roblox-place to your path, it will work like the node version.

## Usage

edit-roblox-place has been designed to be very similar, keeping close to its [inspiration](https://github.com/rojo-rbx/edit-roblox-place), but providing more features including interactivity and favourites.
```
Usage: edit-roblox-place [options]

Options:
  -v, --version                                output the version number
  -p, --place <id>                             place id to open
  -f, --favourite <name>                       favourite to use
  -c, --config [create | list | add | remove]  open the interactive config wizard. You can skip this by appending -p & -f options if you wish. Append list to list the current config. Append create to create the config file, if you did not create it at install.
  -h, --help                                   display help for command
```

## Roadmap
None at the moment. If you have any ideas please let us know on the discord or open an issue!

## Contributing
We love contributions! Pull requests are warmly welcomed and highly appriciated. For major changes, please open an issue first or discuss on the discord to let us know what you would like to change.

## Support
Join the [Lundstrong Discord](https://discord.gg/2w9PmHZPwX). A channel is there for support.

## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FLundstrong%2FEdit-Roblox-Place.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FLundstrong%2FEdit-Roblox-Place?ref=badge_large)

## Acknowledgements
edit-roblox-place has been inspired by a version written in Rust. (https://github.com/rojo-rbx/edit-roblox-place) We've built on that to provide more features including interactivity and favourites. If it wasn't for that library, this wouldn't exist.

The CLI would not be possible without the following libraries:
* [cli-table](https://npmjs.com/package/cli-table)
* [commander](https://npmjs.com/package/commander)
* [inquirer](https://npmjs.com/package/inquirer)
* [opener](https://npmjs.com/package/opener)
* [resolve-dir](https://npmjs.com/package/resolve-dir)

And the libraries for the developing:

* [standard](https://npmjs.com/package/standard)
* [snazzy](https://npmjs.com/package/snazzy)
