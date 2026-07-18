$indexFile = "C:\Users\alzia\.gemini\antigravity\scratch\PelayananDigitalDesa\index.html"
$content = [IO.File]::ReadAllText($indexFile)

# Extract style
$styleRegex = [regex]'(?s)<style>.*?</style>'
$styleMatch = $styleRegex.Match($content)
if ($styleMatch.Success) {
    [IO.File]::WriteAllText("C:\Users\alzia\.gemini\antigravity\scratch\PelayananDigitalDesa\style.html", $styleMatch.Value)
    $content = $content.Replace($styleMatch.Value, "<?!= include('style'); ?>")
}

# Extract last script (using right-to-left regex to get the last one)
$scriptRegex = [regex]::new('(?s)<script>.*?</script>', [System.Text.RegularExpressions.RegexOptions]::RightToLeft)
$scriptMatch = $scriptRegex.Match($content)
if ($scriptMatch.Success) {
    [IO.File]::WriteAllText("C:\Users\alzia\.gemini\antigravity\scratch\PelayananDigitalDesa\script.html", $scriptMatch.Value)
    $content = $content.Replace($scriptMatch.Value, "<?!= include('script'); ?>")
}

# Change parameter
$content = $content.Replace('<input type="hidden" id="initial-page-param" value="warga">', '<input type="hidden" id="initial-page-param" value="<?= pageParam ?>">')

[IO.File]::WriteAllText($indexFile, $content)

Write-Host "Split completed"
