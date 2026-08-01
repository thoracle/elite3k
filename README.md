# ELITE 3K

A single-file HTML5 tribute to *Elite* (1984) — neon-wireframe 3D, vanilla JS + three.js (CDN), built for both touch and keyboard.

## Run it

- **Easiest:** double-click `index.html` (needs internet on first load for the three.js CDN; the browser caches it after).
- **Or serve it:** `python3 -m http.server 8377` then open <http://localhost:8377/index.html> — required only if your browser blocks `file://` module loading.
- Works on desktop and mobile browsers. On phones, landscape is recommended; add to home screen for fullscreen.

## What's in the game

- Full core loop: trading (17 commodities, economy-driven prices), combat, hyperspace travel, docking, ship outfitting
- **8 procedural galaxies** of 256 systems each (start at Lave), reached via the one-shot Galactic Hyperdrive
- **Witchspace misjumps**: rarely a jump misfires into the void between stars — Thargoid warships attack; fight or jump out
- Missions (BBS): cargo freight, data courier, **VIP passengers** (speed bonus), **multi-hop circuits**, pirate bounties — with a **reputation** system that raises pay
- Legal system (Clean → Offender → Fugitive), police Vipers, contraband goods
- Elite ranks from Harmless to E L I T E, kill-based
- Asteroid mining (mining laser + fuel scoop), solar fuel scooping, escape pod, ECM, homing missiles
- **Living space**: freighters launch from and dock at stations; planets vary — rings, moons, binary suns, settlement lights on populous worlds
- Auto-save at every dock/launch, 3 manual slots, plus export/import transfer codes
- Procedural WebAudio sound **and a generative ambient soundtrack** (calm pads in flight, opens up in combat, gentle arpeggios docked)
- Neon cockpit frame, bloom glow (auto-disables on weak GPUs), optional **mouse steering** (desktop) and **tilt assist** (mobile) in STATUS settings

## Controls

| Action | Touch | Keyboard |
|---|---|---|
| Pitch / roll | left virtual stick | `W A S D` / arrows |
| Throttle | right slider | `R` / `F` (hold `⇧` full, `⌃` stop) |
| Fire laser | FIRE | `Space` |
| Missile (lock first: hold enemy in crosshair) | MSL | `M` |
| ECM | ECM | `E` |
| Time warp ×14 | WARP | `J` |
| Hyperspace (course set in station CHARTS) | HYPER | `H` |
| Docking computer | DOCK | `C` |
| Cycle laser | — (OUTFIT tab) | `L` |
| Pause / help | ⏸ MENU | `P` / `Esc` |

Dock manually by flying slowly into the station's glowing slot — or buy the docking computer at any tech-5 station (450 CR).

## Dev notes

- Debug hooks are exposed on `window`: `G` (game state), `NPCS`, `GALAXY`, `W` (world objects), `DBG.spawnNPC(...)`, `DBG.enterWitchspace(targetIdx)` etc. Set `window.DEBUG_KILLS=true` for kill traces.
- Append `?headless=1` to drive the game loop via MessageChannel instead of requestAnimationFrame — it keeps running in background tabs, for automated testing.
- The Galactic Hyperdrive is bought at tech-10+ shipyards, armed in station CHARTS, and consumed by the next HYPER engage in flight.
