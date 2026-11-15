"use client";

export type CharacterGear = {
  slot: string;
  name: string;
  rarity: string;
  design_key?: string;
  item_key?: string;
};

type ColourSet = { metal:string; light:string; shadow:string; trim:string; gem:string };
const colours:Record<string,ColourSet> = {
  common: {metal:"#9e9c91",light:"#d5d4c7",shadow:"#50545a",trim:"#9b7252",gem:"#d4d5c9"},
  uncommon: {metal:"#548d61",light:"#b3d891",shadow:"#294e40",trim:"#dab66a",gem:"#7be9b0"},
  rare: {metal:"#3b80c8",light:"#b1e8ff",shadow:"#244871",trim:"#e6b86a",gem:"#7ae5fd"},
  epic: {metal:"#8f51b9",light:"#e1aafb",shadow:"#462765",trim:"#ebc06e",gem:"#ed9eff"},
  legendary: {metal:"#d4a03f",light:"#fff0b8",shadow:"#88501e",trim:"#fbdc8e",gem:"#ffbd62"},
  mythic: {metal:"#bd3854",light:"#ff9f90",shadow:"#661c47",trim:"#f5c86d",gem:"#fa5d74"}
};
const colour = (gear?:CharacterGear) => colours[(gear?.rarity||"common").toLowerCase()]||colours.common;
const ornate = (gear?:CharacterGear) => ["epic","legendary","mythic"].includes(gear?.rarity?.toLowerCase()||"");
const matches=(gear:CharacterGear|undefined,re:RegExp)=>re.test(((gear?.name||"")+" "+(gear?.design_key||"")).toLowerCase());
const seed=(gear?:CharacterGear)=>[...(gear?.design_key||gear?.item_key||gear?.name||"")].reduce((a,c)=>a+c.charCodeAt(0),0)%4;
const ink="#282833";

/** A paper-doll: the illustrated boxer-shorts character is always the base.
 * Equipment overlays are selected from the player's actually equipped inventory. */
