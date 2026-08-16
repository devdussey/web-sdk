SPECIAL NOTE: The technical specs like size, symbols, and design is what the focus is here. The agent didnt know the volatility or system. The stake game engine sdk is priority

# **Elemental Fury: Technical Specification Document**

**Document Version:** 1.0 **Date:** May 21, 2024 **Scope:** Covers the 6x5 grid architecture, complete symbol catalog (H1-H4, L1-L4, Specials), base board design, and final environmental background specifications for the *Elemental Fury* slot game.

## Asset Roadmap (as of 2026-08-15)

This spec predates Maelstrom/Supercell/Subzero's math implementation, so it only
documents Wild/Scatter/Multiplier as specials — the three symbols below are real,
required game symbols now (see `special_symbols` in `game_config.py`) with no spec entry
and no art yet.

### Done
- Low-pay sigils L1-L4 — all 4 present (`symbols/L1`-`L4`).
- High-pay harbingers H1-H4 — all 4 present (`symbols/H1`-`H4`).
- Wild — both base (`SYM_WILD_BASE.svg`) and Wildfire-ignited (`SYM_WILDFIRE_FS.svg`)
  versions present. Confirmed with JP these are two visual states of the same
  math-engine "W" symbol, not two separate mechanics — no reel-driven base wild needed.
- Scatter, Multiplier — present.
- Board frame (`boards/base6x5/BASE6x5.svg`) — corner brackets, header plaque, and inner
  backing are all baked into this one file already (confirmed by contents).
- Base game background — 2 candidate versions to choose between (`BG_BASE.svg`,
  `BG_BASE2.svg`).
- All 4 elemental freegame arena backgrounds — Wildfire, Maelstrom, Supercell, Subzero.

