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
    readArray(LEGACY).forEach(old => {
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
