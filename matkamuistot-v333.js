/* Matkaile Suomessa v333 – hillitty käyntimerkintä kunnan sivulle, Omat matkat -päiväkirjaan. */
(() => {
  'use strict';
  const script = document.currentScript;
  const TRIPS_KEY = 'ms_trips_v2';
  const ID_PREFIX = 'kohde-';
  const normalized = value => String(value || '').trim().toLocaleLowerCase('fi-FI');

  function readTrips() {
    const data = JSON.parse(localStorage.getItem(TRIPS_KEY) || '[]');
    if (!Array.isArray(data)) throw new Error('Matkalista ei ole taulukko');
    return data;
  }

  function initMunicipality() {
    const town = script?.dataset?.ms333Town;
    const slug = script?.dataset?.ms333Id;
    const diaryUrl = script?.dataset?.ms333DiaryUrl;
    if (!town || !slug || !diaryUrl || document.getElementById('ms333-visit')) return;
    const h1 = document.querySelector('.ms332-top h1, main h1, .app h1');
    if (!h1) return;

    const row = document.createElement('p');
    row.id = 'ms333-visit';
    row.className = 'ms333-visit';
    const link = document.createElement('a');
    link.className = 'ms333-visit-link';
    link.href = diaryUrl;
    const check = document.createElement('span');
    check.className = 'ms333-visit-icon';
    check.setAttribute('aria-hidden', 'true');
    const words = document.createElement('span');
    link.append(check, words);
    const message = document.createElement('span');
    message.className = 'ms333-visit-error';
    message.setAttribute('role', 'status');
    row.append(link, message);

    // Kuntien nykyisen v332-esittelyn yhteydessä perustietojen alapuolella, ei otsikossa.
    const fact = document.querySelector('.ms332-top .ms332-factcard');
    if (fact) fact.insertAdjacentElement('afterend', row);
    else {
      const facts = document.querySelector('main .facts,main .municipality-facts,main .kuntafaktat');
      const lead = document.querySelector('main .lead, main .intro, main .lead-text,main h1 + p');
      if (facts) facts.insertAdjacentElement('afterend', row);
      else if (lead) lead.insertAdjacentElement('afterend', row);
      else if (h1.parentElement) h1.insertAdjacentElement('afterend', row);
    }

    // Vanhoilla kuntasivuilla on iso, päällekkäinen Omat matkat -painikekortti.
    // Piilotetaan vain kortti, joka sisältää vanhan käyntipainikkeen.
    document.querySelectorAll('button[data-visited]').forEach(oldButton => {
      if (normalized(oldButton.dataset.visited) !== normalized(slug)) return;
      const section = oldButton.closest('section.card,article.card,section');
      if (section && [...section.querySelectorAll('h2,h3')].some(x => normalized(x.textContent) === 'omat matkat')) {
        section.hidden = true;
        section.classList.add('ms333-legacy-hidden');
      }
    });

    const id = ID_PREFIX + slug;
    function matchingTrip(trips) {
      return trips.find(t => t && (t.id === id || t.locationId === slug ||
        (t.sourceUrl === slug + '.html' && normalized(t.name) === normalized(town))));
    }
    function paint() {
      let visited = false;
      try {
        const current = matchingTrip(readTrips());
        visited = Boolean(current?.visited || localStorage.getItem('ms_visited_' + slug) === '1');
      } catch (error) { /* Painike on aina silti käytettävissä. */ }
      check.textContent = visited ? '✓' : '◯';
      words.textContent = visited ? 'Käyty · Näytä matkamuisto' : 'Olen käynyt täällä';
      link.setAttribute('aria-label', visited
        ? `Avaa paikkakunnan ${town} matkamuisto Omat matkat -sivulla`
        : `Merkitse ${town} käydyksi ja avaa Omat matkat`);
      link.classList.toggle('ms333-is-visited', visited);
      return visited;
    }
    paint();
    window.addEventListener('pageshow', paint);
    window.addEventListener('storage', paint);
    window.addEventListener('ms-trips-changed', paint);

    link.addEventListener('click', event => {
      event.preventDefault();
      message.textContent = '';
      try {
        // Haetaan uusin tila klikkaushetkellä, jotta muita matkamuistoja ei poisteta.
        const trips = readTrips();
        let trip = matchingTrip(trips);
        if (!trip) {
          trip = {
            id, locationId: slug, name: town, begin: '', end: '', diary: '',
            stops: [], rating: 0, visited: true, sourceUrl: slug + '.html'
          };
          trips.unshift(trip);
        } else {
          trip.visited = true;
          trip.locationId ||= slug;
          trip.sourceUrl ||= slug + '.html';
          if (!trip.name) trip.name = town;
          if (!Array.isArray(trip.stops)) trip.stops = [];
        }
        localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
        localStorage.setItem('ms_visited_' + slug, '1');
        window.dispatchEvent(new Event('ms-trips-changed'));
        const destination = new URL(diaryUrl, window.location.href);
        destination.searchParams.set('matkamuisto', trip.id);
        window.location.assign(destination.href);
      } catch (error) {
        console.warn('Käyntimerkintää ei voitu tallentaa:', error);
        message.textContent = 'Tallennus ei onnistunut. Tarkista selaimen tallennustila.';
      }
    });
  }

  function initDiary() {
    // Päiväkirja itse hallitsee päiväystä, kuvia, tähtiarviota ja muistoja.
    // Avataan juuri tallennettu kunta valmiiksi muokattavaksi.
    const selected = new URLSearchParams(window.location.search).get('matkamuisto');
    if (!selected || !/^(?:kohde-|kunta-)[a-z0-9_-]{1,100}$/.test(selected)) return;
    if (!document.getElementById('editor') || !document.getElementById('trips')) return;
    let matches = false;
    try { matches = readTrips().some(t => t?.id === selected); } catch (error) { return; }
    if (!matches) return;
    // paivakirja.html:n alkuperäinen funktio on nimeltään open(id), ja se luo
    // lomakkeen omilla kuva-/muisto-/päivämäärätoiminnoillaan.
    // Varmistetaan päiväkirjan omasta tietolistasta, että se on avattu ensin.
    try {
      if (typeof trips !== 'undefined' && Array.isArray(trips) &&
          trips.some(t => t?.id === selected) && typeof open === 'function') {
        open(selected);
        // Yhteystietoa ei jätetä osoiteriville seuraavia päivityksiä varten.
        window.history.replaceState(null, '', window.location.pathname + window.location.hash);
      }
    } catch (error) {
      console.warn('Matkamuiston avaaminen epäonnistui:', error);
    }
  }

  function init() {
    if (script?.dataset?.ms333Town) initMunicipality();
    else initDiary();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
