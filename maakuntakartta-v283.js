/* Matkailu Suomessa v283 – kartalta valinta ja maakunnan nimen esikatselu */
(()=>{'use strict';
  function init(){
    const map=document.querySelector('.ms-finland-map');
    const list=document.getElementById('regions-list');
    const search=document.getElementById('region-search');
    const name=document.getElementById('ms-map-selected-region');
    const hint=document.getElementById('ms-map-selected-hint');
    if(!map)return;
    const links=[...map.querySelectorAll('.ms-map-link')];
    const getSelected=()=>new URLSearchParams(location.search).get('maakunta');
    function updateSelected(region){
      links.forEach(a=>a.classList.toggle('is-selected',a.dataset.region===region));
      if(name)name.textContent=region||'Valitse maakunta kartalta';
      if(hint)hint.textContent=region?'Näytä maakunnan kunnat ja matkavinkit':'Avaa kunnat ja alueen matkavinkit';
    }
    function preview(region){
      if(!region){updateSelected(getSelected());return;}
      if(name)name.textContent=region;
      if(hint)hint.textContent='Valitse maakunta avataksesi sen kunnat';
    }
    updateSelected(getSelected());
    map.addEventListener('pointerover',event=>{
      const a=event.target.closest('.ms-map-link');if(a)preview(a.dataset.region);
    });
    map.addEventListener('pointerout',event=>{
      const a=event.target.closest('.ms-map-link');
      if(a&&!a.contains(event.relatedTarget))preview(null);
    });
    map.addEventListener('focusin',event=>{
      const a=event.target.closest('.ms-map-link');if(a)preview(a.dataset.region);
    });
    map.addEventListener('focusout',event=>{
      if(!map.contains(event.relatedTarget))preview(null);
    });
    map.addEventListener('click',event=>{
      const a=event.target.closest('.ms-map-link');if(!a||!list||!search)return;
      const region=a.dataset.region;if(!region)return;
      if(search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
      const card=[...list.querySelectorAll('details.region-card')].find(el=>el.dataset.name===region);
      if(!card)return; // Native map link works when list data is unavailable.
      event.preventDefault();
      list.querySelectorAll('details.region-card[open]').forEach(el=>{if(el!==card)el.open=false;});
      card.open=true;
      const url=new URL(location.href);url.searchParams.set('maakunta',region);url.searchParams.delete('haku');
      history.replaceState(null,'',url);
      updateSelected(region);
      card.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
    });
    if(list){
      list.addEventListener('click',event=>{
        const summary=event.target.closest('.region-card summary');
        if(!summary)return;
        const card=summary.closest('.region-card');
        if(card)requestAnimationFrame(()=>updateSelected(card.open?card.dataset.name:null));
      });
    }
    window.addEventListener('popstate',()=>updateSelected(getSelected()));
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
