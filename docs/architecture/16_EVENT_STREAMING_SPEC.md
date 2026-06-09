# Hatid Event Streaming Specification

Document ID: 16_EVENT_STREAMING_SPEC  
Status: Approved  
Scope: Redis Streams, Kafka migration path, outbox processing, dispatch telemetry, DLQ, replay, backpressure

## Purpose

Hatid uses event streaming to decouple high-throughput workloads from PostgreSQL, protect the database from spikes, and process asynchronous work reliably.

PostgreSQL remains the source of truth for durable business state. Streams are used for telemetry, dispatch queueing, outbox delivery, asynchronous notifications, retries, analytics ingestion, and compliance monitoring.

## Event Layers

### Database Outbox

Primary table:

- `integration.outbox_events`

Purpose:

- durable event emission after transactional state change
- retryable external delivery
- no ghost events

### Stream Layer

Initial implementation:

- Redis Streams

Growth path:

- Kafka or managed Kafka-compatible platform

Kafka is a future scaling option, not Sprint 0 scope.

## Required Streams

### `telemetry.ingress`

Driver GPS pings enter here before database writes.

Rules:

- batch pings
- validate speed and spoofing
- persist only useful/latest location state
- route invalid pings to DLQ

### `dispatch.requests`

Trip requests enter the dispatch matching pipeline.

Rules:

- controlled consumer concurrency
- queue depth monitoring
- backpressure activation under stress

### `dispatch.offers`

Tracks offer lifecycle and TTL.

Rules:

- offer sent
- driver ACK required
- accept/decline/timeout recorded
- timeout returns to cascade

### `dispatch.dlq`

Failed dispatch messages.

Rules:

- message goes to DLQ after retry exhaustion
- replay requires explicit operator action
- DLQ depth alert threshold starts at 50

### `integration.outbox.delivery`

Outbox processor publishes durable integration events.

Rules:

- retry with exponential backoff
- idempotency key required
- poison messages routed to DLQ

## Backpressure

If queue depth exceeds limits:

- API gateway may return `429 Too Many Requests`
- booking attempts receive retry-after guidance
- non-critical telemetry may be sampled
- database writes are protected

Initial thresholds:

- `dispatch.requests` > 5,000 pending: throttle new bookings
- `telemetry.ingress` > 100,000 pending: downgrade idle driver ping frequency
- `dispatch.dlq` > 50: page engineering

## Event Naming

Pattern:

`hatid.{bounded_context}.{event_name}.v{version}`

Examples:

- `hatid.dispatch.trip_requested.v1`
- `hatid.finance.journal_posted.v1`
- `hatid.workflow.transition_completed.v1`
- `hatid.compliance.aml_alert_created.v1`

Breaking changes require a new event version.

## Required Event Envelope

Every event must contain:

- `event_id`
- `event_name`
- `event_version`
- `organization_id`
- `actor_id`
- `correlation_id`
- `trace_id`
- `occurred_at`
- `payload`

## Forbidden Patterns

Forbidden:

- direct provider call inside critical database transaction
- unversioned events
- events without `organization_id`
- unbounded consumer concurrency
- silently dropping failed events
- writing every high-frequency telemetry ping directly to PostgreSQL
