#!/bin/sh
# Exit script on error
set -e


# Read the first line starting with https from submit.txt
USER_LINK_SUBMISSION=$(grep -m 1 '^https' submit.txt)

# Check if USER_LINK_SUBMISSION is non-empty
if [ -z "$USER_LINK_SUBMISSION" ]; then
    echo "No URL found in submit.txt"
    exit 1
fi

cd assessment

# Update or create .env with USER_LINK_SUBMISSION
echo "USER_LINK_SUBMISSION=$USER_LINK_SUBMISSION" > .env


# Check if dotenv is installed, otherwise install it
if npm list dotenv | grep -q 'dotenv'; then
    echo "dotenv is already installed."
else
    echo "Installing dotenv..."
    npm install dotenv > /dev/null 2>&1 &
fi

# Function to display message with increasing and decreasing dots
display_message() {
    local msg="Testing your Submission"
    while true; do
        for i in $(seq 1 3); do
            echo -n "$msg$(printf '%0.s.' $(seq 1 $i))\033[0K\r"
            sleep 0.2
        done
        for i in $(seq 3 -1 1); do
            echo -n "$msg$(printf '%0.s.' $(seq 1 $i))\033[0K\r"
            sleep 0.2
        done
    done
}

npm install > /dev/null 2>&1 &
node runCypress.js > /dev/null 2>&1 &

# Get the PID of the background job
NODE_PID=$!

# Run the message function in the background
display_message &
DISPLAY_PID=$!

# Wait for the Node.js script to finish
wait $NODE_PID

# Stop displaying the message
kill $DISPLAY_PID

# Run Python script
python3 process_filtered_logs.py cypressResults.json

# Check if assessment_result.json exists
if [ -f "assesment_result.json" ]; then
    cp assesment_result.json ..
    echo "Assessment results generated"
else
    echo "Python script failed!!!"
fi