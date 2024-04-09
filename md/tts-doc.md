# OpenAI TTS API docs

[](https://platform.openai.com/docs/guides/text-to-speech/text-to-speech)

## [Text to speech](https://platform.openai.com/docs/guides/text-to-speech/text-to-speech)

Learn how to turn text into lifelike spoken audio

[](https://platform.openai.com/docs/guides/text-to-speech/introduction)

## [Introduction](https://platform.openai.com/docs/guides/text-to-speech/introduction)

The Audio API provides a [`speech`](https://platform.openai.com/docs/api-reference/audio/createSpeech) endpoint based on our [TTS (text-to-speech) model](https://platform.openai.com/docs/models/tts). It comes with 6 built-in voices and can be used to:

-   Narrate a written blog post
-   Produce spoken audio in multiple languages
-   Give real time audio output using streaming

Here is an example of the `alloy` voice:

Please note that our [usage policies](https://openai.com/policies/usage-policies) require you to provide a clear disclosure to end users that the TTS voice they are hearing is AI-generated and not a human voice.

[](https://platform.openai.com/docs/guides/text-to-speech/quick-start)

## [Quick start](https://platform.openai.com/docs/guides/text-to-speech/quick-start)

The `speech` endpoint takes in three key inputs: the [model](https://platform.openai.com/docs/api-reference/audio/createSpeech#audio-createspeech-model), the [text](https://platform.openai.com/docs/api-reference/audio/createSpeech#audio-createspeech-input) that should be turned into audio, and the [voice](https://platform.openai.com/docs/api-reference/audio/createSpeech#audio-createspeech-voice) to be used for the audio generation. A simple request would look like the following:

```bash
1 2 3 4 5 6 7 8 9 curl https://api.openai.com/v1/audio/speech \ -H "Authorization: Bearer $OPENAI_API_KEY" \ -H "Content-Type: application/json" \ -d '{ "model": "tts-1", "input": "Today is a wonderful day to build something people love!", "voice": "alloy" }' \ --output speech.mp3
```

By default, the endpoint will output a MP3 file of the spoken audio but it can also be configured to output any of our [supported formats](https://platform.openai.com/docs/guides/text-to-speech/supported-output-formats).

[](https://platform.openai.com/docs/guides/text-to-speech/audio-quality)

## [Audio quality](https://platform.openai.com/docs/guides/text-to-speech/audio-quality)

For real-time applications, the standard `tts-1` model provides the lowest latency but at a lower quality than the `tts-1-hd` model. Due to the way the audio is generated, `tts-1` is likely to generate content that has more static in certain situations than `tts-1-hd`. In some cases, the audio may not have noticeable differences depending on your listening device and the individual person.

[](https://platform.openai.com/docs/guides/text-to-speech/voice-options)

## [Voice options](https://platform.openai.com/docs/guides/text-to-speech/voice-options)

Experiment with different voices (`alloy`, `echo`, `fable`, `onyx`, `nova`, and `shimmer`) to find one that matches your desired tone and audience. The current voices are optimized for English.

---
