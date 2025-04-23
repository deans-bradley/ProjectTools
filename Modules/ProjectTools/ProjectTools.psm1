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

function Get-Repos {
    $repos = @{}
    $basePath = "C:\Users\$($env:USERNAME)\Work"
    $projectDirs = Get-ChildItem -Path $basePath -Directory

    foreach ($project in $projectDirs) {
        $repoPath = "$($project.FullName)\repos"

        if (Test-Path $repoPath) {
            $projectRepos = Get-ChildItem -Path $repoPath -Directory

            foreach ($repo in $projectRepos) {
                $repos[$repo.Name] = $repo.FullName
            }
        }
    }

    return $repos
}

function Open-Repo {
    param (
        [string]$RepoName,
        [switch]$Code  
    )

    $repos = Get-Repos

    if ($repos.ContainsKey($RepoName)) {
        $repoPath = $repos[$RepoName]
        Set-Location $repoPath  

        if ($Code) {
            if (Get-Command code -ErrorAction SilentlyContinue) {
                Start-Process "code" -ArgumentList $repoPath
                Write-Host "Repo '$RepoName' opened in VS Code." -ForegroundColor Green
            } else {
                Write-Host "VS Code is not installed or the 'code' command is not available." -ForegroundColor Red
            }
        }
    } else {
        Write-Host "Repo '$RepoName' not found." -ForegroundColor Red
    }
}

function Show-Repos {
    $repos = Get-Repos

    if ($repos.Count -eq 0) {
        Write-Host "No repos found." -ForegroundColor Red
        return
    }

    Write-Host "Available Repos:" -ForegroundColor Cyan
    foreach ($key in $repos.Keys) {
        Write-Host " - $key"
    }
}

Export-ModuleMember -Function pt