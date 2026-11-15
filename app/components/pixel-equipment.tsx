import { useEffect, useState } from "react";\n"use client";

type PixelEquipmentProps = {
  item: { name:string; slot:string; rarity:string; design_key?:string; item_key?:string; sprite_variant?:number };
  small?: boolean;
};

const palettes: Record<string,{metal:string;bright:string;dark:string;gem:string;glow:string}> = {
  common:{metal:"#aaa99a",bright:"#e2d9bc",dark:"#625f56",gem:"#a1b0a5",glow:"#c5c6b7"},
  uncommon:{metal:"#6aa76b",bright:"#b4df83",dark:"#315b43",gem:"#8fe0aa",glow:"#8ed18f"},
  rare:{metal:"#548fc5",bright:"#b9e3ff",dark:"#23456e",gem:"#79d9ed",glow:"#76bff2"},
  epic:{metal:"#9461bc",bright:"#e0b8ff",dark:"#4e286f",gem:"#e2a1f6",glow:"#bd82ee"},
  legendary:{metal:"#c28c35",bright:"#fff0a3",dark:"#6b441b",gem:"#f6d46c",glow:"#f3c55d"},
  mythic:{metal:"#c05291",bright:"#ffd0f0",dark:"#642b67",gem:"#86f4e7",glow:"#ef83c8"},
};

