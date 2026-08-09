/**
 * Section resolution and commit — spec §4.2 / §4.3.
 *
 * IntersectionObserver only; no scroll events (§12). One observer over all
 * [data-narrate] elements.
 *
 * The commit rule is the heart of the feature:
 *   a candidate becomes committed only when it has been the candidate
 *   continuously for SETTLE_MS, AND velocity < FAST_SCROLL, AND it differs
 *   from the current committed section.
 *
 * NEVER QUEUE (§4.3). Sections that fly past during a fast scroll simply never
 * become the candidate for long enough, so they are never committed and never
 * speak. There is no pending list anywhere in this file by design.
 */
import { useEffect, useRef, useState } from 'react';
import {
  OBSERVER_THRESHOLDS,
  OBSERVER_ROOT_MARGIN,
  SETTLE_MS,
  FAST_SCROLL,
} from './config';
import { SECTION_IDS } from './data/narrationScript';

const orderOf = (id) => SECTION_IDS.indexOf(id);

/**
 * Highest intersection ratio wins. Ties are broken by scroll direction so that
 * reversing feels correct instead of sticky (§4.2).
 * @param {Map<string, number>} ratios
 * @param {'down'|'up'|'idle'} direction
 * @returns {string | null}
 */
export function pickCandidate(ratios, direction) {
  let best = null;
  let bestRatio = 0;

  for (const [id, ratio] of ratios) {
    if (ratio <= 0) continue;

    if (best === null || ratio > bestRatio + 0.01) {
      best = id;
      bestRatio = ratio;
      continue;
    }

    // Within epsilon => a tie. Direction decides.
    if (Math.abs(ratio - bestRatio) <= 0.01) {
      const preferLater = direction === 'down';
      const challengerIsLater = orderOf(id) > orderOf(best);
      if (preferLater ? challengerIsLater : !challengerIsLater) {
        best = id;
        bestRatio = Math.max(bestRatio, ratio);
      }
    }
  }

  return best;
}

/**
 * @param {React.MutableRefObject<import('./useScrollTracker').ScrollState>} scrollRef
 * @param {{ enabled?: boolean }} [options]
 */
export function useActiveNarrationSection(scrollRef, { enabled = true } = {}) {
  const [committedId, setCommittedId] = useState(null);
  const [candidateId, setCandidateId] = useState(null);

  // Live data for the debug overlay; deliberately not state.
  const ratiosRef = useRef(/** @type {Map<string, number>} */ (new Map()));
  const committedRef = useRef(null);
  const suppressedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const ratios = ratiosRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('data-narrate');
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
      },
      {
        threshold: OBSERVER_THRESHOLDS,
        rootMargin: OBSERVER_ROOT_MARGIN,
      },
    );

    const targets = document.querySelectorAll('[data-narrate]');
    targets.forEach((el) => observer.observe(el));

    // --- commit loop ---------------------------------------------------------
    // Runs on rAF because the rule depends on elapsed time and live velocity,
    // neither of which the observer callback knows about.
    let rafId = 0;
    let trackedCandidate = null;
    let candidateSince = performance.now();

    const tick = () => {
      const now = performance.now();
      const { velocity, direction } = scrollRef.current;
      const candidate = pickCandidate(ratios, direction);

      if (candidate !== trackedCandidate) {
        trackedCandidate = candidate;
        candidateSince = now;
        setCandidateId(candidate);
      }

      const heldLongEnough = now - candidateSince >= SETTLE_MS;
      const slowEnough = velocity < FAST_SCROLL;

      // Recorded purely so the debug overlay can explain *why* nothing spoke.
      suppressedRef.current = !slowEnough;

      if (
        candidate &&
        heldLongEnough &&
        slowEnough &&
        candidate !== committedRef.current
      ) {
        committedRef.current = candidate;
        setCommittedId(candidate);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(rafId);
      ratios.clear();
    };
  }, [enabled, scrollRef]);

  return { committedId, candidateId, ratiosRef, suppressedRef };
}
