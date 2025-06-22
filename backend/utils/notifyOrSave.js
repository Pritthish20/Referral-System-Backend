import { Notification } from '../models/notificationModel.js';

/**
 * Emits a socket event if the user is online; otherwise stores a notification in DB.
 *
 * @param {Object} params
 * @param {Object} params.io - Socket.io instance
 * @param {String} params.userId - User's ID to notify
 * @param {String} params.event - Socket event name (e.g., 'earningsUpdate', 'newReferral')
 * @param {String} params.type - Notification type ('earning', 'referral', etc.)
 * @param {String} params.message - Fallback message to save in DB
 * @param {Object} params.data - Additional data to send with socket or store in DB
 */
export const notifyOrSave = async ({ io, userId, event, type, message, data }) => {
  const room = io.sockets.adapter.rooms.get(userId.toString());

  if (room && room.size > 0) {
    io.to(userId.toString()).emit(event, data);
  } else {
    await Notification.create({
      userId,
      type,
      message,
      data,
    });
  }
};
