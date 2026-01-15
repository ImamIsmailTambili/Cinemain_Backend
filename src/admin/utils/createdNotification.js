import { prisma } from "../../config/db.js";

export const createNotification = async ({
    title,
    message,
    type,
    entity,
    entityId
}) => {
    await prisma.notification.create({
        data: {
            title,
            message,
            type,
            entity,
            entityId
        }
    });
};
