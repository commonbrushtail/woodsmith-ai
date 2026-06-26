# Apply pending Supabase migrations to the hosted WoodSmith project.
#
# Why this script exists:
#   The hosted project (qmmrjkrzhroiskunmvxa) lives in a SEPARATE Supabase
#   account from the machine's global `supabase login`. So a normal
#   `supabase db push` authenticates through the Management API as the wrong
#   account and returns 403. This connects DIRECTLY to Postgres via --db-url,
#   which needs no account auth — only the database password.
#
# One-time setup:
#   1. Dashboard -> Settings -> Database -> copy the Database password.
#   2. Copy supabase/.db-credentials.local.example to
#      supabase/.db-credentials.local and paste the password.
#      (That file matches *.local in .gitignore, so it is never committed.)
#
# Usage:
#   pwsh ./scripts/db-push.ps1            # apply pending migrations
#   pwsh ./scripts/db-push.ps1 -DryRun    # show what would be applied

param([switch]$DryRun)

$ErrorActionPreference = 'Stop'

$root     = Split-Path -Parent $PSScriptRoot
$credFile = Join-Path $root 'supabase\.db-credentials.local'

if (-not (Test-Path $credFile)) {
  throw "Missing $credFile. Copy supabase\.db-credentials.local.example to it and set SUPABASE_DB_PASSWORD."
}

$pw = $null
foreach ($line in Get-Content $credFile) {
  if ($line -match '^\s*SUPABASE_DB_PASSWORD\s*=\s*(.+?)\s*$') {
    $pw = $matches[1].Trim().Trim('"').Trim("'")
  }
}
if ([string]::IsNullOrWhiteSpace($pw)) {
  throw "SUPABASE_DB_PASSWORD is empty in $credFile."
}

# Percent-encode the password ( --db-url requires it ) and build the pooler URL.
$enc   = [System.Uri]::EscapeDataString($pw)
$dbUrl = "postgresql://postgres.qmmrjkrzhroiskunmvxa:$enc@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

$pushArgs = @('db', 'push', '--db-url', $dbUrl, '--yes')
if ($DryRun) { $pushArgs += '--dry-run' }

Write-Host 'Pushing migrations to qmmrjkrzhroiskunmvxa via direct pooler connection...'

# Supabase streams progress to stderr; in Windows PowerShell 5.1 that surfaces
# as error records, which would abort under ErrorActionPreference=Stop before
# the push finishes. Relax it here and judge success by the process exit code.
$ErrorActionPreference = 'Continue'
supabase @pushArgs 2>&1 | ForEach-Object { Write-Host $_ }
if ($LASTEXITCODE -ne 0) {
  Write-Error "supabase db push failed (exit $LASTEXITCODE)"
  exit $LASTEXITCODE
}
Write-Host 'Done.'
