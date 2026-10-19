/* Matkaile Suomessa v359 — yhteinen leirintäalueiden ja matkaparkkien haku.
 * Täydentää v346:n dataa, ei korvaa tai poista yhtäkään kohdetta.
 */
(() => {
 'use strict';
 const ready = fn => document.readyState === 'loading'
   ? document.addEventListener('DOMContentLoaded', fn, {once:true}) : fn();
 const norm = s => String(s ?? '').toLocaleLowerCase('fi').normalize('NFD')
   .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
 const SERVICE_LABELS = {
   electric:'Sähkö',shower:'Suihku',sauna:'Sauna',wc:'WC',greywater:'Harmaavesi',
   cottages:'Mökit',cafe:'Kahvila',playground:'Leikkipaikka',beach:'Uimaranta',
   kitchen:'Keittiö',laundry:'Pyykinpesu',water:'Vesipiste',chemical:'Kemiallisen WC:n tyhjennys'
 };
 const SERVICE_ALIASES = {
   electric:['sähkö','sähköpaikka','sähköpiste'], shower:['suihku'],sauna:['sauna'],
   wc:['wc','vessa'],greywater:['harmaavesi','harmaaveden tyhjennys'],
   cottages:['mökki','mökit'],cafe:['kahvila'],playground:['leikkipaikka'],
   beach:['uimaranta'],kitchen:['keittiö'],laundry:['pyykinpesu'],
   water:['vesipiste','vesi'],chemical:['kemiallinen wc']
 };
 const aliasList = Object.entries(SERVICE_ALIASES).flatMap(([key,forms]) =>
   forms.map(text => [norm(text),key])).sort((a,b)=>b[0].length-a[0].length);
 function parseQuery(value){
   let remaining=' '+norm(value)+' '; const required=new Set();
   for(const [phrase,key] of aliasList){
     const match=' '+phrase+' ';
     if(remaining.includes(match)){
       required.add(key);remaining=remaining.replaceAll(match,' ');
     }
   }
   return {words:norm(remaining).split(/\s+/).filter(Boolean),services:required};
 }
 function servicesFor(place){
   const found = new Set(place?.verifiedServices || []);
   const stored = place?.services || {};
   const synonyms = {cabins:'cottages',food:'cafe'};
   for(const [key,value] of Object.entries(stored)){
     if(value === true) found.add(synonyms[key]||key);
   }
   return found;
 }
 function isYearRound(place){
   if(place?.verifiedOpeningStatus==='yearround')return true;
   const info=window.ms347CampingFacts?.opening?.(place);
   if(info?.status==='yearround')return true;
   const direct=String(place?.openingStatus||'').toLowerCase();
   return direct==='yearround'||direct==='year-round';
 }
 function isSfc(place){
   return place?.type==='camping' && Boolean(window.ms347CampingFacts?.isSfcArea?.(place));
 }
 ready(() => {
   if(document.body.dataset.stayCombined !== 'true') return;
   const container=document.getElementById('municipality-results');
   const search=document.getElementById('v243-stay-search');
   const status=document.getElementById('list-status');
   const region=document.getElementById('region');
   const city=document.getElementById('municipality');
   const kindButtons=[...document.querySelectorAll('[data-ms347-kind]')];
   const serviceBoxes=[...document.querySelectorAll('.ms275-service-choice')];
   const sfc=document.getElementById('camp-only-sfc');
   const year=document.getElementById('camp-only-year-round');
   const parkServices=new Set(['electric','wc','greywater']);
   if(!container||!search||!kindButtons.length)return;
   const urlKind=new URLSearchParams(location.search).get('tyyppi');
   let kind=['camping','park'].includes(urlKind)?urlKind:'all';
   const allPlaces=()=>window.caravanPlaces||[];
   function pagePlaces(){
     const towns=window.municipalityRegions||{};
     return allPlaces().filter(p=>
       (!city?.value||p.city===city.value) &&
       (city?.value||!region?.value||towns[p.city]===region.value));
   }
   function byUrlName(){
     const map=new Map(), urls=new Map();
     for(const p of pagePlaces()){
       const key=(p.url||'')+'|'+(p.name||'');
       map.set(key,p);
       if(p.url&&!urls.has(p.url)) urls.set(p.url,p);
     }
     return {map,urls};
   }
   function findCardPlace(card,index){
     const url=card.querySelector('.buttons a[href]')?.getAttribute('href')||'';
     const title=card.querySelector('h2')?.textContent||'';
     return index.map.get(url+'|'+title) || index.urls.get(url) || null;
   }
   function typeName(place){return place?.type==='park'?'🅿️ Matkaparkki':place?.type==='camping'?'🏕️ Leirintäalue':'ℹ️ Yöpyminen vain sovittaessa';}
   function annotate(card,place){
     if(!place)return;
     card.dataset.stayType=place.type||'';
     let type=card.querySelector('.ms347-type');
     if(!type){type=document.createElement('span');type.className='ms347-type';card.prepend(type);}
     type.textContent=typeName(place);
     let info=card.querySelector('.ms347-facts');
     if(!info){info=document.createElement('div');info.className='ms347-facts';const buttons=card.querySelector('.buttons');if(buttons)card.insertBefore(info,buttons);else card.append(info);}
     const snippets=[];
     if(isSfc(place))snippets.push('SFC-alue');
     if(isYearRound(place))snippets.push('✓ Ympäri vuoden');
     const known=servicesFor(place);
     if(known.size) snippets.push('Palvelut: '+[...known].map(k=>SERVICE_LABELS[k]||k).join(' · '));
     else snippets.push('Palvelut tarkistettava kohteesta');
     const text=snippets.join('   |   ');
     if(info.textContent!==text) info.textContent=text;
   }
   function syncServiceChoices(){
     const parkOnly=kind==='park';
     for(const box of serviceBoxes){
       const unavailable=parkOnly&&!parkServices.has(box.value);
       const choice=box.closest('label');
       if(choice)choice.hidden=unavailable;
       box.disabled=unavailable;
       if(unavailable)box.checked=false;
     }
   }
   function apply(){
     syncServiceChoices();
     const q=parseQuery(search.value);
     const checked=serviceBoxes.filter(el=>el.checked).map(el=>el.value);
     const required=new Set([...q.services,...checked]);
     const index=byUrlName();
     const cards=[...container.querySelectorAll('.stay')];
     let visible=0;
     for(const card of cards){
       const p=findCardPlace(card,index);
       if(p)annotate(card,p);
       const kindOk=kind==='all'||p?.type===kind;
       const sfcOk=!sfc?.checked||isSfc(p);
       const yearOk=!year?.checked||Boolean(p && isYearRound(p));
       const text=norm([p?.name,p?.city,p?.region,p?.address,p?.description,p?.season,
         p?.type==='park'?'matkaparkki':p?.type==='camping'?'leirintäalue':'sovittava yöpyminen',isSfc(p)?'SFC':''].join(' '));
       const textOk=q.words.every(w=>text.includes(w));
       const services=servicesFor(p);
       const serviceOk=[...required].every(value=>services.has(value));
       const show=Boolean(p&&kindOk&&sfcOk&&yearOk&&textOk&&serviceOk);
       card.hidden=!show;card.style.display=show?'':'none';
       if(show)visible++;
     }
     const category=kind==='park'?'matkaparkkia':kind==='camping'?'leirintäaluetta':'yöpymispaikkaa';
     if(status)status.textContent=(city?.value||region?.value||'Koko Suomi')+' · '+visible+' / '+cards.length+' '+category;
     let empty=document.getElementById('ms347-empty');
     if(!empty){empty=document.createElement('p');empty.id='ms347-empty';empty.className='ms347-empty';container.insertAdjacentElement('afterend',empty);}
     empty.hidden=visible>0||!cards.length;
     empty.textContent='Näillä rajauksilla ei löytynyt yöpymispaikkaa. Kokeile toista hakua tai poista jokin rajaus.';
     for(const button of kindButtons)button.setAttribute('aria-pressed',String(button.dataset.ms347Kind===kind));
   }
   function choose(next){
     kind=next;
     const url=new URL(location.href);
     if(kind==='all')url.searchParams.delete('tyyppi');else url.searchParams.set('tyyppi',kind);
     history.replaceState(null,'',url);
     apply();
   }
   kindButtons.forEach(button=>button.addEventListener('click',()=>choose(button.dataset.ms347Kind)));
   search.addEventListener('input',apply);
   region?.addEventListener('change',()=>queueMicrotask(apply));
   city?.addEventListener('change',()=>queueMicrotask(apply));
   sfc?.addEventListener('change',apply);
   year?.addEventListener('change',apply);
   serviceBoxes.forEach(box=>box.addEventListener('change',apply));
   document.getElementById('ms275-clear-services')?.addEventListener('click',()=>{
     for(const box of serviceBoxes)box.checked=false;
     apply();
   });
   document.getElementById('ms318-camp-reset')?.addEventListener('click',()=>{
     kind='all';search.value='';
     for(const box of serviceBoxes)box.checked=false;
     if(sfc)sfc.checked=false;if(year)year.checked=false;
     const url=new URL(location.href);url.searchParams.delete('tyyppi');
     history.replaceState(null,'',url);
     queueMicrotask(apply);
   });
   new MutationObserver(mutations=>{
     if(mutations.some(m=>[...m.addedNodes,...m.removedNodes].some(node=>
       node.nodeType===1&&(node.classList?.contains('stay')||node.querySelector?.('.stay')))))apply();
   }).observe(container,{childList:true});
   // v346:n kunta- ja hakufiltterit ehtivät ensin muodostaa alkuperäisen listan.
   apply();
 });
})();
