function pt {
    param (
        [string]$Action,
        [string]$RepoName,
        [switch]$Code 
    )

    switch ($Action) {
        'show' {
            Show-Repos
        }
        'open' {
            if ($RepoName) {
                Open-Repo -RepoName $RepoName -Code:$Code
            } else {
                Write-Host "Please specify a repo name to open." -ForegroundColor Red
            }
        }
        default {
            Write-Host "Invalid action. Available actions: 'show', 'open'" -ForegroundColor Red
        }
    }
}

function Get-Projects {
    $projects = @()
    $basePath = "C:\Users\$($env:USERNAME)\Work"
    $projectDirs = Get-ChildItem -Path $basePath -Directory

    foreach ($projectDir in $projectDirs) {
        $project = [Project]::new()
        $project.Name = $projectDir.Name
        $project.Path = $projectDir.FullName
        $project.Repos = Get-Repos -RepoPath "$($projectDir.FullName)\repos"
        $projects += $project
    }

    return $projects
}

function Get-Repos {
    param (
        [string]$RepoPath
    )

    $repos = @{}

    if (Test-Path $RepoPath) {
        $projectRepos = Get-ChildItem -Path $RepoPath -Directory

        foreach ($repo in $projectRepos) {
            $repos[$repo.Name] = $repo.FullName
        }
    }

    return $repos
}

function Open-Repo {
    param (
        [string]$RepoName,
        [switch]$Code  
    )

    $projects = Get-Projects
    $repoFound = $false

    foreach ($project in $projects) {
        if ($project.Repos.ContainsKey($RepoName)) {
            $repoPath = $project.Repos[$RepoName]
            Set-Location $repoPath  
    
            if ($Code) {
                if (Get-Command code -ErrorAction SilentlyContinue) {
                    Start-Process "code" -ArgumentList $repoPath
                    Write-Host "Repo '$RepoName' opened in VS Code." -ForegroundColor Green
                } else {
                    Write-Host "VS Code is not installed or the 'code' command is not available." -ForegroundColor Red
                }
            }
            $repoFound = $true
            break
        }
    }

    if (!$repoFound) {
        Write-Host "Repo '$RepoName' not found." -ForegroundColor Red
    } 
}

function Show-Repos {
    $projects = Get-Projects

    if ($projects.Count -eq 0) {
        Write-Host "No projects found." -ForegroundColor Red
        return
    }

    Write-Host "Available Projects:" -ForegroundColor Cyan
    foreach ($project in $projects) {
        Write-Host " - $($project.Name)" -ForegroundColor Green
        foreach ($repo in $project.Repos.Keys) {
            Write-Host "   - $repo" -ForegroundColor Gray
        }
    }
}

class Project {
    [string]$Name
    [string]$Path
    [hashtable]$Repos
}

Export-ModuleMember -Function pt