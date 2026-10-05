import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query and re-renders when it flips.
 *
 * The scroll choreography uses this to decide whether a scene is allowed to
 * pin: a pinned stage is exactly one viewport tall, so it only works where the
 * content underneath actually fits in one. Everywhere else the same scene runs
 * as plain scroll-linked parallax.
 */
export function useMediaQuery(query) {
    const get = () =>
        typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia(query).matches
            : false;

    const [matches, setMatches] = useState(get);

    useEffect(() => {
        if (typeof window.matchMedia !== 'function') return undefined;
        const mql = window.matchMedia(query);
        const onChange = () => setMatches(mql.matches);
        onChange();
        mql.addEventListener('change', onChange);
        return () => mql.removeEventListener('change', onChange);
    }, [query]);

    return matches;
}

/** Visitors who asked the OS for less motion get static layouts. */
export const usePrefersReducedMotion = () =>
    useMediaQuery('(prefers-reduced-motion: reduce)');

/**
 * True where a pinned (sticky, one-viewport) scene has room to breathe.
 * Kept in one place so every pinned scene shares the same rule (and the
 * reduced-motion opt-out); a scene with bigger content passes a larger size.
 */
export const useCanPin = (minWidth = 768, minHeight = 640) => {
    const fits = useMediaQuery(`(min-width: ${minWidth}px) and (min-height: ${minHeight}px)`);
    const reduced = usePrefersReducedMotion();
    return fits && !reduced;
};
