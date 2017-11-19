pushd $PSScriptRoot\files
Compress-Archive -Path * -DestinationPath ..\WiktionaryLanguageFilter.zip -Force
popd