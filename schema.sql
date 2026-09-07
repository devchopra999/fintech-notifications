-- fintech-notifications schema (notification_db)
CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  event_type VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  channel ENUM('IN_APP','EMAIL','SMS') NOT NULL DEFAULT 'IN_APP',
  status ENUM('PENDING','SENT','FAILED') NOT NULL DEFAULT 'SENT',
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  data JSON,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notifications_user (user_id, is_read)
);
