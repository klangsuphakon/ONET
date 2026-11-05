/* SMART O-NET ม.3 2568 — ไฟล์กลางที่หน้านักเรียน (index.html) และหน้าครู (teacher.html) ใช้ร่วมกัน
   ทั้งสองหน้าอ่าน/เขียนข้อมูลชุดเดียวกันในเบราว์เซอร์ของเครื่องนั้น */

/* ===== โครงสร้างข้อสอบตามต้นฉบับ สทศ. 2568 =====
   t: c = เลือก 1 คำตอบ, m = มีข้อย่อย, p2 = เลือก 2 คำตอบจาก 5, num = เติมตัวเลข
   page = หน้าภาพที่ข้อนั้นอยู่ (หน้า 1 คือปก) */
const YN=['ใช่','ไม่ใช่'];
function subject(name,dir,pages,full,count,defPts,pageOf,special){
  const qs=[];for(let i=1;i<=count;i++)qs.push(Object.assign({t:'c',n:4,pts:defPts,page:pageOf[i-1]},special[i]||{}));
  return{name,dir,pages,full,count,qs};
}
const data=[
  subject('คณิตศาสตร์','math',16,100,20,4.75,
    [2,2,3,4,5,6,7,7,8,9,10,11,12,13,14,14,15,15,15,16],
    {6:{t:'m',subs:['6.1','6.2','6.3','6.4'],opts:YN},17:{t:'num',pts:6},18:{t:'num',pts:6},19:{t:'num',pts:6},20:{t:'num',pts:6}}),
  subject('ภาษาอังกฤษ','english',16,100,32,3.125,
    [2,2,2,3,3,3,4,4,4,5,6,7,8,8,8,11,11,11,11,12,13,13,13,14,14,14,14,16,16,16,16,16],
    {10:{t:'m',subs:['(1)','(2)','(3)','(4)','(5)','(6)'],opts:['A','B','C','D','E','F'],hint:'เรียงประโยค A–F ให้ตรงกับภาพลำดับที่ (1) ถึง (6)'},
     24:{hint:'ตัวเลือกของข้อ 24–27 อยู่หน้าถัดไป'},25:{hint:'ตัวเลือกของข้อ 24–27 อยู่หน้าถัดไป'},26:{hint:'ตัวเลือกของข้อ 24–27 อยู่หน้าถัดไป'},27:{hint:'ตัวเลือกของข้อ 24–27 อยู่หน้าถัดไป'}}),
  subject('ภาษาไทย','thai',18,70,29,2.36,
    [2,2,3,3,4,5,5,6,7,8,8,9,10,10,10,11,11,12,12,13,13,14,15,15,16,17,17,18,18],
    {22:{t:'m',subs:['ก.','ข.'],opts:['1','2','3','4'],hint:'เลือกคำตอบจากหมวด ก. 1 คำตอบ และหมวด ข. 1 คำตอบ ที่สัมพันธ์กัน'},
     26:{t:'p2',n:5,pts:2.75},27:{t:'p2',n:5,pts:2.75},28:{t:'p2',n:5,pts:2.75},29:{t:'p2',n:5,pts:2.75}}),
  subject('วิทยาศาสตร์','science',27,100,35,2.75,
    [2,3,4,5,5,6,6,7,8,9,9,10,11,11,12,13,14,15,16,16,17,18,19,20,20,21,21,22,22,23,24,24,25,26,27],
    {1:{t:'m',subs:['1.1','1.2','1.3'],opts:['1','2','3','4','5','6'],hint:'แบบเรียงลำดับ 6 ตัวเลือก เลือก 1 คำตอบในแต่ละข้อย่อย'},
     33:{t:'m',subs:['33.1','33.2','33.3'],opts:YN,pts:4},34:{t:'m',subs:['34.1','34.2','34.3'],opts:YN,pts:4},35:{t:'m',subs:['35.1','35.2','35.3'],opts:YN,pts:4}})
];
data.forEach(d=>d.qs.forEach(q=>{if(q.t==='m'&&q.opts===YN&&!q.hint)q.hint='ตอบทุกข้อย่อยว่า "ใช่" หรือ "ไม่ใช่"';
  if(q.t==='p2')q.hint='เลือก 2 คำตอบที่ถูกต้อง (ถูก 1 คำตอบ ได้ครึ่งคะแนน)';
  if(q.t==='num')q.hint='เติมคำตอบเป็นตัวเลข (ทศนิยมได้)'}));
const pageFile=(d,i)=>d.dir+'/'+String(i+1).padStart(2,'0')+'.jpg';

/* ===== ที่เก็บข้อมูลร่วม ===== */
const LS={draft:'sonet68_draft_v2',subs:'sonet68_subs',key:'sonet68_key',set:'sonet68_settings'};
const el=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast('บันทึกข้อมูลในเครื่องไม่สำเร็จ');return false}}
function toast(t){const x=el('toast');if(!x)return;x.textContent=t;x.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>x.style.display='none',2600)}
function storageOK(){try{localStorage.setItem('sonet68_test','1');localStorage.removeItem('sonet68_test');return true}catch(e){return false}}

let subs=load(LS.subs,[]);
let keyData=load(LS.key,{});
function loadSettings(){const st=Object.assign({showScore:false},load(LS.set,{}));
  if(st.pin){st.pinHash=hashPin(st.pin);delete st.pin;store(LS.set,st)}  /* ย้ายรหัสแบบเดิมเป็นแบบเข้ารหัส */
  return st}
