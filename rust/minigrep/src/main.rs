/*
* Making a simple grep clone in Rust
* https://doc.rust-lang.org/stable/book/ch12-01-accepting-command-line-arguments.html
*/

use std::env; // To refer to std::env::args unambiguously
use std::fs; // To use std::fs::read_to_string unambiguously

fn main() {
    // Get the args (an iterator) and collect as a collection
    let args: Vec<String> = env::args().collect();
    dbg!(&args);

    let config = Config::build(&args);
    dbg!(&config);

    let contents = fs::read_to_string(config.file_path).expect("Unable to read file");
    dbg!(&contents);
}

#[derive(Debug)]
struct Config {
    query: String,
    file_path: String,
}

impl Config {
    fn build(args: &[String]) -> Config {
        if args.len() < 3 {
            panic!("Insufficient args: minigrep <needle> <file_path>");
        }
        let query = args[1].clone();
        let file_path = args[2].clone();
        Config {
            query: query.to_string(),
            file_path: file_path.to_string(),
        }
    }
}
