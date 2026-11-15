"use client";
import {useEffect,useState} from "react";
export type RewardEvent={id:number;kind:"quest"|"level"|"loot"|"background";title:string;xp:number;level?:number;loot?:string;rarity?:string;image?:string};
function play(kind:RewardEvent["kind"],muted:boolean){
 if(muted||typeof window==="undefined")return;
 try{
 const w=window as Window & {webkitAudioContext?:typeof AudioContext};
 const C=window.AudioContext||w.webkitAudioContext;if(!C)return;
 const ctx=new C();const now=ctx.currentTime;
 const notes=kind==="level"?[523.25,659.25,783.99,1046.5]:(kind==="loot"||kind==="background")?[392,523.25,659.25,987.77]:[392,493.88,587.33,783.99];
 notes.forEach((hz,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),t=now+i*.105;
 osc.type=kind==="quest"?"triangle":"sine";osc.frequency.setValueAtTime(hz,t);
 gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.11,t+.015);gain.gain.exponentialRampToValueAtTime(.0001,t+.3);
 osc.connect(gain);gain.connect(ctx.destination);osc.start(t);osc.stop(t+.32);});
 window.setTimeout(()=>void ctx.close(),1400);
 }catch{/* Sound is optional if browser audio is blocked. */}
}
export default function RewardCelebration({event,onClose}:{event:RewardEvent|null;onClose:()=>void}){
 const [muted,setMuted]=useState(false);
 useEffect(()=>{try{setMuted(window.localStorage.getItem("realm-muted")==="true");}catch{}},[]);
 useEffect(()=>{if(!event)return;play(event.kind,muted);},[event?.id]);
 if(!event)return null;
 return <div className="reward-backdrop" role="presentation" onClick={onClose}><section className={`reward-modal reward-${event.kind}`} role="dialog" aria-modal="true" aria-label={event.title} onClick={e=>e.stopPropagation()}>
 <div className="reward-particles" aria-hidden="true">{Array.from({length:28},(_,i)=><i key={i} style={{left:`${(i*37)%100}%`,animationDelay:`${(i%8)*.08}s`,background:i%3===0?"#ffe1a1":i%3===1?"#9dd2ad":"#c39ef1"}}/>)}</div>
 <div className="reward-emblem" aria-hidden="true">{event.kind==="level"?"✦":event.kind==="loot"?"◆":event.kind==="background"?"⌂":"✧"}</div>
 <div className="eyebrow gold">{event.kind==="level"?"LEVEL UP!":event.kind==="loot"?"TREASURE FOUND":event.kind==="background"?"WORLD UNLOCKED":"QUEST COMPLETE"}</div>
 <h2>{event.title}</h2>
 {event.level&&<div className="reward-level">LEVEL {event.level}</div>}
 {event.xp>0&&<p className="reward-xp">+{event.xp.toLocaleString()} XP</p>}
 {event.image&&<img className="reward-scene-image" src={event.image} alt="New collectible background"/>}
 {event.loot&&<p className="reward-loot">{event.loot} <small>{event.rarity?.toUpperCase()}</small></p>}
 <div className="reward-actions"><button className="primary" onClick={onClose}>CONTINUE ADVENTURE</button><button className="reward-sound" onClick={()=>{const v=!muted;setMuted(v);try{localStorage.setItem("realm-muted",String(v));}catch{}if(!v)play(event.kind,false);}} aria-label={muted?"Enable sound effects":"Mute sound effects"}>{muted?"♪ SOUND OFF":"♫ SOUND ON"}</button></div>
 </section></div>;
}