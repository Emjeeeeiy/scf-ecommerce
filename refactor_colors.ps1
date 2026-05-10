$files = "src/views/Admin/Categories.vue", "src/views/Admin/Dashboard.vue", "src/views/Admin/Orders.vue", "src/views/Admin/Products.vue", "src/views/Admin/Settings.vue", "src/views/Admin/Users.vue"

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $newContent = [regex]::Replace($content, 'dark:([^ "''\>]*?)slate-', 'dark:$1neutral-')
        Set-Content $file $newContent
        Write-Host "Processed $file"
    } else {
        Write-Warning "File not found: $file"
    }
}
