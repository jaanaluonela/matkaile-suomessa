/* Matkaile Suomessa v303: ONE consistent footer on every page. */
(() => {
  'use strict';
  const key = 'ms_favorites_v301'; // Keep previously saved favorites.
  const source = document.currentScript;
  const siteRoot = new URL('.', source && source.src ? source.src : location.href);
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const isHome = page === 'index.html';
  const isStops = ['pysahdy-matkalla.html','kayntikohteet.html','ruukkikylat.html'].includes(page);
  const isFav = page === 'suosikit.html';

  const url = name => new URL(name, siteRoot).href;
  const storedUrl = () => {
    const current = new URL(location.href);
    if (current.origin !== siteRoot.origin || !current.pathname.startsWith(siteRoot.pathname)) return current.pathname.replace(/^\//,'') + current.search + current.hash;
    return current.pathname.slice(siteRoot.pathname.length) + current.search + current.hash || 'index.html';
  };
  const safeUrl = value => {
    if (typeof value !== 'string' || !value || /^(?:[a-z]+:|\/|#)/i.test(value) || value.includes('\\')) return null;
    try {
      const result = new URL(value, siteRoot);
      return result.origin === siteRoot.origin && result.pathname.startsWith(siteRoot.pathname) ? result.href : null;
    } catch { return null; }
  };
  function read() {
    try {
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(items) ? items.filter(x=> x && typeof x.url==='string' && typeof x.title==='string').slice(0,200) : [];
    } catch { return []; }
  }
  function store(items) {
    try { localStorage.setItem(key, JSON.stringify(items)); return true; }
    catch { return false; }
  }
  function makeNav() {
    // Remove obsolete three-button navigation, even on pages with old HTML.
    document.querySelectorAll('nav.site-nav, .bottom-nav, .ms301-nav').forEach(el=>el.remove());
    const nav = document.createElement('nav');
    nav.className = 'ms301-nav';
    nav.setAttribute('aria-label', 'Sivuston alavalikko');
    const inner = document.createElement('div');
    inner.className = 'ms301-nav-inner';
    [
      ['index.html','🏡','Koti',isHome],
      ['pysahdy-matkalla.html','🏞️','Pysähdy matkalla',isStops],
      ['suosikit.html','⭐','Suosikit',isFav]
    ].forEach(([href, emoji, title, current]) => {
      const a=document.createElement('a');
      a.href=url(href);
      if (current) {a.className='ms301-current';a.setAttribute('aria-current','page');}
      const symbol=document.createElement('span');
      symbol.className='ms301-nav-icon';symbol.setAttribute('aria-hidden','true');symbol.textContent=emoji;
      const label=document.createElement('span');
      label.className='ms301-nav-label';label.textContent=title;
      a.append(symbol,label);inner.append(a);
    });
    nav.append(inner);
    document.body.append(nav);
  }
  function addSaveButton() {
    const skip=new Set(['index.html','suosikit.html','pysahdy-matkalla.html','kayntikohteet.html','ruukkikylat.html','maakunnat.html','kunnat.html','yopyminen.html','leirintaalueet.html','matkaparkit.html','lahella-minua.html','paivakirja.html']);
    if (skip.has(page) || document.querySelector('.ms301-save')) return;
    const heading=document.querySelector('main h1, .container h1, h1');
    if (!heading) return;
    const title=heading.textContent.replace(/^\s*[⭐🏞️🏡📍🏕️]*/, '').trim();
    if (!title) return;
    const address=storedUrl();
    const button=document.createElement('button');
    button.type='button';button.className='ms301-save';
    button.setAttribute('aria-label','Lisää tai poista suosikeista');
    const render=()=>{
      const exists=read().some(x=>x.url===address);
      button.textContent=exists ? '⭐ Tallennettu suosikkeihin' : '☆ Lisää suosikkeihin';
      button.setAttribute('aria-pressed', String(exists));
    };
    button.addEventListener('click',()=>{
      const items=read();
      const idx=items.findIndex(x=>x.url===address);
      if(idx>=0) items.splice(idx,1);
      else items.unshift({url:address,title,savedAt:new Date().toISOString()});
      if(!store(items)) {alert('Suosikkeja ei voitu tallentaa tähän selaimeen.');return;}
      render();
    });
    heading.insertAdjacentElement('afterend',button);
    render();
  }
  function favoritesPage() {
    const box=document.getElementById('ms301-favorites-list');
    if(!box) return;
    const render=()=>{
      box.replaceChildren();
      const items=read();
      const valid=items.filter(item=>safeUrl(item.url));
      if(!valid.length) {
        const p=document.createElement('p');
        p.className='ms301-empty';
        p.textContent='Ei vielä tallennettuja suosikkeja. Avaa kiinnostava kohde ja valitse ☆ Lisää suosikkeihin.';
        box.append(p);return;
      }
      valid.forEach(item=>{
        const row=document.createElement('div');row.className='ms301-favorite-row';
        const link=document.createElement('a');link.href=safeUrl(item.url);link.textContent=item.title;
        const del=document.createElement('button');del.type='button';del.textContent='Poista';
        del.setAttribute('aria-label','Poista suosikki: '+item.title);
        del.addEventListener('click',()=>{if(store(read().filter(x=>x.url!==item.url)))render();});
        row.append(link,del);box.append(row);
      });
    };
    render();window.addEventListener('storage',render);
  }
  const init=()=>{makeNav();favoritesPage();addSaveButton();};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
