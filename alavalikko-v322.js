/* Matkaile Suomessa v322 – yhtenäinen neljän painikkeen alavalikko. */
(() => {
  'use strict';
  const source = document.currentScript && document.currentScript.src || location.href;
  const root = new URL('.', source);
  const page = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const towns = new Set(['enonkoski.html','hirvensalmi.html','juva.html','kangasniemi.html','mikkeli.html','mantyharju.html','pieksamaki.html','puumala.html','rantasalmi.html','savonlinna.html','sulkava.html','etela-savo.html']);
  const stops = new Set(['pysahdy-matkalla.html','etela-savo-kohde.html','kayntikohteet.html','ruukkikylat.html']);
  const current = page === 'index.html' ? 'koti' :
    (page === 'maakunnat.html' || page === 'kunnat.html' || towns.has(page)) ? 'paikkakunnat' :
    stops.has(page) ? 'pysahdy' : page === 'paivakirja.html' ? 'matkat' : '';
  // The symbols are embedded locally as SVG, not emoji or third-party assets.
  const icons = {
    koti:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    paikkakunnat:'<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.7"/>',
    pysahdy:'<path d="M12 2v20M5 6h12l3 3-3 3H5zM19 15H7l-3 3 3 3h12z"/>',
    matkat:'<path d="M4 3h14a2 2 0 0 1 2 2v16H6a2 2 0 0 1-2-2V3Z"/><path d="M4 17a2 2 0 0 1 2-2h14M8 8h8M8 11h6"/>'
  };
  const items = [
    ['koti','index.html','Koti'],
    ['paikkakunnat','maakunnat.html','Paikkakunnat'],
    ['pysahdy','pysahdy-matkalla.html','Pysähdy matkalla'],
    ['matkat','paivakirja.html','Omat matkat']
  ];
  function render(){
    document.querySelectorAll('nav.site-nav, nav.bottom-nav, nav.ms301-nav, nav.ms302-nav, nav.ms303-nav, nav.ms304-nav, nav.ms322-bottom').forEach(n => n.remove());
    const nav=document.createElement('nav');
    nav.className='ms322-bottom';nav.setAttribute('aria-label','Sivuston alavalikko');
    const row=document.createElement('div');row.className='ms322-inner';
    items.forEach(([id,url,label]) => {
      const a=document.createElement('a');a.href=new URL(url,root).href;
      a.className='ms322-link'+(id===current?' is-active':'');
      if(id===current) a.setAttribute('aria-current','page');
      const icon=document.createElement('span');icon.className='ms322-icon';icon.setAttribute('aria-hidden','true');
      icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+icons[id]+'</svg>';
      const text=document.createElement('span');text.className='ms322-label';text.textContent=label;
      a.append(icon,text);row.append(a);
    });
    nav.append(row);document.body.append(nav);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render,{once:true});
  else render();
  // Safari browser back/forward cache can restore an older page state.
  window.addEventListener('pageshow', e => {if(e.persisted)render();});
})();
