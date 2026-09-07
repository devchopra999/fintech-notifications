# Demo scenario: unbounded in-memory log causes a slow memory leak

## Symptom

`fintech-notifications`' memory usage climbs monotonically over time and never comes back down,
correlated with the volume of `GET /notification/api/v1/user/:userId` calls - eventually the
container gets OOM-killed under sustained traffic.

## Root cause

`src/routes/notifications.js` keeps a module-level `recentQueryLog` array and pushes one entry into
it on every call to `GET /notification/api/v1/user/:userId`, with no cap, TTL, or trimming. The
array - and everything referenced inside each entry - is retained for the lifetime of the process.

## Repro

```bash
# baseline memory
curl -s "http://localhost:3000/environments/env-abc123/services/notifications/metrics"

# hammer the endpoint
for i in $(seq 1 5000); do
  curl -s "http://fintech-notifications:4004/notification/api/v1/user/$USER_ID" > /dev/null
done

# memory has grown and does not shrink back afterward, even once traffic stops
curl -s "http://localhost:3000/environments/env-abc123/services/notifications/metrics?duration=20&interval=5"
```

## Fix

Remove `recentQueryLog` entirely (or cap it to a fixed size / TTL and evict old entries) - see
`main`, which does not keep any per-request in-memory log.
