/**
 * Lazy entry point for the whole feature — spec §8.
 *
 * App.jsx React.lazy()s this module after first paint, so the engine, the
 * sources, the narration script and voice-guide.css all stay out of the
 * initial bundle.
 *
 * Default export on purpose: React.lazy requires one.
 */
import React from 'react';
import { VoiceGuideProvider } from './VoiceGuideProvider';
import { VoiceToggle } from './components/VoiceToggle';
import './voice-guide.css';

export default function VoiceGuideMount() {
  return (
    <VoiceGuideProvider>
      <VoiceToggle />
    </VoiceGuideProvider>
  );
}
