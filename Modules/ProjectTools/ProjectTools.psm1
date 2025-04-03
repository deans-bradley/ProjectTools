function pt {
    param (
        [string]$Action,
        [string]$ProjectName,
        [switch]$Code 
    )

    switch ($Action) {
        'show' {
            Show-Projects
        }
        'open' {
            if ($ProjectName) {
                Open-Project -ProjectName $ProjectName -Code:$Code
            } else {
                Write-Host "Please specify a project name to open." -ForegroundColor Red
            }
        }
        default {
            Write-Host "Invalid action. Available actions: 'show', 'open'" -ForegroundColor Red
        }
    }
}

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
        [string]$ProjectName,
        [switch]$Code  
    )

    $projects = Get-Projects

    if ($projects.ContainsKey($ProjectName)) {
        $projectPath = $projects[$ProjectName]
        Set-Location $projectPath  

        if ($Code) {
            if (Get-Command code -ErrorAction SilentlyContinue) {
                Start-Process "code" -ArgumentList $projectPath
                Write-Host "Project '$ProjectName' opened in VS Code." -ForegroundColor Green
            } else {
                Write-Host "VS Code is not installed or the 'code' command is not available." -ForegroundColor Red
            }
        }
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

Export-ModuleMember -Function pt