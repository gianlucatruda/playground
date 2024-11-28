// https://adventofcode.com/2023/day/2

use std::fs::read_to_string;

fn main() {
    let input = read_to_string("input.txt").expect("Reading file");
    for line in input.lines() {
        println!("{:?}", line);
        let s: Vec<&str> = line.split(":").collect();
        println!("{:?}", s[0]);
    }
}

// https://github.com/maneatingape/advent-of-code-rust/blob/main/src/year2023/day02.rs
