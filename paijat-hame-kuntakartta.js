(() => {
  const toggle = document.querySelector('#map-toggle');
  const panel = toggle.querySelector('.map-content');
  const layout = panel.closest('.layout');
  const results = layout.querySelector('.results');
  const finland = panel.querySelector('#map-slot');
  const regionLinks = finland.querySelectorAll('[data-region="Päijät-Häme"]');
  const overview = document.createElement('div');
  overview.append(...panel.children);
  panel.append(overview);

  // Simplified outlines based on the reference map. Adjacent shapes share vertices.
  const towns = [
    ['Padasjoki', 'padasjoki.html', 96, 127, '10,62 48,76 60,66 75,73 87,62 157,61 171,110 161,131 174,174 143,197 121,182 91,200 55,186 35,190 32,169 14,167 19,135 8,120 16,97'],
    ['Sysmä', 'sysma.html', 225, 70, '157,61 174,29 177,3 203,10 222,0 245,16 251,45 269,47 277,56 268,64 270,82 256,101 267,122 286,142 274,164 249,148 233,161 224,146 205,157 188,158 174,174 161,131 171,110'],
    ['Hartola', 'hartola.html', 316, 65, '245,16 257,-27 266,-16 276,-18 293,-4 304,-2 309,26 326,49 339,45 350,57 371,51 376,74 364,89 372,104 351,118 354,135 325,145 314,157 295,153 286,142 267,122 256,101 270,82 268,64 277,56 269,47 251,45'],
    ['Asikkala', 'asikkala.html', 168, 228, '91,200 121,182 143,197 174,174 188,158 205,157 224,146 233,161 249,148 274,164 260,179 247,180 248,195 228,194 223,220 241,230 230,247 239,261 229,282 209,289 192,278 173,273 156,278 146,265 123,270 107,253 104,230'],
    ['Heinola', 'heinola.html?v=20261031c', 303, 210, '274,164 286,142 295,153 314,157 325,145 354,135 367,153 359,169 382,177 392,200 413,207 416,222 390,229 382,248 357,256 340,276 317,276 303,262 290,272 277,287 267,300 249,292 229,282 239,261 230,247 241,230 223,220 228,194 248,195 247,180 260,179'],
    ['Hollola', 'hollola.html?v=20261031b', 116, 326, '123,270 146,265 156,278 173,273 192,278 209,289 199,299 177,306 166,323 175,348 159,360 168,377 149,390 137,383 124,400 112,387 101,364 91,352 77,359 66,378 48,369 45,351 34,347 41,329 64,322 73,309 94,307 101,285'],
    ['Kärkölä', 'karkola.html', 89, 395, '66,378 77,359 91,352 101,364 112,387 124,400 115,424 100,434 87,423 72,428 62,409 54,405 59,388'],
    ['Lahti', 'lahti.html', 220, 343, '209,289 229,282 249,292 267,300 277,287 290,272 299,295 288,313 294,338 281,353 274,376 249,382 236,371 218,381 200,376 188,387 168,377 159,360 175,348 166,323 177,306 199,299'],
    ['Iitti', 'iitti.html', 339, 372, '290,272 303,262 317,276 340,276 338,299 353,319 356,339 377,334 390,325 407,330 410,354 425,375 420,399 402,407 399,422 370,423 358,435 339,424 317,437 306,421 307,400 282,393 274,376 281,353 294,338 288,313 299,295'],
    ['Orimattila', 'orimattila.html', 218, 427, '124,400 137,383 149,390 168,377 188,387 200,376 218,381 236,371 249,382 274,376 282,393 307,400 306,421 317,437 316,463 299,462 282,480 255,470 241,484 222,478 205,485 190,470 165,466 150,447 136,441 115,424'],
  ];
  const region = document.createElement('section');
  region.className = 'ph-map';
  region.hidden = true;
  region.innerHTML = `
    <button type="button" class="ph-back">← Suomen kartta</button>
    <h2 tabindex="-1">Päijät-Häme</h2>
    <p>Valitse kunta kartalta</p>
    <svg viewBox="0 -34 433 526" role="group" aria-label="Päijät-Hämeen kuntakartta">
      ${towns.map(([name, href, x, y, points]) => `
        <a href="${href}" aria-label="${name}" data-town="${name}">
          <polygon points="${points}"></polygon>
          <text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central">${name}</text>
        </a>`).join('')}
    </svg>
    <div class="ph-town" hidden>
      <h3 aria-live="polite"></h3>
      <a class="ph-open"></a>
    </div>
    <details class="ph-list"><summary>Kunnat listana</summary><ul>
      ${[...towns].sort(([a], [b]) => a.localeCompare(b, 'fi')).map(([name]) =>
        `<li><button type="button" data-town="${name}">${name}</button></li>`).join('')}
    </ul></details>
    <a class="ph-region-link" href="paijat-hame.html">Avaa maakuntasivu →</a>
    <p class="map-note">Kuntarajat on piirretty suuntaa antavasti.</p>`;
  panel.append(region);

  const heading = region.querySelector('h2');
  const card = region.querySelector('.ph-town');
  const openTown = card.querySelector('a');
  let returnLink;

  function setRegionView(open) {
    overview.hidden = open;
    region.hidden = !open;
    results.hidden = open;
    layout.classList.toggle('ph-region-active', open);
  }

  function focusMap(element, section) {
    element.focus({ preventScroll: true });
    section.scrollIntoView({ block: 'start' });
  }

  for (const link of regionLinks) {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      returnLink = link;
      setRegionView(true);
      focusMap(heading, region);
    });
  }

  region.querySelector('.ph-back').addEventListener('click', () => {
    setRegionView(false);
    focusMap(returnLink, panel);
  });

  toggle.addEventListener('toggle', () => {
    if (!toggle.open && !region.hidden) setRegionView(false);
  });

  region.addEventListener('click', event => {
    const control = event.target.closest('[data-town]');
    if (!control || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const [name, href] = towns.find(([town]) => town === control.dataset.town);
    for (const item of region.querySelectorAll('[data-town]')) {
      const selected = item.dataset.town === name;
      item.classList.toggle('is-selected', selected);
      if (selected) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    }
    card.querySelector('h3').textContent = name;
    openTown.href = href;
    openTown.textContent = 'Avaa ' + name;
    card.hidden = false;
    card.scrollIntoView({ block: 'nearest' });
  });
})();
