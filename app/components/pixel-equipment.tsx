"use client";

type ItemVisual={
 name:string;
 slot:string;
 rarity:string;
 item_key?:string;
 design_key?:string;
 sprite_variant?:number;
};

const slots=["weapon","helmet","chest","legs","boots","gloves","shield","cloak","accessory"];
const rarities=["common","uncommon","rare","epic","legendary","mythic"];

export default function PixelEquipment({item,small=false}:{item:ItemVisual;small?:boolean}){
 const slot=Math.max(0,slots.indexOf(item.slot));
 const rarity=rarities.includes((item.rarity||"").toLowerCase())?item.rarity.toLowerCase():"common";
 const variant=Math.min(3,Math.max(0,Number(item.sprite_variant)||0));
 return <span className={`pixel-equipment ${small?"pixel-equipment-small":""} rarity-${rarity}`}
  role="img" aria-label={`${item.name}, ${rarity} ${item.slot}`} title={item.name}>
  <span className="equipment-sprite" aria-hidden="true" style={{
   backgroundImage:`url("/equipment-hd/equipment-${rarity}.webp")`,
   backgroundPosition:`-${variant*128}px -${slot*128}px`
  }}/>
 </span>;
}
