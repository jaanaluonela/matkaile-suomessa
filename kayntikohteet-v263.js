/* Matkailu Suomessa v263: Näe ja koe – maakunta, paikkakunta ja vapaa haku. */
(() => {
  'use strict';
  const originalExtra = {
    name:'Pyynikin munkkikahvila ja näkötorni',
    city:'Tampere',
    address:'Näkötornintie 20, Tampere',
    description:'Munkki- ja kahvitauko Pyynikin näkötornin juurella sekä järvimaisemia tornista.',
    type:'stop', url:'tampere-pyynikin-munkkikahvila.html'
  };
  const regionSelect = document.getElementById('region');
  const citySelect = document.getElementById('city');
  const input = document.getElementById('query');
  const results = document.getElementById('results');
  const count = document.getElementById('count');
  if (!regionSelect || !citySelect || !input || !results || !count) return;

  // Sama lähdeaineisto ja sama linkkien suodatus kuin v223-versiossa.
  const seen = new Set();
  const places = [
    ...(window.nearbyData || []),
    ...(window.visitHighlights || []),
    originalExtra
  ].filter(p => {
    if (!p || !['sight','stop'].includes(p.type) || !p.url) return false;
    const key = p.city + '|' + p.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const normalize = value => String(value || '').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const localeSort = (a,b) => a.localeCompare(b, 'fi');
  const regions = window.msFinlandRegions2026 || {};
  const regionByCity = new Map();
  Object.entries(regions).forEach(([region, cities]) => {
    cities.forEach(city => regionByCity.set(normalize(city), region));
  });
  const aliases = {
    'vääksy':'Asikkala',
    'levi':'Kittilä',
    'ylläs':'Kolari',
    'äkäslompolo':'Kolari',
    'vuokatti':'Sotkamo',
    'ruka':'Kuusamo',
    'hossa':'Suomussalmi',
    'ämmänsaari':'Suomussalmi',
    'fiskars':'Raasepori',
    'tammisaari':'Raasepori',
    'saariselkä':'Inari',
    'pyynikki':'Tampere',
    'repovesi':'Kouvola',
    'ukko-halla':'Hyrynsalmi',
    'paljakka':'Puolanka'
  };
  function findRegion(place) {
    if (place.region && Object.keys(regions).includes(place.region)) return place.region;
    if (place.maakunta && Object.keys(regions).includes(place.maakunta)) return place.maakunta;
    let city = normalize(place.city);
    let known = regionByCity.get(city);
    if (known) return known;
    let aliased = aliases[city];
    if (aliased) return regionByCity.get(normalize(aliased)) || '';
    // Tuki aineiston kaupunkikentän lisämääreille, kuten "Asikkala / Vääksy".
    for (const candidate of city.split(/\s*[,/·–]\s*/)) {
      known = regionByCity.get(candidate);
      if (known) return known;
      aliased = aliases[candidate];
      if (aliased) return regionByCity.get(normalize(aliased)) || '';
    }
    return '';
  }
  const indexed = places.map(place => ({ ...place, _region263:findRegion(place) }));
  const cities = [...new Set(indexed.map(p => p.city).filter(Boolean))].sort(localeSort);
  Object.keys(regions).sort(localeSort).forEach(name => {
    const option = document.createElement('option');
    option.value = option.textContent = name;
    regionSelect.append(option);
  });
  function fillCities() {
    const prior = citySelect.value;
    citySelect.replaceChildren();
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = regionSelect.value ? 'Koko maakunta' : 'Kaikki paikkakunnat';
    citySelect.append(allOption);
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
  if (wantedRegion && Object.keys(regions).includes(wantedRegion)) regionSelect.value = wantedRegion;
  fillCities();
  if (wantedCity && cities.includes(wantedCity)) citySelect.value = wantedCity;

  function render() {
    const search = normalize(input.value.trim());
    const region = regionSelect.value;
    const town = citySelect.value;
    const matching = indexed.filter(p =>
      (!region || p._region263 === region) &&
      (!town || p.city === town) &&
      normalize([p.name,p.city,p.address,p.description].join(' ')).includes(search)
    ).sort((a,b) => localeSort(a.city||'', b.city||'') || localeSort(a.name||'',b.name||''));
    count.textContent = (town || region || 'Koko Suomi') + ' · ' + matching.length + ' käyntikohdetta';
    const elements = matching.map(p => {
      const card = document.createElement('a');
      card.className = 'place';
      card.href = p.url;
      const title = document.createElement('strong');title.textContent = p.name || 'Käyntikohde';
      const meta = document.createElement('small');
      meta.textContent = (p.city||'') + ' · ' + (p.type === 'stop'?'Pysähdy matkalla':'Nähtävyys tai retkikohde');
      const description = document.createElement('p');description.textContent = p.description || '';
      const action = document.createElement('span');action.textContent = 'Tutustu →';
      card.append(title,meta,description,action);
      return card;
    });
    if (!elements.length) {
      const message = document.createElement('p');
      message.textContent = 'Kohteita ei löytynyt. Kokeile toista hakusanaa tai valitse koko Suomi.';
      elements.push(message);
    }
    results.replaceChildren(...elements);
  }
  function saveSelection() {
    const url = new URL(location.href);
    if (regionSelect.value) url.searchParams.set('maakunta',regionSelect.value);
    else url.searchParams.delete('maakunta');
    if (citySelect.value) url.searchParams.set('kunta',citySelect.value);
    else url.searchParams.delete('kunta');
    history.replaceState(null,'',url);
  }
  regionSelect.addEventListener('change', () => {
    citySelect.value = '';
    fillCities();
    saveSelection();
    render();
  });
  citySelect.addEventListener('change', () => {saveSelection(); render();});
  input.addEventListener('input', render);
  render();
})();
