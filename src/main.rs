use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use clap::{arg, command, ArgGroup};
use opener::open;

#[derive(Default, Debug, Serialize, Deserialize)]
struct Config {
    favourites: HashMap<String, String>,
}

fn main() {
    let config = confy::load::<Config>("edit-roblox-place").expect("Unable to load config!");

    let cli = command!("edit-roblox-place")
        .propagate_version(true)
        .arg_required_else_help(true)
        .args_conflicts_with_subcommands(true)
        .subcommand(
            command!("config")
                .about("Edit the favourites config")
                .subcommand_required(true)
                .subcommand(command!("add").about("Add a favourite"))
                .subcommand(command!("list").about("List all favourites"))
                .subcommand(command!("remove").about("Remove a favourite")),
        )
        .arg(arg!(-p --place <"place id"> "Place ID to open"))
        .arg(arg!(-f --favourite <"favourite name"> "Favourite place to open"))
        .group(
            ArgGroup::new("id")
                .required(true)
                .args(&["place", "favourite"]),
        )
        .get_matches();

    match cli.subcommand() {
        Some(("config", matches)) => match matches.subcommand() {
            Some(("list", matchs)) => {}
            _ => {}
        },
        _ => {
            if let Some(placeid) = cli.get_one::<String>("place") {
                open(format!(
                    "roblox-studio:1+task:EditPlace+placeId:{}",
                    placeid
                ))
                .expect("Couldn't open Roblox Studio!");
                print!("Opened {}", placeid)
            } else if let Some(favourite) = cli.get_one::<String>("favourite") {
                if config.favourites.contains_key(favourite) {
                    let id = config.favourites.get(favourite).unwrap();
                    print!("Opening: {}", id)
                }
            }
        }
    }
}
