---
title: 'A new, healthier chapter for Makerlog'
tagline: 'The streak productivity model deserves an upgrade, for our sakes.'
date: 2019-03-22T23:41:14.352Z
draft: true
categories:
  - makerlog
  - streak
  - health
tags:
  - makerlog
  - streak
  - health
keywords:
  - makerlog
  - streak
  - health
cover: /images/uploads/andreas-kind-311748-unsplash.jpg
---

Today I am proud to announce the launch of Makerlog Wellness, a small - yet huge - update I've been silently working on for the past few weeks. Much thought went into the process of creating this update, and after careful consideration (and tons of pain rewriting the streak algorithm)... It's finally available for end users!

Before I continue with the features, we must take a moment to discuss why this update was necessary - in other words, **how I discovered that the streak productivity model does not scale.**

### Humble beginnings

I am a huge fan of the streak. It's so simple, yet so effective - almost like a virtual trophy you get to show off as proof of your hard, hard work over a couple of months. I have a 200+ day streak on Makerlog, one I've been religiously keeping since it first launched on Product Hunt. 

Makerlog copied the streak model from WIP and Snapchat, adapting it for our own needs and specifications, but it mostly remained the same. The core concept is simple: the more consistent you are, the higher you rank. 

This model, paired with the indie hacker/maker's constant strive for productivity gains, worked out extremely well. However, we quickly discovered something.

In the heat of the shipping, we forgot we were human.

### Life happens

Eventually, I and many others began noticing a trend. Everywhere on Twitter we would find posts related to burnout. Ship rate was slowing down and the shipping frenzy stopped.

In retrospect, we probably went a little too hardcore...

So I got back to the drawing board.

### The streak model does not scale

Streaks work. They keep you accountable. Then this happens *(compliments to JS Paint for the excellent graphing capabilities)*.

![The streak model, demonstrated in a very amateur graph](https://i.imgur.com/iB6s6Ad.png)

It keeps us accountable, but doesn't account for the fact that humans need to take breaks! Our mind isn't constant like the streak. It deserves and requires downtime to stay in peak performance.

What happens is streaks provide the illusion of performance, when what's actually happening under the hood is a gradual decrease of it and of emotional state. 

Another problem is the proliferation of life-logs, a common complaint among Makerlog users. To keep their streak during resting time, many decide to log off-topic things. Which... can get annoying.

I can attest to this, and many other makers can. Over the course of my 200+ day streak, I've had several periods of burnout in which I just wanted to lay in bed but I had to log to keep the streak.

It's about time for a change.

### Evolving the streak model

Now that we know its defects, it's time to provide solutions. Makerlog's end goal is to **keep you productive**. So I, with feedback from the user base, went back to the drawing board.

Then I came across the first big question.

> How do we promote a healthy environment without devaluing the streak?

The value of the streak is the accountable bit, and allowing vacation days would simply destroy the model completely.

I came up with an interesting solution to this problem, taking into account a series of conversations on the Telegram group ([shameless plug, go join](t.me/makerlog)).

**I settled on the creation of two new tools: the rest day system, and weekend mode.**

![The streak and wellness page](https://i.imgur.com/IYgC6Ps.png)

### Rest days 

Rest days are the primary feature shipping with the new update. It involved rewriting the entire streak algorithm from scratch, to take into account the fact that we're humans! 

It works very simply: for every week of streak, you get 1 day to skip. 

These "skip" days aren't counted in your streak and they don't break it either - they don't affect it at all. Not even your Maker Score. There is no penalty for taking a skip day.

You'll be able to accumulate these days over several streaks and schedule everywhere from 1 to a whole year (that's one hell of a rest day balance, ha)!

### Weekend mode

Weekend mode is very simple: it essentially enables rest days for every Saturday and Sunday - so your streak simply skips these days as if they don't exist.

If this mode is enabled, weekends will be skipped and will not count for your streak. They won't break it either. 

You can finally take breaks on weekends without posting `rested #life` to keep your streak. 😁

### Concluding

Wellness matters. We aren't the machines we program on. We need to take care of ourselves, not just to stay in peak performance, but to *stay sane*.  

As I said previously, Makerlog's core goal is to keep you *productive*. It isn't to keep you logging every day, it isn't to keep you with a 200 day streak. 

It is to **help you stay productive**, and if this end goal requires evolving the streak, *I'm all for it*.

Because we're human after all.
