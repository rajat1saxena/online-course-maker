import express from "express";
import { addMailJob, addNotificationJob } from "../domain/handler";
import { logger } from "../logger";
import { MailJob } from "../domain/model/mail-job";
import NotificationModel from "../domain/model/notification";
import { ObjectId } from "mongodb";

const router = express.Router();

router.post("/mail", async (req: express.Request, res: express.Response) => {
    try {
        const { to, from, subject, body } = req.body;
        MailJob.parse({ to, from, subject, body });

        await addMailJob({ to, from, subject, body });

        res.status(200).json({ message: "Success" });
    } catch (err: any) {
        logger.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post(
    "/notification",
    async (req: express.Request, res: express.Response) => {
        try {
            const {
                domain,
                userId,
                forUserIds,
                entityAction,
                entityId,
                entityTargetId,
                notificationId,
            } = req.body;

            for (const forUserId of forUserIds) {
                const notification = await NotificationModel.create({
                    domain: new ObjectId(domain),
                    userId,
                    forUserId,
                    entityAction,
                    entityId,
                    entityTargetId,
                });

                await addNotificationJob(notification);
            }

            res.status(200).json({ message: "Success" });
        } catch (err) {
            logger.error(err);
            res.status(500).json({ error: err.message });
        }
    },
);

export default router;
