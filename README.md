# ProjectTools PowerShell Module

## Key Features:
- **Navigate to project directories** with ease.
- **Open projects in VS Code** with a single command.
- **List all available projects** in your workspace for easy reference.

## Setup

To get started with the **ProjectTools** module, follow these steps:

### Prerequisites
- PowerShell 5.1 or higher.
- **VS Code** installed (optional, for opening projects in VS Code).

### Installation Steps:

1. **Clone or Download the Repository**:
   Download the project files to your local machine.

2. **Place the Module in Your PowerShell Modules Folder**:
   Move the `ProjectTools` folder to the following directory:
   - `C:\Users\<YourUsername>\Documents\WindowsPowerShell\Modules\ProjectTools\`
   (Replace `<YourUsername>` with your actual Windows username.)

3. **Import the Module**:
   Open your PowerShell profile file (`Microsoft.PowerShell_profile.ps1`) and add the following line:
   ```powershell
   Import-Module ProjectTools
   ```
   This ensures that the module is loaded every time you open PowerShell.

4. **Reload PowerShell**:
   Restart your PowerShell terminal or run the following to reload your profile:
   ```powershell
   . $PROFILE
   ```

---

## Usage Guide

Once the module is installed and loaded, you can start using the following commands:

### 1. **`pt open <ProjectName>`**

This command allows you to navigate directly to the directory of the specified project.

#### Syntax:
```powershell
pt open <ProjectName>
```

#### Example:
```powershell
pt open MyApp
```
This will change the directory to `MyApp` within your defined project structure.

---

### 2. **`pt open <ProjectName> -code`**

This command works like `pt open`, but also opens the project in **VS Code** if the `code` command is available on your system.

#### Syntax:
```powershell
pt open <ProjectName> -code
```

#### Example:
```powershell
pt open MyApp -code
```
This will change to the `MyApp` project directory and open the project in **VS Code**.

---

### 3. **`pt show`**

This command will list all available projects that are detected within your configured workspace. It provides an overview of all projects stored in your `repos` directories.

#### Example:
```powershell
pt show
```
This will display a list of all available projects along with their paths.

---

## Troubleshooting

- **VS Code isn't opening the project**: Ensure that **VS Code** is installed and the `code` command is available in your system's PATH.
  - Test the `code` command by typing `code --version` in the terminal. If it’s not recognized, refer to the [VS Code installation guide](https://code.visualstudio.com/docs/setup/setup-overview) to ensure it's correctly installed and added to the PATH.

- **Projects not showing**: If projects are not appearing, run `pt show` to check that the module is correctly detecting your project directories. Ensure that your project structure follows the expected format: `C:\Users\<YourUsername>\Work\<Company>\repos\<ProjectName>`.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
