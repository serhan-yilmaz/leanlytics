#!/bin/bash

BACKUP_DIR=/opt/backups/leanlytics

mkdir -p "$BACKUP_DIR"

docker exec leanlytics-postgres \
  pg_dump -U leanlytics -Fc leanlytics \
  > "$BACKUP_DIR/leanlytics_$(date +%F).dump"