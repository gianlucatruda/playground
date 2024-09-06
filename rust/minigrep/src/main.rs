/*
* Making a simple grep clone in Rust
* https://doc.rust-lang.org/stable/book/ch12-01-accepting-command-line-arguments.html
*/

use std::env; // To refer to std::env::args unambiguously
use std::error::Error;
use std::fs; // To use std::fs::read_to_string unambiguously
use std::process;

fn main() {
    // Get the args (an iterator) and collect as a collection
    let args: Vec<String> = env::args().collect();

    let config = Config::build(&args).unwrap_or_else(|err| {
        println!("Problem parsing arguments: {err}");
        process::exit(1);
    });

    // Because run returns () in the success case, we only care about detecting an error, 
    // so we don’t need unwrap_or_else to return the unwrapped value
    if let Err(e) = run(config) {
        println!("Problem running: {e}");
        process::exit(1);
    }
}

#[derive(Debug)]
struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("Insufficient args: minigrep <needle> <file_path>");
        }
        let query = args[1].clone();
        let file_path = args[2].clone();
        Ok(Config { query, file_path })
    }
}

fn run(config: Config) -> Result<(), Box<dyn Error>> {
    // Box<dyn Error> means the function will return a type that implements the Error trait
    // This gives us flexibility to return error values that may be of different types in different error cases.
    let contents = fs::read_to_string(config.file_path)?;
    dbg!(&contents);
    Ok(()) // idiomatic way to indicate that we’re calling run for its side effects only
}
