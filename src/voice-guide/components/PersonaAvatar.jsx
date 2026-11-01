/**
 * Persona-aware avatar — personas spec §3.3, holographic spec §2.1.1.
 *
 * One switch for all 7 narrators:
 * - Optimus Prime (`optimus`)
 * - JARVIS (`jarvis`)
 * - Megatron (`megatron`)
 * - Iron Man (`ironman`)
 * - Batman (`batman`)
 * - Bumblebee (`bumblebee`)
 * - Ashwin (`ashwin` — original holographic memoji + AvatarMouth)
 */
import React from 'react';
import avatarEmoji from '/avatar-emoji.png';
import { DEFAULT_PERSONA } from '../config';
import { OptimusAvatarVisual } from './OptimusAvatarVisual';
import { JarvisAvatarVisual } from './JarvisAvatarVisual';
import { MegatronAvatarVisual } from './MegatronAvatarVisual';
import { IronManAvatarVisual } from './IronManAvatarVisual';
import { BatmanAvatarVisual } from './BatmanAvatarVisual';
import { BumblebeeAvatarVisual } from './BumblebeeAvatarVisual';
import { AvatarMouth } from './AvatarMouth';

/** Seven emotions used to mean seven glow colours. One accent now. */
const AVATAR_GLOW = 'drop-shadow(0 0 12px var(--accent-line))';

/** Ambient particle glow — motes rising through the projection column. */
const MOTES = [0, 1, 2, 3, 4, 5, 6];

/** Every decorative layer is absolute, so a missing stylesheet costs no layout. */
const LAYER = { position: 'absolute', pointerEvents: 'none' };

/**
 * @param {Object} props
 * @param {string}  [props.persona]  'optimus' | 'jarvis' | 'megatron' | 'ironman' | 'batman' | 'bumblebee' | 'ashwin'
 * @param {number}  [props.size]     px, square
 * @param {boolean} [props.speaking] a clip is currently playing
 * @param {string}  [props.phase]    'enter' | 'stay' | 'exit' — see useAvatarPhase
 */
export const PersonaAvatar = ({
  persona = DEFAULT_PERSONA,
  size = 130,
  speaking = false,
  phase = 'stay',
}) => {
  if (persona === 'optimus') {
    return <OptimusAvatarVisual size={size} speaking={speaking} phase={phase} />;
  }
  if (persona === 'jarvis') {
    return <JarvisAvatarVisual size={size} speaking={speaking} phase={phase} />;
  }
  if (persona === 'megatron') {
    return <MegatronAvatarVisual size={size} speaking={speaking} phase={phase} />;
  }
  if (persona === 'ironman') {
    return <IronManAvatarVisual size={size} speaking={speaking} phase={phase} />;
  }
  if (persona === 'batman') {
    return <BatmanAvatarVisual size={size} speaking={speaking} phase={phase} />;
  }
  if (persona === 'bumblebee') {
    return <BumblebeeAvatarVisual size={size} speaking={speaking} phase={phase} />;
  }

  // The creator, first person — keeps the original cartoon memoji and its
  // overlaid mouth.
  return (
    <div
      className={`vg-ashwin-holo vg-phase-${phase}${speaking ? ' vg-ashwin-live' : ''}`}
      style={{ position: 'relative', width: size, height: size }}
    >
      <div className="vg-ashwin-halo" style={{ ...LAYER, inset: '-13%' }} aria-hidden="true">
        <span className="vg-ashwin-halo-ring" />
        <span className="vg-ashwin-halo-ring vg-ashwin-halo-ring-2" />
        <span className="vg-ashwin-halo-ring vg-ashwin-halo-ring-3" />
      </div>

      <div className="vg-ashwin-motes" style={{ ...LAYER, inset: '-6% -14% -22%' }} aria-hidden="true">
        {MOTES.map((i) => (
          <span key={i} className="vg-ashwin-mote" />
        ))}
      </div>

      <div
        className="vg-persona-avatar vg-ph"
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
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
        <div className="vg-holo-scanlines" style={{ ...LAYER, inset: 0 }} aria-hidden="true" />
        <AvatarMouth active={speaking} />
      </div>

      <div
        className="vg-holo-pedestal"
        style={{ ...LAYER, left: 0, right: 0, bottom: '-14%', height: '34%' }}
        aria-hidden="true"
      >
        <span className="vg-holo-beam" />
        <span className="vg-holo-disc" />
        <span className="vg-holo-disc vg-holo-disc-2" />
        <span className="vg-holo-emitter" />
      </div>
    </div>
  );
};
