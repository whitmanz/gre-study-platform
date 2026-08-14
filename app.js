/* ============================================================
   GRE 刷题平台 — app.js  (vanilla JS, no build, works from file://)
   ============================================================ */
(function(){
"use strict";

/* ---------- tiny helpers ---------- */
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const esc = s => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const uid = () => Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const LS_TESTS = "gre_tests_v1";
const LS_RES = "gre_results_v1";

function loadTests(){ try{ return JSON.parse(localStorage.getItem(LS_TESTS))||[]; }catch(e){ return []; } }
function saveTests(t){ localStorage.setItem(LS_TESTS, JSON.stringify(t)); }
function loadRes(){ try{ return JSON.parse(localStorage.getItem(LS_RES))||[]; }catch(e){ return []; } }
function saveRes(r){ localStorage.setItem(LS_RES, JSON.stringify(r)); }
function toast(msg){ const t=document.createElement("div"); t.className="toast"; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),1900); }

/* ============================================================
   DEMO TEST — embedded so the platform works immediately
   ============================================================ */
const DEMO_TEST = {
  id:"demo", title:"示例 · 博哥三步法实战（10题）", createdAt:Date.now(), source:"demo", type:"verbal",
  questions:[
    {num:1,section:"Text Completion",blanks:1,multi:false,
     text:"Scientists have argued not only that the chains of atoms called ladder compounds have ____ theoretical interest but also that studies of such systems can lead to important practical applications.",
     options:[{letter:"A",text:"limited",blankIdx:0},{letter:"B",text:"dubious",blankIdx:0},{letter:"C",text:"superfluous",blankIdx:0},{letter:"D",text:"unidimensional",blankIdx:0},{letter:"E",text:"intrinsic",blankIdx:0}],
     answers:["E"],explanation:"intrinsic = 固有的、本质的。not only…but also 取同，后文 important practical applications 为正面，故空格应为正面价值。其余皆为负面或削弱义。"},
    {num:2,section:"Text Completion",blanks:1,multi:false,
     text:"While the writer was best known for her much-ballyhooed ____, her impact reached far beyond memorable quips.",
     options:[{letter:"A",text:"pensiveness",blankIdx:0},{letter:"B",text:"drollness",blankIdx:0},{letter:"C",text:"stoicism",blankIdx:0},{letter:"D",text:"fastidiousness",blankIdx:0},{letter:"E",text:"congeniality",blankIdx:0}],
     answers:["B"],explanation:"drollness = 古怪搞笑的特质。While 转折，句末线索 memorable quips（妙语）提示空格≈quips。"},
    {num:3,section:"Text Completion",blanks:2,multi:false,
     text:"Although the vast weight of evidence supports the contention that the products of agricultural biotechnology are environmentally (i)____, many people still find them (ii)____ unsettling.",
     options:[{letter:"A",text:"destructive",blankIdx:0},{letter:"B",text:"sound",blankIdx:0},{letter:"C",text:"intriguing",blankIdx:0},{letter:"D",text:"retroactively",blankIdx:1},{letter:"E",text:"innocuously",blankIdx:1},{letter:"F",text:"intrinsically",blankIdx:1}],
     answers:["B","F"],explanation:"Although 转折 + unsettling 负面。证据半应为正面 → sound；人们“本质上不安”→ intrinsically unsettling。"},
    {num:4,section:"Text Completion",blanks:2,multi:false,
     text:"World demand for oil had been intensified, but it slackened because China’s surge in oil consumption had (i)____. Moreover, high oil prices had themselves started to act as a short-term (ii)____ the global economy, thus further dampening demand.",
     options:[{letter:"A",text:"spread",blankIdx:0},{letter:"B",text:"commenced",blankIdx:0},{letter:"C",text:"slowed",blankIdx:0},{letter:"D",text:"spur to",blankIdx:1},{letter:"E",text:"drag on",blankIdx:1},{letter:"F",text:"panacea for",blankIdx:1}],
     answers:["C","E"],explanation:"but + because 因果取同：需求 slackened 因中国消费 (i)slowed。Moreover 取同 dampening → (ii) drag on（拖累）。"},
    {num:5,section:"Text Completion",blanks:2,multi:false,
     text:"Although she admitted that her airport expansion plan had recently collapsed, the governor (i)____ the significance of the failure, pointing out that competing economic development proposals are now more (ii)____.",
     options:[{letter:"A",text:"minimized",blankIdx:0},{letter:"B",text:"touted",blankIdx:0},{letter:"C",text:"acknowledged",blankIdx:0},{letter:"D",text:"tenuous",blankIdx:1},{letter:"E",text:"complicated",blankIdx:1},{letter:"F",text:"important",blankIdx:1}],
     answers:["A","D"],explanation:"Although 转折：承认 collapse 却 (i)minimized 意义。后半竞争方案更 (ii)tenuous（薄弱），支撑“失败无足轻重”。"},
    {num:6,section:"Text Completion",blanks:3,multi:false,
     text:"It is possible to go 40+ hours without sleep and still be able to (i)____ information acquired at the beginning of the sleepless period. Thus, sleep’s role is in the (ii)____ encoding of information, not a (iii)____ of sleep for recalling events of the prior day.",
     options:[{letter:"A",text:"legitimate",blankIdx:0},{letter:"B",text:"augment",blankIdx:0},{letter:"C",text:"disgorge",blankIdx:0},{letter:"D",text:"longer-term",blankIdx:1},{letter:"E",text:"acute",blankIdx:1},{letter:"F",text:"qualitative",blankIdx:1},{letter:"G",text:"requirement",blankIdx:2},{letter:"H",text:"surplus",blankIdx:2},{letter:"I",text:"facet",blankIdx:2}],
     answers:["C","D","G"],explanation:"句1 不睡也能 (i)disgorge（调出）信息。句2 not a (iii)requirement（非必需）→ 与“不睡也能回忆”呼应；(ii) longer-term 与即时对照。"},
    {num:7,section:"Sentence Equivalence",blanks:1,multi:true,
     text:"Not only is the advent of bookless libraries too large and powerful a change to be ____, it also offers too many real advantages for it to be considered a tragedy.",
     options:[{letter:"A",text:"understood",blankIdx:0},{letter:"B",text:"averted",blankIdx:0},{letter:"C",text:"foreseen",blankIdx:0},{letter:"D",text:"forestalled",blankIdx:0},{letter:"E",text:"endured",blankIdx:0},{letter:"F",text:"anticipated",blankIdx:0}],
     answers:["B","D"],explanation:"Not only…but also 取同。变化太强无法被“阻止”→ averted / forestalled 同义对。"},
    {num:8,section:"Sentence Equivalence",blanks:1,multi:true,
     text:"Although men still dominate astronomy, the increasing numbers of younger women could ____ a change in its gender mix.",
     options:[{letter:"A",text:"require",blankIdx:0},{letter:"B",text:"alleviate",blankIdx:0},{letter:"C",text:"block",blankIdx:0},{letter:"D",text:"presage",blankIdx:0},{letter:"E",text:"portend",blankIdx:0},{letter:"F",text:"hinder",blankIdx:0}],
     answers:["D","E"],explanation:"Although + could：女性增多可能“预示”变化 → presage / portend 同义对。"},
    {num:9,section:"Sentence Equivalence",blanks:1,multi:true,
     text:"The life of a secret agent is dangerous enough, but the life of a double agent is infinitely more ____: a single slip can send an agent crashing to destruction.",
     options:[{letter:"A",text:"arduous",blankIdx:0},{letter:"B",text:"precarious",blankIdx:0},{letter:"C",text:"clandestine",blankIdx:0},{letter:"D",text:"perilous",blankIdx:0},{letter:"E",text:"covert",blankIdx:0},{letter:"F",text:"exhilarating",blankIdx:0}],
     answers:["B","D"],explanation:"but more + 冒号“一步失误即毁灭”→ 更危险。precarious / perilous 同义对。"},
    {num:10,section:"Sentence Equivalence",blanks:1,multi:true,
     text:"They were struck that a single mathematical formula can describe physical phenomena that appear to be so ____.",
     options:[{letter:"A",text:"rudimentary",blankIdx:0},{letter:"B",text:"interdependent",blankIdx:0},{letter:"C",text:"interrelated",blankIdx:0},{letter:"D",text:"complex",blankIdx:0},{letter:"E",text:"heterogeneous",blankIdx:0},{letter:"F",text:"dissimilar",blankIdx:0}],
     answers:["E","F"],explanation:"paradox：一个公式描述看似如此“不同”的现象才构成悖论 → heterogeneous / dissimilar 同义对。"}
  ]
};

