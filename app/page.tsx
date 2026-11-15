"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import RealmLogo from "./components/realm-logo";
import MobileNav from "./components/mobile-nav";
import PixelEquipment from "./components/pixel-equipment";
import RewardCelebration,{type RewardEvent} from "./components/reward-celebration";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const db = url && key ? createClient(url, key) : null;

type Skill = { id:string; name:string; description:string; category:string; icon:string; xp:number; level:number };
type SkillNode = {id:string;skill_id:string;parent_id:string|null;title:string;description:string;node_type:string;sort_order:number;xp_reward:number;level_required:number};
type Quest = { id:string; progressId:string; status:string; evidence:any; title:string; description:string; difficulty:string; quest_type:string; xp_reward:number; estimated_minutes:number|null; skill_id:string; objective:any|null; prerequisite_quest_id:string|null; prerequisiteTitle:string|null };
type Equipment = {id:string;item_key:string;design_key:string;sprite_variant?:number;name:string;description:string;slot:string;rarity:string;icon:string;required_level:number;attack_bonus:number;defence_bonus:number;focus_bonus:number;vitality_bonus:number};
type InventoryItem = {id:string;source:string;source_level:number;is_equipped:boolean;obtained_at:string;item:Equipment};
const xpAt = (level:number) => { let total=0; for(let n=1;n<level;n++) total += Math.floor(n+300*Math.pow(2,n/7)); return Math.floor(total/4); };
const levelAt = (xp:number) => { let level=1; while(level<99 && xp>=xpAt(level+1)) level++; return level; };
const cleanUrl = (s:string) => s.match(/https?:\/\/[^\s]+/)?.[0]?.replace(/[),.]+$/,"") || "";
const resourceLabel = (url:string) => {const u=url.toLowerCase();if(/recipe|receitas|bolo-de-bolacha|cake/.test(u))return "OPEN RECIPE";if(/youtube|vimeo|arte\.tv|documentary|video/.test(u))return "WATCH DOCUMENTARY";if(/dea\.gov|insightcrime|article|news|report/.test(u))return "OPEN ARTICLE";return "OPEN RESOURCE";};
const equipmentSlots = ["weapon","helmet","chest","legs","boots","gloves","shield","cloak","accessory"];

function PixelHero(){return <img src="/realm-world.svg" alt="A pixel-art adventurer exploring a bright forest settlement" />;}

