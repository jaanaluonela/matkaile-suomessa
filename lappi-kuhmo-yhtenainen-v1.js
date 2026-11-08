/* Lapin kuntien yhteinen yläosa. Säilyttää kohdesisällöt ja matkamuistot. */
(()=>{'use strict';
function init(){
 const body=document.body,main=document.querySelector('main');
 if(!body.classList.contains('lappi-kunta-kuhmo')||!main||main.querySelector('.lap-kuhmo-top'))return;
 const title=main.querySelector('h1');if(!title)return;
 const name=title.textContent.trim(),slug=body.dataset.slug||location.pathname.split('/').pop().replace(/\.html$/,'');
 const pop=main.querySelector('#lap-pop-2025'),facts=main.querySelector('.ms375-facts,.facts'),coat=facts?.querySelector('img');
 const lead=main.querySelector('.ms375-lead,.lap281-lead,.lead');
 const intro=document.createElement('div');intro.className='lap-kuhmo-top';
 const back=document.createElement('a');back.className='lap-kuhmo-back';back.href='lappi.html';back.textContent='‹ Lappi';intro.append(back);
 const h=document.createElement('h1');h.textContent=name;intro.append(h);
 if(lead){const p=document.createElement('p');p.className='lap-kuhmo-lead';p.textContent=lead.textContent;intro.append(p)}
 const crestBySlug={"rovaniemi":"rovaniemi-vaakuna.svg","inari":"https://commons.wikimedia.org/wiki/Special:FilePath/Inari.vaakuna.svg","kittila":"kittila-vaakuna.jpg","sodankyla":"sodankyla-vaakuna.svg","enontekio":"https://commons.wikimedia.org/wiki/Special:FilePath/Enonteki%C3%B6.vaakuna.svg","kemi":"https://commons.wikimedia.org/wiki/Special:FilePath/Kemi.vaakuna.svg","kemijarvi":"https://commons.wikimedia.org/wiki/Special:FilePath/Kemij%C3%A4rvi.vaakuna.svg","keminmaa":"https://commons.wikimedia.org/wiki/Special:FilePath/Keminmaa.vaakuna.svg","kolari":"kolari-vaakuna.jpg","muonio":"https://commons.wikimedia.org/wiki/Special:FilePath/Muonio.vaakuna.svg","pelkosenniemi":"https://commons.wikimedia.org/wiki/Special:FilePath/Pelkosenniemi.vaakuna.svg","pello":"https://commons.wikimedia.org/wiki/Special:FilePath/Pello.vaakuna.svg","posio":"https://commons.wikimedia.org/wiki/Special:FilePath/Posio.vaakuna.svg","ranua":"https://commons.wikimedia.org/wiki/Special:FilePath/Ranua.vaakuna.svg","salla":"https://commons.wikimedia.org/wiki/Special:FilePath/Salla.vaakuna.svg","savukoski":"https://commons.wikimedia.org/wiki/Special:FilePath/Savukoski.vaakuna.svg","simo":"https://commons.wikimedia.org/wiki/Special:FilePath/Simo.vaakuna.svg","tervola":"https://commons.wikimedia.org/wiki/Special:FilePath/Tervola.vaakuna.svg","tornio":"https://commons.wikimedia.org/wiki/Special:FilePath/Tornio.vaakuna.svg","utsjoki":"https://commons.wikimedia.org/wiki/Special:FilePath/Utsjoki.vaakuna.svg","ylitornio":"https://commons.wikimedia.org/wiki/Special:FilePath/Ylitornio.vaakuna.svg"};
 const box=document.createElement('div');box.className='lap-kuhmo-facts';box.setAttribute('aria-label','Kunnan perustiedot');
 const img=coat?coat.cloneNode(true):document.createElement('img');if(!coat)img.src=crestBySlug[slug]||'';img.alt=name+' – vaakuna';img.removeAttribute('width');img.removeAttribute('height');img.onerror=()=>img.remove();if(img.src)box.append(img);
 const raw=pop?.textContent||facts?.textContent||'',m=raw.match(/(?:Asukasluku\s*:?\s*|^)([0-9\s\u00a0]{3,})/i);
 if(m){const txt=document.createElement('span');txt.textContent='Asukkaita '+m[1].trim().replace(/\s+/g,' ')+' · 31.12.2025';box.append(txt)}
 if(box.childNodes.length)intro.append(box);
 const visit=document.createElement('button');visit.type='button';visit.className='lap-kuhmo-visited';
 const status=document.createElement('p');status.className='lap-kuhmo-status';status.setAttribute('role','status');
 function read(){const a=JSON.parse(localStorage.getItem('ms_trips_v2')||'[]');if(!Array.isArray(a))throw Error('Invalid trips');return a}
 function paint(){let saved=false;try{saved=read().some(t=>t&&(t.id==='kohde-'+slug||t.locationId===slug)&&t.visited)||localStorage.getItem('ms_visited_'+slug)==='1'}catch{}
 visit.textContent=saved?'✓ Käyty · Näytä matkamuisto':'○ Olen käynyt täällä';visit.setAttribute('aria-pressed',String(saved))}
 visit.addEventListener('click',()=>{try{const trips=read();let trip=trips.find(t=>t&&(t.id==='kohde-'+slug||t.locationId===slug));
 if(!trip){trip={id:'kohde-'+slug,locationId:slug,name,begin:'',end:'',diary:'',stops:[],rating:0,visited:true,sourceUrl:location.pathname.split('/').pop()};trips.unshift(trip)}else trip.visited=true;
 localStorage.setItem('ms_trips_v2',JSON.stringify(trips));localStorage.setItem('ms_visited_'+slug,'1');location.href='paivakirja.html?matkamuisto='+encodeURIComponent(trip.id)
 }catch{status.textContent='Tallennus ei onnistunut. Tarkista selaimen tallennustila.'}});
 paint();window.addEventListener('pageshow',paint);window.addEventListener('storage',paint);intro.append(visit,status);
 const icons={nature:'<path d="m16 2-9 11h5L5 21h8v8h6v-8h8l-7-8h5Z"/>',sight:'<path d="M5 27h22M8 25V12h16v13M5 12l11-7 11 7M11 14v9M16 14v9M21 14v9"/>',camp:'<path d="M3 23V8h18v7h5l4 5v5h-4M10 25h10M3 23v2h2M6 12h6v6H6ZM16 12h5v6h-5Z"/><circle cx="7.5" cy="25" r="3"/><circle cx="23" cy="25" r="3"/>',food:'<path d="M7 13h18v7a9 9 0 0 1-18 0v-7ZM25 15h2a4 4 0 0 1 0 8h-3M5 29h22M10 3c-3 3 3 4 0 7M17 3c-3 3 3 4 0 7M24 3c-3 3 3 4 0 7"/>'};
 const nav=document.createElement('nav');nav.className='lap-kuhmo-grid';nav.setAttribute('aria-label','Kunnan matkailuosiot');
 const first=ids=>ids.find(id=>main.querySelector(id));
 const query='maakunta=Lappi&kunta='+encodeURIComponent(name);
 const choices=[['nature','Luonto ja retket',first(['#retket','#lap281-retket'])||'pysahdy-matkalla.html?'+query+'&tyyppi=nature'],['sight','Nähtävyydet',first(['#helmet','#lap281-kohteet','#k413-osio-1'])||'pysahdy-matkalla.html?'+query+'&tyyppi=sight'],['camp','Majoitus ja karavaanari',first(['#yopyminen','#lap281-caravan'])||'leirintaalueet.html?'+query],['food','Kahvilat ja ravintolat',first(['#ruoka','#lap281-ruoka'])||'pysahdy-matkalla.html?'+query+'&tyyppi=food']];
 for(const [icon,label,href] of choices){const link=document.createElement('a');link.href=href;link.dataset.icon=icon;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[icon];
 const labelNode=document.createElement('b');labelNode.textContent=label;link.append(svg,labelNode);
 if(href.startsWith('#'))link.addEventListener('click',()=>{const el=main.querySelector(href);if(el?.tagName==='DETAILS')el.open=true;el?.closest('details')?.setAttribute('open','')});nav.append(link)}
 intro.append(nav);
 /* Remove every obsolete top-level menu and visit control, not just the first. */
 for(const el of main.querySelectorAll('.ms375-quick,.lap281-menu,nav.quick,.ms375-visit,[data-visited],.ms375-status,.ms375-back,.lap281-back,a.back,.lap281-eyebrow,.lap281-footnav,.site-nav'))el.remove();
 for(const el of [title,pop,lead,facts])el?.remove();
 main.querySelectorAll('.ms375-town-top').forEach(el=>{if(!el.textContent.trim())el.remove()});
 main.prepend(intro);
 if(!document.querySelector('.ms375-bottom,.lap-kuhmo-bottom')){const bottom=document.createElement('nav');bottom.className='lap-kuhmo-bottom';bottom.setAttribute('aria-label','Sivuston päävalikko');bottom.innerHTML='<a href="index.html">⌂<small>Koti</small></a><a href="maakunnat.html" aria-current="page">◎<small>Paikkakunnat</small></a><a href="pysahdy-matkalla.html">⚑<small>Pysähdy matkalla</small></a><a href="paivakirja.html">♡<small>Omat matkat</small></a>';body.append(bottom)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
