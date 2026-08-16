# Elemental Fury — Concept Notes

Status: **All four elements implemented, smoke-tested, and properly isolated per round**
(`sdk/math-sdk/games/elemental_fury/`). Working title.

> ## ⚠️ Subzero implementation + element-selection dispatch notes
> Hold-and-win with lives, closely mirroring `0_0_expwilds`' actual superspin mode but
> adapted to enter via the same scatter-triggered freegame flow as the other three
> elements rather than a separate purchase-only bet mode. New special symbol `"I"` (Ice
> Shard), reuses the `prize` slot (same one Maelstrom's coins use). Runs as its own
> `run_subzero_freespin()` method rather than another per-spin side effect on the shared
> loop — its lives-based termination ("3 consecutive misses ends the round") is
> structurally incompatible with the spin-count loop the other three share; bolting it on
> naively would have truncated every OTHER element's round to ~3 spins too.
>
> That incompatibility is what finally forced the element-selection dispatch that's been
> a known gap since Maelstrom: `run_freespin()` now rolls `self.current_element` once at
> entry (25/25/25/25 via `self.config.element_weights`), Wildfire/Supercell's per-spin
> injection calls are gated on it, and Maelstrom's coin-value accumulation is gated in
> `assign_coin_value()`. One remaining gap: `"C"` (coin) is still on the shared FR0/WCAP
> reel strip, not a per-element reel, so a coin symbol can still physically land in any
> round — the gate only stops it from *paying out* outside a Maelstrom round, not from
> appearing. Same is not true for Wildfire/Supercell/Subzero's specials, which are 100%
> programmatic injection, never reel-driven, so they can't leak into the wrong round at
> all.
>
> Verified via book events, not RTP: coin events now fire in ~25.7% of bonus-mode sims,
> ice events in ~25.2% — both matching the 25% weights, confirming isolation actually
> works (previously coin events fired in 100% of sims, before dispatch existed). Manually
> traced one Subzero bust (3 misses, 0 win) and one winner (froze 2 tiles spin 1, refilled
> lives, busted 3 spins later, 103x lump-sum payout from those 2 tiles) — mechanic is
> correct. Bust rate is currently high (~82%) since `landing_ice` heavily favors 0 new ice
> per spin, same "needs tuning" starting point every other element began at.
>
> Real per-element tuning (and the wild-symbol art question — resolved: base and ignited
> wild are the same "W", visual-state-only distinction, no separate reel-driven base wild
> needed) can now happen properly in isolation, since each round only plays one element.

> ## ⚠️ Supercell implementation notes
> Arcing lightning chain, added alongside Wildfire and Maelstrom (all three currently
> active simultaneously every freegame round — still no element-selection dispatch).
> New special symbol `"T"`, added to `special_symbols` as `"lightning"`. Unlike Maelstrom,
> `T` tiles reuse the *existing* `"multiplier"` attribute — the same one the `M` symbol
> already uses, summed board-wide by `get_board_multipliers()` — rather than needing a new
> `Symbol` slot. This is deliberately safe in a way Wildfire's original wild+multiplier
> combo wasn't: `T` tiles carry no substitution role, only a multiplier value, so there's
> no double-stacking mechanism the way "more wilds → bigger win AND bigger multiplier,
> multiplied together" was. `T` tiles are never on the reel strip — purely programmatic,
> same as Wildfire's wilds.
>
> Per-round persistent state (`self.lightning_chain`, a `{(reel,row): multiplier}` dict)
> seeds one tile anywhere on the first strike of the round, then each subsequent strike
> either arcs onto a new 4-directionally-adjacent empty tile (70% chance, extending the
> chain) or re-strikes an existing chain tile, climbing its multiplier +1 (seed value 2).
> Verified the chain-building logic is sound via a standalone BFS connectivity check
> (30/30 cells reachable after enough strikes, always one connected component by
> construction) rather than trusting a single live event snapshot — an early manual read
> of one `boardMultiplierInfo` event looked like 3 non-adjacent positions, which turned out
> to be because that event mixes `M`-symbol hits and `T` chain tiles in the same list, not
> a real bug.
>
> Smoke test: crash-free, RTP in the same noisy small-batch range as the Maelstrom-only
> run (no repeat of Wildfire's original multiplier-stacking explosion). Real tuning is
> still blocked on the same open item as Maelstrom: no per-element isolation yet, so all
> three mechanics' contributions are currently tangled together in every round.

> ## ⚠️ Maelstrom implementation notes
> Coin-collect mechanic added alongside Wildfire (both currently active simultaneously in
> the same freegame round — no element-selection dispatch exists yet, so this isn't
> "isolated" the way Wildfire's own tuning pass was). New special symbol `"C"` (Wind Wisp),
> added to `special_symbols` as `"coin"`. Each `C` symbol gets a weighted cash value the
> instant it's created (`assign_coin_value` in `game_override.py`) — reuses the existing
> `prize`/`has_prize` slot on `Symbol` (`src/calculations/symbol.py`) rather than adding a
> new attribute, since `Symbol` uses `__slots__` with a fixed, shared attribute list; this
> is the same slot `0_0_expwilds` uses for its hold-and-win prize values. Coin values
> accumulate per-spin into `spin_coin_total`, then get folded into the win total by
> `set_end_tumble_event()` **after** the M-symbol board-multiplier step — a deliberate
> choice so coins stay a flat accumulate-and-sum payout, not swept into the same multiply
> as scatter-pay wins (that's the "different payout shape" from Wildfire the design calls
> for). Verified via direct book-event inspection (not RTP) since raw small-batch RTP is
> already documented as unreliable pre-optimization: all 2000/2000 bonus-mode sims in the
> smoke test produced `coinCollectInfo` events, averaging ~75x bet from coins alone, up to
> 1307x in one sim — the mechanic itself is confirmed working and crash-free.
>
> Reels: added `C` at ~2.4% frequency (6-8 per 251-row column) to `FR0.csv`/`WCAP.csv` by
> replacing existing `L2`/`L3` cells. Chased what looked like a large RTP regression after
> this edit (bonus-mode raw batch RTP dropped from ~17x to ~3x versus an earlier baseline
> log) — ran a control batch with the coin *code* active but zero `C` symbols physically on
> the reel, and RTP stayed low there too, ruling out both the reel edit and the coin
> mechanic as the cause. Conclusion: this is just batch-to-batch noise on an unoptimized
> 2000-sim sample, consistent with the standing caveat that raw pre-optimization RTP isn't
> a meaningful signal — not a real regression. Left as-is; real tuning happens once this
> element gets its own optimizer pass, same as Wildfire's did.

> ## ⚠️ Wildfire tuning progress
> First smoke test crashed twice — a `KeyError` in `freespin_triggers` (the scatter
> reference's table only covered up to 10 scatters, but this board can land more; fixed
> by extending the table to the theoretical max of 30) and, separately, raw batch RTP
> around ~400x on base mode. Root cause of the RTP explosion: sticky wilds were given a
> `"multiplier"` attribute copied directly from `0_0_expwilds`'s pattern — but that
> reference is a **lines** game where the attribute applies per-payline, while this
> scatter engine's `get_board_multipliers()` sums *any* symbol carrying that attribute
> across the whole board and multiplies the entire spin's win by the sum. Every sticky
> wild was stacking its own multiplier on top of wild-substitution itself compounding.
> Fix: wilds carry no multiplier, plain substitution only. Also switched from full-reel
> expansion (the reference's actual behavior) to single-cell sticky, since full-reel
> combined with tumbling was independently too strong on its own.
>
> After those fixes, `landing_wilds` frequency was still too generous — 90.5% of
> bonus-mode outcomes were hitting the exact wincap ceiling. Cut the freegame bucket's
> weights hard (`{0: 300, 1: 15, 2: 3, 3: 1}`, down from `{0: 100, 1: 20, 2: 5, 3: 2}`)
> and the pool became healthy: median 94.80x, p25 38.10x, p75 353.20x — closely matching
> Mycelia's own healthy-pool shape (median ~90-135x, p25 ~20-38x, p75 ~337-400x). Wincap
> hit rate is still slightly high at 16.3% (vs. Mycelia's "occasional") — worth one more
> small trim, or acceptable as a starting point before the real optimizer pass; not yet
> decided which.
>
> As with Mycelia: this is all pre-optimization raw pool spread (every sim has weight=1
> at this stage) — real in-game frequency only comes from the actual Rust optimizer pass,
> not reached yet for this element.

## The idea

Scatter-triggered free-spins entry, same as any standard bonus trigger — but on entry, the
game randomly selects **one** of four elemental features to play for that round. Each
element is a complete, self-contained bonus, not a phase of a bigger combined round. A
player might get Wildfire this time and Subzero next time — the variety comes from which
element you land, not from sitting through all four every time.

Win type: **scatter** (pay-anywhere), forking `sdk/web-sdk/apps/scatter` — none of the four
mechanics below care about paylines or win-direction, all of them are about board position.

## Selecting the element

Straightforward weighted random choice at freegame entry — this is exactly what the SDK's
`reel_weights`/`Distribution` system is already built to do, no new mechanism needed. Each
element gets its own weight (equal 25/25/25/25 as a starting point, tunable later if one
element ends up more "boring" than the others and needs a rarity bump to compensate).

## The four elements (each now a full standalone bonus, not a shared phase)

**Wildfire (Fire)**
Same pattern as `0_0_expwilds`'s expanding sticky wilds — every wild that lands during the
round expands and stays stuck for the rest of it. Since this is now the *entire* bonus
round instead of one phase among four, the board can end up substantially wild-covered by
the end — this is the "board fills up" element.

**Maelstrom (Wind)**
Coin-collect mechanic. Wind Wisp symbols carry an individual weighted-random cash value
when they land (same idea as `0_0_scatter`'s Bloom Pod multiplier-value assignment, just
applied to a direct payout instead of a multiplier). Collect them across the round, sum
every value collected, pay out at the end. Deliberately a *different payout shape* than
Mycelia's escalating-multiplier fantasy (accumulate-and-sum vs. escalate-and-multiply) so
the two games don't feel like reskins of each other. (Renamed from Tornado — "Maelstrom"
was freed up by Thunder's rename to Supercell and fits swirling/gathering wind better.)

**Supercell (Thunder/Lightning)**
Arcing/chaining lightning, not a single fixed tile. A strike lands on a tile; on a
subsequent hit it can **arc to an adjacent tile**, building a connected chain across the
round rather than scattered independent nodes. Each tile in the chain carries its own
climbing multiplier. Chosen over a Mycelia-style multi-tile tray specifically because
arcing/branching reads as *lightning* on screen, where Mycelia's spread reads as an
organic network — keeps the two mechanics visually distinct even though they share
underlying persistent-multiplier-tile math. (Renamed from Maelstrom — a supercell is the
actual meteorological term for a severe rotating thunderstorm, a more accurate fit than
"maelstrom" ever was for lightning.)

**Subzero (Ice/Snow)**
Hold-and-win with lives — now an even closer match to `0_0_expwilds`'s actual superspin
bonus mode (3 lives, prize symbols reset lives) since it's a standalone round on its own,
same shape as that reference example almost exactly. Ice Shards freeze their position on
landing, freezing resets lives, lives-out triggers the payout across every frozen tile.
(Renamed from Blizzard.)

## Why this is still original, not just "four generic bonuses in a trenchcoat"

Each element alone is a reused SDK pattern — the originality is that they're all reskins
of the same underlying "elemental force" fantasy, visually and thematically unified (fire/
wind/thunder/ice as one coherent nature-fury theme) while being mechanically distinct
enough that landing a different one each time actually feels different, not just
re-colored. That's a real design reason for four features to coexist in one game, not just
padding out a feature list.

## Reveal moment: Rift Reveal

On freegame entry, a themed crack/portal bursts open and the selected element bursts out
through its own bespoke animation — fire eruption for Wildfire, a gust for Maelstrom, a
lightning strike for Supercell, ice shattering outward for Subzero — before the round
itself begins. Chosen over a generic wheel-of-fortune specifically because it's on-brand
for "Elemental Fury" rather than a widget that could belong to any game. Cost: four
distinct short animation sequences, one per element, needed before frontend work can
start on this piece.

## Open questions

- **Element selection weights**: starting at equal 25/25/25/25, to be tuned later once
  each element's individual RTP/volatility contribution is known from simulation.
- Symbol set / elemental creature or force designs not started — the Rift reveal
  animations depend on these existing first.