export default function Home(){
 const [session,setSession]=useState<any>(null),[loading,setLoading]=useState(true),[mode,setMode]=useState<"signup"|"login">("signup");
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[name,setName]=useState("");
 const [skills,setSkills]=useState<Skill[]>([]),[skillNodes,setSkillNodes]=useState<SkillNode[]>([]),[quests,setQuests]=useState<Quest[]>([]),[evidence,setEvidence]=useState<Record<string,string>>({});
 const [skillName,setSkillName]=useState(""),[goal,setGoal]=useState(""),[category,setCategory]=useState("Knowledge");
 const [tab,setTab]=useState("Overview"),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false),[focusedQuestId,setFocusedQuestId]=useState<string|null>(null);
 const [inventory,setInventory]=useState<InventoryItem[]>([]),[recentDrops,setRecentDrops]=useState<any[]>([]),[spriteVariants,setSpriteVariants]=useState<Record<string,number>>({});
 const [rewardEvent,setRewardEvent]=useState<RewardEvent|null>(null),[rewardQueue,setRewardQueue]=useState<RewardEvent[]>([]);
 function closeReward(){setRewardQueue(queue=>{const [next,...rest]=queue;setRewardEvent(next||null);return rest;});}
 useEffect(()=>{ if(!db){setLoading(false);return;} db.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false);}); const {data:{subscription}}=db.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>subscription.unsubscribe();},[]);
 useEffect(()=>{if(session?.user){loadSkills();loadQuests();loadInventory();}},[session?.user?.id]);
 async function loadSkills(){
  if(!db||!session?.user)return; const uid=session.user.id;
  const [{data:s},{data:p}]=await Promise.all([db.from("skills").select("id,name,description,category,icon").eq("creator_id",uid).order("created_at"),db.from("player_skills").select("skill_id,xp,level").eq("user_id",uid)]);
  const progress=new Map((p||[]).map((x:any)=>[x.skill_id,x]));
  setSkills((s||[]).map((x:any)=>({...x,xp:progress.get(x.id)?.xp||0,level:progress.get(x.id)?.level||1}))); 
  const skillIds=(s||[]).map((x:any)=>x.id);
  if(skillIds.length){const {data:nodes}=await db.from("skill_nodes").select("id,skill_id,parent_id,title,description,node_type,sort_order,xp_reward,level_required").in("skill_id",skillIds).order("sort_order");setSkillNodes((nodes||[]) as SkillNode[]);}else setSkillNodes([]);
  const {data:profile}=await db.from("profiles").select("id").eq("id",uid).maybeSingle();
  if(!profile)await db.from("profiles").insert({id:uid,display_name:session.user.user_metadata?.display_name||session.user.email?.split("@")[0]||"Adventurer"});
 }
 async function loadQuests(){
  if(!db||!session?.user)return;
  const {data:rows,error}=await db.from("player_quests").select("id,quest_id,status,evidence").eq("user_id",session.user.id);
  if(error){setNotice(error.message);return;}
  const ids=(rows||[]).map((x:any)=>x.quest_id);
  if(!ids.length){setQuests([]);return;}
  const [{data:q},{data:o}]=await Promise.all([
   db.from("quests").select("id,title,description,difficulty,quest_type,xp_reward,estimated_minutes,skill_id,prerequisite_quest_id").in("id",ids),
   db.from("quest_objectives").select("id,quest_id,title,description,objective_type,evidence_required,sort_order").in("quest_id",ids).order("sort_order")
  ]);
  const objectiveMap=new Map<string,any>();(o||[]).forEach((x:any)=>{if(!objectiveMap.has(x.quest_id))objectiveMap.set(x.quest_id,x);});
  const progressMap=new Map((rows||[]).map((x:any)=>[x.quest_id,x]));
  const questMap=new Map((q||[]).map((x:any)=>[x.id,x]));
  setQuests((q||[]).map((x:any)=>{const p:any=progressMap.get(x.id);const previous:any=x.prerequisite_quest_id?questMap.get(x.prerequisite_quest_id):null;return {...x,progressId:p.id,status:p.status,evidence:p.evidence,objective:objectiveMap.get(x.id)||null,prerequisiteTitle:previous?.title||null};}).sort((a:any,b:any)=>{const rank:Record<string,number>={active:0,available:1,locked:2,submitted:3,completed:4,abandoned:5};return (rank[a.status]??6)-(rank[b.status]??6);}));
 }
 async function loadInventory(){
  if(!db||!session?.user)return;
  const [{data,error},{data:catalogue}]=await Promise.all([
    db.from("player_inventory").select("id,source,source_level,is_equipped,obtained_at,item:equipment_items(id,item_key,design_key,name,description,slot,rarity,icon,required_level,attack_bonus,defence_bonus,focus_bonus,vitality_bonus)").eq("user_id",session.user.id).order("obtained_at",{ascending:false}),
    db.from("equipment_items").select("item_key,slot,rarity").order("item_key")
  ]);
  const groups:Record<string,string[]>={};
  (catalogue||[]).forEach((x:any)=>{const k=x.slot+":"+x.rarity;(groups[k] ||= []).push(x.item_key);});
  const variants:Record<string,number>={};
  Object.values(groups).forEach(keys=>keys.forEach((key,i)=>{variants[key]=i%4;}));
  setSpriteVariants(variants);
  if(error){setNotice(error.message);return;}
  setInventory((data||[]).map((x:any)=>{
    const item=Array.isArray(x.item)?x.item[0]:x.item;
    return {...x,item:item?{...item,sprite_variant:variants[item.item_key]??0}:null};
  }).filter((x:any)=>x.item) as InventoryItem[]);
 }
 async function auth(e:any){
  e.preventDefault();if(!db){setNotice("Database configuration is missing.");return;}setBusy(true);setNotice("");
  const r=mode==="signup"?await db.auth.signUp({email,password,options:{data:{display_name:name||"Adventurer"}}}):await db.auth.signInWithPassword({email,password});
  if(r.error)setNotice(r.error.message);else if(mode==="signup"&&!r.data.session)setNotice("Check your email to confirm your account, then log in.");else setNotice("Welcome to REALM.");setBusy(false);
 }
 async function addSkill(e:any){
  e.preventDefault();if(!db||!session?.user||!skillName.trim())return;setBusy(true);
  const slug=skillName.trim().toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const r=await db.from("skills").insert({creator_id:session.user.id,name:skillName.trim(),slug,description:goal,category,icon:"✧"});
  if(r.error)setNotice(r.error.message);else{setNotice("Skill added to your journal.");setSkillName("");setGoal("");await loadSkills();}setBusy(false);
 }
 async function equipItem(item:InventoryItem){
  if(!db)return;setBusy(true);setNotice("");
  const {data,error}=await db.rpc("equip_player_item",{p_inventory_id:item.id});
  if(error)setNotice(error.message);else{setNotice(data.equipped?`${data.name} equipped.`:`${data.name} removed from your loadout.`);await loadInventory();}
  setBusy(false);
 }
 async function startQuest(q:Quest){
  if(!db)return;setBusy(true);setNotice("");
  const {error}=await db.rpc("start_player_quest",{p_player_quest_id:q.progressId});
  if(error)setNotice(error.message);else{setFocusedQuestId(q.id);setTab("Quests");setNotice("Quest accepted. Your current objective is now in focus.");await loadQuests();}
  setBusy(false);
 }
 async function completeQuest(q:Quest){
  if(!db)return;const notes=`Self-attested completion: ${q.title}. Marked complete by the player.`;
  setBusy(true);setNotice("");
  const {data,error}=await db.rpc("complete_player_quest",{p_player_quest_id:q.progressId,p_evidence:{notes,method:"self_attested"}});
  if(error)setNotice(error.message);else{const awarded=Number(data.xp_awarded)||0;const newLevel=levelAt(total+awarded);const events:RewardEvent[]=[{id:Date.now(),kind:"quest",title:q.title,xp:awarded}];if(newLevel>level)events.push({id:Date.now()+1,kind:"level",title:"A new chapter begins",xp:0,level:newLevel});if(data.quest_drop)events.push({id:Date.now()+2,kind:"loot",title:"Questline treasure",xp:0,loot:data.quest_drop.name,rarity:data.quest_drop.rarity});setRewardEvent(events[0]);setRewardQueue(events.slice(1));const drops=data.quest_drop?[data.quest_drop]:[];setRecentDrops(drops);setNotice(data.questline_complete?`Quest line complete: +${data.xp_awarded} XP and ${data.quest_drop?.name||"an equipment reward"} (${data.quest_drop?.rarity||"unknown"}).`:`Quest complete: +${data.xp_awarded} XP. ${data.questline_steps_completed}/${data.questline_steps} quests completed in this line. Equipment drops only when the entire line is finished.`);await Promise.all([loadQuests(),loadSkills(),loadInventory()]);}
  setBusy(false);
 }
 const total=skills.reduce((n,s)=>n+s.xp,0),level=levelAt(total),next=xpAt(level+1),current=xpAt(level),pct=Math.min(100,(total-current)/Math.max(1,next-current)*100);
 const maxSkillLevel=Math.max(1,...skills.map(s=>s.level));
 const activeCount=quests.filter(q=>q.status==="active").length,doneCount=quests.filter(q=>q.status==="completed").length;
 const currentFocusId=focusedQuestId&&quests.some(q=>q.id===focusedQuestId&&q.status==="active")?focusedQuestId:quests.find(q=>q.status==="active")?.id||null;
 const focusedQuest=quests.find(q=>q.id===currentFocusId)||null;
 const otherQuests=quests.filter(q=>q.id!==currentFocusId);
 if(loading)return <main className="loading">Entering the realm...</main>;
 if(!session)return <main className="auth"><section className="landscape"><div className="sun"/><div className="castle">♜</div><div className="eyebrow">A DIFFERENT KIND OF ADVENTURE</div><h1>Your life.<br/><i>Your legend.</i></h1><p>Turn the things you want to learn into skills, quests and a life worth levelling up.</p><small>NO PAY-TO-WIN. JUST REAL PROGRESS.</small></section><section className="authbox"><div className="brand"><RealmLogo /></div><div className="eyebrow">THE ADVENTURE BEGINS</div><h2>{mode==="signup"?"Create your character":"Welcome back"}</h2><p className="muted">Your real-world progress is waiting.</p><form onSubmit={auth}>{mode==="signup"&&<label>Character name<input value={name} onChange={e=>setName(e.target.value)} placeholder="What shall they call you?"/></label>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary" disabled={busy}>{busy?"Please wait…":mode==="signup"?"Create account":"Enter the realm"}</button></form>{notice&&<p className="notice">{notice}</p>}<p className="switch">{mode==="signup"?"Already have an account?":"New here?"} <button onClick={()=>setMode(mode==="signup"?"login":"signup")}>{mode==="signup"?"Log in":"Create account"}</button></p></section></main>;
 return <main className="app"><aside className="sidebar"><div className="brand">⚔ REALM</div><div className="world">● WORLD 01 · ONLINE</div><small className="navlabel">YOUR WORLD</small>{["Overview","Skills","Inventory","Quests","Game Master"].map((x,i)=><button className={tab===x?"nav active":"nav"} onClick={()=>setTab(x)} key={x}><span>{["⌂","✧","▣","⚑","☼"][i]}</span>{x}{x==="Quests"&&activeCount>0?<em>{activeCount}</em>:null}</button>)}<div className="player"><b>{(session.user.user_metadata?.display_name||session.user.email||"A").slice(0,1).toUpperCase()}</b><span>{session.user.user_metadata?.display_name||session.user.email}<small>WANDERER · LEVEL {level}</small></span><button onClick={()=>db?.auth.signOut()}>Log out</button></div></aside><section className="main"><header><span className="mobile-brand"><RealmLogo compact /></span><span className="breadcrumb">WORLD 01　/　{tab.toUpperCase()}</span><b>◈ {total.toLocaleString()} XP</b></header><div className="content">
 {tab==="Overview"&&<><div className="eyebrow">YOUR ADVENTURE CONTINUES</div><h1>Welcome back, <i>{session.user.user_metadata?.display_name||"Adventurer"}</i></h1><p className="muted">Every skill begins with a single action.</p><section className="hero"><div><div className="eyebrow gold">CHARACTER OVERVIEW</div><h2>The path is yours<br/>to <i>forge.</i></h2><p>Real skills. Real effort. Progress that respects both.</p><button className="goldbutton" onClick={()=>setTab("Skills")}>VIEW YOUR SKILLS →</button></div><div className="pixel-hero"><PixelHero /></div><div className="level"><strong>{level}</strong><small>CHARACTER LEVEL</small><p>{total.toLocaleString()} / {next.toLocaleString()} XP</p><div className="bar"><span style={{width:pct+"%"}}/></div><small>{Math.round(pct)}% TO LEVEL {level+1}</small></div></section><div className="stats"><article><small>ACTIVE SKILLS</small><strong>{skills.length}</strong></article><article><small>ACTIVE QUESTS</small><strong>{activeCount}</strong></article><article><small>QUESTS COMPLETED</small><strong>{doneCount}</strong></article><article><small>ITEMS COLLECTED</small><strong>{inventory.length}</strong></article></div><h2 className="heading">Your active quests</h2>{quests.filter(q=>q.status==="active").slice(0,3).map(q=><div className="skillrow" key={q.id}><b>{q.title}</b><button className="textbutton" onClick={()=>setTab("Quests")}>CONTINUE →</button></div>)}{!activeCount&&<div className="empty">No active quests. Visit the quest board to choose your next challenge.<button className="outline" onClick={()=>setTab("Quests")}>OPEN QUEST BOARD</button></div>}</>}
 {tab==="Skills"&&<><div className="eyebrow">YOUR CHARACTER</div><h1>Skills & <i>mastery</i></h1><p className="muted">Build a life worth levelling up.</p><button className="outline" onClick={()=>setTab("Quests")}>OPEN QUEST BOARD →</button><div className="columns"><section className="panel skill-tree-panel"><h2>Your skill journal</h2>{skills.length?skills.map(s=>{const nodes=skillNodes.filter(n=>n.skill_id===s.id);const roots=nodes.filter(n=>!n.parent_id);return <section className="skill-tree" key={s.id}><div className="tree-heading"><b>{s.icon} {s.name}</b><span>LVL {s.level} · {s.xp.toLocaleString()} XP</span></div><div className="tree-roots">{roots.map(root=>{const children=nodes.filter(n=>n.parent_id===root.id);return <div className="tree-root" key={root.id}><div className="tree-node root-node"><small>FOUNDATION</small><b>{root.title}</b><p>{root.description}</p></div>{children.length>0&&<div className="tree-children">{children.map(child=><div className="tree-node child-node" key={child.id}><small>{child.node_type.toUpperCase()} · LVL {child.level_required}</small><b>{child.title}</b><p>{child.description}</p>{nodes.filter(n=>n.parent_id===child.id).map(leaf=><div className="tree-leaf" key={leaf.id}>◇ {leaf.title}</div>)}</div>)}</div>}</div>})}</div></section>;}):<p className="muted">No skills yet. Start with something you genuinely want to improve.</p>}</section><section className="panel"><div className="eyebrow gold">BEGIN A NEW PATH</div><h2>Add a skill</h2><form onSubmit={addSkill}><label>Skill name<input required value={skillName} onChange={e=>setSkillName(e.target.value)} placeholder="Spanish, cooking, statistics…"/></label><label>What does mastery look like?<textarea value={goal} onChange={e=>setGoal(e.target.value)} rows={4}/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{["Knowledge","Body","Creation","Character","Practical","Social","Professional","Other"].map(x=><option key={x}>{x}</option>)}</select></label><button className="primary" disabled={busy}>ADD TO JOURNAL</button></form>{notice&&<p className="notice">{notice}</p>}</section></div></>}

 {tab==="Inventory"&&<><div className="eyebrow">YOUR CHARACTER</div><h1>Inventory & <i>armoury</i></h1><p className="muted">216 collectible designs across nine gear slots and six rarities. Equipment is earned only by finishing an entire quest line; longer, harder lines have better odds of powerful rewards.</p>
 {recentDrops.length>0&&<section className="loot-results"><div className="eyebrow gold">LATEST LOOT</div><div className="loot-grid">{recentDrops.map((drop,i)=><article className={`loot-item rarity-${drop.rarity}`} key={drop.inventory_id||i}><PixelEquipment item={{...drop,sprite_variant:spriteVariants[drop.item_key]??0} as Equipment} small/><div><small>{drop.rarity.toUpperCase()} DROP</small><b>{drop.name}</b><span>{drop.slot} · Req. skill level {drop.required_level}</span></div></article>)}</div></section>}
 <section className="panel loadout-panel"><div className="eyebrow gold">CHARACTER LOADOUT</div><h2>Equipped gear</h2><div className="equipment-grid">{equipmentSlots.map(slot=>{const item=inventory.find(x=>x.is_equipped&&x.item.slot===slot);return <article key={slot} className={`equipment-slot ${item?`rarity-${item.item.rarity}`:"empty-slot"}`}><small>{slot.toUpperCase()}</small>{item?<><PixelEquipment item={item.item} small/><b>{item.item.name}</b><em>{item.item.rarity.toUpperCase()}</em><button className="outline gear-action" disabled={busy} onClick={()=>equipItem(item)}>UNEQUIP</button></>:<><span className="empty-slot-icon">◇</span><b>Empty slot</b></>}</article>})}</div><div className="gear-bonuses"><span>ATTACK <b>+{inventory.filter(x=>x.is_equipped).reduce((n,x)=>n+x.item.attack_bonus,0)}</b></span><span>DEFENCE <b>+{inventory.filter(x=>x.is_equipped).reduce((n,x)=>n+x.item.defence_bonus,0)}</b></span><span>FOCUS <b>+{inventory.filter(x=>x.is_equipped).reduce((n,x)=>n+x.item.focus_bonus,0)}</b></span><span>VITALITY <b>+{inventory.filter(x=>x.is_equipped).reduce((n,x)=>n+x.item.vitality_bonus,0)}</b></span></div></section>
 <div className="inventory-heading"><div><h2>Backpack</h2><p className="muted">{inventory.filter(x=>!x.is_equipped).length} items waiting to be equipped</p></div><span>{inventory.length} TOTAL ITEMS</span></div>
 {inventory.filter(x=>!x.is_equipped).length?<div className="inventory-grid">{inventory.filter(x=>!x.is_equipped).map(item=><article className={`item-card rarity-${item.item.rarity}`} key={item.id}><div className="item-card-top"><PixelEquipment item={item.item}/><small>{item.item.rarity.toUpperCase()}</small></div><b>{item.item.name}</b><span className="item-slot">{item.item.slot} · Req. skill level {item.item.required_level}</span><p>{item.item.description}</p><div className="item-stats"><span>ATK +{item.item.attack_bonus}</span><span>DEF +{item.item.defence_bonus}</span><span>FOC +{item.item.focus_bonus}</span><span>VIT +{item.item.vitality_bonus}</span></div><button className="primary gear-action" disabled={busy||item.item.required_level>maxSkillLevel} onClick={()=>equipItem(item)}>{item.item.required_level>maxSkillLevel?`REQUIRES LEVEL ${item.item.required_level}`:"EQUIP ITEM"}</button></article>)}</div>:<div className="empty">Your backpack is empty. Finish a complete quest line to earn your first equipment drop.</div>}
 {notice&&<p className="notice">{notice}</p>}</>}
 {tab==="Quests"&&<><div className="eyebrow">YOUR ADVENTURE LOG</div><h1>Quest <i>board</i></h1><p className="muted">Choose one active quest to focus on. Only its full details stay open.</p>{recentDrops.length>0&&<section className="loot-toast"><b>NEW EQUIPMENT DROPS</b><div>{recentDrops.map((drop,i)=><span className={`rarity-text-${drop.rarity}`} key={drop.inventory_id||i}>{drop.icon} {drop.name}</span>)}</div><button className="textbutton" onClick={()=>setTab("Inventory")}>VIEW INVENTORY →</button></section>}<div className="quest-summary"><span><b>{activeCount}</b> ACTIVE</span><span><b>{quests.filter(q=>q.status==="available").length}</b> AVAILABLE</span><span><b>{quests.filter(q=>q.status==="locked").length}</b> LOCKED</span><span><b>{doneCount}</b> COMPLETED</span></div>{focusedQuest?<><section className="focus-banner"><div className="eyebrow gold">CURRENT QUEST · IN FOCUS</div><strong>{focusedQuest.title}</strong><span>{focusedQuest.xp_reward} XP · {focusedQuest.estimated_minutes||"—"} MIN</span></section><article className="quest-card active focused"><div className="quest-top"><div><div className="eyebrow">{focusedQuest.difficulty} · {focusedQuest.quest_type.replace("_"," ")}</div><h2>{focusedQuest.title}</h2></div><div className="quest-reward"><b>{focusedQuest.xp_reward} XP</b><small>{focusedQuest.estimated_minutes?focusedQuest.estimated_minutes+" MIN":""}</small></div></div>{(()=>{const resource=cleanUrl(focusedQuest.description);const desc=resource?focusedQuest.description.replace(resource,"").trim():focusedQuest.description;return <><p>{desc}</p>{resource&&<a className="resource-link" href={resource} target="_blank" rel="noreferrer">↗ {resourceLabel(resource)}</a>}</>;})()}{focusedQuest.objective&&<div className="objective"><small>OBJECTIVE</small><b>{focusedQuest.objective.title}</b><p>{focusedQuest.objective.description}</p></div>}<div className="evidence-box"><p className="muted">Finished the activity? Claim your XP. No essay required.</p><div className="evidence-footer"><small>{focusedQuest.xp_reward} XP on completion</small><button className="primary" disabled={busy} onClick={()=>completeQuest(focusedQuest)}>COMPLETE QUEST · CLAIM XP</button></div></div></article></>:<div className="empty">No active quest selected. Start an available quest below.</div>}<div className="quest-list-heading"><h2>YOUR QUESTS</h2><small>SELECT AN ACTIVE QUEST TO FOCUS</small></div>{otherQuests.map(q=><article className={`quest-compact ${q.status}`} key={q.id}><div><small>{q.status.toUpperCase()} · {q.xp_reward} XP</small><b>{q.title}</b>{q.status==="locked"&&<span>Complete “{q.prerequisiteTitle||"the previous quest"}” to unlock</span>}</div>{q.status==="active"?<button className="outline focus-button" onClick={()=>setFocusedQuestId(q.id)}>FOCUS QUEST →</button>:q.status==="available"?<button className="primary compact-action" disabled={busy} onClick={()=>startQuest(q)}>START →</button>:q.status==="completed"?<span className="compact-status">✓ DONE</span>:<span className="compact-status">🔒</span>}</article>)}{notice&&<p className="notice">{notice}</p>}</>}
 {tab==="Game Master"&&<><div className="eyebrow gold">YOUR GUIDE</div><h1>The Game <i>Master</i></h1><section className="panel"><div className="gm">☼</div><h2>Give me a learning goal.</h2><p className="muted">Describe something you want to learn in this chat. I’ll inspect your existing skills, create or adjust the skill tree, then add a sequence of quests with resources and practical challenges. Your progress is saved to your character.</p><p className="notice">XP is awarded by the game engine after a quest is completed, not by the AI or the browser.</p></section></>}
 </div></section><MobileNav active={tab} onNavigate={setTab} activeQuests={activeCount} /><RewardCelebration event={rewardEvent} onClose={closeReward}/></main>;
}
