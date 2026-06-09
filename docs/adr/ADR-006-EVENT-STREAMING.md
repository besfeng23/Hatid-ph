# ADR-006: Event Streaming

Status: Approved

## Decision

Hatid uses outbox-first event publishing and Redis Streams initially for queueing and telemetry. Kafka may be adopted later at high scale.

## Consequences

External side effects are decoupled from core transactions. DLQ and replay are mandatory.
