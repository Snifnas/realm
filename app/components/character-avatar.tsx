"use client";

export type CharacterGear = {
  slot: string;
  name: string;
  rarity: string;
  design_key?: string;
  item_key?: string;
  sprite_variant?: number;
};

type WearableSlot =
  | "cloak" | "legs" | "boots" | "chest" | "gloves"
  | "accessory" | "shield" | "weapon" | "helmet";

const RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythic"] as const;
const WEARABLE_ORDER: readonly WearableSlot[] = [
  "cloak", "legs", "boots", "chest", "gloves",
  "accessory", "shield", "weapon", "helmet"
];

/**
 * Every wearable sheet has six 1086 x 1448 transparent frames in rarity order.
 * The base body is also 1086 x 1448. All layers share precisely the same
 * coordinate system, so equipment cannot distort or resize the character.
 * Collectible inventory icons are NEVER used as wearable body layers.
 */
function Wearable({ slot, item }: { slot: WearableSlot; item: CharacterGear }) {
  const rarity = item.rarity?.toLowerCase() || "common";
  const index = Math.max(0, RARITIES.indexOf(rarity as typeof RARITIES[number]));
  // Reuse the item catalogue's four stable variants without changing wearable bounds.
  const styleVariant = Math.max(0, Math.min(3, Math.floor(item.sprite_variant ?? 0)));
  return (
    <span
      key={slot}
      className={"avatar-wearable avatar-wearable-" + (slot === "cloak" ? "behind" : "front")}
      data-slot={slot}
      data-rarity={rarity}
      data-design={item.design_key || item.item_key || ""}
      data-variant={styleVariant}
      aria-hidden="true"
      style={{
        backgroundImage: 'url("/wearables/wearable-' + slot + '.webp")',
        backgroundPosition: (index * 20) + "% 0%"
      }}
    />
  );
}

export default function CharacterAvatar({
  equipment = [],
  backgroundPath = "/backgrounds/bg-starter-village.webp"
}: {
  equipment?: CharacterGear[];
  backgroundPath?: string;
}) {
  const equipped: Partial<Record<WearableSlot, CharacterGear>> = {};
  for (const item of equipment) {
    if (WEARABLE_ORDER.includes(item?.slot as WearableSlot) && item?.name) {
      equipped[item.slot as WearableSlot] = item;
    }
  }

  const entries = WEARABLE_ORDER.filter(slot => equipped[slot]).map(slot => equipped[slot]!);
  const description = entries.length
    ? "Character wearing " + entries.map(item => item.name).join(", ")
    : "Character in boxer shorts with no equipment";

  return (
    <div className="avatar-stage" role="img" aria-label={description}>
      <div
        className="avatar-village"
        aria-hidden="true"
        style={{ backgroundImage: 'url("' + backgroundPath + '")' }}
      />
      <div className="avatar-vignette" aria-hidden="true" />
      <div className="avatar-character">
        {equipped.cloak && <Wearable slot="cloak" item={equipped.cloak} />}
        <img
          className="avatar-art"
          src="/character-boxers-hd.webp"
          alt=""
          draggable={false}
        />
        {WEARABLE_ORDER.filter(slot => slot !== "cloak").map(slot =>
          equipped[slot] ? <Wearable key={slot} slot={slot} item={equipped[slot]!} /> : null
        )}
      </div>
      <div className="avatar-status" aria-hidden="true">
        <span>✦</span>
        {entries.length ? entries.length + " / 9 EQUIPMENT SLOTS" : "STARTING GEAR · BOXERS"}
      </div>
    </div>
  );
}
