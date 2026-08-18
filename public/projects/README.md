# Project screenshots

Drop a capture here and the matching project card switches from the abstract
animated schematic to the real thing. No code change is needed beyond adding
one field.

## Wiring one up

In `src/data/portfolioData.js`, add `image` to the project:

```js
{
  title: "GymVision (PoseCoach) — Real-Time AI Gym Form Coach",
  image: "/projects/gymvision.webp",
  ...
}
```

`ProjectMedia` in `src/components/sections/ProjectsSection.jsx` prefers
`image` and falls back to the animated visual when it's missing, so you can
add them one at a time — nothing breaks while the set is incomplete.

## Capture spec

| | |
|---|---|
| Aspect | **16:10** for featured, 16:9 for the rest (cards crop to fill, top-anchored) |
| Size | 1600×1000 px, downscaled from a 2× capture |
| Format | **WebP**, quality ~80 |
| Weight | **under 150 KB each** — the whole set should stay under 1.5 MB |
| Content | the project actually running, with real output visible |

Convert with:

```bash
ffmpeg -i shot.png -vf scale=1600:-1 -quality 80 gymvision.webp
```

## What to capture per project

Screenshots beat the animated schematics because they prove the thing exists.
For projects with no GUI, capture the artifact that *is* the output:

| Project | Capture |
|---|---|
| GymVision | live rep counter + per-joint form score overlaid on the pose skeleton |
| JARVIS | the React dashboard mid-command, with the transcript visible |
| RAG System | a query with retrieved sources and the grounded answer |
| Mini-CNN | terminal: inference output + the Int8 vs FP32 timing comparison |
| Bat Swing | annotated swing frame with the metrics panel |
| Radar-AI | real vs GAN-synthesised RADAR samples side by side |
| Face Recon | input photo → reconstructed 3D mesh |
| Foundation Models | camera-LiDAR fusion overlay on a KITTI frame |
| Roundabout | the SUMO simulation view |
| RL Environment | training reward curve |
| N8N Webhook | the n8n workflow canvas |
| Portfolio | this site — but prefer a shot of a section, not the whole page |

## Also worth adding

The card renders a metric readout for featured projects. Structured metrics
beat the current single sentence:

```js
metrics: [
  { label: 'Latency', value: '42 ms' },
  { label: 'mAP', value: '0.89' },
  { label: 'FPS', value: '30' },
],
```

The existing `metric: "..."` string still works — it renders as a single
`RESULT` row.
