/* v341: alavalikon vaihtoehto 2, neljä linkkiä jokaisella sivulla, ja Oulun seudun sisältö. Muut sivuston toiminnot säilyvät. */
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
 function nav(){
   // Both legacy bottom bars and the previous version are removed, not layered.
   // Säilytetään tietokoneversion alkuperäinen navigointi. Mobiilissa vaihdetaan 4 linkin palkkiin.
   if(window.matchMedia('(max-width:899px)').matches) document.querySelectorAll('.site-nav,.bottom-nav,.ms301-nav,.ms302-nav,.ms303-nav,.ms304-nav,.footnav').forEach(el=>el.remove());
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
      const i=elt('span','ms302-icon',icon);i.setAttribute('aria-hidden','true');
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
 function init(){if(window.matchMedia('(max-width:899px)').matches)trimRedundancy();breadcrumb();nav();favoritesPage();saveDetail();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
