import { Notification } from '../models/notificationModel.js';

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
