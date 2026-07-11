from pathlib import Path
import os
import sys

ROOT = Path(__file__).resolve().parent

sys.path.insert(0, str(ROOT / "src"))

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings",
)

from django.core.management import execute_from_command_line

execute_from_command_line(
    ["manage.py", "runserver"]
)