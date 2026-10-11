
function key(id){return 'ms_'+id}function visited(id,btn){localStorage.setItem(key('visited_'+id),'1'); if(btn) btn.textContent='✓ Olen käynyt täällä';}
function addTrip(id,name){let a=JSON.parse(localStorage.getItem(key('trips'))||'[]'); if(!a.find(x=>x.id===id)) a.push({id,name,date:new Date().toISOString().slice(0,10)}); localStorage.setItem(key('trips'),JSON.stringify(a)); alert('Lisätty omiin matkoihin: '+name)}
window.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-visited]').forEach(b=>{let id=b.dataset.visited;if(localStorage.getItem(key('visited_'+id))) b.textContent='✓ Olen käynyt täällä';})})


// v168: Avattavat/suljettavat kuntasivujen osiot
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.section-list').forEach((section, index)=>{
    const title=section.querySelector('h2');
    if(!title || title.dataset.accordionReady) return;
    title.dataset.accordionReady='1';
    title.setAttribute('role','button');
    title.setAttribute('tabindex','0');
    const body=section.querySelector('.compact-list');
    if(body && !body.id) body.id='accordion_'+index+'_'+Math.random().toString(36).slice(2,7);
    if(body) title.setAttribute('aria-controls', body.id);
    const arrow=document.createElement('span');
    arrow.className='acc-arrow';
    arrow.textContent='›';
    title.appendChild(arrow);
    section.classList.add('collapsed');
    title.setAttribute('aria-expanded','false');
    const toggle=()=>{
      const closed=section.classList.toggle('collapsed');
      title.setAttribute('aria-expanded', String(!closed));
    };
    title.addEventListener('click',toggle);
    title.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
});

// v225: Add town highlights beside existing municipality content.
window.addEventListener('DOMContentLoaded',()=>{
 const title=document.querySelector('h1');if(!title||document.getElementById('town-highlights-v225'))return;
 const city=title.textContent.trim();
 const script=document.createElement('script');script.src='kayntikohteet-data-v230.js';
 script.onload=()=>{
  const places=(window.visitHighlights||[]).filter(p=>p.city===city);if(!places.length)return;
  const section=document.createElement('section');section.id='town-highlights-v225';section.className='card';section.style.margin='16px 0';
  const heading=document.createElement('h2');heading.textContent='⭐ Näe ja koe';section.append(heading);
  const list=document.createElement('div');list.className='compact-list';
  for(const p of places){const a=document.createElement('a');a.className='place linkcard';a.href=p.url;a.style.cssText='display:block;padding:14px;margin:8px 0;border:1px solid #cfe3db;border-radius:16px;background:#f5faf7;color:#174d40;text-decoration:none';const b=document.createElement('b');b.textContent=p.name;const desc=document.createElement('p');desc.textContent=p.description||'';const more=document.createElement('span');more.textContent='Tutustu →';a.append(b,desc,more);list.append(a);}
  section.append(list);const all=document.createElement('a');all.href='kayntikohteet.html?kunta='+encodeURIComponent(city);all.textContent='Selaa paikkakunnan kohteita →';section.append(all);
  const intro=document.querySelector('.intro-card')||document.querySelector('main > section.card');if(intro)intro.after(section);else(title.closest('header')||title).after(section);
 };document.head.append(script);
});

