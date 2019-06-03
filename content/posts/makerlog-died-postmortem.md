---
title: "Postmortem: June 3, 2019 Incident"
date: 2019-06-03T05:34:36-04:00
tags: []
categories: []

draft: false
tagline: ""
cover: ""
---

### What happened?
Makerlog was down for a couple of hours because the SSL certificate expired while I was asleep.

### Why did it happen?
I forgot to set the cron job to auto-renew the certificate.

### What steps did I take to prevent this?
I set the cronjob and renewed the certificate (revoke & renew on Dokku).

### What did I learn?
Never sleep.

