"use client";

export type CharacterGear = {
  slot: string;
  name: string;
  rarity: string;
  design_key?: string;
  item_key?: string;
};

type Palette = { main: string; light: string; dark: string; trim: string; gem: string };
const palettes: Record<string, Palette> = {
  common: { main: "#96958e", light: "#d9d3c4", dark: "#565862", trim: "#a47a4a", gem: "#a9bcb4" },
  uncommon: { main: "#54855c", light: "#b0d88d", dark: "#2d503b", trim: "#c7aa65", gem: "#a4f5b9" },
  rare: { main: "#417fbf", light: "#a7dbfa", dark: "#2b447e", trim: "#e8bf7c", gem: "#72f0f9" },
  epic: { main: "#975bc0", light: "#e3b4f9", dark: "#502775", trim: "#f0c988", gem: "#e790fa" },
  legendary: { main: "#d69b3d", light: "#ffdf83", dark: "#89521c", trim: "#fff0b7", gem: "#ff9853" },
  mythic: { main: "#bd4157", light: "#ff9a7e", dark: "#651e4a", trim: "#ffe298", gem: "#ff5063" }
};
const p = (item?: CharacterGear) => palettes[(item?.rarity || "common").toLowerCase()] || palettes.common;
const high = (item?: CharacterGear) => ["epic", "legendary", "mythic"].includes((item?.rarity || "").toLowerCase());
const named = (item: CharacterGear | undefined, re: RegExp) => re.test(((item?.name || "") + " " + (item?.design_key || "")).toLowerCase());
const outline = { stroke: "#292431", strokeWidth: 2.1, strokeLinejoin: "miter" as const };

