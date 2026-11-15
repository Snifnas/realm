import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const slots = ["cloak", "legs", "boots", "chest", "gloves", "accessory", "shield", "weapon", "helmet"];
const baseWidth = 1086;
const baseHeight = 1448;

function inspectWebp(file) {
  const bytes = readFileSync(join(ROOT, file));
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF", file + " is not RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP", file + " is not WebP");
  assert.equal(bytes.toString("ascii", 12, 16), "VP8X", file + " needs extended WebP metadata");
  assert.ok(bytes[20] & 0x10, file + " must preserve transparency");
  return {
    width: bytes.readUIntLE(24, 3) + 1,
    height: bytes.readUIntLE(27, 3) + 1
  };
}

assert.deepEqual(inspectWebp("public/character-boxers-hd.webp"), { width: baseWidth, height: baseHeight });
for (const slot of slots) {
  const file = "public/wearables/wearable-" + slot + ".webp";
  assert.deepEqual(
    inspectWebp(file),
    { width: baseWidth * 6, height: baseHeight },
    file + " must contain six aligned rarity frames"
  );
}
console.log("Verified HD paper-doll assets: base + " + slots.length + " wearable sheets, six rarities each.");