export default function CharacterAvatar({equipment=[],backgroundPath="/backgrounds/bg-starter-village.webp"}:{equipment?:CharacterGear[];backgroundPath?:string}) {
  const gear:Record<string,CharacterGear>={};
  equipment.forEach(item=>{if(item?.slot&&item?.name)gear[item.slot]=item;});
  const {helmet,chest,legs,boots,gloves,cloak,shield,weapon,accessory}=gear;
  const H=colour(helmet),C=colour(chest),L=colour(legs),B=colour(boots),G=colour(gloves);
  const K=colour(cloak),S=colour(shield),W=colour(weapon),A=colour(accessory);
  const entries=Object.values(gear);
  const description=entries.length?"Adventurer equipped with "+entries.map(x=>x.name).join(", "):"Adventurer wearing navy boxer shorts and no equipment";
  const wtype=matches(weapon,/staff|wand|scepter|sceptre|rod/)? "staff":
    matches(weapon,/bow|crossbow/)? "bow":matches(weapon,/axe|cleaver/)? "axe":
    matches(weapon,/spear|pike|lance/)? "spear":matches(weapon,/hammer|maul/)? "hammer":"sword";
  const outline={stroke:ink,strokeWidth:1.6,strokeLinejoin:"round" as const};
  return <div className="avatar-stage" role="img" aria-label={description}>
    <div className="avatar-village" aria-hidden="true" style={{backgroundImage:`url("${backgroundPath}")`}}/>
    <div className="avatar-vignette" aria-hidden="true"/>
    <div className="avatar-character">
      {cloak && <svg viewBox="0 0 192 288" className="avatar-gear-svg avatar-gear-behind" shapeRendering="crispEdges" aria-hidden="true">
        <g {...outline}>
          <path d="M75 65 69 62 58 79 48 135 45 220 73 234 101 219 130 237 159 216 149 131 132 68 116 61 99 72Z" fill={K.shadow}/>
          <path d="M76 67 67 78 58 138 55 211 73 223 102 209 132 224 150 209 141 131 124 74 116 68 98 78Z" fill={K.metal}/>
          <path d="M63 143 59 209 75 217 84 200 80 131ZM134 90 143 206 132 216 124 151Z" fill={K.light} opacity=".53"/>
          <path d="m70 68 11 11 17-3 12 6 13-15" fill="none" stroke={K.trim} strokeWidth="3"/>
          {ornate(cloak)&& <path d="m64 207 11 8 22-11 31 14 15-12" stroke={K.trim} strokeWidth="3" fill="none"/>}
        </g>
      </svg>}
      <img src="/character-boxers-hd.webp" className="avatar-art" alt="" draggable={false}/>
      <svg viewBox="0 0 192 288" className="avatar-gear-svg avatar-gear-front" shapeRendering="crispEdges" aria-hidden="true">
        {legs && <g {...outline}>
          <path d="M73 120h53l13 29-12 44-2 40h-19l-4-48-11-11-8 55H67l2-57-6-21Z" fill={L.shadow}/>
          <path d="M75 124h47l9 25-13 45-1 32h-10l-4-42-12-21-9 13-7 48h-9l3-50-2-27Z" fill={L.metal}/>
          <path d="M75 128h43l7 16H72ZM76 155h17l-7 34-10 3Zm33 3h15l-7 34-8-3Z" fill={L.light} opacity=".55"/>
          <path d="M71 128h54v6H71ZM74 190h13v5H74Zm35 0h12v5h-12Z" fill={L.trim}/>
          {ornate(legs)&&<><path d="m75 151 11-7 10 9-10 12Zm32 0 11-7 10 9-11 12Z" fill={L.gem}/><path d="M78 174h10m22 0h10" stroke={L.light} strokeWidth="2"/></>}
        </g>}
        {boots && <g {...outline}>
          <path d="M65 223h24l-4 26 5 10-5 9H56l-5-7 9-12Zm40 0h27l-3 25 17 8 6 10-9 7h-33l-7-13Z" fill={B.shadow}/>
          <path d="M68 228h17l-3 24 5 7-27 4 4-10Zm41 0h20l-3 22 16 9-30 6-6-8Z" fill={B.metal}/>
          <path d="M57 259h29v5H57Zm57 2 31-1 2 5h-31Z" fill={B.light}/>
          <path d="M68 232h16m25 0h19" stroke={B.trim} strokeWidth="3"/>
          {ornate(boots)&&<path d="m71 238 7-5 5 6-7 6Zm39 0 7-5 6 6-7 6Z" fill={B.gem}/>}
        </g>}
        {chest && <g {...outline}>
          <path d="m68 62-16 8 3 26 10 29 6 6h52l8-33 2-29-18-7-11 12-24 1Z" fill={C.shadow}/>
          <path d="m71 65-14 10 5 29 8 21h46l11-31 1-20-13-9-12 10-21-1Z" fill={C.metal}/>
          <path d="M72 71 85 81 96 77 112 70l10 13-7 22-17 12-25-11-11-24Z" fill={C.light} opacity=".65"/>
          <path d="M91 80 92 120M67 121h50" stroke={C.trim} strokeWidth="3" fill="none"/>
          <path d="M68 123h49v7H68Z" fill={C.shadow}/>
          <path d="M89 122h10v10H89Z" fill={C.trim}/>
          <path d="M61 68 51 59 44 71l-2 16 11 10 13-7 8-19Zm50 0 13-9 15 10 5 19-13 11-17-9Z" fill={C.shadow}/>
          <path d="m58 65-10 7 1 15 9 5 13-19Zm70 0-11 8 6 19 15-5-5-14Z" fill={C.metal}/>
          <path d="M47 73 58 65m66 1 12 12" stroke={C.light} strokeWidth="3"/>
          {ornate(chest)&&<><path d="m92 82 9 12-9 12-9-12Z" fill={C.gem}/><path d="M91 86h3v13h-3Z" fill={C.light}/></>}
          {seed(chest)%2===0 &&<path d="M78 112h28v4H78Z" fill={C.trim}/>}
          {matches(chest,/robe|tunic|weave|vest/) && <path d="m70 127-6 23 22 7 13-6 18 6 11-8-12-22Z" fill={C.metal} {...outline}/>}
        </g>}
        {gloves && <g {...outline}>
          <path d="m48 113 18 5-3 22-14 12-14-11 4-15Zm84 0 18-3 7 28-13 14-13-12Z" fill={G.shadow}/>
          <path d="m48 117 14 3-4 18-11 9-9-9 6-12Zm88 0 13-3 4 24-10 10-8-9Z" fill={G.metal}/>
          <path d="m44 124 17 2m75-1 15-2" stroke={G.trim} strokeWidth="3"/>
          {ornate(gloves)&&<path d="m48 130 5-5 5 6-5 6Zm88 0 5-5 5 6-5 6Z" fill={G.gem}/>}
        </g>}
        {accessory && <g {...outline}>
          <path d="M81 62q14 19 28 0" fill="none" stroke={A.trim} strokeWidth="2.5"/>
          <path d="m95 76 8 8-8 10-8-10Z" fill={A.shadow}/>
          <path d="m95 79 5 5-5 7-5-7Z" fill={A.gem}/>
          <path d="M94 81h3v4h-3Z" fill={A.light} stroke="none"/>
        </g>}
        {shield && <g {...outline}>
          <path d="m10 121 59-2 3 45-31 44-30-40Z" fill={S.shadow}/>
          <path d="m16 125 48-1 3 38-26 38-23-36Z" fill={S.metal}/>
          <path d="m21 130 41-1v13H21Z" fill={S.light} opacity=".64"/>
          <path d="M40 126v67M21 157h41" stroke={S.trim} strokeWidth="3"/>
          <path d="m40 145 13 12-13 21-12-21Z" fill={S.gem}/>
          {ornate(shield)&&<><path d="M26 130h28v6H26Z" fill={S.trim}/><path d="m40 151 7 8-7 10-6-10Z" fill={S.light}/></>}
        </g>}
        {weapon && <g {...outline}>
          {wtype==="sword"&& <>
            <path d="m142 143 11-28 19-64 11-12-1 20-21 68-9 22Z" fill={W.shadow}/>
            <path d="m150 125 25-68 3-8-2 13-20 66Z" fill={W.light}/>
            <path d="m136 135 31 9-3 8-32-10Z" fill={W.trim}/>
            <path d="m150 147-9 27 8 3 12-28Z" fill="#684b31"/>
            <path d="m140 171 17 5-3 6-16-5Z" fill={W.trim}/>
            {ornate(weapon)&&<path d="m175 57 3-8-1 14-21 62Z" fill={W.gem} stroke="none"/>}
          </>}
          {wtype==="staff"&&<>
            <path d="m140 197 32-140 5 1-31 143Z" fill="#775238"/>
            <path d="m170 34 15 23-14 19-14-19Z" fill={W.shadow}/>
            <path d="m170 40 9 18-8 13-9-14Z" fill={W.gem}/>
            <path d="M152 152h10v6h-10Z" fill={W.trim}/>
          </>}
          {wtype==="axe"&&<>
            <path d="m138 198 30-133 7 3-31 132Z" fill="#775238"/>
            <path d="m159 53 27-4 5 30-16 18-22-13Z" fill={W.shadow}/>
            <path d="m166 60 17-6 4 22-11 13-16-9Z" fill={W.light}/>
          </>}
          {wtype==="hammer"&&<>
            <path d="m139 193 29-123 8 2-30 124Z" fill="#76543b"/>
            <path d="M151 50h40v31h-40Z" fill={W.shadow}/>
            <path d="M154 54h33v17h-33Z" fill={W.metal}/>
            <path d="M157 55h27v5h-27Z" fill={W.light}/>
          </>}
          {wtype==="spear"&&<>
            <path d="m141 212 28-151 7 2-28 151Z" fill="#76543b"/>
            <path d="m174 21 12 35-16 23-8-24Z" fill={W.shadow}/>
            <path d="m175 28 7 26-12 18-5-18Z" fill={W.light}/>
          </>}
          {wtype==="bow"&&<>
            <path d="M156 44Q214 112 149 194" stroke={W.shadow} strokeWidth="9" fill="none"/>
            <path d="M156 44Q214 112 149 194" stroke={W.metal} strokeWidth="5" fill="none"/>
            <path d="M156 44 149 194" stroke="#ead9a8" strokeWidth="2"/>
            <path d="M135 131h45" stroke={W.trim} strokeWidth="3"/>
            <path d="m177 123 11 9-11 8Z" fill={W.light}/>
          </>}
        </g>}
        {helmet && <g {...outline}>
          {matches(helmet,/hood|cowl|cap/) ? <>
            <path d="m75 48-7-14 6-22 21-11 19 6 14 25-6 23-13-14-31 2Z" fill={H.shadow}/>
            <path d="m74 32 7-19 16-7 18 9 8 20-11-7-28 3Z" fill={H.metal}/>
            <path d="m81 14 17-8 18 9" fill="none" stroke={H.light} strokeWidth="3"/>
            <path d="M70 35h9v21h-9Zm46-4h11v23h-11Z" fill={H.shadow}/>
          </> : matches(helmet,/crown|circlet|diadem/) ? <>
            <path d="m76 35-1-21 12 12 11-21 12 19 13-14 1 29Z" fill={H.metal}/>
            <path d="M75 35h50v8H75Z" fill={H.shadow}/>
            <path d="m100 25 8 8-8 9-8-9Z" fill={H.gem}/>
            <path d="M80 37h40v3H80Z" fill={H.light}/>
          </> : <>
            <path d="m69 40 4-21 17-12 17-1 17 12 7 21-6 21-13 2-2-23-25 1-2 24-13-2Z" fill={H.shadow}/>
            <path d="M75 34 78 21 93 12l14-1 13 11 5 14-13-7-17 1-12 7Z" fill={H.metal}/>
            <path d="M84 18 97 12l11 2 13 12-11-1-17 4-14 5Z" fill={H.light}/>
            <path d="M72 40h15v8H71Zm37-2h18v8h-18Z" fill={H.metal}/>
            <path d="m98 12 0 27" stroke={H.trim} strokeWidth="3"/>
            {ornate(helmet)&& <path d="m98 20 7 8-7 9-7-9Z" fill={H.gem}/>}
          </>}
        </g>}
      </svg>
    </div>
    <div className="avatar-status"><span aria-hidden="true">✦</span>{entries.length?entries.length+" / 9 EQUIPMENT SLOTS":"STARTING GEAR · BOXERS"}</div>
  </div>;
}
