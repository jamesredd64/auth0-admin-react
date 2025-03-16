# Script to update SVG imports in React components

function Show-Menu {
    Clear-Host
    Write-Host "================ SVG Import Update Tool ================"
    Write-Host "1: Run automatic conversion (recommended)"
    Write-Host "2: Show files that will be affected"
    Write-Host "3: Backup files before conversion"
    Write-Host "4: Run prettier/eslint after conversion"
    Write-Host "Q: Quit"
    Write-Host "==================================================="
}

function Get-AffectedFiles {
    $files = Get-ChildItem -Path ".\src" -Recurse -Include "*.tsx","*.ts" | 
        Select-String -Pattern "import.*from.*\.svg" |
        Select-Object Path -Unique
    return $files
}

function Backup-Files {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = ".\backup_$timestamp"
    
    New-Item -ItemType Directory -Path $backupDir
    
    Get-AffectedFiles | ForEach-Object {
        $destPath = Join-Path $backupDir $_.Path.Replace(".\", "")
        $destDir = Split-Path $destPath -Parent
        
        if (!(Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force
        }
        
        Copy-Item $_.Path -Destination $destPath
    }
    
    Write-Host "Backup created in: $backupDir"
}

function Run-Conversion {
    try {
        # Run the codemod
        $codemodPath = ".\node_modules\vite-plugin-svgr\codemods\src\v4\default-export\default-export.js"
        
        if (!(Test-Path $codemodPath)) {
            Write-Host "Error: Could not find codemod script. Please ensure vite-plugin-svgr is installed."
            return
        }

        Write-Host "Running conversion..."
        npx jscodeshift@latest ./src/ --extensions=ts,tsx --parser=tsx --transform=$codemodPath

        Write-Host "Conversion completed successfully!"
        return $true
    }
    catch {
        Write-Host "Error during conversion: $_"
        return $false
    }
}

function Run-CodeFormatting {
    Write-Host "Running code formatting..."
    
    try {
        # Run prettier
        Write-Host "Running prettier..."
        npm run prettier -- --write "src/**/*.{ts,tsx}"
        
        # Run eslint
        Write-Host "Running eslint..."
        npm run lint -- --fix
        
        Write-Host "Code formatting completed successfully!"
    }
    catch {
        Write-Host "Error during code formatting: $_"
    }
}

# Main loop
do {
    Show-Menu
    $selection = Read-Host "Please make a selection"
    
    switch ($selection) {
        '1' {
            Write-Host "`nStarting automatic conversion..."
            $affected = Get-AffectedFiles
            Write-Host "Found $($affected.Count) files with SVG imports"
            
            $confirm = Read-Host "Do you want to proceed? (y/n)"
            if ($confirm -eq 'y') {
                Backup-Files
                if (Run-Conversion) {
                    $formatConfirm = Read-Host "Do you want to run code formatting? (y/n)"
                    if ($formatConfirm -eq 'y') {
                        Run-CodeFormatting
                    }
                }
            }
        }
        '2' {
            Write-Host "`nFiles that will be affected:"
            Get-AffectedFiles | ForEach-Object {
                Write-Host $_.Path
            }
        }
        '3' {
            Backup-Files
        }
        '4' {
            Run-CodeFormatting
        }
    }
    
    if ($selection -ne 'q') {
        Write-Host "`nPress any key to continue..."
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
} until ($selection -eq 'q')