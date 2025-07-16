import chalk from 'chalk';

/**
 * Setup configuration-related CLI commands
 * @param {Object} program - Commander.js program instance
 * @param {ConfigManager} configManager - ConfigManager instance
 */
export function setupConfigCommands(program, configManager) {
  const configCommand = program
    .command('config')
    .description('Manage ProjectTools configuration');

  configCommand
    .command('show')
    .description('Show current configuration')
    .action(async () => {
      try {
        const config = await configManager.loadConfig();
        console.log(chalk.cyan('\n⚙️  ProjectTools Configuration:'));
        console.log(chalk.gray('─'.repeat(40)));
        console.log(`📁 Default projects path: ${chalk.yellow(config.settings?.defaultProjectsPath || 'Not set')}`);
        console.log(`🎯 Active profile: ${chalk.yellow(config.activeProfile || 'None')}`);
        console.log(`📊 Profiles: ${chalk.yellow(config.profiles?.length || 0)}`);
        console.log(`📂 Workspaces: ${chalk.yellow(config.workspaces?.length || 0)}`);
        console.log(`📦 Projects: ${chalk.yellow(config.projects?.length || 0)}`);
        console.log(`📍 Config file: ${chalk.gray(configManager.getConfigPath())}`);
        console.log('');
      } catch (error) {
        console.error(chalk.red('❌ Error showing configuration:'), error.message);
      }
    });

  configCommand
    .command('set')
    .argument('<key>', 'Configuration key')
    .argument('<value>', 'Configuration value')
    .description('Set a configuration value')
    .action(async (key, value) => {
      try {
        if (key === 'default-path') {
          const result = await configManager.setDefaultProjectsPath(value);
          if (result.success) {
            console.log(chalk.green(`✅ Default projects path set to: ${value}`));
          } else {
            console.log(chalk.red(`❌ ${result.message}`));
          }
        } else {
          console.log(chalk.red(`❌ Unknown configuration key: ${key}`));
          console.log(chalk.gray('Available keys: default-path'));
        }
      } catch (error) {
        console.error(chalk.red('❌ Error setting configuration:'), error.message);
      }
    });
}