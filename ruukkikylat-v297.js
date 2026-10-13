// v297: sijoita Ruukkikylät-alavalinta todellisen Nähtävää / Näe ja koe -painikkeen jälkeen.
(function(){
  'use strict';
  function normalise(str){return (str || '').toLocaleLowerCase('fi').replace(/\s+/g,' ').trim();}
  function placeLink(){
    const submenu=document.getElementById('ms-ruukki-entry-v297');
    if (!submenu)return;
    const controls=Array.from(document.querySelectorAll('a,button'));
    const btn=controls.find(el=>{
      if(submenu.contains(el) || !el.closest('.home-primary-links-v290,.home-shell')) return false;
      const label=normalise(el.textContent)+' '+normalise(el.getAttribute('aria-label'));
      return /(^|\s)(nähtävää|näe ja koe|näe & koe)(\s|$)/i.test(label);
    });
    if(btn && btn.parentNode && btn.nextElementSibling!==submenu){btn.insertAdjacentElement('afterend',submenu);}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',placeLink);else placeLink();
  window.addEventListener('load',placeLink);
  // Valikkopainikkeet rakennetaan vanhemmassa versiossa JS:llä; odotetaan niitä.
  let applying=false;
  const observer=new MutationObserver(()=>{if(applying)return;applying=true;placeLink();applying=false;});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
