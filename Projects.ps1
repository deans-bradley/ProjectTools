# Global variable to store project paths
$global:ProjectPaths = @{}

function update-projects {
    $basePath = "C:\Users\$($env:USERNAME)\Work"
    $companyDirs = Get-ChildItem -Path $basePath -Directory
    $global:ProjectPaths.Clear()

    foreach ($company in $companyDirs) {
        $repoPath = "$($company.FullName)\repos"

        if (Test-Path $repoPath) {
            $projects = Get-ChildItem -Path $repoPath -Directory

            foreach ($project in $projects) {
                $global:ProjectPaths[$project.Name] = $project.FullName
            }
        }
    }

    Write-Host "Projects updated successfully!" -ForegroundColor Green
}

function open-project {
    param (
        [string]$ProjectName
    )

    if ($global:ProjectPaths.ContainsKey($ProjectName)) {
        Set-Location $global:ProjectPaths[$ProjectName]
    } else {
        Write-Host "Project '$ProjectName' not found. Run 'Update-Projects' to refresh." -ForegroundColor Red
    }
}

function list-projects {
    if ($global:ProjectPaths.Count -eq 0) {
        Write-Host "No projects found. Run 'Update-Projects' first." -ForegroundColor Red
        return
    }

    Write-Host "Available Projects:" -ForegroundColor Cyan
    foreach ($key in $global:ProjectPaths.Keys) {
        Write-Host " - $key => $($global:ProjectPaths[$key])"
    }
}
