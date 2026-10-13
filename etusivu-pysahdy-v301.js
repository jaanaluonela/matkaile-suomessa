/* v301: etusivulla yksi Pysähdy matkalla -painike, valikot avautuvat sen sisällä. */
(() => {
  'use strict';
  function updateHome() {
    const section = document.querySelector('.home-primary-links-v290');
    const menu = section && section.querySelector('.menu');
    if (!menu) return;
    const hrefOf = el => (el.getAttribute('href')||'').toLowerCase().split(/[?#]/)[0];
    // Vanha valikkokoodi saattaa lisätä Näe ja koe - tai Ruukkikylät-painikkeen myöhemmin.
    [...menu.querySelectorAll('a[href]')].forEach(a => {
      const href = hrefOf(a);
      const caption = (a.textContent||'').toLocaleLowerCase('fi').trim();
      if (href==='kayntikohteet.html' || href==='ruukkikylat.html' || /\bnäe ja koe\b/.test(caption)) a.remove();
    });
    let links = [...menu.querySelectorAll('a[href]')].filter(a=>hrefOf(a)==='pysahdy-matkalla.html');
    let stop = document.getElementById('travel-stop-v268');
    if (stop && !menu.contains(stop)) stop = null;
    if (!stop) stop = links[0] || null;
    if (!stop) {
      stop = document.createElement('a');
      stop.href = 'pysahdy-matkalla.html';
      menu.append(stop);
    }
    links = [...menu.querySelectorAll('a[href]')].filter(a=>hrefOf(a)==='pysahdy-matkalla.html');
    links.forEach(a=>{if(a!==stop)a.remove();});
    if(stop.id!=='travel-stop-v268')stop.id='travel-stop-v268';
    const aria='Pysähdy matkalla – nähtävyydet, luonto, kahvilat, ravintolat ja taukopaikat';
    if(stop.getAttribute('aria-label')!==aria)stop.setAttribute('aria-label',aria);
    const markup='<span class="choice-icon" aria-hidden="true">📍</span><span><strong>Pysähdy matkalla</strong><small>Nähtävyydet, luonto, kahvilat ja taukopaikat</small></span>';
    if(stop.innerHTML!==markup)stop.innerHTML=markup;
    // Aiemmat erilliset pikavalinnat eivät enää kuulu etusivulle.
    document.querySelectorAll('#ms-ruukki-backup-v298, #ms-ruukki-in-menu-v298').forEach(a=>a.remove());
  }
  function init() {
    updateHome();
    const section = document.querySelector('.home-primary-links-v290');
    if (section) new MutationObserver(updateHome).observe(section,{childList:true,subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  window.addEventListener('pageshow',updateHome);
})();
