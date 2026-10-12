/* Matkailu Suomessa v268 — palauttaa etusivun linkin ja käyttää oppaan olemassa olevaa kohdeluetteloa. */
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
    const controls = [...document.querySelectorAll('[data-stop-category]')];
    if (!town || !query || !result || !count) return;
    const norm = value => String(value || '').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    const safeLink = url => {
      const s = String(url || '').trim();
      return /^(https:\/\/|[a-z0-9_-]+\.html(?:[?#][^\s]*)?$)/i.test(s) ? s : '';
    };
    // Päällekkäisistä aineistolähteistä yksi kortti / nimi / paikkakunta.
    const raw = [...(window.visitHighlights || []), ...(window.nearbyData || [])]
      .filter(p => p && p.type === 'stop' && p.name && p.city);
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
    let selectedCategory = ['all','cafe','restaurant','shop','other'].includes(params.get('ryhma')) ? params.get('ryhma') : 'all';
    function classify(p) {
      const s=norm(p.name + ' ' + (p.description || ''));
      const cafe=/kahvil|kahvi|munkki|leipomo|teehetk|vohveli|cafe|paviljonki/.test(s);
      const restaurant=/ravintol|ruokail|lounas|bistro|illallinen|keittio|ruokaa|ruokapysahd|panimoravintola/.test(s);
      const shop=/tilamyymal|myymala|puoti|kylakauppa|lahiruok|farmi|lifestyle|kauppa/.test(s);
      return {cafe, restaurant,shop,other:!cafe&&!restaurant&&!shop};
    }
    function label(p) {
      const c=classify(p);
      return c.cafe && c.restaurant ? '☕ Kahvila ja ravintola' : c.cafe ? '☕ Kahvila' : c.restaurant ? '🍽️ Ravintola' : c.shop ? '🛍️ Puoti tai lähiruoka' : '🚗 Pysähdyspaikka';
    }
    const make = (tag,klass,text) => {const el=document.createElement(tag);if(klass)el.className=klass;if(text)el.textContent=text;return el;};
    function navLink(label,href,external=false){const a=make('a','',label);a.href=href;if(external){a.target='_blank';a.rel='noopener noreferrer';}return a;}
    function card(p) {
      const article=make('article','stop-card');
      article.append(make('span','kind',label(p)),make('h4','',p.name));
      if (p.description) article.append(make('p','',p.description));
      if (p.address) article.append(make('address','',p.address));
      const links=make('div','card-links');
      if(safeLink(p.url))links.append(navLink('Tutustu →',p.url,/^https:/i.test(p.url)));
      const mapq=encodeURIComponent(p.name+' '+p.city);
      links.append(navLink('📍 Kartalle','https://www.google.com/maps/search/?api=1&query='+mapq,true));
      article.append(links);return article;
    }
    function render() {
      const q=norm(query.value.trim());
      const matching=items.filter(p => (!town.value || p.city===town.value) && (!q || norm([p.name,p.city,p.address,p.description].join(' ')).includes(q)) && (selectedCategory==='all'||classify(p)[selectedCategory]));
      result.replaceChildren();
      let shown=0;
      const groups=new Map();
      matching.forEach(p=>{if(!groups.has(p.city))groups.set(p.city,[]);groups.get(p.city).push(p);});
      groups.forEach((entries,city)=>{
        const section=make('section','town-group');
        const heading=make('h3','',city);section.append(heading);
        const grid=make('div','cards');
        let cafeCount=0, restaurantCount=0, otherCount=0;
        entries.forEach(p=>{
          const cls=classify(p);
          // Paikkakunnittain korkeintaan 5 kahvilaa ja 5 ravintolaa;
          // muut pysähdykset näkyvät erikseen, jos valittu.
          const group= cls.restaurant ? 'restaurant' : cls.cafe ? 'cafe' : 'other';
          if(group==='restaurant' && restaurantCount>=5) return;
          if(group==='cafe' && cafeCount>=5) return;
          if(group==='other' && otherCount>=5) return;
          if(group==='restaurant') restaurantCount++;
          else if(group==='cafe') cafeCount++;
          else otherCount++;
          grid.append(card(p));shown++;
        });
        section.append(grid);
        const more=make('div','more-links');
        more.append(navLink('Kaikki ravintolat kartalla →','https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('ravintolat '+city),true));
        more.append(navLink('Kaikki kahvilat kartalla →','https://www.google.com/maps/search/?api=1&query='+encodeURIComponent('kahvilat '+city),true));
        section.append(more);result.append(section);
      });
      if (!matching.length) result.append(make('p','empty','Tällä haulla ei löytynyt vielä oppaan pysähdyspaikkoja. Kokeile toista paikkakuntaa tai avaa Lähellä minua -haku.'));
      const summary=(town.value||'Koko Suomi')+' · '+shown+' pysähdyspaikkaa';
      count.textContent=summary+(matching.length>shown?' (osa rajattu paikkakunnittain)':'');
      controls.forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.stopCategory===selectedCategory)));
    }
    function updateUrl(){
      const u=new URL(location.href);
      if(town.value)u.searchParams.set('kunta',town.value);else u.searchParams.delete('kunta');
      if(selectedCategory!=='all')u.searchParams.set('ryhma',selectedCategory);else u.searchParams.delete('ryhma');
      if(query.value.trim())u.searchParams.set('haku',query.value.trim());else u.searchParams.delete('haku');
      history.replaceState(null,'',u);render();
    }
    town.addEventListener('change',updateUrl);
    query.addEventListener('input',updateUrl);
    controls.forEach(btn=>btn.addEventListener('click',()=>{selectedCategory=btn.dataset.stopCategory;updateUrl();}));
    render();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{restoreHomeButton();initStops();});
  else {restoreHomeButton();initStops();}
  window.addEventListener('pageshow',restoreHomeButton);
})();