// v241: Palauta yhteinen alavalikko myös Paikkakunnat- ja muille sivuille,
// joissa HTML-valikko puuttuu. Älä lisää toista valikkoa kuntasivuille.
(() => {
  const showPrimaryNavigation = () => {
    if (!document.body) return;
    let nav = document.querySelector('nav.site-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.className = 'site-nav';
      nav.setAttribute('aria-label', 'Päävalikko');
      nav.innerHTML = '<div class="site-nav-inner">'
        + '<a href="index.html">Koti</a>'
        + '<a href="yopyminen.html">Yöpyminen</a>'
        + '<a href="maakunnat.html">Paikkakunnat</a>'
        + '</div>';
      document.body.appendChild(nav);
    }

    // Aiemmat kuntasivut käyttävät tekstin edessä myös emoji-kuvakkeita.
    // Muutetaan vain suorat tekstilinkit yhtenäisiksi, ei kosketa sisäisiin elementteihin.
    nav.querySelectorAll('.site-nav-inner a').forEach(link => {
      if (!link.children.length) {
        const dest = link.getAttribute('href') || '';
        if (/(^|\/)index\.html$/.test(dest)) link.textContent = 'Koti';
        else if (/yopyminen\.html$/.test(dest)) link.textContent = 'Yöpyminen';
        else if (/maakunnat\.html$/.test(dest)) link.textContent = 'Paikkakunnat';
      }
    });

    const filename = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
    let selected = 'maakunnat.html';
    if (filename === 'index.html' || filename === '') selected = 'index.html';
    else if (/^(yopyminen|leirintaalueet|matkaparkit|karavaanari)([.-]|$)/.test(filename)) selected = 'yopyminen.html';
    nav.querySelectorAll('a').forEach(link => {
      link.removeAttribute('aria-current');
      if (link.getAttribute('href') === selected) link.setAttribute('aria-current', 'page');
    });

    // Omavaraiset tyylit: toimivat myös, vaikka vanha navigation-v191.css puuttuisi.
    // Asetetaan viimeiseksi, jotta vanhat mobiilityylit eivät peitä valikkoa.
    if (!document.getElementById('site-nav-fix-v241')) {
      const style = document.createElement('style');
      style.id = 'site-nav-fix-v241';
      style.textContent = `
        html { scroll-padding-bottom: 115px; }
        body { padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px)) !important; }
        .site-nav {
          display: block !important; visibility: visible !important; opacity: 1 !important;
          position: fixed !important; inset: auto 0 0 !important; z-index: 9999 !important;
          width: 100% !important; transform: none !important;
          margin: 0 !important; box-sizing: border-box !important;
          background: #fff !important; border-top: 1px solid #e3e8e5 !important;
          padding: 6px 10px calc(6px + env(safe-area-inset-bottom, 0px)) !important;
          box-shadow: 0 -3px 14px rgba(11,35,69,.10) !important;
        }
        .site-nav .site-nav-inner {
          display: grid !important; grid-template-columns: repeat(3, minmax(0,1fr)) !important;
          gap: 6px !important; max-width: 600px !important;
          margin: 0 auto !important; box-sizing: border-box !important;
        }
        .site-nav .site-nav-inner > a {
          display: flex !important; flex-direction: column !important;
          align-items: center !important; justify-content: center !important; gap: 3px !important;
          min-width: 0 !important; min-height: 72px !important;
          box-sizing: border-box !important; padding: 6px 2px !important;
          background: transparent !important; border: 0 !important;
          border-radius: 18px !important; text-decoration: none !important;
          color: #0b2345 !important; font: 650 12.5px/1.25 system-ui,sans-serif !important;
          text-align: center !important;
        }
        .site-nav .site-nav-inner > a::before {
          content: '' !important; display: block !important;
          width: 34px !important; height: 32px !important;
          -webkit-mask: none !important; mask: none !important;
          background: transparent !important;
          font: 27px/32px system-ui,sans-serif !important;
        }
        .site-nav .site-nav-inner > a[href$="index.html"]::before { content: '⌂' !important; font-size: 35px !important; }
        .site-nav .site-nav-inner > a[href$="yopyminen.html"]::before { content: '🚐' !important; }
        .site-nav .site-nav-inner > a[href$="maakunnat.html"]::before { content: '📍' !important; }
        .site-nav .site-nav-inner > a[aria-current="page"] {
          background: #ffeadf !important; color: #0b2345 !important;
        }
        .site-nav .site-nav-inner > a:focus-visible {
          outline: 3px solid #f87913 !important; outline-offset: 1px !important;
        }
      `;
      document.head.appendChild(style);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showPrimaryNavigation);
  } else {
    showPrimaryNavigation();
  }
})();
