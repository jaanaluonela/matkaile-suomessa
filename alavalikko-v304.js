/* v328: alavalikon vaihtoehto 2 ja Oulun seudun sisältö. Muut sivuston toiminnot säilyvät. */
(() => {
 'use strict';
 const source=document.currentScript?.src||location.href;
 const base=new URL('.',source);
 const href=path=>new URL(path,base).href;
 const file=(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const home=file==='index.html';
 const stopFiles=new Set(['pysahdy-matkalla.html','kayntikohteet.html','ruukkikylat.html']);
 const fav=file==='suosikit.html';
 // Legacy links keep functioning, but lead to the single combined search.
 if(file==='kayntikohteet.html'||file==='ruukkikylat.html'){
   const url=new URL(href('pysahdy-matkalla.html'));
   const q=new URLSearchParams(location.search);
   if(file==='ruukkikylat.html')q.set('tyyppi','ruukki');
   else if(!q.has('tyyppi'))q.set('tyyppi','all');
   url.search=q.toString();
   location.replace(url.href);return;
 }
 function elt(name,cls,txt){const el=document.createElement(name);if(cls)el.className=cls;if(txt)el.textContent=txt;return el;}
 // v328: samaa kuvitustyyliä kuin etusivun suurissa painikkeissa.
 const navArt={
  'index.html': `<svg viewBox="0 0 62 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#d9efda" d="M3 42h56v6H3z"/><path fill="#f7e0aa" stroke="#668a69" stroke-width="1.5" d="M17 24h30v23H17z"/><path fill="#c65737" d="M12 26 32 8l20 18-4 4-16-15-16 15z"/><rect fill="#7ba8bb" x="22" y="29" width="8" height="8" rx="1"/><rect fill="#b98252" x="35" y="32" width="9" height="15" rx="1"/><circle fill="#70a75d" cx="8" cy="36" r="7"/><rect fill="#825f45" x="7" y="39" width="2" height="9"/></svg>`,
  'maakunnat.html': `<svg viewBox="0 0 62 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#b4dba8" stroke="#9fc9a1" stroke-width="1" d="m6 19 15-4 20 4 15-5v31l-15 4-20-4-15 4z"/><path fill="#f4edd1" d="m21 15 20 4v30l-20-4z"/><path fill="#8dc4d7" d="m7 34 14-3 20 4 14-5v6l-14 6-20-5-14 5z"/><path d="M33 2a11 11 0 0 0-11 11c0 9 11 21 11 21S44 22 44 13A11 11 0 0 0 33 2z" fill="#ef5d3d"/><circle cx="33" cy="13" r="4.3" fill="#fff"/></svg>`,
  'pysahdy-matkalla.html': `<svg viewBox="0 0 62 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#d9eddb" d="M3 45h56v5H3z"/><path fill="#3d815d" d="M17 2 5 21h7L3 33h27l-9-12h6z"/><path fill="#34664e" d="M17 13 7 31h20z"/><rect fill="#8b694d" x="15" y="31" width="4" height="16"/><path d="M25 31h21v5H25z" fill="#af7850"/><path d="M28 36v9M43 36v9" stroke="#805b3b" stroke-width="3"/><path d="M45 23h11v12H45z" fill="#dbb48b"/><path d="M55 25h4a4 4 0 0 1 0 8h-4" fill="none" stroke="#b17f55" stroke-width="3"/><path d="M48 17c-4 4 4 4 0 7m5-9c-3 3 3 4 0 7" fill="none" stroke="#d1af93" stroke-width="2"/></svg>`,
  'paivakirja.html': `<svg viewBox="0 0 62 52" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#d1b28c" d="M4 8Q19 4 31 11v36Q19 41 4 45z"/><path fill="#cfb28d" d="M58 8Q43 4 31 11v36q12-6 27-2z"/><path fill="#fff8e6" stroke="#638a7a" stroke-width="2" d="M8 7Q19 4 30 11v33Q19 39 8 43z"/><path fill="#fff8e6" stroke="#638a7a" stroke-width="2" d="M54 7Q43 4 32 11v33q11-5 22-1z"/><path fill="#9ac5d5" d="M12 13h15v14H12zM36 13h15v14H36z"/><path fill="#79ac76" d="m12 27 7-9 8 9zm24 0 6-8 9 8z"/><circle fill="#f0be68" cx="46" cy="17" r="3"/><path d="M14 33h12m-12 4h12m12-4h12m-12 4h12" stroke="#b7a07c" stroke-width="2"/></svg>`
 };
 function nav(){
   // Both legacy bottom bars and the previous version are removed, not layered.
   document.querySelectorAll('.site-nav,.bottom-nav,.ms301-nav,.ms302-nav,.ms303-nav,.ms304-nav,.footnav').forEach(el=>el.remove());
   const bar=elt('nav','ms302-nav');bar.setAttribute('aria-label','Sivuston päävalikko');
   const inner=elt('div','ms302-nav-inner');
   const links=[
     ['index.html','🏡','Koti',home],
     ['maakunnat.html','🗺️','Paikkakunnat',['maakunnat.html','kunnat.html'].includes(file)],
     ['pysahdy-matkalla.html','🌲','Pysähdy matkalla',stopFiles.has(file)],
     ['paivakirja.html','📖','Omat matkat',file==='paivakirja.html']
   ];
   for(const [target,icon,label,active] of links){
      const a=elt('a',active?'ms302-active':'');a.href=href(target);
      if(active)a.setAttribute('aria-current','page');
      const i=elt('span','ms302-icon');i.innerHTML=navArt[target]||icon;i.setAttribute('aria-hidden','true');
      a.append(i,elt('span','ms302-label',label));inner.append(a);
   }
   bar.append(inner);document.body.append(bar);
 }
 function breadcrumb(){
   if(home)return;
   const main=document.querySelector('main');if(!main)return;
   const p={
     'leirintaalueet.html':['Leirintäalueet'], 'matkaparkit.html':['Matkaparkit'],
     'lahella-minua.html':['Lähellä minua'], 'maakunnat.html':['Paikkakunnat'],
     'kunnat.html':['Paikkakunnat'],'pysahdy-matkalla.html':['Pysähdy matkalla'],
     'suosikit.html':['Suosikit'],'sfc-kohde-v292.html':['Kohde','leirintaalueet.html','Leirintäalueet'],
     'ms-kohde-v296.html':['Kohde']
   }[file];
   const h=main.querySelector('h1');
   const label=p?.[0]||(h?.textContent||document.title.split('–')[0]).trim().replace(/^[^\p{L}\p{N}]*/u,'').slice(0,64);
   if(file==='ms-kohde-v296.html' && p){try{const r=new URL(document.referrer);if(r.origin===location.origin){const from=r.pathname.split('/').pop();if(['matkaparkit.html','leirintaalueet.html'].includes(from)){p.push(from,from==='matkaparkit.html'?'Matkaparkit':'Leirintäalueet');}}}catch{}}
   const old=main.querySelector(':scope > a.back,:scope > a.top,:scope > a.ms301-back');
   if(old)old.remove();
   const existing=main.querySelector(':scope > .ms302-crumb');if(existing)existing.remove();
   const crumb=elt('nav','ms302-crumb');crumb.setAttribute('aria-label','Sivupolku');
   const a=elt('a','','Etusivu');a.href=href('index.html');crumb.append(a);
   if(p?.[1]){crumb.append(elt('span','','›'));const b=elt('a','',p[2]);b.href=href(p[1]);crumb.append(b);}
   crumb.append(elt('span','','›'),elt('span','ms302-where',label));
   main.prepend(crumb);
 }
 function trimRedundancy(){
   // Remove a secondary 3-option menu that repeats the homepage buttons.
   if(file==='leirintaalueet.html'||file==='matkaparkit.html'){
      const main=document.querySelector('main');
      const old=main?.querySelector(':scope > .menu');if(old)old.remove();
      const h=main?.querySelector('h1');
      const other=file==='leirintaalueet.html'?'matkaparkit.html':'leirintaalueet.html';
      const label=file==='leirintaalueet.html'?'Matkaparkit':'Leirintäalueet';
      if(h&&!main.querySelector('.ms302-other-stay')){
         const a=elt('a','ms302-other-stay','Katso myös '+label+' →');a.href=href(other);h.after(a);
      }
      const d=main?.querySelector('.v243-page-description');
      if(d)d.textContent=file==='leirintaalueet.html'?'Hae leirintäaluetta nimellä, paikkakunnalla tai palveluilla.':'Hae matkaparkkia nimellä, paikkakunnalla tai palveluilla.';
      const search=main?.querySelector('#v243-stay-search');
      if(search&&file==='leirintaalueet.html')search.placeholder='Esim. Onnela, Tuuri tai sauna';
      if(search&&file==='matkaparkit.html')search.placeholder='Esim. Vääksy, matkaparkki tai sähkö';
   }
 }
 const favKey='ms_favorites_v301';
 function read(){try{const a=JSON.parse(localStorage.getItem(favKey)||'[]');return Array.isArray(a)?a:[];}catch{return [];}}
 function save(data){try{localStorage.setItem(favKey,JSON.stringify(data));return true;}catch{return false;}}
 function favoritesPage(){
   const container=document.getElementById('ms301-favorites-list');if(!container)return;
   const render=()=>{container.replaceChildren();const items=read();
      if(!items.length){const p=elt('p','ms302-empty-favs','Ei tallennettuja suosikkeja. Valitse kiinnostavan kohteen kohdalta ☆ Suosikki.');container.append(p);return;}
      items.forEach(item=>{
        if(!item||typeof item.url!=='string'||!/^(?!\/|https?:|javascript:)[\w./?%=&+#-]+$/i.test(item.url))return;
        const line=elt('div','ms302-fav-line');
        const a=elt('a','',item.title||'Tallennettu kohde');a.href=href(item.url);
        const b=elt('button','','Poista');b.type='button';b.addEventListener('click',()=>{save(read().filter(x=>x.url!==item.url));render();});
        line.append(a,b);container.append(line);
      });
   };render();window.addEventListener('storage',render);
 }
 function saveDetail(){
   if(home||fav||stopFiles.has(file)||['leirintaalueet.html','matkaparkit.html','maakunnat.html','lahella-minua.html','yopyminen.html'].includes(file))return;
   const h=document.querySelector('main h1');if(!h||document.querySelector('.ms301-save,.ms302-detail-save'))return;
   const title=h.textContent.trim();
   const u=new URL(location.href);const basePath=base.pathname;
   if(!u.pathname.startsWith(basePath))return;
   const path=u.pathname.slice(basePath.length)+u.search+u.hash;
   const b=elt('button','ms302-detail-save');b.type='button';
   const refresh=()=>{const saved=read().some(x=>x.url===path);b.textContent=saved?'⭐ Tallennettu':'☆ Lisää suosikkeihin';b.setAttribute('aria-pressed',String(saved));};
   b.addEventListener('click',()=>{const all=read();const index=all.findIndex(x=>x.url===path);
     if(index>=0)all.splice(index,1);else all.unshift({url:path,title,savedAt:new Date().toISOString()});
     if(save(all))refresh();else alert('Tallennus ei onnistunut tällä selaimella.');
   });h.after(b);refresh();
 }
 function loadOulu(){
   const names=new Set(['oulun-seutu.html','pohjois-pohjanmaa.html','oulu.html','kempele.html','liminka.html','hailuoto.html','ii.html','muhos.html','tyrnava.html','lumijoki.html','utajarvi.html']);
   if(!names.has(file))return;
   if(!document.querySelector('link[data-os328]')){
     const l=document.createElement('link');l.rel='stylesheet';l.href=href('oulu-seutu-v328.css?v=328');l.dataset.os328='true';document.head.append(l);
   }
   if(!document.querySelector('script[data-os328]')){
     const s=document.createElement('script');s.src=href('oulu-seutu-v328.js?v=328');s.dataset.os328='true';document.body.append(s);
   }
 }
 function init(){trimRedundancy();breadcrumb();nav();favoritesPage();saveDetail();loadOulu();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
