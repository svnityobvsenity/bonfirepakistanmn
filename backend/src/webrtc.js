const logger = require('./logger');

/**
 * WebRTC helper functions for managing peer connections and signaling
 * This implements a mesh topology where each client connects to every other client
 * 
 * Mesh limitations: N*(N-1)/2 connections total
 * - Works well for small groups (2-6 participants)
 * - CPU and bandwidth usage grows quadratically
 * - For larger groups, consider SFU (Selective Forwarding Unit) like mediasoup
 */

class WebRTCManager {
  constructor() {
    // Track voice participants per room
    // Format: { roomId: Set<socketId> }
    this.voiceParticipants = new Map();
  }

  /**
   * Add a user to voice chat in a room
   * @param {string} roomId - Room identifier
   * @param {string} socketId - Socket identifier
   * @returns {Array} List of existing participant socket IDs
   */
  joinVoice(roomId, socketId) {
    if (!this.voiceParticipants.has(roomId)) {
      this.voiceParticipants.set(roomId, new Set());
    }

    const participants = this.voiceParticipants.get(roomId);
    const existingParticipants = Array.from(participants);
    
    participants.add(socketId);
    
    logger.info(`User ${socketId} joined voice in room ${roomId}. Total participants: ${participants.size}`);
    
    return existingParticipants;
  }

  /**
   * Remove a user from voice chat in a room
   * @param {string} roomId - Room identifier  
   * @param {string} socketId - Socket identifier
   * @returns {Array} List of remaining participant socket IDs
   */
  leaveVoice(roomId, socketId) {
    if (!this.voiceParticipants.has(roomId)) {
      return [];
    }

    const participants = this.voiceParticipants.get(roomId);
    participants.delete(socketId);
    
    // Clean up empty rooms
    if (participants.size === 0) {
      this.voiceParticipants.delete(roomId);
    }
    
    logger.info(`User ${socketId} left voice in room ${roomId}. Remaining participants: ${participants.size}`);
    
    return Array.from(participants);
  }

  /**
   * Get voice participants for a room
   * @param {string} roomId - Room identifier
   * @returns {Array} List of participant socket IDs
   */
  getVoiceParticipants(roomId) {
    if (!this.voiceParticipants.has(roomId)) {
      return [];
    }
    return Array.from(this.voiceParticipants.get(roomId));
  }

  /**
   * Remove user from all voice rooms (cleanup on disconnect)
   * @param {string} socketId - Socket identifier
   * @returns {Array} List of affected room IDs
   */
  removeFromAllVoiceRooms(socketId) {
    const affectedRooms = [];
    
    for (const [roomId, participants] of this.voiceParticipants.entries()) {
      if (participants.has(socketId)) {
        participants.delete(socketId);
        affectedRooms.push(roomId);
        
        // Clean up empty rooms
        if (participants.size === 0) {
          this.voiceParticipants.delete(roomId);
        }
      }
    }
    
    if (affectedRooms.length > 0) {
      logger.info(`User ${socketId} removed from voice rooms: ${affectedRooms.join(', ')}`);
    }
    
    return affectedRooms;
  }

  /**
   * Get total number of voice participants across all rooms
   * @returns {number} Total participant count
   */
  getTotalVoiceParticipants() {
    let total = 0;
    for (const participants of this.voiceParticipants.values()) {
      total += participants.size;
    }
    return total;
  }

  /**
   * Get room statistics for monitoring
   * @returns {Object} Statistics object
   */
  getStats() {
    const stats = {
      totalRooms: this.voiceParticipants.size,
      totalParticipants: this.getTotalVoiceParticipants(),
      roomDetails: {}
    };

    for (const [roomId, participants] of this.voiceParticipants.entries()) {
      stats.roomDetails[roomId] = {
        participantCount: participants.size,
        participants: Array.from(participants)
      };
    }

    return stats;
  }
}

module.exports = WebRTCManager;

