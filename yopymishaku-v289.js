/* Matkaile Suomessa v289 — koko Suomen välitön yöpymispaikkahaku.
 * Näyttää osumat heti hakukentän alla, myös ilman maakunnan valintaa.
 * Ei muuta varsinaisen alue-/kuntalistauksen toimintaa.
 */
(() => {
  'use strict';
  const norm = value => String(value ?? '').toLocaleLowerCase('fi')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim();
  const searchInput = () => document.getElementById('v243-stay-search');
  const serviceTerms = {
    electric: ['sahko', 'sahkopaikka', 'sahkotolppa'],
    shower: ['suihku', 'suihkut'], sauna: ['sauna', 'saunat'],
    wc: ['wc', 'vessa'], greywater: ['harmaavesi', 'harmaaveden tyhjennys', 'ajokaivo'],
    chemical: ['kemiallinen wc', 'kemssa', 'kemiallisen wc tyhjennys'],
    cottages: ['mokki', 'mokit', 'mokkimajoitus'],
    cafe: ['kahvila'], playground: ['leikkipaikka'], beach: ['uimaranta'],
    kitchen: ['keittio'], laundry: ['pyykinpesu'], water: ['vesipiste']
  };
  const normalizedTerms = Object.entries(serviceTerms)
    .flatMap(([key, words]) => words.map(word => ({key, word: norm(word)})))
    .sort((a,b) => b.word.length - a.word.length);

  function parse(value) {
    let q = ' ' + norm(value) + ' ';
    const services = new Set();
    for (const {key,word} of normalizedTerms) {
      const needle = ' ' + word + ' ';
      if (q.includes(needle)) {services.add(key); q = q.split(needle).join(' ');}
    }
    const yearround = /\bympari vuoden\b|\bymparivuotinen\b/.test(q);
    q = q.replace(/\bympari vuoden\b|\bymparivuotinen\b/g, ' ');
    const type = /\bmatkaparkit?\b/.test(q) ? 'park' : /\bleirintaalueet?\b/.test(q) ? 'camping' : '';
    q = q.replace(/\bmatkaparkit?\b|\bleirintaalueet?\b/g, ' ');
    return {words: q.trim().split(/\s+/).filter(Boolean), services, yearround, type};
  }
  function safeLink(value) {
    if (!value) return null;
    try {
      const url = new URL(value, location.href);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
    } catch (_) {return null;}
  }
  function isYearRound(place) {
    return place.openingStatus === 'yearround' || place.verifiedOpeningStatus === 'yearround' ||
      place.openingStatus === 'year-round';
  }
  function hasService(place, service) {
    return Array.isArray(place.verifiedServices) && place.verifiedServices.includes(service);
  }
  function searchPlaces(query, area, city) {
    const parsed = parse(query);
    const selected = [...document.querySelectorAll('.ms275-service-choice:checked')].map(el => el.value);
    const required = [...new Set([...selected, ...parsed.services])];
    const sfc = Boolean(document.getElementById('camp-only-sfc')?.checked);
    const onlyYearround = Boolean(parsed.yearround || document.getElementById('camp-only-year-round')?.checked || document.getElementById('ms275-year-round')?.checked);
    const all = Array.isArray(window.caravanPlaces) ? window.caravanPlaces : [];
    const seen = new Set(), result = [];
    for (const place of all) {
      if (!place || !['camping','park'].includes(place.type)) continue;
      if (parsed.type && parsed.type !== place.type) continue;
      if (area && norm(place.region) !== norm(area)) continue;
      if (city && norm(place.city) !== norm(city)) continue;
      if (sfc && !(place.sfcArea === true || place.sfCaravanArea === true || /^sf[ -]?caravan\b|^sfc\b/i.test(place.name || ''))) continue;
      if (onlyYearround && !isYearRound(place)) continue;
      if (!required.every(service => hasService(place, service))) continue;
      const haystack = norm([place.name, place.city, place.region, place.address, ...(Array.isArray(place.aliases) ? place.aliases : []), place.description].filter(Boolean).join(' '));
      if (!parsed.words.every(word => haystack.includes(word))) continue;
      const key = norm([place.name, place.city].join('|')) || place.id || place.url;
      if (seen.has(key)) continue;
      seen.add(key); result.push(place);
    }
    // Esimerkiksi Tuuri -> Onnela ensin, ei satunnaista muuta Tuurin mainintaa.
    const wholeQuery = norm(query);
    result.sort((a,b) => {
      const rank = p => (norm(p.name).includes(wholeQuery) ? 0 :
        (p.aliases || []).some(s => norm(s) === wholeQuery) ? 1 :
        norm(p.address).includes(wholeQuery) ? 2 : 3);
      return rank(a) - rank(b) || String(a.name).localeCompare(String(b.name), 'fi');
    });
    return {result, total: all.length};
  }
  function node(tag, cls, value) {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (value !== undefined) el.textContent = value;
    return el;
  }
  function ready() {
    const input = searchInput(), top = document.querySelector('.v243-stay-top');
    if (!input || !top || !['camping','park'].includes(document.body.dataset.kind)) return;
    // Uusi osumalista näkyy ennen pitkiä maakunta- ja palveluvalikoita.
    const box = node('section', 'ms289-results');
    box.id = 'ms289-results'; box.setAttribute('aria-label','Hakutulokset');
    box.setAttribute('aria-live','polite'); box.hidden = true;
    top.append(box);
    const originalList = document.getElementById('municipality-results');
    const originalStatus = document.getElementById('list-status');
    const controls = ['region', 'municipality', 'camp-only-sfc', 'camp-only-year-round', 'ms275-year-round'];
    let hadSearch = false;
    function update() {
      const q = input.value.trim();
      const searching = q.length > 0;
      box.hidden = !searching;
      // Vanha tuloslista on alempana, eikä sitä saa näyttää ristiriitaisena.
      if (originalList) originalList.style.display = searching ? 'none' : '';
      if (originalStatus) originalStatus.style.display = searching ? 'none' : '';
      if (!searching) {box.replaceChildren(); hadSearch = false; return;}
      const region = document.getElementById('region')?.value || '';
      const town = document.getElementById('municipality')?.value || '';
      const {result, total} = searchPlaces(q, region, town);
      box.replaceChildren();
      box.append(node('h2', 'ms289-title', 'Hakutulokset'));
      if (!total) {
        box.append(node('p', 'ms289-note', 'Kohdetiedot eivät latautuneet. Päivitä sivu ja kokeile uudelleen.'));
        return;
      }
      const info = node('p', 'ms289-summary', result.length + ' kohdetta löytyi' +
        (region || town ? ' valitulta alueelta.' : ' koko Suomesta.'));
      box.append(info);
      if (!result.length) {
        box.append(node('p', 'ms289-note', 'Ei osumia. Kokeile esimerkiksi Tuuri, Onnela, Töysä tai Alavus, tai poista jokin rajaus.'));
      } else {
        const list = node('div', 'ms289-list');
        for (const place of result.slice(0,50)) {
          const target = safeLink(place.url) || safeLink(place.website);
          const card = node(target ? 'a' : 'div', 'ms289-item');
          if (target) card.href = target;
          card.append(node('strong', '', place.name || 'Nimetön kohde'));
          card.append(node('span', 'ms289-location', [place.city, place.region].filter(Boolean).join(' · ')));
          if (place.address) card.append(node('small', 'ms289-address', place.address));
          const details = [place.type === 'camping' ? '🏕️ Leirintäalue' : '🅿️ Matkaparkki'];
          if (isYearRound(place)) details.push('✓ Ympäri vuoden');
          card.append(node('small', 'ms289-extra', details.join(' · ') + (target ? '  ›' : '')));
          list.append(card);
        }
        box.append(list);
        if (result.length > 50) box.append(node('p', 'ms289-note', 'Näytetään ensimmäiset 50 tulosta. Tarkenna hakua.'));
      }
      hadSearch = true;
    }
    input.addEventListener('input', update);
    input.addEventListener('change', update);
    for (const id of controls) document.getElementById(id)?.addEventListener('change', () => queueMicrotask(update));
    document.querySelectorAll('.ms275-service-choice').forEach(el => el.addEventListener('change', update));
    document.getElementById('ms275-clear-services')?.addEventListener('click', () => queueMicrotask(update));
    addEventListener('pageshow', update);
    update();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, {once:true});
  else ready();
})();
