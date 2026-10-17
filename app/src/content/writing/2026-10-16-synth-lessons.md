---
title: "When the filter knob moves on its own"
date: 2026-10-16
summary: "A little OP-XY browser companion that started with one question: what if I could see the filter knob move?"
deck: "Envelope filters clicked when I imagined an invisible hand moving the cutoff knob while a note plays."
thumbnail: "/synth-lessons-thumbnail.webp"
topics:
  - Music
  - Creative coding
  - Web Audio
draft: false
---

I couldn't quite get the filter envelope on my OP-XY to click. Then I pictured an invisible hand moving the cutoff knob while a note plays, and suddenly I had something I could follow.

Turn the cutoff knob and the tone changes right away. An envelope moves that same knob for you over time: it opens, settles, holds, and returns. Attack, decay, sustain, and release shape the motion; envelope amount decides how far the knob travels.

I made this browser companion to see and hear that relationship together. In the filter lesson, the cutoff movement sits next to the ADSR shape, and you can play a note to watch and listen as they move together. That was the little idea that got me going.

![A screen recording of the filter envelope lesson, showing the cutoff and envelope curves move together as a note plays.](/synth-lessons-demo.gif)

<figure class="synth-demo">
  <iframe src="https://willchavez.github.io/synth-lessons/" title="Interactive OP-XY synthesis lessons" loading="lazy" allow="autoplay"></iframe>
  <figcaption>Open “02 filter envelope” in the lesson tabs to try the idea that started the project.</figcaption>
</figure>

Once that started making sense, I added lessons on the amp envelope and LFO, then built a playground to try the pieces together: a waveform, a filter, two ADSR envelopes, and an LFO you can send to the filter, volume, or pitch. There’s a touch-friendly keyboard, a few starter sounds, and live graphs so you can see what’s happening as you play.

<p class="synth-project-links"><a href="https://willchavez.github.io/synth-lessons/demo.html" target="_blank" rel="noreferrer">Open the full synth playground <svg class="icon-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></a><a href="https://github.com/willchavez/synth-lessons" target="_blank" rel="noreferrer">Browse the code on GitHub <svg class="icon-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></a></p>

It’s a small learning project built with HTML, CSS, JavaScript, and the Web Audio API. The filters are simplified models, so this won’t sound exactly like the OP-XY. That’s okay: I mainly wanted a place to poke at the pieces and make them a little less mysterious. I’m still tinkering with the lessons and the instrument.