### Missing — new special symbols, no folder or art yet
- **Coin** (`"C"`, Maelstrom's Wind Wisp) — direct-cash-value collectible, lands and
  pays out flat, summed across the round.
- **Lightning / chain tile** (`"T"`, Supercell) — persistent multiplier tile, needs a
  visual state for "just struck" vs "climbing multiplier value" (re-struck tile).
- **Ice Shard** (`"I"`, Subzero) — freezes in place holding a cash value; needs a
  visual state for "frozen this round" that reads clearly against the ice-cavern
  background.

### Needs a decision, not new art
- `BG_MAELSTROM.jpeg` is a 2.7MB raster JPEG — every other background is a lightweight
  SVG. Won't scale as cleanly (raster vs vector) and is roughly 200x the file size of
  its siblings. Worth converting/redoing as SVG to match the pipeline, or confirming
  JPEG is an intentional exception for this one.
- Two base-background candidates (`BG_BASE.svg` / `BG_BASE2.svg`) — pick one, or keep
  both as alternates if that's intentional.

## **1\. Game Overview & Core Engine**

### **1.1 Grid Architecture**

* **Grid Dimensions:** 6 Columns × 5 Rows (30 Active Visible Cells).  
* **Grid Orientation:** Landscape.  
* **Target Viewport:** 1920 × 1080 px (16:9).

### **1.2 Win Mechanism**

* **Win Type:** Pay-Anywhere Scatter.  
* **Win Trigger:** Matching symbols land in quantities of 8 or more, regardless of grid position or connection.

### **1.3 Tumble / Cascade System**

* Winning symbols shatter and are removed from the grid.  
* Remaining symbols fall to the lowest available vertical cell.  
* New symbols spawn from above to fill empty spaces.

### **1.4 Volatility & RTP Tiers**

* **Volatility Profile:** High / Extreme (Hacksaw-style distribution profile).  
* **Target RTP:** Standard configuration (e.g., 96.25%).

## **2\. Symbol Specifications**

### **2.1 Low-Pay Sigils (Sigil Tablet Series)**

These symbols utilize dark basalt or slate bases with recessed, high-saturation, neon-glow rune carvings and heavy comic outlines.

| Symbol ID | Type | Filename | Key Motif & Palette | Behavior |
| :---- | :---- | :---- | :---- | :---- |
| SYM\_L1 | Low-Pay | SYM\_L1\_WILDFIRE.svg | Chiseled charred basalt with aggressive dual-flame recessed rune slash (\#DC2626, \#FBBF24). | Normal Scatter win |
| SYM\_L2 | Low-Pay | SYM\_L2\_MAELSTROM.svg | Weathered dark slate disc with intense white/grey curled wind gusts, internal streams, and silver dust (\#FFFFFF, \#CBD5E1). | Normal Scatter win |
| SYM\_L3 | Low-Pay | SYM\_L3\_SUPERCELL.svg | Angular basalt diamond with roiling heavy black storm clouds and a violent purple lightning bolt (\#9333EA, \#C084FC). | Normal Scatter win |
| SYM\_L4 | Low-Pay | SYM\_L4\_SUBZERO.svg | Hexagonal frosted granite tablet with an intricate 6-fold dendritic snowflake sigil (\#0284C7, \#E0F2FE). | Normal Scatter win |

### **2.2 High-Pay Harbingers (Character Series)**

These symbols are character-based brawlers representing the four elements, with intense atmospheric glow and complex comic outlines.

| Symbol ID | Type | Harboringer / Element | Primary Colors | Behavior |
| :---- | :---- | :---- | :---- | :---- |
| SYM\_H1 | High-Pay | Wildfire (Demon Brawler) | Crimson, Magma Amber (\#DC2626, \#FBBF24) | Normal Scatter win |
| SYM\_H2 | High-Pay | Maelstrom (Tornado Wraith) | Abyssal Teal, Mint Gale (\#0D9488, \#5EEAD4) | Normal Scatter win |
| SYM\_H3 | High-Pay | Supercell (Thunder & Lightning Storm) | Electric Violet, Magenta (\#7E22CE, \#C084FC) | Normal Scatter win |
| SYM\_H4 | High-Pay | Subzero (Glacial Ice Titan) | Glacial Ice Cyan, White (\#0284C7, \#E0F2FE) | Normal Scatter win |

### **2.3 Specials & Features**

| Symbol ID | Type | Filename | Motif & Behavior | Substitution Rule |
| :---- | :---- | :---- | :---- | :---- |
| SYM\_WILD | Wild | SYM\_WILD\_BASE.svg | Cosmic Singularity Elemental Vortex (All 4 colors fused). Normal Wild behavior. | Substitutes all symbols *except* Scatters and Multipliers |
| SYM\_WILD\_STICKY | Special Wild | SYM\_WILD\_IGNITED.svg | Spreading Erupting Flame Sticky Wild (Locks on grid during specified modes). Redesigned from fractured skull. | Substitutes all symbols *except* Scatters and Multipliers |
| SYM\_SCATTER | Scatter | SYM\_SCATTER\_OVERLOAD.svg | Overload Clash Plaque ("FS" Sigil). Trigger for Freegame selection. | Does not get substituted. |
| SYM\_MULT | Multiplier | SYM\_MULT\_BASE.svg | Prismatic Multiplier Crystal with orbiting kinetic shards and internal energy conduits. Redesigned from amethyst chassis. Accumulates multipliers in cascades. *See 2.4 for Text Rendering Rules*. | Does not get substituted. |

### **2.4 Multiplier Numeric Text Rendering Rules**

The Multiplier symbol utilizes dynamic runtime text rendering.

* **Font Family:** 'Impact', 'Arial Black', sans-serif  
* **Font Size:** Masters are 82 px (scaled by game engine factor 0.3125 to 32 px final on 160x160 px cell).  
* **Anchor:** Centered at local coordinate (x: 256, y: 285).  
* **Style:** 12 px black shadow drop, 2.5 px \#F472B6 inner stroke on \#FFFFFF fill. exterior magenta drop glow.

## **3\. Board Specifications (6x5 Grid)**

### **3.1 Chassis Dimensions & Anchor Points**

* **Chassis Asset:** BOARD\_FRAME\_6X5.svg  
* **Dimensions:** 1200 × 1020 px.  
* **Grid Offset (Playing Area):** 960 × 800 px located at local offset (x: 120, y: 110).  
* **Base Game Viewport Anchor:** Board Frame centered at (x: 360, y: 30\) within 1920x1080 canvas.

### **3.2 Cell Metrics**

* **Individual Cell Size:** Exactly 160 × 160 px (Square 1:1 Aspect Ratio).  
* **Grid Dividers (Reel Rails):** Local x positions: 160, 320, 480, 640, 800\.  
* **Grid Padding/Margin:** 0 px internal.

### **3.3 Special Board Components**

* **Corner Harbinger Brackets (4):** Symmetrical element-specific clamps (Ice TL, Fire TR, Storm BL, Wind BR).  
* **Header Plaque:** Chiseled title plaque ("ELEMENTAL FURY").  
* **Inner Board Backing:** Translucent semi-transparent slate radial gradient.

## **4\. Background & Environment Specifications**

### **4.1 Base Game: Cosmic Rift Singularity**

* **Filename:** BG\_BASE\_RIFT\_CORE.svg  
* **Visual Style:** Redesigned from terrain to a cosmic plasma clash core.  
* **Core Feature:** A large central event horizon void ring (behind the reel grid area) where all four elements collide in balanced suction spirals (Ice TL, Fire TR, Storm BL, Wind BR).  
* **Purpose:** Provide neutral environmental framing that enhances foreground symbol contrast.

### **4.2 Freegame Arenas (4 Bonus Worlds)**

These are element-specific bonus round backgrounds, redesigned to single immersive environments.

| Arena Asset | Harbinger / Mode | Redesigned Environment Motif | Contrast Requirement |
| :---- | :---- | :---- | :---- |
| BG\_FS\_WILDFIRE.svg | **Wildfire** (Fire) | **Burning Forest Wildfire Inferno:** Distant burning pine ridges, towering coniferous trees engulfed in crowning flames, glowing fissures, fallen logs, and a dense red ash/smoke night sky. | Dark charred center, intense flank eruptions. |
| BG\_FS\_MAELSTROM.svg | **Maelstrom** (Wind) | **Eye of the Hurricane Void:** Massive, turbulent, perspective-warping hurricane cloud walls (teal/charcoal), forming a giant central wind funnel with coiling white/grey gale blades. Floating debris (slate islands, structures) are visible in the outer vortex. | Dark cyclone eye center, high-speed outer vortex. |
| BG\_FS\_SUPERCELL.svg | **Supercell** (Storm) | **High-Voltage Thundercloud Chasm:** Roiling cumulonimbus clouds in deep violets and purples form a chasm, lit by constant purple sheet lightning and violent vertical grounding bolts. Torrental rain streaks and voltage sparks integrated. | Deep dark purple void, perimeter lightning. |
| BG\_FS\_SUBZERO.svg | **Subzero** (Ice) | **Glacial Frost Fortress Cavern:** Vast glacial ice caverns and permafrost abysses. Hanging crystal icicles, colossal glacier monoliths, and glowing cyan runic fissures and star sigils on the ice structures. Blinding frost mist blooms. | Abyssal permafrost void with crystal side-lighting. |

