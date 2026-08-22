/**
 * Persona-aware avatar — personas spec §3.3, holographic spec §2.1.1.
 *
 * One switch for the four narrators: the Autobot crest, the arc-reactor HUD,
 * the Decepticon insignia, or the original memoji. Only the memoji branch uses
 * AvatarMouth — the other three carry their own amplitude-driven "mouth" (the
 * grille, the reactor core, the mouthguard).
 *
 * The memoji itself is untouched (holo spec §1.1: keep the creator's avatar as
 * it is). What is new is the rig AROUND it — a projection pedestal casting the
 * beam it stands in, an orbital soundwave halo and a column of drifting motes —
 * so Ashwin reads as a hologram being projected rather than a PNG pasted on the
 * page. All three layers are decorative siblings of the image, so the lip sync
 * and the mouth alignment are exactly what they were.
 *
 * Eager: AvatarGuide.jsx imports this directly, so nothing here may reach the
 * engine, the sources or the narration scripts (§8). ../config is pure
 * constants, which is why DEFAULT_PERSONA can come from there. For the same
 * reason every new layer carries its own inline POSITIONING and takes only its
 * look from voice-guide.css: if the lazy stylesheet has not landed yet the rig
 * is invisible rather than pushing the memoji around.
 */
import React from 'react';
import avatarEmoji from '/avatar-emoji.png';
import { DEFAULT_PERSONA } from '../config';
import { OptimusAvatarVisual } from './OptimusAvatarVisual';
import { JarvisAvatarVisual } from './JarvisAvatarVisual';
import { MegatronAvatarVisual } from './MegatronAvatarVisual';
import { AvatarMouth } from './AvatarMouth';

/** Seven emotions used to mean seven glow colours. One accent now. */
const AVATAR_GLOW = 'drop-shadow(0 0 12px var(--accent-line))';

/** Ambient particle glow — motes rising through the projection column. */
const MOTES = [0, 1, 2, 3, 4, 5, 6];

/** Every decorative layer is absolute, so a missing stylesheet costs no layout. */
const LAYER = { position: 'absolute', pointerEvents: 'none' };

/**
 * @param {Object} props
 * @param {string}  [props.persona]  'optimus' | 'jarvis' | 'megatron' | 'ashwin'
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
  if (persona === 'megatron') {
    return <MegatronAvatarVisual size={size} speaking={speaking} />;
  }

  // The creator, first person — keeps the original cartoon memoji and its
  // overlaid mouth. The inner wrapper is still the positioning context both the
  // glow ring and the mouth are laid out against (§6.1); the outer one is the
  // hologram rig.
  return (
    <div
      className={`vg-ashwin-holo${speaking ? ' vg-ashwin-live' : ''}`}
      style={{ position: 'relative', width: size, height: size }}
    >
      {/* Orbital soundwave halo — three counter-rotating rings on one container
          that breathes with --vg-level, so the scale and the spin never fight
          over the same transform. */}
      <div className="vg-ashwin-halo" style={{ ...LAYER, inset: '-13%' }} aria-hidden="true">
        <span className="vg-ashwin-halo-ring" />
        <span className="vg-ashwin-halo-ring vg-ashwin-halo-ring-2" />
        <span className="vg-ashwin-halo-ring vg-ashwin-halo-ring-3" />
      </div>

      {/* Ambient particle glow. */}
      <div className="vg-ashwin-motes" style={{ ...LAYER, inset: '-6% -14% -22%' }} aria-hidden="true">
        {MOTES.map((i) => (
          <span key={i} className="vg-ashwin-mote" />
        ))}
      </div>

      <div className="vg-persona-avatar" style={{ position: 'relative', width: '100%', height: '100%' }}>
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
        {/* Projection interference — the giveaway that this is a beam, not a
            body. Screen-blended, so it disappears against light palettes
            instead of dirtying them. */}
        <div className="vg-holo-scanlines" style={{ ...LAYER, inset: 0 }} aria-hidden="true" />
        <AvatarMouth active={speaking} />
      </div>

      {/* Holographic projection pedestal: emitter disc, expanding shockwave
          ring and the cone of light the memoji stands in. */}
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
