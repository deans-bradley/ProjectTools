function Get-Projects {
    $projects = @{}
    $basePath = "C:\Users\$($env:USERNAME)\Work"
    $companyDirs = Get-ChildItem -Path $basePath -Directory

    foreach ($company in $companyDirs) {
        $repoPath = "$($company.FullName)\repos"

        if (Test-Path $repoPath) {
            $repos = Get-ChildItem -Path $repoPath -Directory

            foreach ($project in $repos) {
                $projects[$project.Name] = $project.FullName
            }
        }
    }

    return $projects
}

function Open-Project {
    param (
        [string]$ProjectName
    )

    $projects = Get-Projects

    if ($projects.ContainsKey($ProjectName)) {
        Set-Location $projects[$ProjectName]
    } else {
        Write-Host "Project '$ProjectName' not found." -ForegroundColor Red
    }
}

function Show-Projects {
    $projects = Get-Projects

    if ($projects.Count -eq 0) {
        Write-Host "No projects found." -ForegroundColor Red
        return
    }

    Write-Host "Available Projects:" -ForegroundColor Cyan
    foreach ($key in $projects.Keys) {
        Write-Host " - $key => $($projects[$key])"
    }
}

Export-ModuleMember -Function Open-Project, Show-Projects