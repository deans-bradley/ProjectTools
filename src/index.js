import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

/**
 * Main ProjectTools Application Class
 * Handles all the core functionality for managing profiles, workspaces, and projects
 */
class ProjectTools {
  constructor() {
    this.configPath = path.join(os.homedir(), '.projecttools', 'config.json');
    this.defaultConfig = {
      appVersion: '0.1.0',
      activeProfile: null,
      profiles: [],
      workspaces: [],
      projects: []
    };
    
    this.init();
  }

  /**
   * Initialize the application
   * Creates config directory and file if they don't exist
   */
  async init() {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      
      if (!await fs.pathExists(this.configPath)) {
        console.log(chalk.yellow('First time setup...'));
        await this.saveConfig(this.defaultConfig);
        console.log(chalk.green('✅ Configuration initialized!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Error initializing ProjectTools:'), error.message);
      process.exit(1);
    }
  }

  /**
   * Load configuration from file
   * @returns {Object} Configuration object
   */
  async loadConfig() {
    try {
      const config = await fs.readJSON(this.configPath);
      return config;
    } catch (error) {
      console.error(chalk.red('❌ Error loading configuration:'), error.message);
      return this.defaultConfig;
    }
  }

  /**
   * Save configuration to file
   * @param {Object} config - Configuration object to save
   */
  async saveConfig(config) {
    try {
      await fs.writeJSON(this.configPath, config, { spaces: 2 });
    } catch (error) {
      console.error(chalk.red('❌ Error saving configuration:'), error.message);
    }
  }

  /**
   * Generate a unique ID
   * @param {string} prefix - Prefix for the ID
   * @returns {string} Unique ID
   */
  generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get configuration file path (useful for debugging)
   * @returns {string} Path to configuration file
   */
  getConfigPath() {
    return this.configPath;
  }
}

export default ProjectTools;