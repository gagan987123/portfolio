---
title: Cutting my cloud bill with three boring changes
date: 2026-10-12
excerpt: No re-architecture, no Kubernetes migration — just lifecycle rules, right-sized instances, and deleting what nobody uses.
category: Cloud
tags:
  - AWS
  - Cost
draft: false
---

Every "reduce your cloud bill" post starts with a rewrite. This one doesn't. Over a weekend I cut a small production footprint by roughly 40% with changes my future self will thank me for: nothing clever, nothing that required a migration window.

## 1. Lifecycle rules on object storage

Backups and logs were accumulating forever because "disk is cheap." It isn't, once you're paying for egress, snapshots, and replicated copies of a bucket nobody reads.

A single lifecycle policy moved anything older than 30 days to cold storage, and expired anything older than a year. That change alone removed a surprising chunk of the bill and cost me about ten minutes.

```json
{
  "Rules": [{
    "ID": "expire-cold",
    "Filter": { "Prefix": "logs/" },
    "Status": "Enabled",
    "Transitions": [{ "Days": 30, "StorageClass": "GLACIER" }],
    "Expiration": { "Days": 365 }
  }]
}
```

## 2. Right-sizing, not re-architecting

I had one instance running at 8% average CPU because it was provisioned for a peak that happened once. Instead of moving to autoscaling groups, I resized it, kept a snapshot, and watched the metrics for a week.

> Measure before you optimize. The scariest-looking number is usually the one nobody has looked at.

The rule I now use: pick the smallest instance that keeps p95 latency flat, then leave headroom for one bad day — not one bad year.

## 3. Delete what nobody uses

Orphaned volumes, old load balancers, and three "temporary" NAT gateways from a hack week. None of these show up in a service dashboard, so they quietly bill forever.

- Tag everything at creation; untagged resources get reviewed monthly.
- Snapshot before deleting, then delete the snapshot a month later.
- Put the review on the calendar before the invoice arrives.

---

The lesson isn't "do these three things." It's that cost work is mostly *attention* work. Boring, scheduled, and unglamorous — the same qualities that make systems stay up.
