/* Matkaile Suomessa v411: kuusi leirintäalueiden palveluvalintaa; matkaparkkien valinnat säilyvät. */
(()=>{'use strict';
 const SERVICES=[
  ['electric','⚡ Sähkö','Sähköpaikka'],
  ['sauna','♨️ Sauna','Sauna, yleinen tai varattava'],
  ['cottages','🏠 Mökit','Mökkimajoitus'],
  ['laundry','🧺 Pyykinpesu','Pyykinpesumahdollisuus'],
  ['greywater','🔧 Harmaaveden tyhjennys','Harmaaveden tyhjennys'],
  ['chemical','🚐 Kemiallisen WC:n tyhjennys','Kemiallisen WC:n tyhjennys']
 ];
 // Matkaparkkien palvelurajaukset on tarkoituksella erotettu leirintäalueista.
 // Suodatusmoottori käyttää samoja tunnuksia (electric, wc, greywater).
 const PARK_SERVICES=[
  ['electric','⚡ Sähkö','Sähkö'],
  ['wc','🚻 WC','WC'],
  ['greywater','🔧 Harmaaveden tyhjennys','Harmaaveden tyhjennys']
 ];
 function init(){
   const group=document.querySelector('.ms275-services-panel .ms275-services-choices');
   if(!group)return;
   const services=document.body.dataset.kind==='park'?PARK_SERVICES:
     document.body.dataset.stayCombined==='true'?[...SERVICES,['wc','🚻 WC','WC']]:SERVICES;
   // Sivukohtaiset valinnat ovat näkyvissä myös JavaScriptin päivityksen jälkeen.
   const existing=new Map([...group.querySelectorAll('input.ms275-service-choice')].map(i=>[i.value,i.checked]));
   group.replaceChildren(...services.map(([value,caption,full])=>{
     const label=document.createElement('label');label.title=full;
     const checkbox=document.createElement('input');checkbox.type='checkbox';
     checkbox.className='ms275-service-choice';checkbox.value=value;
     checkbox.checked=Boolean(existing.get(value));checkbox.setAttribute('aria-label',full);
     const text=document.createElement('span');
     text.textContent=caption;
     label.append(checkbox,text);return label;
   }));
   if(document.body.dataset.kind==='camping'){
     group.querySelectorAll('label').forEach(label=>{
       label.style.minWidth='0';
       const text=label.querySelector('span');
       if(text){text.style.whiteSpace='normal';text.style.overflowWrap='anywhere';}
     });
     const panel=group.closest('.ms275-services-panel');
     const intro=panel?.querySelector('p');
     if(intro)intro.textContent='Valitse tarvitsemasi lisä- ja huoltopalvelut. Tuloksissa näkyvät kohteet, joille valitut palvelut on vahvistettu.';
     const note=panel?.querySelector('.ms275-service-footer small');
     if(note)note.textContent='Palvelut voivat olla maksullisia, varattavia tai kausittaisia. Puuttuva tieto ei tarkoita, ettei palvelua ole.';
   }
   group.setAttribute('role','group');group.setAttribute('aria-label','Valitse tarvitsemasi palvelut');
   document.querySelectorAll('.ms275-scroll-hint').forEach(x=>x.remove());
   const reset=document.getElementById('ms275-clear-services');
   if(reset){reset.type='button';reset.addEventListener('click',()=>{
     // Myös nykyistä vanhempien valintojen mahdolliset rastit tyhjentyvät.
     const inputs=[...group.querySelectorAll('input[type=checkbox]')];
     inputs.forEach(input=>input.checked=false);
     inputs.forEach(input=>input.dispatchEvent(new Event('change',{bubbles:true})));
     if(typeof window.ms275ApplyFilters==='function')window.ms275ApplyFilters();
   });}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();

/* Matkailu Suomessa v275: Verified services. Unknown is NOT yes. */
(()=>{'use strict';
const VERIFIED=[{"city":"Asikkala","names":["Kanavaanari","Vääksyn matkaparkki"],"services":["electric","wc","shower","water","chemical"],"source":"https://asikkala.fi/kohteet/kanavaanari-vaaksyn-matkaparkki/","note":"20 paikkaa. Lokakuu–huhtikuu: ei talvikunnossapitoa, varaus matkailuinfosta.","openingStatus":null},{"city":"Asikkala","names":["Tallukan matkaparkki","Hotelli Tallukka"],"services":["electric","wifi","gym","breakfast"],"source":"https://www.tallukka.fi/matkaparkki","note":"14 sähköpaikkaa, hotellin saniteettitilat ja palvelut hotellin aukioloaikoina.","openingStatus":null},{"city":"Paltamo","names":["Paltamo Caravan","Paltamo Golf"],"services":["electric"],"source":"https://paltamogolf.fi/fi-fi/koemajoitu/caravan-matkaparkki/168/","note":"Huoltorakennuksen käyttö kuuluu yöpymiseen, sauna ei sisälly hintaan.","openingStatus":null},{"city":"Suomussalmi","names":["Hossan Lumo"],"services":["electric","wc","shower","kitchen","laundry","sauna","chemical","cafe","cottages","beach","playground"],"source":"https://www.hossanlumo.fi/leirintaalue/","note":"Leirintäalueen huoltorakennus 1.6.–30.9.; mökkien aukiolo eri asia.","openingStatus":null},{"city":"Suomussalmi","names":["Karhunkainalo"],"services":["electric","wc","shower","sauna","laundry","chemical","water"],"source":"https://hossa-kylmaluoma.fi/hossan-luontokeskus/camping/","note":"Camping avoinna 1.3.–25.10.2026.","openingStatus":null},{"city":"Sotkamo","names":["Vuokatinrinteiden Caravanalue"],"services":["electric","wc","shower","sauna","laundry","chemical","water"],"source":"https://vuokatti.fi/paikka/vuokatinrinteet-5/","note":"Vain talvikaudella 1.10.–15.5.; harmaaveden ajokaivoa ei ole.","openingStatus":null},{"city":"Ristijärvi","names":["Ristijärven Pirtti"],"services":["wc","shower","water","chemical","greywater","kitchen","sauna","cottages","cafe"],"source":"https://www.ristijarvenpirtti.fi/","note":"Leirintäalue kausittain. Mökkien ympärivuotinen aukiolo ei tarkoita ympärivuotista caravan-aluetta.","openingStatus":null},{"city":"Heinola","names":["Heinäsaari","Heinolan Heinäsaari"],"services":["electric","wc","shower","water","chemical","greywater","kitchen","sauna","cottages","cafe","laundry","beach","playground"],"source":"https://www.visitheinasaari.fi/leirintaaluepalvelut/","note":"Osa palveluista vain kesällä; ajokaivon käyttö talvella riippuu lumitilanteesta.","openingStatus":null},{"city":"Heinola","names":["Heinolan Sataman Matkaparkki","Sataman matkaparkki"],"services":["electric","wc","shower","water","laundry"],"source":"https://matkaparkki.com/matkaparkit/heinolan-sataman-matkaparkki/","note":"Viisi sähköpaikkaa. Matkaparkin ilmoitetaan olevan avoinna ympäri vuoden.","openingStatus":"yearround"},{"city":"Hämeenlinna","names":["Hämeensaaren matkaparkki","Hämeensaari"],"services":["electric","wc","shower","water","playground","beach"],"source":"https://www.hameenlinna.fi/asuminen-ja-ymparisto/kadut-ja-liikenne/pysakointi/matkaparkki/","note":"Kausi 15.5.–30.9.2026. 8 sähköpaikkaa ja 14 sähkötöntä paikkaa.","openingStatus":"seasonal"},{"city":"Loviisa","names":["Loviisan keskustan matkaparkki"],"services":["electric","wc","shower","sauna","water","chemical","laundry","kitchen"],"source":"https://matkaparkki.com/matkaparkit/loviisan-keskustan-matkaparkki/","note":"10 sähköpaikkaa ja 10 sähkötöntä paikkaa.","openingStatus":null},{"city":"Lahti","names":["Hennalan matkaparkki"],"services":["electric","playground"],"source":"https://matkaparkki.com/matkaparkit/hennalan-matkaparkki-lahti/","note":"Kesäkausi 2026; neljä kahdeksasta paikasta sähköistetty.","openingStatus":"seasonal"},{"city":"Lahti","names":["Kärkkäinen Lahti"],"services":["electric"],"source":"https://matkaparkki.com/matkaparkit/karkkainen-lahti/","note":"Kuusi sähköpaikkaa tavaratalon pihalla.","openingStatus":null},{"city":"Lahti","names":["Renkomäki"],"services":["electric","wc","shower","water"],"source":"https://app.matkaparkki.com/matkaparkit/paikkakunnat/lahti","note":"Palvelut listattu Matkaparkki-palvelun Lahden kohdeluettelossa.","openingStatus":null},{"city":"Pielavesi","names":["Matkaparkki Pielavesi","Pielaveden matkaparkki"],"services":["electric","wc","shower","water","chemical","gym"],"source":"https://matkaparkki.com/matkaparkit/matkaparkki-pielavesi/","note":"Kausi 15.5.–31.8.2026; suihkut ja WC liikuntahallissa.","openingStatus":"seasonal"},{"city":"Äänekoski","names":["Suolahden keskustan matkaparkki"],"services":["electric","wc","shower","sauna","water","chemical","cafe"],"source":"https://matkaparkki.com/matkaparkit/suolahden-keskustan-matkaparkki/","note":"Hotellin sauna ja yhteistilat käytössä; ravintolapalvelut tarkistettava.","openingStatus":null},{"city":"Tervo","names":["Vanhan kyläkoulun matkaparkki"],"services":["wc","shower","kitchen","water","chemical"],"source":"https://matkaparkki.com/matkaparkit/","note":"Vanhan kyläkoulun B-rakennuksen saniteetti- ja keittiöpalvelut.","openingStatus":null},{"city":"Kuhmoinen","names":["Kuhmoisten matkaparkki"],"services":["electric","wc","water","chemical"],"source":"https://app.matkaparkki.com/matkaparkit/RrylvA18RaixKjGBqw4A","note":"Lähteen palveluluettelossa sähkö, WC, vesi ja kemiallisen WC:n tyhjennys.","openingStatus":null}];
const LABELS={"electric":"Sähköpaikka","wc":"WC","shower":"Suihku","sauna":"Sauna","water":"Vesipiste","chemical":"Kemiallisen WC:n tyhjennys","greywater":"Harmaaveden tyhjennys","kitchen":"Keittiö","laundry":"Pyykinpesu","cottages":"Mökit","cafe":"Kahvila","wifi":"Wi-Fi","gym":"Kuntosali","breakfast":"Aamiainen","beach":"Uimaranta","playground":"Leikkipaikka"};
const ALIASES={"electric":["sahko","sahkopaikka","sahkotolppa","sahkollinen","electric","sähkö"],"wc":["wc","vessa","vessat","toaletti"],"shower":["suihku","suihkut"],"sauna":["sauna","saunat"],"water":["vesipiste","puhdasvesi","vedentaytto","talousvesi"],"chemical":["kemssa","kemssan","kemiallinen wc","septitankki","kemiallisen wc tyhjennys"],"greywater":["harmaavesi","harmaaveden tyhjennys","ajokaivo"],"kitchen":["keittio","ruoanlaitto"],"laundry":["pyykinpesu","pesukone"],"cottages":["mokki","mokit","mokkimajoitus"],"cafe":["kahvila","kahviot"],"wifi":["wifi","wi fi","langaton netti"],"gym":["kuntosali"],"breakfast":["aamiainen"],"beach":["uimaranta"],"playground":["leikkipaikka"]};
window.ms275Labels=LABELS;
const normal=x=>String(x||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const places=window.caravanPlaces||(window.caravanPlaces=[]);
const byService=new Map();
for(const v of VERIFIED){
 for(const p of places){
  if(normal(p.city)!==normal(v.city))continue;
  const n=normal(p.name);
  if(v.names.some(x=>n.includes(normal(x)))){
    p.verifiedServices=Array.from(new Set([...(p.verifiedServices||[]),...v.services]));
    p.verifiedSource=v.source;p.verifiedNote=v.note;p.serviceChecked='2026-10-12';
    if(v.openingStatus)p.verifiedOpeningStatus=v.openingStatus;
    byService.set(p.id||p.url||p.name,p);
  }
 }
}
// v274 generic detail pages use msMatkaparkitV274; the current place and the data can be separate objects.
for(const item of window.msMatkaparkitV274||[]){
 const found=places.find(p=>p.id===item.id);
 if(found && found!==item)Object.assign(item,{verifiedServices:found.verifiedServices,verifiedSource:found.verifiedSource,verifiedNote:found.verifiedNote,serviceChecked:found.serviceChecked,verifiedOpeningStatus:found.verifiedOpeningStatus});
}
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
ready(()=>{
 const kind=document.body.dataset.kind;
 if(document.body.dataset.stayCombined==='true'||(kind!=='park'&&kind!=='camping'))return;
 const root=document.getElementById('municipality-results'),search=document.getElementById('v243-stay-search');
 if(!root||!search)return;
 const filterFields=[...document.querySelectorAll('.ms275-service-choice')];
 const area=document.getElementById('region'),town=document.getElementById('municipality'),status=document.getElementById('list-status');
 const normQuery=normal, aliases=[];
 for(const [key,forms] of Object.entries(ALIASES))for(const form of forms)aliases.push([normal(form),key]);
 aliases.sort((a,b)=>b[0].length-a[0].length);
 function parseText(text){
  const tokens=[];let q=' '+normQuery(text)+' ';
  // Multi-term conjunction. Do not mistake part of a placename for service.
  for(const [term,key] of aliases){
   if(!term)continue;
   const needle=' '+term+' ';
   if(q.includes(needle)){
    tokens.push(key);q=q.split(needle).join(' ');
   }
  }
  const hasYear=/(?:ympari vuoden|ymparivuotinen|avoinna 365)/.test(q);
  if(hasYear)q=q.replace(/ympari vuoden|ymparivuotinen|avoinna 365/g,' ');
  return {services:new Set(tokens),yearround:hasYear,words:q.trim().split(/\s+/).filter(Boolean)};
 }
 function getPlace(card){
   const href=card.querySelector('.buttons a[href]')?.getAttribute('href')||'';
   return places.find(p=>p.type===kind&&p.url===href) || places.find(p=>p.type===kind&&p.name===card.querySelector('h2')?.textContent)||null;
 }
 function decorate(card,p){
   if(card.dataset.ms275Done===String(p?.id||p?.url||p?.name||''))return;
   card.dataset.ms275Done=String(p?.id||p?.url||p?.name||'');
   let panel=card.querySelector('.ms275-card-services');if(panel)panel.remove();
   panel=document.createElement('div');panel.className='ms275-card-services';
   const known=p?.verifiedServices||[];
   if(known.length){
     const h=document.createElement('strong');h.textContent='Vahvistetut palvelut';panel.append(h);
     const tags=document.createElement('div');tags.className='ms275-card-tags';
     known.forEach(k=>{const span=document.createElement('span');span.textContent=LABELS[k]||k;tags.append(span)});panel.append(tags);
     if(p.verifiedNote){const n=document.createElement('small');n.textContent=p.verifiedNote;panel.append(n)}
     if(p.verifiedSource){const l=document.createElement('a');l.href=p.verifiedSource;l.target='_blank';l.rel='noopener noreferrer';l.textContent='Palvelujen lähde ↗';panel.append(l)}
   }else{panel.classList.add('ms275-not-verified');panel.textContent='Palveluja ei vielä vahvistettu — tarkista suoraan kohteesta.'}
   const buttons=card.querySelector('.buttons'); if(buttons)card.insertBefore(panel,buttons);else card.append(panel);
 }
 function apply(){
   const selected=filterFields.filter(x=>x.checked).map(x=>x.value);
   const parsed=parseText(search.value), required=new Set([...selected,...parsed.services]);
   const cards=[...root.querySelectorAll('.stay')];let shown=0;
   window.ms275SearchActive=parsed.services.size>0;
   for(const card of cards){
     const p=getPlace(card);decorate(card,p);
     const svc=new Set(p?.verifiedServices||[]);
     const text=normal([p?.name,p?.city,p?.address,p?.region].filter(Boolean).join(' '));
     const matchServices=[...required].every(k=>svc.has(k));
     const matchName=parsed.words.every(w=>text.includes(w));
     const sfcOk=!document.getElementById('camp-only-sfc')?.checked||card.dataset.sfcArea==='true';
     const yearNeeded=Boolean(parsed.yearround||document.getElementById('camp-only-year-round')?.checked||document.getElementById('ms275-year-round')?.checked);
     const yrOk=!yearNeeded||p?.verifiedOpeningStatus==='yearround'||card.dataset.openingStatus==='yearround';
     const ok=matchServices&&matchName&&sfcOk&&yrOk;
     card.hidden=!ok;card.style.display=ok?'':'none';if(ok)shown++;
   }
   const existing=root.querySelector('#ms275-no-results');if(existing)existing.remove();
   if(!shown && cards.length && (required.size||search.value.trim()||document.getElementById('camp-only-sfc')?.checked||document.getElementById('camp-only-year-round')?.checked||document.getElementById('ms275-year-round')?.checked)){
      const msg=document.createElement('p');msg.id='ms275-no-results';msg.textContent='Näillä hakuehdoilla ei löytynyt vahvistettua kohdetta. Poista rajaus tai valitse toinen maakunta.';root.append(msg);
   }
   const oldNoResult=root.querySelector('#camp-opening-empty');if(oldNoResult)oldNoResult.hidden=true;
   if(status)status.textContent=(town?.value||area?.value||'Koko Suomi')+' · '+shown+' / '+cards.length+' kohdetta'+(required.size?' · palvelurajaus':'');
 }
 window.ms275ApplyFilters=apply;
 filterFields.forEach(x=>x.addEventListener('change',apply));
 search.addEventListener('input',apply);
 area?.addEventListener('change',()=>queueMicrotask(apply));
 town?.addEventListener('change',()=>queueMicrotask(apply));
 document.getElementById('camp-only-sfc')?.addEventListener('change',()=>queueMicrotask(apply));
 document.getElementById('camp-only-year-round')?.addEventListener('change',()=>queueMicrotask(apply));
 document.getElementById('ms275-year-round')?.addEventListener('change',apply);
 document.getElementById('ms275-clear-services')?.addEventListener('click',()=>{filterFields.forEach(x=>x.checked=false);apply()});
 new MutationObserver(m=>{if(m.some(x=>x.type==='childList' && [...x.addedNodes,...x.removedNodes].some(n=>n.nodeType===1&&(n.classList?.contains('stay')||n.querySelector?.('.stay')))))apply()}).observe(root,{childList:true});
 apply();
});
})();