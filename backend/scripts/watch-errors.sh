#!/bin/bash

# Script to watch and display errors from server logs in real-time
# Usage: ./scripts/watch-errors.sh

LOG_DIR="logs"
TODAY=$(date +%Y-%m-%d)
ERROR_LOG="$LOG_DIR/error-$TODAY.log"
COMBINED_LOG="$LOG_DIR/combined-$TODAY.log"

echo "🔍 Watching for errors in server logs..."
echo "📁 Error log: $ERROR_LOG"
echo "📁 Combined log: $COMBINED_LOG"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to format and display errors nicely
format_error() {
    local line="$1"
    if command -v jq &> /dev/null; then
        # If jq is available, format JSON nicely
        echo "$line" | jq -r '
            "❌ ERROR [" + .timestamp + "]\n" +
            "   Message: " + .message + "\n" +
            "   Error: " + (.error // "N/A") + "\n" +
            "   Method: " + .method + " " + .url + "\n" +
            "   Status: " + (.statusCode | tostring) + "\n" +
            "   Duration: " + .duration + "\n" +
            "   Stack: " + (.stack // "N/A" | split("\n")[0]) + "\n"
        '
    else
        # Fallback: simple grep output
        echo "$line"
    fi
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Watch error log file
if [ -f "$ERROR_LOG" ]; then
    echo "📊 Recent errors from error log:"
    tail -20 "$ERROR_LOG" | while IFS= read -r line; do
        if [ ! -z "$line" ]; then
            format_error "$line"
        fi
    done
    echo ""
    echo "👀 Watching for new errors (Ctrl+C to stop)..."
    echo ""
    
    # Tail the error log file
    tail -f "$ERROR_LOG" 2>/dev/null | while IFS= read -r line; do
        if [ ! -z "$line" ]; then
            format_error "$line"
        fi
    done
else
    echo "⚠️  Error log file not found: $ERROR_LOG"
    echo "📊 Checking combined log for errors..."
    
    if [ -f "$COMBINED_LOG" ]; then
        echo ""
        echo "Recent errors from combined log:"
        grep -i '"level":"error"' "$COMBINED_LOG" | tail -20 | while IFS= read -r line; do
            format_error "$line"
        done
        
        echo ""
        echo "👀 Watching for new errors (Ctrl+C to stop)..."
        echo ""
        
        # Tail the combined log and filter for errors
        tail -f "$COMBINED_LOG" 2>/dev/null | grep --line-buffered -i '"level":"error"' | while IFS= read -r line; do
            format_error "$line"
        done
    else
        echo "⚠️  Combined log file not found: $COMBINED_LOG"
        echo "💡 Make sure the server is running and generating logs."
    fi
fi

