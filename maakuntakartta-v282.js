/* v282 – kartan valinta avaa maakunnan samalla sivulla; linkit toimivat myös ilman skriptiä. */
(()=>{'use strict';
 function init(){
  const map=document.querySelector('.ms-finland-map');
  const list=document.getElementById('regions-list');
  const search=document.getElementById('region-search');
  if(!map)return;
  const links=[...map.querySelectorAll('.ms-map-link')];
  const updateSelected=region=>links.forEach(a=>a.classList.toggle('is-selected',a.dataset.region===region));
  updateSelected(new URLSearchParams(location.search).get('maakunta'));
  map.addEventListener('click',e=>{
    const a=e.target.closest('.ms-map-link');if(!a||!list||!search)return;
    const region=a.dataset.region;if(!region)return;
    if(search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
    const card=[...list.querySelectorAll('details.region-card')].find(el=>el.dataset.name===region);
    if(!card)return; // Fall back to the link if the municipality data has not loaded.
    e.preventDefault();
    // v256 handles the expanded province and the URL state.
    list.querySelectorAll('details.region-card[open]').forEach(el=>{if(el!==card)el.open=false});
    card.open=true;
    const url=new URL(location.href);url.searchParams.set('maakunta',region);url.searchParams.delete('haku');history.replaceState(null,'',url);
    updateSelected(region);
    card.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  });
  if(list){list.addEventListener('click',e=>{const summary=e.target.closest('.region-card summary');if(!summary)return;const card=summary.closest('.region-card');if(card)updateSelected(card.dataset.name);});}
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
