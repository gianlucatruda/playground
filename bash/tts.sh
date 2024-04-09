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
