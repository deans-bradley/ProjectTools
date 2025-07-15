# Welcome to ProjectTools

A CLI tool for managing development projects across multiple workspaces and profiles.

## Features

### Show current configuration
```bash
pt config show
```

### Set a custom default path
```bash
pt config set default-path ~/MyProjects
```

### Profile management
```bash
pt profile list
pt profile add <PROFILE_NAME>
pt profile switch <PROFILE_NAME>
pt profile remove <PROFILE_NAME>
```

### Workspace management
```bash
pt workspace list [PROFILE_NAME]
pt workspace add <WORKSPACE_NAME> <PATH>
pt workspace remove <WORKSPACE_NAME>
```

### Project management
```bash
pt project list <WORKSPACE_NAME>
pt project add <WORKSPACE_NAME> <PROJECT_NAME> [REPO_LINK]
pt project remove <PROJECT_NAME>
pt project open <PROJECT_NAME>
pt project cd <PROJECT_NAME>
```