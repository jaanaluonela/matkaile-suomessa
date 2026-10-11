/* Matkailu Suomessa v256 – etusivun haku ilman päällekkäisiä maakuntavalintoja. */
(()=>{'use strict';
const start=()=>{
  const input=document.getElementById('place-search'),results=document.getElementById('search-results');
  const regions=window.msFinlandRegions2026||{},aliases=window.msPlaceAliases253||{};
  const initial=new URLSearchParams(location.search).get('maakunta');
  const scope=document.getElementById('home-scope-v255'),scopeLabel=document.getElementById('home-scope-label-v255'),clear=document.getElementById('home-clear-region-v255');
  const links=['maakunnat.html','leirintaalueet.html','matkaparkit.html'];
  function cards(region){
    links.forEach(page=>{
      const a=document.querySelector('main .home-choices-v212 a[href^="'+page+'"]');if(!a)return;
      a.href=region?page+'?maakunta='+encodeURIComponent(region):page;
      const small=a.querySelector('small');
      const msg={'maakunnat.html':'Kunnat ja niiden palvelut','leirintaalueet.html':'Löydä leirintäalue yöksi','matkaparkit.html':'Paikka autolle tai vaunulle'};
      if(small)small.textContent=region?region+' · '+msg[page]:msg[page];
    });
    if(scope&&scopeLabel){scope.hidden=!region;scopeLabel.textContent=region||'';}
  }
  if(initial&&Object.hasOwn(regions,initial))cards(initial);
  if(clear)clear.addEventListener('click',()=>{const u=new URL(location.href);u.searchParams.delete('maakunta');history.replaceState(null,'',u);cards('')});
  if(!input||!results)return;
  const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let previous=[];try{if(typeof places!=='undefined'&&Array.isArray(places))previous=places}catch(_){}
  const valid=x=>x&&typeof x.name==='string'&&typeof x.url==='string'&&/^[^?#]+\.html(?:[?#].*)?$/.test(x.url);
  const records=Object.entries(regions).flatMap(([r,ts])=>ts.map(t=>({name:t,group:r,...window.msTownUrl253(t)})))
     .concat(Object.entries(aliases).filter(([_,a])=>a.url).map(([n,a])=>({name:n,group:a.town,url:a.url,ready:true})))
     .concat(Object.keys(regions).map(r=>({name:r,group:'Maakunta',url:'maakunnat.html?maakunta='+encodeURIComponent(r),ready:true})))
     .concat(previous.concat(window.visitHighlights||[],window.caravanPlaces||[]).filter(valid).map(x=>({name:x.name,group:x.meta||x.city||'Kohde',url:x.url,ready:true})));
  function update(){
    const q=norm(input.value.trim());if(!q){results.replaceChildren();results.classList.remove('is-open');return;}
    const hits=records.filter(x=>norm(x.name).includes(q)).sort((a,b)=>Number(norm(a.name)!==q)-Number(norm(b.name)!==q)||a.name.localeCompare(b.name,'fi')).slice(0,9);
    results.replaceChildren();if(!hits.length){const a=document.createElement('a');a.href='maakunnat.html?haku='+encodeURIComponent(input.value.trim());a.textContent='Etsi maakunnista ja kunnista →';results.append(a)}
    hits.forEach(x=>{const a=document.createElement('a');a.href=x.url;const label=document.createElement('span');label.textContent=x.name;const small=document.createElement('small');small.textContent=x.group+(x.ready?'':' · perustietokortti');a.append(label,small);results.append(a)});
    results.classList.add('is-open');
  }
  input.addEventListener('input',()=>requestAnimationFrame(update));
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&input.value.trim()){const a=results.querySelector('a[href]');if(a){e.preventDefault();location.href=a.href}}});
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
