/* Matkailu Suomessa v263 – avoinna ympäri vuoden / kausittain / tuntematon.
   Aukiolo merkitään ympärivuotiseksi VAIN vahvistetun, kohdekohtaisen tiedon perusteella.
   Tietorakenne tulevia täydennyksiä varten:
   window.campingOpeningData = { 'kohteen-id': {status:'yearround'|'seasonal'|'unknown', season:'...', checked:'VVVV-KK-PP'} };
   Saman voi tallentaa window.caravanPlaces-kohteeseen kentillä openingStatus, season ja checked.
*/
(() => {
  'use strict';
  const ready = callback => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', callback, {once:true}) : callback();
    const hasYearRoundText = text => /(?:ymp[äa]ri\s+vuoden|ymp[äa]rivuotinen|avoinna\s+365\s+p[äa]iv[äa][äa]?)/i.test(text);
  // Tulkitaan nimenomaan vanha kausikenttä, ei vapaata kuvaustekstiä:
  // kuvauksessa ympärivuotinen mökki ei kerro leirintäalueen aukiolosta.
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
  ready(() => {
    if (document.body.dataset.kind !== 'camping') return;
    const checkbox = document.getElementById('camp-only-year-round');
    const input = document.getElementById('v243-stay-search');
    const box = document.getElementById('municipality-results');
    const status = document.getElementById('list-status');
    if (!checkbox || !box) return;
    // Päivitetty tietovarasto voidaan laajentaa ilman muita sivumuutoksia.
    const places = () => window.caravanPlaces || [];
    function placeForCard(card) {
      const href = card.querySelector('.buttons a[href]')?.getAttribute('href') || '';
      return places().find(p => p && p.type === 'camping' && p.url === href) ||
        places().find(p => p && p.type === 'camping' && p.name === card.querySelector('h2')?.textContent);
    }
    const searchable = value => String(value ?? '').toLocaleLowerCase('fi')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const apply = () => {
      const cards = [...box.querySelectorAll('.stay')];
      const q = searchable(input?.value);
      let visible = 0;
      for (const card of cards) {
        const place = placeForCard(card) || {};
        const aukiolo = opening(place);
        card.dataset.openingStatus = aukiolo.status;
        let badge = card.querySelector('.badge, .camp-opening-badge');
        if (!badge) {badge = document.createElement('span');card.prepend(badge);}
        badge.className = 'camp-opening-badge camp-opening-badge--'+aukiolo.status;
        badge.textContent = aukiolo.label;
        const searchableText = searchable(card.textContent + ' '+(place.name || '')+' '+(place.city||''));
        const matchesSearch = !q || searchableText.includes(q);
        const matchesOpen = !checkbox.checked || aukiolo.status === 'yearround';
        const show = matchesSearch && matchesOpen;
        card.hidden = !show;
        card.style.display = show ? '' : 'none';
        if(show) visible++;
      }
      let empty = document.getElementById('camp-opening-empty');
      const baseEmpty = box.querySelector('.empty');
      if (baseEmpty) baseEmpty.hidden = checkbox.checked && cards.length === 0;
      if (visible === 0 && (checkbox.checked || (q && cards.length))) {
        if (!empty) {empty=document.createElement('p');empty.id='camp-opening-empty';box.append(empty);}
        empty.textContent=checkbox.checked
          ? 'Tällä rajauksella ei löytynyt vahvistetusti ympäri vuoden avoinna olevia leirintäalueita. Kokeile poistaa rasti tai valitse toinen maakunta.'
          : 'Hakusanalla ei löytynyt leirintäalueita.';
        empty.hidden=false;
      } else if(empty) empty.hidden=true;
      if(status && (checkbox.checked || q)) {
        status.textContent=(checkbox.checked?'Ympäri vuoden avoinna: ':'Hakutuloksia: ')+visible+' kohdetta';
      } else if(status && cards.length) {
        // Ei ylikirjoiteta vanhan listauksen omaa otsikkoa ilman aktiivista rajausta.
        const city=document.getElementById('municipality')?.value;
        const region=document.getElementById('region')?.value;
        status.textContent=(city || region || 'Koko Suomi')+' · '+cards.length+' kohdetta';
      }
    };
    checkbox.addEventListener('change', apply);
    input?.addEventListener('input', apply);
    // Vanha valikko piirtää kohdekortit uusiksi maakuntaa tai kuntaa vaihdettaessa.
    // Kuunnellaan DOM-muutosta, jotta aukiolomerkinnät ja rasti pysyvät mukana.
    const observer = new MutationObserver(mutations => {
      if (mutations.some(m => m.type === 'childList' &&
          [...m.addedNodes, ...m.removedNodes].some(n =>
            n.nodeType === 1 && (n.classList?.contains('stay') || n.classList?.contains('empty') || n.querySelector?.('.stay'))))) {
        apply();
      }
    });
    observer.observe(box,{childList:true});
    // Toimii myös silloin, kun valikko ei muutu (vain valitut suodattimet).
    document.getElementById('region')?.addEventListener('change',apply);
    document.getElementById('municipality')?.addEventListener('change',apply);
    apply();
  });
})();
