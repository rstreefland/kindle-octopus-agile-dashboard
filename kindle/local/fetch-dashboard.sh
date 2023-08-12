#!/usr/bin/env sh
# Fetch a new dashboard image, make sure to output it to "$1".
# For example:
"$(dirname "$0")/../xh" -d -q -o "$1" get "https://REPLACE_ME_WITH_URL?token=REPLACE_ME_WITH_TOKEN&batteryPercentage=$(lipc-get-prop -- com.lab126.powerd battLevel)"
