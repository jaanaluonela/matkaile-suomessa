/* Matkailu Suomessa v277 — Pysähdy matkalla: karavaanarin palvelut ja lasten kanssa. */
(() => {
  'use strict';
  const pageName = 'pysahdy-matkalla.html';

  function restoreHomeButton() {
    const menu = document.querySelector('body[data-home="true"] main .menu');
    if (!menu) return;
    let link = document.getElementById('travel-stop-v268');
    if (!link || !menu.contains(link)) {
      if (link) link.remove();
      link = document.createElement('a');
      link.id = 'travel-stop-v268';
      link.href = pageName;
      menu.append(link);
    }
    link.href = pageName;
    link.setAttribute('aria-label','Pysähdy matkalla – kahvilat, ravintolat ja kiinnostavat taukopaikat');
    link.innerHTML = '<span class="choice-icon" aria-hidden="true">🚗</span><span><strong>Pysähdy matkalla</strong><small>Hyvät kahvilat, ravintolat ja taukopaikat</small></span><span class="choice-arrow" aria-hidden="true">→</span>';
  }

  function initStops() {
    const root = document.querySelector('.stop-page-v268');
    if (!root) return;
    const town = document.getElementById('stop-town-v268');
    const query = document.getElementById('stop-query-v268');
    const result = document.getElementById('stop-results-v268');
    const count = document.getElementById('stop-count-v268');
    const categoryInfo = document.getElementById('stop-category-info-v276');
    const controls = [...document.querySelectorAll('[data-stop-category]')];
    if (!town || !query || !result || !count) return;
    const norm = value => String(value || '').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const safeLink = url => {
      const s = String(url || '').trim();
      return /^(https:\/\/|[a-z0-9_-]+\.html(?:[?#][^\s]*)?$)/i.test(s) ? s : '';
    };
    // Uudet kategoriat voivat esiintyä myös oppaan nähtävyysaineistossa.
    // Perusryhmät saavat edelleen vain varsinaiset pysähdyspaikat.
    function searchableText(p) {
      const extra = [p.category, p.categories, p.tags, p.features, p.services]
        .map(v => Array.isArray(v) ? v.join(' ') : (typeof v === 'string' ? v : ''));
      return norm([p.name,p.description,p.address,p.city,p.aliases,p.group,p.access,p.season,...(p.subtypes||[]),...extra].join(' '));
    }
    function classify(p) {
      const s = searchableText(p);
      const cafe = /kahvil|kahvi|munkki|leipomo|teehetk|vohveli|cafe|paviljonki/.test(s);
      const restaurant = /ravintol|ruokail|lounas|bistro|illallinen|keittio|ruokaa|ruokapysahd|panimoravintola/.test(s);
      const shop = /tilamyymal|myymala|puoti|kylakauppa|lahiruok|farmi|lifestyle|kauppa/.test(s);
      const caravan = p.group === 'caravan' || /vesipiste|vedenottopiste|veden taytt|kayttoved|juomavesi|harmaaves|harmaan veden|septitank|septikaiv|kemiallisen wc|wc.n tyhjenn|jatesailio|jatesailio|tyhjennyspaik|matkailuauton huolto|matkailuautoille|matkailuautojen pysakoint|iso pysakointialue|tilava pysakoint|caravan service|service point/.test(s);
      const kids = p.group === 'kids' || /leikkipuist|leikkikent|leikkialue|leikkipaik|kotielain|elaintila|elaintarha|perhepuist|perhepark|lasten kanssa|lapsille|lapsiperhe|koko perhee|seikkailupuist|puuhapuist|liikennepuist|satupuist|lastenpuist|lasten maailma/.test(s);
      return {cafe,restaurant,shop,caravan,kids,other: !cafe&&!restaurant&&!shop&&!caravan&&!kids};
    }
    // Päällekkäisistä aineistolähteistä yksi kortti / nimi / paikkakunta.
    const raw = [...(window.stopExtrasV277 || []), ...(window.visitHighlights || []), ...(window.nearbyData || [])]
      .filter(p => p && p.name && p.city && (p.type === 'stop' || classify(p).caravan || classify(p).kids));
    const seen = new Set();
    const items = raw.filter(p => {
      const key = norm(p.city) + '|' + norm(p.name);
      if (seen.has(key)) return false;
      seen.add(key);return true;
    }).sort((a,b) => a.city.localeCompare(b.city,'fi') || a.name.localeCompare(b.name,'fi'));
    const towns = [...new Set(items.map(p => p.city))].sort((a,b) => a.localeCompare(b,'fi'));
    towns.forEach(city => {
      const opt = document.createElement('option');opt.value=city;opt.textContent=city;town.append(opt);
    });
    const params = new URLSearchParams(location.search);
    if (towns.includes(params.get('kunta'))) town.value = params.get('kunta');
    if (params.get('haku')) query.value = params.get('haku');
    let selectedCategory = ['all','cafe','restaurant','shop','caravan','kids','other'].includes(params.get('ryhma')) ? params.get('ryhma') : 'all';
    let selectedSub = ['all','water','waste','parking','play','animals','break'].includes(params.get('tarkenne')) ? params.get('tarkenne') : 'all';
    function label(p) {
      const c=classify(p);
      return selectedCategory==='caravan' && c.caravan ? '🚐 Karavaanarin palvelu' : selectedCategory==='kids' && c.kids ? '🧸 Lasten kanssa' : c.cafe && c.restaurant ? '☕ Kahvila ja ravintola' : c.cafe ? '☕ Kahvila' : c.restaurant ? '🍽️ Ravintola' : c.shop ? '🛍️ Puoti tai lähiruoka' : c.caravan ? '🚐 Karavaanarin palvelu' : c.kids ? '🧸 Lasten kanssa' : '🚗 Pysähdyspaikka';
    }
    const make = (tag,klass,text) => {const el=document.createElement(tag);if(klass)el.className=klass;if(text)el.textContent=text;return el;};
    function navLink(label,href,external=false){const a=make('a','',label);a.href=href;if(external){a.target='_blank';a.rel='noopener noreferrer';}return a;}
    function card(p) {
      const article=make('article','stop-card');
      article.append(make('span','kind',label(p)),make('h4','',p.name));
      if (p.description) article.append(make('p','',p.description));
      if (p.address) article.append(make('address','',p.address));
      if (p.access) article.append(make('p','stop-access-v277','ℹ️ '+p.access));
      if (p.season) article.append(make('p','stop-season-v277','🕒 '+p.season));
      const links=make('div','card-links');
      if(safeLink(p.url))links.append(navLink('Tutustu →',p.url,/^https:/i.test(p.url)));
      const mapq=encodeURIComponent([p.name,p.address||p.city].join(' '));
      links.append(navLink('📍 Kartalle','https://www.google.com/maps/search/?api=1&query='+mapq,true));
      article.append(links);return article;
    }
    function mapSearch(label,keywords) {
      const place=town.value || 'Suomi';
      const url='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(keywords+' '+place);
      return navLink(label+' ↗',url,true);
    }
    function renderCategoryInfo() {
      if(!categoryInfo)return;
      categoryInfo.replaceChildren();
      const isCaravan=selectedCategory==='caravan';
      const isKids=selectedCategory==='kids';
      categoryInfo.hidden=!(isCaravan||isKids);
      if(!(isCaravan||isKids))return;
      categoryInfo.append(make('h2','',isCaravan?'🚐 Karavaanarin palvelut':'🧸 Lasten kanssa'));
      categoryInfo.append(make('p','',isCaravan
        ? 'Etsi puhtaan veden täyttöpisteitä, WC- ja harmaavesityhjennyksiä sekä matkailuautolle sopivia pysäköintipaikkoja.'
        : 'Etsi leikkipuistoja, kotieläinpihoja ja hauskoja taukopaikkoja lapsiperheille.'));
      const links=make('div','category-map-links-v276');
      if(isCaravan){
        links.append(mapSearch('Vesipisteet kartalla','matkailuauto vesipiste veden täyttö'));
        links.append(mapSearch('Tyhjennyspaikat kartalla','matkailuauto kemiallisen WC:n harmaavesityhjennys'));
        links.append(mapSearch('Isot pysäköintialueet kartalla','matkailuauton pysäköinti iso pysäköintialue'));
      }else{
        links.append(mapSearch('Leikkipuistot kartalla','leikkipuisto'));
        links.append(mapSearch('Kotieläinpihat kartalla','kotieläinpiha'));
        links.append(mapSearch('Lasten taukopaikat kartalla','lasten kanssa taukopaikka leikkipaikka'));
      }
      categoryInfo.append(links);
      const subtypeOptions=isCaravan ? [['all','Kaikki palvelut'],['water','💧 Vesipisteet'],['waste','🚽 Tyhjennyspaikat'],['parking','🚐 Matkailuajoneuvopaikat']] : [['all','Kaikki lasten kohteet'],['play','🛝 Leikkipuistot'],['animals','🐑 Kotieläinpihat'],['break','🧸 Taukopaikat']];
      const subnav=make('div','subfilters-v277');
      subnav.setAttribute('role','group');subnav.setAttribute('aria-label','Rajaa tarkemmin');
      subtypeOptions.forEach(([v,label])=>{const b=make('button','',label);b.type='button';b.setAttribute('aria-pressed',String(selectedSub===v));b.addEventListener('click',()=>{selectedSub=v;updateUrl();});subnav.append(b);});
      categoryInfo.append(subnav);
      categoryInfo.append(make('p','map-disclaimer-v276','Karttahaut avaavat Google Mapsin hakutulokset. Niiden palvelut ja aukiolo eivät ole sovelluksen tarkistamia.'));
    }
    function render() {
      renderCategoryInfo();
      const q=norm(query.value.trim());
      const matching=items.filter(p => (!town.value || p.city===town.value) && (!q || searchableText(p).includes(q)) && (selectedCategory==='all' ? p.type==='stop' : ((selectedCategory==='caravan'||selectedCategory==='kids'||p.type==='stop') && classify(p)[selectedCategory])) && ((selectedCategory!=='caravan'&&selectedCategory!=='kids') || selectedSub==='all' || (p.subtypes||[]).includes(selectedSub)));
      result.replaceChildren();
      let shown=0;
      const groups=new Map();
      matching.forEach(p=>{if(!groups.has(p.city))groups.set(p.city,[]);groups.get(p.city).push(p);});
      groups.forEach((entries,city)=>{
        const section=make('section','town-group');
        const heading=make('h3','',city);section.append(heading);
        const grid=make('div','cards');
        const groupCounts={restaurant:0,cafe:0,shop:0,caravan:0,kids:0,other:0};
        entries.forEach(p=>{
          const cls=classify(p);
          // Valitussa uudessa ryhmässä myös sellaiset kohteet näkyvät,
          // jotka tunnetaan oppaassa toisella kohdeluokalla.
          const group = selectedCategory==='caravan'||selectedCategory==='kids' ? selectedCategory
            : cls.restaurant ? 'restaurant' : cls.cafe ? 'cafe' : cls.shop ? 'shop'
            : cls.caravan ? 'caravan' : cls.kids ? 'kids' : 'other';
          if(groupCounts[group]>=5) return;
          groupCounts[group]++;
          grid.append(card(p));shown++;
        });
        section.append(grid);
        if(selectedCategory!=='caravan' && selectedCategory!=='kids') {
          const more=make('div','more-links');
          more.append(navLink('Kaikki ravintolat kartalla →','https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('ravintolat '+city),true));
          more.append(navLink('Kaikki kahvilat kartalla →','https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('kahvilat '+city),true));
          section.append(more);
        }
        result.append(section);
      });
      if (!matching.length) result.append(make('p','empty',selectedCategory==='caravan' || selectedCategory==='kids' ? 'Tässä ryhmässä ei ole vielä tallennettuja kohteita tällä rajauksella. Kokeile yllä olevia karttahakuja tai muuta paikkakuntaa.' : 'Tällä haulla ei löytynyt vielä oppaan pysähdyspaikkoja. Kokeile toista paikkakuntaa tai avaa Lähellä minua -haku.'));
      const summary=(town.value||'Koko Suomi')+' · '+shown+' pysähdyspaikkaa';
      count.textContent=summary+(matching.length>shown?' (osa rajattu paikkakunnittain)':'');
      controls.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.stopCategory===selectedCategory)));
    }
    function updateUrl(){
      const u=new URL(location.href);
      if(town.value)u.searchParams.set('kunta',town.value);else u.searchParams.delete('kunta');
      if(selectedCategory!=='all')u.searchParams.set('ryhma',selectedCategory);else u.searchParams.delete('ryhma');
      if(['caravan','kids'].includes(selectedCategory)&&selectedSub!=='all')u.searchParams.set('tarkenne',selectedSub);else u.searchParams.delete('tarkenne');
      if(query.value.trim())u.searchParams.set('haku',query.value.trim());else u.searchParams.delete('haku');
      history.replaceState(null,'',u);render();
    }
    town.addEventListener('change',updateUrl);
    query.addEventListener('input',updateUrl);
    controls.forEach(btn=>btn.addEventListener('click',()=>{selectedCategory=btn.dataset.stopCategory;selectedSub='all';updateUrl();}));
    render();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{restoreHomeButton();initStops();});
  else {restoreHomeButton();initStops();}
  window.addEventListener('pageshow',restoreHomeButton);
})();
