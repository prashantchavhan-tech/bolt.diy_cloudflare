$env:TEMP = "$PWD\logs"
$env:TMP = "$PWD\logs"
$env:OPENCLAW_STATE_DIR = "$PWD\.openclaw"
$env:OPENCLAW_SKIP_CHANNELS = "1"
$env:CLAWDBOT_SKIP_CHANNELS = "1"
node openclaw.mjs gateway --allow-unconfigured --port 18789 --verbose
