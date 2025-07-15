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

const profileCommand = program
  .command('profile')
  .description('Manage profiles');

profileCommand
  .command('add <profileName>')
  .description('Create a new profile')
  .action(async (profileName) => {
    try {
      const result = await pt.addProfile(profileName);
      if (result.success) {
        console.log(chalk.green(`✅ Profile "${profileName}" created successfully!`));
        if (result.isFirstProfile) {
          console.log(chalk.blue(`🎯 "${profileName}" is now your active profile`));
        }
      } else {
        console.log(chalk.red(`❌ ${result.message}`));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error creating profile:'), error.message);
    }
  });

profileCommand
  .command('list')
  .description('List all profiles')
  .action(async () => {
    try {
      const profiles = await pt.listProfiles();
      if (profiles.length === 0) {
        console.log(chalk.yellow('📝 No profiles found. Create one with: pt profile add <name>'));
      } else {
        console.log(chalk.cyan('\n📋 Available Profiles:'));
        profiles.forEach(profile => {
          const indicator = profile.active ? chalk.green('● (active)') : chalk.gray('○');
          console.log(`  ${indicator} ${profile.name}`);
        });
        console.log('');
      }
    } catch (error) {
      console.error(chalk.red('❌ Error listing profiles:'), error.message);
    }
  });

profileCommand
  .command('switch <profileName>')
  .description('Switch profiles')
  .action(async (profileName) => {
    try {
      const result = await pt.switchProfile(profileName);

      if (result.success) {
        console.log(chalk.green(`✅ Switched to profile "${result.profileName}"`));
      } else {
        console.log(chalk.red(`❌ ${result.message}`));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error switching profile:'), error.message);
    }
  });

profileCommand
  .command('remove <profileName>')
  .description('Remove a specific profile')
  .action(async (profileName) => {
    try {
      const result = await pt.removeProfile(profileName);
      if (result.success) {
        console.log(chalk.green(`✅ Profile "${result.removedProfile}" removed`));
        if (result.activeProfileChanged && result.activeProfile) {
          console.log(chalk.blue(`🎯 "${result.activeProfile}" is now your active profile`));
        } else if (result.activeProfileChanged && !result.activeProfile) {
          console.log(chalk.yellow('📝 No profiles found. Create one with: pt profile add <name>'));
        }
      } else {
        console.log(chalk.red(`❌ ${result.message}`));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error switching profile:'), error.message);
    }
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