import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';
import { loadConfig, saveConfig, initConfig, getConfigPath } from '../utils/configUtils.js';

/**
 * ConfigManager - Handles all configuration-related operations
 */
class ConfigManager {
  constructor() {
    this.init();
  }
  /**
   * Initialize the application
   * Creates config directory and file if they don't exist
   */
  async init() {
    try {
      const wasCreated = await initConfig();
      
      if (wasCreated) {
        console.log(chalk.yellow('First time setup...'));
        console.log(chalk.green('✅ Configuration initialized!'));
        console.log(chalk.blue(`📁 Default projects path: ${path.join(os.homedir(), 'Dev')}`));
        console.log(chalk.gray('   You can change this later with: pt config set default-path <path>'));
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
    return await loadConfig();
  }

  /**
   * Save configuration to file
   * @param {Object} config - Configuration object to save
   */
  async saveConfig(config) {
    return await saveConfig(config);
  }

  /**
   * Get a configuration setting
   * @param {string} key - Setting key (e.g., 'defaultProjectsPath')
   * @returns {any} Setting value
   */
  async getSetting(key) {
    try {
      const config = await loadConfig();
      return config.settings?.[key];
    } catch (error) {
      console.error(chalk.red('❌ Error getting setting:'), error.message);
      return null;
    }
  }

  /**
   * Set a configuration setting
   * @param {string} key - Setting key
   * @param {any} value - Setting value
   * @returns {Object} Result object with success status
   */
  async setSetting(key, value) {
    try {
      const config = await loadConfig();
      
      // Ensure settings object exists
      if (!config.settings) {
        config.settings = {};
      }
      
      config.settings[key] = value;
      const success = await saveConfig(config);
      
      return { success };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get the default projects path
   * @returns {string} Default projects path
   */
  async getDefaultProjectsPath() {
    const defaultPath = await this.getSetting('defaultProjectsPath');
    return defaultPath || path.join(os.homedir(), 'Dev');
  }

  /**
   * Set the default projects path
   * @param {string} projectsPath - New default projects path
   * @returns {Object} Result object with success status
   */
  async setDefaultProjectsPath(projectsPath) {
    try {
      // Resolve the path (handle ~ and relative paths)
      const resolvedPath = projectsPath.startsWith('~') 
        ? path.join(os.homedir(), projectsPath.slice(1))
        : path.resolve(projectsPath);

      // Ensure the directory exists
      await fs.ensureDir(resolvedPath);

      const result = await this.setSetting('defaultProjectsPath', resolvedPath);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * Get configuration file path (useful for debugging)
   * @returns {string} Path to configuration file
   */
  getConfigPath() {
    return getConfigPath();
  }
}

export default ConfigManager;