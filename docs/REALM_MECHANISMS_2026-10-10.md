# Realm mechanisms and completion feedback — 2026-10-10

## Delivered behavior

The study retains its 12-step escape chain. The other nine realms now have independent mechanisms: exact shopping list and coin cost; partner-specific garden care; equipment plus an ordered sports relay; an adjustable clock and correct platform; grid sailing with blocked reefs and shore; celestial object plus compass alignment; warm clothing plus safe campfire heat; first-next-last scroll reconstruction; and a four-note rainbow piano. Each has an English sentence, optional spoken example, Chinese guidance, and deliberate actions with retry feedback.

A scene task beacon and the task button open the same puzzle. Forward travel from an unfinished realm is refused before replacing its scene; returning, restoring a checkpoint, and local diagnostics remain available. Puzzles do not fabricate pronunciation results, write grades, grant items, or award XP.

Task progress, including partial configurations, is saved in the existing isolated on-device checkpoint. Saved success flags are checked against the real configuration, unknown fields are dropped, and impossible positions on the harbor grid are rejected. Old checkpoints without realm puzzle data remain valid.

Completion marks the scene beacon green, shows a success panel and next action, and plays the existing controlled success sound. Spoken word completion also presents the next live clue. The sky-island piano uses the effects mixer and stops pending tones on close, scene replacement or page hiding; its solved state actually brightens the seven 3D rainbow arcs. Reduced-motion settings disable the new reward entrance animation. The final message describes completion of the sky-island task, not unverified completion of all vocabulary or realms.

## Verification

101 regression checks passed with exit code 0. Coverage includes wrong baskets with the same total, incorrect care tools, sequence retries, time-versus-platform mismatch, alternate legal sailing routes, reefs and shore, wrong sky objects, extra summer gear or overheated fire, wrong card/note order, malformed saved states, old checkpoint compatibility, scene-manager exit refusal, all nine checkpoint configurations, and the study next-clue feedback.

Browser UI in local non-grading preview: completed all nine puzzles; exercised reef refusal and wrong-platform feedback. Reload restored a completed sky-island task. At 390×844, saved the station midway at 08:30/platform 1, reloaded, verified the same values and resumed to successful platform 2. Phone HUD buttons, map, and interaction button do not overlap. Screenshots are recorded in the workspace as realm-station-phone.png and realm-quest-hud-phone.png. These are responsive browser checks, not actual device/student tests.

## Open requirements

Full cross-device puzzle checkpoint synchronization and backend publication remain outstanding. Actual touch/audio/microphone checks on user devices, a 30-minute session, and student observation remain unverified. The on-device UI continues to state its actual storage scope.

## Scene transition fixes

A 30-transition browser sweep exposed a stale old-scene interaction label and scene construction time being counted as gameplay time. Scene replacement now explicitly clears the old prompt, crosshair and hint marker, consumes paused clock time and resets frame cadence. Construction duration is recorded separately and shown in local diagnostics rather than hidden. This does not establish real-device frame-rate performance; device checks remain open.

After the timing/prompt fixes, the browser sweep completed all 30 transitions and the page console error list was empty. At return to the station, the displayed metrics were geometry 148, textures 47, draws 104, rolling P95 36.1 ms, lifetime long frames 50, and station construction 21 ms. These observations include a scene-switching sweep and do not establish a sustained real-device frame-rate target. The stale old-scene interaction prompt was absent.
