---
title: Why I containerize everything, even static sites
date: 2026-07-02
excerpt: Reproducible builds, painless rollbacks, and one mental model for every deploy.
category: DevOps
tags:
  - Docker
  - DevOps
draft: false
---

A static site doesn't need a container to run. But it does benefit from one to ship.

A container gives me the same build and serve story for every project: a pinned environment, a single artifact, and a rollback that's just running the previous image. No "works on my machine" and no guessing which server has which version.

For a static site the container is tiny: a build stage, a web server, and the compiled files. The payoff isn't performance — it's that deployments become boring, and boring is the goal.
