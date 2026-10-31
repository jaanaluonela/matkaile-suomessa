/* Common navigation and diary action; uses the existing ms_trips_v2 format. */
(()=>{'use strict';
function init(){
 const toggle=document.querySelector('.ms375-menu'),menu=document.getElementById('ms375-menu-links');
 toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));menu.hidden=!open});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}});
 document.querySelectorAll('.ms375-coat img').forEach(img=>{const fallback=()=>{img.hidden=true;img.nextElementSibling.hidden=false};img.addEventListener('error',fallback);if(img.complete&&!img.naturalWidth)fallback()});
 document.querySelectorAll('.ms375-quick a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const el=document.getElementById(a.hash.slice(1));if(el?.tagName==='DETAILS')el.open=true;el?.closest('details')?.setAttribute('open','')}));
 const visit=document.querySelector('.ms375-visit');if(!visit)return;
 const {town,slug}=document.body.dataset;const id='kohde-'+slug;
 function read(){const a=JSON.parse(localStorage.getItem('ms_trips_v2')||'[]');if(!Array.isArray(a))throw Error('Invalid trips');return a}
 function paint(){try{const saved=read().some(t=>t&&(t.id===id||t.locationId===slug)&&t.visited)||localStorage.getItem('ms_visited_'+slug)==='1';visit.textContent=saved?'✓ Käyty · Näytä matkamuisto':'○ Olen käynyt täällä';visit.setAttribute('aria-pressed',String(saved))}catch{}}
 paint();window.addEventListener('pageshow',paint);window.addEventListener('storage',paint);
 visit.addEventListener('click',()=>{try{const trips=read();let trip=trips.find(t=>t&&(t.id===id||t.locationId===slug));if(!trip){trip={id,locationId:slug,name:town,begin:'',end:'',diary:'',stops:[],rating:0,visited:true,sourceUrl:location.pathname.split('/').pop()};trips.unshift(trip)}else trip.visited=true;localStorage.setItem('ms_trips_v2',JSON.stringify(trips));localStorage.setItem('ms_visited_'+slug,'1');location.href='paivakirja.html?matkamuisto='+encodeURIComponent(trip.id)}catch{document.querySelector('.ms375-status').textContent='Tallennus ei onnistunut. Tarkista selaimen tallennustila.'}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Yhtenäinen mobiilialavalikko myös vanhoille paikkakuntasivuille. */
(()=>{const p=location.pathname.split('/').pop()||'index.html';if(p==='index.html')return;const init=()=>{if(!document.querySelector('.ms375-bottom,.footnav'))return;if(!document.querySelector('link[href*="yhteinen-alavalikko-v1.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='yhteinen-alavalikko-v1.css?v=3';document.head.appendChild(l)}if(!document.querySelector('script[src*="yhteinen-alavalikko-v1.js"]')){const s=document.createElement('script');s.src='yhteinen-alavalikko-v1.js?v=3';document.head.appendChild(s)}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();

/* Render municipality quick-card icons inline, including browsers where external SVG <use> fails. */
(()=>{
 const shapes={
 sight:'<path d="M11 11H6a4 4 0 1 1 5-5v20a4 4 0 1 1-5-5h20a4 4 0 1 1-5 5V6a4 4 0 1 1 5 5Z"/>',
 map:'<path d="M11 11H6a4 4 0 1 1 5-5v20a4 4 0 1 1-5-5h20a4 4 0 1 1-5 5V6a4 4 0 1 1 5 5Z"/>',
 camper:'<path d="M4 24H2V8a3 3 0 0 1 3-3h23a4 4 0 0 1 4 4v3l5 5v7h-3M12 24h13M28 12h4M7 10h8v7H7zm14-1h6v7h-6z"/><circle cx="8" cy="25" r="4"/><circle cx="29" cy="25" r="4"/>',
 tree:'<path d="m16 2-9 11h5L5 21h8v8h6v-8h8l-7-8h5Z"/>'
 };
 const run=()=>document.querySelectorAll('.ms375-quick svg use,.ms-town-quick svg use').forEach(use=>{
  const href=use.getAttribute('href')||use.getAttribute('xlink:href')||'';
  const id=href.split('#').pop();if(!Object.prototype.hasOwnProperty.call(shapes,id))return;
  const svg=use.closest('svg');if(!svg)return;
  svg.setAttribute('viewBox',id==='camper'?'0 0 40 32':'0 0 32 32');
  svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');
  svg.innerHTML=shapes[id];
 });
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
})();
