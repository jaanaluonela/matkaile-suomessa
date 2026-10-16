/* Matkaile Suomessa v332 — yhteinen kuntanäkymä, ei korvaa kuntakohtaista sisältöä. */
(() => {
  'use strict';
  const asset = [...document.querySelectorAll('script[data-ms332-town]')].at(-1);
  if (!asset) return;
  const town = asset.dataset.ms332Town || '';
  const region = asset.dataset.ms332Region || '';
  const regionHref = asset.dataset.ms332RegionHref || 'maakunnat.html';
  const title = s => String(s || '').replace(/\s+/g, ' ').trim();
  const lower = s => title(s).toLocaleLowerCase('fi-FI');
  const create = (tag, cls, str) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (str !== undefined) el.textContent = str;
    return el;
  };
  const categories = [
    {name:'Näe ja koe', emoji:'⭐', test:/näe|nähtä|koe|kohte|elämys|kulttuuri|nähtäv|tekemi|histori/i, possible:['helmet','kohteet','nae-ja-koe','nahtavyydet']},
    {name:'Yöpyminen', emoji:'🚐', test:/yöp|majoit|karava|leirint|matkapark|camping/i, possible:['yopyminen','majoitus','caravan','lap281-caravan']},
    {name:'Retket', emoji:'🌲', test:/retke|retket|luonto|ulkoil|reit|vaell|mets/i, possible:['retket','luonto','nature','lap281-more']},
    {name:'Herkut', emoji:'☕', test:/herku|ruok|ravint|kahvil|palvel|pysähdy|pysahdy/i, possible:['ruoka','herkut','palvelut','suunnittelu']},
  ];
  function heading(root) { return root.querySelector('h1'); }
  function leadText(root, original) {
    const scope = original.closest('header') || root;
    let lead = scope.querySelector('.lead,.lap281-lead,.ou329-hero p,.ph-lead');
    if (!lead) lead = original.nextElementSibling?.matches('p') ? original.nextElementSibling : null;
    if (!lead) lead = root.querySelector('.intro-card > p,.municipality-intro > p');
    let value = title(lead?.textContent);
    if (!value) value = 'Tutustu paikkakunnan nähtävyyksiin, retkiin ja matkailupalveluihin.';
    if (value.length > 235) {
      const short = value.slice(0, 235);
      const end = Math.max(short.lastIndexOf('. ')+1, short.lastIndexOf('; ')+1);
      value = end > 60 ? short.slice(0,end) : short.trimEnd()+'…';
    }
    if (lead && (lead.closest('header') || lead.matches('.lead,.lap281-lead'))) lead.classList.add('ms332-old-lead');
    return value;
  }
  function facts(root) {
    const existing = root.querySelector('.facts,.municipality-facts,.kuntafaktat,.kainuu-facts,.ms209-facts');
    const populationNode = existing && [...existing.querySelectorAll('strong,b')].find(el=>/asukasluku/i.test(el.textContent));
    const source = populationNode?.textContent || existing?.textContent || root.querySelector('.intro-card')?.textContent || '';
    const regex = /asukasluku\s*:?\s*(\d{1,3}(?:[ \u00a0]\d{3})*|\d+)/i;
    const exact = title(source).match(regex);
    const approx = !exact ? title(source).match(/noin\s+([\d][\d\s\u00a0.]*\d|\d+)\s+asukkaan/i) : null;
    const raw = exact?.[1] || approx?.[1] || '';
    const count = raw ? raw.replace(/\s/g,' ').replace(/\./g,' ').trim() : '';
    const date = title(existing?.textContent).match(/(31\.12\.20\d{2}|1\.1\.20\d{2})/)?.[1] || '';
    let photo = existing?.querySelector('img[alt*="vaakuna" i],img.coat') || root.querySelector('img[alt*="vaakuna" i], img.coat');
    const aside = create('aside', 'ms332-factcard');
    aside.setAttribute('aria-label',`${town} – perustiedot`);
    const herald = create('div','ms332-coat');
    if (photo?.getAttribute('src')) {
      const img = create('img');
      img.alt = `${town} – vaakuna`;
      img.src = photo.getAttribute('src');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => {img.remove();herald.append(create('span','ms332-coat-empty','🛡️'));}, {once:true});
      herald.append(img);
    } else {
      herald.append(create('span','ms332-coat-empty','🛡️'));
    }
    const content = create('div','ms332-factbody');
    const population = create('strong','ms332-population',count ? `Asukasluku: ${approx ? 'noin ' : ''}${count}` : 'Asukasluku: tietoa täydennetään');
    content.append(population);
    const meta = create('p','ms332-fact-meta');
    const link = existing && [...existing.querySelectorAll('a[href]')].find(a=>/tilasto|väest|asukas|kuntavaesto/i.test(title(a.textContent+' '+a.href)));
    if (date) meta.append(document.createTextNode(date + ' · '));
    else if (approx) meta.append(document.createTextNode('Arvio · '));
    if (link) {
      const a = create('a','',title(link.textContent) || 'Väestötilasto ↗');
      a.href = link.href;
      if (link.target === '_blank') {a.target='_blank'; a.rel='noopener noreferrer';}
      meta.append(a);
    } else if (count && !date) {
      meta.append(document.createTextNode('Tarkista ajantasainen väkiluku kunnan tiedoista'));
    } else if (!count) {
      meta.append(document.createTextNode('Tietoa ei vielä vahvistettu tällä sivulla'));
    }
    content.append(meta);
    const details = create('p','ms332-region-detail',region);
    const rest = existing && [...existing.querySelectorAll('p')].map(p=>title(p.textContent)).filter(s =>
       s && !/asukasluku|31\.12|1\.1\.20|väkiluku|tilastokeskus|väestötied/i.test(s) && s.length < 155
    );
    if (rest?.length) details.textContent = `${region} · ${rest[0].replace(new RegExp('^'+region+'\\s*[·–-]?\\s*','i'),'')}`.replace(/·\s*·/g,'·').replace(/·\s*$/,'');
    content.append(details); aside.append(herald,content);
    if (existing) existing.classList.add('ms332-old-facts');
    return aside;
  }
  function closestSection(root, cat) {
    for (const id of cat.possible) {
      const found = root.querySelector(`[id="${id}"]`);
      if (found) return found;
    }
    for (const el of root.querySelectorAll('details[id],section[id],div[id]')) {
      if (el.closest('.ms332-top')) continue;
      const label = title(el.querySelector(':scope > summary,:scope > h2,:scope > h3')?.textContent);
      if (label && cat.test.test(label)) return el;
    }
    return null;
  }
  function makeNav(root) {
    const oldMenus = [...root.querySelectorAll('.quick,.navtiles,.qnav,.lap281-menu')];
    const nav = create('nav','ms332-quick'); nav.setAttribute('aria-label','Paikkakunnan sisältö');
    const previous = oldMenus.flatMap(el=>[...el.querySelectorAll('a[href]')]);
    categories.forEach((cat, i)=>{
      let anchor = previous.find(a=>cat.test.test(title(a.textContent)) && (
        !a.getAttribute('href')?.startsWith('#') || document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)))
      ));
      let href = anchor?.getAttribute('href');
      if (!href) {
        const section = closestSection(root,cat);
        if (section) {
          if (!section.id) section.id=`ms332-content-${i}`;
          href='#'+section.id;
        }
      }
      if (!href) {
        const section = create('section','ms332-pending');
        section.id='ms332-content-'+i;
        section.append(create('h2','',cat.name),create('p','',`Tämän paikkakunnan ${cat.name.toLocaleLowerCase('fi-FI')}-tietoja täydennetään.`));
        if (i===1 || i===3) {
          const link = create('a','', i===1 ? 'Katso majoitusvaihtoehdot →' : 'Katso pysähdyspaikat →');
          link.href= i===1 ? 'leirintaalueet.html' : 'pysahdy-matkalla.html';
          section.append(link);
        }
        root.append(section);
        href='#'+section.id;
      }
      const a=create('a','ms332-tile ms332-tile-'+(i+1));a.href=href;
      a.append(create('span','ms332-emoji',cat.emoji),create('span','',i===3 && /pysähdy/i.test(title(anchor?.textContent)) ? 'Pysähdy matkalla':cat.name));
      nav.append(a);
    });
    oldMenus.forEach(el=>el.classList.add('ms332-old-menu'));
    return nav;
  }
  function initialize() {
    if (document.body.classList.contains('ms332-town')) return;
    const h = document.querySelector('main h1,.app h1,body > h1');
    if (!h || lower(h.textContent) !== lower(town)) return;
    const root = h.closest('main') || h.closest('.app') || document.body;
    document.body.classList.add('ms332-town');root.classList.add('ms332-town-container');
    const summary = leadText(root,h);
    h.classList.add('ms332-old-h1');
    for (const a of root.querySelectorAll('a.back,a.top,a.toplink,a.lap281-back,a.ou329-back')) a.classList.add('ms332-old-back');
    const intro = create('section','ms332-top');
    const back=create('a','ms332-back',`‹ ${region}`);back.href=regionHref;
    const name=create('h1','ms332-title',town);
    const subtitle=create('p','ms332-lead',summary);
    intro.append(back,name,subtitle,facts(root),makeNav(root));
    root.prepend(intro);
    // Old heroes are left in the DOM, preserving any data/handlers and content below them.
    for (const hero of root.querySelectorAll('header.hero,header.ou329-hero')) {
      if (hero.contains(h)) hero.classList.add('ms332-old-hero');
    }
  }
  if (document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});
  else initialize();
})();
