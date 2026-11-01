(()=>{'use strict';const $=id=>document.getElementById(id),data=window.nearbyData||[],origins=window.nearbyOrigins||[],labels={camping:'Leirintäalue',park:'Matkaparkki',sight:'Nähtävyys / retkikohde',stop:'Pysähdy matkalla'};let origin=null,request=0;
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
function distance(a,b){const rad=v=>v*Math.PI/180,dlat=rad(b.lat-a.lat),dlon=rad(b.lon-a.lon),h=Math.sin(dlat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dlon/2)**2;return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));}
function el(tag,text,cls){const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;}
function safeUrl(url){try{const u=new URL(url,location.href);return ['http:','https:','file:'].includes(u.protocol)?u.href:null;}catch{return null;}}
let found=[],limit=6;
function matches(p,k){const t=normalize([p.name,p.description,p.type].filter(Boolean).join(' '));if(k==='all')return true;if(k==='highlights')return ['sight','stop'].includes(p.type);if(k==='camping'||k==='park')return p.type===k;if(k==='nature')return p.type==='sight'&&/luonto|retki|polku|puisto|mets|laavu|vaellus|ulkoilu/.test(t);if(k==='food')return p.type==='stop'&&/kahvi|ravintola|ruoka|lounas|leipomo|grilli|pizzeria/.test(t);if(k==='kids')return /laps|perhe|leikki|eläinpuisto|huvipuisto|seikkailupuisto/.test(t);if(k==='sight')return p.type==='sight'&&!matches(p,'nature');if(k==='stop')return p.type==='stop'&&!matches(p,'food');return false;}
function draw(){const box=$('results');box.replaceChildren();$('count').textContent=found.length+' kohdetta · '+($('sort').value==='name'?'aakkosjärjestyksessä':'lähimmästä alkaen');if(!found.length)box.append(el('p','Kohteita ei löytynyt. Kokeile suurempaa etäisyyttä tai toista kategoriaa.'));for(const p of found.slice(0,limit)){const card=el('article',null,'result');const top=el('div',null,'result-top');const icon=el('span',p.type==='camping'?'🏕️':p.type==='park'?'🅿️':p.type==='sight'?'🌲':'☕','result-icon');const details=el('div');details.append(el('h2',p.name));const meta=el('p',p.city+' · '+(labels[p.type]||''),'meta');meta.append(' ',el('span',new Intl.NumberFormat('fi-FI',{maximumFractionDigits:1}).format(p.d)+' km','distance'));details.append(meta);if(p.description)details.append(el('p',p.description));top.append(icon,details);card.append(top);const actions=el('div',null,'actions');const href=safeUrl(p.url);if(href){const link=el('a','Tutustu →');link.href=href;actions.append(link);}const link=el('a',p.map_only?'Näytä kartalla ↗':'Ajo-ohje ↗');link.href=p.map_only?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.lat+','+p.lon):'https://www.google.com/maps/dir/?api=1&origin='+origin.lat+','+origin.lon+'&destination='+encodeURIComponent(p.lat+','+p.lon)+'&travelmode=driving';link.target='_blank';link.rel='noopener';actions.append(link);card.append(actions);box.append(card);}$('show-more').hidden=found.length<=limit;}
function render(){if(!origin)return;const k=$('kind').value,radius=Number($('radius').value);found=data.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon)&&matches(p,k)).map(p=>({...p,d:distance(origin,p)})).filter(p=>p.d<=radius).sort($('sort').value==='name'?(a,b)=>a.name.localeCompare(b.name,'fi'):(a,b)=>a.d-b.d||a.name.localeCompare(b.name,'fi'));limit=6;$('result-section').hidden=false;draw();}
for(const p of origins){const o=document.createElement('option');o.value=p.name;$('origins').append(o);}
$('choose').addEventListener('click',()=>{const input=normalize($('origin').value);const place=origins.find(p=>normalize(p.name)===input||(p.aliases||[]).some(a=>normalize(a)===input));if(!place){$('status').textContent='Valitse lähtöpaikka ehdotuslistasta. Kaikkia paikkakuntia ei vielä ole mukana.';return;}request++;$('locate').disabled=false;$('search').disabled=false;origin={lat:place.lat,lon:place.lon};$('status').textContent='Lähtöpaikka: '+place.name+' (keskusta).';render();});
function showLocationError(message){
 origin=null;$('result-section').hidden=true;$('count').textContent='';$('status').textContent=message;
 $('results').replaceChildren(el('p',message));
 $('status').scrollIntoView?.({behavior:'smooth',block:'center'});
}
function locate(){
 if($('locate').disabled)return;
 if(!navigator.geolocation){showLocationError('Sijainti ei ole käytettävissä tässä selaimessa. Kirjoita lähtöpaikka yllä olevaan kenttään.');return;}
 const token=++request;
 $('locate').disabled=true;$('search').disabled=true;
 $('status').textContent='Haetaan sijaintiasi… Salli selaimen sijaintipyyntö.';
 $('count').textContent='';$('results').replaceChildren(el('p','Haetaan sijaintiasi…'));
 const finish=()=>{$('locate').disabled=false;$('search').disabled=false;};
 try{navigator.geolocation.getCurrentPosition(p=>{
  if(token!==request)return;finish();
  origin={lat:p.coords.latitude,lon:p.coords.longitude};$('origin').value='';
  $('status').textContent='Nykyinen sijainti käytössä.';render();
  $('count').scrollIntoView?.({behavior:'smooth',block:'start'});
 },e=>{
  if(token!==request)return;finish();
  showLocationError(e.code===1?'Sijaintilupaa ei annettu. Salli sijainti selaimen asetuksista tai kirjoita lähtöpaikka yllä olevaan kenttään.':e.code===3?'Sijainnin haku aikakatkaistiin. Yritä uudelleen tai kirjoita lähtöpaikka yllä olevaan kenttään.':'Sijaintia ei saatu. Yritä uudelleen tai kirjoita lähtöpaikka yllä olevaan kenttään.');
 },{timeout:15000,maximumAge:60000,enableHighAccuracy:false});}
 catch(e){finish();showLocationError('Sijainti ei ole käytettävissä. Kirjoita lähtöpaikka yllä olevaan kenttään.');}
}
$('locate').addEventListener('click',locate);$('origin').addEventListener('keydown',e=>{if(e.key==='Enter'){$('choose').click();e.preventDefault();}});$('kind').addEventListener('change',render);$('sort').addEventListener('change',render);document.querySelectorAll('[data-kind]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-kind]').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});$('kind').value=btn.dataset.kind;render();}));$('show-more').addEventListener('click',()=>{limit+=6;draw();});function tab(map){$('list-tab').classList.toggle('active',!map);$('map-tab').classList.toggle('active',map);$('results').hidden=map;$('show-more').style.display=map?'none':'';$('map-results').hidden=!map;if(map){const box=$('map-results');box.replaceChildren(el('p','Avaa kohteet kartalla:'));for(const p of found.slice(0,30)){const a=el('a',p.name+' ↗');a.href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.lat+','+p.lon);a.target='_blank';a.rel='noopener';a.style.display='block';box.append(a);}}}$('list-tab').addEventListener('click',()=>tab(false));$('map-tab').addEventListener('click',()=>tab(true));$('radius').addEventListener('change',render);
$('search').addEventListener('click',()=>{if($('origin').value.trim()){$('choose').click();}else if(origin){render();}else{locate();return;}if(origin&&$('status').textContent.startsWith('Lähtöpaikka:'))$('results').scrollIntoView?.({behavior:'smooth',block:'start'});});
window.nearbyDistance=distance;
})();
