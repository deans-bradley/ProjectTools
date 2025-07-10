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

import ProjectTools from '../src/index.js';

const pt = new ProjectTools();

program
  .name('pt')
  .description('ProjectTools - Manage your development projects across workspaces and profiles.')
  .version('0.1.0');

program
  .command('profile')
  .description('Manage profiles')
  .action(() => {
    console.log(chalk.yellow('Profile management coming soon...'));
  });

program
  .command('workspace')
  .description('Manage workspaces')
  .action(() => {
    console.log(chalk.yellow('Workspace management coming soon...'));
  });

program
  .command('project')
  .description('Manage projects')
  .action(() => {
    console.log(chalk.yellow('Project management coming soon...'));
  });

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

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}