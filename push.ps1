param (
    [string]$CommitMessage = "Update"
)

# Jika ada argument, gunakan sebagai pesan commit
if ($args.Length -gt 0) {
    $CommitMessage = $args -join " "
}

Write-Host "Menambahkan semua perubahan ke Git..." -ForegroundColor Cyan
git add .

Write-Host "Melakukan commit dengan pesan: '$CommitMessage'" -ForegroundColor Cyan
git commit -m $CommitMessage

Write-Host "Mendorong perubahan ke GitHub..." -ForegroundColor Cyan
git push

Write-Host "Selesai!" -ForegroundColor Green
