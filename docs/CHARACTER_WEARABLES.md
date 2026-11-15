# REALM HD wearable paper-doll specification

The character is composed from a **1086 × 1448 transparent base image** (`public/character-boxers-hd.webp`) and up to nine transparent wearable overlays. Each overlay uses the **same 1086 × 1448 coordinate system**. No individual layer may alter the character's aspect ratio, size, origin, or alignment.

## Slots and layer order

`cloak` renders behind the body. The body renders next. Then, in order: `legs`, `boots`, `chest`, `gloves`, `accessory`, `shield`, `weapon`, `helmet`. The boxer shorts are part of the base image and remain visible when no trousers are equipped.

## Rarities and asset paths

For each slot, `public/wearables/wearable-{slot}.webp` is a transparent **6516 × 1448 atlas** with six equal 1086 × 1448 frames in this exact order:

1. common
2. uncommon
3. rare
4. epic
5. legendary
6. mythic

The renderer sets `background-size:600% 100%` and `background-position-x` to 0%, 20%, 40%, 60%, 80% or 100%. Never crop, scale or stretch the layer independently of the base body.

## Data and safety

The renderer receives **only the user's actually equipped inventory rows** from the existing Gear tab. It must never alter XP, item ownership, rarity, stats, loot odds or any database rules. Item icons shown in Gear are separate collectibles and must not be placed on the avatar as armour.

Missing equipment slots show the base body underneath. Unknown rarities safely use the common visual frame. For future item-specific skins, add variants designed on this same coordinate canvas, keyed by `design_key`, while retaining slot/rarity fallback. Do not stretch an inventory icon to create a wearable skin.

## Verification checklist

- Empty inventory: character wearing only boxer shorts, with no helmet or armour.
- One equipped chest: shoulders, waist and neck line up with the same body.
- All nine equipped: cloak behind the character, all other layers in the correct order.
- Six rarities: the correct frame appears for each tier.
- Equip and unequip: avatar changes immediately without refreshing the page.
- Narrow iPhone viewport: the avatar keeps the 1086:1448 ratio, the scene fills the card and nothing overflows.
- Missing wearable asset: fix the asset path or use the boxer-shorts fallback, never a distorted item icon.
