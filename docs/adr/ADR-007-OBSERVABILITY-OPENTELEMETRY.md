# ADR-007: Observability with OpenTelemetry

Status: Approved

## Decision

OpenTelemetry is the standard for tracing, logs, metrics, and trace context propagation.

## Consequences

All services must emit structured logs, traces, metrics, health checks, and carry trace/correlation IDs.
