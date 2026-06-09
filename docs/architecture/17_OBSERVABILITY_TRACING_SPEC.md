# Hatid Observability and Distributed Tracing Specification

Document ID: 17_OBSERVABILITY_TRACING_SPEC  
Status: Approved  
Scope: OpenTelemetry, traces, metrics, logs, SLOs, error budgets, incident observability

## Purpose

Hatid must be debuggable under distributed failure. A booking flow touches frontend, gateway, auth, workflow, dispatch, finance, outbox, and notifications. Without trace propagation, outages become guesswork.

OpenTelemetry is the standard instrumentation model.

## Required Context Fields

Every request, event, and background job must carry:

- `trace_id`
- `span_id`
- `correlation_id`
- `organization_id`
- `actor_id`
- `request_id`
- `idempotency_key` where applicable

## Trace Propagation

Required flow:

Frontend  
→ Cloudflare/API Gateway  
→ Supabase Edge Function  
→ Application Service  
→ Repository  
→ PostgreSQL  
→ Outbox  
→ Event Stream  
→ Consumer  
→ External Provider

Trace context must propagate across HTTP, background jobs, and event streams.

## Structured Logging

All logs must be JSON.

Required fields:

- timestamp
- level
- service
- bounded_context
- organization_id
- actor_id
- trace_id
- correlation_id
- event
- message

PII and secrets are forbidden in logs.

## Golden Signals

Each service must expose:

- latency
- traffic
- errors
- saturation

Domain metrics:

### Dispatch

- match latency
- offer timeout rate
- driver ACK latency
- no-driver rate
- GPS spoofing reject count

### Finance

- journal posting latency
- ledger imbalance attempts
- reconciliation exceptions
- payout failure rate
- chargeback count

### IAM

- login success/failure
- OTP failures
- suspicious login velocity
- token refresh failures

### Compliance

- AML alerts generated
- STR workflows opened
- KYC rejection rate
- DSAR/LER extraction count

## Initial SLOs

- API availability: 99.9% internal alpha, 99.95% production target
- trip request P95 latency: less than 800ms before dispatch queueing
- dispatch match P95: less than 2.5s under normal load
- ledger post P99: less than 800ms
- telemetry ingestion P99: less than 500ms
- admin portal P95: less than 1.5s

## Error Budgets

If error budget drops below 20%:

- new feature rollout requires engineering approval

If error budget reaches 0%:

- code freeze
- reliability work only
- postmortem required

## Alerting

SEV-1:

- ledger reconciliation fails
- journal imbalance detected
- dispatch match rate collapse
- database unavailable
- payment webhook failure spike
- auth outage
- admin privilege anomaly

SEV-2:

- high latency
- consumer lag
- elevated DLQ
- partial provider outage

## Health Checks

Every service must expose:

- liveness
- readiness
- dependency health
- version
- commit SHA

## Minimum Dashboards

- Executive overview
- Dispatch operations
- Finance and ledger
- Payment gateway and webhooks
- IAM and auth
- Compliance and AML
- Infrastructure
- Error budget
- Cost / FinOps

## Forbidden

Forbidden:

- plaintext logs with inconsistent fields
- logging passwords, OTPs, card data, tokens, or secret keys
- services without tracing
- background jobs without correlation IDs
- swallowed errors without log/metric
