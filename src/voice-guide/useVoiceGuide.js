/**
 * Consumer hook — spec §3.1.
 *
 * Safe to call from anywhere, including before the lazy provider has mounted:
 * it just reports `ready: false` until then.
 */
import { useSyncExternalStore } from 'react';
import { subscribe, getSnapshot, getServerSnapshot, getActions } from './store';

export function useVoiceGuide() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const actions = getActions();

  return {
    ...snapshot,
    isSpeaking: snapshot.machine === 'speaking',
    enable: actions.enable,
    disable: actions.disable,
    toggle: actions.toggle,
    setPersona: actions.setPersona,
  };
}
