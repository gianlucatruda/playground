#!/usr/bin/env bash

while IFS= read -r f; do
	echo "$f"
	sed -i '' -e 's|\./_resources|attachments|g' -e "s|'s|_s|g" "$f"
done < <(grep -R "\[\[./_resources" ~/Obsidian/4-Archives/Evernote --files-with-matches)

while IFS= read -r f; do
	echo "$f"
	sed -i '' -e 's|4-Archives/Evernote/Quick ideas/_resources|attachments|g' -e "s|'s|_s|g" "$f"
done < <(grep -R "4-Archives/Evernote/Quick ideas/_resources" ~/Obsidian/4-Archives/Evernote --files-with-matches)

