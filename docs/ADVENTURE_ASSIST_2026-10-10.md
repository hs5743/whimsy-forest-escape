# Adventure hints and local checkpoints — 2026-10-10

The approved title is 《英語魔法探險家：秘境逃脫任務》. The title image and site branding were deployed in commit 56ebb568a9e02af9ba13d8e3323bc45ac75b3426. Forest is one realm, not the global game premise.

## This delivery

- Voluntary hints: clue, interaction guidance, then an explicitly requested direction marker. No automatic answer, score, item, or teleport. Study clues follow the 12-step mechanism sequence; the other nine realms use their setting and pending vocabulary. Markers are disposed when the goal or scene changes.
- Local checkpoint: scene, safe position and view angle, inventory, study mechanism states, experience, and vocabulary completion per realm. Autosave after entering play, manual save, page-hide save, clear success or failure text. Corrupt data is retained before a replacement checkpoint is written.
- Separate local slots for guest, each signed-in student, and development preview. Switching identity rebuilds the scene so a previous student’s open drawer or mechanism appearance is not retained.
- Practice completion records the original realm even when the completion callback enters the next realm.
- Restored star and flower stones remain collectible before pickup and stay hidden after pickup.

## Verification

83 regression checks passed with exit code 0. Browser UI verification: save realm 6 (harbor), reload, cover says continue, harbor and X 0/Z 6 restored. Phone 390×844: hints 1, 2 and direction displayed; screenshot hints-phone.png in workspace records. This is browser responsive verification, not an actual phone or student playtest.

## Remaining development

The deployed learning-record service does not yet store puzzle checkpoints. This delivery only saves puzzle state in this browser on this device; UI explicitly states that limit. Cloud checkpoint protocol and backend publication remain outstanding. Realm-specific multi-step puzzles and the further completion feedback pass also remain outstanding. Real device microphone/audio/touch checks and student observation require actual participants; do not substitute browser simulations for these checks.
