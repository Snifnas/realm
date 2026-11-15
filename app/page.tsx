"use client";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const db = url && key ? createClient(url, key) : null;

type Skill = { id:string; name:string; description:string; category:string; icon:string; xp:number; level:number };
type Quest = { id:string; progressId:string; status:string; evidence:any; title:string; description:string; difficulty:string; quest_type:string; xp_reward:number; estimated_minutes:number|null; skill_id:string; objective:any|null };
const xpAt = (level:number) => { let total=0; for(let n=1;n<level;n++) total += Math.floor(n+300*Math.pow(2,n/7)); return Math.floor(total/4); };
const levelAt = (xp:number) => { let level=1; while(level<99 && xp>=xpAt(level+1)) level++; return level; };
const cleanUrl = (s:string) => s.match(/https?:\/\/[^\s]+/)?.[0]?.replace(/[),.]+$/,"") || "";

export default function Home(){
 const [session,setSession]=useState<any>(null),[loading,setLoading]=useState(true),[mode,setMode]=useState<"signup"|"login">("signup");
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[name,setName]=useState("");
 const [skills,setSkills]=useState<Skill[]>([]),[quests,setQuests]=useState<Quest[]>([]),[evidence,setEvidence]=useState<Record<string,string>>({});
 const [skillName,setSkillName]=useState(""),[goal,setGoal]=useState(""),[category,setCategory]=useState("Knowledge");
 const [tab,setTab]=useState("Overview"),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false);
 useEffect(()=>{ if(!db){setLoading(false);return;} db.auth.getSession().then(({data})=>{setSession(data.session);setLoading(false);}); const {data:{subscription}}=db.auth.onAuthStateChange((_e,s)=>setSession(s)); return ()=>subscription.unsubscribe();},[]);
 useEffect(()=>{if(session?.user){loadSkills();loadQuests();}},[session?.user?.id]);
 async function loadSkills(){
  if(!db||!session?.user)return; const uid=session.user.id;
  const [{data:s},{data:p}]=await Promise.all([db.from("skills").select("id,name,description,category,icon").eq("creator_id",uid).order("created_at"),db.from("player_skills").select("skill_id,xp,level").eq("user_id",uid)]);
  const progress=new Map((p||[]).map((x:any)=>[x.skill_id,x]));
  setSkills((s||[]).map((x:any)=>({...x,xp:progress.get(x.id)?.xp||0,level:progress.get(x.id)?.level||1})));
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
   db.from("quests").select("id,title,description,difficulty,quest_type,xp_reward,estimated_minutes,skill_id").in("id",ids),
   db.from("quest_objectives").select("id,quest_id,title,description,objective_type,evidence_required,sort_order").in("quest_id",ids).order("sort_order")
  ]);
  const objectiveMap=new Map<string,any>();(o||[]).forEach((x:any)=>{if(!objectiveMap.has(x.quest_id))objectiveMap.set(x.quest_id,x);});
  const progressMap=new Map((rows||[]).map((x:any)=>[x.quest_id,x]));
  setQuests((q||[]).map((x:any)=>{const p:any=progressMap.get(x.id);return {...x,progressId:p.id,status:p.status,evidence:p.evidence,objective:objectiveMap.get(x.id)||null};}).sort((a:any,b:any)=>{const rank:Record<string,number>={active:0,available:1,submitted:2,completed:3,abandoned:4};return (rank[a.status]??5)-(rank[b.status]??5);}));
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
 async function startQuest(q:Quest){
  if(!db)return;setBusy(true);setNotice("");
  const {error}=await db.rpc("start_player_quest",{p_player_quest_id:q.progressId});
  if(error)setNotice(error.message);else{setNotice("Quest accepted. Your adventure log has been updated.");await loadQuests();}
  setBusy(false);
 }
 async function completeQuest(q:Quest){
  if(!db)return;const notes=(evidence[q.progressId]||"").trim();
  if(notes.length<30){setNotice("Add at least 30 characters of notes or evidence before claiming completion.");return;}
  setBusy(true);setNotice("");
  const {data,error}=await db.rpc("complete_player_quest",{p_player_quest_id:q.progressId,p_evidence:{notes}});
  if(error)setNotice(error.message);else{setNotice(`Quest complete: +${data.xp_awarded} XP. ${data.title}.`);setEvidence(v=>({...v,[q.progressId]:""}));await Promise.all([loadQuests(),loadSkills()]);}
  setBusy(false);
 }
 const total=skills.reduce((n,s)=>n+s.xp,0),level=levelAt(total),next=xpAt(level+1),current=xpAt(level),pct=Math.min(100,(total-current)/Math.max(1,next-current)*100);
 const activeCount=quests.filter(q=>q.status==="active").length,doneCount=quests.filter(q=>q.status==="completed").length;
 if(loading)return <main className="loading">Entering the realm...</main>;
 if(!session)return <main className="auth"><section className="landscape"><div className="sun"/><div className="castle">♜</div><div className="eyebrow">A DIFFERENT KIND OF ADVENTURE</div><h1>Your life.<br/><i>Your legend.</i></h1><p>Turn the things you want to learn into skills, quests and a life worth levelling up.</p><small>NO PAY-TO-WIN. JUST REAL PROGRESS.</small></section><section className="authbox"><div className="brand">⚔ REALM</div><div className="eyebrow">THE ADVENTURE BEGINS</div><h2>{mode==="signup"?"Create your character":"Welcome back"}</h2><p className="muted">Your real-world progress is waiting.</p><form onSubmit={auth}>{mode==="signup"&&<label>Character name<input value={name} onChange={e=>setName(e.target.value)} placeholder="What shall they call you?"/></label>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary" disabled={busy}>{busy?"Please wait…":mode==="signup"?"Create account":"Enter the realm"}</button></form>{notice&&<p className="notice">{notice}</p>}<p className="switch">{mode==="signup"?"Already have an account?":"New here?"} <button onClick={()=>setMode(mode==="signup"?"login":"signup")}>{mode==="signup"?"Log in":"Create account"}</button></p></section></main>;
 return <main className="app"><aside className="sidebar"><div className="brand">⚔ REALM</div><div className="world">● WORLD 01 · ONLINE</div><small className="navlabel">YOUR WORLD</small>{["Overview","Skills","Quests","Game Master"].map((x,i)=><button className={tab===x?"nav active":"nav"} onClick={()=>setTab(x)} key={x}><span>{["⌂","✧","⚑","☼"][i]}</span>{x}{x==="Quests"&&activeCount>0?<em>{activeCount}</em>:null}</button>)}<div className="player"><b>{(session.user.user_metadata?.display_name||session.user.email||"A").slice(0,1).toUpperCase()}</b><span>{session.user.user_metadata?.display_name||session.user.email}<small>WANDERER · LEVEL {level}</small></span><button onClick={()=>db?.auth.signOut()}>Log out</button></div></aside><section className="main"><header><span>WORLD 01　/　{tab.toUpperCase()}</span><b>◈ {total.toLocaleString()} XP</b></header><div className="content">
 {tab==="Overview"&&<><div className="eyebrow">YOUR ADVENTURE CONTINUES</div><h1>Welcome back, <i>{session.user.user_metadata?.display_name||"Adventurer"}</i></h1><p className="muted">Every skill begins with a single action.</p><section className="hero"><div><div className="eyebrow gold">CHARACTER OVERVIEW</div><h2>The path is yours<br/>to <i>forge.</i></h2><p>Real skills. Real effort. Progress that respects both.</p><button className="goldbutton" onClick={()=>setTab("Skills")}>VIEW YOUR SKILLS →</button></div><div className="level"><strong>{level}</strong><small>CHARACTER LEVEL</small><p>{total.toLocaleString()} / {next.toLocaleString()} XP</p><div className="bar"><span style={{width:pct+"%"}}/></div><small>{Math.round(pct)}% TO LEVEL {level+1}</small></div></section><div className="stats"><article><small>ACTIVE SKILLS</small><strong>{skills.length}</strong></article><article><small>ACTIVE QUESTS</small><strong>{activeCount}</strong></article><article><small>QUESTS COMPLETED</small><strong>{doneCount}</strong></article></div><h2 className="heading">Your active quests</h2>{quests.filter(q=>q.status==="active").slice(0,3).map(q=><div className="skillrow" key={q.id}><b>{q.title}</b><button className="textbutton" onClick={()=>setTab("Quests")}>CONTINUE →</button></div>)}{!activeCount&&<div className="empty">No active quests. Visit the quest board to choose your next challenge.<button className="outline" onClick={()=>setTab("Quests")}>OPEN QUEST BOARD</button></div>}</>}
 {tab==="Skills"&&<><div className="eyebrow">YOUR CHARACTER</div><h1>Skills & <i>mastery</i></h1><p className="muted">Build a life worth levelling up.</p><div className="columns"><section className="panel"><h2>Your skill journal</h2>{skills.length?skills.map(s=><div className="skillrow" key={s.id}><b>{s.icon} {s.name}</b><span>LVL {s.level} · {s.xp} XP</span></div>):<p className="muted">No skills yet. Start with something you genuinely want to improve.</p>}</section><section className="panel"><div className="eyebrow gold">BEGIN A NEW PATH</div><h2>Add a skill</h2><form onSubmit={addSkill}><label>Skill name<input required value={skillName} onChange={e=>setSkillName(e.target.value)} placeholder="Spanish, cooking, statistics…"/></label><label>What does mastery look like?<textarea value={goal} onChange={e=>setGoal(e.target.value)} rows={4}/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}>{["Knowledge","Body","Creation","Character","Practical","Social","Professional","Other"].map(x=><option key={x}>{x}</option>)}</select></label><button className="primary" disabled={busy}>ADD TO JOURNAL</button></form>{notice&&<p className="notice">{notice}</p>}</section></div></>}
 {tab==="Quests"&&<><div className="eyebrow">YOUR ADVENTURE LOG</div><h1>Quest <i>board</i></h1><p className="muted">Accept a quest, do the work, submit evidence and earn verified experience.</p><div className="quest-summary"><span><b>{activeCount}</b> ACTIVE</span><span><b>{quests.filter(q=>q.status==="available").length}</b> AVAILABLE</span><span><b>{doneCount}</b> COMPLETED</span></div>{quests.length?quests.map(q=>{const resource=cleanUrl(q.description);const desc=resource?q.description.replace(resource,"").trim():q.description;return <article className={`quest-card ${q.status}`} key={q.id}><div className="quest-top"><div><div className="eyebrow">{q.difficulty} · {q.quest_type.replace("_"," ")}</div><h2>{q.title}</h2></div><div className="quest-reward"><b>{q.xp_reward} XP</b><small>{q.estimated_minutes? q.estimated_minutes+" MIN":""}</small></div></div><p>{desc}</p>{resource&&<a className="resource-link" href={resource} target="_blank" rel="noreferrer">↗ OPEN DOCUMENTARY / RESOURCE</a>}{q.objective&&<div className="objective"><small>OBJECTIVE</small><b>{q.objective.title}</b><p>{q.objective.description}</p></div>}{q.status==="available"&&<button className="primary quest-action" disabled={busy} onClick={()=>startQuest(q)}>ACCEPT QUEST →</button>}{q.status==="active"&&<div className="evidence-box"><label>YOUR FIELD NOTES / EVIDENCE<textarea rows={5} value={evidence[q.progressId]||""} onChange={e=>setEvidence(v=>({...v,[q.progressId]:e.target.value}))} placeholder="What did you learn? Record specific observations, claims, evidence and questions. Minimum 30 characters."/></label><div className="evidence-footer"><small>{(evidence[q.progressId]||"").trim().length} characters · {q.xp_reward} XP on completion</small><button className="primary" disabled={busy||(evidence[q.progressId]||"").trim().length<30} onClick={()=>completeQuest(q)}>COMPLETE QUEST · CLAIM XP</button></div></div>}{q.status==="completed"&&<div className="completed-note">✓ QUEST COMPLETED · {q.xp_reward} XP EARNED</div>}{q.status==="submitted"&&<div className="notice">Evidence submitted. Awaiting review.</div>}</article>);}):<div className="empty">No quests assigned to this character yet.</div>}{notice&&<p className="notice">{notice}</p>}</>}
 {tab==="Game Master"&&<><div className="eyebrow gold">YOUR GUIDE</div><h1>The Game <i>Master</i></h1><section className="panel"><div className="gm">☼</div><h2>Give me a learning goal.</h2><p className="muted">Describe something you want to learn in this chat. I’ll inspect your existing skills, create or adjust the skill tree, then add a sequence of quests with resources and practical challenges. Your progress is saved to your character.</p><p className="notice">XP is awarded by the game engine after a quest is completed, not by the AI or the browser.</p></section></>}
 </div></section></main>;
}
