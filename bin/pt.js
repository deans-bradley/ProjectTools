#!/usr/bin/env node

/**
 * ProjectTools CLI Entry Point
 */

import { program } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import ConfigManager from '../src/managers/ConfigManager.js';
import { setupConfigCommands } from '../src/commands/configCommands.js';
import ProfileManager from '../src/managers/ProfileManager.js';
import { setupProfileCommands } from '../src/commands/profileCommands.js';
import ProjectManager from '../src/managers/ProjectManager.js';
import { setupProjectCommands } from '../src/commands/projectCommands.js';
import WorkspaceManager from '../src/managers/WorkspaceManager.js';
import { setupWorkspaceCommands } from '../src/commands/workspaceCommands.js';

const configManager = new ConfigManager();
const profileManager = new ProfileManager();
const projectManager = new ProjectManager();
const workspaceManager = new WorkspaceManager();

program
  .name('pt')
  .description('ProjectTools - Manage your development projects across workspaces and profiles.')
  .version('0.1.12');

program
  .command('hello')
  .description('Test command to verify installation')
  .action(() => {
    console.log(chalk.green('🎉 ProjectTools is working!'));
    console.log(chalk.blue('Ready to manage your projects with ease!'));
  });

program.action(() => {
  console.log(chalk.cyan('Welcome to ProjectTools!'));
  console.log('Use --help to see available commands.');
});

setupConfigCommands(program, configManager);
setupProfileCommands(program, profileManager);
setupProjectCommands(program, projectManager);
setupWorkspaceCommands(program, workspaceManager);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}