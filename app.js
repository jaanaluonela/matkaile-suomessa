/* Matkailu Suomessa v245: yksi matkalista kaikille paikkakunnille ja päiväkirjalle. */
(function () {
  'use strict';
  const STORE = 'ms_trips_v2';
  const LEGACY = 'ms_trips';
  const visitedKey = id => 'ms_visited_' + id;
  function readArray(key) {
    try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value : []; }
    catch (error) { console.warn('Matkojen lukeminen epäonnistui', error); return []; }
  }
  function todaysDate() {
    const now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  }
  function nameForPage(id) {
    const title = document.querySelector('main h1, header h1, h1');
    const text = title && title.textContent.trim();
    return text || String(id).replace(/[-_]/g, ' ').replace(/\b\w/g, s => s.toUpperCase());
  }
  function tripId(id) { return 'kohde-' + String(id).replace(/[^a-zA-Z0-9_-]/g, '-'); }
  function loadTrips() {
    const trips = readArray(STORE);
    // Otetaan talteen myös aiempien versioiden matkat, ei hävitetä olemassa olevaa päiväkirjaa.
    (localStorage.getItem('ms_trips_legacy_imported_v246') === '1' ? [] : readArray(LEGACY)).forEach(old => {
      if (!old || typeof old !== 'object') return;
      const place = String(old.locationId || old.id || '');
      if (trips.some(t => t.locationId === place || t.id === tripId(place) || (t.name === old.name && t.begin === old.date))) return;
      trips.push({id: place ? tripId(place) : ('vanha-' + trips.length), locationId:place || null,
        name:String(old.name || 'Matka'), begin:old.date || '', end:'', diary:'', stops:[],
        visited:!!(place && localStorage.getItem(visitedKey(place)) === '1')});
    });
    return trips;
  }
  function saveTrip(placeId, placeName, isVisited) {
    const id = String(placeId || '').trim();
    if (!id) return false;
    let trips;
    try {
      trips = loadTrips();
      let trip = trips.find(t => t.locationId === id || t.id === tripId(id) || t.id === id);
      if (!trip) {
        // Vanhempiin päiväkirjamerkintöihin yhdistetään nimi, jos paikkakunta on sama.
        trip = trips.find(t => !t.locationId && String(t.name || '').toLocaleLowerCase('fi') === String(placeName || '').toLocaleLowerCase('fi'));
      }
      if (!trip) {
        trip = {id:tripId(id), locationId:id, name:String(placeName || nameForPage(id)), begin:'', end:'',
          diary:'', stops:[], visited:false, savedAt:todaysDate(), sourceUrl:location.pathname.split('/').pop()};
        trips.unshift(trip);
      } else {
        trip.locationId = id;
        if (!trip.name) trip.name=String(placeName || nameForPage(id));
        if (!Array.isArray(trip.stops)) trip.stops=[];
        if (!trip.sourceUrl) trip.sourceUrl=location.pathname.split('/').pop();
      }
      if (isVisited) {
        trip.visited = true;
        localStorage.setItem(visitedKey(id), '1');
      }
      localStorage.setItem(STORE, JSON.stringify(trips));
      localStorage.setItem('ms_trips_legacy_imported_v246', '1');
      window.dispatchEvent(new CustomEvent('ms-trips-changed', {detail:{id:id,visited:!!trip.visited}}));
      return true;
    } catch(error) {
      console.error('Matkan tallennus epäonnistui',error);
      return false;
    }
  }
  function findActionBlock(button) {
    return button && (button.closest('section.card, section, article, .card') || button.parentElement);
  }
  function message(button, text, success) {
    const host = findActionBlock(button);
    if (!host) return;
    let element = host.querySelector('.ms-trip-feedback');
    if (!element) {
      element = document.createElement('p');
      element.className='ms-trip-feedback';
      element.setAttribute('role','status');
      element.style.cssText='margin:12px 0 2px;font-size:14px;line-height:1.5;color:#17634f;';
      host.appendChild(element);
    }
    element.replaceChildren(document.createTextNode(text + ' '));
    if (success) {
      const link=document.createElement('a');
      link.href='paivakirja.html';
      link.textContent='Avaa Omat matkat →';
      link.style.cssText='font-weight:750;color:inherit;text-decoration:underline;';
      element.appendChild(link);
    }
  }
  function updateButtons() {
    const trips=loadTrips();
    document.querySelectorAll('[data-visited]').forEach(button => {
      const id=button.dataset.visited;
      const t=trips.find(t=>t.locationId === id || t.id === tripId(id));
      if (localStorage.getItem(visitedKey(id))==='1' || (t && t.visited)) {
        button.textContent='✓ Olen käynyt täällä';
        button.setAttribute('aria-pressed','true');
      } else {
        button.setAttribute('aria-pressed','false');
      }
    });
    document.querySelectorAll('button[onclick*="addTrip("]').forEach(button=>{
      const match=button.getAttribute('onclick').match(/addTrip\(\s*['"]([^'"]+)['"]/);
      if (!match) return;
      const id=match[1];
      const saved=trips.some(t=>t.locationId === id || t.id === tripId(id));
      if (saved) {
        button.textContent='✓ Lisätty omiin matkoihin';
        button.setAttribute('aria-pressed','true');
      } else {
        button.textContent='Lisää omiin matkoihin';
        button.setAttribute('aria-pressed','false');
      }
    });
  }
  window.visited=function visited(id, button) {
    const name=nameForPage(id);
    const ok=saveTrip(id,name,true);
    updateButtons();
    message(button,ok?'Käynti tallennettu omiin matkoihin.':'Tallennus ei onnistunut. Tarkista selaimen tallennustila.',ok);
  };
  window.addTrip=function addTrip(id,name) {
    const ok=saveTrip(id,name||nameForPage(id),false);
    updateButtons();
    // Kutsutaan sivulla jo olevaa painiketta ilman riippuvuutta id:stä.
    const b=Array.from(document.querySelectorAll('button[onclick*="addTrip("]')).find(el=>el.getAttribute('onclick').includes("'"+id+"'"));
    message(b,ok?'Kohde löytyy nyt etusivun Omat matkat -sivulta.':'Tallennus ei onnistunut. Tarkista selaimen tallennustila.',ok);
  };
  window.addEventListener('DOMContentLoaded',updateButtons);
  window.addEventListener('pageshow',updateButtons);
  window.addEventListener('storage',updateButtons);
})();

