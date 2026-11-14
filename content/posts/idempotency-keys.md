---
title: Idempotency keys, explained with coffee
date: 2026-09-28
excerpt: Why retrying a payment should never charge twice — and how to design the API so it can't.
category: Backend
tags:
  - APIs
  - Reliability
draft: false
---

If a request times out, the client doesn't know whether it succeeded. So it retries. If the server isn't careful, that retry charges the customer twice.

An idempotency key fixes this. The client sends a unique key with the request; the server remembers the result for that key and returns the same result on any retry.

The important part is where the key is stored and when it's written. The cleanest pattern is to insert the key and begin the work in a single transaction, then store the outcome against the key. A retry that arrives mid-flight should wait or return "in progress," never do the work again.

Coffee shops solve this the same way: your order number. Say it twice and you still get one coffee — the barista already has it on the list.
