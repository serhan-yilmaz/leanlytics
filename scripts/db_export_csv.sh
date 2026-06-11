#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

EXPORT_DIR="$PROJECT_ROOT/db_exports"

mkdir -p "$EXPORT_DIR"

echo "Fetching table list..."

TABLES=$(docker exec leanlytics-postgres \
  psql -U leanlytics -d leanlytics \
  -t -A \
  -c "SELECT tablename FROM pg_tables WHERE schemaname='public';")

for TABLE in $TABLES
do
  echo "Exporting $TABLE..."

  docker exec leanlytics-postgres \
    psql -U leanlytics -d leanlytics \
    -c "\COPY $TABLE TO STDOUT WITH CSV HEADER" \
    > "$EXPORT_DIR/$TABLE.csv"
done

echo "Export complete."