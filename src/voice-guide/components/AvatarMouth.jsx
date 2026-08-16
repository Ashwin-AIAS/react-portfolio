/**
 * Amplitude-driven mouth overlay — spec §6.1.
 *
 * The avatar is a single static PNG (see DISCOVERY.md §2), so this is the
 * "overlay an SVG mouth" branch. It sits in a shared positioned wrapper with
 * the avatar image and is positioned in percentages, so it scales with the
 * avatar at every breakpoint.
 *
 * Nothing here re-renders while speaking. The mouth, glow and bob all read the
 * --vg-level CSS custom property that the engine writes each frame.
 */
import React from 'react';

/**
 * @param {Object} props
 * @param {boolean} [props.active]  dim the whole overlay when not speaking
 * @param {string}  [props.className]
 */
export const AvatarMouth = ({ active = false, className = '' }) => (
  <div
    className={`vg-mouth-layer ${active ? 'vg-mouth-active' : ''} ${className}`}
    aria-hidden="true"
  >
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="vg-mouth-svg"
      focusable="false"
    >
      {/* Dark mouth cavity. scaleY is driven from --vg-level via CSS. */}
      <g className="vg-mouth-group">
        <ellipse cx="50" cy="50" rx="26" ry="20" className="vg-mouth-cavity" />
        <ellipse cx="50" cy="66" rx="14" ry="9" className="vg-mouth-tongue" />
      </g>
    </svg>
  </div>
);
