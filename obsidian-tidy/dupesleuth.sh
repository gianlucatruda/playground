#!/usr/bin/env bash

ROOTDIR="$HOME/Obsidian/4-Archives/Evernote"

while IFS= read -r f; do
	echo "(N) File: $f"
	p=$(echo "$f" | awk '{print substr($0, index($0,$2))}')
	matches=$(find "$ROOTDIR" -name "$p")
	echo "$matches"
	echo
done < <(find "$ROOTDIR" | awk -F/ '{print $NF}' | sort | uniq -c | awk '$1 > 1')
