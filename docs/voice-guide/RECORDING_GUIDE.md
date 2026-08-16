# Recording the narration

**You do not need to write any code to add audio.** Drop correctly-named mp3s
into `public/audio/narration/` and the engine picks them up on the next load.
Until then it speaks every line with the browser's built-in voice, so the
feature is already working — the recordings just make it sound like you.

## How the engine chooses

For each clip, in order:

1. `AudioFileSource` — if the clip has an `audio` path **and** a `HEAD` request
   for it returns a non-HTML response.
2. `SpeechSynthesisSource` — the browser's built-in TTS.
3. Captions only — silent, text still updates.

So a missing, misnamed, or half-uploaded file degrades to TTS rather than
breaking. You can record one file, or all of them, or none.

## Exact filenames expected

Derived from `src/voice-guide/data/narrationScript.js`. If you change the
script, change the filenames to match — or just change the `audio:` field.

| File                                     | Line (placeholder — rewrite in your own words)                                              | Target |
| ---------------------------------------- | ------------------------------------------------------------------------------------------- | ------ |
| `hero-1.mp3`                             | "Hey, I'm Ashwin — welcome. Let me show you around."                                        | ~3 s   |
| `hero-2.mp3`                             | "Just scroll, and I'll walk you through it."                                                | ~3 s   |
| `hero-revisit.mp3`                       | "Back at the top."                                                                          | ~1.5 s |
| `assistant-1.mp3`                        | "This one's my favourite. It's a live AI assistant that knows my portfolio."                | ~4 s   |
| `assistant-2.mp3`                        | "Ask it anything about me, or paste a job description and see how I match. Go ahead, try it." | ~6 s |
| `assistant-revisit.mp3`                  | "The assistant's still live if you want to try it."                                         | ~3 s   |
| `roadmap-1.mp3`                          | "Quick version of how I got here…"                                                          | ~7 s   |
| `roadmap-2.mp3`                          | "Different fields, same thread: building things that actually run."                         | ~3.5 s |
| `roadmap-revisit.mp3`                    | "The roadmap."                                                                              | ~1 s   |
| `skills-1.mp3`                           | "The stack I actually work in. Hover the chart if you want the detail."                     | ~4 s   |
| `skills-revisit.mp3`                     | "Skills again."                                                                             | ~1 s   |
| `github-1.mp3`                           | "And here's what that looks like day to day, straight from GitHub."                         | ~3.5 s |
| `github-revisit.mp3`                     | "The commit history."                                                                       | ~1.5 s |
| `projects-1.mp3`                         | "This is the part I'd look at first…"                                                       | ~4 s   |
| `projects-2.mp3`                         | "Each one opens up with what it does and what I built it with."                             | ~4 s   |
| `projects-revisit.mp3`                   | "More projects here."                                                                       | ~1.5 s |
| `certifications-1.mp3`                   | "Courses and certificates I've picked up along the way…"                                    | ~5 s   |
| `certifications-revisit.mp3`             | "The certificates."                                                                         | ~1.5 s |
| `contact-1.mp3`                          | "That's the tour. Thanks for scrolling all the way down."                                   | ~3.5 s |
| `contact-2.mp3`                          | "If you think there's a fit, the form's right here and my email's below…"                   | ~5.5 s |
| `contact-revisit.mp3`                    | "Get in touch here."                                                                        | ~1.5 s |

**Record in this order.** Each group is independently useful, so you can stop
at any point and ship what you have:

1. **`hero-1`, `hero-2`** — the only lines most visitors will ever hear. If you
   record nothing else, record these two.
2. **`contact-1`, `contact-2`** — the close. Second-highest value.
3. **`assistant-1`, `assistant-2`, `projects-1`, `projects-2`** — the two
   sections you most want people to actually engage with.
4. **`roadmap-*`, `skills-*`, `github-*`, `certifications-*`** — the rest.
5. **All the `*-revisit` lines** — one short breath each, do them in one sitting.

## Hard limits

- **Keep every clip under 12 seconds.** Chrome silently cancels longer
  speech-synthesis utterances, and `MAX_CLIP_MS` in `config.js` assumes it.
  If a line runs long, split it into another clip in the array.
- **Total budget: under 5 MB.** At mono 96 kbps that's about 7 minutes of
  audio — far more than the ~80 seconds here, so you have plenty of room. If
  you ever exceed it, switch the directory to Git LFS.

## Recording

**A phone in a quiet room beats any TTS.** It is not close. The point of this
feature is that it sounds like a person, and a real voice with a bit of room
tone reads as genuine in a way a synthesised voice never does. Don't buy a
microphone for this.

- Voice Memos / Recorder app, phone held a hand's width away, slightly off to
  the side so plosives don't hit the mic straight on.
- Soft room. Bedroom with a duvet in it beats a kitchen. Avoid anything with
  hard parallel walls.
- Turn off the fan and shut the window. Steady background hiss is much more
  noticeable under a voice than you expect.
- **Say it, don't read it.** Glance at the line, look away, then say it. Reading
  aloud has a rhythm people recognise instantly.
- Do three takes of each line back to back and keep the third — the first is
  always stiff.
- Leave about half a second of silence at the top and tail. The engine fades,
  and it needs something to fade.

## Converting

One file:

```bash
ffmpeg -i hero-1.wav -ac 1 -b:a 96k -ar 44100 public/audio/narration/hero-1.mp3
```

Everything in a folder (PowerShell — note this repo is developed on Windows):

```powershell
Get-ChildItem *.m4a | ForEach-Object {
  ffmpeg -i $_.FullName -ac 1 -b:a 96k -ar 44100 "public/audio/narration/$($_.BaseName).mp3"
}
```

Add `-af "highpass=f=80,dynaudnorm"` if a take is boomy or the level wanders —
it rolls off rumble and evens out the volume. Skip it if the take is already
clean; it can pump on very quiet recordings.

## Checking your work

1. `npm run dev`
2. Open `http://localhost:5173/?vgdebug=1`
3. Click **Play voice tour**, scroll, and watch the **source** row in the
   overlay. `audio-file` means your mp3 was found; `speech-synthesis` means it
   wasn't — check the filename and that it's really in
   `public/audio/narration/`.

The mouth is driven by a real analyser on recorded audio, so it will sync much
more convincingly once your files are in.
