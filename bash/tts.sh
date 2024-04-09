#!/usr/bin/env bash

# Enhanced TTS script with --hd and --voice flags

# Usage Information
usage() {
  echo "Usage: $0 [--hd] [--voice <voice>] -o [output_file.mp3] [text]"
  echo "--hd          - Optional. Enable hd voice quality. Default is standard quality."
  echo "--voice <voice> - Optional. Specify the voice ('alloy', 'echo', 'fable', 'onyx', 'nova', or 'shimmer'). Default is 'alloy'."
  echo "-o <output>   - Specify the output file. Default is 'output.mp3'."
  echo "text         - The text to convert to speech. Enclose in quotes if more than one word."
  exit 1
}

# Default values
OUTPUT_FILE="output.mp3"
TEXT=""
VOICE="alloy"
MODEL="tts-1"

# Parse arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --hd)
      MODEL="tts-1-hd"
      ;;
    --voice)
      VOICE="$2"
      shift
      ;;
    -o)
      OUTPUT_FILE="$2"
      shift
      ;;
    *)
      # Assuming any other input as the text
      if [[ -n "$TEXT" ]]; then
        echo "Error: Multiple text arguments. Please enclose the text in quotes."
        usage
      else
        TEXT="$1"
      fi
      ;;
  esac
  shift
done

# Verify that an API key is set
if [[ -z "$OPENAI_API_KEY" ]]; then
  echo "Error: The environment variable 'OPENAI_API_KEY' is not set."
  exit 1
fi

# If no text is provided as an argument or through stdin, exit with an error
if [[ -z "$TEXT" ]]; then
  echo "Error: No text provided for speech conversion."
  usage
fi

# Make API call to generate speech
echo "Processing: \"$TEXT\" with voice: $VOICE and model: $MODEL"
curl -s https://api.openai.com/v1/audio/speech \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"$MODEL\",
    \"input\": \"$TEXT\",
    \"voice\": \"$VOICE\"
  }" \
  --output "$OUTPUT_FILE"

if [[ $? -eq 0 ]]; then
  echo "Audio file created: $OUTPUT_FILE"
else
  echo "An error occurred creating the audio file."
fi