let settings;
const studentKey=o=>[String(o.name||'').trim(),String(o.no||'').trim(),String(o.room||'').trim()].join('|');

/* รหัสครูเก็บเป็นค่าแฮช ไม่เก็บตัวรหัสจริง */
function hashPin(pin){let h1=0x811c9dc5,h2=0x9e3779b9;const s='sonet68:'+pin;
  for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,16777619);h2=Math.imul(h2^c,2246822507)}
  return(h1>>>0).toString(16)+(h2>>>0).toString(16)}
settings=loadSettings();

/* ===== รูปแบบคำตอบ ===== */
const typeName=q=>q.t==='c'?q.n+' ตัวเลือก':q.t==='m'?(q.opts===YN?'ใช่ / ไม่ใช่ '+q.subs.length+' ข้อย่อย':q.subs.length+' ข้อย่อย'):q.t==='p2'?'เลือก 2 จาก 5':'เติมตัวเลข';
const mGet=(a,k)=>{const c=String(a||'')[k];return c&&c!=='-'?c:''};
function mSet(a,k,v,len){const arr=Array.from({length:len},(_,i)=>mGet(a,i)||'-');arr[k]=v||'-';const r=arr.join('');return /^-+$/.test(r)?'':r}
function state(qq,a){a=String(a||'').trim();if(!a)return'';
  if(qq.t==='m')return a.includes('-')||a.length<qq.subs.length?'part':'done';
  if(qq.t==='p2')return a.length>=2?'done':'part';return'done'}
function showAns(qq,a){a=String(a||'');if(!a)return'';
  if(qq.t==='m'&&qq.opts!==YN&&isNaN(qq.opts[0]))return[...a].map(c=>c==='-'?'-':qq.opts[+c-1]||c).join('');
  if(qq.t==='p2')return a.split('').join(',');return a}

/* ===== การตรวจคำตอบ ===== */
const norm=x=>String(x??'').trim().replace(/\s+/g,'').toLowerCase();
function normM(qq,x){return[...String(x??'').toUpperCase().replace(/[\s,]/g,'')].map(c=>{if(/[1-9-]/.test(c))return c;const i=qq.opts.indexOf(c);return i>=0?String(i+1):c}).join('')}
/* คืนค่าสัดส่วนคะแนนที่ได้ 0, 0.5 หรือ 1 */
function scoreQ(qq,a,key){
  const alts=String(key).split('|').map(k=>k.trim()).filter(Boolean);let best=0;
  for(const k of alts){let r=0;
    if(qq.t==='m')r=normM(qq,a)!==''&&normM(qq,a)===normM(qq,k)?1:0;
    else if(qq.t==='p2'){const A=new Set(String(a||'').replace(/\D/g,'')),K=new Set(k.replace(/\D/g,''));
      if(A.size&&A.size<=2){let hit=0;A.forEach(x=>{if(K.has(x))hit++});r=hit/2}}
    else{const na=norm(a),nk=norm(k);if(na)r=na===nk||(!isNaN(Number(na))&&!isNaN(Number(nk))&&Math.abs(Number(na)-Number(nk))<1e-9)?1:0}
    best=Math.max(best,r)}
  return best;
}
function grade(si,ans){
  const d=data[si],k=keyData[d.name];let pts=0,full=0,c=0,g=0;const res=[];
  d.qs.forEach((qq,i)=>{const key=String(k?.ans?.[i]??'').trim();if(!key){res.push(null);return}
    g++;full+=qq.pts;const r=scoreQ(qq,ans[i],key);pts+=r*qq.pts;if(r===1)c++;res.push(r===1?'y':r>0?'h':'n')});
  return{pts:Math.round(pts*1000)/1000,full,c,g,res,pct:g?pts/full*100:null};
}
const fmt=n=>n==null?'–':(Math.round(n*100)/100).toString();

/* ===== CSV / ไฟล์ ===== */
const safe=x=>String(x).trim().replace(/[\\/:*?"<>|\s]+/g,'_')||'x';
const toCSV=rows=>'﻿'+rows.map(r=>r.map(x=>'"'+String(x??'').replaceAll('"','""')+'"').join(',')).join('\r\n');
function download(name,text,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500)}
function answerRows(list){const rows=[['ชื่อ','เลขที่','ห้อง','วิชา','ข้อ','คำตอบ','เวลาส่ง']];
  list.forEach(x=>x.answers.forEach((a,j)=>rows.push([x.name,x.no,x.room,x.subject,j+1,a,x.time])));return rows}
function parseCSV(t){t=t.replace(/^﻿/,'');const rows=[];let row=[],f='',inq=false;
  for(let i=0;i<t.length;i++){const c=t[i];
    if(inq){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else inq=false}else f+=c}
    else if(c==='"')inq=true;else if(c===','){row.push(f);f=''}
    else if(c==='\n'){row.push(f);rows.push(row);row=[];f=''}else if(c!=='\r')f+=c}
  if(f!==''||row.length){row.push(f);rows.push(row)}return rows}
const readFile=f=>new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsText(f,'utf-8')});
function mergeSub(g){const i=subs.findIndex(x=>x.subject===g.subject&&studentKey(x)===studentKey(g));
  if(i<0){subs.push(g);return 1}if(!subs[i].time||!g.time||g.time>=subs[i].time){subs[i]=g;return 1}return 0}
