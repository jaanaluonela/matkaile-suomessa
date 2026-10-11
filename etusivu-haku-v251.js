/* Matkailu Suomessa v251: suora maakunta- ja kuntahaku.
   Käyttää sivuston olemassa olevaa kuntarekisteriä – ei arvaa puuttuvia kuntalinkkejä. */
(() => {
  'use strict';
  const start = () => {
    const region = document.getElementById('home-region-v251');
    const town = document.getElementById('home-town-v251');
    const open = document.getElementById('home-open-v251');
    const regionPage = document.getElementById('home-region-page-v251');
    const townLinks = document.getElementById('home-town-links-v251');
    if (!region || !town || !open || !regionPage || !townLinks) return;

    // Nämä maakunnat näytetään aina, vaikka maakunnan omaa sivua ei olisi vielä tehty.
    const regions = [
      'Ahvenanmaa','Etelä-Karjala','Etelä-Pohjanmaa','Etelä-Savo',
      'Kainuu','Kanta-Häme','Keski-Pohjanmaa','Keski-Suomi',
      'Kymenlaakso','Lappi','Pirkanmaa','Pohjanmaa',
      'Pohjois-Karjala','Pohjois-Pohjanmaa','Pohjois-Savo',
      'Päijät-Häme','Satakunta','Uusimaa','Varsinais-Suomi'
    ];
    // Vain maakunnat, joihin jo olemassa oleva opas käyttää suoraa linkkiä.
    const regionPages = {
      'Kainuu':'kainuu.html',
      'Kymenlaakso':'kymenlaakso.html',
      'Lappi':'lappi.html',
      'Päijät-Häme':'paijat-hame.html',
      'Uusimaa':'uusimaa.html'
    };
    const highlightsByRegion = {
      'Kymenlaakso': [['Repovesi', 'repovesi.html']],
      'Lappi': [['Levi', 'levi.html'], ['Ylläs', 'yllas.html']]
    };
    const fastRegionButtons = Array.from(document.querySelectorAll('[data-home-region-v251]'));
    const towns = window.siteMunicipalities || {};
    const townRegions = window.municipalityRegions || {};

    for (const name of regions) {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      region.append(option);
    }

    const update = () => {
      const name = region.value;
      const originalTown = town.value;
      town.replaceChildren();
      const first = document.createElement('option');
      first.value = '';
      first.textContent = name ? 'Valitse paikkakunta…' : 'Valitse ensin maakunta…';
      town.append(first);
      const items = Object.entries(towns)
        .filter(([city,url]) => townRegions[city] === name && typeof url === 'string' && /^((?!javascript:)[\w./#?=%-]+)$/.test(url))
        .sort(([a],[b]) => a.localeCompare(b,'fi'));
      for (const [city,url] of items) {
        const option = document.createElement('option');
        option.value = url;
        option.textContent = city;
        town.append(option);
      }
      town.disabled = !items.length;
      town.value = items.some(([,url]) => url === originalTown) ? originalTown : '';

      // Yksittäisten kuntasivujen pikavalinnat ovat myös kosketeltavia linkkejä.
      townLinks.replaceChildren();
      if (name) {
        const caption = document.createElement('p');
        caption.textContent = items.length
          ? 'Avaa suoraan oppaassa olevat paikkakunnat:'
          : 'Tämän maakunnan kuntasivut täydentyvät myöhemmin.';
        townLinks.append(caption);
        if (items.length) {
          const links = document.createElement('div');
          for (const [city,url] of items) {
            const a = document.createElement('a');
            a.textContent = city + ' ›';
            a.href = url;
            links.append(a);
          }
          townLinks.append(links);
        }
        const highlights = highlightsByRegion[name] || [];
        if (highlights.length) {
          const caption = document.createElement('p');
          caption.textContent = 'Myös nämä suoraan avattavat kohteet:';
          townLinks.append(caption);
          const links = document.createElement('div');
          for (const [label, url] of highlights) {
            const a = document.createElement('a');
            a.href = url;
            a.textContent = label + ' ›';
            links.append(a);
          }
          townLinks.append(links);
        }
      }

      // Maakuntasivun linkki näytetään vain tunnetuille, valmiille maakuntasivuille.
      regionPage.href = regionPages[name] || 'maakunnat.html';
      regionPage.firstChild.textContent = regionPages[name] ? 'Avaa ' + name + ' ' : 'Kaikki maakunnat ';
      open.hidden = !town.value;
      if (town.value) open.href = town.value;
      fastRegionButtons.forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.homeRegionV251 === name)));
    };
    region.addEventListener('change',update);
    town.addEventListener('change', () => {
      open.hidden = !town.value;
      if (town.value) open.href = town.value;
    });
    fastRegionButtons.forEach(btn => btn.addEventListener('click', () => {
      region.value = btn.dataset.homeRegionV251;
      update();
    }));
    update();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
