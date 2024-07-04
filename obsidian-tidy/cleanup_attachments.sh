#!/bin/bash

# Variables for base directory and output files
base_directory="$HOME/Obsidian"
attachments_directory="$base_directory/attachments"
output_matches="obs-matches.txt"
output_orphans="obs-orphans.txt"

# Clear previous output files
echo "" > "$output_matches"
echo "" > "$output_orphans"

# Loop through each attachment
for attachment in "$attachments_directory"/*; do
  attachment_basename=$(basename "$attachment")
  echo "> $attachment_basename"
  # Initially assume attachment is an orphan
  found=false

  # Search for attachment references in markdown files
  while IFS= read -r -d $'\n' mdfile; do
    # echo "  grep -Fq -e \"$attachment_basename\" \"$mdfile\""
    if grep -Fq -e "$attachment_basename" "$mdfile"; then
      # If found, write to matches file and mark as found
      echo "$mdfile $attachment_basename" >> "$output_matches"
      found=true
      # echo "$mdfile"
    fi
  done < <(find "$base_directory/" -name '*.md')

  # If attachment is not referenced in any markdown, log to orphans
  if [ "$found" = false ]; then
    echo "$attachment_basename" >> "$output_orphans"
  fi
done

echo "Process complete. Matches written to $output_matches and orphans written to $output_orphans."
