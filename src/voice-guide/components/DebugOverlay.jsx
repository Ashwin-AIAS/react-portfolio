/**
 * Tuning overlay behind ?vgdebug=1 — spec §8.
 * Never enabled by default (§12). Polls refs on rAF rather than subscribing to
 * React state, so it can show per-frame values without re-rendering the app.
 */
import React, { useEffect, useState } from 'react';
import {
  SETTLE_MS,
  FAST_SCROLL,
  SETTLED_VELOCITY,
  COOLDOWN_MS,
  OBSERVER_ROOT_MARGIN,
} from '../config';
import { getLevel } from '../store';

const row = { display: 'flex', justifyContent: 'space-between', gap: 12 };
const dim = { color: 'rgba(255,255,255,0.45)' };

export const DebugOverlay = ({
  engineRef,
  scrollRef,
  ratiosRef,
  suppressedRef,
  candidateId,
  committedId,
}) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let frame = 0;
    const loop = () => {
      // ~10fps is plenty for reading numbers off a screen.
      if (++frame % 6 === 0) setTick((t) => t + 1);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const scroll = scrollRef?.current ?? {};
  const info = engineRef?.current?.getDebugInfo?.() ?? {};
  const ratios = ratiosRef?.current ? [...ratiosRef.current.entries()] : [];
  const level = getLevel();

  return (
    <div
      data-vg-debug={tick}
      style={{
        position: 'fixed',
        top: 64,
        left: 12,
        zIndex: 100000,
        width: 264,
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '10px 12px',
        borderRadius: 10,
        background: 'rgba(3,7,18,0.92)',
        border: '1px solid rgba(59,130,246,0.35)',
        color: '#e5e7eb',
        font: '11px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace',
        pointerEvents: 'none',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div style={{ ...row, color: '#60a5fa', fontWeight: 700, marginBottom: 6 }}>
        <span>VOICE GUIDE</span>
        <span>?vgdebug=1</span>
      </div>

      <div style={row}><span style={dim}>state</span><span>{info.state ?? '—'}</span></div>
      <div style={row}><span style={dim}>committed</span><span>{committedId ?? '—'}</span></div>
      <div style={row}><span style={dim}>candidate</span><span>{candidateId ?? '—'}</span></div>
      <div style={row}><span style={dim}>speaking</span><span>{info.speakingSectionId ?? '—'}</span></div>
      <div style={row}>
        <span style={dim}>clip</span>
        <span>{info.clipCount ? `${(info.clipIndex ?? 0) + 1}/${info.clipCount}` : '—'}</span>
      </div>
      <div style={row}><span style={dim}>source</span><span>{info.sourceKind ?? '—'}</span></div>
      <div style={row}><span style={dim}>persona</span><span>{info.persona ?? '—'}</span></div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '7px 0' }} />

      <div style={row}>
        <span style={dim}>velocity</span>
        <span style={{ color: (scroll.velocity ?? 0) >= FAST_SCROLL ? '#f87171' : '#4ade80' }}>
          {Math.round(scroll.velocity ?? 0)} px/s
        </span>
      </div>
      <div style={row}><span style={dim}>direction</span><span>{scroll.direction ?? '—'}</span></div>
      <div style={row}><span style={dim}>settled</span><span>{String(scroll.isSettled ?? false)}</span></div>
      <div style={row}>
        <span style={dim}>suppressed</span>
        <span style={{ color: suppressedRef?.current ? '#f87171' : 'inherit' }}>
          {String(!!suppressedRef?.current)}
        </span>
      </div>
      <div style={row}><span style={dim}>scrollY</span><span>{Math.round(scroll.scrollY ?? 0)}</span></div>

      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '7px 0' }} />

      <div style={row}><span style={dim}>amplitude</span><span>{level.toFixed(2)}</span></div>
      <div
        style={{
          height: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
          margin: '3px 0 7px',
        }}
      >
        <div style={{ height: '100%', width: `${level * 100}%`, background: '#60a5fa' }} />
      </div>

      <div style={{ ...dim, marginBottom: 3 }}>intersection ratios</div>
      {ratios.length === 0 && <div style={dim}>—</div>}
      {ratios
        .filter(([, r]) => r > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([id, r]) => (
          <div key={id} style={row}>
            <span style={{ color: id === committedId ? '#4ade80' : id === candidateId ? '#fbbf24' : undefined }}>
              {id}
            </span>
            <span>{r.toFixed(2)}</span>
          </div>
        ))}

      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '7px 0' }} />
      <div style={{ ...dim, marginBottom: 3 }}>visits (session)</div>
      {Object.keys(info.visits ?? {}).length === 0 && <div style={dim}>—</div>}
      {Object.entries(info.visits ?? {}).map(([id, v]) => (
        <div key={id} style={row}>
          <span>{id}</span>
          <span style={{ color: v.status === 'completed' ? '#4ade80' : '#fbbf24' }}>
            {v.count}× {v.status}
          </span>
        </div>
      ))}

      <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '7px 0' }} />
      <div style={{ ...dim, fontSize: 10 }}>
        settle {SETTLE_MS}ms · fast {FAST_SCROLL} · settledV {SETTLED_VELOCITY} ·
        cooldown {COOLDOWN_MS}ms
        <br />
        rootMargin {OBSERVER_ROOT_MARGIN}
        <br />
        tune in src/voice-guide/config.js
      </div>
    </div>
  );
};
