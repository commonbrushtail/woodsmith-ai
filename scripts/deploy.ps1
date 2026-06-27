# Deploy this project to Vercel using a project-scoped access token.
#
# Why this script exists:
#   The hosted Vercel project (`woodsmith`, team team_4AgM6HjzfR3pE38elkRNfqgP)
#   is on a SEPARATE Vercel account from this machine's global `vercel login`
#   (aedowondev-9011), which can't retrieve its project settings. Passing a
#   token from the owning account per-command deploys to the right project
#   without changing the global login — and uploads the local tree directly,
#   so it also avoids needing a GitHub push.
#
# One-time setup:
#   1. In the Vercel dashboard (logged in as the account/team that owns
#      `woodsmith`), create an access token: Account Settings -> Tokens.
#   2. Copy .vercel-token.local.example to .vercel-token.local and paste the
#      token (and VERCEL_SCOPE = the team slug if it's a team project).
#      That file matches *.local in .gitignore, so it is never committed.
#
# Usage:
#   powershell -File ./scripts/deploy.ps1            # production deploy
#   powershell -File ./scripts/deploy.ps1 -Preview   # preview (non-prod) deploy

param([switch]$Preview)

$ErrorActionPreference = 'Stop'

$root     = Split-Path -Parent $PSScriptRoot
$credFile = Join-Path $root '.vercel-token.local'

if (-not (Test-Path $credFile)) {
  throw "Missing $credFile. Copy .vercel-token.local.example to it and set VERCEL_TOKEN."
}

$token = $null
$scope = $null
foreach ($line in Get-Content $credFile) {
  if ($line -match '^\s*VERCEL_TOKEN\s*=\s*(.+?)\s*$') { $token = $matches[1].Trim().Trim('"').Trim("'") }
  if ($line -match '^\s*VERCEL_SCOPE\s*=\s*(.+?)\s*$') { $scope = $matches[1].Trim().Trim('"').Trim("'") }
}
if ([string]::IsNullOrWhiteSpace($token)) {
  throw "VERCEL_TOKEN is empty in $credFile."
}

$deployArgs = @('--token', $token, '--yes')
if (-not $Preview) { $deployArgs = @('--prod') + $deployArgs }
if (-not [string]::IsNullOrWhiteSpace($scope)) { $deployArgs += @('--scope', $scope) }

$target = if ($Preview) { 'preview' } else { 'production' }
Write-Host "Deploying to Vercel ($target) via project-scoped token..."

# The Vercel CLI streams progress to stderr; in Windows PowerShell 5.1 that
# surfaces as error records, which would abort under ErrorActionPreference=Stop.
# Relax it here and judge success by the process exit code.
$ErrorActionPreference = 'Continue'
vercel @deployArgs 2>&1 | ForEach-Object { Write-Host $_ }
if ($LASTEXITCODE -ne 0) {
  Write-Error "vercel deploy failed (exit $LASTEXITCODE)"
  exit $LASTEXITCODE
}
Write-Host 'Done.'
