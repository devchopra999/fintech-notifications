const express = require('express');
const { z } = require('zod');
const { Notification } = require('../models/notification');

const router = express.Router();

const createSchema = z.object({
  userId: z.string().uuid().optional(),
  eventType: z.string().min(1),
  message: z.string().min(1),
  data: z.record(z.any()).optional()
});

// called internally by other services (fintech-ledger, fintech-payments) - best effort, no auth
router.post('/notifications', async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    const notification = await Notification.create({
      userId: body.userId || null,
      eventType: body.eventType,
      message: body.message,
      data: body.data || null
    });
    res.status(201).json({ notification });
  } catch (err) {
    next(err);
  }
});

router.get('/notification/api/v1/user/:userId', async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.params.userId },
      order: [['createdAt', 'DESC']]
    });
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
});

router.get('/notification/api/v1/user/:userId/unread-count', async (req, res, next) => {
  try {
    const count = await Notification.count({ where: { userId: req.params.userId, isRead: false } });
    res.json({ userId: req.params.userId, unreadCount: count });
  } catch (err) {
    next(err);
  }
});

router.patch('/notification/api/v1/:id/read', async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: { code: 'NOTIFICATION_NOT_FOUND', message: 'notification not found' } });
    notification.isRead = true;
    await notification.save();
    res.json({ notification });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
