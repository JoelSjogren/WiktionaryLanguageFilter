$temp = "$env:TEMP\WikiZip"

if (Test-Path $temp)
{
    Remove-Item -Path $temp -Recurse
}

New-Item -Path $temp -ItemType "Directory"

Copy-Item -Path $PSScriptRoot\files\* -Destination $temp -Container -Exclude "*.pdn" -Recurse
Compress-Archive -Path "$temp\*" -DestinationPath $PSScriptRoot\WiktionaryLanguageFilter.zip -Force

Remove-Item -Path $temp -Force -Recurse