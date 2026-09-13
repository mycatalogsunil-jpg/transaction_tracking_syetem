import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async ({
  userId,
  action,
  entityType = null,
  entityId = null,
  details = "",
}) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      entityType,
      entityId,
      details,
    });
  } catch (error) {
    console.error("Activity log failed:", error.message);
  }
};