const BUILTIN = { demo: DEMO_TEST, ...(window.BUILTIN_TESTS || {}) };
function builtinList(){ return Object.values(BUILTIN); }
function isBuiltin(id){ return BUILTIN.hasOwnProperty(id); }

/* ============================================================
   PARSER — turn raw text (PDF-extracted or MD) into questions
   ============================================================ */
function parseAnswers(s){
  const out=[]; const re=/([A-Ia-i])/g; let m;
  while((m=re.exec(s))) out.push(m[1].toUpperCase());
  return out;
}
function finalizeQ(q){
  // Number of blanks is determined by the question TEXT, not the option
  // letters — otherwise a 6-option SE (A–F, one per line) looks like 2 blanks.
  const biSet = new Set(tokenize(q.text).filter(t=>t.t==="blank").map(t=>t.bi));
  let blanks = biSet.size;
  if(blanks===0) blanks=1;
  if(q.options.length===0){
    // numeric-entry question: no options, answer is the typed value
    q.kind="numeric"; q.blanks=0; q.multi=false;
  } else {
    q.kind="choice";
    q.blanks = blanks;
    const idxMap={A:0,B:0,C:0,D:1,E:1,F:1,G:2,H:2,I:2};
    q.options.forEach(o=> o.blankIdx = blanks===1 ? 0 : (idxMap[o.letter]??0));
    q.multi = (blanks===1 && q.answers.length>=2);
  }
  q.answers = q.answers.map(a=>String(a).toUpperCase());
  return q;
}
/* split a line into multiple option entries (handles side-by-side columns
   like "   A. sound   D. retroactively" ) */
