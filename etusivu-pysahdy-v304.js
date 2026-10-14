/* Matkaile Suomessa v304: etusivulla vain yksi Pysähdy matkalla -valinta. */
(() => {
  'use strict';
  if(!document.body || document.body.dataset.home!=='true')return;
  const target='pysahdy-matkalla.html';
  const norm=v=>String(v||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('fi');
  function repair(){
    const menu=document.querySelector('.home-primary-links-v290 .menu');
    if(!menu)return;
    // Valikot-v200 ym. voivat luoda painikkeita myöhemmin; erillinen Näe ja koe poistetaan.
    for(const a of [...menu.querySelectorAll('a[href]')]){
      const path=(a.getAttribute('href')||'').split(/[?#]/)[0].toLowerCase();
      const label=norm(a.textContent);
      if(path==='kayntikohteet.html' || path==='ruukkikylat.html' || /^⭐?\s*näe ja koe\b/i.test(label))a.remove();
    }
    // Erillisen ruukkikylä-pikavalinnan paikka on nyt sisäisessä kategoriavalikossa.
    document.querySelectorAll('#ms-ruukki-backup-v298,#ms-ruukki-in-menu-v298').forEach(x=>x.remove());
    for(const a of [...document.querySelectorAll('main a[href]')]){
      if(menu.contains(a))continue;
      const path=(a.getAttribute('href')||'').split(/[?#]/)[0].toLowerCase();
      if(path==='kayntikohteet.html'||path==='ruukkikylat.html')a.remove();
    }
    const found=[...menu.querySelectorAll('a[href]')].filter(a=>(a.getAttribute('href')||'').split(/[?#]/)[0]===target);
    let primary=document.getElementById('travel-stop-v268');
    if(!primary || !menu.contains(primary))primary=found[0];
    if(!primary){primary=document.createElement('a');menu.append(primary);}
    primary.id='travel-stop-v268'; primary.href=target;
    primary.setAttribute('aria-label','Pysähdy matkalla – nähtävyydet, luonto, taukopaikat, ruukkikylät, kahvilat ja ravintolat');
    const signature='v304';
    if(primary.dataset.msStopsLayout!==signature){
      const icon=document.createElement('span');icon.className='choice-icon';icon.setAttribute('aria-hidden','true');icon.textContent='🚗';
      const text=document.createElement('span'),title=document.createElement('strong'),desc=document.createElement('small');
      title.textContent='Pysähdy matkalla';desc.textContent='Nähtävyydet, luonto, taukopaikat ja makuelämykset';text.append(title,desc);
      const arrow=document.createElement('span');arrow.className='choice-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';
      primary.replaceChildren(icon,text,arrow);primary.dataset.msStopsLayout=signature;
    }
    found.forEach(a=>{if(a!==primary)a.remove();});
  }
  function start(){repair();
    const targetNode=document.querySelector('.home-primary-links-v290 .menu');
    if(targetNode){const mo=new MutationObserver(repair);mo.observe(targetNode,{childList:true,subtree:false});}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('pageshow',repair);
})();
