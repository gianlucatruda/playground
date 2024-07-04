#!/bin/bash

# Set the directories
source_dir="$HOME/Obsidian/attachments/"
dest_dir="$HOME/0-Inbox/obs-dump/"

# Read each filename from the file and move it to the new directory
while IFS= read -r filename; do
  # Check if the file exists before trying to move it
  # echo "${source_dir}${filename}"
  if [ -f "${source_dir}${filename}" ]; then
    mv "${source_dir}${filename}" "${dest_dir}"
    # echo "mv \"${source_dir}${filename}\" \"${dest_dir}\""
    echo "Moving... $filename"
  else
    echo "File not found: ${filename}"
  fi
done < "$HOME/0-Inbox/obs-orphans.txt"
