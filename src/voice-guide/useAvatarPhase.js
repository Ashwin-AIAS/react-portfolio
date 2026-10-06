/**
 * Enter / stay / exit phases for the narrator avatar.
 *
 * Driven by the COMMITTED section (store `section`), never the raw scroll
 * position, so a fast flick through the page produces no phases at all: the
 * commit logic refuses to promote anything above FAST_SCROLL or before
 * SETTLE_MS. On a real section change the outgoing section exits in place, the
 * guide then moves and the new one enters.
 *
 * Quick switches change state smoothly rather than stacking animations:
 *  - a commit during `exit` retargets, so only the newest section enters;
 *  - a commit during `enter` swaps the section without replaying `exit`.
 *
 * Eager: AvatarGuide.jsx imports this directly, so it may only touch ./config.
 */
import { useEffect, useRef, useState } from 'react';
import { AVATAR_ENTER_MS, AVATAR_EXIT_MS, AVATAR_PHASE_SLOW } from './config';

// ?vgslow=1: the keyframes in voice-guide.css multiply every duration and
// delay by --vg-slow, matching the slowed timers above.
if (AVATAR_PHASE_SLOW !== 1 && typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--vg-slow', String(AVATAR_PHASE_SLOW));
}

/**
 * @param {string | null} section committed section id, null until the guide is ready
 * @param {string} persona active persona id; a switch replays `enter`
 * @returns {{ phase: 'enter' | 'stay' | 'exit', shownSection: string | null }}
 */
export function useAvatarPhase(section, persona) {
  const [phase, setPhase] = useState('stay');
  const [shownSection, setShownSection] = useState(null);
  // Mirrors of the state above, so the timers and effects below always act on
  // the current values rather than on whatever render scheduled them.
  const phaseRef = useRef('stay');
  const shownRef = useRef(null);
  const targetRef = useRef(null);
  const timerRef = useRef(0);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const go = (next) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const show = (id) => {
    shownRef.current = id;
    setShownSection(id);
  };
  const enter = () => {
    clearTimeout(timerRef.current);
    go('enter');
    timerRef.current = setTimeout(() => go('stay'), AVATAR_ENTER_MS);
  };

  useEffect(() => {
    if (!section) return;
    targetRef.current = section;

    if (shownRef.current === null) {
      show(section);
      enter();
      return;
    }
    // The pending exit timer reads targetRef, so the newest commit wins.
    if (phaseRef.current === 'exit') return;
    if (section === shownRef.current) return;
    if (phaseRef.current === 'enter') {
      show(section);
      return;
    }

    clearTimeout(timerRef.current);
    go('exit');
    timerRef.current = setTimeout(() => {
      show(targetRef.current);
      enter();
    }, AVATAR_EXIT_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- the helpers only touch refs and setters
  }, [section]);

  // A persona switch mounts a different visual: let it arrive with its own
  // enter. Skipped mid-exit, where an enter is already on its way.
  const lastPersonaRef = useRef(persona);
  useEffect(() => {
    if (persona === lastPersonaRef.current) return;
    lastPersonaRef.current = persona;
    if (shownRef.current !== null && phaseRef.current !== 'exit') enter();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- see above
  }, [persona]);

  return { phase, shownSection };
}
