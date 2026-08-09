/**
 * Scroll tracking — spec §4.1.
 *
 * A single requestAnimationFrame loop samples window.scrollY. No `scroll` event
 * listeners with heavy work (§12).
 *
 * The values are kept in a ref, not state: they change every frame and nothing
 * should re-render at 60fps because of them. Consumers that need to react to a
 * *derived* change (e.g. the commit logic) read the ref inside their own loop.
 */
import { useEffect, useRef } from 'react';
import {
  VELOCITY_SMOOTHING,
  DIRECTION_DEADZONE_PX,
  IDLE_AFTER_MS,
  SETTLED_VELOCITY,
  SETTLE_MS,
} from './config';

/**
 * @typedef {Object} ScrollState
 * @property {number} scrollY
 * @property {number} velocity   px/s, exponential moving average of |dy|/dt
 * @property {'down'|'up'|'idle'} direction
 * @property {boolean} isSettled velocity < SETTLED_VELOCITY for >= SETTLE_MS
 */

/** @returns {React.MutableRefObject<ScrollState>} */
export function useScrollTracker() {
  const state = useRef(
    /** @type {ScrollState} */ ({
      scrollY: 0,
      velocity: 0,
      direction: 'idle',
      isSettled: true,
    }),
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let rafId = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    // Anchor for the deadzone: direction only flips once we've moved far enough
    // from the point where we last changed our mind. Without this, trackpad
    // jitter of 1-2px flips direction every frame.
    let deadzoneAnchor = lastY;
    let lastMoveT = lastT;
    let settledSince = lastT;

    state.current.scrollY = lastY;

    const tick = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = now - lastT;

      // Guard against a zero/negative dt (can happen after tab restore).
      if (dt > 0) {
        const dy = y - lastY;
        const instant = (Math.abs(dy) / dt) * 1000; // px/s

        // EMA. Smoothing factor is the weight of the *new* sample.
        const v =
          state.current.velocity +
          VELOCITY_SMOOTHING * (instant - state.current.velocity);
        state.current.velocity = v;

        if (Math.abs(dy) > 0.5) lastMoveT = now;

        // Direction with a deadzone measured from the anchor, not frame-to-frame.
        const fromAnchor = y - deadzoneAnchor;
        if (fromAnchor > DIRECTION_DEADZONE_PX) {
          state.current.direction = 'down';
          deadzoneAnchor = y;
        } else if (fromAnchor < -DIRECTION_DEADZONE_PX) {
          state.current.direction = 'up';
          deadzoneAnchor = y;
        } else if (now - lastMoveT > IDLE_AFTER_MS) {
          state.current.direction = 'idle';
          deadzoneAnchor = y;
        }

        // isSettled: continuously below the threshold for at least SETTLE_MS.
        if (v >= SETTLED_VELOCITY) {
          settledSince = now;
          state.current.isSettled = false;
        } else {
          state.current.isSettled = now - settledSince >= SETTLE_MS;
        }

        state.current.scrollY = y;
        lastY = y;
        lastT = now;
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return state;
}
