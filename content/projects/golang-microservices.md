---
title: Golang Microservices
description: Five services on gRPC + RabbitMQ with Docker Compose, Postgres/MongoDB, and centralized auth.
tags:
  - Golang
  - gRPC
  - Docker
link: https://github.com/gagan987123
image: ""
order: 2
---

A small distributed system built to explore service boundaries and messaging.
Five Go services communicate over gRPC and RabbitMQ, backed by PostgreSQL and
MongoDB, with a shared authentication layer.

Everything runs locally with Docker Compose so the full system can be started
with one command.
