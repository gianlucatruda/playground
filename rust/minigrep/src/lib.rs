use std::error::Error;
use std::fs; // To use std::fs::read_to_string unambiguously

#[derive(Debug)]
pub struct Config {
    pub query: String,
    pub file_path: String,
}

impl Config {
    pub fn build(args: &[String]) -> Result<Config, &'static str> {
        if args.len() < 3 {
            return Err("Insufficient args: minigrep <needle> <file_path>");
        }
        let query = args[1].clone();
        let file_path = args[2].clone();
        Ok(Config { query, file_path })
    }
}

pub fn run(config: Config) -> Result<(), Box<dyn Error>> {
    // Box<dyn Error> means the function will return a type that implements the Error trait
    // This gives us flexibility to return error values that may be of different types in different error cases.
    let contents = fs::read_to_string(config.file_path)?;
    dbg!(&contents);
    Ok(()) // idiomatic way to indicate that we’re calling run for its side effects only
}
