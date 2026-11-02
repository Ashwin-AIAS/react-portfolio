// Stamp the stored mode + palette onto <html> before first paint. The effects
// in src/App.jsx do the same thing, but they only run after the first commit,
// which is long enough for a returning visitor to see one frame of the default
// behind their actual theme. Keep in sync with the two useEffects in App.jsx.
//
// Loaded as a normal blocking <script src> from index.html (not inline) so the
// Content-Security-Policy can keep script-src to 'self' with no hash.
(function () {
  try {
    var root = document.documentElement;
    var dark = localStorage.getItem('theme-mode') !== 'light';
    root.classList.toggle('theme-dark', dark);
    root.classList.toggle('theme-light', !dark);
    var known = [
      'viper', 'synthwave', 'eva01', 'nightcity',
      'toxicberry', 'plasma', 'akira', 'aurora',
      'cyan', 'amber', 'indigo', 'emerald', 'crimson',
      'ironman', 'vibranium', 'batman', 'cyberpunk',
      'obsidian', 'titanium', 'onyx', 'venom', 'ember'
    ];
    var saved = localStorage.getItem('theme-palette-v2');
    root.classList.add('palette-' + (known.indexOf(saved) > -1 ? saved : 'viper'));
  } catch {
    /* storage blocked (private mode): the CSS defaults already cover it */
  }
})();
