---
title: "When the filter knob moves on its own"
date: 2026-10-16
summary: "I had a hard time understanding envelope filters on the OP-XY until I pictured one as the cutoff knob moving over time."
deck: "An envelope makes the filter cutoff move for you, shaped by attack, decay, sustain, and release."
thumbnail: "/synth-lessons-thumbnail.webp"
topics:
  - Music
  - Creative coding
  - Web Audio
draft: false
---

I had a hard time understanding the filter envelope on my OP-XY. What finally helped was picturing it as the filter cutoff knob moving for me while a note plays.

Turning the cutoff knob changes the tone right away. A filter envelope moves that same cutoff automatically over time: it opens, settles, holds, and returns. Attack, decay, sustain, and release shape that motion; envelope amount controls how far the cutoff travels.

I started building this browser companion to make that relationship easier to see and hear. The filter envelope lesson shows the cutoff movement alongside the ADSR shape, and lets you play a note to hear the two move together.

![A screen recording of the filter envelope lesson, showing the cutoff and envelope curves move together as a note plays.](/synth-lessons-demo.gif)

<figure class="synth-demo">
  <iframe src="https://willchavez.github.io/synth-lessons/" title="Interactive OP-XY synthesis lessons" loading="lazy" allow="autoplay"></iframe>
  <figcaption>Open “02 filter envelope” in the lesson tabs to try the idea that started the project.</figcaption>
</figure>

From there, I added lessons on the amp envelope and LFO, then a playground that brings the pieces together: a waveform, a filter, two ADSR envelopes, and an LFO you can send to the filter, volume, or pitch. It has a touch-friendly keyboard, a few starter sounds, and live graphs for the different parts of the signal.

<p class="synth-project-links"><a href="https://willchavez.github.io/synth-lessons/demo.html" target="_blank" rel="noreferrer">Open the full synth playground <svg class="icon-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></a><a href="https://github.com/willchavez/synth-lessons" target="_blank" rel="noreferrer">Browse the code on GitHub <svg class="icon-arrow" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M5 4h7v7" /></svg></a></p>

The project is plain HTML, CSS, and JavaScript, with no dependencies or build step. The audio uses the Web Audio API and an AudioWorklet. It’s a learning companion, not an OP-XY emulator: the SVF and ladder filters are simplified models, so they won’t sound exactly like the hardware. I’m still shaping the lessons and the instrument around them.
