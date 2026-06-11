# Metis Trail V2 — Vision & Long-Term Goals

> This file is the aspirational north star. It is NOT a task list. It's where we park ideas that are too big or too early for the current sprint, so they don't clutter the immediate plan but don't get lost either.

## Core Identity

A first-person narrative game about the Métis Carlton Trail journey (Fort Garry → Fort Edmonton, 1878). The player experiences the trail through a journal that reads like a real diary — atmospheric, grounded in primary sources, mechanically rich. The game should feel like reading a historical novel where your choices matter.

## Near-Term Vision (this consolidation pass)

- **Journal as the primary narrative surface.** Collapsible first-person diary entries replace the old narrative panel. Every action — travel, events, camp, settlements — writes to the journal in a voice that feels human and period-appropriate.
- **Stable core loop.** Shop → travel → camp → events → settlements → repeat. No silent failures, no dead code, no duplicate systems.
- **Readable.** All text meets WCAG AA contrast. No light-on-light eye strain.

## Medium-Term Ideas (next 2-4 sprints)

### Read Mode
At game end, offer a "Read Journal" mode that presents the entire journey as a continuous scrollable diary — no UI chrome, no buttons, just the journal text. Like reading a short story the player authored through their choices.

### Gossip → Event Connections
Gossip gathered at settlements should connect to future events. Example: hearing at a Métis camp that "the river is running high at the next crossing" could unlock a modified river crossing event with advance warning (lower DC, or a new choice option). This makes gossip mechanically meaningful, not just flavor.

### Historical Detail Layers
Include optional "historical notes" that players can toggle — footnotes that connect journal entries to real primary sources, maps, photographs. For players who want to go deeper without cluttering the core experience.

### Seasonal Journal Voice
Shift the journal's writing style based on season:
- **June/July:** Hopeful, energetic, descriptive of landscape
- **August/September:** More urgent, weather-aware, food-conscious
- **October/November:** Sparse, cold, survival-focused, shorter entries

This is a hard problem — requires per-season flavor text pools for every entry type. Save for after the core narrative system is solid.

## Long-Term / Parked (don't let these distract)

### Multiple Journeys / Campaign Mode
After completing one journey, unlock the ability to play again with:
- Different starting conditions (different trade goods, different season)
- Persistent "family reputation" that carries across journeys
- New events that only appear on subsequent playthroughs
- A "generations" mechanic where your journal entries from Journey 1 appear as historical sources in Journey 2

This is a massive scope increase. Only consider after the single-journey experience is polished and the content pipeline is mature.

### Content Pipeline for New Events
Build a structured workflow for adding new events:
1. Find primary source quote
2. Write event text + choices
3. Add to terrain pool
4. Add source entry
5. Test in sim

This is a process improvement, not a feature. But it matters for long-term content velocity.

### French-Language Dialogue Options
Some events could offer French dialogue options (historically accurate for Métis carters). This is a localization/internationalization challenge on top of a content challenge. Very long-term.

## Principles for Managing Scope

1. **The journal is the game.** Every feature should make the journal better. If it doesn't improve the diary, it's scope creep.
2. **One journey must be perfect before we add more.** No campaign mode until single-journey is excellent.
3. **Historical accuracy is a feature, not a constraint.** When in doubt, cite a real source. The game's authority comes from its grounding in real voices.
4. **Silent failures are the worst bugs.** A feature that doesn't work but doesn't crash is worse than one that crashes visibly. Test everything in the browser.
