/**
 * Lazy entry point for the whole feature — spec §8.
 *
 * App.jsx React.lazy()s this module after first paint, so the engine, the
 * sources, the narration script and voice-guide.css all stay out of the
 * initial bundle.
 *
 * The desktop controls are no longer mounted here: the unmute prompt, the mute
 * toggle and the persona selector are docked inside the agent bubble now
 * (personas spec §3.5, components/CaptionBubble.jsx), which AvatarGuide.jsx
 * renders. What is left here is the mobile guide, which has no bubble to dock
 * into — under 768px this pill is the whole thing (personas spec §3.4).
 *
 * Default export on purpose: React.lazy requires one.
 */
import React from 'react';
import { VoiceGuideProvider } from './VoiceGuideProvider';
import { MobileVoicePill } from './components/MobileVoicePill';
import './voice-guide.css';

export default function VoiceGuideMount() {
  return (
    <VoiceGuideProvider>
      <MobileVoicePill />
    </VoiceGuideProvider>
  );
}
