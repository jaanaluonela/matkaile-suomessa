/* Matkaile Suomessa v293 – SFC-alueiden näkyvyyden ja maakuntarajauksen korjaus.
 * Soveltuu vanhan valikot-v200.js:n rinnalle. Ei muuta muita tiedostoja.
 * Ladataan SFC v292 -tietojen jälkeen ja ennen valikot-v200.js:ää.
 */
(() => {
  'use strict';
  const sites = Array.isArray(window.msSfcAreasV292) ? window.msSfcAreasV292 : [];
  const places = Array.isArray(window.caravanPlaces) ? window.caravanPlaces : [];
  const normal = x => String(x ?? '').toLocaleLowerCase('fi').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const map = window.municipalityRegions || (window.municipalityRegions = {});

  // Vanha lista suodattaa maakunnat mapping[place.city]-kentällä, ei
  // kohteen omalla region-kentällä. Kaikki uudet kunnat eivät ole mappingissa.
  for (const p of places) {
    if (p && p.city && p.region && !map[p.city]) map[p.city] = p.region;
  }
  for (const s of sites) {
    if (s.city && s.region) map[s.city] = s.region;
  }

  const esc = x => String(x ?? '').replace(/[&<>"']/g, c =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function siteMatch(place, site) {
    if (!place || place.type !== 'camping' || normal(place.city) !== normal(site.city)) return false;
    const name = normal(place.name), official = normal(site.name);
    const street = s => normal(String(s || '').split(',')[0]);
    return (name.includes(official) || official.includes(name) ||
      (street(place.address).length > 9 && street(place.address) === street(site.address)));
  }
  function matchesCard(card, site) {
    const name = normal(card.querySelector('h2')?.textContent);
    const official = normal(site.name);
    const address = normal(card.querySelector('.address')?.textContent);
    return name && (name.includes(official) || official.includes(name)) &&
      address.includes(normal(site.city));
  }
  function markup(p) {
    const season = p.season || 'Tarkista aukiolo ennen saapumista';
    const buttons = [
      `<a class="btn" href="${esc(p.url || '')}">Kohteen tiedot →</a>`,
      p.website ? `<a class="btn secondary" href="${esc(p.website)}" target="_blank" rel="noopener">Omat sivut ↗</a>` : '',
      `<a class="btn secondary" href="https://www.google.com/maps/search/?api=1&amp;query=${encodeURIComponent((p.address || '') + ' ' + (p.city || ''))}" target="_blank" rel="noopener">Ajo-ohje ↗</a>`
    ].filter(Boolean).join('');
    return `<article class="stay"><span class="badge">${esc(season)}</span>`+
      `<h2>${esc(p.name)}</h2><p class="address">${esc(p.city)} · ${esc(p.address)}</p>`+
      `<p class="description">${esc(p.description || '')}</p>`+
      `<div class="buttons">${buttons}</div></article>`;
  }

  // Turvaverkko: jos vanha listasovellus rajaa paikan virheellisesti pois,
  // lisätään vain puuttuva SFC-kortti, ei piirretä koko sivua uudelleen.
  function repair() {
    if (document.body.dataset.kind !== 'camping') return;
    const box = document.getElementById('municipality-results');
    const area = document.getElementById('region')?.value || '';
    const town = document.getElementById('municipality')?.value || '';
    const select = document.getElementById('municipality');
    if (!box) return;

    // Kuntavalintaa voi käyttää myös SFC-kunnille, joilta oma kuntasivu puuttuu.
    if (select && area) {
      for (const s of sites) {
        if (normal(s.region) !== normal(area)) continue;
        if ([...select.options].some(o => normal(o.value) === normal(s.city))) continue;
        const option = document.createElement('option');
        option.value = s.city;
        option.textContent = s.city;
        select.append(option);
      }
    }
    let added = 0;
    for (const s of sites) {
      if (area && normal(s.region) !== normal(area)) continue;
      if (town && normal(s.city) !== normal(town)) continue;
      if ([...box.querySelectorAll('.stay')].some(card => matchesCard(card,s))) continue;
      const p = places.find(p => siteMatch(p,s)) || s;
      // Älä tee tuplaa toisella nimellä samalle osoitteelle.
      const street = normal(String(s.address || '').split(',')[0]);
      if (street.length > 9 && [...box.querySelectorAll('.stay')].some(card =>
        normal(card.querySelector('.address')?.textContent).includes(street))) continue;
      box.insertAdjacentHTML('beforeend', markup(p));
      added++;
    }
    if (added) {
      // Vanhat suodattimet kuuntelevat .stay-solmujen lisäyksiä ja
      // päivittävät SFC-, palvelu-, aukiolo- sekä hakurajaukset automaattisesti.
      document.getElementById('list-status')?.setAttribute('data-ms293-repaired', String(added));
    }
    if (!sites.length && document.getElementById('camp-only-sfc')?.checked) {
      const status = document.getElementById('list-status');
      if (status) status.textContent = 'SFC-alueiden tiedostoa ei ladattu. Tarkista sfc-alueet-v292.js GitHubista.';
    }
  }
  const ready = () => {
    if (document.body.dataset.kind !== 'camping') return;
    for (const id of ['region','municipality']) {
      document.getElementById(id)?.addEventListener('change', () => queueMicrotask(repair));
    }
    repair();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();