export default function PixelEquipment({item,small=false}:PixelEquipmentProps){
 const rarity=(item.rarity||"common").toLowerCase();\n const [atlasAvailable,setAtlasAvailable]=useState(false);\n useEffect(()=>{const img=new Image();img.onload=()=>setAtlasAvailable(true);img.onerror=()=>setAtlasAvailable(false);img.src="/equipment-atlas.webp";},[]);
 const c=palettes[rarity]||palettes.common;
 const kind=(item.design_key||item.item_key||"").toLowerCase();
 const variant=[...kind].reduce((n,ch)=>n+ch.charCodeAt(0),0)%3;
 const ink="#26251f";
 const details=(()=>{
  if(item.slot==="weapon"){
   if(/bow/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinecap="square" fill="none"><path d="M17 8 Q52 31 17 56" stroke={c.metal} strokeWidth="7"/><path d="M17 8 Q52 31 17 56" stroke={c.bright}/><path d="M17 8 17 56" stroke="#e5dcc3" strokeWidth="2"/><path d="M11 32 54 32" stroke={c.gem} strokeWidth="2"/><path d="M48 26 56 32 48 38" stroke={c.bright}/><path d="M8 15 13 18 M8 47 13 44" stroke={c.gem}/></g>;
   if(/staff|scepter|wand|prism/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M28 57 39 10 43 11 32 58Z" fill="#795638"/><path d="M30 49 34 49" stroke="#d7b36d" strokeWidth="4"/><path d="M41 5 49 13 42 22 34 13Z" fill={c.gem}/><path d="M41 5 49 13 42 22" fill="none" stroke={c.bright}/><path d="M36 8 41 4 46 8" fill="none" stroke={c.bright} strokeWidth="2"/></g>;
   if(/axe|cleaver/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M25 58 37 7 42 8 31 59Z" fill="#825b37"/><path d="M35 13 48 7 57 13 53 27 42 31 36 25Z" fill={c.metal}/><path d="M43 12 52 12 48 22 40 24Z" fill={c.bright} stroke="none"/><path d="M25 42 31 43" stroke="#d7b36d" strokeWidth="4"/></g>;
   if(/hammer|maul/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M27 59 38 15 43 16 32 60Z" fill="#825b37"/><path d="M19 7 52 7 57 15 53 26 18 24 14 15Z" fill={c.metal}/><path d="M20 11 49 11 49 15 20 15Z" fill={c.bright} stroke="none"/><path d="M30 25 37 27" stroke="#d7b36d" strokeWidth="3"/></g>;
   if(/spear|pike|lance/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M29 60 34 9 39 9 34 60Z" fill="#825b37"/><path d="M36 2 46 14 37 27 28 15Z" fill={c.metal}/><path d="M36 5 42 14 36 21Z" fill={c.bright} stroke="none"/><path d="M26 35 39 35" stroke={c.gem} strokeWidth="3"/></g>;
   if(/twin|dual/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M8 52 36 9 43 13 15 57Z" fill={c.metal}/><path d="M42 52 19 9 12 13 36 57Z" fill={c.metal}/><path d="M14 48 35 17" stroke={c.bright}/><path d="M36 48 20 17" stroke={c.bright}/><path d="M7 49 16 55 M35 54 44 49" stroke="#825b37" strokeWidth="5"/></g>;
   return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M9 48 43 7 51 12 20 55Z" fill={c.metal}/><path d="M16 46 42 14 46 16 21 51Z" fill={c.bright} stroke="none"/><path d="M12 39 31 55 27 59 8 44Z" fill="#825b37"/><path d="M17 34 25 40" stroke={c.gem} strokeWidth="4"/></g>;
  }
  if(item.slot==="helmet"){
   if(/crown|circlet|diadem/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M9 31 14 13 26 23 33 7 41 23 53 13 57 31Z" fill={c.metal}/><path d="M11 31H55V41H11Z" fill={c.dark}/><path d="M17 17 25 25 M33 12 33 24 M49 17 41 25" stroke={c.bright} strokeWidth="2"/><path d="M29 30 33 25 37 30Z" fill={c.gem}/></g>;
   if(/hood|cap/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M12 45 12 29 18 15 31 8 46 14 54 30 54 46Z" fill={c.dark}/><path d="M17 29 22 17 32 12 44 18 50 30 45 34H20Z" fill={c.metal}/><path d="M19 36H47" stroke={c.bright} strokeWidth="4"/><path d="M30 14V25" stroke={c.gem} strokeWidth="3"/></g>;
   if(/mask|visage/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M14 12 32 6 50 12 48 43 32 57 16 43Z" fill={c.metal}/><path d="M19 23 29 25 26 31 19 30Z M35 25 45 23 45 30 38 31Z" fill={c.dark}/><path d="M28 39 36 39 32 47Z" fill={c.bright}/><path d="M23 14 32 10 41 14" stroke={c.bright}/></g>;
   return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M10 49 11 25 17 12 47 12 54 25 54 49 45 56H19Z" fill={c.metal}/><path d="M15 25 50 25 47 39 18 39Z" fill={c.dark}/><path d="M21 29H28 M36 29H44" stroke={c.gem} strokeWidth="4"/><path d="M25 12 32 5 39 12" fill={c.bright}/><path d="M17 46H47" stroke={c.bright}/></g>;
  }
  if(item.slot==="chest") return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M20 9 10 17 5 33 14 40 19 31 18 57H46L45 31 51 40 59 33 54 17 44 9 37 14H27Z" fill={/robe|weave/.test(kind)?c.dark:c.metal}/><path d="M22 13 32 22 42 13 39 52H25Z" fill={c.bright}/><path d="M32 23 32 49" stroke={c.dark} strokeWidth="3"/><path d="M13 22 20 28 M51 22 44 28" stroke={c.gem} strokeWidth="3"/><path d="M23 50H41" stroke={c.gem} strokeWidth="3"/></g>;
  if(item.slot==="legs") return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M14 8H50L48 29 45 55 34 57 31 31 27 57 16 55 16 28Z" fill={/wrap|hose|trouser|legging/.test(kind)?c.dark:c.metal}/><path d="M18 13 29 14 27 29 20 29Z M35 14 46 13 43 29 36 29Z" fill={c.bright}/><path d="M19 34 27 34 M36 34 44 34" stroke={c.gem} strokeWidth="3"/><path d="M15 48H25 M37 48H46" stroke={c.dark} strokeWidth="4"/></g>;
  if(item.slot==="boots") return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M12 8H27L29 34 37 40 36 54H7L6 47 17 39Z" fill={c.metal}/><path d="M38 8H52L50 34 58 40 57 54H30L29 47 43 39Z" fill={c.dark}/><path d="M10 47H35 M32 47H56" stroke={c.bright} strokeWidth="4"/><path d="M17 19 25 19 M42 19 50 19" stroke={c.gem} strokeWidth="3"/><path d="M14 31 25 31 M42 31 52 31" stroke={ink} strokeWidth="2"/></g>;
  if(item.slot==="gloves") return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M12 34 13 15 19 15 20 28 24 7 30 7 30 28 34 5 40 6 39 29 44 13 50 15 47 39 39 54 19 54Z" fill={c.metal}/><path d="M19 36 43 36 39 48 22 48Z" fill={c.dark}/><path d="M22 15V25 M33 13V25 M44 20V28" stroke={c.bright} strokeWidth="3"/><path d="M18 40H43" stroke={c.gem} strokeWidth="3"/></g>;
  if(item.slot==="shield"){
   if(/round|buckler/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><circle cx="32" cy="32" r="24" fill={c.metal}/><circle cx="32" cy="32" r="17" fill={c.dark}/><circle cx="32" cy="32" r="8" fill={c.gem}/><path d="M32 8V56 M8 32H56" stroke={c.bright} strokeWidth="2"/></g>;
   const kite=/kite|heater|tassets/.test(kind);
   return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d={kite?"M9 9H55L51 39 32 59 13 39Z":"M11 8H53L57 27 48 49 32 58 16 49 7 27Z"} fill={c.metal}/><path d="M17 16H47L44 37 32 49 20 37Z" fill={c.dark}/><path d="M32 18 39 31 32 43 25 31Z" fill={c.gem}/><path d="M32 8V54" stroke={c.bright} strokeWidth="2"/></g>;
  }
  if(item.slot==="cloak") return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M22 9 32 16 42 9 53 20 49 57 32 50 15 57 11 20Z" fill={c.dark}/><path d="M22 14 32 21 42 14 46 24 42 49 32 44 22 49 18 24Z" fill={c.metal}/><path d="M32 21V47 M19 35 25 40 M45 35 39 40" stroke={c.bright} strokeWidth="3"/><path d="M26 15 32 22 38 15" fill={c.gem}/></g>;
  // Jewellery and relics
  if(/ring|band|signet/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><circle cx="32" cy="35" r="19" fill="none" stroke={c.metal} strokeWidth="8"/><circle cx="32" cy="35" r="12" fill="none" stroke={c.bright} strokeWidth="2"/><path d="M23 11 32 4 41 11 38 23 26 23Z" fill={c.gem}/><path d="M28 11 32 7 36 11" stroke={c.bright} strokeWidth="2"/></g>;
  if(/compass|prism|reliquary/.test(kind)) return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M32 5 53 32 32 59 11 32Z" fill={c.metal}/><path d="M32 12 45 32 32 51 19 32Z" fill={c.dark}/><path d="M32 16 38 32 32 47 26 32Z" fill={c.gem}/><circle cx="32" cy="32" r="4" fill={c.bright}/></g>;
  return <g stroke={ink} strokeWidth="3" strokeLinejoin="round"><path d="M32 5 49 14 53 34 42 53 22 53 11 34 15 14Z" fill={c.metal}/><path d="M32 12 44 19 46 33 38 46 26 46 18 33 20 19Z" fill={c.dark}/><path d="M32 18 41 32 32 45 23 32Z" fill={c.gem}/><path d="M32 22V42" stroke={c.bright} strokeWidth="2"/></g>;
 })();
 const ornament=rarity==="mythic"||rarity==="legendary"||rarity==="epic";
 return <span className={`pixel-equipment ${small?"pixel-equipment-small":""} rarity-${rarity}`} role="img" aria-label={item.name} title={item.name}>
  {atlasAvailable?<span className="equipment-sprite" style={{backgroundPosition:`-${((["common","uncommon","rare","epic","legendary","mythic"].indexOf(rarity)*4+(item.sprite_variant||0))*64)}px -${(["weapon","helmet","chest","legs","boots","gloves","shield","cloak","accessory"].indexOf(item.slot)*64)}px`}} aria-hidden="true"/>:<svg viewBox="0 0 64 64" shapeRendering="crispEdges" aria-hidden="true">
   <path d="M32 3 35 9 42 7 44 14 52 16 49 23 58 29 53 35 57 43 49 47 48 55 39 53 32 61 25 53 16 55 15 47 7 43 11 35 6 29 15 23 12 16 20 14 22 7 29 9Z" fill={c.glow} opacity={rarity==="common"?.08:.16}/>
   {details}
   {variant===0&&<g fill={c.bright}><rect x="7" y="9" width="4" height="4"/><rect x="53" y="49" width="4" height="4"/><rect x="48" y="5" width="2" height="2"/></g>}
   {variant===1&&<g fill={c.gem}><rect x="8" y="48" width="3" height="6"/><rect x="53" y="9" width="3" height="6"/><rect x="48" y="55" width="3" height="3"/></g>}
   {variant===2&&<g fill={c.bright}><path d="M7 23 10 18 13 23 10 28Z"/><path d="M51 40 54 35 57 40 54 45Z"/><rect x="47" y="7" width="3" height="3"/></g>}
   {ornament&&<g fill={c.bright}><rect x="6" y="7" width="3" height="3"/><rect x="54" y="9" width="3" height="3"/><rect x="8" y="51" width="3" height="3"/><rect x="53" y="48" width="3" height="3"/></g>}
  </svg>}
 </span>;
}
