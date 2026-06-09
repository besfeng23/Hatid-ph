# ADR-004: PostGIS for Geospatial Data

**Date:** 2023-10-27

**Status:** Approved

## Context

The Hatid platform is fundamentally based on location. We need to handle:

*   Driver locations
*   Pickup and drop-off coordinates
*   Service area geofencing
*   Calculating distances and ETAs
*   Finding drivers within a certain radius of a rider

Storing latitude and longitude as simple floating-point numbers in a standard table is inefficient and does not support the complex, indexed geospatial queries we require for a performant dispatch system.

## Decision

We will use the **PostGIS** extension for PostgreSQL to handle all geospatial data and queries.

This means:

1.  Enabling the `postgis` extension in our database.
2.  Using the `GEOGRAPHY` and `GEOMETRY` data types to store location data (e.g., `geography(Point, 4326)`).
3.  Creating spatial indexes (e.g., GIST) on all geospatial columns to ensure fast querying.
4.  Using PostGIS functions for all location-based calculations, such as:
    *   `ST_DWithin` (to find drivers within a radius)
    *   `ST_Distance` (to calculate distances)
    *   `ST_Intersects` (to check if a point is within a geofenced area)

## Consequences

*   **Benefits:**
    *   **High Performance:** Spatial indexes allow for extremely fast geospatial queries, which is critical for the dispatch engine.
    *   **Powerful Functionality:** PostGIS provides a vast library of functions for all conceivable geospatial operations.
    *   **Standardization:** It is the industry standard for storing and querying geospatial data in PostgreSQL.
    *   **Accuracy:** PostGIS correctly handles calculations on a sphere (with the `GEOGRAPHY` type), avoiding errors that come from simple Euclidean distance formulas.
*   **Costs:**
    *   Adds a dependency on a PostgreSQL extension.
    *   Requires developers to learn the specific PostGIS data types and functions.
    *   Geospatial queries can be complex to write and debug.
