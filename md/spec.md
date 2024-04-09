# New bash script specification

This is the spec for a bash script I'm trying to write. The script takes text as input and creates an audio file as output. 

## Introduction

Here is my initial test version of the script, `tts.sh`:
```bash
#!/usr/bin/env bash
echo "You entered: $1"
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"tts-1\",
    \"input\": \"$1\",
    \"voice\": \"alloy\"
  }" \
  --output $2
```

The variable `OPENAI_API_KEY` is defined in my shell from the `.bash_profile` script that runs at login.

To use this example, I run:
```bash
source tts.sh "hello world" output.mp3
```
The result is an mp3 file called `output.mp3` with an AI voice saying the "hello world" text that was given as input.

## Improvements

### 1. How to run the script

I don't really understand the important differences between running `source tts.sh`, `bash tts.sh`, and `./tts.sh`. The last one isn't even possible unless I `chmod` the script to be executable. 

TODO: Understand the differences and best practices.

### 2. Piping input instead of typing it

TODO: Learn how to allow piping input into a bash script instead of passing an argument.
TODO: Learn how to write good CLIs in Bash that allow optional explicit arguments (via flags) with hints.

### 3. How to implement `--help` docs in bash CLIs

TODO: How does one do this? I've made nice CLIs in Python before using `argparse`, but not sure how best to do similar in Bash, or what the conventions are? 


## Explanations

### 1. Differences between `source`, `bash`, and `./`

- **`source filename`**: When you use `source` (or its shorthand `.`), you’re telling the shell to read your script file and execute the commands as if they were typed on the command line. This happens in the current shell environment, so any variables or changes made to the environment within the script persist after the script completes. This is useful for scripts that set environment variables, modify your path, or otherwise need to affect the environment of the current shell. However, it’s not typically used for scripts that are intended to perform actions or run programs.

- **`bash filename`**: This command explicitly invokes the Bash shell to run your script. This happens in a new shell process, separate from the current shell. Environment variables set or changes made to the environment within the script do not persist once the script completes. This is a common way to run scripts that are self-contained and don't need to modify the user's environment.

- **`./filename`**: To run a script like `./filename`, the script must have the execute permission. This makes the file executable as a program. When you execute a script this way, it runs in a new process like `bash filename`, but you don't need to specify `bash` because the shebang line at the start of the script (`#!/usr/bin/env bash`) tells the system to use Bash to interpret the script. This method is standard for executing self-contained scripts, and setting the script as executable helps communicate that it’s intended to be run as a program.

**Best Practice**: For scripts that are meant to be executed as programs (doing actions, running tasks), use `chmod +x filename` to make them executable and run them using `./filename`. Use `source` for scripts that modify the current environment.

### 2. Allowing Piping Input

To allow a Bash script to handle input either from arguments or from piped data, you can check if the script received input data as command-line arguments or fallback to reading from standard input (`stdin`). This dual-functionality is particularly useful for writing flexible and user-friendly command-line utilities. Your version 2.0 script implementation shows this flexibility well.

### 3. Handling Optional Explicit Arguments

Handling optional explicit arguments can be accomplished by iterating over the arguments passed to the script using a `while` loop and a `case` statement. This enables the script to recognize flags (like `-o` for specifying an output file) and act accordingly. Your implementation in the version 2.0 script demonstrates a basic but effective pattern for parsing command-line options in Bash. For more complex scenarios, tools like `getopts` or external libraries such as `bash-getopt` might offer more sophisticated parsing capabilities, including long option names (`--option`), option arguments, and automatically generated help messages.

### 4. Implementing `--help` Documentation

Implementing `--help` in Bash scripts involves checking if the first argument (`$1`) is `--help` and, if so, displaying usage information. This typically includes a summary of what the script does, how to run it, and a description of any available options. You've implemented a `usage` function in your version 2.0 script, which is a clear and effective way to provide help documentation. It’s good practice to make such a function the first thing called when a user requests help or when they misuse the script to ensure users have a clear understanding of how to use the tool correctly.

Putting time into writing a helpful and detailed `--help` option significantly improves the user experience and self-documenting capabilities of command-line tools.

## Specification for version 2.0

Version 2.0 of my script, `aisay.sh`, should implement the following behaviour:

```bash
./aisay.sh "hello world"
```
Creates `output.mp3` by default.

```bash
cat <my_file> | ./aisay.sh 
```
Contents of `<my_file>` piped as input, `output.mp3` created by default.

```bash
cat <my_file> | ./aisay.sh -o myfile.mp3
```
Contents of `<my_file>` piped as input, `myfile.mp3` created by as output file.

## Bash script for version 2.0 with extensive comments

```bash

#!/usr/bin/env bash

# Usage information
usage() {
  echo "Usage: ./aisay.sh [text] [-o output_file.mp3]"
  echo "text - The text to convert to speech. If empty, the script expects input from stdin."
  echo "-o   - Optional. Specify the output file. Default is 'output.mp3'."
  exit 1
}

# Checking for help argument or no arguments/stdin
if [[ $1 = "--help" || $# -eq 0 ]]; then
  usage
  exit 0
fi

# Parsing arguments
OUTPUT_FILE="output.mp3"
TEXT=""
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -o) OUTPUT_FILE="$2"; shift ;; # -o argument to specify output file
    *) TEXT="$1" ;; # Any other argument is considered as the input text
  esac
  shift
done

# If no text is provided as argument, try to read from stdin
if [[ -z "$TEXT" ]]; then
  while IFS= read -r line; do
    TEXT="${TEXT}${line} "
  done
fi

# Check if text is still empty
if [[ -z "$TEXT" ]]; then
  echo "Error: No text provided."
  usage
fi

# Main functionality to call OpenAI API and generate speech
echo "Processing: \"$TEXT\""
curl -v https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"tts-1\",
    \"input\": \"$TEXT\",
    \"voice\": \"alloy\"
  }" \
  --output $OUTPUT_FILE

echo "Audio file created: $OUTPUT_FILE"
```

## Problem

This version of the script works with `. aisay.sh "test"` or `source aisay.sh "test"`, but fails with `./aisay.sh "test"` because the `OPENAI_API_KEY` variable cannot be read in the subshell. 



