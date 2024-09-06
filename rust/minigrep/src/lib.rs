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
    for line in search(&config.query, &contents) {
        println!("{line}");
    }
    Ok(()) // idiomatic way to indicate that we’re calling run for its side effects only
}

pub fn search<'a>(query: &str, contents: &'a str) -> Vec<&'a str> {
    // Because contents is the argument that contains all of our text and
    // we want to return the parts of that text that match,
    // we know contents is the argument that should be connected to the
    // return value using the lifetime syntax.

    let mut matches: Vec<&str> = Vec::new();
    for line in contents.lines() {
        if line.contains(query) {
            matches.push(line);
        }
    }
    matches
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn one_result() {
        let query = "duct";
        let contents = "\
Rust:
safe, fast, productive.
Pick three.";
        assert_eq!(vec!["safe, fast, productive."], search(query, contents));
    }
}
