/**
 * Persona-aware avatar — personas spec §3.3.
 *
 * One switch for the three narrators: the Autobot crest, the arc-reactor HUD,
 * or the original memoji. Only the memoji branch uses AvatarMouth — the other
 * two carry their own amplitude-driven "mouth" (the grille, the reactor core).
 *
 * Eager: AvatarGuide.jsx imports this directly, so nothing here may reach the
 * engine, the sources or the narration scripts (§8). ../config is pure
 * constants, which is why DEFAULT_PERSONA can come from there.
 */
import React from 'react';
import avatarEmoji from '/avatar-emoji.png';
import { DEFAULT_PERSONA } from '../config';
import { OptimusAvatarVisual } from './OptimusAvatarVisual';
import { JarvisAvatarVisual } from './JarvisAvatarVisual';
import { AvatarMouth } from './AvatarMouth';

/** Seven emotions used to mean seven glow colours. One accent now. */
const AVATAR_GLOW = 'drop-shadow(0 0 12px var(--accent-line))';

/**
 * @param {Object} props
 * @param {string}  [props.persona]  'optimus' | 'jarvis' | 'ashwin'
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] a clip is currently playing
 */
export const PersonaAvatar = ({ persona = DEFAULT_PERSONA, size = 130, speaking = false }) => {
  if (persona === 'optimus') {
    return <OptimusAvatarVisual size={size} speaking={speaking} />;
  }
  if (persona === 'jarvis') {
    return <JarvisAvatarVisual size={size} speaking={speaking} />;
  }

  // The creator, first person — keeps the original cartoon memoji and its
  // overlaid mouth. The wrapper is the positioning context both the glow ring
  // and the mouth are laid out against (§6.1).
  return (
    <div className="vg-persona-avatar" style={{ width: size, height: size }}>
      <img
        src={avatarEmoji}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: AVATAR_GLOW,
          display: 'block',
        }}
      />
      <div className="vg-avatar-glow" aria-hidden="true" />
      <AvatarMouth active={speaking} />
    </div>
  );
};
