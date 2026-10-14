(() => {
 function start(){
 const menu=document.querySelector('.home-primary-links-v290 .menu');if(!menu)return;menu.classList.remove("home-choices-v212");
 document.querySelectorAll('main a[href="kayntikohteet.html"],main a[href="ruukkikylat.html"]').forEach(a=>a.remove());
 const old=document.getElementById('travel-stop-v268');if(old)old.id='home-stops-v308';
 const specs=[['home-stops-v308','pysahdy-matkalla.html','Pysähdy matkalla','Löydä matkasi pienet helmet','stops'],['home-route-v306','reittisuunnittelu.html','Suunnittele reitti','Lähtöpaikka, määränpää ja välietappi','route'],['archipelago-route-v233','saariston-rengastie.html','Saariston rengastie','Lautat, saaret ja merimaisemat','ferry'],['home-memories-v306','paivakirja.html','Omat matkat','Kuvat ja muistot talteen','memories']];
 specs.forEach(([id,href,title,desc,art])=>{
 let a=document.getElementById(id)||document.querySelector('a.v244-memories');
 if(id!=='home-memories-v306')a=document.getElementById(id);
 if(!a){a=document.createElement('a');a.id=id;}
 a.id=id;a.href=href;a.className='home-feature-v306';a.removeAttribute('style');
 a.innerHTML='<img class="feature-art-v306" src="home-icon-'+art+'-v310.svg" alt=""><span class="feature-copy-v306"><strong>'+title+'</strong><small>'+desc+'</small></span><span class="feature-arrow-v306" aria-hidden="true">→</span>';
 if(id==='home-stops-v308')a.dataset.msStopsLayout='v304';
 menu.append(a);
 });
 const note=document.querySelector('.later-note');if(note)note.textContent='Löydä oma tapasi kulkea Suomessa.';
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();