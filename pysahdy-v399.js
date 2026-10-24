/* v304: yhden sivun kohdehaku, ei päällekkäisiä tuloksia tai kategoriasivuja. */
(() => {
 'use strict';
 const style=document.createElement('style');style.textContent='.ms399-open{position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent;cursor:pointer;border-radius:inherit}.ms399-open:focus-visible{outline:3px solid #215d4f;outline-offset:-4px}.ms302-result .ms396-credit{position:relative;z-index:1;pointer-events:none}.ms302-result .ms396-credit a{pointer-events:auto}.ms399-dialog{box-sizing:border-box;width:min(560px,calc(100% - 28px));max-height:85dvh;overflow:auto;border:1px solid #cbdad1;border-radius:18px;padding:22px;color:#214c3f;background:#fff}.ms399-dialog::backdrop{background:#12382dc0}.ms399-close{display:block;margin-left:auto;min-height:44px;border:0;background:transparent;color:#214c3f;font:700 16px Arial;cursor:pointer}.ms399-dialog h2{margin:8px 0 16px}.ms399-photo img{display:block;width:100%;max-height:300px;object-fit:cover;border-radius:12px}.ms399-dialog .ms302-actions{gap:18px;margin:18px 0}.ms399-dialog .ms302-actions a,.ms399-dialog .ms302-actions button{font-size:17px;min-height:44px;display:inline-flex;align-items:center}.ms399-dialog p{line-height:1.5}';document.head.append(style);
 const town=document.getElementById('ms302-town'),input=document.getElementById('ms302-query');
 const results=document.getElementById('ms302-results'),count=document.getElementById('ms302-count');
 const more=document.getElementById('ms302-more'),reset=document.getElementById('ms302-reset');
 if(!town||!input||!results||!count) return;
 const buttons=[...document.querySelectorAll('[data-ms302-category]')];
 const favKey='ms_favorites_v301';
 const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const allowed=new Set(['all','sight','nature','stop','ruukki','food','kids']);
 const params=new URLSearchParams(location.search);
 let category=allowed.has(params.get('tyyppi'))?params.get('tyyppi'):'all';
 let visible=12;
 const natureName=/kansallispuist|luontopol|retkeil|tuntur|vesiputou|koski|rotko|nakoal|nakotor|jarv|ranta|saari|harju|luola|pitkos|mets|luonto|vaellus|puisto/;
 const natureDesc=/kansallispuist|luontopol|luontokoh|luonnonsuojelualu|retkeilyreit|vaellusreit|nakoalapaik|nakoalatorn|vesiputou|pitkospuu/;
 const foodRx=/kahvil|kahvi|munkki|leipomo|teehetk|vohveli|cafe|paviljonki|ravintol|ruokail|lounas|bistro|illallinen|ruokaa|keittio|konditoria/;
 const kidsRx=/perhepuisto|lasten|leikkipuisto|leikkipaikka|elainpiha|koti(elain|ela in)piha|huvipuisto|seikkailupuisto|muumimaailma|sarkanniemi|linnanmäki|linnan maki|tykkimaki|sisaleikkipuisto|tiedekeskus|lapsiperhe|lapsille/;
 // Prioritize the dedicated ruukkikyla entries, then shared visit highlights and nearby items.
 const raw=[{"name": "Koli", "city": "Lieksa", "region": "Pohjois-Karjala", "description": "Kansallismaisema Ukko-Kolilta Pieliselle.", "type": "nature", "url": "koli.html", "image": "koli-v396.jpg", "imageSource": "https://commons.wikimedia.org/wiki/File:Koli_view_01.jpg", "imageCredit": "aiko99ann", "imageLicense": "CC BY-SA 4.0", "imageYear": "2009"}, {"name": "Yyteri", "city": "Pori", "region": "Satakunta", "description": "Yyterin hiekkaranta ja dyynimaisemat.", "type": "nature", "url": "yyteri.html", "image": "yyteri-v396.jpg", "imageSource": "https://commons.wikimedia.org/wiki/File:Porin_Yyteri_hiekkarantaa_JHo04_2008.JPG", "imageCredit": "J Hokkanen", "imageLicense": "CC BY-SA 4.0", "imageYear": "2008"}, {"name": "Puumalan satama", "city": "Puumala", "region": "Etelä-Savo", "description": "Satamamiljöö Saimaan rannalla.", "type": "stop", "url": "puumalan-satama.html", "image": "puumala-v396.jpg", "imageSource": "https://commons.wikimedia.org/wiki/File:Puumala_Harbour.jpg", "imageCredit": "Eckardt Guenther", "imageLicense": "CC BY-SA 4.0", "imageYear": "2021"}, {"name": "Suomenlinna", "city": "Helsinki", "region": "Uusimaa", "description": "Merilinnoitus Helsingin edustalla.", "type": "sight", "url": "https://www.suomenlinna.fi/", "image": "suomenlinna-v397.jpg", "imageSource": "https://commons.wikimedia.org/wiki/File:Suomenlinna_from_northeast.JPG", "imageCredit": "MKFI", "imageLicense": "Public domain", "imageLicenseUrl": "https://commons.wikimedia.org/wiki/File:Suomenlinna_from_northeast.JPG", "imageYear": "2011"}, {"name": "Olavinlinna", "city": "Savonlinna", "region": "Etelä-Savo", "description": "Keskiaikainen linna Savonlinnassa.", "type": "sight", "url": "https://www.kansallismuseo.fi/fi/olavinlinna", "image": "olavinlinna-v397.jpg", "imageSource": "https://commons.wikimedia.org/wiki/File:Olavinlinna1.jpg", "imageCredit": "Petritap", "imageLicense": "Public domain", "imageLicenseUrl": "https://commons.wikimedia.org/wiki/File:Olavinlinna1.jpg", "imageYear": "2006"}, {"name": "Heureka", "city": "Vantaa", "region": "Uusimaa", "description": "Tiedekeskus koko perheelle.", "type": "sight", "kids": true, "url": "https://www.heureka.fi/", "image": "heureka-v397.jpg", "imageSource": "https://commons.wikimedia.org/wiki/File:Heureka.jpg", "imageCredit": "Danila Talikov", "imageLicense": "CC BY-SA 3.0", "imageLicenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/", "imageYear": "2013"}];
 const known=new Set();
 const regions=window.msFinlandRegions2026||{};
 const regionByTown=new Map(Object.entries(regions).flatMap(([r,towns])=>Array.isArray(towns)?towns.map(t=>[norm(t),r]):[]));
 const imageOf=p=>{const v=p.imageSource?p.image:'';return typeof v==='string' && (/^https:\/\//i.test(v)||/^[\w./%-]+\.(?:jpe?g|png|webp|avif)(?:\?[^\s]*)?$/i.test(v))?v:'';};
 const items=raw.filter(p=>p && p.name && p.city && imageOf(p) && ['ruukki','sight','stop','nature'].includes(p.type)).map(p=>{
   const nature=p.type==='nature'||(p.type==='sight' && (natureName.test(norm(p.name))||natureDesc.test(norm(p.description))));
   const food=p.type==='stop' && foodRx.test(norm(p.name+' '+(p.description||'')));
   const kids=Boolean(p.kids||p.childFriendly||kidsRx.test(norm(p.name+' '+(p.description||''))));
   return {...p,region:p.region||regionByTown.get(norm(p.city))||'',nature,food,kids,kind:p.type==='ruukki'?'ruukki':p.type==='nature'?'sight':p.type};
 }).filter(p=>{
   const name=norm(p.name).replace(/\W/g,'');
   const key=norm(p.city).replace(/\W/g,'')+'|'+(norm(p.city)==='heinola' && /harjupaviljonki/.test(name)?'harjupaviljonki':norm(p.city)==='heinola' && /harjupuisto/.test(name)?'harjupuisto':name.replace(new RegExp('^'+norm(p.city).replace(/\W/g,'')+'n'),''));
   if(known.has(key))return false;
   known.add(key);return true;
 }).sort((a,b)=>String(a.city).localeCompare(String(b.city),'fi')||String(a.name).localeCompare(String(b.name),'fi'));
 [...new Set([...Object.keys(regions),...items.map(p=>p.region).filter(Boolean)])].sort((a,b)=>a.localeCompare(b,'fi')).forEach(c=>{
    const option=document.createElement('option');option.value=option.textContent=c;town.append(option);
 });
 const requestedTown=params.get('maakunta')||regionByTown.get(norm(params.get('kunta')));if([...town.options].some(o=>o.value===requestedTown))town.value=requestedTown;
 input.value=params.get('haku')||params.get('q')||'';
 const matchesType=p=>{
   if(category==='all')return true;
   if(category==='ruukki')return p.kind==='ruukki';
   if(category==='nature')return p.nature;
   if(category==='sight')return p.kind==='sight'&&!p.nature;
   if(category==='stop')return p.kind==='stop'&&!p.food;
   if(category==='food')return p.food;
   if(category==='kids')return p.kids;
   return true;
 };
 const label=p=>p.kids?'Lasten kohde':p.kind==='ruukki'?'Ruukkikylä':p.nature?'Luonto ja retket':p.kind==='sight'?'Nähtävyys':p.food?'Kahvila tai ravintola':'Taukopaikka';
 function favorites(){try {const a=JSON.parse(localStorage.getItem(favKey)||'[]');return Array.isArray(a)?a:[];}catch{return [];}}
 function makeFavorite(p){
    const a=document.createElement('button');a.type='button';a.className='ms302-favorite';
    const link='pysahdy-matkalla.html?tyyppi='+encodeURIComponent(p.kind==='ruukki'?'ruukki':p.food?'food':p.nature?'nature':p.kind)+'&haku='+encodeURIComponent(p.name);
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
   const thumb=document.createElement('div');thumb.className='ms302-thumb';
   const photo=imageOf(p);
   if(photo){const img=document.createElement('img');img.src=photo;img.alt='';img.loading='lazy';thumb.append(img);img.addEventListener('error',()=>{card.remove();});}
   
   const body=document.createElement('div');body.className='ms302-result-body';
   const tag=document.createElement('span');tag.className='ms302-tag';tag.textContent=p.city+' · '+label(p);
   const title=document.createElement('strong');title.textContent=p.name;
   body.append(tag,title);
   if(p.description){const d=document.createElement('p');d.textContent=p.description;body.append(d);}
   card.append(thumb,body);
   const open=document.createElement('button');open.type='button';open.className='ms399-open';
   open.setAttribute('aria-label','Avaa kohde: '+p.name);open.setAttribute('aria-haspopup','dialog');card.style.position='relative';card.append(open);
   open.addEventListener('click',()=>{
     const dialog=document.createElement('dialog');dialog.className='ms399-dialog';dialog.setAttribute('aria-label',p.name);
     const close=document.createElement('button');close.type='button';close.textContent='Sulje ×';close.className='ms399-close';
     close.addEventListener('click',()=>dialog.close());
     const heading=document.createElement('h2');heading.textContent=p.name;
     const image=thumb.cloneNode(true);image.className='ms399-photo';
     const description=document.createElement('p');description.textContent=p.city+' · '+(p.description||label(p));
     const actions=document.createElement('div');actions.className='ms302-actions';
     action(actions,'Tutustu',p.url);
     action(actions,'📍 Kartalle',p.mapUrl||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(p.name+' '+p.city));
     actions.append(makeFavorite(p));dialog.append(close,heading,image,description,actions,credit.cloneNode(true));
     dialog.addEventListener('close',()=>{dialog.remove();open.focus();});
     document.body.append(dialog);dialog.showModal();close.focus();
   });
   const credit=document.createElement('div');credit.className='ms396-credit';action(credit,'Kuva: '+p.imageCredit+' · '+p.imageYear,p.imageSource);action(credit,p.imageLicense,p.imageLicenseUrl||'https://creativecommons.org/licenses/by-sa/4.0/');body.append(credit);return card;
 }
 function saveUrl(){const url=new URL(location.href);
   for(const [k,v] of [['tyyppi',category==='all'?'':category],['maakunta',town.value],['haku',input.value.trim()]]){
     if(v)url.searchParams.set(k,v);else url.searchParams.delete(k);
   }
   url.searchParams.delete('q');url.searchParams.delete('kunta');history.replaceState(null,'',url);
 }
 function render(){
   const q=norm(input.value.trim());
   const matches=items.filter(p=>matchesType(p)&&(!town.value||p.region===town.value)&&(!q||norm([p.name,p.city,p.region,p.description,p.address].join(' ')).includes(q)));
   const uniqueCount=matches.length;
   count.textContent=(town.value||'Koko Suomi')+' · '+uniqueCount+(uniqueCount===1?' kohde':' kohdetta');
   buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ms302Category===category)));
   results.replaceChildren(...matches.map(card));
   if(!matches.length){const empty=document.createElement('p');empty.className='ms302-empty';
     empty.textContent=items.length?'Ei osumia. Kokeile toista hakusanaa tai valitse Kaikki.':'Kohdetietoja tai kohdekuvia ei löytynyt. Kokeile toista maakuntaa.';results.append(empty);}
   more.hidden=true;
   if(!more.hidden)more.textContent='Näytä lisää ('+Math.min(12,matches.length-visible)+' seuraavaa)';
 }
 function update(){visible=12;saveUrl();render();}
 buttons.forEach(b=>b.addEventListener('click',()=>{category=b.dataset.ms302Category;update();}));
 input.addEventListener('input',update);town.addEventListener('change',update);
 more.addEventListener('click',()=>{visible+=12;render();});
 reset.addEventListener('click',()=>{category='all';town.value='';input.value='';update();input.focus();});
 render();
})();
