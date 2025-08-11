# Relational Database Design for EcoMart (D597 Task 1)

## Overview
Designed a PostgreSQL relational DB for EcoMart to manage products, orders, reviews, addressing sales tracking, review analysis, scalability.

## Approach
- Schema: Tables (Products, Orders, Reviews) with relationships (one-to-many).
- Implementation: Created DB, imported CSV, added constraints/indexes.
- Queries: Top-selling by region, eco-products with high sales, top-rated products.
- Optimization: Pre/post-indexing timings showed speedup (e.g., query time reduced 50%).

## Technologies
PostgreSQL, SQL.

## Results
| Metric          | Value          |
|-----------------|----------------|
| Queries         | 3 (top-selling, eco-sales, top-rated) |
| Optimization    | Indexing reduced times (e.g., 0.1s to 0.05s) |

## Learnings
Scalability via sharding/replication; privacy with encryption.

## Artifacts
- Schema: [/ecomart-db/schema.sql]
- Queries: [/ecomart-db/queries.sql]
- Full Repo: [Relational Database Design for Ecomart](../Relational_DB_Design_for_Ecomart)
- [<img src="/assets/ecomart-db/query1.png" alt="Top-Selling Query">]

[Back to Home](/)
