#!/usr/bin/env bash

# https://platform.openai.com/docs/guides/speech-to-text?lang=curl

curl --request POST \
  --url https://api.openai.com/v1/audio/transcriptions \
  --header "Authorization: Bearer $OPENAI_API_KEY" \
  --header 'Content-Type: multipart/form-data' \
  --form file=@$1 \
  --form model=whisper-1 \
  --form response_format=text
