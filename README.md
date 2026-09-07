# fintech-notifications

Notifications service - receives event webhooks from other services (`fintech-ledger`,
`fintech-payments`) and exposes them to end users.

## Endpoints

- `POST /notifications` (internal, service-to-service, no auth) `{ userId?, eventType, message, data? }`
- `GET /notification/api/v1/user/:userId` -> `{ notifications }`
- `GET /notification/api/v1/user/:userId/unread-count` -> `{ userId, unreadCount }`
- `PATCH /notification/api/v1/:id/read` -> `{ notification }`
- `GET /health`, `GET /health/ready`

## Config

See `.env.example`: `PORT`, `DATABASE_URL` (MySQL). No message broker - other services call this
service's HTTP API directly and best-effort (a failed call here never blocks the caller).
