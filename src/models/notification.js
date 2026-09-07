const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Notification = sequelize.define('Notification', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
  eventType: { type: DataTypes.STRING, allowNull: false, field: 'event_type' },
  message: { type: DataTypes.TEXT, allowNull: false },
  channel: { type: DataTypes.ENUM('IN_APP', 'EMAIL', 'SMS'), allowNull: false, defaultValue: 'IN_APP' },
  status: { type: DataTypes.ENUM('PENDING', 'SENT', 'FAILED'), allowNull: false, defaultValue: 'SENT' },
  isRead: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_read' },
  data: { type: DataTypes.JSON, allowNull: true }
}, {
  tableName: 'notifications',
  underscored: true
});

module.exports = { Notification };
