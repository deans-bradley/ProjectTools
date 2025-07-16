import chalk from 'chalk';
import { generateId, cleanName } from '../utils/commonUtils.js';
import { loadConfig, saveConfig } from '../utils/configUtils.js';

/**
 * ProfileManager - Handles all profile-related operations
 */
class ProfileManager {
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

      const cleanedName = cleanName(profileName);
      
      if (cleanedName !== profileName.trim().toLowerCase()) {
        console.log(chalk.yellow(`📝 Profile name cleaned: "${profileName}" → "${cleanedName}"`));
      }

      const config = await loadConfig();

      const existingProfile = config.profiles.find(p => p.name === cleanedName);
      if (existingProfile) {
        return { success: false, message: `Profile "${cleanedName}" already exists` };
      }

      const newProfile = {
        id: generateId('prof'),
        name: cleanedName,
        created: new Date().toISOString()
      };

      config.profiles.push(newProfile);

      const isFirstProfile = config.profiles.length === 1;
      if (isFirstProfile) {
        config.activeProfile = cleanedName;
      }

      await saveConfig(config);

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
      const config = await loadConfig();
      
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

      const cleanedName = cleanName(profileName);
      const config = await loadConfig();

      if (config.activeProfile === cleanedName) {
        return { success: false, message: `Already on profile "${cleanedName}"` };
      } else if (!config.profiles.find(profile => profile.name === cleanedName)) {
        return { success: false, message: `Profile "${cleanedName}" does not exist` };
      } else {
        config.activeProfile = cleanedName;
        await saveConfig(config);
        return { success: true, profileName: cleanedName };
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
      const cleanedName = cleanName(profileName);
      const config = await loadConfig();

      if (!config.profiles.find(profile => profile.name === cleanedName)) {
        return { success: false, message: `Profile "${cleanedName}" does not exist` };
      } else {
        const profiles = config.profiles;
        const index = profiles.findIndex(profiles => profiles.name === cleanedName);

        if (index !== -1) {
          config.profiles.splice(index, 1);
        }

        if (config.activeProfile === cleanedName) {
          if (config.profiles.length > 0) {
            config.activeProfile = config.profiles[0].name;
            activeProfileChanged = true;
            activeProfile = config.activeProfile;
          } else {
            config.activeProfile = null;
            activeProfileChanged = true;
          }
        }

        await saveConfig(config);
        return { 
          success: true, 
          removedProfile: cleanedName,
          activeProfileChanged: activeProfileChanged, 
          activeProfile: activeProfile 
        };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default ProfileManager;