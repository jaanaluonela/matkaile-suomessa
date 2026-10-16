/* Matkaile Suomessa v334: Lahden malli Pohjois-Pohjanmaalle, vanha sisältö säilyy */
(()=>{'use strict';
const towns={"alavieska":{"name":"Alavieska","pop":2384,"coat":"Alavieska"},"haapajarvi":{"name":"Haapajärvi","pop":6441,"coat":"Haapajärvi"},"haapavesi":{"name":"Haapavesi","pop":6298,"coat":"Haapavesi"},"hailuoto":{"name":"Hailuoto","pop":912,"coat":"Hailuoto"},"ii":{"name":"Ii","pop":9755,"coat":"Ii"},"kalajoki":{"name":"Kalajoki","pop":12155,"coat":"Kalajoki"},"kempele":{"name":"Kempele","pop":19702,"coat":"Kempele"},"kuusamo":{"name":"Kuusamo","pop":14800,"coat":"Kuusamo"},"karsamaki":{"name":"Kärsämäki","pop":2324,"coat":"Kärsämäki"},"liminka":{"name":"Liminka","pop":10116,"coat":"Liminka"},"lumijoki":{"name":"Lumijoki","pop":2018,"coat":"Lumijoki"},"merijarvi":{"name":"Merijärvi","pop":1031,"coat":"Merijarvi"},"muhos":{"name":"Muhos","pop":8767,"coat":"Muhos"},"nivala":{"name":"Nivala","pop":10300,"coat":"Nivala"},"oulainen":{"name":"Oulainen","pop":6832,"coat":"Oulainen"},"oulu":{"name":"Oulu","pop":217469,"coat":"Oulu"},"pudasjarvi":{"name":"Pudasjärvi","pop":7168,"coat":"Pudasjarvi"},"pyhajoki":{"name":"Pyhäjoki","pop":2938,"coat":"Pyhäjoki"},"pyhajarvi":{"name":"Pyhäjärvi","pop":4551,"coat":"Pyhäjärvi"},"pyhanta":{"name":"Pyhäntä","pop":1678,"coat":"Pyhäntä"},"raahe":{"name":"Raahe","pop":23413,"coat":"Raahe"},"reisjarvi":{"name":"Reisjärvi","pop":2476,"coat":"Reisjärvi"},"sievi":{"name":"Sievi","pop":4585,"coat":"Sievi"},"siikajoki":{"name":"Siikajoki","pop":4723,"coat":"Siikajoki"},"siikalatva":{"name":"Siikalatva","pop":4861,"coat":"Siikalatva"},"taivalkoski":{"name":"Taivalkoski","pop":3555,"coat":"Taivalkoski"},"tyrnava":{"name":"Tyrnävä","pop":6470,"coat":"Tyrnävä"},"utajarvi":{"name":"Utajärvi","pop":2399,"coat":"Utajärvi"},"vaala":{"name":"Vaala","pop":2544,"coat":"Vaala"},"ylivieska":{"name":"Ylivieska","pop":15274,"coat":"Ylivieska"}};
const boot=()=>{
 let slug=(document.currentScript?.dataset?.ms334Town||location.pathname.split('/').pop().replace(/\.html$/,'')).toLowerCase();
 // document.currentScript is null after DOMContentLoaded: get the embed script tag
 const embed=document.querySelector('script[data-ms334-town]');if(embed)slug=embed.dataset.ms334Town;
 const d=towns[slug];if(!d||document.querySelector('.ms334-newtop'))return;
 const main=document.querySelector('main');if(!main)return;
 const oldH=main.querySelector('h1');if(!oldH)return;
 const originalLead=main.querySelector('.lead,.ph-lead,.lap281-lead,header p,.ou329-hero p');
 const subtitle=originalLead?.textContent?.replace(/\s+/g,' ').trim() || 'Tutustu paikkakunnan nähtävyyksiin, retkiin ja matkailupalveluihin.';
 // Original headings, cards, links and categories stay in DOM. Only duplicate headings/nav are hidden.
 for(const el of [...main.querySelectorAll('.back,.top,.toplink,.ou329-back,.lap281-back')])if(el.closest('.ms334-newtop')===null)el.classList.add('ms334-old-breadcrumb');
 const oldHero=oldH.closest('header');(oldHero&&oldHero!==main?oldHero:oldH).classList.add('ms334-old-head');
 if(originalLead&&originalLead!==oldH&& !originalLead.closest('header'))originalLead.classList.add('ms334-old-head');
 for(const el of main.querySelectorAll('.quick,.navtiles,.qnav,.lap281-menu'))el.classList.add('ms334-old-quick');
 const eyebrow=main.querySelector(':scope > .eyebrow,:scope > .ms332-eyebrow');if(eyebrow)eyebrow.classList.add('ms334-old-eyebrow');
 for(const el of main.querySelectorAll('.facts,.municipality-facts,.kuntafaktat,.kainuu-facts,.ms209-facts'))el.classList.add('ms334-old-facts');
 // Remove duplicate v332 top card if it was injected by the legacy updater.
 for(const el of main.querySelectorAll('.ms332-top'))el.classList.add('ms334-old-head');
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const pop=Number(d.pop).toLocaleString('fi-FI');
 const common='https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(d.coat+'.vaakuna.svg');
 const url='https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(d.coat+'.vaakuna.svg');
 const qs=[['helmet','⭐','Näe ja koe',['helmet','kohteet','nae-ja-koe','nahtavyydet']],['yopyminen','🚐','Yöpyminen',['yopyminen','caravan','majoitus','leirinta']],['retket','🌲','Retket',['retket','luonto','nature','ulkoilu']],['ruoka','☕','Pysähdy matkalla',['ruoka','suunnittelu','palvelut','herkut']]];
 const find=(ids,re)=>{
  for(const id of ids){const el=document.getElementById(id);if(el)return '#'+id;}
  for(const el of main.querySelectorAll('section,details')){
    const t=(el.querySelector('summary,h2,h3')?.textContent||'').toLocaleLowerCase('fi');
    if(re.test(t)){if(!el.id)el.id='ms334-section-'+Math.random().toString(36).slice(2,9);return '#'+el.id}
  }
  return null;
 };
 const regexp=[/näe|kohtee|nähtäv|kulttuuri/i,/yöpy|majoit|caravan|leirint/i,/retke|luonto|ulkoil/i,/ruok|kahvil|ravint|palvel|suunnittelu/i];
 const fallback=['pysahdy-matkalla.html','yopyminen.html','pysahdy-matkalla.html','pysahdy-matkalla.html'];
 const colors=['tile-green','tile-gold','tile-blue','tile-peach'];
 const q=qs.map(([id,icon,label,ids],i)=>`<a class="${colors[i]}" href="${find(ids,regexp[i])||fallback[i]}">${icon} <span>${label}</span></a>`).join('');
 const top=document.createElement('div');top.className='ms334-newtop ms334-main';
 top.innerHTML=`<a class="ms334-back" href="pohjois-pohjanmaa.html">‹ Pohjois-Pohjanmaa</a><header class="ms334-header"><h1>${esc(d.name)}</h1><p class="ms334-lead">${esc(subtitle)}</p></header><aside class="ms334-facts facts" aria-label="Kunnan perustiedot"><a href="${url}" target="_blank" rel="noopener noreferrer"><img src="${common}" width="66" height="81" alt="${esc(d.name)} – vaakuna" loading="lazy"></a><div><strong>Asukasluku: ${pop}</strong><p>31.12.2025 · <a target="_blank" rel="noopener noreferrer" href="https://stat.fi/fi/tilastot/tietoa-teemoittain/vakiluku">Tilastokeskus ↗</a></p><p>Pohjois-Pohjanmaa · <a target="_blank" rel="noopener noreferrer" href="https://kuntavaesto.com/maakunta/pohjois-pohjanmaa/">Vuoden 2025 luvut ↗</a></p></div></aside><nav class="ms334-quick" aria-label="Paikkakunnan sisältö">${q}</nav>`;
 main.insertBefore(top,main.firstChild);
 // Keep any legacy scripts and user-specific visits functional.
 let footer=document.querySelector('.ms334-footer');if(!footer){footer=document.createElement('nav');footer.className='ms334-footer';footer.setAttribute('aria-label','Sivuston päävalikko');footer.innerHTML="<a href=\"index.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"m3 10 9-7 9 7v11h-6v-7H9v7H3z\"/></svg>Koti</a><a class=\"active\" href=\"maakunnat.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M20 10c0 5.5-8 12-8 12S4 15.5 4 10a8 8 0 1 1 16 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/></svg>Paikkakunnat</a><a href=\"pysahdy-matkalla.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 2v20M5 5h13l3 3-3 3H5zM19 14H6l-3 3 3 3h13z\"/></svg>Pysähdy matkalla</a><a href=\"paivakirja.html\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"4\" y=\"3\" width=\"16\" height=\"18\" rx=\"2\"/><path d=\"M8 8h8M8 12h8M8 16h5\"/></svg>Omat matkat</a>";document.body.appendChild(footer);}
 document.body.classList.add('ms334-enhanced');
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();