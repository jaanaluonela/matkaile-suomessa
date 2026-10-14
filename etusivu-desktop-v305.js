
/* v305: Täydennä työpöytähaun paikkakuntaluettelo olemassa olevista kohdetiedoista. */
(() => {
  'use strict';
  const select=document.getElementById('ms305-stop-town');
  if(!select)return;
  const populate=()=>{
    const places=[...(window.visitHighlights||[]),...(window.ms302Ruukit||[]),...(window.nearbyData||[])];
    const names=[...new Set(places.map(p=>p&&p.city).filter(c=>typeof c==='string'&&c.trim()))].sort((a,b)=>a.localeCompare(b,'fi'));
    const existing=new Set([...select.options].map(o=>o.value));
    for(const name of names){if(existing.has(name))continue;const o=document.createElement('option');o.value=o.textContent=name;select.append(o);}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',populate,{once:true});else populate();
})();
