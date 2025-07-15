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
      appVersion: '0.1.11',
      settings: {
        defaultProjectsPath: path.join(os.homedir(), 'Dev'),
        firstTimeSetup: false
      },
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
        console.log(chalk.blue(`📁 Default projects path: ${this.defaultConfig.settings.defaultProjectsPath}`));
        console.log(chalk.gray('You can change this later with: pt config set default-path <path>'));
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
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Get configuration file path
   * @returns {string} Path to configuration file
   */
  getConfigPath() {
    return this.configPath;
  }

  /**
   * Format name string to a valid value
   * @param {string} name - Name string to be cleaned.
   * @returns {string} Name converted to lowercase and whitespace removed 
   */
  cleanName(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  }

  // ========================================
  // CONFIGURATION MANAGEMENT
  // ========================================

  /**
   * Get a configuration setting
   * @param {string} key - Setting key (e.g., 'defaultProjectsPath')
   * @returns {any} Setting value
   */
  async getSetting(key) {
    try {
      const config = await this.loadConfig();
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
      const config = await this.loadConfig();
      
      // Ensure settings object exists
      if (!config.settings) {
        config.settings = {};
      }
      
      config.settings[key] = value;
      await this.saveConfig(config);
      
      return { success: true };
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
      const resolvedPath = projectsPath.startsWith('~') 
        ? path.join(os.homedir(), projectsPath.slice(1))
        : path.resolve(projectsPath);

      await fs.ensureDir(resolvedPath);

      const result = await this.setSetting('defaultProjectsPath', resolvedPath);
      return result;
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // ========================================
  // PROFILE MANAGEMENT
  // ========================================

  /**
   * Add a new profile
   * @param {string} profileName - Name of the profile to create
   * @returns {Object} Result object with success status and message
   */
  async addProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '') {
        return { success: false, message: 'Profile name cannot be empty' };
      }

      const cleanName = this.cleanName(profileName);
      
      if (cleanName !== profileName.trim().toLowerCase()) {
        console.log(chalk.yellow(`📝 Profile name cleaned: "${profileName}" → "${cleanName}"`));
      }

      const config = await this.loadConfig();

      const existingProfile = config.profiles.find(p => p.name === cleanName);
      if (existingProfile) {
        return { success: false, message: `Profile "${cleanName}" already exists` };
      }

      const newProfile = {
        id: this.generateId('prof'),
        name: cleanName,
        created: new Date().toISOString()
      };

      config.profiles.push(newProfile);

      const isFirstProfile = config.profiles.length === 1;
      if (isFirstProfile) {
        config.activeProfile = cleanName;
      }

      await this.saveConfig(config);

      return { success: true, isFirstProfile };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  /**
   * List all profiles
   * @returns {Array} Array of profile objects with active status
   */
  async listProfiles() {
    try {
      const config = await this.loadConfig();
      
      return config.profiles.map(profile => ({
        ...profile,
        active: profile.name === config.activeProfile
      }));
    } catch (error) {
      console.error(chalk.red('❌ Error loading profiles:'), error.message);
      return [];
    }
  }

  /**
   * Switch to a different profile
   * @param {string} profileName - Name of the profile to switch
   * @returns {Object} Result object with success status and message
   */
  async switchProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '') {
        return { success: false, message: 'Profile name cannot be empty' };
      }

      const cleanName = this.cleanName(profileName);
      const config = await this.loadConfig();

      if (config.activeProfile === cleanName) {
        return { success: false, message: `Already on profile "${cleanName}"` };
      } else if (!config.profiles.find(profile => profile.name === cleanName)) {
        return { success: false, message: `Profile "${cleanName}" does not exist` };
      } else {
        config.activeProfile = cleanName;
        await this.saveConfig(config);
        return { success: true, profileName: cleanName };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // TODO: The remove command should also remove all child workspaces and projects.
  // This is a dangerous action and so we should display a warning before executing the command.
  // For now the command will just remove the profile only.
  /**
   * Remove a specific profile
   * @param {string} profileName - Name of the profile to remove
   * @returns {Object} Result object with success status and message
   */
  async removeProfile(profileName) {
    try {
      if (!profileName || profileName.trim() === '') {
        return { success: false, message: 'Profile name cannot be empty' };
      }

      let activeProfileChanged = false;
      let activeProfile = null;
      const cleanName = this.cleanName(profileName);
      const config = await this.loadConfig();

      if (!config.profiles.find(profile => profile.name === cleanName)) {
        return { success: false, message: `Profile "${cleanName}" does not exist` };
      } else {
        const profiles = config.profiles;
        const index = profiles.findIndex(profiles => profiles.name === cleanName);

        if (index !== -1) {
          config.profiles.splice(index, 1);
        }

        if (config.activeProfile === cleanName) {
          if (config.profiles.length > 0) {
            config.activeProfile = config.profiles[0].name;
            activeProfileChanged = true;
            activeProfile = config.activeProfile;
          } else {
            config.activeProfile = null;
            activeProfileChanged = true;
          }
        }

        await this.saveConfig(config);
        return { 
          success: true, 
          removedProfile: cleanName, 
          activeProfileChanged: activeProfileChanged, 
          activeProfile: activeProfile 
        };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default ProjectTools;