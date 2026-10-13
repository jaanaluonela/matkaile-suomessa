/* Matkaile Suomessa v298: Näe ja koe -sivun selkeä mobiilihaku, kohdetyypit ja sivutettu tuloslista. */
(() => {
  'use strict';
  const originalExtra = {
    name: 'Pyynikin munkkikahvila ja näkötorni',
    city: 'Tampere', address: 'Näkötornintie 20, Tampere',
    description: 'Munkki- ja kahvitauko Pyynikin näkötornin juurella sekä järvimaisemia tornista.',
    type: 'stop', url: 'tampere-pyynikin-munkkikahvila.html'
  };
  const regionSelect = document.getElementById('region');
  const citySelect = document.getElementById('city');
  const input = document.getElementById('query');
  const results = document.getElementById('results');
  const count = document.getElementById('count');
  const moreButton = document.getElementById('ms298-more');
  const resetButton = document.getElementById('ms298-reset');
  const categoryButtons = [...document.querySelectorAll('.ms298-category[data-category]')];
  if (!regionSelect || !citySelect || !input || !results || !count || !moreButton || !resetButton) return;

  const seen = new Set();
  const places = [
    ...(window.nearbyData || []),
    ...(window.visitHighlights || []),
    originalExtra
  ].filter(p => {
    if (!p || !['sight', 'stop'].includes(p.type) || !p.url) return false;
    const key = p.city + '|' + p.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const normalize = value => String(value || '').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const localeSort = (a,b) => String(a).localeCompare(String(b), 'fi');
  const regions = window.msFinlandRegions2026 || {};
  const regionByCity = new Map();
  Object.entries(regions).forEach(([region, cities]) => {
    if (!Array.isArray(cities)) return;
    cities.forEach(city => regionByCity.set(normalize(city), region));
  });
  const aliasRaw = {
    'vääksy':'Asikkala', 'levi':'Kittilä', 'ylläs':'Kolari',
    'äkäslompolo':'Kolari', 'vuokatti':'Sotkamo', 'ruka':'Kuusamo',
    'hossa':'Suomussalmi', 'ämmänsaari':'Suomussalmi',
    'fiskars':'Raasepori', 'tammisaari':'Raasepori', 'saariselkä':'Inari',
    'pyynikki':'Tampere', 'repovesi':'Kouvola',
    'ukko-halla':'Hyrynsalmi', 'paljakka':'Puolanka'
  };
  const aliases = Object.fromEntries(Object.entries(aliasRaw).map(([k, v]) => [normalize(k), v]));
  function findRegion(place) {
    if (place.region && Object.prototype.hasOwnProperty.call(regions,place.region)) return place.region;
    if (place.maakunta && Object.prototype.hasOwnProperty.call(regions,place.maakunta)) return place.maakunta;
    const city = normalize(place.city);
    let known = regionByCity.get(city);
    if (known) return known;
    let aliased = aliases[city];
    if (aliased) return regionByCity.get(normalize(aliased)) || '';
    for (const candidate of city.split(/\s*[,/·–]\s*/)) {
      known = regionByCity.get(candidate);
      if (known) return known;
      aliased = aliases[candidate];
      if (aliased) return regionByCity.get(normalize(aliased)) || '';
    }
    return '';
  }
  const natureNameTerms = /kansallispuist|luontopol|luontokoh|retki|ulkoilu|tuntur|vesiputou|koski|rotko|nakoal|nakotor|jarv|ranta|saari|harju|luola|pitkos|mets|suo\b|luonto|ulkoilureit|vaellus|kivipuist/;
  const natureDescriptionTerms = /kansallispuist|luontopol|luontokoh|luonnonsuojelualu|retkeilyreit|vaellusreit|nakoalapaik|nakoalatorn|vesiputou|pitkospuu/;
  const indexed = places.map(p => ({...p, _region263: findRegion(p),
    _nature298: p.type === 'sight' && (natureNameTerms.test(normalize(p.name)) || natureDescriptionTerms.test(normalize(p.description)))
  }));
  const cities = [...new Set(indexed.map(p => p.city).filter(Boolean))].sort(localeSort);
  Object.keys(regions).sort(localeSort).forEach(name => {
    const option = document.createElement('option');
    option.value = option.textContent = name;
    regionSelect.append(option);
  });
  function fillCities() {
    const prior = citySelect.value;
    citySelect.replaceChildren();
    const all = document.createElement('option');
    all.value = '';
    all.textContent = regionSelect.value ? 'Kaikki maakunnan paikkakunnat' : 'Kaikki paikkakunnat';
    citySelect.append(all);
    const available = cities.filter(c => !regionSelect.value || indexed.some(p => p.city === c && p._region263 === regionSelect.value));
    available.forEach(name => {
      const option = document.createElement('option');
      option.value = option.textContent = name;
      citySelect.append(option);
    });
    citySelect.value = available.includes(prior) ? prior : '';
  }
  const params = new URLSearchParams(location.search);
  const wantedCity = params.get('kunta');
  let wantedRegion = params.get('maakunta') || '';
  if (wantedCity && cities.includes(wantedCity)) {
    const example = indexed.find(p => p.city === wantedCity);
    wantedRegion = example?._region263 || wantedRegion;
  }
  if (wantedRegion && Object.prototype.hasOwnProperty.call(regions,wantedRegion)) regionSelect.value = wantedRegion;
  fillCities();
  if (wantedCity && cities.includes(wantedCity)) citySelect.value = wantedCity;
  const allowedCategories = new Set(['all', 'sight', 'nature', 'stop']);
  let category = allowedCategories.has(params.get('tyyppi')) ? params.get('tyyppi') : 'all';
  let visibleCount = 8;
  input.value = params.get('haku') || '';

  function saveSelection() {
    const url = new URL(location.href);
    for (const [name, value] of [
      ['maakunta', regionSelect.value], ['kunta', citySelect.value],
      ['tyyppi', category === 'all' ? '' : category], ['haku', input.value.trim()]
    ]) {
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    }
    history.replaceState(null, '', url);
  }
  function setCategory(next, save=true) {
    category = next;
    for (const button of categoryButtons) {
      const active = button.dataset.category === category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    visibleCount = 8;
    if (save) saveSelection();
    render();
  }
  function relevant(p) {
    if (category === 'sight' && p.type !== 'sight') return false;
    if (category === 'nature' && !p._nature298) return false;
    if (category === 'stop' && p.type !== 'stop') return false;
    return true;
  }
  function createCard(p) {
    const card = document.createElement('a');
    card.className = 'place ms298-place';
    card.href = p.url;
    const title = document.createElement('strong'); title.textContent = p.name || 'Käyntikohde';
    const meta = document.createElement('small');
    const kind = p.type === 'stop' ? 'Taukopaikka' : (p._nature298 ? 'Luonto ja retket' : 'Nähtävyys');
    meta.textContent = [p.city, kind].filter(Boolean).join(' · ');
    const description = document.createElement('p'); description.textContent = p.description || '';
    const action = document.createElement('span'); action.className = 'ms298-card-action'; action.textContent = 'Tutustu kohteeseen →';
    card.append(title, meta, description, action);
    return card;
  }
  function render() {
    const query = normalize(input.value.trim());
    const region = regionSelect.value;
    const town = citySelect.value;
    const matching = indexed.filter(p =>
      relevant(p) &&
      (!region || p._region263 === region) &&
      (!town || p.city === town) &&
      normalize([p.name,p.city,p.address,p.description].join(' ')).includes(query)
    ).sort((a,b) => localeSort(a.city || '', b.city || '') || localeSort(a.name || '', b.name || ''));
    const scope = town || region || 'Koko Suomi';
    count.textContent = scope + ' · ' + matching.length + ' kohdetta';
    if (matching.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'ms298-empty';
      const heading = document.createElement('strong'); heading.textContent = 'Tällä haulla ei löytynyt kohteita.';
      const hint = document.createElement('p'); hint.textContent = 'Kokeile toista hakusanaa tai tyhjennä rajaukset.';
      empty.append(heading, hint);
      results.replaceChildren(empty);
    } else {
      results.replaceChildren(...matching.slice(0, visibleCount).map(createCard));
    }
    const remaining = matching.length - visibleCount;
    moreButton.hidden = remaining <= 0;
    if (remaining > 0) moreButton.textContent = 'Näytä lisää (' + Math.min(12, remaining) + ' seuraavaa) ↓';
  }
  categoryButtons.forEach(button => button.addEventListener('click', () => setCategory(button.dataset.category)));
  regionSelect.addEventListener('change', () => {
    citySelect.value = ''; fillCities(); visibleCount = 8; saveSelection(); render();
  });
  citySelect.addEventListener('change', () => { visibleCount = 8; saveSelection(); render(); });
  input.addEventListener('input', () => { visibleCount = 8; saveSelection(); render(); });
  resetButton.addEventListener('click', () => {
    regionSelect.value = ''; citySelect.value = ''; fillCities(); input.value = '';
    setCategory('all', false); saveSelection(); input.focus();
  });
  moreButton.addEventListener('click', () => { visibleCount += 12; render(); });
  setCategory(category, false);
})();