// v168: Avattavat/suljettavat kuntasivujen osiot
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.section-list').forEach((section, index)=>{
    const title=section.querySelector('h2');
    if(!title || title.dataset.accordionReady) return;
    title.dataset.accordionReady='1';
    title.setAttribute('role','button');
    title.setAttribute('tabindex','0');
    const body=section.querySelector('.compact-list');
    if(body && !body.id) body.id='accordion_'+index+'_'+Math.random().toString(36).slice(2,7);
    if(body) title.setAttribute('aria-controls', body.id);
    const arrow=document.createElement('span');
    arrow.className='acc-arrow';
    arrow.textContent='›';
    title.appendChild(arrow);
    section.classList.add('collapsed');
    title.setAttribute('aria-expanded','false');
    const toggle=()=>{
      const closed=section.classList.toggle('collapsed');
      title.setAttribute('aria-expanded', String(!closed));
    };
    title.addEventListener('click',toggle);
    title.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
});

/* Yhtenäinen mobiilialavalikko myös vanhoille paikkakuntasivuille. */
(()=>{const p=location.pathname.split('/').pop()||'index.html';if(p==='index.html')return;const init=()=>{if(!document.querySelector('.ms375-bottom,.footnav'))return;if(!document.querySelector('link[href*="yhteinen-alavalikko-v1.css"]')){const l=document.createElement('link');l.rel='stylesheet';l.href='yhteinen-alavalikko-v1.css?v=3';document.head.appendChild(l)}if(!document.querySelector('script[src*="yhteinen-alavalikko-v1.js"]')){const s=document.createElement('script');s.src='yhteinen-alavalikko-v1.js?v=3';document.head.appendChild(s)}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();

/* Näe ja koe: yhtenäinen G28 Muu nähtävyys -opastemerkki kaikilla kuntasivuilla. */
(()=>{function apply(){document.querySelectorAll('nav.ms375-quick a,nav.iitti-quick a').forEach(a=>{if(!/^Näe ja koe$/i.test((a.textContent||'').trim()))return;let old=a.querySelector('svg');if(!old)return;let svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','2.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('class',old.getAttribute('class')||'ms375-icon');svg.setAttribute('width',old.getAttribute('width')||'40');svg.setAttribute('height',old.getAttribute('height')||'40');let path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M11 11H6a4 4 0 1 1 5-5v20a4 4 0 1 1-5-5h20a4 4 0 1 1 5 5V6a4 4 0 1 1 5 5Z');svg.appendChild(path);old.replaceWith(svg)})}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply()})();


/* Kuntien neljä yhtenäistä pikavalintamerkkiä: nähtävyys, teltta, retkeily, pysäköinti. */
(()=>{const NS='http://www.w3.org/2000/svg';
const icons={
'Näe ja koe':{bg:'#87512e',shape:'<rect x="4" y="4" width="40" height="40" rx="2" fill="#fff"/><path d="M18 18h-5a5 5 0 1 1 5-5v22a5 5 0 1 1-5-5h22a5 5 0 1 1 5 5V13a5 5 0 1 1-5 5Z" fill="none" stroke="#87512e" stroke-width="3" stroke-linejoin="round"/>'},
'Yöpyminen':{bg:'#1672b8',shape:'<path d="M7 36 24 12 41 36H7Z" fill="none" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/><path d="M24 12v24m-9 0 9-13 9 13" fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"/>'},
'Retket':{bg:'#1469b1',shape:'<rect x="4" y="4" width="40" height="40" fill="#fff"/><path d="M14 10 8 23h4l-6 10h16l-6-10h4L14 10Z" fill="#161616"/><path d="M14 32v7M23 39V24l10-10 10 10v15H23Z" fill="#161616"/><path d="M29 39V29h7v10" fill="#fff"/><path d="M20 24 33 11l12 13" stroke="#161616" stroke-width="2.5" fill="none"/>'},
'Pysähdy matkalla':{bg:'#1269b2',shape:'<text x="24" y="38" font-size="37" font-weight="750" text-anchor="middle" font-family="Arial,sans-serif" fill="#fff">P</text>'}
};
function apply(){document.querySelectorAll('nav.ms375-quick a,nav.iitti-quick a,nav.ms-town-quick a').forEach(a=>{const label=(a.textContent||'').replace(/\\s+/g,' ').trim();const spec=icons[label];if(!spec)return;const old=a.querySelector('svg');if(!old)return;const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 48 48');svg.setAttribute('aria-hidden','true');svg.setAttribute('class',old.getAttribute('class')||'ms375-icon');svg.setAttribute('width','48');svg.setAttribute('height','48');svg.innerHTML=spec.shape;old.replaceWith(svg);const holder=a.matches('nav.iitti-quick a')?svg.parentElement:svg;holder.style.setProperty('background',spec.bg,'important');holder.style.setProperty('color','#fff','important');holder.style.setProperty('border-radius','10px','important');svg.style.setProperty('stroke','none','important');svg.style.setProperty('fill','none','important');svg.querySelectorAll('*').forEach(el=>{if(el.hasAttribute('stroke'))el.style.setProperty('stroke',el.getAttribute('stroke'),'important');if(el.hasAttribute('fill'))el.style.setProperty('fill',el.getAttribute('fill'),'important')});});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply()})();


/* Yhteiset kuntien pikavalintakuvakkeet myös vanhoissa sivupohjissa. */
(()=>{const shapes={
'Näe ja koe':['#87512e','<rect x="4" y="4" width="40" height="40" fill="#fff"/><path d="M18 18h-5a5 5 0 1 1 5-5v22a5 5 0 1 1-5-5h22a5 5 0 1 1 5 5V13a5 5 0 1 1-5 5Z" stroke="#87512e" stroke-width="3" fill="none"/>'],
'Yöpyminen':['#1672b8','<path d="M7 36 24 12 41 36H7Z M24 12v24 M15 36l9-13 9 13" stroke="#fff" stroke-width="3" stroke-linejoin="round" fill="none"/>'],
'Retket':['#1469b1','<rect x="4" y="4" width="40" height="40" fill="#fff"/><path d="M14 10 8 23h4L6 33h16l-6-10h4L14 10Z M14 32v7 M23 39V24l10-10 10 10v15Z" fill="#161616"/><path d="M29 39V29h7v10" fill="#fff"/><path d="M20 24 33 11l12 13" stroke="#161616" stroke-width="2.5" fill="none"/>'],
'Pysähdy matkalla':['#1269b2','<text x="24" y="38" font-size="37" font-weight="750" text-anchor="middle" font-family="Arial,sans-serif" fill="#fff">P</text>']};
function apply(){document.querySelectorAll('nav.ms375-quick a,nav.iitti-quick a,nav.ms-town-quick a,nav.k413-grid a,nav.quick a').forEach(a=>{const name=(a.textContent||'').replace(/\\s+/g,' ').replace(/^[^\\p{L}]+/u,'').trim();const spec=shapes[name];if(!spec)return;let svg=a.querySelector('svg');let holder=svg?.parentElement;if(!svg){svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('aria-hidden','true');a.insertBefore(svg,a.firstChild);holder=svg;}svg.setAttribute('viewBox','0 0 48 48');svg.setAttribute('width','48');svg.setAttribute('height','48');svg.innerHTML=spec[1];svg.style.setProperty('background',spec[0],'important');svg.style.setProperty('border-radius','10px','important');svg.style.setProperty('stroke','none','important');svg.style.setProperty('fill','none','important');svg.querySelectorAll('*').forEach(el=>{for(const p of ['stroke','fill'])if(el.hasAttribute(p))el.style.setProperty(p,el.getAttribute(p),'important')});if(holder&&holder!==a&&holder!==svg&&holder.tagName==='SPAN'){holder.style.setProperty('background',spec[0],'important');}a.dataset.msQuickIcon='v2';});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply()})();
