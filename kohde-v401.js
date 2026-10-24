(()=>{'use strict';
const toggle=document.querySelector('.ms375-menu'),menu=document.getElementById('ms375-menu-links');
toggle?.addEventListener('click',()=>{menu.hidden=!menu.hidden;toggle.setAttribute('aria-expanded',String(!menu.hidden))});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu&&!menu.hidden){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}});
const favorite=document.getElementById('kohde-favorite'),visited=document.getElementById('kohde-visited'),status=document.getElementById('kohde-status');
const url='suomenlinna.html',oldUrl='pysahdy-matkalla.html?tyyppi=sight&haku=Suomenlinna',id='kohde-suomenlinna';
function read(key){const a=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(a))throw Error('Invalid storage');return a}
function paint(){try{const saved=read('ms_favorites_v301').some(p=>p.url===url||p.url===oldUrl);favorite.textContent=saved?'★ Tallennettu suosikiksi':'☆ Lisää suosikiksi';favorite.setAttribute('aria-pressed',String(saved));visited.textContent=read('ms_trips_v2').some(t=>t&&(t.id===id||t.locationId==='suomenlinna')&&t.visited)?'✓ Käyty · Avaa matkamuisto':'Olen käynyt täällä'}catch{}}
favorite?.addEventListener('click',()=>{try{let list=read('ms_favorites_v301');if(list.some(p=>p.url===url||p.url===oldUrl))list=list.filter(p=>p.url!==url&&p.url!==oldUrl);else list.unshift({url,title:'Suomenlinna · Helsinki',savedAt:new Date().toISOString()});localStorage.setItem('ms_favorites_v301',JSON.stringify(list));status.textContent='';paint()}catch{status.textContent='Tallennus ei onnistunut. Tarkista selaimen tallennustila.'}});
visited?.addEventListener('click',()=>{try{const trips=read('ms_trips_v2');let trip=trips.find(t=>t&&(t.id===id||t.locationId==='suomenlinna'));if(!trip){trip={id,locationId:'suomenlinna',name:'Suomenlinna',begin:'',end:'',diary:'',stops:[],rating:0,visited:true,sourceUrl:url};trips.unshift(trip)}else trip.visited=true;localStorage.setItem('ms_trips_v2',JSON.stringify(trips));localStorage.setItem('ms_visited_suomenlinna','1');location.href='paivakirja.html?matkamuisto='+encodeURIComponent(trip.id)}catch{status.textContent='Tallennus ei onnistunut. Tarkista selaimen tallennustila.'}});
paint();window.addEventListener('pageshow',paint);window.addEventListener('storage',paint);
})();
