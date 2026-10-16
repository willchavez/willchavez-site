import test from "node:test";
import assert from "node:assert/strict";
import { createHoverNav } from "../src/lib/hover-nav.mjs";

function fixture() {
  let now = 0, next = 0;
  const timers = new Map(), changes = [];
  const clock = {
    now: () => now,
    set(callback, delay) { const id = ++next; timers.set(id, { at: now + delay, callback }); return id; },
    clear(id) { timers.delete(id); },
  };
  const nav = createHoverNav((expanded) => changes.push([now, expanded]), clock);
  const tick = (duration) => {
    const end = now + duration;
    while (true) {
      const pending = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
      if (!pending) break;
      timers.delete(pending[0]);
      now = pending[1].at;
      pending[1].callback();
    }
    now = end;
  };
  return { nav, tick, changes };
}

test("a quick fly-by never starts expanding", () => {
  const { nav, tick, changes } = fixture();
  nav.enter(); tick(119); nav.leave(); tick(1000);
  assert.deepEqual(changes, []);
});

test("a committed opening finishes before an early departure closes it", () => {
  const { nav, tick, changes } = fixture();
  nav.enter(); tick(120); tick(10); nav.leave(); tick(389);
  assert.deepEqual(changes, [[120, true]]);
  tick(1);
  assert.deepEqual(changes, [[120, true], [520, false]]);
});

test("re-entry cancels the closing grace period", () => {
  const { nav, tick, changes } = fixture();
  nav.enter(); tick(700); nav.leave(); tick(200); nav.enter(); tick(500);
  assert.deepEqual(changes, [[120, true]]);
  nav.leave(); tick(299);
  assert.deepEqual(changes, [[120, true]]);
  tick(1);
  assert.deepEqual(changes.at(-1), [1700, false]);
});

test("re-entry during a closing animation reopens immediately", () => {
  const { nav, tick, changes } = fixture();
  nav.enter(); tick(700); nav.leave(); tick(300); tick(50); nav.enter();
  assert.deepEqual(changes, [[120, true], [1000, false], [1050, true]]);
});

test("keyboard focus opens immediately and survives pointer departure", () => {
  const { nav, tick, changes } = fixture();
  nav.enter(); tick(20); nav.focus(); nav.leave(); tick(1000);
  assert.deepEqual(changes, [[20, true]]);
  nav.blur(); tick(300);
  assert.deepEqual(changes.at(-1), [1320, false]);
});

test("reset cancels pending hover work and restores the opening delay", () => {
  const { nav, tick, changes } = fixture();
  nav.enter(); tick(30); nav.reset(); tick(1000);
  assert.deepEqual(changes, [[30, false]]);
  nav.enter(); tick(119);
  assert.equal(changes.length, 1);
  tick(1);
  assert.deepEqual(changes.at(-1), [1150, true]);
});
