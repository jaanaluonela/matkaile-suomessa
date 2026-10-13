/* v298 – riippumaton vanhoista valikko- ja tulosrakenteista. */
(function(){
  'use strict';
  const cleanText = s => (s||'').replace(/\s+/g,' ').trim().toLocaleLowerCase('fi');
  function isSightsLink(a){
    const href=(a.getAttribute('href')||'').toLowerCase();
    const label=cleanText(a.textContent+' '+(a.getAttribute('aria-label')||''));
    return href.includes('kayntikohteet.html') || /\bnäe ja koe\b|\bnähtävää\b/.test(label);
  }
  function menuShortcut(){
    const backup=document.getElementById('ms-ruukki-backup-v298');
    if(!backup)return;
    const menu=document.querySelector('.home-primary-links-v290 .menu');
    const sights=menu && [...menu.querySelectorAll('a[href]')].find(a=>a.id!=='ms-ruukki-in-menu-v298'&&isSightsLink(a));
    const existing=document.getElementById('ms-ruukki-in-menu-v298');
    if(menu&&sights){
      if(!existing){
        const copy=backup.cloneNode(true); copy.id='ms-ruukki-in-menu-v298';
        sights.insertAdjacentElement('afterend',copy);
      }else if(sights.nextElementSibling!==existing){
        sights.insertAdjacentElement('afterend',existing);
      }
      backup.hidden=true;
    } else {
      backup.hidden=false;
    }
  }
  function stripTutustuArrows(){
    const root=document.getElementById('results');
    if(!root)return;
    root.querySelectorAll('a,button').forEach(a=>{
      const full=cleanText(a.textContent);
      if(!/^tutustu(?:\s*[→➜➔›»⟶])?$/.test(full))return;
      a.classList.add('ms-tutustu-no-arrow-v298');
      a.querySelectorAll('svg[aria-hidden="true"], i[aria-hidden="true"]').forEach(x=>x.remove());
      [...a.childNodes].forEach(n=>{
        if(n.nodeType===3) n.textContent=n.textContent.replace(/\s*[→➜➔›»⟶]\s*$/u,'');
        else if(n.nodeType===1 && /^[→➜➔›»⟶]$/.test(cleanText(n.textContent)))n.remove();
      });
    });
  }
  function removeOldSeasons(){
    document.querySelectorAll('.season-shortcuts-v267').forEach(el=>el.remove());
  }
  function init(){
    removeOldSeasons();stripTutustuArrows();menuShortcut();
    const menu=document.querySelector('.home-primary-links-v290');
    if(menu){
      const obs=new MutationObserver(()=>menuShortcut());
      obs.observe(menu,{childList:true,subtree:true});
    }
    const results=document.getElementById('results');
    if(results){
      const obs=new MutationObserver(()=>stripTutustuArrows());
      obs.observe(results,{childList:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
  window.addEventListener('load',()=>{removeOldSeasons();stripTutustuArrows();menuShortcut()},{once:true});
})();
