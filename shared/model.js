export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const keyFor=slug=>'wellbeing-lab-'+slug+'-v1';
export const fresh=slug=>({version:1,lab:slug,plan:{},sessions:[],comparisons:[]});
export const fields=['goal','barrier','cue','action','finish','restart','context','timebox'];
export function read(storage,slug){
 try{
  const d=JSON.parse(storage?.getItem(keyFor(slug)));
  if(!d||d.version!==1||d.lab!==slug||!Array.isArray(d.sessions)||!Array.isArray(d.comparisons))return null;
  const s=fresh(slug);for(const k of fields)if(typeof d.plan?.[k]==='string')s.plan[k]=d.plan[k].slice(0,2000);
  s.sessions=d.sessions.filter(x=>x&&typeof x.id==='string').map(x=>Object.fromEntries(['id','created','condition','opportunity','started','finished','useful','note','restart','slot','comparison','task'].map(k=>[k,typeof x[k]==='string'?x[k].slice(0,3000):''])));
  s.comparisons=d.comparisons.filter(x=>x&&typeof x.id==='string'&&Array.isArray(x.slots)&&x.slots.length===12&&new Set(x.slots.map(y=>y.id)).size===12&&x.slots.every(y=>y&&typeof y.id==='string'&&Number.isInteger(y.pair)&&y.pair>=1&&y.pair<=6&&['Question prompt','Plain instruction'].includes(y.condition))).map(x=>({id:x.id,created:String(x.created||''),slots:x.slots.map(y=>({id:y.id,pair:y.pair,condition:y.condition}))}));
  return s;
 }catch{return null;}
}
export function makeComparison(){
 const bytes=crypto.getRandomValues(new Uint8Array(6));const slots=[];
 for(let i=0;i<6;i++)for(const condition of(bytes[i]%2?['Question prompt','Plain instruction']:['Plain instruction','Question prompt']))slots.push({id:crypto.randomUUID(),pair:i+1,condition});
 return {id:crypto.randomUUID(),created:new Date().toISOString(),slots};
}
export function add32(a,b){
 const parse=x=>{const t=String(x).trim();if(!/^(0x[0-9a-f]{1,8}|[0-9]{1,10})$/i.test(t))throw Error('Use an unsigned 32-bit integer, in decimal or hexadecimal.');const n=BigInt(t);if(n>0xffffffffn)throw Error('Each input must be between 0 and 0xFFFFFFFF.');return n;};
 const total=parse(a)+parse(b),result=total&0xffffffffn;
 return {result:'0x'+result.toString(16).toUpperCase().padStart(8,'0'),carry:total>0xffffffffn?1:0,zero:result===0n?1:0};
}
export function counts(rows){const feasible=rows.filter(x=>x.opportunity==='Available');return {all:rows.length,unavailable:rows.length-feasible.length,n:feasible.length,onTime:feasible.filter(x=>x.started==='Within five minutes').length,finished:feasible.filter(x=>x.finished==='Yes').length,useful:feasible.filter(x=>x.useful==='Yes').length,answered:feasible.filter(x=>['Yes','No','Unsure'].includes(x.useful)).length};}