function optionMarkers(line){
  const re=/(^|\s)([A-Ia-i])\.\s+/g;
  const ms=[]; let m;
  while((m=re.exec(line))){ ms.push({idx:m.index+m[1].length, letter:m[2].toUpperCase(), textStart:m.index+m[0].length}); }
  if(!ms.length) return [];
  const res=[];
  for(let i=0;i<ms.length;i++){
    const end = (i+1<ms.length)? ms[i+1].idx : line.length;
    const text=line.slice(ms[i].textStart, end).trim();
    if(text.length) res.push({letter:ms[i].letter, text});
  }
  return res;
}
function parseDocument(rawText, title, source){
  const lines = rawText.split(/\r?\n/);
  const questions=[];
  let cur=null, mode=null, pendingSection="";
  const qStart=/^(\d{1,3})[\.、\)]\s+(.+)$/;
  const ansRe=/^\s*[>*#\-]?\s*(?:answer|答案|ans)\s*[:：]\s*(.+)$/i;
  const expRe=/^\s*[>*#\-]?\s*(?:explanation|解析|exp|note)\s*[:：]\s*(.+)$/i;
  const secRe=/^\s*[>*#\-]?\s*(?:section|部分|sec)\s*[:：]\s*(.+)$/i;

  function flush(){
    if(cur && cur.text && (cur.options.length || cur.answers.length)){ finalizeQ(cur); questions.push(cur); }
    cur=null;
  }
  for(const line of lines){
    let m;
    if((m=secRe.exec(line))){ if(cur) cur.section=m[1].trim(); else pendingSection=m[1].trim(); mode="meta"; continue; }
    if((m=ansRe.exec(line)) && cur){
      // numeric-entry (no options) stores the raw value; choice questions
      // store the selected letter(s)
      cur.answers = (cur.options.length===0) ? [m[1].trim()] : parseAnswers(m[1]);
      mode="meta"; continue;
    }
    if((m=expRe.exec(line)) && cur){ cur.explanation=(cur.explanation?cur.explanation+"\n":"")+m[1].trim(); mode="meta"; continue; }
    if((m=qStart.exec(line))){
      flush();
      cur={num:+m[1], text:m[2].trim(), options:[], answers:[], explanation:"", section:pendingSection};
      pendingSection=""; mode="text"; continue;
    }
    if(cur && mode!=="meta"){
      const trimmed=line.trim();
      if(/^[A-Ia-i]\./.test(trimmed) || mode==="options"){
        const found=optionMarkers(line);
        if(found.length){ found.forEach(f=>cur.options.push({letter:f.letter,text:f.text,blankIdx:0})); mode="options"; continue; }
      }
    }
    const t=line.trim();
    if(!t || !cur) continue;
    if(mode==="text") cur.text+=" "+t;
    else if(mode==="options"){ if(cur.options.length) cur.options[cur.options.length-1].text+=" "+t; else cur.text+=" "+t; }
    else if(mode==="meta" && cur.explanation) cur.explanation+=" "+t;
  }
  flush();
  // assign stable ids
  questions.forEach((q,i)=> q.id = uid());
  return { title:title||"未命名试卷", source, questions };
}

/* ============================================================
   STATE + ROUTER
   ============================================================ */
const state = { view:"cover", test:null, idx:0, sel:{}, review:null, reviewIdx:0, start:0, timer:null };

function setSel(qid, blankIdx, letter){
  const q = state.test.questions.find(x=>x.id===qid);
  if(q.multi){
    if(!Array.isArray(state.sel[qid])) state.sel[qid]=[];
    const arr=state.sel[qid];
    const i=arr.indexOf(letter);
    if(i>=0) arr.splice(i,1); else if(arr.length<2) arr.push(letter);
  } else {
    if(!Array.isArray(state.sel[qid])) state.sel[qid]=new Array(q.blanks).fill(null);
    state.sel[qid][blankIdx]= (state.sel[qid][blankIdx]===letter)? null : letter;
  }
}
function getSel(qid){
  const s=state.sel[qid];
  if(Array.isArray(s)) return s.filter(Boolean);
  return (s||[]).filter(Boolean);
}
/* numeric entry helpers: GRE numeric answers can be ints, decimals, or
   fractions like "3/4"; compare as numbers when possible, else as strings */
function normNum(s){
  if(s==null) return null;
  let t=String(s).trim().replace(/,/g,"");
  if(t==="") return null;
  const fr=/^(\-?\d+)\s*\/\s*(\-?\d+)$/.exec(t);
  if(fr){ const n=+fr[1]/+fr[2]; if(!isNaN(n)) return n; }
  const n=Number(t);
  if(!isNaN(n)) return n;
  return t.toLowerCase();
}
function numEq(a,b){
  const x=normNum(a), y=normNum(b);
  if(x===null||y===null) return false;
  if(typeof x==="number" && typeof y==="number") return Math.abs(x-y)<1e-6;
  return x===y;
}
/* rough GRE 130–170 estimate for ONE section, assuming scaled linearly
   from raw correct/total. Real GRE uses adaptive equating — this is a
   ballpark only. */
function estScore(correct,total){
  if(!total) return 130;
  let s=Math.round(130 + (correct/total)*40);
  return Math.max(130, Math.min(170, s));
}
function qCorrect(q, sel){
  if(q.kind==="numeric") return numEq(sel, q.answers[0]);
  if(q.multi){
    const a=[...q.answers].sort().join(), b=[...sel].sort().join();
    return a===b && sel.length===q.answers.length;
  }
  for(let i=0;i<q.blanks;i++){ if((sel[i]||null)!==(q.answers[i]||null)) return false; }
  return true;
}
function countAnswered(){
  return state.test.questions.filter(q=>{
    const s=state.sel[q.id];
    if(q.kind==="numeric") return typeof s==="string" && s.trim().length>0;
    if(q.multi) return Array.isArray(s)&&s.length>0;
    return Array.isArray(s)&&s.some(x=>x);
  }).length;
}

function go(view){ state.view=view; render(); }

/* ============================================================
   RENDER: COVER
   ============================================================ */
function renderCover(){
  const userTests=loadTests();
  const builtIns=builtinList();
  const res=loadRes();
  const app=$("#app");
  // combined Verbal/Quant best-estimate summary
  const testsMap={};
  builtinList().forEach(t=> testsMap[t.id]=t.type||"verbal");
  userTests.forEach(t=> testsMap[t.id]=t.type||"verbal");
  let vBest=null, qBest=null;
  res.forEach(r=>{
    const ty=testsMap[r.testId]||"verbal";
    const e=Math.max(130,Math.min(170,Math.round(130+(r.score.pct/100)*40)));
    if(ty==="quant") qBest=Math.max(qBest==null?-1:qBest,e);
    else vBest=Math.max(vBest==null?-1:vBest,e);
  });
  let combo="";
  if(vBest!=null && qBest!=null){
    combo=`<div class="combo">综合表现 · 语文 ≈ <b>${vBest}</b>/170 ｜ 数学 ≈ <b>${qBest}</b>/170</div>`;
  }

  let html = `<div class="hero page-fade">
      <h1>我的试卷</h1>
      <p>内置了 <b>Verbal（语文）</b> 与 <b>Quant（数学）</b> 真题示例，可直接开始；也支持上传 PDF / Markdown 练习卷。成绩页给出原始分与粗略的 GRE 170 分制预估（语文 / 数学分别估算）。</p>
    </div>${combo}<div class="grid">`;
  // add card
  html += `<div class="card add" id="addCard"><div class="plus">+</div><div class="lab">上传新试卷</div></div>`;

  function cardFor(t, isBuiltIn){
    const tr = res.filter(r=>r.testId===t.id);
    const best = tr.length? Math.max(...tr.map(r=>r.score.pct)) : null;
    const last = tr.length? tr.slice().sort((a,b)=>b.date-a.date)[0] : null;
    const est = best==null? null : Math.max(130,Math.min(170,Math.round(130+(best/100)*40)));
    const pill = best==null? `<span class="score-pill none">未做过</span>`
      : `<span class="score-pill">最佳 ${best}% · 估 ${est}/170</span>`;
    const typeBadge = `<span class="badge ${t.type==="quant"?"type-q":"type-v"}">${t.type==="quant"?"Q 数学":"V 语文"}</span>`;
    const badge = isBuiltIn ? `<span class="badge">内置</span>${typeBadge}` : typeBadge;
    const delBtn = isBuiltIn ? "" : `<button class="del" data-del="${t.id}" title="删除">✕</button>`;
    const sourceLabel = t.source==="pdf"?"PDF":t.source==="md"?"MD":t.source==="demo"?"示例":(t.source||"文本");
    return `<div class="card" data-test="${t.id}">
        ${delBtn}
        <div class="ttitle">${esc(t.title)}${badge}</div>
        ${pill}
        <div class="meta"><span><b>${t.questions.length}</b> 题</span>
          <span>来源 <b>${sourceLabel}</b></span>
          ${last?`<span>上次 <b>${new Date(last.date).toLocaleDateString()}</b></span>`:""}</div>
        <div class="acts">
          <button class="btn primary" data-start="${t.id}">开始作答</button>
          ${tr.length?`<button class="btn" data-review="${t.id}">看成绩</button>`:""}
        </div>
      </div>`;
  }

  // built-in tests first
  builtIns.forEach(t=> html += cardFor(t, true));

  if(userTests.length===0){
    html += `</div>`;
    if(!builtIns.length){
      html += `<div class="empty">还没有试卷。点击上方「+ 上传新试卷」开始。</div>`;
    }
  } else {
    userTests.slice().sort((a,b)=>b.createdAt-a.createdAt).forEach(t=> html += cardFor(t, false));
    html += `</div>`;
  }
  app.innerHTML = html;

  $("#addCard").onclick = openUpload;
  $$("[data-start]").forEach(b=> b.onclick=()=>startTest(b.getAttribute("data-start")));
  $$("[data-review]").forEach(b=> b.onclick=()=>reviewTest(b.getAttribute("data-review")));
  $$("[data-del]").forEach(b=> b.onclick=(e)=>{ e.stopPropagation(); deleteTest(b.getAttribute("data-del")); });
  $$("[data-test]").forEach(c=> c.onclick=(e)=>{ if(e.target.closest(".del")) return;
    const id=c.getAttribute("data-test"); startTest(id); });
}

function deleteTest(id){
  if(isBuiltin(id)){ toast("内置试卷不能删除"); return; }
  if(!confirm("确定删除这份试卷及其成绩记录？")) return;
  let tests=loadTests().filter(t=>t.id!==id);
  saveTests(tests);
  let res=loadRes().filter(r=>r.testId!==id);
  saveRes(res);
  toast("已删除");
  renderCover();
}

/* ============================================================
   START / REVIEW
   ============================================================ */
function getTestById(id){
  if(BUILTIN[id]) return BUILTIN[id];
  return loadTests().find(t=>t.id===id);
}
function startTest(id){
  const t=getTestById(id);
  if(!t){ toast("试卷不存在"); return; }
  state.test=t; state.sel={}; state.idx=0; state.review=null; state.start=Date.now();
  startTimer();
  go("player");
}
function reviewTest(id){
  const res=loadRes().filter(r=>r.testId===id).sort((a,b)=>b.date-a.date);
  if(!res.length){ toast("还没有成绩"); return; }
  state.test=getTestById(id);
  state.review=res[0];
  state.sel={}; // not used in review
  state.reviewIdx=0;
  stopTimer();
  go("results");
}

/* ============================================================
   TIMER
   ============================================================ */
function startTimer(){
  stopTimer();
  state.timer=setInterval(()=>{
    const el=$("#timer"); if(!el) return;
    const s=Math.floor((Date.now()-state.start)/1000);
    const mm=String(Math.floor(s/60)).padStart(2,"0"), ss=String(s%60).padStart(2,"0");
    el.textContent=`⏱ ${mm}:${ss}`;
  },1000);
}
function stopTimer(){ if(state.timer){ clearInterval(state.timer); state.timer=null; } }

/* ============================================================
   RENDER: PLAYER
   ============================================================ */
function renderPlayer(){
  const t=state.test, q=t.questions[state.idx];
  const total=t.questions.length;
  const app=$("#app");
  const answered=countAnswered();
  let html = `<div>
    <div class="player-head">
      <button class="btn ghost sm" id="backBtn">← 试卷</button>
      <span class="ttl">${esc(t.title)}</span>
      <span class="qcount">第 ${state.idx+1} / ${total} 题</span>
      <span class="timer" id="timer">⏱ 00:00</span>
    </div>
    <div id="qcard"></div>
    <div class="navwrap"><div class="navgrid" id="navgrid"></div></div>
    <div class="player-foot">
      <button class="btn" id="prevBtn">← 上一题</button>
      ${state.idx===total-1
        ? `<button class="btn primary" id="submitBtn">提交试卷（${answered}/${total} 已答）</button>`
        : `<button class="btn primary" id="nextBtn">下一题 →</button>`}
    </div></div>`;
  app.innerHTML=html;
  renderQCard(q);
  renderNav();

  $("#backBtn").onclick=()=>{ stopTimer(); go("cover"); };
  $("#prevBtn").onclick=()=>{ if(state.idx>0){ state.idx--; renderPlayer(); } };
  if($("#nextBtn")) $("#nextBtn").onclick=()=>{ if(state.idx<total-1){ state.idx++; renderPlayer(); } };
  if($("#submitBtn")) $("#submitBtn").onclick=submitTest;
  // timer immediate
  const s=Math.floor((Date.now()-state.start)/1000);
  $("#timer").textContent=`⏱ ${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
}

function tokenize(text){
  const tokens=[]; const re=/(?:\(i\)\s*_+)|(?:\(ii\)\s*_+)|(?:\(iii\)\s*_+)|(_+)/g;
  let last=0,m;
  while((m=re.exec(text))){
    if(m.index>last) tokens.push({t:"text",v:text.slice(last,m.index)});
    if(m[0].startsWith("(i)")) tokens.push({t:"blank",bi:0});
    else if(m[0].startsWith("(ii)")) tokens.push({t:"blank",bi:1});
    else if(m[0].startsWith("(iii)")) tokens.push({t:"blank",bi:2});
    else tokens.push({t:"blank",bi:"auto"});
    last=re.lastIndex;
  }
  if(last<text.length) tokens.push({t:"text",v:text.slice(last)});
  let ai=0; tokens.forEach(tk=>{ if(tk.t==="blank"&&tk.bi==="auto") tk.bi=ai++; });
  return tokens;
}
function fillBlanks(tokens, selForBlank){
  // selForBlank: map bi->letter (for multi, bi 0 -> first letter)
  return tokens.map(tk=>{
    if(tk.t==="text") return esc(tk.v);
    const L=selForBlank[tk.bi];
    const cls = L? "blank filled":"blank";
    return `<span class="${cls}" data-bi="${tk.bi}">${L?esc(L):"____"}</span>`;
  }).join("");
}

function renderQCard(q, reviewMode){
  const card=$("#qcard"); if(!card) return;
  // build selection map for blanks (choice questions only)
  const selForBlank={};
  if(q.multi){
    const arr=getSel(q.id);
    selForBlank[0]= arr.length? arr.join(" / ") : "";
  } else if(q.kind!=="numeric"){
    const arr=state.sel[q.id]||[];
    for(let i=0;i<q.blanks;i++) selForBlank[i]= arr[i]||"";
  }
  const secHtml = q.section? `<span class="sec">${esc(q.section)}</span>`:"";
  let html=`<div class="qcard">
    <div class="qnum">Q${q.num} ${secHtml}</div>
    <div class="qtext">${fillBlanks(tokenize(q.text), selForBlank)}</div>`;

  if(q.kind==="numeric"){
    const val = reviewMode ? (state.review.answers[q.id]||"") : (state.sel[q.id]||"");
    html+=`<div class="numbox"><label class="nl">你的答案（数字）</label>
      <input class="num-input" id="numInput" type="text" inputmode="decimal" value="${esc(val)}" ${reviewMode?"disabled":""} placeholder="输入数字，如 12 或 1.5"></div>`;
  } else if(q.blanks>1){
    for(let b=0;b<q.blanks;b++){
      const label = q.blankLabels? q.blankLabels[b] : ["(i)","(ii)","(iii)"][b];
      html+=`<div class="optgroup"><div class="glabel">第 ${esc(label)} 空</div>`;
      q.options.filter(o=>o.blankIdx===b).forEach(o=> html+=optHtml(q,o,reviewMode));
      html+=`</div>`;
    }
  } else {
    q.options.forEach(o=> html+=optHtml(q,o,reviewMode));
  }

  if(reviewMode){
    // in review, read the stored answer (not the (empty) live selection)
    const rsel = q.kind==="numeric" ? (state.review.answers[q.id]||"")
                                    : (state.review.answers[q.id] || (q.multi?[]:[]));
    const correct = qCorrect(q, rsel);
    const ansShown = q.kind==="numeric" ? String(q.answers[0]) : q.answers.join(q.multi?" / ":"，");
    html+=`<div class="exp"><div class="verdict ${correct?"ok":"no"}">${correct?"✓ 答对":"✗ 答错"}</div>`;
    html+=`<div class="et">正确答案</div><p>${esc(ansShown)}</p>`;
    if(q.explanation){ html+=`<div class="et" style="margin-top:12px">解析</div><p>${esc(q.explanation)}</p>`; }
    html+=`</div>`;
  }
  html+=`</div>`;
  card.innerHTML=html;

  if(q.kind==="numeric"){
    const ni=$("#numInput", card);
    if(ni && !reviewMode){
      ni.oninput=()=>{
        state.sel[q.id]=ni.value;
        renderNav();
        const sb=$("#submitBtn"); if(sb){ const a=countAnswered(); sb.textContent=`提交试卷（${a}/${state.test.questions.length} 已答）`; }
      };
    }
  } else {
    $$(".opt", card).forEach(el=>{
      el.onclick=()=>{
        if(reviewMode) return;
        const letter=el.getAttribute("data-letter");
        const bi=+el.getAttribute("data-bi");
        setSel(q.id, bi, letter);
        renderQCard(q); renderNav();
        const sb=$("#submitBtn"); if(sb){ const a=countAnswered(); sb.textContent=`提交试卷（${a}/${state.test.questions.length} 已答）`; }
      };
    });
  }
}
function optHtml(q,o,reviewMode){
  let cls="opt";
  if(reviewMode){
    const sel = q.multi? (state.review.answers[q.id]||[]) : (state.review.answers[q.id]||[]);
    const isAns = sel.includes(o.letter);
    const isCorr = q.answers.includes(o.letter);
    if(isCorr) cls+=" correct";
    else if(isAns) cls+=" wrong";
    else if(isCorr||isAns) cls+=""; // noop
  } else {
    const isSel = q.multi ? (getSel(q.id).includes(o.letter))
      : ((state.sel[q.id]||[])[o.blankIdx]===o.letter);
    if(isSel) cls+=" sel";
  }
  return `<button class="${cls}" data-letter="${o.letter}" data-bi="${o.blankIdx}">
      <span class="ltr">${esc(o.letter)}</span><span>${esc(o.text)}</span></button>`;
}
function renderNav(){
  const grid=$("#navgrid"); if(!grid) return;
  const total=state.test.questions.length;
  let html="";
  for(let i=0;i<total;i++){
    const q=state.test.questions[i];
    let cls="navcell";
    if(i===state.idx) cls+=" cur";
    const ans = state.sel[q.id];
    const isAns = q.multi? (Array.isArray(ans)&&ans.length>0) : (Array.isArray(ans)&&ans.some(x=>x));
    if(isAns) cls+=" ans";
    html+=`<button class="${cls}" data-go="${i}">${q.num}</button>`;
  }
  grid.innerHTML=html;
  $$("[data-go]",grid).forEach(b=> b.onclick=()=>{ state.idx=+b.getAttribute("data-go"); renderPlayer(); });
}

/* ============================================================
   SUBMIT + RESULTS
   ============================================================ */
function submitTest(){
  const t=state.test;
  const total=t.questions.length;
  const answers={}; let correct=0;
  t.questions.forEach(q=>{
    let sel;
    if(q.kind==="numeric") sel = state.sel[q.id]||"";
    else if(q.multi) sel = getSel(q.id);
    else sel = state.sel[q.id]||[];
    answers[q.id]= sel;
    if(qCorrect(q, sel)) correct++;
  });
  const pct = total? Math.round(correct/total*100) : 0;
  const rec={ id:uid(), testId:t.id, date:Date.now(), score:{correct,total,pct}, answers };
  const res=loadRes(); res.push(rec); saveRes(res);
  stopTimer();
  state.review=rec;
  go("results");
}

function renderResults(){
  const t=state.test, rec=state.review;
  const {correct,total,pct}=rec.score;
  const wrong=total-correct;
  const est = estScore(correct,total);
  const typeLabel = t.type==="quant" ? "数学 Quant" : "语文 Verbal";
  const R=56, C=2*Math.PI*R;
  const off=C*(1-pct/100);
  const app=$("#app");
  let html=`<div class="page-fade">
    <div class="result-hero">
      <div class="ring">
        <svg width="172" height="172">
          <circle cx="86" cy="86" r="${R}" fill="none" stroke="var(--line)" stroke-width="13"/>
          <circle class="ring-prog" cx="86" cy="86" r="${R}" fill="none" stroke="var(--accent)" stroke-width="13"
            stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
        </svg>
        <div class="num"><b>${pct}%</b><span>${correct}/${total} 正确</span></div>
      </div>
      <h1 style="font-size:24px;letter-spacing:-.02em;margin:0">${esc(t.title)}</h1>
      <div class="muted" style="margin-top:6px">科目 <b>${typeLabel}</b> ｜ 完成于 ${new Date(rec.date).toLocaleString()}</div>
    </div>
    <div class="stat-row">
      <div class="stat ok"><b>${correct}</b><span>答对</span></div>
      <div class="stat no"><b>${wrong}</b><span>答错</span></div>
      <div class="stat"><b>${correct}/${total}</b><span>原始分</span></div>
      <div class="stat"><b>≈ ${est}<span style="font-size:13px;color:var(--ink-faint)">/170</span></b><span>预估 GRE 分数</span></div>
    </div>
    <p class="muted" style="text-align:center;margin:2px 0 18px;font-size:12.5px">预估为粗略换算（130 + 正确率 × 40，按单科估算；真实 GRE 采用自适应等值，仅供参考）。</p>
    <div class="res-list" id="resList"></div>
    <div class="player-foot" style="margin-top:24px">
      <button class="btn" id="backCover">← 返回试卷列表</button>
      <button class="btn primary" id="retry">再做一次</button>
    </div></div>`;
  app.innerHTML=html;
  // animate the score ring filling from empty -> final (occasional view)
  const prog=document.querySelector(".ring-prog");
  if(prog){
    requestAnimationFrame(()=> requestAnimationFrame(()=>{ prog.style.strokeDashoffset = off; }));
  }
  // list
  const list=$("#resList");
  let lh="";
  t.questions.forEach((q,i)=>{
    const sel = rec.answers[q.id];
    const ok = qCorrect(q, sel);
    const shown = q.kind==="numeric" ? (String(sel==null?"":sel).trim()||"—")
                : (q.multi? (sel||[]).join(" / ") : ((sel||[]).filter(Boolean).join("")||"—"));
    const ansShown = q.kind==="numeric" ? String(q.answers[0]) : q.answers.join(q.multi?" / ":"，");
    lh+=`<div class="res-item" data-q="${i}">
        <div class="badge ${ok?"ok":"no"}">${ok?"✓":"✗"}</div>
        <div class="rt">Q${q.num}${q.section?` · ${esc(q.section)}`:""}</div>
        <div class="ry">你的：${esc(shown)} ／ 正确：${esc(ansShown)}</div>
        <div class="arr">→</div>
      </div>`;
  });
  list.innerHTML=lh;
  $$("[data-q]",list).forEach(el=> el.onclick=()=>{
    state.reviewIdx=+el.getAttribute("data-q");
    state.idx=state.reviewIdx;
    go("review");
  });
  $("#backCover").onclick=()=>go("cover");
  $("#retry").onclick=()=>startTest(t.id);
}

/* ============================================================
   REVIEW (read-only player at a specific question)
   ============================================================ */
function renderReview(){
  const t=state.test, idx=state.reviewIdx, q=t.questions[idx];
  const total=t.questions.length;
  const app=$("#app");
  let html=`<div>
    <div class="player-head">
      <button class="btn ghost sm" id="backRes">← 成绩</button>
      <span class="ttl">${esc(t.title)}</span>
      <span class="qcount">逐题解析 ${idx+1} / ${total}</span>
    </div>
    <div id="qcard"></div>
    <div class="navwrap"><div class="navgrid" id="navgrid"></div></div>
    <div class="player-foot">
      <button class="btn" id="prevBtn">← 上一题</button>
      ${idx===total-1?`<button class="btn primary" id="toRes">回到成绩</button>`:`<button class="btn primary" id="nextBtn">下一题 →</button>`}
    </div></div>`;
  app.innerHTML=html;
  renderQCard(q, true);
  // nav with correct/incorrect coloring
  const grid=$("#navgrid");
  let g="";
  t.questions.forEach((qq,i)=>{
    const sel=state.review.answers[qq.id]||[];
    const ok=qCorrect(qq, sel);
    let cls="navcell ans "+(ok?"ok":"no")+(i===idx?" cur":"");
    g+=`<button class="${cls}" data-go="${i}">${qq.num}</button>`;
  });
  grid.innerHTML=g;
  $$("[data-go]",grid).forEach(b=> b.onclick=()=>{ state.reviewIdx=+b.getAttribute("data-go"); state.idx=state.reviewIdx; renderReview(); });
  $("#backRes").onclick=()=>go("results");
  $("#prevBtn").onclick=()=>{ if(state.reviewIdx>0){ state.reviewIdx--; state.idx=state.reviewIdx; renderReview(); } };
  if($("#nextBtn")) $("#nextBtn").onclick=()=>{ if(state.reviewIdx<total-1){ state.reviewIdx++; state.idx=state.reviewIdx; renderReview(); } };
  if($("#toRes")) $("#toRes").onclick=()=>go("results");
}

/* ============================================================
   ROUTER
   ============================================================ */
function render(){
  const app=$("#app");
  if(state.view==="cover") renderCover();
  else if(state.view==="player") renderPlayer();
  else if(state.view==="results") renderResults();
  else if(state.view==="review") renderReview();
  window.scrollTo({top:0,behavior:"instant"in window?"instant":"auto"});
}

/* ============================================================
   UPLOAD MODAL
   ============================================================ */
function openUpload(){
  $("#uploadOverlay").style.display="flex";
  $("#upTitle").value=""; $("#mdText").value=""; $("#fileInput").value="";
}
function closeUpload(){ $("#uploadOverlay").style.display="none"; }

async function handleFile(file){
  const status=$("#parseStatus"), msg=$("#parseMsg");
  status.style.display="flex"; msg.textContent="读取文件中…";
  let text="", source="md";
  try{
    if(file.type==="application/pdf" || /\.pdf$/i.test(file.name)){
      source="pdf";
      msg.textContent="从 PDF 提取文字（需联网加载 pdf.js）…";
      text = await extractPdfText(file);
    } else {
      text = await file.text();
    }
  }catch(e){
    status.style.display="none";
    toast("读取失败："+e.message);
    return;
  }
  if(!text || text.trim().length<20){
    status.style.display="none";
    toast("未提取到文字（可能是扫描版/图片 PDF）。请改用 Markdown 文本，或把内容复制粘贴到文本框。");
    return;
  }
  finalizeUpload(text, source, file.name);
}

async function extractPdfText(file){
  if(typeof pdfjsLib==="undefined") throw new Error("pdf.js 未能加载（请检查网络）");
  pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const buf=await file.arrayBuffer();
  const pdf=await pdfjsLib.getDocument({data:buf}).promise;
  let out=[];
  for(let p=1;p<=pdf.numPages;p++){
    const page=await pdf.getPage(p);
    const c=await page.getTextContent();
    out.push(c.items.map(it=>it.str).join(" "));
  }
  return out.join("\n");
}

function finalizeUpload(text, source, fileName){
  const status=$("#parseStatus"), msg=$("#parseMsg");
  msg.textContent="解析题目中…";
  const title=$("#upTitle").value.trim() || (fileName||"未命名试卷").replace(/\.[^.]+$/,"");
  const parsed=parseDocument(text, title, source);
  if(parsed.questions.length===0){
    status.style.display="none";
    toast("没识别到题目。请确认使用推荐格式，或改用 Markdown 文本粘贴。");
    return;
  }
  const rec={ id:uid(), title:parsed.title, createdAt:Date.now(), source:parsed.source, type:($("#upType").value||"verbal"), questions:parsed.questions };
  const tests=loadTests(); tests.push(rec); saveTests(tests);
  status.style.display="none";
  closeUpload();
  toast(`已保存「${parsed.title}」· ${parsed.questions.length} 题`);
  renderCover();
}

/* ---------- events ---------- */
$("#newBtn").onclick=openUpload;
$("#helpBtn").onclick=showHelp;
$("#upCancel").onclick=closeUpload;
$("#drop").onclick=()=> $("#fileInput").click();
$("#fileInput").onchange=(e)=>{ if(e.target.files[0]) handleFile(e.target.files[0]); };
const dropEl=$("#drop");
dropEl.ondragover=(e)=>{ e.preventDefault(); dropEl.classList.add("drag"); };
dropEl.ondragleave=()=> dropEl.classList.remove("drag");
dropEl.ondrop=(e)=>{ e.preventDefault(); dropEl.classList.remove("drag"); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); };
$("#upConfirm").onclick=()=>{
  const txt=$("#mdText").value.trim();
  if(!txt){ toast("请选择文件或粘贴文本"); return; }
  finalizeUpload(txt, "md", $("#upTitle").value.trim()||"粘贴试卷");
};
$("#uploadOverlay").onclick=(e)=>{ if(e.target.id==="uploadOverlay") closeUpload(); };

function showHelp(){
  const ov=document.createElement("div"); ov.className="overlay"; ov.style.display="flex";
  ov.innerHTML=`<div class="modal"><h3>试卷格式说明</h3>
    <p class="sub">一行一题，选项用字母 A–I，答案写在 <code>&gt; answer:</code>。平台会自动识别单空 / 双空 / 三空 / 六选二。</p>
    <div class="format-help"><b>示例</b>
<pre>1. 题干里留空用 ____ 表示，双空可写 (i)____ (ii)____。
   A. 选项一
   B. 选项二
   C. 选项三
   > answer: B
   > explanation: 这里写解析（可选）

2. Although safe, the drug remains (i)____ and (ii)____ unsettling.
   A. sound   D. retroactively
   B. risky   E. innocuously
   C. odd     F. intrinsically
   > answer: A, F</pre>
    <span class="muted">· 双/三空：选项按 A–C、D–F、G–I 自动对应各空。<br>
    · 六选二（SE）：单空 + 答案写两个字母，例如 <code>&gt; answer: B, D</code>。<br>
    · 数学「数值输入题」无需选项，直接写答案：<code>&gt; answer: 40</code>（支持小数或分数 3/4）。<br>
    · 上传时可在弹窗选择科目（语文 / 数学），成绩页会按科目给出 170 分制预估。<br>
    · PDF 为扫描/图片版时无法提取文字，请导出为上面的 Markdown 格式再上传。</span>
    </div>
    <div class="foot"><button class="btn primary" id="helpClose">明白了</button></div></div>`;
  document.body.appendChild(ov);
  ov.onclick=(e)=>{ if(e.target===ov) ov.remove(); };
  $("#helpClose",ov).onclick=()=>ov.remove();
}

/* ---------- boot ---------- */
render();

})();
