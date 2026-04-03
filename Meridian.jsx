import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const PROFILES = [
  { id:1, name:"Yuna", age:26, country:"South Korea", flag:"🇰🇷", city:"Seoul", bio:"K-drama addict 🎬 | Foodie | Looking for something real across borders", interests:["K-drama","Cooking","Travel","Yoga"], img:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", verified:true, tips:47, lang:"Korean / English", online:true, continent:"Asia" },
  { id:2, name:"Amara", age:29, country:"Nigeria", flag:"🇳🇬", city:"Lagos", bio:"Fashion designer ✂️ | Afrobeats lover | Big dreams, bigger heart", interests:["Fashion","Afrobeats","Art","Business"], img:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&q=80", verified:true, tips:83, lang:"English / Yoruba", online:true, continent:"Africa" },
  { id:3, name:"Sofia", age:31, country:"Brazil", flag:"🇧🇷", city:"São Paulo", bio:"Lawyer by day, dancer by night 💃 | Beach girl at heart", interests:["Dancing","Beach","Law","Wine"], img:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80", verified:true, tips:29, lang:"Portuguese / English", online:false, continent:"Americas" },
  { id:4, name:"Mei", age:27, country:"Japan", flag:"🇯🇵", city:"Tokyo", bio:"Photographer 📸 | Cat person | Matcha > everything", interests:["Photography","Anime","Cats","Nature"], img:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", verified:false, tips:15, lang:"Japanese / English", online:true, continent:"Asia" },
  { id:5, name:"Isabelle", age:28, country:"France", flag:"🇫🇷", city:"Paris", bio:"Chef 🍷 | Art museum wanderer | Looking for my adventure partner", interests:["Cooking","Art","Wine","Travel"], img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", verified:true, tips:61, lang:"French / English", online:true, continent:"Europe" },
  { id:6, name:"Priya", age:30, country:"India", flag:"🇮🇳", city:"Mumbai", bio:"Software engineer 💻 | Bollywood fan | Chai over coffee always", interests:["Tech","Bollywood","Yoga","Food"], img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", verified:true, tips:38, lang:"Hindi / English", online:false, continent:"Asia" },
];

const TIP_AMOUNTS = [1, 2, 5, 10];
const CONTINENTS = ["All","Asia","Africa","Americas","Europe","Oceania"];
const REPORT_REASONS = ["Fake profile","Inappropriate content","Spam","Underage user","Scam / fraud","Other"];

// ── COLORS ────────────────────────────────────────────────────────────────────
const C = {
  teal:"#0d9488", tealDark:"#0f766e", tealLight:"rgba(13,148,136,0.15)",
  tealBorder:"rgba(13,148,136,0.35)", gold:"#d97706",
  dark:"#080f1a", card:"#0f1923", surface:"#131f2e",
  border:"rgba(255,255,255,0.07)", muted:"#64748b",
  text:"#e2e8f0", soft:"#94a3b8", white:"#ffffff",
  danger:"#e11d48", green:"#22c55e",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${C.dark};overflow-x:hidden;}
  ::-webkit-scrollbar{width:0;}
  input,textarea{font-family:'Outfit',sans-serif;}
  input::placeholder,textarea::placeholder{color:${C.muted};}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes scaleIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
  @keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
  @keyframes spin{to{transform:rotate(360deg);}}
  @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  .fu{animation:fadeUp 0.5s ease both;}
  .fu1{animation:fadeUp 0.5s 0.1s ease both;}
  .fu2{animation:fadeUp 0.5s 0.2s ease both;}
  .fu3{animation:fadeUp 0.5s 0.3s ease both;}
  .fu4{animation:fadeUp 0.5s 0.4s ease both;}
  .fu5{animation:fadeUp 0.5s 0.5s ease both;}
  .fi{animation:fadeIn 0.4s ease both;}
  .si{animation:scaleIn 0.35s ease both;}
  .su{animation:slideUp 0.4s cubic-bezier(.4,0,.2,1) both;}
  .float{animation:float 3s ease-in-out infinite;}
  .spin{animation:spin 1s linear infinite;}
  .btn-hover{transition:transform 0.15s,opacity 0.15s;}
  .btn-hover:hover{transform:scale(1.04);opacity:0.92;}
  .btn-hover:active{transform:scale(0.97);}
  input:focus{outline:none;}
`;

// ── HELPERS ───────────────────────────────────────────────────────────────────
const px = (n) => `${n}px`;
const btn = (extra={}) => ({ fontFamily:"'Outfit',sans-serif", cursor:"pointer", border:"none", ...extra });

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [authMode, setAuthMode] = useState("signup");
  const [form, setForm] = useState({ name:"", email:"", password:"", dob:"" });
  const [userName, setUserName] = useState("You");
  const [verifyStep, setVerifyStep] = useState(0); // 0=not started,1=uploading,2=done
  const [verifyFile, setVerifyFile] = useState(null);

  const [continent, setContinent] = useState("All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liked, setLiked] = useState([]);
  const [passed, setPassed] = useState([]);
  const [swipeDir, setSwipeDir] = useState(null);

  const [showTip, setShowTip] = useState(false);
  const [tipTarget, setTipTarget] = useState(null);
  const [selTip, setSelTip] = useState(null);
  const [tipSent, setTipSent] = useState(false);
  const [extraTips, setExtraTips] = useState({});

  const [showMatch, setShowMatch] = useState(false);
  const [matchProfile, setMatchProfile] = useState(null);

  const [showReport, setShowReport] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSent, setReportSent] = useState(false);

  const [activeChat, setActiveChat] = useState(null);
  const [msgs, setMsgs] = useState({});
  const [msgInput, setMsgInput] = useState("");
  const msgEnd = useRef(null);

  const [showPremium, setShowPremium] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const [toast, setToast] = useState(null);

  const filteredProfiles = PROFILES.filter(p =>
    continent === "All" || p.continent === continent
  );
  const current = filteredProfiles[currentIdx];
  const matchedProfiles = PROFILES.filter(p => liked.includes(p.id));

  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, activeChat]);

  const showToast = (msg, color=C.teal) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2800);
  };

  const handleAuth = () => {
    if (!form.email || !form.password) { showToast("Please fill in all fields", C.danger); return; }
    if (authMode === "signup" && !form.name) { showToast("Please enter your name", C.danger); return; }
    if (authMode === "signup" && !form.dob) { showToast("Please enter your date of birth", C.danger); return; }
    if (authMode === "signup") {
      const age = Math.floor((Date.now() - new Date(form.dob)) / 31557600000);
      if (age < 19) { showToast("You must be 19+ to use Meridian", C.danger); return; }
      setUserName(form.name);
      setScreen("verify");
    } else {
      setUserName(form.email.split("@")[0]);
      setScreen("discover");
    }
  };

  const handleVerify = () => {
    setVerifyStep(1);
    setTimeout(() => { setVerifyStep(2); }, 2200);
  };

  const skipVerify = () => setScreen("discover");
  const finishVerify = () => { setScreen("discover"); showToast("Identity verified ✓ You're all set!"); };

  const openTip = (p) => { setTipTarget(p); setShowTip(true); };
  const sendTip = () => {
    if (!selTip) return;
    setExtraTips(prev => ({ ...prev, [tipTarget.id]: (prev[tipTarget.id]||0) + selTip }));
    setTipSent(true);
    setTimeout(() => { setTipSent(false); setShowTip(false); setSelTip(null); setTipTarget(null); showToast(`$${selTip} tip sent! 💸`); }, 1800);
  };

  const openReport = (p) => { setReportTarget(p); setShowReport(true); };
  const sendReport = () => {
    if (!reportReason) return;
    setReportSent(true);
    setTimeout(() => { setReportSent(false); setShowReport(false); setReportReason(""); setReportTarget(null); showToast("Report submitted. We'll review it within 24hrs."); }, 1600);
  };

  const swipe = (dir) => {
    if (!current) return;
    setSwipeDir(dir);
    setTimeout(() => {
      if (dir === "right") {
        setLiked(p => [...p, current.id]);
        if (Math.random() > 0.38) { setMatchProfile(current); setShowMatch(true); }
      } else { setPassed(p => [...p, current.id]); }
      setSwipeDir(null);
      setCurrentIdx(i => i + 1);
    }, 360);
  };

  const sendMsg = () => {
    if (!msgInput.trim() || !activeChat) return;
    const k = activeChat.id;
    const txt = msgInput;
    setMsgs(prev => ({ ...prev, [k]: [...(prev[k]||[]), { from:"me", text:txt, time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }] }));
    setMsgInput("");
    const replies = ["That's so interesting! 😊","I love that about you!","Haha, tell me more!","Where exactly are you from?","We should video call sometime! 🌍","You seem really genuine 💙"];
    setTimeout(() => {
      setMsgs(prev => ({ ...prev, [k]: [...(prev[k]||[]), { from:"them", text:replies[Math.floor(Math.random()*replies.length)], time: new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}) }] }));
    }, 900 + Math.random()*600);
  };

  // ── SHARED COMPONENTS ──────────────────────────────────────────────────────
  const Logo = ({ size=22 }) => (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <div style={{ width:size+6, height:size+6, borderRadius:"50%", background:"linear-gradient(135deg,#0d9488,#d97706)", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width={size-4} height={size-4} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      </div>
      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:size, fontWeight:700, letterSpacing:2, color:C.white }}>MERIDIAN</span>
    </div>
  );

  const PillBtn = ({ children, onClick, style={}, className="" }) => (
    <button className={`btn-hover ${className}`} onClick={onClick} style={{ ...btn(), background:C.teal, color:"#fff", borderRadius:30, padding:"14px 28px", fontWeight:600, fontSize:15, ...style }}>{children}</button>
  );

  const GhostBtn = ({ children, onClick, style={} }) => (
    <button className="btn-hover" onClick={onClick} style={{ ...btn(), background:"none", color:C.soft, fontSize:14, padding:8, ...style }}>{children}</button>
  );

  const Input = ({ placeholder, type="text", value, onChange, style={} }) => (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange}
      style={{ background:"rgba(255,255,255,0.05)", border:`1px solid ${C.border}`, borderRadius:14, padding:"14px 18px", color:C.text, fontSize:15, width:"100%", ...style }} />
  );

  const Sheet = ({ children, onClose }) => (
    <div className="fi" onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:200 }}>
      <div className="su" onClick={e=>e.stopPropagation()} style={{ background:"#111c2a", borderRadius:"28px 28px 0 0", padding:"20px 24px 48px", width:"100%", maxWidth:430, display:"flex", flexDirection:"column", gap:16, alignItems:"center", border:`1px solid ${C.border}` }}>
        <div style={{ width:40, height:4, borderRadius:2, background:"rgba(255,255,255,0.15)", marginBottom:4 }} />
        {children}
      </div>
    </div>
  );

  const Nav = () => (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:C.dark, borderTop:`1px solid ${C.border}`, display:"flex", justifyContent:"space-around", padding:"10px 0 22px", zIndex:100 }}>
      {[["discover","🔥","Discover"],["inbox","💬","Matches"],["profile","👤","Profile"]].map(([id,ico,lbl]) => (
        <button key={id} onClick={()=>setScreen(id)} style={{ ...btn(), display:"flex", flexDirection:"column", alignItems:"center", gap:3, color:screen===id?C.teal:C.muted, position:"relative", padding:"4px 20px" }}>
          <span style={{ fontSize:22 }}>{ico}</span>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:0.8 }}>{lbl.toUpperCase()}</span>
          {id==="inbox" && matchedProfiles.length>0 && <span style={{ position:"absolute", top:0, right:8, background:C.danger, color:"#fff", borderRadius:"50%", width:16, height:16, fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{matchedProfiles.length}</span>}
        </button>
      ))}
    </div>
  );

  const Header = () => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px", background:C.dark, borderBottom:`1px solid ${C.border}`, position:"sticky", top:0, zIndex:50 }}>
      <Logo size={18} />
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        {!isPremium && <button className="btn-hover" onClick={()=>setShowPremium(true)} style={{ ...btn(), background:"linear-gradient(135deg,#d97706,#b45309)", color:"#fff", borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:700 }}>✦ GOLD</button>}
        <div style={{ width:32, height:32, borderRadius:"50%", background:`linear-gradient(135deg,${C.teal},${C.tealDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700 }}>{userName.charAt(0).toUpperCase()}</div>
      </div>
    </div>
  );

  // ── LANDING ────────────────────────────────────────────────────────────────
  if (screen === "landing") return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:C.dark, minHeight:"100vh", maxWidth:430, margin:"0 auto", color:C.white, position:"relative", overflow:"hidden" }}>
      <style>{css}</style>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#080f1a 0%,#0d3330 50%,#080f1a 100%)" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(circle at 15% 85%,rgba(13,148,136,0.28) 0%,transparent 55%),radial-gradient(circle at 85% 15%,rgba(217,119,6,0.18) 0%,transparent 50%)" }} />
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"70px 28px 50px", minHeight:"100vh" }}>
        <div className="fu"><Logo size={24} /></div>

        {/* Stacked card preview */}
        <div className="fu1 float" style={{ position:"relative", width:240, height:320, margin:"44px 0 36px" }}>
          {[2,1,0].map(i=>(
            <div key={i} style={{ position:"absolute", top:i*12, left:i*10, right:-i*10, bottom:-i*12, borderRadius:22, overflow:"hidden", boxShadow:"0 20px 60px rgba(0,0,0,0.55)", border:`1px solid rgba(255,255,255,0.09)` }}>
              <img src={PROFILES[i].img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              {i===0 && <>
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(8,15,26,0.95) 0%,transparent 55%)" }} />
                <div style={{ position:"absolute", bottom:14, left:14 }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600 }}>{PROFILES[0].name}, {PROFILES[0].age}</div>
                  <div style={{ fontSize:12, color:C.soft }}>{PROFILES[0].flag} {PROFILES[0].country}</div>
                </div>
              </>}
            </div>
          ))}
        </div>

        <div className="fu2" style={{ textAlign:"center", marginBottom:10 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:38, fontWeight:600, lineHeight:1.2, marginBottom:12 }}>
            Find love<br /><em style={{ color:C.teal }}>across the world</em>
          </div>
          <div style={{ fontSize:14, color:C.soft, lineHeight:1.8 }}>Connect with verified singles in 150+ countries.<br />Tip to spark a conversation.</div>
        </div>

        <div className="fu3" style={{ display:"flex", gap:10, width:"100%", marginTop:28 }}>
          <PillBtn onClick={()=>{setAuthMode("signup");setScreen("auth");}} style={{ flex:1 }}>Get Started</PillBtn>
          <button className="btn-hover" onClick={()=>{setAuthMode("login");setScreen("auth");}} style={{ ...btn(), flex:1, background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, borderRadius:30, padding:"14px", color:C.white, fontSize:15, fontWeight:500 }}>Sign In</button>
        </div>

        <div className="fu4" style={{ marginTop:36, display:"flex", gap:28 }}>
          {[["20M+","Members"],["150+","Countries"],["90%","Verified"]].map(([n,l])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:C.teal }}>{n}</div>
              <div style={{ fontSize:11, color:C.muted, letterSpacing:1 }}>{l.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── AUTH ───────────────────────────────────────────────────────────────────
  if (screen === "auth") return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:C.dark, minHeight:"100vh", maxWidth:430, margin:"0 auto", color:C.white }}>
      <style>{css}</style>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#080f1a 0%,#0d3330 100%)" }} />
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", padding:"54px 28px 40px", minHeight:"100vh" }}>
        <button onClick={()=>setScreen("landing")} style={{ ...btn(), color:C.teal, fontSize:14, alignSelf:"flex-start", marginBottom:36 }}>← Back</button>
        <div style={{ marginBottom:28 }}><Logo size={20} /></div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:32, fontWeight:600, marginBottom:6 }}>{authMode==="signup"?"Create your account":"Welcome back"}</div>
        <div style={{ fontSize:14, color:C.soft, marginBottom:32, lineHeight:1.6 }}>{authMode==="signup"?"Join singles worldwide on Meridian":"Sign in to continue your journey"}</div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {authMode==="signup" && <Input placeholder="Your name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />}
          <Input placeholder="Email address" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
          <Input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
          {authMode==="signup" && (
            <div>
              <div style={{ fontSize:12, color:C.soft, marginBottom:6, paddingLeft:4 }}>Date of Birth (must be 19+)</div>
              <Input type="date" value={form.dob} onChange={e=>setForm(f=>({...f,dob:e.target.value}))} />
            </div>
          )}
        </div>

        <PillBtn onClick={handleAuth} style={{ width:"100%", marginTop:22, padding:"15px" }}>{authMode==="signup"?"Create Account":"Sign In"}</PillBtn>

        <div style={{ textAlign:"center", marginTop:18, fontSize:14, color:C.soft }}>
          {authMode==="signup"?"Already have an account? ":"New to Meridian? "}
          <span onClick={()=>setAuthMode(authMode==="signup"?"login":"signup")} style={{ color:C.teal, cursor:"pointer", fontWeight:600 }}>
            {authMode==="signup"?"Sign In":"Sign Up"}
          </span>
        </div>

        {authMode==="signup" && (
          <div style={{ marginTop:28, padding:16, background:"rgba(13,148,136,0.08)", border:`1px solid ${C.tealBorder}`, borderRadius:16, fontSize:12, color:C.soft, lineHeight:1.8, textAlign:"center" }}>
            🔒 By signing up you confirm you are 19+<br />
            🌍 Available in 150+ countries · 💸 Tip to connect<br />
            ✓ ID verification required to send tips
          </div>
        )}
      </div>
    </div>
  );

  // ── VERIFY ─────────────────────────────────────────────────────────────────
  if (screen === "verify") return (
    <div style={{ fontFamily:"'Outfit',sans-serif", background:C.dark, minHeight:"100vh", maxWidth:430, margin:"0 auto", color:C.white }}>
      <style>{css}</style>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(160deg,#080f1a 0%,#0d2f2c 100%)" }} />
      <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"60px 28px 40px", minHeight:"100vh" }}>
        <div className="fu" style={{ marginBottom:32 }}><Logo size={20} /></div>

        {verifyStep === 0 && <>
          <div className="fu1" style={{ width:80, height:80, borderRadius:"50%", background:C.tealLight, border:`2px solid ${C.tealBorder}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, marginBottom:24 }}>🪪</div>
          <div className="fu2" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, textAlign:"center", marginBottom:10 }}>Verify Your Identity</div>
          <div className="fu3" style={{ fontSize:14, color:C.soft, textAlign:"center", lineHeight:1.8, marginBottom:32 }}>
            Meridian requires ID verification to keep everyone safe. This protects you and others from scammers and underage users.<br /><br />
            We use <strong style={{color:C.teal}}>Veriff</strong> — your ID is encrypted and never shared.
          </div>
          <div className="fu4" style={{ width:"100%", display:"flex", flexDirection:"column", gap:12, marginBottom:24 }}>
            {[["🪪","Government-issued ID (passport, driver's license)"],["🤳","A quick selfie to match your ID"],["⚡","Takes less than 2 minutes"]].map(([ico,txt])=>(
              <div key={txt} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:C.tealLight, border:`1px solid ${C.tealBorder}`, borderRadius:14 }}>
                <span style={{ fontSize:20 }}>{ico}</span>
                <span style={{ fontSize:13, color:C.text }}>{txt}</span>
              </div>
            ))}
          </div>
          <PillBtn onClick={handleVerify} style={{ width:"100%" }} className="fu5">Start Verification</PillBtn>
          <GhostBtn onClick={skipVerify} style={{ marginTop:12 }}>Skip for now (tips disabled)</GhostBtn>
          <div style={{ marginTop:16, fontSize:11, color:C.muted, textAlign:"center" }}>Powered by Veriff · SOC2 & GDPR compliant</div>
        </>}

        {verifyStep === 1 && (
          <div className="fi" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20, marginTop:40 }}>
            <div className="spin" style={{ width:60, height:60, borderRadius:"50%", border:`3px solid ${C.teal}`, borderTopColor:"transparent" }} />
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24 }}>Verifying your identity…</div>
            <div style={{ fontSize:13, color:C.soft }}>This usually takes under 60 seconds</div>
          </div>
        )}

        {verifyStep === 2 && (
          <div className="si" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, marginTop:20, textAlign:"center" }}>
            <div style={{ width:80, height:80, borderRadius:"50%", background:"rgba(34,197,94,0.15)", border:"2px solid #22c55e", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36 }}>✅</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:600, color:C.green }}>Verified!</div>
            <div style={{ fontSize:14, color:C.soft, lineHeight:1.7 }}>Your identity has been confirmed.<br />You can now send and receive tips.</div>
            <PillBtn onClick={finishVerify} style={{ marginTop:8, width:"100%" }}>Enter Meridian →</PillBtn>
          </div>
        )}
      </div>
    </div>
  );

  // ── MAIN APP ───────────────────────────────────────────────────────────────
  const root = { fontFamily:"'Outfit',sans-serif", background:C.dark, minHeight:"100vh", maxWidth:430, margin:"0 auto", color:C.white, position:"relative", display:"flex", flexDirection:"column" };

  return (
    <div style={root}>
      <style>{css}</style>
      <Header />

      {/* ── DISCOVER ── */}
      {screen === "discover" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", padding:"14px 14px 90px", gap:14, overflowY:"auto" }}>

          {/* Continent filter */}
          <div style={{ display:"flex", gap:8, overflowX:"auto", width:"100%", paddingBottom:2, scrollbarWidth:"none" }}>
            {CONTINENTS.map(c=>(
              <button key={c} onClick={()=>{setContinent(c);setCurrentIdx(0);}} style={{ ...btn(), background:continent===c?C.teal:"rgba(255,255,255,0.05)", border:continent===c?`1px solid ${C.teal}`:`1px solid ${C.border}`, borderRadius:20, padding:"6px 16px", fontSize:13, whiteSpace:"nowrap", color:continent===c?C.white:C.soft, fontWeight:500 }}>{c}</button>
            ))}
          </div>

          {current ? (
            <>
              {/* Profile Card */}
              <div className="fi" style={{ width:"100%", maxWidth:400, borderRadius:28, overflow:"hidden", position:"relative", boxShadow:"0 24px 64px rgba(0,0,0,0.65)", border:`1px solid ${C.border}`, transform:swipeDir==="left"?"translateX(-130%) rotate(-18deg)":swipeDir==="right"?"translateX(130%) rotate(18deg)":"none", transition:swipeDir?"transform 0.36s cubic-bezier(.4,0,.2,1)":"none" }}>
                <img src={current.img} alt={current.name} style={{ width:"100%", height:440, objectFit:"cover", display:"block" }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(8,15,26,0.97) 0%,rgba(8,15,26,0.1) 55%,transparent 100%)" }} />

                {/* Top badges */}
                <div style={{ position:"absolute", top:14, left:14, display:"flex", gap:8 }}>
                  {current.verified && <div style={{ background:C.teal, color:"#fff", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>✓ Verified</div>}
                  {isPremium && <div style={{ background:"rgba(217,119,6,0.9)", color:"#fff", borderRadius:20, padding:"4px 10px", fontSize:12, fontWeight:600 }}>✦ Gold</div>}
                </div>

                {/* Online dot */}
                {current.online && <div style={{ position:"absolute", top:18, right:16, width:12, height:12, borderRadius:"50%", background:C.green, border:`2px solid ${C.dark}` }} />}

                {/* Report button */}
                <button onClick={()=>openReport(current)} style={{ ...btn(), position:"absolute", top:14, right:current.online?36:14, background:"rgba(0,0,0,0.4)", border:`1px solid rgba(255,255,255,0.15)`, borderRadius:"50%", width:32, height:32, color:C.soft, fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>⋯</button>

                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"16px 20px" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, marginBottom:2 }}>{current.name}, {current.age}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                    <span style={{ fontSize:14 }}>{current.flag}</span>
                    <span style={{ fontSize:14, color:C.soft }}>{current.city}, {current.country}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.teal, marginBottom:8 }}>🌐 {current.lang}</div>
                  <div style={{ fontSize:13, color:"#cbd5e1", marginBottom:10, lineHeight:1.6 }}>{current.bio}</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                    {current.interests.map(t=>(
                      <span key={t} style={{ background:"rgba(255,255,255,0.08)", border:`1px solid rgba(255,255,255,0.14)`, borderRadius:20, padding:"3px 12px", fontSize:12, color:"#e2e8f0" }}>{t}</span>
                    ))}
                  </div>

                  {/* Tip strip */}
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(13,148,136,0.14)", border:`1px solid ${C.tealBorder}`, borderRadius:14, padding:"10px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:16 }}>💸</span>
                      <span style={{ fontSize:14, fontWeight:600, color:"#5eead4" }}>{current.tips+(extraTips[current.id]||0)} tips</span>
                      <span style={{ fontSize:11, color:C.muted }}>encourages replies</span>
                    </div>
                    <button className="btn-hover" onClick={()=>openTip(current)} style={{ ...btn(), background:C.teal, color:"#fff", borderRadius:20, padding:"7px 16px", fontSize:13, fontWeight:600 }}>+ Tip</button>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display:"flex", gap:20, alignItems:"center" }}>
                <button className="btn-hover" onClick={()=>swipe("left")} style={{ ...btn(), width:62, height:62, borderRadius:"50%", background:"rgba(255,255,255,0.05)", border:`1.5px solid rgba(255,255,255,0.12)`, display:"flex", alignItems:"center", justifyContent:"center", color:C.danger }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
                <button className="btn-hover" onClick={()=>openTip(current)} style={{ ...btn(), width:54, height:54, borderRadius:"50%", background:C.tealLight, border:`1.5px solid ${C.teal}`, fontSize:22 }}>💸</button>
                <button className="btn-hover" onClick={()=>swipe("right")} style={{ ...btn(), width:62, height:62, borderRadius:"50%", background:"rgba(255,255,255,0.05)", border:`1.5px solid rgba(255,255,255,0.12)`, display:"flex", alignItems:"center", justifyContent:"center", color:C.teal }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
              <p style={{ fontSize:11, color:C.muted, margin:0, letterSpacing:0.8 }}>SWIPE · TIP · CONNECT ACROSS 150+ COUNTRIES</p>
            </>
          ) : (
            <div className="fi" style={{ textAlign:"center", padding:"80px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
              <div style={{ fontSize:56 }}>🌍</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600 }}>You've seen everyone!</div>
              <div style={{ fontSize:14, color:C.soft }}>Try a different continent or check back soon</div>
              <PillBtn onClick={()=>{setCurrentIdx(0);setContinent("All");}}>Refresh Profiles</PillBtn>
            </div>
          )}
        </div>
      )}

      {/* ── INBOX ── */}
      {screen === "inbox" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px 16px 90px", gap:12, overflowY:"auto" }}>
          {activeChat ? (
            // Chat view
            <div className="fi" style={{ display:"flex", flexDirection:"column", gap:10, flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, paddingBottom:14, borderBottom:`1px solid ${C.border}` }}>
                <button onClick={()=>setActiveChat(null)} style={{ ...btn(), color:C.teal, fontSize:14 }}>← Back</button>
                <img src={activeChat.img} alt="" style={{ width:42, height:42, borderRadius:"50%", objectFit:"cover" }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:16 }}>{activeChat.name}</div>
                  <div style={{ fontSize:12, color:activeChat.online?C.green:C.muted }}>{activeChat.online?"● Active now":"○ Offline"}</div>
                </div>
                <button className="btn-hover" onClick={()=>openReport(activeChat)} style={{ ...btn(), color:C.muted, fontSize:18 }}>⋯</button>
                <button className="btn-hover" onClick={()=>openTip(activeChat)} style={{ ...btn(), background:C.tealLight, border:`1px solid ${C.tealBorder}`, color:C.teal, borderRadius:20, padding:"6px 14px", fontSize:13, fontWeight:600 }}>💸 Tip</button>
              </div>

              <div style={{ background:"rgba(13,148,136,0.07)", border:`1px solid ${C.tealBorder}`, borderRadius:10, padding:"8px 14px", fontSize:12, color:C.teal, textAlign:"center" }}>
                🌐 Auto-translating · {activeChat.lang}
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:10, flex:1, overflowY:"auto", minHeight:200, maxHeight:380, paddingRight:2 }}>
                {(msgs[activeChat.id]||[{from:"them",text:"Hey! We matched 🎉 How are you?",time:"now"}]).map((m,i)=>(
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="me"?"flex-end":"flex-start", gap:2 }}>
                    <div style={{ background:m.from==="me"?C.teal:"rgba(255,255,255,0.07)", borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"10px 16px", maxWidth:"78%", fontSize:14, color:C.white, lineHeight:1.5 }}>{m.text}</div>
                    <div style={{ fontSize:10, color:C.muted, paddingInline:4 }}>{m.time}</div>
                  </div>
                ))}
                <div ref={msgEnd} />
              </div>

              <div style={{ display:"flex", gap:10, marginTop:4 }}>
                <input value={msgInput} onChange={e=>setMsgInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder="Type a message…" style={{ flex:1, background:"rgba(255,255,255,0.06)", border:`1px solid ${C.border}`, borderRadius:24, padding:"12px 18px", color:C.white, fontSize:14 }} />
                <button className="btn-hover" onClick={sendMsg} style={{ ...btn(), background:C.teal, borderRadius:"50%", width:46, height:46, color:"#fff", fontSize:18 }}>➤</button>
              </div>
            </div>
          ) : (
            // Match list
            <>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, marginBottom:4 }}>Your Matches</div>
              {matchedProfiles.length === 0 ? (
                <div className="fi" style={{ textAlign:"center", padding:"70px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
                  <div style={{ fontSize:52 }}>💫</div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24 }}>No matches yet</div>
                  <div style={{ fontSize:14, color:C.soft }}>Swipe and tip to spark connections worldwide</div>
                  <PillBtn onClick={()=>setScreen("discover")}>Start Discovering</PillBtn>
                </div>
              ) : matchedProfiles.map(p=>(
                <div key={p.id} className="btn-hover" onClick={()=>setActiveChat(p)} style={{ display:"flex", alignItems:"center", gap:14, background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:"14px 16px", cursor:"pointer" }}>
                  <div style={{ position:"relative" }}>
                    <img src={p.img} alt="" style={{ width:54, height:54, borderRadius:"50%", objectFit:"cover" }} />
                    {p.online && <div style={{ position:"absolute", bottom:2, right:2, width:11, height:11, borderRadius:"50%", background:C.green, border:`2px solid ${C.dark}` }} />}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:16 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{p.flag} {p.city}, {p.country}</div>
                    <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>{msgs[p.id]?.at(-1)?.text||"Say hello 👋"}</div>
                  </div>
                  <button className="btn-hover" onClick={e=>{e.stopPropagation();openTip(p);}} style={{ ...btn(), background:C.tealLight, border:`1px solid ${C.tealBorder}`, borderRadius:20, padding:"6px 12px", fontSize:15 }}>💸</button>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── PROFILE ── */}
      {screen === "profile" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"20px 20px 90px", gap:18, overflowY:"auto" }}>
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background:`linear-gradient(135deg,${C.teal},${C.tealDark})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, fontWeight:700 }}>{userName.charAt(0).toUpperCase()}</div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600 }}>{userName}</div>
              <div style={{ fontSize:13, color:C.soft, marginTop:2 }}>{form.email||"meridian@user.com"}</div>
            </div>
            {verifyStep===2 ? <div style={{ background:"rgba(34,197,94,0.12)", border:"1px solid #22c55e", borderRadius:20, padding:"5px 14px", fontSize:12, color:C.green, fontWeight:600 }}>✓ Identity Verified</div>
            : <button className="btn-hover" onClick={()=>setScreen("verify")} style={{ ...btn(), background:C.tealLight, border:`1px solid ${C.tealBorder}`, borderRadius:20, padding:"6px 16px", fontSize:12, color:C.teal, fontWeight:600 }}>🪪 Verify Identity</button>}
          </div>

          {/* Premium card */}
          {!isPremium && (
            <div className="fu1" style={{ background:"linear-gradient(135deg,rgba(217,119,6,0.15),rgba(180,83,9,0.1))", border:"1px solid rgba(217,119,6,0.3)", borderRadius:20, padding:"18px 20px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:600, color:"#fbbf24" }}>✦ Meridian Gold</div>
                  <div style={{ fontSize:13, color:C.soft, marginTop:4, lineHeight:1.6 }}>Unlimited swipes · See who liked you<br />Priority in discovery · Read receipts</div>
                </div>
                <PillBtn onClick={()=>setShowPremium(true)} style={{ background:"linear-gradient(135deg,#d97706,#b45309)", padding:"10px 18px", fontSize:14 }}>Upgrade</PillBtn>
              </div>
            </div>
          )}

          {/* Settings list */}
          {[["🔔","Notifications","Manage push notifications"],["🔒","Privacy","Control who sees your profile"],["🌐","Language","Auto-translate messages"],["💳","Payment Methods","Manage cards for tipping"],["🛡️","Safety Center","Reporting & blocking tools"],["📋","Terms & Privacy","Legal documents"]].map(([ico,title,sub])=>(
            <div key={title} className="btn-hover" style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, cursor:"pointer" }}>
              <span style={{ fontSize:20 }}>{ico}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:500, fontSize:15 }}>{title}</div>
                <div style={{ fontSize:12, color:C.muted, marginTop:1 }}>{sub}</div>
              </div>
              <span style={{ color:C.muted }}>›</span>
            </div>
          ))}

          <button className="btn-hover" onClick={()=>{setScreen("landing");setForm({name:"",email:"",password:"",dob:""});setLiked([]);setCurrentIdx(0);}} style={{ ...btn(), background:"rgba(225,29,72,0.1)", border:"1px solid rgba(225,29,72,0.25)", borderRadius:16, padding:"14px", color:C.danger, fontSize:15, fontWeight:500, marginTop:4 }}>Sign Out</button>
        </div>
      )}

      <Nav />

      {/* ── TIP MODAL ── */}
      {showTip && (
        <Sheet onClose={()=>{setShowTip(false);setSelTip(null);}}>
          {tipSent ? (
            <div className="si" style={{ textAlign:"center", padding:"20px 0", display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
              <div style={{ fontSize:58 }}>🎉</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:28, fontWeight:600, color:C.teal }}>Tip Sent!</div>
              <div style={{ fontSize:14, color:C.soft, lineHeight:1.7 }}>Your ${selTip} tip was sent to {tipTarget?.name}.<br />Tips encourage genuine replies — no pressure, just kindness.</div>
            </div>
          ) : <>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600 }}>Tip {tipTarget?.name} 💸</div>
            <div style={{ fontSize:13, color:C.soft, textAlign:"center", lineHeight:1.7, maxWidth:300 }}>A respectful way to show genuine interest. No nudity or pressure — just a kind gesture to encourage a reply.</div>
            <div style={{ display:"flex", gap:12 }}>
              {TIP_AMOUNTS.map(a=>(
                <button key={a} className="btn-hover" onClick={()=>setSelTip(a)} style={{ ...btn(), width:70, height:70, borderRadius:18, background:selTip===a?C.tealLight:"rgba(255,255,255,0.04)", border:selTip===a?`2px solid ${C.teal}`:`1.5px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:20, fontWeight:700, color:selTip===a?C.teal:C.white }}>${a}</span>
                </button>
              ))}
            </div>
            <PillBtn onClick={sendTip} style={{ width:"100%", opacity:selTip?1:0.4, padding:"15px" }}>Send ${selTip??"?"} Tip</PillBtn>
            <GhostBtn onClick={()=>{setShowTip(false);setSelTip(null);}}>Cancel</GhostBtn>
          </>}
        </Sheet>
      )}

      {/* ── REPORT MODAL ── */}
      {showReport && (
        <Sheet onClose={()=>{setShowReport(false);setReportReason("");}}>
          {reportSent ? (
            <div className="si" style={{ textAlign:"center", padding:"16px 0", display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
              <div style={{ fontSize:52 }}>🛡️</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:600 }}>Report Submitted</div>
              <div style={{ fontSize:13, color:C.soft, lineHeight:1.7 }}>Our team will review this within 24 hours.<br />Thank you for keeping Meridian safe.</div>
            </div>
          ) : <>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:600 }}>Report {reportTarget?.name}</div>
            <div style={{ fontSize:13, color:C.soft, textAlign:"center" }}>Select a reason for your report</div>
            <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:8 }}>
              {REPORT_REASONS.map(r=>(
                <button key={r} className="btn-hover" onClick={()=>setReportReason(r)} style={{ ...btn(), background:reportReason===r?C.tealLight:"rgba(255,255,255,0.04)", border:reportReason===r?`1.5px solid ${C.teal}`:`1px solid ${C.border}`, borderRadius:12, padding:"12px 16px", color:reportReason===r?C.teal:C.text, fontSize:14, textAlign:"left", fontWeight:reportReason===r?600:400 }}>
                  {r}
                </button>
              ))}
            </div>
            <PillBtn onClick={sendReport} style={{ width:"100%", opacity:reportReason?1:0.4, background:C.danger }}>Submit Report</PillBtn>
            <GhostBtn onClick={()=>{setShowReport(false);setReportReason("");}}>Cancel</GhostBtn>
          </>}
        </Sheet>
      )}

      {/* ── PREMIUM MODAL ── */}
      {showPremium && (
        <Sheet onClose={()=>setShowPremium(false)}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:"#fbbf24" }}>✦ Meridian Gold</div>
          <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10 }}>
            {[["♾️","Unlimited swipes every day"],["👁️","See who liked your profile"],["⚡","Priority placement in discovery"],["✓","Read receipts in chat"],["🔁","Undo your last swipe"],["🌍","Travel mode — match in any city"]].map(([ico,feat])=>(
              <div key={feat} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 14px", background:"rgba(217,119,6,0.08)", border:"1px solid rgba(217,119,6,0.2)", borderRadius:12 }}>
                <span style={{ fontSize:18 }}>{ico}</span>
                <span style={{ fontSize:14, color:C.text }}>{feat}</span>
              </div>
            ))}
          </div>
          <div style={{ width:"100%", display:"flex", gap:10 }}>
            {[["$9.99","/ week"],["$24.99","/ month"],["$59.99","/ 3 months"]].map(([price,period])=>(
              <div key={period} style={{ flex:1, background:"rgba(217,119,6,0.1)", border:"1px solid rgba(217,119,6,0.25)", borderRadius:14, padding:"12px 8px", textAlign:"center", cursor:"pointer" }}>
                <div style={{ fontWeight:700, fontSize:16, color:"#fbbf24" }}>{price}</div>
                <div style={{ fontSize:11, color:C.muted }}>{period}</div>
              </div>
            ))}
          </div>
          <button className="btn-hover" onClick={()=>{setIsPremium(true);setShowPremium(false);showToast("Welcome to Meridian Gold ✦","#d97706");}} style={{ ...btn(), background:"linear-gradient(135deg,#d97706,#b45309)", color:"#fff", borderRadius:30, padding:"15px", width:"100%", fontWeight:700, fontSize:15 }}>Upgrade to Gold</button>
          <GhostBtn onClick={()=>setShowPremium(false)}>Maybe later</GhostBtn>
        </Sheet>
      )}

      {/* ── MATCH CELEBRATION ── */}
      {showMatch && matchProfile && (
        <div className="fi" style={{ position:"fixed", inset:0, background:"linear-gradient(160deg,#080f1a 0%,#0d3330 100%)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300 }}>
          <div className="si" style={{ textAlign:"center", padding:"40px 28px", display:"flex", flexDirection:"column", gap:16, alignItems:"center" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, color:C.teal, letterSpacing:3 }}>IT'S A</div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:56, fontWeight:700, color:C.white, lineHeight:1 }}>Match!</div>
            <div style={{ display:"flex", gap:-12 }}>
              <div style={{ width:80, height:80, borderRadius:"50%", border:`3px solid ${C.teal}`, overflow:"hidden" }}>
                <img src={matchProfile.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              </div>
            </div>
            <div style={{ fontSize:16, color:C.soft, lineHeight:1.7 }}>You and <strong style={{color:C.white}}>{matchProfile.name}</strong> from {matchProfile.flag} {matchProfile.country} liked each other</div>
            <PillBtn onClick={()=>{setShowMatch(false);setActiveChat(matchProfile);setScreen("inbox");}} style={{ width:"100%", marginTop:8 }}>Send a Message</PillBtn>
            <GhostBtn onClick={()=>setShowMatch(false)}>Keep Swiping</GhostBtn>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className="fu" style={{ position:"fixed", top:80, left:"50%", transform:"translateX(-50%)", background:toast.color||C.teal, color:"#fff", borderRadius:30, padding:"12px 24px", fontSize:14, fontWeight:600, zIndex:400, whiteSpace:"nowrap", boxShadow:"0 8px 32px rgba(0,0,0,0.4)" }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
