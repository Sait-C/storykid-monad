class ProgressService {
  constructor(io) {
    this.io = io;
  }

  /**
   * Create a progress tracker for a specific process
   * @param {string} processId - Unique identifier for the process (e.g., storyId, storyPartId)
   * @param {string} processType - Type of process (e.g., 'story', 'storyPart')
   * @returns {Object} - Progress tracker methods
   */
  createProgressTracker(processId, processType) {
    const channel = `progress:${processType}:${processId}`;
    
    return {
      /**
       * Update progress status
       * @param {string} status - Current status message
       * @param {number} progress - Progress percentage (0-100)
       * @param {Object} [additionalData] - Any additional data to send
       */
      update: (status, progress = 0, additionalData = {}) => {
        this.io.emit(channel, {
          status,
          progress,
          ...additionalData,
          timestamp: new Date()
        });
      },

      /**
       * Send error message
       * @param {string} error - Error message
       * @param {Object} [additionalData] - Any additional error details
       */
      error: (error, additionalData = {}) => {
        this.io.emit(`${channel}:error`, {
          error,
          ...additionalData,
          timestamp: new Date()
        });
      },

      /**
       * Send completion message
       * @param {Object} data - The final data
       * @param {Object} [additionalData] - Any additional completion details
       */
      complete: (data, additionalData = {}) => {
        this.io.emit(`${channel}:complete`, {
          data,
          ...additionalData,
          timestamp: new Date()
        });
      }
    };
  }
}

module.exports = ProgressService; 