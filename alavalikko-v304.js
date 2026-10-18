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

 // v353: yhteinen sivustoilme. Säilyttää sivujen kaikki alkuperäiset kunta- ja kohdetiedot.
 const ms353Paths={
   home:'<path d="m3 10 9-7 9 7v11H3z"/><path d="M9 21v-8h6v8"/>',
   map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15m6-12v15"/>',
   signpost:'<path d="M12 3v19M5 7h15l-3 4H5zm14 7H4l3 4h12z"/>',
   book:'<path d="M12 7c-3-3-6-3-9-2v15c4-1 7 0 9 2 2-2 5-3 9-2V5c-3-1-6-1-9 2zM12 7v15"/>',
   search:'<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>'
 };
 function ms353Icon(key){return '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">'+(ms353Paths[key]||ms353Paths.map)+'</svg>';}
 function ms353Masthead(){
   if(document.querySelector('.ms353-masthead'))return;
   document.body.classList.add('ms353-unified');
   const skip=elt('a','ms353-skip','Siirry sisältöön');skip.href='#ms353-content';document.body.prepend(skip);
   const main=document.querySelector('main')||document.querySelector('.app');
   if(main&&!main.id)main.id='ms353-content';
   if(main&&main.id!=='ms353-content')skip.href='#'+main.id;
   const header=elt('header','ms353-masthead');
   const inr=elt('div','ms353-bar');
   const brand=elt('a','ms353-brand');brand.href=href('index.html');brand.setAttribute('aria-label','Matkaile Suomessa – etusivulle');
   const logo=elt('span','ms353-mark');logo.innerHTML='<svg viewBox="0 0 60 45" aria-hidden="true" focusable="false"><path d="M3 32 16 9l10 18 9-13 15 18Z" fill="#579a74"/><path d="M23 32 38 4l18 28Z" fill="#16543e"/><path d="M3 39c17-8 33 8 54 0" fill="none" stroke="#1689b5" stroke-linecap="round" stroke-width="4"/></svg>';
   const words=elt('span','ms353-words');words.append(elt('strong','','Matkaile Suomessa'),elt('em','','Vapaus kulkea · Ilo löytää'));brand.append(logo,words);
   const toggle=elt('button','ms353-toggle');toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','ms353-navigation');toggle.textContent='Valikko ☰';
   const nav=elt('nav','ms353-links');nav.id='ms353-navigation';nav.setAttribute('aria-label','Matkaile Suomessa – sivustovalikko');
   const links=[['index.html','Koti'],['maakunnat.html','Paikkakunnat'],['leirintaalueet.html','Yöpymispaikat'],['pysahdy-matkalla.html','Pysähdy matkalla'],['saariston-rengastie.html','Saariston rengastie'],['reittisuunnittelu.html','Suunnittele reitti'],['paivakirja.html','Omat matkat']];
   for(const [target,label] of links){const a=elt('a','',label);a.href=href(target);if(file===target || (file==='matkaparkit.html'&&target==='leirintaalueet.html'))a.setAttribute('aria-current','page');nav.append(a);}
   toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('ms353-open',open)});
   nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('ms353-open');toggle.setAttribute('aria-expanded','false');}});
   inr.append(brand,toggle,nav);header.append(inr);skip.after(header);
   // Vanhat vaakunat, asukaslukutiedot ja lähdelinkit jäävät omille paikoilleen.
   document.querySelectorAll('aside.facts,aside.ms334-facts,.lap282-facts').forEach(el=>el.classList.add('ms353-municipality-facts'));
 }
 function nav(){
   // Both legacy bottom bars and the previous version are removed, not layered.
   // Säilytetään tietokoneversion alkuperäinen navigointi. Mobiilissa vaihdetaan 4 linkin palkkiin.
   if(window.matchMedia('(max-width:899px)').matches) document.querySelectorAll('.site-nav,.bottom-nav,.ms301-nav,.ms302-nav,.ms303-nav,.ms304-nav,.footnav').forEach(el=>el.remove());
   const bar=elt('nav','ms302-nav');bar.setAttribute('aria-label','Sivuston päävalikko');
   const inner=elt('div','ms302-nav-inner');
   const links=[
     ['index.html','home','Koti',home],
     ['maakunnat.html','map','Paikkakunnat',['maakunnat.html','kunnat.html'].includes(file)],
     ['pysahdy-matkalla.html','signpost','Pysähdy matkalla',stopFiles.has(file)],
     ['paivakirja.html','book','Omat matkat',file==='paivakirja.html']
   ];
   for(const [target,icon,label,active] of links){
      const a=elt('a',active?'ms302-active':'');a.href=href(target);
      if(active)a.setAttribute('aria-current','page');
      const i=elt('span','ms302-icon');i.innerHTML=ms353Icon(icon);i.setAttribute('aria-hidden','true');
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
   const oldReturn=old&&old.href?{href:old.href,label:old.textContent.trim().replace(/^[‹←\s]+/,'')}:null;
   if(old)old.remove();
   const existing=main.querySelector(':scope > .ms302-crumb');if(existing)existing.remove();
   const crumb=elt('nav','ms302-crumb');crumb.setAttribute('aria-label','Sivupolku');
   const a=elt('a','','Etusivu');a.href=href('index.html');crumb.append(a);
   if(p?.[1]||oldReturn){const back=p?.[1]?{href:href(p[1]),label:p[2]}:oldReturn; if(back&&back.href){crumb.append(elt('span','','›'));const b=elt('a','',back.label);b.href=back.href;crumb.append(b);}}
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
 function ms354Facts(){
  if(document.querySelector('script[data-ms354]'))return;
  const css=document.createElement('link');css.rel='stylesheet';css.href=href('kuntatiedot-v354.css?v=354');document.head.append(css);
  const data=document.createElement('script');data.src=href('kuntatiedot-v354-data.js?v=354');data.async=false;data.dataset.ms354='data';
  const logic=document.createElement('script');logic.src=href('kuntatiedot-v354.js?v=354');logic.async=false;logic.dataset.ms354='logic';
  // Browsers execute non-async dynamically inserted classic scripts in insertion order.
  document.head.append(data,logic);
 }
 function init(){ms353Masthead();ms354Facts();if(window.matchMedia('(max-width:899px)').matches)trimRedundancy();breadcrumb();nav();favoritesPage();saveDetail();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
