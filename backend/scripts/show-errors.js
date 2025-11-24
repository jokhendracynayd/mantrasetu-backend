#!/usr/bin/env node

/**
 * Script to display errors from server logs in a readable format
 * Usage: node scripts/show-errors.js [--tail] [--count=N]
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'logs');
const TODAY = new Date().toISOString().split('T')[0];
const ERROR_LOG = path.join(LOG_DIR, `error-${TODAY}.log`);
const COMBINED_LOG = path.join(LOG_DIR, `combined-${TODAY}.log`);

// Parse command line arguments
const args = process.argv.slice(2);
const tailMode = args.includes('--tail') || args.includes('-t');
const countArg = args.find(arg => arg.startsWith('--count=') || arg.startsWith('-c='));
const count = countArg ? parseInt(countArg.split('=')[1]) || 20 : 20;

function formatError(errorObj) {
  const timestamp = new Date(errorObj.timestamp).toLocaleString();
  const method = errorObj.method || 'N/A';
  const url = errorObj.url || 'N/A';
  const statusCode = errorObj.statusCode || 'N/A';
  const duration = errorObj.duration || 'N/A';
  const error = errorObj.error || 'N/A';
  const message = errorObj.message || 'N/A';
  const stack = errorObj.stack ? errorObj.stack.split('\n')[0] : 'N/A';

  return `
❌ ERROR [${timestamp}]
   Message: ${message}
   Error: ${error}
   Method: ${method} ${url}
   Status: ${statusCode}
   Duration: ${duration}
   Stack: ${stack}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
}

function readErrorsFromFile(filePath, limit = null) {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n').filter(line => line.trim());
  
  let errors = [];
  for (const line of lines) {
    try {
      const logEntry = JSON.parse(line);
      if (logEntry.level === 'error') {
        errors.push(logEntry);
      }
    } catch (e) {
      // Skip invalid JSON lines
    }
  }
  
  return limit ? errors.slice(-limit) : errors;
}

function displayErrors() {
  console.log('🔍 Checking for errors in server logs...\n');
  console.log(`📁 Error log: ${ERROR_LOG}`);
  console.log(`📁 Combined log: ${COMBINED_LOG}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  let errors = [];

  // Try to read from error log first
  if (fs.existsSync(ERROR_LOG)) {
    errors = readErrorsFromFile(ERROR_LOG, count);
  }

  // If no errors found, check combined log
  if (errors.length === 0 && fs.existsSync(COMBINED_LOG)) {
    errors = readErrorsFromFile(COMBINED_LOG, count);
  }

  if (errors.length === 0) {
    console.log('✅ No errors found in today\'s logs!');
    console.log('💡 The server is running without errors.');
    return;
  }

  console.log(`📊 Found ${errors.length} error(s):\n`);
  errors.forEach(error => {
    console.log(formatError(error));
  });
}

function watchErrors() {
  console.log('👀 Watching for new errors (Ctrl+C to stop)...\n');
  
  const fileToWatch = fs.existsSync(ERROR_LOG) ? ERROR_LOG : COMBINED_LOG;
  
  if (!fs.existsSync(fileToWatch)) {
    console.log(`⚠️  Log file not found: ${fileToWatch}`);
    console.log('💡 Make sure the server is running and generating logs.');
    return;
  }

  // Display recent errors first
  const recentErrors = readErrorsFromFile(fileToWatch, 5);
  if (recentErrors.length > 0) {
    console.log('📊 Recent errors:\n');
    recentErrors.forEach(error => {
      console.log(formatError(error));
    });
    console.log('\n');
  }

  // Watch for new errors
  let lastSize = fs.statSync(fileToWatch).size;
  
  setInterval(() => {
    try {
      const currentSize = fs.statSync(fileToWatch).size;
      if (currentSize > lastSize) {
        const newContent = fs.readFileSync(fileToWatch, 'utf-8');
        const newLines = newContent.slice(lastSize).split('\n').filter(line => line.trim());
        
        for (const line of newLines) {
          try {
            const logEntry = JSON.parse(line);
            if (logEntry.level === 'error') {
              console.log(formatError(logEntry));
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
        
        lastSize = currentSize;
      }
    } catch (e) {
      // File might have been rotated
      if (fs.existsSync(fileToWatch)) {
        lastSize = fs.statSync(fileToWatch).size;
      }
    }
  }, 1000);
}

// Main execution
if (tailMode) {
  watchErrors();
} else {
  displayErrors();
}

