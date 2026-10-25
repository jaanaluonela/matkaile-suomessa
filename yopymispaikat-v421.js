/* v421: siivoaa vain Yöpymispaikat-sivun korttien toistuvat tyyppimerkinnät ja englanninkieliset palvelusanat. */
(()=>{'use strict';
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
ready(()=>{
 if(document.body.dataset.stayCombined!=='true')return;
 const root=document.getElementById('municipality-results');if(!root)return;
 const translations=[[/\bwifi\b/gi,'WiFi'],[/\bgym\b/gi,'kuntosali'],[/\bbreakfast\b/gi,'aamiainen'],[/\btents\b/gi,'telttapaikat'],[/\bcaravan\b/gi,'vaunupaikat'],[/\bpets\b/gi,'lemmikit sallittu']];
 function clean(card){
  const type=card.querySelector('.ms347-type');
  if(type){
   const wanted=card.dataset.stayType==='park'?'matkaparkki':'leirintäalue';
   for(const el of card.querySelectorAll('span,small,div,p')){
    if(el===type||el.contains(type)||el.querySelector('h2,a,button,.ms347-facts,.buttons'))continue;
    const t=(el.textContent||'').trim().toLocaleLowerCase('fi');
    if((t===wanted||t==='🏕️ leirintäalue'||t==='🅿️ matkaparkki'||t==='p matkaparkki')&&el.children.length===0)el.classList.add('ms421-duplicate');
   }
  }
  for(const el of card.querySelectorAll('.ms347-facts,.services,.stay-services')){
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let node;
   while(node=walker.nextNode()){
    let val=node.nodeValue;for(const [rx,to] of translations)val=val.replace(rx,to);
    if(val!==node.nodeValue)node.nodeValue=val;
   }
  }
 }
 let queued=false;function run(){queued=false;root.querySelectorAll('.stay').forEach(clean)}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(run)}}
 const observer=new MutationObserver(schedule);observer.observe(root,{childList:true,subtree:true});schedule();
});})();
