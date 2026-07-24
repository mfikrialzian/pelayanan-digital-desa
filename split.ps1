$lines = Get-Content "script.html"

function Get-Lines($start, $end) {
    return $lines[($start-1)..($end-1)]
}

$utils_lines = @("<script>") + (Get-Lines 2 13) + (Get-Lines 96 121) + (Get-Lines 234 260) + (Get-Lines 406 440) + (Get-Lines 444 489) + (Get-Lines 3371 3392) + @("</script>")
$core_lines = @("<script>") + (Get-Lines 14 95) + (Get-Lines 170 233) + (Get-Lines 261 343) + (Get-Lines 352 388) + @("</script>")
$warga_lines = @("<script>") + (Get-Lines 122 169) + (Get-Lines 344 351) + (Get-Lines 389 400) + (Get-Lines 490 1506) + @("</script>")
$admin_lines = @("<script>") + (Get-Lines 401 405) + (Get-Lines 441 443) + (Get-Lines 1507 3370) + @("</script>")

$utils_lines | Set-Content "script_utils.html" -Encoding UTF8
$core_lines | Set-Content "script_core.html" -Encoding UTF8
$warga_lines | Set-Content "script_warga.html" -Encoding UTF8
$admin_lines | Set-Content "script_admin.html" -Encoding UTF8

Write-Host "Split completed."
