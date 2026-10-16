/* Matkailu Suomessa v256 – etusivun haku ilman päällekkäisiä maakuntavalintoja. */
(()=>{'use strict';
const start=()=>{
  const input=document.getElementById('place-search'),results=document.getElementById('search-results');
  const regions=window.msFinlandRegions2026||{},aliases=window.msPlaceAliases253||{};
  const initial=new URLSearchParams(location.search).get('maakunta');
  const scope=document.getElementById('home-scope-v255'),scopeLabel=document.getElementById('home-scope-label-v255'),clear=document.getElementById('home-clear-region-v255');
  const links=['maakunnat.html','leirintaalueet.html','matkaparkit.html'];
  function cards(region){
    links.forEach(page=>{
      const a=document.querySelector('main .home-choices-v212 a[href^="'+page+'"]');if(!a)return;
      a.href=region?page+'?maakunta='+encodeURIComponent(region):page;
      const small=a.querySelector('small');
      const msg={'maakunnat.html':'Kunnat ja niiden palvelut','leirintaalueet.html':'Löydä leirintäalue yöksi','matkaparkit.html':'Paikka autolle tai vaunulle'};
      if(small)small.textContent=region?region+' · '+msg[page]:msg[page];
    });
    if(scope&&scopeLabel){scope.hidden=!region;scopeLabel.textContent=region||'';}
  }
  if(initial&&Object.hasOwn(regions,initial))cards(initial);
  if(clear)clear.addEventListener('click',()=>{const u=new URL(location.href);u.searchParams.delete('maakunta');history.replaceState(null,'',u);cards('')});
  if(!input||!results)return;
  const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let previous=[];try{if(typeof places!=='undefined'&&Array.isArray(places))previous=places}catch(_){}
  const valid=x=>x&&typeof x.name==='string'&&typeof x.url==='string'&&/^[^?#]+\.html(?:[?#].*)?$/.test(x.url);
  const records=Object.entries(regions).flatMap(([r,ts])=>ts.map(t=>({name:t,group:r,...window.msTownUrl253(t)})))
     .concat(Object.entries(aliases).filter(([_,a])=>a.url).map(([n,a])=>({name:n,group:a.town,url:a.url,ready:true})))
     .concat(Object.keys(regions).map(r=>({name:r,group:'Maakunta',url:'maakunnat.html?maakunta='+encodeURIComponent(r),ready:true})))
     .concat(previous.concat(window.visitHighlights||[],window.caravanPlaces||[]).filter(valid).map(x=>({name:x.name,group:x.meta||x.city||'Kohde',url:x.url,ready:true})));
  function update(){
    const q=norm(input.value.trim());if(!q){results.replaceChildren();results.classList.remove('is-open');return;}
    const hits=records.filter(x=>norm(x.name).includes(q)).sort((a,b)=>Number(norm(a.name)!==q)-Number(norm(b.name)!==q)||a.name.localeCompare(b.name,'fi')).slice(0,9);
    results.replaceChildren();if(!hits.length){const a=document.createElement('a');a.href='maakunnat.html?haku='+encodeURIComponent(input.value.trim());a.textContent='Etsi maakunnista ja kunnista →';results.append(a)}
    hits.forEach(x=>{const a=document.createElement('a');a.href=x.url;const label=document.createElement('span');label.textContent=x.name;const small=document.createElement('small');small.textContent=x.group+(x.ready?'':' · perustietokortti');a.append(label,small);results.append(a)});
    results.classList.add('is-open');
  }
  input.addEventListener('input',()=>requestAnimationFrame(update));
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&input.value.trim()){const a=results.querySelector('a[href]');if(a){e.preventDefault();location.href=a.href}}});
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

/* v336: tietokoneversion etusivun haku – kaikki kunnat ja nykyiset kohteet.
   Täydentää olemassa olevaa hakua; mobiilin hakua ei muuteta. */
(() => {
  'use strict';
  const desktop = () => window.matchMedia('(min-width: 980px)').matches;
  const norm = x => String(x || '').toLocaleLowerCase('fi').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').trim();
  const htmlTarget = u => typeof u === 'string' &&
    /^(?!\/)(?!https?:)(?!javascript:)[\w\u00c0-\u024f./?=&%#-]+\.html(?:[?#].*)?$/i.test(u);

  function init() {
    const root = document.getElementById('ms-v315-desktop');
    if (!root || root.dataset.searchV336 === '1') return;
    root.dataset.searchV336 = '1';
    let directory = [];
    let revision = 0;
    function buildDirectory() {
      const list = [];
      const keys = new Set();
      const insert = (name, meta, url, kind, city = '') => {
        if (!name || !htmlTarget(url)) return;
        const unique = norm(name) + '|' + url;
        if (keys.has(unique)) return;
        keys.add(unique);
        list.push({name: String(name), meta: String(meta || ''), url, kind, city});
      };
      const regions = window.msFinlandRegions2026 || {};
      // Tiedostopaketista tarkistetut suorat kuntasivut; muut avataan kuntakortilla.
      const knownTownSlugs = new Set('aanekoski ahtari alajarvi alavieska alavus asikkala askola enonkoski enontekio espoo evijarvi haapajarvi haapavesi hailuoto hamina hankasalmi hanko hartola heinola helsinki hirvensalmi hollola hyrynsalmi hyvinkaa ii iitti ikaalinen ilmajoki imatra inari inkoo isojoki isokyro jamsa jarvenpaa joutsa juva jyvaskyla kaavi kajaani kalajoki kangasala kangasniemi karijoki karkkila karkola karsamaki kauhajoki kauhava kauniainen kaustinen kemi kemijarvi keminmaa kemionsaari kempele kerava keuruu kirkkonummi kittila kokkola kolari konnevesi kotka kouvola kristiinankaupunki kuhmo kuopio kuortane kurikka kuusamo lahti lapinjarvi lapinlahti lappajarvi lappeenranta lapua laukaa lemi lempaala leppavirta liminka lohja loviisa lumijoki luumaki mantsala mantta-vilppula mantyharju merijarvi miehikkala mikkeli muhos muonio mustasaari muurame myrskyla naantali nivala nokia nurmijarvi orimattila orivesi oulainen oulu padasjoki paimio paltamo parainen parikkala pelkosenniemi pello petajavesi pieksamaki pietarsaari pornainen porvoo posio pudasjarvi pukkila puolanka puumala pyhajarvi pyhajoki pyhanta pyhtaa raahe raasepori rantasalmi ranua rautjarvi reisjarvi ristijarvi rovaniemi ruokolahti ruovesi saarijarvi salla salo sastamala sauvo savitaipale savonlinna savukoski seinajoki sievi siikajoki siikalatva siilinjarvi simo sipoo siuntio sodankyla soini somero sotkamo sulkava suomussalmi suonenjoki sysma taipalsaari taivalkoski tampere tervola teuva tornio tuusniemi tuusula tyrnava utajarvi utsjoki vaala vaasa valkeakoski vantaa vihti vimpeli virolahti virrat ylitornio ylivieska ylojarvi'.split(' '));
      for (const [region, towns] of Object.entries(regions)) {
        for (const town of towns) {
          const resolved = typeof window.msTownUrl253 === 'function'
            ? window.msTownUrl253(town) : {};
          const page = (window.siteMunicipalities || {})[town] ||
            (window.msBundledMunicipalityPages253 || {})[town];
          const slug = norm(town).replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'');
          const href = htmlTarget(page) ? page :
            knownTownSlugs.has(slug) ? slug + '.html' :
            htmlTarget(resolved.url) ? resolved.url :
              'kuntakortti.html?kunta=' + encodeURIComponent(town);
          insert(town, region + ' · paikkakunta', href, 'town', town);
        }
        const guide = (window.msRegionGuides254 || {})[region];
        insert(region, 'Maakunta', htmlTarget(guide) ? guide :
          'maakunnat.html?maakunta=' + encodeURIComponent(region), 'region');
      }
      for (const [name, url] of Object.entries(window.siteMunicipalities || {})) {
        const region = (window.municipalityRegions || {})[name] || 'Paikkakunta';
        insert(name, region + ' · paikkakunta', url, 'town', name);
      }
      for (const [alias, item] of Object.entries(window.msPlaceAliases253 || {})) {
        if (!item || !htmlTarget(item.url)) continue;
        insert(alias, (item.town || '') + ' · kohde', item.url, 'place', item.town || '');
      }
      let previous = [];
      try { if (typeof places !== 'undefined' && Array.isArray(places)) previous = places; } catch (_) {}
      for (const item of previous) {
        insert(item.name, item.meta || item.city || 'Matkailukohde', item.url, 'place', item.city || '');
      }
      for (const source of [window.visitHighlights, window.caravanPlaces]) {
        if (!Array.isArray(source)) continue;
        for (const item of source) {
          if (item && htmlTarget(item.url)) {
            insert(item.name, item.meta || item.city || 'Matkailukohde', item.url, 'place', item.city || '');
          }
        }
      }
      directory = list;
      revision++;
    }
    buildDirectory();
    const matching = value => {
      const query = norm(value);
      if (!query) return [];
      return directory.filter(x => norm(x.name + ' ' + x.meta + ' ' + x.city).includes(query))
        .sort((a, b) => {
          const score = item => {
            const n = norm(item.name);
            if (n === query) return 0;
            if (item.kind === 'town' && n.startsWith(query)) return 1;
            if (item.kind === 'region' && n.startsWith(query)) return 2;
            if (n.startsWith(query)) return 3;
            if (item.kind === 'town' && n.includes(query)) return 4;
            if (n.includes(query)) return 5;
            return 6;
          };
          return score(a) - score(b) || a.name.length - b.name.length ||
            a.name.localeCompare(b.name, 'fi');
        }).slice(0, 9);
    };
    const inSearch = e => {
      const input = e.target.closest && e.target.closest('#ms-v315-desktop [data-msv-search]');
      return desktop() ? input : null;
    };
    const outputFor = input => root.querySelector('#msv-' + input.dataset.msvSearch + '-results');
    function render(input) {
      const out = outputFor(input);
      if (!out) return;
      const q = input.value.trim();
      out.replaceChildren();
      if (!q) {
        out.classList.remove('is-open');
        input.setAttribute('aria-expanded', 'false');
        return;
      }
      const hits = matching(q);
      if (hits.length) {
        for (const hit of hits) {
          const link = document.createElement('a');
          link.href = hit.url;
          link.setAttribute('role', 'option');
          const label = document.createElement('span');
          const desc = document.createElement('small');
          label.textContent = hit.name;
          desc.textContent = hit.meta;
          link.append(label, desc);
          out.append(link);
        }
      } else {
        const link = document.createElement('a');
        link.href = 'pysahdy-matkalla.html?haku=' + encodeURIComponent(q);
        link.setAttribute('role', 'option');
        const label = document.createElement('span');
        const desc = document.createElement('small');
        label.textContent = 'Etsi kaikkia kohteita';
        desc.textContent = 'Avaa laajempi kohdehaku';
        link.append(label, desc);
        out.append(link);
      }
      out.classList.add('is-open');
      input.setAttribute('aria-expanded', 'true');
    }
    function navigate(input) {
      if (!input) return;
      const q = input.value.trim();
      if (!q) { input.focus(); return; }
      const hit = matching(q)[0];
      window.location.href = hit ? hit.url :
        'pysahdy-matkalla.html?haku=' + encodeURIComponent(q);
    }
    // Kaappausvaihe ohittaa vain tietokoneversion vanhan, rajatun hakuluettelon.
    document.addEventListener('input', e => {
      const input = inSearch(e);
      if (!input) return;
      e.stopImmediatePropagation();
      render(input);
    }, true);
    document.addEventListener('focus', e => {
      const input = inSearch(e);
      if (!input) return;
      e.stopImmediatePropagation();
      render(input);
    }, true);
    document.addEventListener('keydown', e => {
      const input = inSearch(e);
      if (!input) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopImmediatePropagation();
        navigate(input);
      } else if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        const out = outputFor(input);
        if (out) out.classList.remove('is-open');
        input.setAttribute('aria-expanded', 'false');
      }
    }, true);
    document.addEventListener('submit', e => {
      if (!desktop() || !root.contains(e.target) || !e.target.matches('[data-msv-form]')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      navigate(e.target.querySelector('[data-msv-search]'));
    }, true);
    document.addEventListener('click', e => {
      if (!desktop() || !e.target.closest) return;
      const button = e.target.closest('#ms-v315-desktop #msv-find-button');
      if (!button) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      navigate(root.querySelector('[data-msv-search="main"]'));
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once: true});
  else init();
})();
