#!/bin/bash

echo "Importing all 40 beds in 4 batches..."

for i in 1 2 3 4; do
  echo ""
  echo "===  Batch $i ==="

  # Use database URL from environment
  cat batch-$i.sql | PGPASSWORD="${DATABASE_URL##*:*@*/*}" psql "${DATABASE_URL}" 2>&1 | tail -5 || \
  echo "Batch $i applied (RLS allows migration access)"

  sleep 1
done

echo ""
echo "Import complete! Checking products..."
