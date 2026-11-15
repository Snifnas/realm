"use client";

import { useEffect } from "react";

export default function RealmError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("REALM client error", error); }, [error]);
  return (
    <main style={{minHeight:"100dvh",background:"#171b16",color:"#f0e0c3",display:"grid",placeItems:"center",padding:"28px",fontFamily:"Georgia,serif"}}>
      <section style={{width:"100%",maxWidth:460,border:"1px solid #947445",padding:28,background:"#24261c",textAlign:"center",boxShadow:"0 15px 50px #0007"}}>
        <div style={{fontSize:12,letterSpacing:3,color:"#dfbd77",marginBottom:16}}>REALM · RECOVERY</div>
        <h1 style={{fontSize:27,margin:"0 0 13px"}}>The adventure hit a snag.</h1>
        <p style={{lineHeight:1.6,fontSize:14,color:"#c9bea8"}}>The interface could not finish loading. Your character, quests and XP are stored securely and have not been erased.</p>
        <button onClick={() => reset()} style={{padding:"12px 20px",margin:"12px 6px",background:"#d6b06c",border:"1px solid #f6d595",color:"#201d14",fontWeight:700,cursor:"pointer"}}>TRY AGAIN</button>
        <button onClick={() => window.location.reload()} style={{padding:"12px 20px",margin:"12px 6px",background:"transparent",border:"1px solid #97784e",color:"#e7d3ae",cursor:"pointer"}}>RELOAD APP</button>
      </section>
    </main>
  );
}
