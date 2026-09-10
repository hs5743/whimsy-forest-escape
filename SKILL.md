---
name: edu-web3d-escape-game
description: >
  A complete development skill, architectural pattern, and workflow guide for
  building 3D first-person educational escape-the-room web games. Integrates Web
  Speech API real-time pronunciation evaluation, tablet touch controls (virtual
  joystick and touch look swipe), procedural Web Audio API BGM/SFX, Three.js 3D
  atelier rendering, AI-generated PBR texture skins, and GitHub Pages zero-install
  deployment.
---

# 3D Educational Web Escape Game Development Skill

This skill documents the end-to-end blueprint, software architecture, and implementation workflow for developing 3D first-person educational web games that combine immersive exploration with language speech practice, mobile tablet accessibility, and instant static web deployment.

## When to Use This Skill
- When asked to build, refine, or deploy a 3D educational web game or escape-the-room simulation.
- When implementing real-time student speech recognition (`SpeechRecognition` / `webkitSpeechRecognition`) for gamified learning.
- When building touch-friendly 3D web applications that must run smoothly on iPads, Android tablets, Chromebooks, and desktop PCs without app installation.
- When generating AI texture skins (PBR-style wood, stone, leather, slate) to elevate low-poly Three.js scenes into warm, anime-style painterly worlds.
- When deploying static web games to GitHub Pages with automated HTTPS and microphone permissions.

---

## 1. Architectural Components

```
edu-web3d-escape-game/
├── assets/
│   ├── sounds/vocab/*.wav    # Native human pronunciation audio samples
│   └── textures/             # AI-generated PBR textures and character portraits
├── audio-manager.js          # Web Audio API pure procedural music box BGM & SFX
├── speech-manager.js         # Web Speech API engine, fuzzy keyword evaluator & TTS fallback
├── touch-controls.js         # Virtual joystick + touch look swipe + desktop WASD/mouse
├── vocab-data.js             # Curriculum vocab database (Phonics, ZH, dialogues, keywords, XP)
├── world-3d.js               # Three.js 3D scene graph, props, raycaster & state machine
├── style.css                 # Responsive parchment UI, large speech cards & button states
└── index.html                # Main viewport, crosshair, inventory bar & modals
```

---

## 2. Core Implementation Patterns

### Pattern A: "True-Name Incantation" Speech Recognition
Students must speak the English word into the microphone to unlock 3D magical contraptions:
1. Trigger interaction via center crosshair raycast or dedicated touch action button.
2. Open speech practice parchment card displaying:
   - Big bold English word with syllable phonics (`/laɪt/ • L-I-G-H-T`).
   - Native audio playback (`assets/sounds/vocab/*.wav`).
   - Microphone recording button with live pulsing CSS animations.
3. Fuzzy keyword matching:
   - Strip punctuation, lowercase, check target word.
   - Fall back to phonetic variants (`matchKeywords`).
4. **Classroom Tolerance (Teacher Pass)**:
   - Provide an unobtrusive manual pass button (`[ ✨ 老師驗證通過 (Teacher Pass) ]`) so noisy classroom environments or microphone hardware issues never block student progress.

### Pattern B: Tablet Touch Controls & Gesture Disambiguation
To prevent screen swipe rotation from accidentally triggering object interactions:
```javascript
let pointerDownPos = { x: 0, y: 0 };
let pointerDownTime = 0;

window.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
  pointerDownTime = Date.now();
});

window.addEventListener('pointerup', (e) => {
  if (e.target.closest('#speechModal') || e.target.closest('#touchControlsLayer')) return;

  const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  const elapsed = Date.now() - pointerDownTime;

  // Filter out swipes: movement > 12px or duration > 300ms is camera rotation!
  if (dist > 12 || elapsed > 300) return;

  // Only trigger interaction on short intentional taps
  if (this.hoveredObject) {
    this.triggerInteraction(this.hoveredObject);
  }
});
```

### Pattern C: Modal Input Freezing & Manual Dismissal
1. When any modal (`speechModal`, `guideModal`, `victoryModal`) is active, freeze player movement and camera rotation in the main game loop.
2. Provide a prominent `✕` close button on the modal and listen for the `ESC` key to allow students to cancel or exit at any moment.
3. Abort speech recognition immediately upon closing the modal (`speechManager.stopListening()`).

### Pattern D: AI-Generated PBR Texture Skins
Elevate plain geometric 3D models using AI-generated textures:
- **Stone Wall**: Warm cream sandstone bricks with mortar and moss (`tex-stone-wall.jpg`, tiled 3x2).
- **Wood Plank Floor**: Hand-crafted vintage oak floorboards (`tex-wood-floor.jpg`, tiled 4x4).
- **Antique Furniture**: Mahogany wood grain with carved brass filigree (`tex-wood-desk.jpg`).
- **Grimoire Cover**: Midnight blue leather with embossed celestial star charts (`tex-grimoire-book.jpg`).
- **Alchemy Slate**: Charcoal slate stone etched with golden transmutation circles (`tex-alchemy-slate.jpg`).
- **Double Door UV Splitting**: Map one symmetric relief image across two sliding door leaves using texture `repeat(0.5, 1)` and `offset(0, 0)` / `offset(0.5, 0)`.

### Pattern E: State Resilience & Double Checking
Avoid quest bugs where inventory items exist visually but internal state flags are missing:
```javascript
// Always check both the boolean state flag and the inventory array
const hasFishInBag = this.gameState.hasFish || 
                     this.gameState.inventory.some(i => i.id === 'FISH');
```
Keep track of micro-states (`catPracticed`, `doorStonePlaced`) so players can resume complex multi-step interactions seamlessly without repeating previously completed stages.

---

## 3. GitHub Pages Deployment Automation

Deploy zero-install static games directly with the GitHub CLI:
```bash
# 1. Commit source files
git init && git branch -M main
git add .
git commit -m "feat: release 3D educational escape game"

# 2. Create remote repo and push
gh repo create <username>/<repo-name> --public --source=. --push

# 3. Enable GitHub Pages on main branch
gh api --method POST /repos/<username>/<repo-name>/pages \
  -f "source[branch]=main" \
  -f "source[path]=/"

# 4. Check deployment status
gh run list --repo <username>/<repo-name>
```
The game will be live at `https://<username>.github.io/<repo-name>/` with valid SSL, satisfying browser microphone security policies.
