---
title: "Running Postgres on a free-tier VM: what I learned"
date: 2026-08-15
excerpt: Backups, connections, and the settings that matter when you're the only DBA.
category: Databases
tags:
  - PostgreSQL
  - Self-hosting
draft: false
---

Running Postgres on a small VM is entirely reasonable for side projects — as long as you respect a few things that managed databases usually do for you.

Backups first. A nightly `pg_dump` to object storage, plus a restore you have actually tested, removes most of the anxiety. A backup you've never restored is a hope, not a backup.

Then connections. The default max connections is generous relative to a tiny VM's memory, and every connection has a cost. Put PgBouncer in front or keep pools small.

Finally, memory. Tune `shared_buffers` and `work_mem` to the VM, not to a blog post. Watch for swap; if you're swapping, the database is telling you something.
