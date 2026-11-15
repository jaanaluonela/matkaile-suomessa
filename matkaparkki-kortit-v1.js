/* Matkaile Suomessa: tiiviit matkaparkkikortit, 2026-11 */
(()=>{'use strict';
const init=()=>{
 const root=document.getElementById('municipality-results');if(!root)return;
 const style=document.createElement('style');style.textContent=`
 @media(max-width:849px){
 #municipality-results .stay[data-stay-type="park"]{padding:14px 15px!important;margin-bottom:14px!important}
 #municipality-results .stay[data-stay-type="park"] h2{margin:9px 0 6px!important;line-height:1.2!important}
 #municipality-results .stay[data-stay-type="park"] .address{margin:4px 0!important}
 #municipality-results .stay[data-stay-type="park"] .description{margin:7px 0!important;line-height:1.38!important}
 #municipality-results .stay[data-stay-type="park"] .buttons{margin-top:9px!important;gap:8px!important}
 #municipality-results .stay[data-stay-type="park"] .buttons a{padding:9px 12px!important}
 #municipality-results .stay[data-stay-type="park"] .ms347-facts{margin:6px 0!important;line-height:1.4!important}
 }`;document.head.append(style);
 const norm=s=>String(s||'').toLocaleLowerCase('fi');
 function update(card){
  if(card.dataset.stayType!=='park')return;
  const description=card.querySelector('.description');
  const electric=card.querySelector('.ms347-park-electric');
  const facts=card.querySelector('.ms347-facts');
  if(description){
   if(!card.dataset.msCompactOriginal)card.dataset.msCompactOriginal=description.textContent.trim();
   const original=card.dataset.msCompactOriginal;
   const sentences=original.match(/[^.!?]+[.!?]?/g)||[original];
   const compact=sentences.map(x=>x.trim()).filter(Boolean).slice(0,2).join(' ').slice(0,260).trim();
   if(description.textContent!==compact)description.textContent=compact;
   if(electric){
    const amp=original.match(/(?:sähkö(?:liitäntä|piste|paikka)?[^.]{0,55}?)\b(\d{1,2})\s*A\b/i)||original.match(/\b(\d{1,2})\s*A\b[^.]{0,65}sähkö/i);
    const kw=original.match(/(?:sähkö(?:liitäntä|piste|paikka)?[^.]{0,55}?)\b(\d+(?:[,.]\d+)?)\s*kW\b/i);
    if(/sähkö(?:liitäntä|piste|paikka|ä\s+saatavilla)/i.test(original)&&!/ei (?:ole |saa |sähköä)/i.test(original)){
      const detail=[amp?amp[1]+' A':'',kw?kw[1]+' kW':''].filter(Boolean).join(' / ');
      const label='⚡ Sähkö: Kyllä'+(detail?' · '+detail:'');
      if(electric.textContent!==label)electric.textContent=label;
    }else if(/sähköstä ei tietoa/i.test(electric.textContent)){
      electric.textContent='Sähkö: Ei tietoa';
    }
   }
  }
  if(facts){
   const t=facts.textContent.replace(/\s*\|\s*/g,' · ').replace(/\s{2,}/g,' ').trim();
   if(facts.textContent!==t)facts.textContent=t;
  }
  for(const a of card.querySelectorAll('.buttons a')){
   const href=a.getAttribute('href');
   if(!href||href==='#'||/^javascript:/i.test(href))a.remove();
  }
 }
 let busy=false;
 const run=()=>{busy=false;root.querySelectorAll('.stay[data-stay-type="park"]').forEach(update)};
 const schedule=()=>{if(!busy){busy=true;requestAnimationFrame(run)}};
 new MutationObserver(schedule).observe(root,{subtree:true,childList:true,characterData:true});
 schedule();
};document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();