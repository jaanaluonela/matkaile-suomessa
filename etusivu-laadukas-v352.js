/* Matkaile Suomessa v352: kevyen etusivun haku ja aiempien suosikkien tuki. */
(()=>{'use strict';
const input=document.getElementById('destination-search');
const form=document.getElementById('homepage-search');
const results=document.getElementById('home-search-results');
const normalize=v=>String(v||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const catalog=[];
const names=new Set();
function add(name,url,meta){const key=normalize(name);if(names.has(key))return;names.add(key);catalog.push({name,url,meta})}
const extra=[
 ['Vääksy','asikkala.html','Asikkala · Päijät-Häme'],
 ['Fiskars','pysahdy-matkalla.html?tyyppi=ruukki&haku=Fiskars','Raasepori · ruukkikylä'],
 ['Savonlinna','savonlinna.html','Etelä-Savo'],
 ['Yyteri','yyteri.html','Pori · hiekkarannat'],
 ['Koli','koli.html','Pohjois-Karjala · kansallispuisto'],
 ['Saariston rengastie','saariston-rengastie.html','Varsinais-Suomi'],
 ['Oulu','oulu.html','Pohjois-Pohjanmaa'],
 ['Levi','levi.html','Kittilä · Lappi'],
 ['Hanko','hanko.html','Uusimaa'],
 ['Suunnittele reitti','reittisuunnittelu.html','Matkan suunnittelu']
];
extra.forEach(row=>add(...row));
const municipalities=window.siteMunicipalities||{};
const regions=window.municipalityRegions||{};
Object.entries(municipalities).forEach(([name,url])=>add(name,url,(regions[name]||'Suomi')+' · paikkakunta'));
Object.entries(window.msFinlandRegions2026||{}).forEach(([region,towns])=>towns.forEach(name=>{
  const url=municipalities[name]||'kuntakortti.html?kunta='+encodeURIComponent(name);
  add(name,url,region+' · paikkakunta');
}));
function matches(value){const q=normalize(value.trim());if(!q)return[];return catalog.filter(x=>normalize(x.name+' '+x.meta).includes(q)).sort((a,b)=>(normalize(a.name).startsWith(q)?0:1)-(normalize(b.name).startsWith(q)?0:1)||a.name.localeCompare(b.name,'fi')).slice(0,7)}
function show(){results.replaceChildren();const found=matches(input.value);if(!input.value.trim()||!found.length){results.hidden=true;input.setAttribute('aria-expanded','false');return}found.forEach(item=>{const a=document.createElement('a');a.href=item.url;a.setAttribute('role','option');const name=document.createElement('strong');name.textContent=item.name;const meta=document.createElement('small');meta.textContent=item.meta;a.append(name,meta);results.append(a)});results.hidden=false;input.setAttribute('aria-expanded','true')}
input.addEventListener('input',show);
input.addEventListener('focus',show);
input.addEventListener('keydown',e=>{if(e.key==='Escape'){results.hidden=true;input.setAttribute('aria-expanded','false')}});
document.addEventListener('click',e=>{if(!e.target.closest('#homepage-search')){results.hidden=true;input.setAttribute('aria-expanded','false')}});
form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim();if(!q){input.focus();return}const match=matches(q)[0];location.href=match?match.url:'pysahdy-matkalla.html?haku='+encodeURIComponent(q)});

const key='ms_v315_home_favorites',cards=[...document.querySelectorAll('.destination-links article')],filter=document.getElementById('home-saved-filter'),empty=document.getElementById('home-empty-favorites');
let favorites=[];try{const saved=JSON.parse(localStorage.getItem(key)||'[]');favorites=Array.isArray(saved)?saved.filter(Number.isInteger):[]}catch{}
let onlySaved=false;
function draw(){let visible=0;cards.forEach(card=>{const id=Number(card.dataset.id),saved=favorites.includes(id);const btn=card.querySelector('button');btn.setAttribute('aria-pressed',String(saved));btn.title=saved?'Poista suosikeista':'Lisää suosikkeihin';btn.setAttribute('aria-label',(saved?'Poista suosikeista: ':'Tallenna suosikiksi: ')+card.querySelector('strong').textContent);card.hidden=onlySaved&&!saved;if(!card.hidden)visible++});empty.hidden=!(onlySaved&&visible===0);filter.setAttribute('aria-pressed',String(onlySaved));filter.textContent=onlySaved?'Näytä kaikki kohteet':'Näytä vain tallentamani kohteet'}
cards.forEach(card=>card.querySelector('button').addEventListener('click',()=>{const id=Number(card.dataset.id);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];try{localStorage.setItem(key,JSON.stringify(favorites))}catch{}draw()}));
filter.addEventListener('click',()=>{onlySaved=!onlySaved;draw()});draw();
})();
