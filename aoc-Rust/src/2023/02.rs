// https://adventofcode.com/2023/day/2

use std::fs::read_to_string;

fn main() {
    let input = read_to_string("input_real.txt").expect("Reading file");
    let mut out = 0;
    for (gid, line) in input.lines().enumerate() {
        // println!("{gid}\t{line:?}");

        let mut maxes = vec![0, 0, 0];

        let s: Vec<&str> = line
            .split(&[':', ';'])
            .skip(1)
            .map(|show| show.trim())
            .collect();

        // println!("{s:?}");

        for show in s.iter() {
            for (i, c) in ["red", "green", "blue"].iter().enumerate() {
                let v: i32 = show
                    .split(", ")
                    .map(|x| {
                        let xs: Vec<&str> = x.split(" ").collect();
                        if xs[1] == *c {
                            return xs[0].parse::<i32>().unwrap();
                        }
                        0
                    })
                    .max()
                    .unwrap();
                if v > maxes[i] {
                    maxes[i] = v;
                }
            }
        }
        // println!("{maxes:?}");

        if maxes[0] <= 12 && maxes[1] <= 13 && maxes[2] <= 14 {
            out += gid + 1;
            // println!("GID {gid} ({out})");
        }
    }
    println!("Answer: {out}")
}

// Help and hints: https://github.com/maneatingape/advent-of-code-rust/blob/main/src/year2023/day02.rs
