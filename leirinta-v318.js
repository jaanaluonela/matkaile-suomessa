/* v318 · Kaikkien rajauksien tyhjennys, säilytä nykyiset suodatusmoottorit. */
(()=>{'use strict';
const init=()=>{
 const btn=document.getElementById('ms318-camp-reset');if(!btn)return;
 btn.addEventListener('click',()=>{
  const search=document.getElementById('v243-stay-search');if(search){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
  const region=document.getElementById('region');if(region){region.value='';region.dispatchEvent(new Event('change',{bubbles:true}));}
  const city=document.getElementById('municipality');if(city){city.value='';city.dispatchEvent(new Event('change',{bubbles:true}));}
  ['camp-only-sfc','camp-only-year-round'].forEach(id=>{const e=document.getElementById(id);if(e){e.checked=false;e.dispatchEvent(new Event('change',{bubbles:true}));}});
  document.querySelectorAll('.ms275-service-choice').forEach(e=>{if(e.checked){e.checked=false;e.dispatchEvent(new Event('change',{bubbles:true}));}});
  const url=new URL(location.href);url.searchParams.delete('haku');url.searchParams.delete('sfc');history.replaceState(null,'',url);
 });
}; if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
