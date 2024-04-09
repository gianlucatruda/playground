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
curl https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"tts-1\",
    \"input\": \"$TEXT\",
    \"voice\": \"alloy\"
  }" \
  --output $OUTPUT_FILE

echo "Audio file created: $OUTPUT_FILE"
