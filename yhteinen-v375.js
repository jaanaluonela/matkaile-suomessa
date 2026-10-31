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


/* Yhteiset kuntien pikavalintakuvakkeet myös vanhoissa sivupohjissa. */
(()=>{const shapes={
'Näe ja koe':['#87512e','<rect x="4" y="4" width="40" height="40" fill="#fff"/><path d="M18 18h-5a5 5 0 1 1 5-5v22a5 5 0 1 1-5-5h22a5 5 0 1 1 5 5V13a5 5 0 1 1-5 5Z" stroke="#87512e" stroke-width="3" fill="none"/>'],
'Yöpyminen':['#1672b8','<path d="M7 36 24 12 41 36H7Z M24 12v24 M15 36l9-13 9 13" stroke="#fff" stroke-width="3" stroke-linejoin="round" fill="none"/>'],
'Retket':['#1469b1','<rect x="4" y="4" width="40" height="40" fill="#fff"/><path d="M14 10 8 23h4L6 33h16l-6-10h4L14 10Z M14 32v7 M23 39V24l10-10 10 10v15Z" fill="#161616"/><path d="M29 39V29h7v10" fill="#fff"/><path d="M20 24 33 11l12 13" stroke="#161616" stroke-width="2.5" fill="none"/>'],
'Pysähdy matkalla':['#1269b2','<text x="24" y="38" font-size="37" font-weight="750" text-anchor="middle" font-family="Arial,sans-serif" fill="#fff">P</text>']};
function apply(){document.querySelectorAll('nav.ms375-quick a,nav.iitti-quick a,nav.ms-town-quick a,nav.k413-grid a,nav.quick a').forEach(a=>{const name=(a.textContent||'').replace(/\\s+/g,' ').replace(/^[^\\p{L}]+/u,'').trim();const spec=shapes[name];if(!spec)return;let svg=a.querySelector('svg');let holder=svg?.parentElement;if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');a.insertBefore(svg,a.firstChild);holder=svg;}svg.setAttribute('viewBox','0 0 48 48');svg.setAttribute('width','48');svg.setAttribute('height','48');svg.innerHTML=spec[1];svg.style.setProperty('background',spec[0],'important');svg.style.setProperty('border-radius','10px','important');svg.style.setProperty('stroke','none','important');svg.style.setProperty('fill','none','important');svg.querySelectorAll('*').forEach(el=>{for(const p of ['stroke','fill'])if(el.hasAttribute(p))el.style.setProperty(p,el.getAttribute(p),'important')});if(holder&&holder!==a&&holder!==svg&&holder.tagName==='SPAN'){holder.style.setProperty('background',spec[0],'important');}a.dataset.msQuickIcon='v2';});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply()})();
