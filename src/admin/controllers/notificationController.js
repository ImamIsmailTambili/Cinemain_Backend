import { prisma } from "../../config/db.js";

const getNotifications = async (req, res) => {
    const notifications = await prisma.notification.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.status(200).json({
        status: "success",
        data: notifications
    })
}

const readNotification = async (req, res) => {
    const { id } = req.params;

    const notification = await prisma.notification.update({
        where: { id: Number(id) },
        data: { isRead: true }
    });

    res.status(200).json({
        status: "success",
        data: notification
    })
}
export { getNotifications, readNotification };