import chalk from 'chalk';

/**
 * Setup project-related CLI commands
 * @param {Object} program - Commander.js program instance
 * @param {ConfigManager} projectManager - ProjectManager instance
 */
export function setupProjectCommands(program, projectManager) {
  const projectCommand = program
    .command('project')
    .description('Manage projects')
    .action(() => {
      console.log(chalk.yellow('Project management coming soon...'));
    });
}