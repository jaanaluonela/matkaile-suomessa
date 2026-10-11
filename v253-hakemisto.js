/* Matkailu Suomessa v253 – kaikki kunnat, suora selaus ja suosikit. */
(function(){
'use strict';
const regions=window.msFinlandRegions2026||{};
const info=document.getElementById('v253-status'),host=document.getElementById('v253-results');
const regionSel=document.getElementById('v253-region'),query=document.getElementById('v253-query'),filter=document.getElementById('v253-filter');
if(!info||!host||!regionSel||!query||!filter)return;
const all=Object.entries(regions).flatMap(([region,towns])=>towns.map(name=>({region,name})));
const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const safeFavorites=()=>{try { const a=JSON.parse(localStorage.getItem('ms_favorite_towns_v253')||'[]');return Array.isArray(a)?a.filter(x=>typeof x==='string'):[]; }catch(_){return []}};
let favorites=new Set(safeFavorites()), expanded=new Set();
const setRegion=(name)=>{regionSel.value=name;query.value='';filter.value='all';render();setURL(name);};
const setURL=name=>{const u=new URL(location.href);if(name)u.searchParams.set('maakunta',name);else u.searchParams.delete('maakunta');u.searchParams.delete('haku');history.replaceState(null,'',u)};
Object.keys(regions).sort((a,b)=>a.localeCompare(b,'fi')).forEach(name=>regionSel.add(new Option(name,name)));
const params=new URLSearchParams(location.search);let initial=params.get('maakunta');
if(regions[initial])regionSel.value=initial;
if(params.get('haku'))query.value=params.get('haku');
const aliases=window.msPlaceAliases253||{};
const aliasRecords=Object.entries(aliases).map(([name,item])=>({name,region:all.find(t=>t.name===item.town)?.region||'',url:item.url,town:item.town}));
function createTown(name,region,alias){
 const town=document.createElement('div');town.className='v253-town';
 const a=document.createElement('a');
 const direct=alias&&alias.url?{url:alias.url,ready:true}:window.msTownUrl253(alias?alias.town:name);
 a.href=direct.url;a.textContent=name;
 const small=document.createElement('small');small.textContent=alias?alias.town+' · matkakohde':direct.ready?'Avaa matkailuopas →':'Peruskortti – opas täydentyy';
 if(direct.ready)small.className='ready';a.append(small);town.append(a);
 if(!alias){const heart=document.createElement('button');heart.type='button';heart.className='v253-heart';heart.textContent=favorites.has(name)?'♥':'♡';heart.setAttribute('aria-label',(favorites.has(name)?'Poista suosikeista: ':'Lisää suosikkeihin: ')+name);heart.setAttribute('aria-pressed',String(favorites.has(name)));heart.addEventListener('click',()=>{if(favorites.has(name))favorites.delete(name);else favorites.add(name);try{localStorage.setItem('ms_favorite_towns_v253',JSON.stringify([...favorites]))}catch(_){alert('Suosikin tallennus ei onnistunut.')}render();});town.append(heart);}
 return town;
}
function render(){
 const selected=regionSel.value,keyword=norm(query.value.trim()),mode=filter.value;
 host.replaceChildren();let visible=0,groups=0;
 for(const [region,towns] of Object.entries(regions).sort(([a],[b])=>a.localeCompare(b,'fi'))){
  if(selected&&region!==selected)continue;
  const matches=towns.filter(name=>{
   const link=window.msTownUrl253(name);
   return (mode!=='ready'||link.ready)&&(mode!=='favorites'||favorites.has(name))&&(!keyword||norm(name).includes(keyword)||norm(region).includes(keyword));
  });
  const nearbyAliases=mode==='all'&&keyword?aliasRecords.filter(item=>item.region===region&&norm(item.name).includes(keyword)):[];
  if(!matches.length&&!nearbyAliases.length)continue;
  groups++;visible+=matches.length+nearbyAliases.length;
  const d=document.createElement('details');d.className='v253-region';d.dataset.region=region;
  d.open=!!(selected||keyword||mode!=='all'||expanded.has(region));
  const summary=document.createElement('summary');const icon=document.createElement('span');icon.className='v253-region-icon';icon.textContent=region==='Lappi'?'❄️':region==='Kymenlaakso'?'🌲':region==='Ahvenanmaa'?'⛴️':'🗺️';
  const meta=document.createElement('span');meta.className='v253-region-name';const nameEl=document.createElement('strong');nameEl.textContent=region;
  const small=document.createElement('small');small.textContent=matches.length+' / '+towns.length+' kuntaa'+(nearbyAliases.length?' · '+nearbyAliases.length+' matkakohdetta':'');
  meta.append(nameEl,small);const chevron=document.createElement('span');chevron.className='v253-chevron';chevron.textContent='›';summary.append(icon,meta,chevron);d.append(summary);
  const grid=document.createElement('div');grid.className='v253-towns';
  matches.forEach(name=>grid.append(createTown(name,region)));
  nearbyAliases.forEach(item=>grid.append(createTown(item.name,region,item)));
  const guides=window.msRegionGuides254||{};if(guides[region]){const more=document.createElement('a');more.href=guides[region];more.className='v254-more';more.textContent='⭐ Tutustu maakunnan matkailukohteisiin →';d.append(more)}
  d.append(grid);summary.addEventListener('click',()=>{if(d.open)expanded.delete(region);else expanded.add(region)});host.append(d);
 }
 if(!visible){const empty=document.createElement('p');empty.className='v253-empty';empty.textContent=mode==='favorites'?'Suosikkeja ei vielä löytynyt. Voit tallentaa kunnan sydänpainikkeella.':'Ei tuloksia. Kokeile toista hakusanaa tai maakuntaa.';host.append(empty)}
 info.textContent=keyword?'Hakusanalla ”'+query.value.trim()+'” löytyi '+visible+' kohdetta.':mode==='ready'?visible+' valmista kuntasivua '+(selected?'maakunnassa '+selected:'oppaassa')+'.':mode==='favorites'?visible+' suosikkikuntaa.':selected?selected+' · '+visible+' kuntaa.':'Valitse maakunta tai avaa maakunta alta. Kaikki '+all.length+' kuntaa löytyvät luettelosta.';
 document.querySelectorAll('[data-region]').forEach(btn=>{if(btn.tagName==='BUTTON')btn.setAttribute('aria-pressed',String(btn.dataset.region===selected));});
}
regionSel.addEventListener('change',()=>{query.value='';render();setURL(regionSel.value)});
query.addEventListener('input',()=>{render();});
filter.addEventListener('change',render);
document.querySelectorAll('button[data-region]').forEach(b=>b.addEventListener('click',()=>{setRegion(b.dataset.region);document.getElementById('v253-results').scrollIntoView({behavior:'smooth',block:'start'})}));
render();
})();
