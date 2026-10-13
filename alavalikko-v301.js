/* Matkaile Suomessa v301 — shared, accessible bottom navigation and local favorites. */
(() => {
  'use strict';
  const key = 'ms_favorites_v301';
  const urlName = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = ['index.html',''].includes(urlName);
  const isStops = ['pysahdy-matkalla.html','kayntikohteet.html','ruukkikylat.html'].includes(urlName);
  const isFav = urlName === 'suosikit.html';
  function read() {
    try {
      const a = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(a) ? a.filter(x => x && typeof x.url === 'string' && typeof x.title === 'string').slice(0,200) : [];
    } catch { return []; }
  }
  function store(items) {
    try { localStorage.setItem(key, JSON.stringify(items)); return true; }
    catch { return false; }
  }
  function relativeUrl() { return location.pathname.split('/').pop() + location.search + location.hash; }
  function makeNav() {
    document.querySelectorAll('.site-nav, .bottom-nav, .ms301-nav').forEach(el => el.remove());
    const nav = document.createElement('nav');
    nav.className = 'ms301-nav';
    nav.setAttribute('aria-label','Sivuston alavalikko');
    const items = [
      ['index.html','🏡','Koti',isHome],
      ['pysahdy-matkalla.html','🏞️','Pysähdy matkalla',isStops],
      ['suosikit.html','⭐','Suosikit',isFav]
    ];
    const inner = document.createElement('div');
    inner.className = 'ms301-nav-inner';
    for (const [href,icon,label,current] of items) {
      const a = document.createElement('a');
      a.href = href;
      a.className = current ? 'ms301-current' : '';
      if(current) a.setAttribute('aria-current','page');
      const symbol = document.createElement('span');
      symbol.className = 'ms301-nav-icon';
      symbol.setAttribute('aria-hidden','true');
      symbol.textContent = icon;
      const txt = document.createElement('span');
      txt.className = 'ms301-nav-label';
      txt.textContent = label;
      a.append(symbol,txt); inner.append(a);
    }
    nav.append(inner);
    document.body.append(nav);
  }
  function addSaveButton() {
    const skip = new Set(['index.html','suosikit.html','pysahdy-matkalla.html',
      'kayntikohteet.html','ruukkikylat.html','maakunnat.html','kunnat.html',
      'yopyminen.html','leirintaalueet.html','matkaparkit.html','lahella-minua.html',
      'paivakirja.html']);
    if (skip.has(urlName)) return;
    const heading = document.querySelector('main h1, .container h1, h1');
    if (!heading) return;
    const title = heading.textContent.replace(/^\s*[⭐🏞️🏡📍🏕️]*/, '').trim();
    if (!title) return;
    const address = relativeUrl();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ms301-save';
    button.setAttribute('aria-label','Tallenna sivu suosikkeihin');
    const render = () => {
      const exists = read().some(x=>x.url===address);
      button.textContent = exists ? '⭐ Tallennettu suosikkeihin' : '☆ Lisää suosikkeihin';
      button.setAttribute('aria-pressed',String(exists));
    };
    button.addEventListener('click',() => {
      const items = read();
      const idx = items.findIndex(x=>x.url===address);
      if (idx!==-1) items.splice(idx,1);
      else items.unshift({url:address,title:title,savedAt:new Date().toISOString()});
      if (!store(items)) { alert('Suosikkeja ei voitu tallentaa tähän selaimeen.'); return; }
      render();
    });
    heading.insertAdjacentElement('afterend',button);
    render();
  }
  function favoritesPage() {
    const box = document.getElementById('ms301-favorites-list');
    if(!box) return;
    const render = () => {
      box.replaceChildren();
      const items = read();
      if(!items.length) {
        const p = document.createElement('p');
        p.className = 'ms301-empty';
        p.textContent = 'Ei vielä tallennettuja suosikkeja. Avaa kiinnostava kohde ja valitse ☆ Lisää suosikkeihin.';
        box.append(p); return;
      }
      for (const item of items) {
        // Reject URLs outside the current static site.
        if (/^(?:[a-z]+:|\/\/|\/)/i.test(item.url)) continue;
        const row = document.createElement('div'); row.className='ms301-favorite-row';
        const link = document.createElement('a'); link.href=item.url; link.textContent=item.title;
        const del = document.createElement('button'); del.type='button';
        del.setAttribute('aria-label','Poista suosikki: '+item.title);del.textContent='Poista';
        del.addEventListener('click',()=>{ store(read().filter(x=>x.url!==item.url));render(); });
        row.append(link,del); box.append(row);
      }
    };
    render(); window.addEventListener('storage',render);
  }
  const init = () => {makeNav();favoritesPage();addSaveButton();};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
