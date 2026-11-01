(()=>{function init(){if(!document.body.classList.contains('ms375-home')||document.querySelector('.ms460-home'))return;
const main=document.createElement('main');main.className='ms460-home';main.id='ms460-home';
const cards=[
['maakunnat.html','kortti-paikkakunnat-v382.webp','Paikkakunnat','Tutustu kuntiin ympäri Suomen'],
['leirintaalueet.html','kortti-yopyminen-v382.webp','Yöpymispaikat','Leirintäalueet ja matkaparkit'],
['pysahdy-matkalla.html','kortti-pysahdy-v382.webp','Pysähdy matkalla','Nähtävyydet, kahvilat ja palvelut'],
['reittisuunnittelu.html','etusivu-kuva-route-v346.webp','Suunnittele reitti','Ideat, reitit ja vinkit matkallesi'],
['karavaanarin-vinkit.html','home-icon-stops-v310.svg','Karavaanarin vinkit','Hyödyllistä tietoa matkailuun'],
['paivakirja.html','etusivu-kuva-memories-v346.webp','Omat matkat','Tallenna suosikit ja pidä matkamuistoja']
];
main.innerHTML='<div class="ms460-hero"><a href="index.html" class="ms460-brand"><img src="favicon.png" alt=""><strong>Matkaile<br>Suomessa</strong></a></div><div class="ms460-content"><form class="ms460-search" action="pysahdy-matkalla.html" method="get" role="search"><span class="ms460-glass" aria-hidden="true">⌕</span><input name="q" type="search" aria-label="Hae paikkakuntaa tai kohdetta" placeholder="Hae paikkakuntaa tai kohdetta..." autocomplete="off"><button type="submit" aria-label="Hae">⌕</button></form><nav class="ms460-grid" aria-label="Etusivun valinnat">'+cards.map(c=>'<a class="ms460-card" href="'+c[0]+'"><img src="'+c[1]+'" alt=""><span><strong>'+c[2]+'</strong><small>'+c[3]+'</small></span><span class="ms460-arrow" aria-hidden="true">›</span></a>').join('')+'</nav></div>';
document.querySelector('.page-main')?.before(main);
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();