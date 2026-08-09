/**
 * The voice guide context lives in its own module so VoiceGuideProvider.jsx
 * exports only a component — otherwise react-refresh/only-export-components
 * warns and fast refresh degrades for that file.
 *
 * Consumers normally want ./useVoiceGuide instead; this exposes the engine ref
 * for anything that needs to drive the machine directly.
 */
import { createContext } from 'react';

export const VoiceGuideContext = createContext(null);
