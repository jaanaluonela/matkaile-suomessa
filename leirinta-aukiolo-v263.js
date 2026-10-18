/* Matkailu Suomessa v272 – Leirintäalueiden aukiolo- ja SF-Caravan-suodattimet.
   Virallisten SFC-alueiden luettelon lähde (päivitetty 8.9.2026):
   https://www.karavaanarit.fi/karavaanarin-tietopankki/leirintamatkailu/leirinta-suomessa/sf-caravan-leirintaalueet/
   Huom. Rajaus käyttää sovellukseen jo tallennettuja kohteita, ei lataa listasta uusia.
*/
(() => {
  'use strict';
  const ready = callback => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', callback, {once:true}) : callback();
  const normal = s => String(s ?? '').toLocaleLowerCase('fi').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const officialNames = [
    "Alatalo",
    "Etelälahti",
    "Etuniemi",
    "Hakalanranta",
    "Harvaluoto",
    "Hietajärvi",
    "Hietasaari",
    "Hiilimutka",
    "Hopeaperä",
    "Hämeenhelmi",
    "Jokiranta",
    "Kalajärvi",
    "Kangaslampi",
    "Kattivankkuri",
    "Kesäniemi",
    "Koivulehto",
    "Krapuranta",
    "Kuninkaanlähde",
    "Kuturanta",
    "Kuusisto",
    "Laamalansaari",
    "Leininranta",
    "Leporanta",
    "Lintulahti",
    "Lohenpyrstö",
    "Lukkuhaka",
    "Maisansalo",
    "Majamäki",
    "Margareta",
    "Mellajärvi",
    "Multaranta",
    "Mussalo",
    "Mylly-Mäkelä",
    "Palvaanjärvi",
    "Pitkäjärvi",
    "Pitkäniemi",
    "Purho",
    "Rairanta",
    "Rantasarka",
    "Rekiniemi",
    "Ruissalo Camping Talvialue",
    "Ryynäsenniemi",
    "Naantali Saloranta",
    "Sarapisto",
    "Sautinkari",
    "Sexsjö",
    "Siikalainen",
    "Skeppars",
    "Sydänlampi",
    "Sääksi",
    "Tilkunpelto",
    "Valasranta",
    "Vankkuri-Vehmas",
    "Vankkurimännikkö",
    "Vantaan Talli",
    "Vieresniemi",
    "VihtiPark",
    "Vuorenmäki"
  ].map(normal);
  const officialNamesSorted = officialNames.sort((a,b)=>b.length-a.length);
  const hasYearRoundText = text => /(?:ymp[äa]ri\s+vuoden|ymp[äa]rivuotinen|avoinna\s+365\s+p[äa]iv[äa][äa]?)/i.test(text);

  function isSfcArea(place) {
    if (place.sfcArea === false || place.sfCaravanArea === false) return false;
    if (place.sfcArea === true || place.sfCaravanArea === true) return true;
    const n = normal(place.name);
    if (!n) return false;
    // Nimen SF-Caravan/SFC-tunnus tai liiton ajantasaisen luettelon aluenimi.
    // EI käytetä kuvaustekstiä, sillä tavalliset alueet voivat tarjota SFC-jäsenalennuksia.
    if (/^(?:sfc\b|sf caravan\b)|\b(?:sfc|sf caravan)\b/.test(n)) return true;
    const padded=' '+n+' ';
    return officialNamesSorted.some(name => padded.includes(' '+name+' '));
  }
  function opening(place) {
    const extra = (window.campingOpeningData || {})[place.id] ||
      (window.campingOpeningData || {})[place.url] || {};
    const explicit = String(extra.status || place.openingStatus || '').toLowerCase();
    const raw = String(extra.season || place.season || '').trim();
    if (explicit === 'yearround' || explicit === 'year-round')
      return {status:'yearround', label:'✓ Avoinna ympäri vuoden'};
    if (explicit === 'seasonal')
      return {status:'seasonal',label:raw && !/varmista|tarkista|ei tiedossa/i.test(raw) ? '📅 '+raw : '📅 Kausiluonteinen'};
    if (explicit === 'unknown')
      return {status:'unknown',label:'? Aukioloaika ei tiedossa'};
    if (hasYearRoundText(raw) && !/(?:ei\s+ymp[äa]ri|vain\s+m[öo]kit|ei\s+avoinna)/i.test(raw))
      return {status:'yearround',label:'✓ Avoinna ympäri vuoden'};
    if (/\b(?:talvikausi|kes[äa]kausi|kausittain|kausiluonteinen|sesonki|suljettu)\b/i.test(raw) ||
        /\b\d{1,2}\.\d{1,2}\.?\s*[.–-]+\s*\d{1,2}\.\d{1,2}\b/.test(raw))
      return {status:'seasonal',label:'📅 '+raw};
    return {status:'unknown', label:'? Aukioloaika ei tiedossa'};
  }
  window.ms347CampingFacts = {isSfcArea, opening};
  ready(() => {
    if (document.body.dataset.stayCombined === 'true' || document.body.dataset.kind !== 'camping') return;
    const yearCheckbox = document.getElementById('camp-only-year-round');
    const sfcCheckbox = document.getElementById('camp-only-sfc');
    const input = document.getElementById('v243-stay-search');
    const box = document.getElementById('municipality-results');
    const status = document.getElementById('list-status');
    if (!yearCheckbox || !sfcCheckbox || !box) return;
    const serviceCheckboxes = [...document.querySelectorAll('[data-camp-service]')];
    const params = new URLSearchParams(location.search);
    if (params.get('sfc') === '1') sfcCheckbox.checked = true;
    const places = () => window.caravanPlaces || [];
    function placeForCard(card) {
      const href = card.querySelector('.buttons a[href]')?.getAttribute('href') || '';
      return places().find(p => p && p.type === 'camping' && p.url === href) ||
        places().find(p => p && p.type === 'camping' && p.name === card.querySelector('h2')?.textContent);
    }
    function apply() {
      const cards = [...box.querySelectorAll('.stay')];
      const q = normal(input?.value);
      let visible = 0;
      for (const card of cards) {
        const place = placeForCard(card) || {};
        const aukiolo = opening(place);
        const sfc = isSfcArea(place);
        card.dataset.openingStatus = aukiolo.status;
        card.dataset.sfcArea = sfc ? 'true' : 'false';
        let badge = card.querySelector('.camp-opening-badge, .badge');
        if (!badge) {badge = document.createElement('span');card.prepend(badge);}
        badge.className = 'camp-opening-badge camp-opening-badge--'+aukiolo.status;
        badge.textContent = aukiolo.label;
        let sfcBadge=card.querySelector('.camp-sfc-badge');
        if (sfc && !sfcBadge) {
          sfcBadge=document.createElement('span');
          sfcBadge.className='camp-sfc-badge';
          sfcBadge.textContent='SFC-alue';
          badge.insertAdjacentElement('afterend',sfcBadge);
        } else if (!sfc && sfcBadge) sfcBadge.remove();
        const services = window.campServicesV274(place);
        let serviceInfo=card.querySelector('.camp-service-info');
        if(!serviceInfo){serviceInfo=document.createElement('p');serviceInfo.className='camp-service-info';card.append(serviceInfo);}
        serviceInfo.textContent=Object.entries(window.campServiceLabelsV274).filter(([key])=>services[key]===true).map(([,label])=>label).join(' · ') || 'Palvelutietoja ei vielä vahvistettu';
        const searchableText = normal(card.textContent+' '+(place.name||'')+' '+(place.city||''));
        const show = (!q || searchableText.includes(q)) &&
          (!yearCheckbox.checked || aukiolo.status === 'yearround') &&
          (!sfcCheckbox.checked || sfc) && serviceCheckboxes.every(c=>!c.checked || services[c.dataset.campService]===true);
        card.hidden = !show;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      }
      const hasFilter = Boolean(yearCheckbox.checked || sfcCheckbox.checked || serviceCheckboxes.some(c=>c.checked) || q);
      let empty = document.getElementById('camp-opening-empty');
      const baseEmpty = box.querySelector('.empty');
      if (baseEmpty) baseEmpty.hidden = hasFilter;
      if (visible === 0 && hasFilter) {
        if (!empty) {empty=document.createElement('p');empty.id='camp-opening-empty';box.append(empty);}
        empty.textContent = serviceCheckboxes.some(c=>c.checked) ? 'Valituilla palveluilla ei löytynyt vahvistettuja kohteita. Poista jokin rasti tai laajenna aluetta.' : sfcCheckbox.checked
          ? 'Valituilla hakuehdoilla ei löytynyt SFC-alueita. Poista jokin rasti tai valitse toinen maakunta.'
          : yearCheckbox.checked
            ? 'Tällä rajauksella ei löytynyt vahvistetusti ympäri vuoden avoinna olevia leirintäalueita.'
            : 'Hakusanalla ei löytynyt leirintäalueita.';
        empty.hidden = false;
      } else if (empty) empty.hidden = true;
      if (status && hasFilter) {
        const area = document.getElementById('municipality')?.value ||
          document.getElementById('region')?.value || 'Koko Suomi';
        const active = [
          sfcCheckbox.checked ? 'SFC-alueet' : '',
          yearCheckbox.checked ? 'Ympäri vuoden' : '',
          ...serviceCheckboxes.filter(c=>c.checked).map(c=>window.campServiceLabelsV274[c.dataset.campService]),
          q ? 'Haku' : ''
        ].filter(Boolean);
        status.textContent = area+' · '+active.join(' · ')+' · '+visible+' kohdetta';
      } else if (status && cards.length) {
        const city=document.getElementById('municipality')?.value;
        const region=document.getElementById('region')?.value;
        status.textContent=(city || region || 'Koko Suomi')+' · '+cards.length+' kohdetta';
      }
    }
    serviceCheckboxes.forEach(c=>c.addEventListener('change',apply));
    yearCheckbox.addEventListener('change',apply);
    sfcCheckbox.addEventListener('change',() => {
      const url = new URL(location.href);
      if (sfcCheckbox.checked) url.searchParams.set('sfc','1');
      else url.searchParams.delete('sfc');
      history.replaceState(null,'',url);
      apply();
    });
    input?.addEventListener('input',apply);
    const observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'childList' &&
        [...m.addedNodes, ...m.removedNodes].some(n =>
          n.nodeType === 1 && (n.classList?.contains('stay') ||
          n.classList?.contains('empty') || n.querySelector?.('.stay'))))) apply();
    });
    observer.observe(box,{childList:true});
    document.getElementById('region')?.addEventListener('change',apply);
    document.getElementById('municipality')?.addEventListener('change',apply);
    apply();
  });
})();
