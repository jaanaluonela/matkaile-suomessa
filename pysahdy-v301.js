/* Matkaile Suomessa v301: Näe ja koe + Pysähdy matkalla saman haun sisällä. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const results = $('ms301-results');
  const query = $('ms301-query');
  const region = $('ms301-region');
  const city = $('ms301-city');
  const count = $('ms301-count');
  const more = $('ms301-more');
  const reset = $('ms301-reset');
  if (!results || !query || !region || !city || !count || !more || !reset) return;
  const buttons = [...document.querySelectorAll('[data-ms301-category]')];
  const norm = val => String(val || '').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const sortFi = (a, b) => String(a).localeCompare(String(b), 'fi');
  const nameNature = /kansallispuist|luontopol|luontokoh|retki|ulkoilu|tuntur|vesiputou|koski|rotko|nakoal|nakotor|jarv|ranta|saari|harju|luola|pitkos|mets|suo\b|luonto|ulkoilureit|vaellus|kivipuist/;
  const descNature = /kansallispuist|luontopol|luontokoh|luonnonsuojelualu|retkeilyreit|vaellusreit|nakoalapaik|nakoalatorn|vesiputou|pitkospuu/;
  const extras = [{name:'Pyynikin munkkikahvila ja näkötorni',city:'Tampere',address:'Näkötornintie 20, Tampere',description:'Munkki- ja kahvitauko Pyynikin näkötornin juurella sekä järvimaisemia tornista.',type:'stop',url:'tampere-pyynikin-munkkikahvila.html'}];
  const data = [
    ...(window.visitHighlights || []),
    ...(window.nearbyData || []),
    ...(window.msSuositutRuokapaikatV267 || []),
    ...(window.msRuukkikylatV301 || []),
    ...extras
  ];
  const serviceQuery = /vesipiste|vedenottopiste|veden taytt|kayttoved|juomavesi|harmaaves|harmaan veden|septitank|septikaiv|kemiallisen wc|wc.n tyhjenn|jatesailio|tyhjennyspaik|matkailuauton huolto|matkailuautoille|matkailuautojen pysakoint|iso pysakointialue|tilava pysakoint|caravan service|service point/;
  const kidsQuery = /leikkipuist|leikkikent|leikkialue|leikkipaik|kotielain|elaintila|elaintarha|perhepuist|perhepark|lasten kanssa|lapsille|lapsiperhe|koko perhee|seikkailupuist|puuhapuist|liikennepuist|satupuist|lastenpuist|lasten maailma/;
  const searchable = p => norm([p.name,p.description,p.address,p.city,p.category,p.categories,p.tags,p.features,p.services].map(v=>Array.isArray(v)?v.join(' '):v||'').join(' '));
  const seen = new Map();
  for (const source of data) {
    if (!source || !source.name || !source.city || (!['sight','stop','ruukki'].includes(source.type) && !serviceQuery.test(searchable(source)) && !kidsQuery.test(searchable(source)))) continue;
    const key = norm(source.name).trim() + '|' + norm(source.city).trim();
    if (!seen.has(key)) seen.set(key, { ...source });
    else {
      const prior = seen.get(key);
      // Keep any missing website / address from the second data source.
      for (const field of ['website','address','region','description','url','slug','kind','category']) {
        if (!prior[field] && source[field]) prior[field] = source[field];
      }
    }
  }
  const regions = window.msFinlandRegions2026 || {};
  const regionByCity = new Map();
  Object.entries(regions).forEach(([label, cities]) => {
    if (Array.isArray(cities)) cities.forEach(item => regionByCity.set(norm(item),label));
  });
  const alias = {'vääksy':'Asikkala','levi':'Kittilä','ylläs':'Kolari','äkäslompolo':'Kolari','vuokatti':'Sotkamo','ruka':'Kuusamo','hossa':'Suomussalmi','fiskars':'Raasepori','tammisaari':'Raasepori','saariselkä':'Inari','pyynikki':'Tampere','repovesi':'Kouvola'};
  const aliases = Object.fromEntries(Object.entries(alias).map(([a,b])=>[norm(a),b]));
  function findRegion(p) {
    if (p.region) return p.region;
    if (p.maakunta) return p.maakunta;
    for (const part of norm(p.city).split(/\s*[,/·–]\s*/)) {
      const town = aliases[part] || part;
      const matched = regionByCity.get(norm(town));
      if (matched) return matched;
    }
    return '';
  }
  function classifications(p) {
    const kind = norm(p.kind || '');
    const hint = norm((p.category || '') + ' ' + (p.name || '') + ' ' + (p.description || ''));
    const cafe = /kahvila|kahvi|munkki|leipomo|teehetk|vohveli|cafe|café/.test(kind+' '+hint);
    const restaurant = /ravintola|ruokail|lounas|bistro|illallinen|keittio|ruokaa|ruokapysahd|panimoravintola/.test(kind+' '+hint);
    const shop = /tilamyymal|myymala|puoti|kylakauppa|lahiruok|farmi|kauppa|myynti|lifestyle/.test(hint);
    const caravan = serviceQuery.test(searchable(p));
    const kids = kidsQuery.test(searchable(p));
    const nature = p.type==='sight' && (nameNature.test(norm(p.name)) || descNature.test(norm(p.description)));
    return {cafe,restaurant,shop,nature,caravan,kids};
  }
  const items = [...seen.values()].map(p=>({...p,_region:findRegion(p),_flags:classifications(p)}))
    .sort((a,b)=>sortFi(a.city,b.city)||sortFi(a.name,b.name));
  const allRegions = [...new Set([...Object.keys(regions), ...items.map(p=>p._region)].filter(Boolean))].sort(sortFi);
  allRegions.forEach(name => { const opt=new Option(name,name);region.add(opt); });
  function populateCities() {
    const prior=city.value;
    city.replaceChildren(new Option(region.value?'Kaikki maakunnan paikkakunnat':'Kaikki paikkakunnat',''));
    const towns=[...new Set(items.filter(p=>!region.value||p._region===region.value).map(p=>p.city))].sort(sortFi);
    towns.forEach(name=>city.add(new Option(name,name)));
    city.value=towns.includes(prior)?prior:'';
  }
  const params = new URLSearchParams(location.search);
  const wantedCity = params.get('kunta') || '';
  const wantedRegion = params.get('maakunta') || '';
  if (allRegions.includes(wantedRegion)) region.value=wantedRegion;
  else if (wantedCity) {const item=items.find(p=>p.city===wantedCity);if(item&&item._region)region.value=item._region;}
  populateCities();
  if ([...city.options].some(o=>o.value===wantedCity))city.value=wantedCity;
  const categorySet = new Set(['all','sight','nature','stop','cafe','restaurant','shop','ruukki','caravan','kids']);
  const oldCategory = {other:'stop',kahvila:'cafe',ravintola:'restaurant'};
  let selected = oldCategory[params.get('ryhma')] || params.get('ryhma') || params.get('tyyppi') || 'all';
  if (!categorySet.has(selected)) selected='all';
  query.value=params.get('haku') || '';
  if (!query.value && params.get('kohde')) {
    const target=items.find(p=>p.slug===params.get('kohde'));
    if(target){ query.value=target.name; region.value='';populateCities();city.value=''; }
  }
  let limit=12;
  function matchingType(p) {
    if (selected==='all') return true;
    if (selected==='ruukki') return p.type==='ruukki';
    if (selected==='sight') return p.type==='sight';
    if (selected==='nature') return p._flags.nature;
    if (selected==='stop') return p.type==='stop';
    if(selected==='caravan' || selected==='kids')return p._flags[selected];
    return p.type==='stop' && p._flags[selected];
  }
  function kindLabel(p) {
    if (selected==='caravan' && p._flags.caravan)return '🚐 Karavaanarin palvelut';
    if (selected==='kids' && p._flags.kids)return '🧸 Lasten kanssa';
    if(p.type==='ruukki')return '🏭 Ruukkikylä';
    if(p.type==='sight')return p._flags.nature?'🌲 Luonto ja retket':'🏛️ Nähtävyys';
    if(p._flags.cafe && p._flags.restaurant)return '☕ Kahvila ja ravintola';
    if(p._flags.cafe)return '☕ Kahvila';
    if(p._flags.restaurant)return '🍽️ Ravintola';
    if(p._flags.shop)return '🧺 Lähiruoka ja puodit';
    if(p._flags.caravan)return '🚐 Karavaanarin palvelut';
    if(p._flags.kids)return '🧸 Lasten kanssa';
    return '📍 Taukopaikka';
  }
  function safeHref(raw) {
    const url=String(raw||'').trim();
    if (/^https:\/\/[^\s]+$/i.test(url)) return url;
    if (/^[a-z0-9_-]+\.html(?:[?#][^\s]*)?$/i.test(url)) return url;
    return '';
  }
  function elem(tag,cls,content) { const x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=content;return x; }
  function card(p) {
    const article=elem('article','ms301-card');
    const meta=elem('p','ms301-kind',kindLabel(p));
    const heading=elem('h3','',p.name);
    const town=elem('p','ms301-city',[p.city,p._region].filter(Boolean).join(' · '));
    article.append(meta,heading,town);
    if(p.description) article.append(elem('p','ms301-description',p.description));
    const links=elem('div','ms301-card-links');
    let detail=safeHref(p.url);
    // Older food entries refer back to this very list; use their own website instead.
    if (/^pysahdy-matkalla\.html(?:[?#]|$)/i.test(detail)) detail='';
    if(!detail)detail=safeHref(p.website);
    if(detail){
      const a=elem('a','', 'Tutustu');a.href=detail;
      if(/^https:/.test(detail)){a.target='_blank';a.rel='noopener noreferrer';}
      links.append(a);
    }
    const map=elem('a','', 'Kartta');
    map.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+' '+(p.address||p.city));
    map.target='_blank';map.rel='noopener noreferrer';links.append(map);
    article.append(links);return article;
  }
  const categoryInfo=elem('div','ms301-category-info');
  results.parentElement.insertBefore(categoryInfo,results);
  function renderCategoryInfo() {
    categoryInfo.replaceChildren();
    const isCaravan=selected==='caravan';
    const isKids=selected==='kids';
    categoryInfo.hidden=!(isCaravan || isKids);
    if(categoryInfo.hidden)return;
    categoryInfo.append(elem('p','',isCaravan?'Etsi vesipisteitä, WC- ja harmaavesityhjennyksiä sekä matkailuautoille sopivia pysäköintialueita.':'Etsi leikkipuistoja, kotieläinpihoja ja mukavia taukopaikkoja lasten kanssa.'));
    const links=elem('div','ms301-map-links');
    const where=city.value||region.value||'Suomi';
    const searchLinks = isCaravan
      ? [['Vesipisteet kartalla','matkailuauto vesipiste veden täyttö'],['Tyhjennyspaikat kartalla','matkailuauto kemiallisen WC:n harmaavesityhjennys'],['Isot pysäköintialueet kartalla','matkailuauton pysäköinti iso pysäköintialue']]
      : [['Leikkipuistot kartalla','leikkipuisto'],['Kotieläinpihat kartalla','kotieläinpiha'],['Lasten taukopaikat kartalla','lasten kanssa taukopaikka leikkipaikka']];
    searchLinks.forEach(([label,words])=>{
      const a=elem('a','',label);a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(words+' '+where);a.target='_blank';a.rel='noopener noreferrer';links.append(a);
    });
    categoryInfo.append(links,elem('small','', 'Karttahaut ovat Google Mapsin hakutuloksia, eivät oppaan tarkistamia kohteita.'));
  }
  function render() {
    renderCategoryInfo();
    const q=norm(query.value.trim());
    const matches=items.filter(p=>matchingType(p) && (!region.value||p._region===region.value) && (!city.value||p.city===city.value) && (!q||(searchable(p)+' '+norm(p._region)).includes(q)));
    count.textContent=(city.value || region.value || 'Koko Suomi')+' · '+matches.length+(matches.length===1?' kohde':' kohdetta');
    results.replaceChildren();
    if (!matches.length) {
      const empty=elem('div','ms301-empty');
      empty.append(elem('strong','', 'Tällä haulla ei löytynyt kohteita.'),elem('p','', 'Kokeile toista hakusanaa tai tyhjennä valinnat.'));
      results.append(empty);
    } else {
      const frag=document.createDocumentFragment();
      matches.slice(0,limit).forEach(p=>frag.append(card(p)));
      results.append(frag);
    }
    more.hidden=matches.length<=limit;
    if(!more.hidden)more.textContent='Näytä lisää ('+Math.min(12,matches.length-limit)+')';
    buttons.forEach(btn=>{const active=btn.dataset.ms301Category===selected;btn.setAttribute('aria-pressed',String(active));btn.classList.toggle('is-active',active);});
  }
  function syncUrl(){
    const u=new URL(location.href);
    for(const [key,value] of [['maakunta',region.value],['kunta',city.value],['tyyppi',selected==='all'?'':selected],['haku',query.value.trim()]]){
      if(value)u.searchParams.set(key,value);else u.searchParams.delete(key);
    }
    u.searchParams.delete('ryhma');u.searchParams.delete('kohde');
    history.replaceState(null,'',u.pathname+u.search+u.hash);
    render();
  }
  buttons.forEach(btn=>btn.addEventListener('click',()=>{selected=btn.dataset.ms301Category;limit=12;syncUrl();}));
  region.addEventListener('change',()=>{city.value='';populateCities();limit=12;syncUrl();});
  city.addEventListener('change',()=>{limit=12;syncUrl();});
  query.addEventListener('input',()=>{limit=12;syncUrl();});
  reset.addEventListener('click',()=>{selected='all';query.value='';region.value='';populateCities();city.value='';limit=12;syncUrl();query.focus();});
  more.addEventListener('click',()=>{limit+=12;render();});
  render();
})();
