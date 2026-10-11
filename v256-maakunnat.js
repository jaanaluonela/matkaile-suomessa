/* Matkailu Suomessa v256 – maakunnat pohjoisesta etelään, kunnat samalla sivulla. */
(()=>{'use strict';
 const order=['Lappi','Pohjois-Pohjanmaa','Kainuu','Keski-Pohjanmaa','Pohjanmaa','Pohjois-Karjala','Pohjois-Savo','Etelä-Pohjanmaa','Keski-Suomi','Etelä-Savo','Satakunta','Pirkanmaa','Etelä-Karjala','Päijät-Häme','Kanta-Häme','Kymenlaakso','Varsinais-Suomi','Ahvenanmaa','Uusimaa'];
 const regions=window.msFinlandRegions2026||{};
 const list=document.getElementById('regions-list'),search=document.getElementById('region-search'),status=document.getElementById('regions-status');
 if(!list||!search||!status)return;
 const normalize=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const url=new URLSearchParams(location.search),requested=url.get('maakunta')||'',initSearch=url.get('haku')||'';
 let focusedRegion=Object.hasOwn(regions,requested)?requested:'';
 let favorites=[];
 try{let s=JSON.parse(localStorage.getItem('ms_favorite_towns_v253')||'[]');if(Array.isArray(s))favorites=s.filter(x=>typeof x==='string')}catch(_){}
 function saveFavorites(){try{localStorage.setItem('ms_favorite_towns_v253',JSON.stringify(favorites))}catch(_){}}
 function townUrl(name){return typeof window.msTownUrl253==='function'?window.msTownUrl253(name):{url:'kuntakortti.html?kunta='+encodeURIComponent(name),ready:false}}
 function townButton(name){
   const item=document.createElement('div');item.className='region-town';
   const a=document.createElement('a'),dest=townUrl(name);a.href=dest.url;a.textContent=name;
   const sub=document.createElement('small');sub.textContent=dest.ready?'Avaa matkailuopas →':'Perustietokortti →';a.append(sub);
   const heart=document.createElement('button');heart.type='button';heart.textContent=favorites.includes(name)?'♥':'♡';
   heart.setAttribute('aria-label',(favorites.includes(name)?'Poista suosikeista: ':'Lisää suosikkeihin: ')+name);
   heart.setAttribute('aria-pressed',String(favorites.includes(name)));
   heart.addEventListener('click',()=>{if(favorites.includes(name))favorites=favorites.filter(x=>x!==name);else favorites.push(name);saveFavorites();heart.textContent=favorites.includes(name)?'♥':'♡';heart.setAttribute('aria-pressed',String(favorites.includes(name)));heart.setAttribute('aria-label',(favorites.includes(name)?'Poista suosikeista: ':'Lisää suosikkeihin: ')+name)});
   item.append(a,heart);return item;
 }
 function setAddress(region){const u=new URL(location.href);if(region)u.searchParams.set('maakunta',region);else u.searchParams.delete('maakunta');u.searchParams.delete('haku');history.replaceState(null,'',u)}
 function render(){
  const q=normalize(search.value.trim());list.replaceChildren();let shown=0,matchedTowns=0;
  for(const name of order){
   if(!Object.hasOwn(regions,name))continue;
   const towns=regions[name],nameMatches=normalize(name).includes(q);
   const matches=!q||nameMatches?towns:towns.filter(x=>normalize(x).includes(q));
   if(q&&!matches.length)continue;
   shown++;matchedTowns+=matches.length;
   const d=document.createElement('details');d.className='region-card';d.id='maakunta-'+normalize(name).replace(/[^a-z0-9]+/g,'-');d.dataset.name=name;
   d.open=Boolean(q||focusedRegion===name);
   const header=document.createElement('summary');header.setAttribute('aria-label',name+', '+towns.length+' kuntaa');
   const title=document.createElement('strong');title.textContent=name;
   const arrow=document.createElement('span');arrow.className='region-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='→';header.append(title,arrow);d.append(header);
   const content=document.createElement('div');content.className='region-content';
   const meta=document.createElement('p');meta.className='region-meta';meta.textContent=q&&!nameMatches?matches.length+' kuntaa löytyi':'Kunnat ('+towns.length+')';content.append(meta);
   const grid=document.createElement('div');grid.className='region-towns';matches.forEach(t=>grid.append(townButton(t)));content.append(grid);
   const guide=(window.msRegionGuides254||{})[name];
   if(guide){const a=document.createElement('a');a.className='region-guide';a.href=guide;a.textContent='Tutustu maakunnan matkailukohteisiin →';content.append(a)}
   d.append(content);list.append(d);
   d.addEventListener('toggle',()=>{
    if(q)return;
    if(d.open){
      focusedRegion=name;
      list.querySelectorAll('details.region-card').forEach(other=>{if(other!==d)other.open=false});
      setAddress(name);
    }else if(focusedRegion===name){focusedRegion='';setAddress('')}
   });
  }
  if(!shown){const p=document.createElement('p');p.className='regions-empty';p.textContent='Ei osumia. Kokeile toista maakunnan tai kunnan nimeä.';list.append(p)}
  status.textContent=q?shown+' maakuntaa · '+matchedTowns+' kuntaa hakutuloksissa':shown+' maakuntaa · valitse maakunta nähdäksesi kunnat';
 }
 if(initSearch)search.value=initSearch;
 search.addEventListener('input',()=>{focusedRegion='';render()});
 if(order.every(n=>Array.isArray(regions[n]))){render();if(focusedRegion){requestAnimationFrame(()=>{const el=Array.from(list.children).find(x=>x.dataset.name===focusedRegion);if(el)el.scrollIntoView({block:'start'});});}}
 else{status.textContent='Maakuntien kuntaluetteloa ei saatu ladattua. Tarkista, että suomi-kunnat-v253.js on sivustolla.';}
})();