/** Layered pixel-art paper doll driven by the same is_equipped inventory rows used by the gear screen. */
export default function CharacterAvatar({ equipment = [] }: { equipment?: CharacterGear[] }) {
  const equipped: Record<string, CharacterGear> = {};
  for (const item of equipment) if (item?.slot && item?.name) equipped[item.slot] = item;
  const { helmet, chest, legs, boots, gloves, shield, cloak, weapon, accessory } = equipped;
  const H = p(helmet), C = p(chest), L = p(legs), B = p(boots), G = p(gloves);
  const S = p(shield), K = p(cloak), W = p(weapon), A = p(accessory);
  const noEquipment = Object.keys(equipped).length === 0;
  const description = noEquipment
    ? "Unarmoured character wearing just boxer shorts"
    : "Character wearing " + Object.values(equipped).map(item => item.name).join(", ");
  const weaponType = named(weapon, /staff|wand|sceptre|scepter|rod|prism/) ? "staff"
    : named(weapon, /bow|crossbow/) ? "bow"
    : named(weapon, /axe|cleaver/) ? "axe"
    : named(weapon, /hammer|maul/) ? "hammer"
    : named(weapon, /spear|pike|lance/) ? "spear" : "sword";

  return <div className="avatar-stage" role="img" aria-label={description}>
    <svg className="avatar-landscape" viewBox="0 0 380 280" preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
      <defs>
        <linearGradient id="realm-character-sky" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#6faed2"/><stop offset=".55" stopColor="#b1ccce"/><stop offset="1" stopColor="#e2c391"/>
        </linearGradient>
        <linearGradient id="realm-character-grass" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#76a465"/><stop offset="1" stopColor="#356548"/>
        </linearGradient>
      </defs>
      <path d="M0 0H380V280H0Z" fill="url(#realm-character-sky)"/>
      <path d="M278 30h33v8h14v10h-57V38h10zM93 53h34v7h15v9H75v-9h18z" fill="#fff4d5"/>
      <path d="m0 164 62-84 26 39 57-73 70 112 59-78 45 56 31-49 30 39v154H0Z" fill="#769bb0"/>
      <path d="m48 98 14-18 14 21-14-5zm76-25 21-27 26 38-26-9zm178 28 16-20 14 23-14-6z" fill="#d9e9e3"/>
      <path d="m0 186 54-38 67 37 57-33 55 32 48-35 57 30 42-33v134H0Z" fill="#548879"/>
      <path d="m0 206 66-41 78 43 70-31 70 29 96-36v110H0Z" fill="#336e5e"/>
      <path d="m0 220 71-23 60 11 88-13 87 19 74-21v87H0Z" fill="url(#realm-character-grass)"/>
      <path d="m138 280 40-72 16-7 13 5 46 74Z" fill="#ad9a74"/>
      <path d="m159 280 23-69 9-4 30 73Z" fill="#d6bc89"/>
      <path d="m0 188 20-61 29 61zm21 8 20-83 37 83zm319 4 19-89 21 89z" fill="#254d3c"/>
      <path d="m0 189 20-66 28 66zm19 1 28-78 32 78zm316 8 21-80 24 80z" fill="#4c8356"/>
      <path d="M299 161h57v47h-57Z" fill="#82563d"/>
      <path d="M305 158h48v50h-48Z" fill="#e2b87e"/>
      <path d="m292 160 34-31 37 31Z" fill="#9e5947"/>
      <path d="m303 159 24-21 25 21Z" fill="#d98d57"/>
      <path d="M318 182h13v26h-13Z" fill="#5b4a41"/>
      <path d="M338 173h8v11h-8Z" fill="#ffe49b"/>
      <path d="M272 195h108v6H272Z" fill="#8b613a"/>
      <path d="M15 182h12v59H15ZM26 196h48v7H26Zm0 21h55v8H26Z" fill="#754f35"/>
      <path d="M15 171h15v13H15Z" fill="#f0d18a"/>
      <path d="M0 0h47v17h16v18H52v19H0Z" fill="#2b4a39"/>
      <path d="M0 0h73v13H56v15H25v17H0Z" fill="#558454"/>
      <path d="M0 0h38v15H0Zm35 13h26v8H35Z" fill="#85b25d"/>
      <g fill="#f8da83"><path d="M55 242h5v5h-5zm20 10h6v5h-6zm237-17h4v4h-4zm20 8h4v4h-4z"/></g>
      <path d="M0 0h380v280H0Z" fill="#152016" opacity=".1"/>
    </svg>

    <svg className="avatar-figure" viewBox="0 0 160 210" shapeRendering="crispEdges" aria-hidden="true">
      <defs><filter id="realm-avatar-ground-shadow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="3"/></filter></defs>
      <ellipse cx="79" cy="201" rx="51" ry="7" fill="#122518" opacity=".6" filter="url(#realm-avatar-ground-shadow)"/>
      {cloak && <g {...outline}>
        <path d="M52 80 37 92 30 176 47 183 65 168 81 183 112 174 120 92 100 81 84 93 66 87Z" fill={K.dark}/>
        <path d="M50 84 44 104 40 171 51 176 67 159 81 172 108 165 112 94 99 84 80 98Z" fill={K.main}/>
        <path d="M43 139 43 169 51 173 56 155zm59-36 5 57-18 11 10-45Z" fill={K.light}/>
        {high(cloak) && <path d="m44 166 11 7 12-13 14 12 21-11" fill="none" stroke={K.trim} strokeWidth="3"/>}
      </g>}

      {/* Base body: boxers are always the minimum outfit. */}
      <g {...outline}>
        <path d="M59 125h43v27H87v35H72v-35H60l-4 35H42v-39l10-19Z" fill="#c78965"/>
        <path d="M61 129h18v55h-7v-40H59zm18 3h14v21H79Z" fill="#efb98d"/>
        <path d="M43 179h17v8H43zm31 0h18v8H74Z" fill="#ac7053"/>
        <path d="M40 186h23v9H35v-5zm31 0h22l9 9H70Z" fill="#e4ab7d"/>
        <path d="M40 189h15v4H40zm34 0h14v4H74Z" fill="#f8d3a4"/>
        <path d="M59 125h43v22H81v-5h-4v5H58Z" fill="#cfbb9d"/>
        <path d="M61 127h39v6H61Z" fill="#f7e5c2"/>
        <path d="M62 135h14v7H62zm20 0h15v7H82Z" fill="#617b9f"/>
        <path d="M78 135h4v8h-4Z" fill="#ecddbb"/>
      </g>

      <g {...outline}>
        <path d="M58 71 47 77 43 98 49 123 58 133 100 132 108 120 109 93 99 77 89 72 84 65 68 65Z" fill="#c88962"/>
        <path d="M60 76 52 83 49 99 56 122h40l8-25-9-15-9-7Z" fill="#e8b58d"/>
        <path d="M57 92h11v4H57zm25 0h12v4H82zm-12 17h15v3H70Z" fill="#ce926d"/>
        <path d="M61 120h33v4H61Z" fill="#f2c493"/>
        <path d="M56 77 45 79 36 108 32 135 41 144 51 136 56 109 62 94Z" fill="#d89c75"/>
        <path d="M99 77 112 79 121 109 123 135 113 144 103 136 100 111 94 93Z" fill="#d19471"/>
        <path d="M44 94 39 115 38 127h8l6-27zm64 0 7 30h7l-9-36Z" fill="#f2c093"/>
        <path d="M34 134h17v13l-7 5-12-7zm79 0h14v12l-10 7-10-8Z" fill="#c78b69"/>
        <path d="M37 137h9v9h-9zm75 0h9v9h-9Z" fill="#f3c7a0"/>
        <path d="M69 63h18v16H69Z" fill="#d89c74"/>
        <path d="M72 65h13v9H72Z" fill="#f2bf94"/>
      </g>
      <g {...outline}>
        <path d="M60 34 65 24 76 19 90 24 99 36v19l-9 12H66L58 53Z" fill="#b47b57"/>
        <path d="M62 33 68 28h22l5 9v15l-6 10H69l-7-12Z" fill="#efbc95"/>
        <path d="M59 39V28l8-9 13-3 14 5 6 11-4 16-6-9-3-7-7 3-13-3-7 10Z" fill="#322728"/>
        <path d="M66 21h13v7H66zm15-1h10v5H81Z" fill="#75513b"/>
        <path d="M64 37h9v4h-9zm23-1h8v4h-8Z" fill="#a46c50"/>
        <path d="M69 45h5v5h-5zm14 0h5v5h-5Z" fill="#2c2a31" stroke="none"/>
        <path d="M74 43h3v2h-3zm14 0h3v2h-3Z" fill="#fff8d9" stroke="none"/>
        <path d="M77 54h9v3h-9Z" fill="#ba785b" stroke="none"/>
        <path d="M61 42h-5v9h5zm35 0h5v9h-5Z" fill="#d59a70"/>
      </g>

      {legs && <g {...outline}>
        <path d="M57 127h46l-5 24-5 39H74l-3-34-4 34H46l3-42Z" fill={L.dark}/>
        <path d="M61 130h37v12H61ZM52 149h16l-3 31H48Zm24 0h18l-4 31H78Z" fill={L.main}/>
        <path d="M56 155h12v7H55Zm26 0h11v7H81ZM54 169h12v4H52Zm28 0h9v4h-8Z" fill={L.light}/>
        <path d="M58 130h40v5H58Z" fill={L.trim}/>
        {high(legs) && <><path d="m53 148 8-5 7 5-8 6Zm30 0 8-5 6 5-7 6Z" fill={L.gem}/><path d="M62 142v34M88 142v34" stroke={L.trim} strokeWidth="2"/></>}
      </g>}
      {boots && <g {...outline}>
        <path d="M45 170h23l-3 19 8 7-5 6H34l-3-7 9-7Zm33 0h20v19l10 6-5 7H72l-4-7 10-8Z" fill={B.dark}/>
        <path d="M48 173h16v16l-23 8h-6l10-11Zm34 0h12v17l7 7H75l6-9Z" fill={B.main}/>
        <path d="M39 194h30v4H36Zm36 1h29v4H74Z" fill={B.light}/>
        <path d="M48 180h15M80 180h13" stroke={B.trim} strokeWidth="3"/>
        {high(boots) && <path d="M52 176h6v6h-6zm31 0h6v6h-6Z" fill={B.gem}/>}
      </g>}
      {chest && <g {...outline}>
        <path d="m56 78-12 7 7 26 6 25h44l6-26 5-25-14-7-12 8H68Z" fill={C.dark}/>
        <path d="m59 79-9 9 8 40h41l8-40-10-9-15 9h-9Z" fill={C.main}/>
        <path d="M62 87h15l3 19-10 13-10-10Zm20 0h13l5 24-9 9-11-14Z" fill={C.light} opacity=".8"/>
        <path d="M59 119h41v7H59Z" fill={C.trim}/>
        <path d="M75 86 79 93 83 86" fill="none" stroke={C.trim} strokeWidth="3"/>
        <path d="M70 126h20v7H70Z" fill={C.dark}/><path d="M75 124h10v9H75Z" fill={C.trim}/>
        {high(chest) && <><path d="m79 96 8 9-8 10-8-10Z" fill={C.gem}/><path d="M54 90 61 94M105 90 98 94" stroke={C.trim} strokeWidth="3"/></>}
        {named(chest, /robe|tunic|weave|vest/) && <path d="M58 125 52 148 70 151 81 142 95 151 105 147 99 125Z" fill={C.main}/>}
        <path d="M43 87 50 77 63 82 56 97 44 100ZM94 82 106 77 115 86 114 99 102 97Z" fill={C.dark}/>
        <path d="M47 84 58 86 55 93 46 94Zm52 2 11-2 2 10-9-1Z" fill={C.light}/>
      </g>}
      {gloves && <g {...outline}>
        <path d="M33 121h18l-2 17-7 9-13-10Zm75 0h19l5 17-13 9-11-10Z" fill={G.dark}/>
        <path d="M35 125h14l-2 12-6 6-8-7Zm75 0h15l4 12-11 6-9-7Z" fill={G.main}/>
        <path d="M33 124h17v4H33Zm77 0h16v4h-16Z" fill={G.trim}/>
        {high(gloves) && <path d="M39 133h6v5h-6Zm75 0h6v5h-6Z" fill={G.gem}/>}
      </g>}
      {accessory && <g>
        <path d="M66 74 79 88 94 74" fill="none" stroke={A.trim} strokeWidth="3" strokeLinecap="square"/>
        <path d="m79 86 7 9-7 11-7-11Z" fill={A.dark} {...outline}/>
        <path d="m79 89 4 6-4 7-4-7Z" fill={A.gem}/>
        <path d="M77 91h3v4h-3Z" fill={A.light}/>
      </g>}
      {shield && <g {...outline}>
        <path d="M10 94h36l3 46-22 21-20-20Z" fill={S.dark}/>
        <path d="M14 98h29l2 39-18 18-15-17Z" fill={S.main}/>
        <path d="M16 102h25v8H16Z" fill={S.light}/>
        <path d="M28 104v45" stroke={S.trim} strokeWidth="4"/>
        <path d="m20 125 8-8 8 8-8 13Z" fill={S.trim}/>
        {high(shield) && <path d="m28 118 8 8-8 11-8-11Z" fill={S.gem}/>}
      </g>}
      {weapon && <g {...outline}>
        {weaponType === "sword" && <>
          <path d="m116 135 4-11 19-67 12-14-2 20-17 65-8 12Z" fill={W.dark}/>
          <path d="m123 124 20-64 4-8-3 16-17 58Z" fill={W.light}/>
          <path d="m105 127 29 9-3 8-29-10Z" fill={W.trim}/>
          <path d="m119 133-8 25 7 5 10-27Z" fill="#5e402c"/>
          <path d="m111 154 13 4-4 7-12-4Z" fill={W.trim}/>
          {high(weapon) && <path d="m139 69 4-12-1 13-16 55Z" fill={W.gem}/>}
        </>}
        {weaponType === "staff" && <>
          <path d="m117 156 24-111 5 1-24 113Z" fill="#734d38"/>
          <path d="m141 32 16 18-14 17-14-17Z" fill={W.dark}/>
          <path d="m142 38 10 12-9 12-9-12Z" fill={W.gem}/>
          <path d="M125 120h12v5h-12Z" fill={W.trim}/>
          {high(weapon) && <path d="m138 27 5-9 5 11 9 4-9 2Z" fill={W.light}/>}
        </>}
        {weaponType === "axe" && <>
          <path d="m111 157 27-91 8 3-28 91Z" fill="#734b32"/>
          <path d="m130 52 24-6 6 24-16 18-17-8Z" fill={W.dark}/>
          <path d="m139 55 16-5 2 18-12 11-10-6Z" fill={W.light}/>
          <path d="M122 112h12v5h-12Z" fill={W.trim}/>
        </>}
        {weaponType === "hammer" && <>
          <path d="m117 155 20-86 8 3-21 85Z" fill="#705139"/>
          <path d="M123 50h34v28h-34Z" fill={W.dark}/>
          <path d="M126 53h27v13h-27Z" fill={W.main}/>
          <path d="M129 55h22v4h-22Z" fill={W.light}/>
        </>}
        {weaponType === "spear" && <>
          <path d="m111 170 30-128 5 2-29 128Z" fill="#725038"/>
          <path d="m142 11 13 28-16 19-6-20Z" fill={W.dark}/>
          <path d="m142 18 8 20-9 14-5-13Z" fill={W.light}/>
        </>}
        {weaponType === "bow" && <>
          <path d="M130 40Q179 90 123 163" fill="none" stroke={W.dark} strokeWidth="9"/>
          <path d="M130 40Q179 90 123 163" fill="none" stroke={W.main} strokeWidth="4"/>
          <path d="M130 40 123 163" stroke="#eddeb8" strokeWidth="2"/>
          <path d="M109 106h45" stroke={W.trim} strokeWidth="3"/>
          <path d="m152 99 9 8-9 8Z" fill={W.light}/>
        </>}
      </g>}
      {helmet && <g {...outline}>
        {named(helmet, /hood|cowl|cap/) ? <>
          <path d="m59 48-8-14 7-21 18-8 17 8 11 23-8 16-8-15-24 1Z" fill={H.dark}/>
          <path d="m56 34 5-17 16-7 14 7 7 17-9-8-29 5Z" fill={H.main}/>
          <path d="M63 15h24l6 7H60Z" fill={H.light}/>
          <path d="M56 35h8v17h-8Zm35 0h9v17h-9Z" fill={H.dark}/>
        </> : named(helmet, /crown|circlet|diadem/) ? <>
          <path d="m57 37 2-23 14 13 9-20 10 20 11-13 2 23Z" fill={H.main}/>
          <path d="M59 33h44v9H59Z" fill={H.dark}/>
          <path d="m78 29 5-7 5 7-5 6Z" fill={H.gem}/>
          <path d="M62 35h38v4H62Z" fill={H.light}/>
        </> : <>
          <path d="M56 40V25L66 13l19-4 15 9 7 19-9 20h-9l-2-19H69l-2 19H58Z" fill={H.dark}/>
          <path d="m60 35 3-14 13-8h11l12 8 4 15H89l-7-8-13 8Z" fill={H.main}/>
          <path d="M68 19h17l9 8-24 5-11-1Z" fill={H.light}/>
          <path d="M56 40h17v7H56Zm31 0h19v7H87Z" fill={H.main}/>
          <path d="M76 12h6v21h-6Z" fill={H.trim}/>
          {high(helmet) && <path d="m78 18 6 6-6 8-6-8Z" fill={H.gem}/>}
        </>}
      </g>}
      <path d="M58 64h5v3h-5Zm39 29h3v4h-3Z" fill="#fff8d4" opacity=".3"/>
    </svg>
    <div className="avatar-status" aria-hidden="true">
      <span className="avatar-status-icon">✦</span>
      <span>{noEquipment ? "JUST BOXERS" : "EQUIPMENT ACTIVE"}</span>
    </div>
  </div>;
}
