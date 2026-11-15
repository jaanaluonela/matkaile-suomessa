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
   water:['vesipiste','vesi'],chemical:['kemiallisen wc:n tyhjennys','kemiallisen wc tyhjennys','kemiallisen wc:n','kemiallinen wc','kemssa']
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
   if(!container||!search||!kindButtons.length)return;
   const urlKind=new URLSearchParams(location.search).get('tyyppi');
   let kind=['camping','park'].includes(urlKind)?urlKind:'all';
   const allPlaces=()=>window.caravanPlaces||[];
   function pagePlaces(){
     const towns=window.municipalityRegions||{};
     return allPlaces().filter(p=>{
       const placeCity=String(p?.city||'').trim();
       const placeRegion=towns[placeCity]||p?.region||'';
       return (!city?.value||norm(placeCity)===norm(city.value)) &&
         (!region?.value||norm(placeRegion)===norm(region.value));
     });
   }
   // Täydennä kuntavalikko myös myöhemmin lisätyistä oppaan kohteista.
   // Käytä vain tunnettua maakuntatietoa, älä arvaa kohteen sijaintia.
   function syncMunicipalities(){
     if(!city||!region)return;
     const chosen=city.value;
     const known=window.municipalityRegions||{};
     const towns=[...new Set(allPlaces().filter(p=>{
       const placeRegion=known[p.city]||p.region||'';
       return p.city&&(!region.value||norm(placeRegion)===norm(region.value));
     }).map(p=>p.city))].sort((a,b)=>a.localeCompare(b,'fi'));
     const existing=new Set([...city.options].map(o=>norm(o.value)));
     for(const name of towns){
       if(existing.has(norm(name)))continue;
       const option=document.createElement('option');
       option.value=name;option.textContent=name;
       city.append(option);
       existing.add(norm(name));
     }
     if(chosen&&[...city.options].some(o=>o.value===chosen))city.value=chosen;
   }
   region?.addEventListener('change',()=>queueMicrotask(syncMunicipalities));
   queueMicrotask(syncMunicipalities);
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
     const url=card.dataset.originalStayUrl??card.querySelector('.buttons a[href]')?.getAttribute('href')??'';
     const title=card.querySelector('h2')?.textContent||'';
     return index.map.get(url+'|'+title) || index.urls.get(url) || null;
   }
   function typeName(place){return place?.type==='park'?'Matkaparkki':place?.type==='camping'?'Leirintäalue':'ℹ️ Yöpyminen vain sovittaessa';}
   function annotate(card,place){
     if(!place)return;
     card.dataset.stayType=place.type||'';
     let type=card.querySelector('.ms347-type');
     if(!type){type=document.createElement('span');type.className='ms347-type';card.prepend(type);}
     type.textContent=typeName(place);
     type.classList.toggle('ms420-park',place.type==='park');
     type.classList.toggle('ms420-camp',place.type==='camping');
     const detail=card.querySelector('.buttons a.btn:not(.secondary)');
     if(card.dataset.originalStayUrl===undefined){
       card.dataset.originalStayUrl=detail?.getAttribute('href')||'';
     }
     if(detail&&place.detailId)detail.href='matkaparkki-kohde.html?id='+encodeURIComponent(place.detailId);
     if(detail&&(!detail.getAttribute('href')||place.type==='park'||place.website))detail.remove();

     const badge=card.querySelector('.badge,.camp-opening-badge');
     if(badge&&/^(?:🅿️\s*|🏕️\s*)?(?:(?:matkaparkki|leirintäalue)(?:\s*·\s*tarkista aukiolo)?|matkailuajoneuvopaikka|tarkista aukiolo)$/i.test(badge.textContent.trim()))badge.remove();

     const description=card.querySelector('.description');
     const generic=/^(?:Leirintäopas 2026–2027|Leirintäoppaan 2026–2027 kohde\..*|Palvelut tarkistettava kohteesta\.?|Matkailuajoneuvon yöpymiskohde\. Tarkista ajankohtainen aukiolo, varaus ja palvelut suoraan kohteelta ennen matkaa\.|Matkailuajoneuvoille tarkoitettu majoituskohde\. Aukiolo ja palvelujen saatavuus tarkistettava ennen saapumista\.)$/i;
     if(description&&(!description.textContent.trim()||generic.test(description.textContent.trim())))description.remove();

     const address=card.querySelector('.address');
     const street=String(place.address||'').trim();
     const cityName=String(place.city||'').trim();
     const includesCity=cityName&&norm(street).endsWith(norm(cityName));
     if(address)address.textContent=includesCity?street:[cityName,street].filter(Boolean).join(' · ');

     const buttons=card.querySelector('.buttons');
     for(const link of buttons?.querySelectorAll('a')||[]){
       if(!link.getAttribute('href')?.trim())link.remove();
       else if(place.website&&link.textContent.includes('Omat sivut'))link.href=place.website;
     }
     if(buttons&&!buttons.children.length)buttons.remove();
     let info=card.querySelector('.ms347-facts');
     if(!info){info=document.createElement('div');info.className='ms347-facts';const buttons=card.querySelector('.buttons');if(buttons)card.insertBefore(info,buttons);else card.append(info);}
     const snippets=[];
     if(isSfc(place))snippets.push('SFC-alue');
     if(isYearRound(place))snippets.push('✓ Ympäri vuoden');
     const price=String(place.priceText||'').trim();
     if(price&&!/^(oppaan hinnat eivät ole ajantasaisia|tarkista|ei tietoa)/i.test(price))snippets.push('Hinta: '+price);
     const known=servicesFor(place);
     if(known.size)snippets.push('Palvelut: '+[...known].map(k=>SERVICE_LABELS[k]||k).join(' · '));
     // Puuttuvista hinnoista ja palveluista ei lisätä täytetekstejä.
     const text=snippets.join('   |   ');
     if(text){
       if(info.textContent!==text)info.textContent=text;
     }else info.remove();
   }
   function apply(){
     const parkOnly=kind==='park';
     const panel=document.querySelector('.ms275-services-panel');
     if(panel)panel.hidden=parkOnly;

     const q=parseQuery(search.value);
     const checked=parkOnly?[]:serviceBoxes.filter(el=>el.checked).map(el=>el.value);
     const required=new Set([...q.services,...checked]);
     const index=byUrlName();
     const cards=[...container.querySelectorAll('.stay')];
     let visible=0;
     for(const card of cards){
       const p=findCardPlace(card,index);
       if(p)annotate(card,p);
       const kindOk=kind==='all'||p?.type===kind;
       const sfcOk=parkOnly||!sfc?.checked||isSfc(p);
       const yearOk=parkOnly||!year?.checked||Boolean(p && isYearRound(p));
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
     if(status)status.textContent=(city?.value||region?.value||'Koko Suomi')+' · '+visible+' '+category;
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
