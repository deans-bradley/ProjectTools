import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

// Configuration file path - shared across the application
export const CONFIG_PATH = path.join(os.homedir(), '.projecttools', 'config.json');

// Default configuration structure
export const DEFAULT_CONFIG = {
  appVersion: '1.0.0',
  settings: {
    defaultProjectsPath: path.join(os.homedir(), 'Dev'),
    firstTimeSetup: false
  },
  activeProfile: null,
  profiles: [],
  workspaces: [],
  projects: []
};

/**
 * Load configuration from file
 * @returns {Object} Configuration object
 */
export async function loadConfig() {
  try {
    const config = await fs.readJSON(CONFIG_PATH);
    return config;
  } catch (error) {
    console.error(chalk.red('❌ Error loading configuration:'), error.message);
    return DEFAULT_CONFIG;
  }
}

/**
 * Save configuration to file
 * @param {Object} config - Configuration object to save
 * @returns {boolean} Success status
 */
export async function saveConfig(config) {
  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    await fs.writeJSON(CONFIG_PATH, config, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(chalk.red('❌ Error saving configuration:'), error.message);
    return false;
  }
}

/**
 * Initialize configuration file if it doesn't exist
 * @returns {boolean} True if config was created, false if it already existed
 */
export async function initConfig() {
  try {
    await fs.ensureDir(path.dirname(CONFIG_PATH));
    
    if (!await fs.pathExists(CONFIG_PATH)) {
      await saveConfig(DEFAULT_CONFIG);
      return true;
    }
    return false; 
  } catch (error) {
    console.error(chalk.red('❌ Error initializing configuration:'), error.message);
    throw error;
  }
}

/**
 * Get configuration file path
 * @returns {string} Path to configuration file
 */
export function getConfigPath() {
  return CONFIG_PATH;
}