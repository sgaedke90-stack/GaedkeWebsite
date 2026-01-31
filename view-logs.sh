#!/bin/bash
# Quick script to view lead and analytics logs locally during development

if [ "$1" == "leads" ]; then
  echo "=== LEAD SUBMISSIONS (web/data/quote-log.jsonl) ==="
  if [ -f "web/data/quote-log.jsonl" ]; then
    cat "web/data/quote-log.jsonl" | tail -20 | jq '.'
  else
    echo "No leads logged yet"
  fi
elif [ "$1" == "analytics" ]; then
  echo "=== ANALYTICS EVENTS (web/data/analytics.jsonl) ==="
  if [ -f "web/data/analytics.jsonl" ]; then
    cat "web/data/analytics.jsonl" | tail -20 | jq '.'
  else
    echo "No analytics logged yet"
  fi
elif [ "$1" == "both" ]; then
  echo "=== LEAD SUBMISSIONS ==="
  if [ -f "web/data/quote-log.jsonl" ]; then
    echo "Count: $(wc -l < web/data/quote-log.jsonl)"
    cat "web/data/quote-log.jsonl" | tail -3 | jq '.'
  else
    echo "No leads logged yet"
  fi
  echo ""
  echo "=== ANALYTICS EVENTS ==="
  if [ -f "web/data/analytics.jsonl" ]; then
    echo "Count: $(wc -l < web/data/analytics.jsonl)"
    cat "web/data/analytics.jsonl" | tail -5 | jq '.'
  else
    echo "No analytics logged yet"
  fi
else
  echo "Usage: ./view-logs.sh [leads|analytics|both]"
  echo "  leads     - View recent lead submissions"
  echo "  analytics - View recent analytics events"
  echo "  both      - View both (with counts)"
fi
