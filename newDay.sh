#!/bin/bash

# Find the most recent day directory
latest_day=$(find . -type d -depth 1 | grep "day" | sort -V | tail -1)

# Extract the number from the latest day directory
latest_day_num=$(echo "$latest_day" | sed 's/.\/day//')

# Calculate the next day number
next_day_num=$((latest_day_num + 1))

# Create the new day directory
new_day_dir="day$next_day_num"
echo "Creating $new_day_dir" && mkdir "$new_day_dir"
