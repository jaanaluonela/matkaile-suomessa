/* Matkailu Suomessa v253: täysi kuntavalitsin (308 kuntaa) ja toimivat maakuntalinkit. */
(()=>{'use strict';
const start=()=>{
 const region=document.getElementById('home-region-v251'),town=document.getElementById('home-town-v251'),open=document.getElementById('home-open-v251'),regional=document.getElementById('home-region-page-v251'),links=document.getElementById('home-town-links-v251');
 if(!region||!town||!open||!regional||!links)return;
 const regions=window.msFinlandRegions2026||{};const alias=window.msPlaceAliases253||{};
 const buttons=[...document.querySelectorAll('[data-home-region-v251]')];
 const source=window.siteMunicipalities||{};
 region.replaceChildren(new Option('Valitse maakunta…',''));
 Object.keys(regions).sort((a,b)=>a.localeCompare(b,'fi')).forEach(n=>region.add(new Option(n,n)));
 function fill(){
  const r=region.value;town.replaceChildren(new Option(r?'Valitse paikkakunta…':'Valitse ensin maakunta…',''));links.replaceChildren();
  const available=regions[r]||[];
  available.forEach(n=>{const m=window.msTownUrl253(n);const o=new Option(n+(m.ready?' ✓':''),m.url);town.add(o)});
  town.disabled=!r;town.value='';open.hidden=true;
  regional.href=(window.msRegionGuides254||{})[r]|| (r?'maakunnat.html?maakunta='+encodeURIComponent(r):'maakunnat.html');
  regional.firstChild.textContent=r?'Näytä '+r+' · kaikki kunnat ':'Kaikki maakunnat ';
  if(r){
    const p=document.createElement('p');p.textContent=r+' · '+available.length+' kuntaa. ✓ = matkailuopas avattavissa. Muut kunnat avautuvat perustietokorttina.';links.append(p);
    const shortlist=available.filter(n=>window.msTownUrl253(n).ready).slice(0,6);
    const extras=Object.entries(alias).filter(([n,v])=>v.url&&available.includes(v.town)).slice(0,3);
    if(shortlist.length||extras.length){const row=document.createElement('div');shortlist.forEach(n=>{const a=document.createElement('a');a.href=window.msTownUrl253(n).url;a.textContent=n+' ›';row.append(a)});extras.forEach(([name,v])=>{const a=document.createElement('a');a.href=v.url;a.textContent=name+' ›';row.append(a)});links.append(row)}
  }
  buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.homeRegionV251===r)));
 }
 region.addEventListener('change',fill);
 town.addEventListener('change',()=>{open.hidden=!town.value;if(town.value)open.href=town.value;});
 buttons.forEach(b=>b.addEventListener('click',()=>{region.value=b.dataset.homeRegionV251;fill();}));
 const search=document.getElementById('place-search'),results=document.getElementById('search-results');
 if(search&&results){
   const normalize=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
   let previous=[];try{if(typeof places!=='undefined' && Array.isArray(places))previous=places;}catch(_){}
   const matchesLegacy=previous.concat(window.visitHighlights||[],window.caravanPlaces||[]).filter(e=>e&&typeof e.name==='string'&&typeof e.url==='string'&&/^[^?#]+\.html(?:[?#].*)?$/.test(e.url)).map(e=>({name:e.name,region:e.meta||e.city||'Kohde',url:e.url,ready:true}));
   const entries=Object.entries(regions).flatMap(([r,ns])=>ns.map(n=>({name:n,region:r,...window.msTownUrl253(n)})))
    .concat(Object.entries(alias).filter(([_,v])=>v.url).map(([n,v])=>({name:n,region:v.town,url:v.url,ready:true})))
    .concat(Object.keys(regions).map(n=>({name:n,region:'Maakunta',url:'maakunnat.html?maakunta='+encodeURIComponent(n),ready:true})))
    .concat(matchesLegacy);
   // The legacy search already listens to the input. Capture phase handles its output after other handlers when needed.
   function update(){const q=normalize(search.value.trim());if(!q){results.replaceChildren();results.classList.remove('is-open');return;}const matches=entries.filter(e=>normalize(e.name).includes(q)).sort((a,b)=>Number(normalize(a.name)!==q)-Number(normalize(b.name)!==q)||a.name.localeCompare(b.name,'fi')).slice(0,9);
    results.replaceChildren();if(!matches.length){const p=document.createElement('p');p.textContent='Ei tuloksia. Avaa kaikki kunnat hakemistosta.';results.append(p);results.classList.add('is-open');return;}
    matches.forEach(m=>{const a=document.createElement('a');a.href=m.url;a.textContent=m.name+' · '+m.region+(m.ready?'':' · perustietokortti');results.append(a)});results.classList.add('is-open');}
   search.addEventListener('input',()=>requestAnimationFrame(update));
   search.addEventListener('keydown',e=>{if(e.key==='Enter'&&search.value.trim()){const first=results.querySelector('a[href]');if(first){e.preventDefault();location.href=first.href;}}});
 }
 fill();
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();