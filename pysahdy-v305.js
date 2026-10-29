/* v304: yhden sivun kohdehaku, ei päällekkäisiä tuloksia tai kategoriasivuja. */
(() => {
 'use strict';
 const town=document.getElementById('ms302-town'),input=document.getElementById('ms302-query');
 const results=document.getElementById('ms302-results'),count=document.getElementById('ms302-count');
 const more=document.getElementById('ms302-more'),reset=document.getElementById('ms302-reset');
 if(!town||!input||!results||!count) return;
 const buttons=[...document.querySelectorAll('[data-ms302-category]')];
 const categorySelect=document.getElementById('ms302-category-select');
 const favKey='ms_favorites_v301';
 const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const allowed=new Set(['all','sight','special','nature','stop','ruukki','food','child','outlet','camping','park']);
 const params=new URLSearchParams(location.search);
 let category=allowed.has(params.get('tyyppi'))?params.get('tyyppi'):'all';
 let visible=12;
 const natureName=/kansallispuist|luontopol|retkeil|tuntur|vesiputou|koski|rotko|nakoal|nakotor|jarv|ranta|saari|harju|luola|pitkos|mets|luonto|vaellus|puisto/;
 const natureDesc=/kansallispuist|luontopol|luontokoh|luonnonsuojelualu|retkeilyreit|vaellusreit|nakoalapaik|nakoalatorn|vesiputou|pitkospuu/;
 const foodRx=/kahvil|kahvi|munkki|leipomo|teehetk|vohveli|cafe|paviljonki|ravintol|ruokail|lounas|bistro|illallinen|ruokaa|keittio|konditoria/;
 const childNames=new Set([
   'Orimattila|Orimattilan kotieläinpuisto','Lahti|Launeen perhepuisto','Heinola|Perhepuisto Bongari',
   'Asikkala|Kalmarinranta – Vääksyn Riviera','Asikkala|Vääksyn lasten liikennepuisto',
   'Asikkala|Vääksyn lasten leikkipuisto jokivarressa','Kuusamo|Rosa & Rudolf Family Park',
   'Kuusamo|Kuusamon Tropiikki','Kuusamo|Angry Birds Activity Park',
   'Sotkamo|Holiday Club Katinkulta – kylpylä'
 ]);
 // Prioritize the dedicated ruukkikyla entries, then shared visit highlights and nearby items.
 const raw=[...(window.ms364LastenKohteet||[]),...(window.ms305Erikoiset||[]),...(window.ms302Ruukit||[]),...(window.msFactoryOutlets||[]),{name:'Pyynikin munkkikahvila ja näkötorni',city:'Tampere',address:'Näkötornintie 20, Tampere',description:'Munkki- ja kahvitauko Pyynikin näkötornin juurella sekä järvimaisemia tornista.',type:'stop',url:'tampere-pyynikin-munkkikahvila.html'},...(window.visitHighlights||[]),...(window.nearbyData||[]),...(window.caravanPlaces||[])];
 const known=new Set();
 const items=raw.filter(p=>p && p.name && p.city && ['ruukki','sight','stop','nature','outlet','camping','park'].includes(p.type)).map(p=>{
   const nature=p.type==='nature'||(p.type==='sight' && (natureName.test(norm(p.name))||natureDesc.test(norm(p.description))));
   const food=p.type==='stop' && foodRx.test(norm(p.name+' '+(p.description||'')));
   return {...p,nature,food,child:!!p.child||childNames.has(p.city+'|'+p.name),kind:p.type==='ruukki'?'ruukki':p.type==='nature'?'sight':p.type};
 }).filter(p=>{
   const key=norm(p.city).replace(/\W/g,'')+'|'+norm(p.name).replace(/\W/g,'');
   if(known.has(key))return false;
   known.add(key);return true;
 }).sort((a,b)=>String(a.city).localeCompare(String(b.city),'fi')||String(a.name).localeCompare(String(b.name),'fi'));
 // Maakunnat ja kunnat: käytetään sivuston virallista kuntaluetteloa.
 const regions=window.msFinlandRegions2026||{};
 const municipalityToRegion=new Map();
 Object.entries(regions).forEach(([region,cities])=>cities.forEach(city=>{
   municipalityToRegion.set(norm(city),region);
 }));
 // Kohteissa voi olla kaupunginosia, matkailualueita tai vaihtoehtoisia paikannimiä.
 const aliases={'vääksy':'Asikkala','vuokatti':'Sotkamo','ruka':'Kuusamo','levi':'Kittilä','ylläs':'Kolari','saariselkä':'Inari','fiskars':'Raasepori','billnäs':'Raasepori','mathildedal':'Salo','teijo':'Salo','tahko':'Kuopio','himos':'Jämsä'};
 const regionOf=p=>{
   const direct=String(p.region||p.maakunta||'').trim();
   if(regions[direct])return direct;
   const city=norm(p.city).trim();
   return municipalityToRegion.get(city)||municipalityToRegion.get(norm(aliases[city]||''))||'';
 };
 Object.keys(regions).sort((a,b)=>a.localeCompare(b,'fi')).forEach(r=>{
   const option=document.createElement('option');option.value=option.textContent=r;town.append(option);
 });
 const requestedRegion=params.get('maakunta');
 if(requestedRegion&&regions[requestedRegion])town.value=requestedRegion;
 else {
   // Vanhat kunta-linkit toimivat edelleen: rajaa oikeaan maakuntaan ja hae kunnan nimellä.
   const oldTown=params.get('kunta');
   const oldRegion=municipalityToRegion.get(norm(oldTown));
   if(oldRegion){town.value=oldRegion;if(!params.get('haku')&&!params.get('q'))params.set('haku',oldTown);}
 }
 input.value=params.get('haku')||params.get('q')||'';
 const matchesType=p=>{
   if(category==='all')return true;
   if(category==='camping'||category==='park')return p.kind===category;
   if(category==='special')return !!p.special;
   if(category==='child')return !!p.child;
   if(category==='ruukki')return p.kind==='ruukki';
   if(category==='outlet')return p.kind==='outlet';
   if(category==='nature')return p.nature;
   if(category==='sight')return p.special||p.kind==='sight'&&!p.nature;
   if(category==='stop')return p.kind==='stop'&&!p.food;
   if(category==='food')return p.food;
   return true;
 };
 const label=p=>p.kind==='camping'?'🏕️ Leirintäalue':p.kind==='park'?'🅿️ Matkaparkki':p.child?'🎈 Lapsille':p.special?'✨ Erikoinen nähtävyys':p.kind==='ruukki'?'🏭 Ruukkikylä':p.kind==='outlet'?'🛍️ Tehtaanmyymälä':p.nature?'🌲 Luonto ja retket':p.kind==='sight'?'🏛️ Nähtävyys':p.food?'☕ Kahvila tai ravintola':'🚐 Taukopaikka';
 function favorites(){try {const a=JSON.parse(localStorage.getItem(favKey)||'[]');return Array.isArray(a)?a:[];}catch{return [];}}
 function makeFavorite(p){
    const a=document.createElement('button');a.type='button';a.className='ms302-favorite';
    const link='pysahdy-matkalla.html?tyyppi='+encodeURIComponent(['camping','park'].includes(p.kind)?p.kind:p.child?'child':p.kind==='ruukki'?'ruukki':p.kind==='outlet'?'outlet':p.food?'food':p.nature?'nature':p.kind)+'&haku='+encodeURIComponent(p.name);
    const update=()=>{const isSaved=favorites().some(x=>x.url===link);a.setAttribute('aria-pressed',String(isSaved));a.textContent=isSaved?'⭐ Tallennettu':'☆ Suosikki';};
    a.addEventListener('click',()=>{const f=favorites();const ix=f.findIndex(x=>x.url===link);
      if(ix>=0)f.splice(ix,1);else f.unshift({url:link,title:p.name+' · '+p.city,savedAt:new Date().toISOString()});
      try{localStorage.setItem(favKey,JSON.stringify(f));update();}catch{alert('Suosikkia ei voitu tallentaa selaimeen.');}
    });update();return a;
 }
 function action(parent,txt,href){
   if(!href)return;
   const u=String(href).trim();
   if(!(/^https:\/\//i.test(u)||/^[\w./%-]+\.html(?:[?#][^\s]*)?$/i.test(u)))return;
   const a=document.createElement('a');a.textContent=txt;a.href=u;
   if(/^https:\/\//i.test(u)){a.target='_blank';a.rel='noopener noreferrer';}
   parent.append(a);
 }
 function card(p){
   const card=document.createElement('article');card.className='ms302-result';
   const tag=document.createElement('span');tag.className='ms302-tag';tag.textContent=p.city+' · '+label(p);
   const title=document.createElement('strong');title.textContent=p.name;
   card.append(tag,title);
   if(p.description){const d=document.createElement('p');d.textContent=p.description;card.append(d);}
   const actions=document.createElement('div');actions.className='ms302-actions';
   action(actions,'Tutustu',p.url);
   if(p.website)action(actions,'Omat sivut',p.website);
   action(actions,'📍 Kartalle',p.mapUrl||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+' '+p.city));
   actions.append(makeFavorite(p));card.append(actions);return card;
 }
 function saveUrl(){const url=new URL(location.href);
   for(const [k,v] of [['tyyppi',category==='all'?'':category],['maakunta',town.value],['haku',input.value.trim()]]){
     if(v)url.searchParams.set(k,v);else url.searchParams.delete(k);
   }
   url.searchParams.delete('kunta');url.searchParams.delete('q');history.replaceState(null,'',url);
 }
 function render(){
   const q=norm(input.value.trim());
   const matches=items.filter(p=>matchesType(p)&&(!town.value||regionOf(p)===town.value)&&(!q||norm([p.name,p.city,p.region,p.description,p.address].join(' ')).includes(q)));
   const uniqueCount=matches.length;
   count.textContent=(town.value||'Koko Suomi')+' · '+uniqueCount+(uniqueCount===1?' kohde':' kohdetta');
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ms302Category===category)));
   if(categorySelect)categorySelect.value=category;
   results.replaceChildren(...matches.slice(0,visible).map(card));
   if(!matches.length){const empty=document.createElement('p');empty.className='ms302-empty';
     empty.textContent=items.length?'Ei osumia. Kokeile toista hakusanaa tai valitse Kaikki.':'Kohdetietoja ei voitu ladata. Kokeile päivittää sivu.';results.append(empty);}
   more.hidden=matches.length<=visible;
   if(!more.hidden)more.textContent='Näytä lisää ('+Math.min(12,matches.length-visible)+' seuraavaa)';
 }
 function update(){visible=12;saveUrl();render();}
 buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.ms302Category;update();}));
 categorySelect?.addEventListener('change',()=>{category=categorySelect.value;update();});
 input.addEventListener('input',update);town.addEventListener('change',update);
 more.addEventListener('click',()=>{visible+=12;render();});
 reset.addEventListener('click',()=>{category='all';town.value='';input.value='';update();input.focus();});
 render();
})();
