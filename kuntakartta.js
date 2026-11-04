(() => {
  const maps = window.msMunicipalityMaps2026;
  const toggle = document.querySelector('#map-toggle');
  if (!maps || !toggle) return;
  const panel = toggle.querySelector('.map-content');
  const finland = panel.querySelector('#map-slot');
  const layout = panel.closest('.layout');
  const results = layout.querySelector('.results');
  const overview = document.createElement('div');
  overview.append(...panel.children);

  const region = document.createElement('section');
  region.className = 'ph-map';
  region.hidden = true;
  region.innerHTML = `
    <button type="button" class="ph-back">← Suomen kartta</button>
    <h2 tabindex="-1"></h2>
    <p>Valitse kunta kartalta tai listalta</p>
    <svg role="group"></svg>
    <div class="ph-town" hidden><h3 aria-live="polite"></h3><a class="ph-open"></a></div>
    <details class="ph-list"><summary>Kunnat listana</summary><ul></ul></details>
    <a class="ph-region-link">Avaa maakuntasivu →</a>
    <p class="map-note">Kuntarajat:
      <a href="https://stat.fi/fi/palvelut/tilastodatapalvelut/paikkatietoaineistot/tilastointialueet/kuntapohjaiset-tilastointialueet">Tilastokeskus 2026</a> ·
      <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. Yleistetty esitys.
    </p>`;
  panel.append(overview, region);

  const heading = region.querySelector('h2');
  const svg = region.querySelector('svg');
  const list = region.querySelector('.ph-list');
  const card = region.querySelector('.ph-town');
  const openTown = card.querySelector('a');
  let returnLink;
  let townLinks;

  function setRegionView(open) {
    overview.hidden = open;
    region.hidden = !open;
    results.hidden = open;
    layout.classList.toggle('ph-region-active', open);
  }

  function focusMap(element, section) {
    element.focus({ preventScroll: true });
    if (section === region) {
      const safeTop = parseFloat(getComputedStyle(region).scrollMarginTop) || 0;
      window.scrollTo({ top: window.scrollY + region.getBoundingClientRect().top - safeTop, behavior: 'instant' });
    } else {
      section.scrollIntoView({ block: 'start' });
    }
  }

  function render(name, href) {
    const [width, height, towns] = maps[name];
    heading.textContent = name;
    svg.setAttribute('aria-label', name + ' – kuntakartta');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    townLinks = new Map(towns.map(([town, page]) => [
      town, page || 'kuntakortti.html?kunta=' + encodeURIComponent(town)
    ]));
    // Draw all boundaries first so neighboring municipalities cannot cover a label.
    svg.innerHTML = towns.map(([town, , , , path]) =>
      `<a href="${townLinks.get(town)}" aria-label="${town}" data-town="${town}">
        <path d="${path}" fill-rule="evenodd"></path>
      </a>`).join('') + '<g class="ph-labels" aria-hidden="true"></g>';

    const labels = svg.querySelector('.ph-labels');
    const boxes = [];
    const displaced = [];
    const svgElement = name => document.createElementNS(svg.namespaceURI, name);
    function reserveLabel({ x, y, width: labelWidth, height: labelHeight }, dx = 0, dy = 0) {
      const box = [x + dx - 3, y + dy - 3, x + dx + labelWidth + 3, y + dy + labelHeight + 3];
      const fits = box[0] >= 0 && box[1] >= 0 && box[2] <= width && box[3] <= height;
      const overlaps = boxes.some(([left, top, right, bottom]) =>
        box[0] < right && box[2] > left && box[1] < bottom && box[3] > top);
      if (!fits || overlaps) return false;
      boxes.push(box);
      return true;
    }

    for (const [town, , x, y] of towns) {
      const label = svgElement('text');
      label.setAttribute('x', x);
      label.setAttribute('y', y);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('dominant-baseline', 'central');
      label.setAttribute('data-town', town);
      label.textContent = town;
      labels.append(label);
      const bounds = label.getBBox();
      if (!reserveLabel(bounds)) displaced.push({ label, bounds, x, y });
    }

    // Move crowded names a short distance and connect them to the original map position.
    const offsets = [[0, -24], [0, 24], [-30, 0], [30, 0], [-40, -24], [40, -24],
      [-40, 24], [40, 24], [0, -48], [0, 48], [-65, 0], [65, 0]];
    for (const { label, bounds, x, y } of displaced) {
      const offset = offsets.find(([dx, dy]) => reserveLabel(bounds, dx, dy));
      if (!offset) {
        label.remove();
        continue;
      }

      const [dx, dy] = offset;
      label.setAttribute('x', x + dx);
      label.setAttribute('y', y + dy);
      const line = svgElement('line');
      line.setAttribute('x1', x);
      line.setAttribute('y1', y);
      line.setAttribute('x2', x + dx);
      line.setAttribute('y2', y + dy);
      labels.prepend(line);
    }

    list.querySelector('ul').innerHTML = towns.map(([town]) =>
      `<li><button type="button" data-town="${town}">${town}</button></li>`).join('');
    list.open = false;
    card.hidden = true;
    region.querySelector('.ph-region-link').href = href;
  }

  function modified(event) {
    return event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;
  }

  finland.addEventListener('click', event => {
    const link = event.target.closest('[data-region]');
    if (!link || !maps[link.dataset.region] || modified(event)) return;
    event.preventDefault();
    returnLink = link;
    setRegionView(true);
    render(link.dataset.region, link.getAttribute('href'));
    focusMap(heading, region);
  });

  region.querySelector('.ph-back').addEventListener('click', () => {
    setRegionView(false);
    focusMap(returnLink, panel);
  });

  toggle.addEventListener('toggle', () => {
    if (!toggle.open && !region.hidden) setRegionView(false);
  });

  region.addEventListener('click', event => {
    const control = event.target.closest('[data-town]');
    if (!control || modified(event)) return;
    event.preventDefault();
    const name = control.dataset.town;
    for (const item of region.querySelectorAll('[data-town]')) {
      const selected = item.dataset.town === name;
      item.classList.toggle('is-selected', selected);
      if (selected) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    }
    card.querySelector('h3').textContent = name;
    openTown.href = townLinks.get(name);
    openTown.textContent = 'Avaa ' + name;
    card.hidden = false;
    card.scrollIntoView({ block: 'nearest' });
  });
})();
