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
 const box=document.createElement('aside');box.className='lap-kuhmo-facts';box.setAttribute('aria-label','Kunnan perustiedot');
 if(coat){const img=coat.cloneNode(true);img.removeAttribute('width');img.removeAttribute('height');box.append(img)}
 const txt=document.createElement('div'),strong=document.createElement('strong');
 const raw=pop?.textContent||facts?.textContent||'',m=raw.match(/(?:Asukasluku\s*:?\s*|^)([0-9\s\u00a0]{3,})/i);
 strong.textContent=m?'Asukasluku: '+m[1].trim().replace(/\s+/g,' '):'Asukasluku: tarkistetaan';
 const small=document.createElement('small');small.textContent='31.12.2025 · Lappi';txt.append(strong,small);box.append(txt);intro.append(box);
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
 const icons={sight:'<path d="M11 11H6a4 4 0 1 1 5-5v20a4 4 0 1 1-5-5h20a4 4 0 1 1-5 5V6a4 4 0 1 1 5 5Z"/>',camper:'<path d="M3 23V8h18v7h5l4 5v5h-4M10 25h10M3 23v2h2M6 12h6v6H6ZM16 12h5v6h-5Z"/><circle cx="7.5" cy="25" r="3"/><circle cx="23" cy="25" r="3"/>',tree:'<path d="m16 2-9 11h5L5 21h8v8h6v-8h8l-7-8h5Z"/>',parking:'<path d="M11 27V5h8a7 7 0 0 1 0 14h-8"/>'};
 const nav=document.createElement('nav');nav.className='lap-kuhmo-grid';nav.setAttribute('aria-label','Kunnan matkailuosiot');
 const first=ids=>ids.find(id=>main.querySelector(id));
 const query='maakunta=Lappi&kunta='+encodeURIComponent(name);
 const choices=[['sight','Näe ja koe',first(['#helmet','#lap281-kohteet','#k413-osio-1'])||'pysahdy-matkalla.html?'+query+'&tyyppi=sight'],['camper','Yöpyminen',first(['#yopyminen'])||'leirintaalueet.html?'+query],['tree','Retket',first(['#retket'])||'pysahdy-matkalla.html?'+query+'&tyyppi=nature'],['parking','Pysähdy matkalla','pysahdy-matkalla.html?'+query]];
 for(const [icon,label,href] of choices){const a=document.createElement('a');a.href=href;a.dataset.icon=icon;
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');svg.innerHTML=icons[icon];
 const b=document.createElement('b');b.textContent=label;a.append(svg,b);
 if(href.startsWith('#'))a.addEventListener('click',()=>{const el=main.querySelector(href);if(el?.tagName==='DETAILS')el.open=true;el?.closest('details')?.setAttribute('open','')});nav.append(a)}
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
