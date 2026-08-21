/**
 * Public exports — spec §3.1.
 *
 * NOTE: importing from here pulls in the engine. The app deliberately does NOT
 * use this module at startup; App.jsx lazy-loads ./VoiceGuideMount instead, and
 * the eager UI imports ./useVoiceGuide + ./components/* directly so the heavy
 * half stays out of the initial bundle (§8).
 */
export { VoiceGuideProvider } from './VoiceGuideProvider';
export { VoiceGuideContext } from './context';
export { default as VoiceGuideMount } from './VoiceGuideMount';
export { useVoiceGuide } from './useVoiceGuide';
export { useScrollTracker } from './useScrollTracker';
export { useActiveNarrationSection, pickCandidate } from './useActiveSection';
export { createNarrationEngine, decideNarration, STATE } from './narrationEngine';

export { AvatarMouth } from './components/AvatarMouth';
export { CaptionText, AgentControls } from './components/CaptionBubble';
export { PersonaAvatar } from './components/PersonaAvatar';
export { OptimusAvatarVisual } from './components/OptimusAvatarVisual';
export { JarvisAvatarVisual } from './components/JarvisAvatarVisual';
export { MegatronAvatarVisual } from './components/MegatronAvatarVisual';
export { MobileVoicePill } from './components/MobileVoicePill';
export { DebugOverlay } from './components/DebugOverlay';

export { NARRATION, getSection, getNextSectionId } from './data/narrationScript';
export * as vgConfig from './config';
