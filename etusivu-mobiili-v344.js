/* Matkaile Suomessa v344: etusivun pienet, lisaa-ei-poista -korjaukset. */
(()=>{
 'use strict';
 if(!document.body || document.body.dataset.home!=='true') return;
 const specs=[
   ['travel-stop-v268','pysahdy-matkalla.html','Pysähdy matkalla','art-stops'],
   ['archipelago-route-v233','saariston-rengastie.html','Saariston rengastie','art-ferry'],
   ['home-route-v306','reittisuunnittelu.html','Suunnittele reitti','art-route'],
   ['home-memories-v306','paivakirja.html','Omat matkat','art-memories']
 ];
 function init(){
  const menu=document.querySelector('.home-primary-links-v290 .menu');
  if(!menu)return;
  for(const [id,url,title,art] of specs){
   let card=document.getElementById(id);
   if(!card && id==='home-memories-v306')card=document.querySelector('main .v244-memories');
   if(!card){
    card=document.createElement('a');card.id=id;card.href=url;
    card.className='home-feature-v306';
    const image=document.createElement('span');image.className='feature-art-v306 '+art;image.setAttribute('aria-hidden','true');
    const copy=document.createElement('span');copy.className='feature-copy-v306';
    const strong=document.createElement('strong');strong.textContent=title;copy.appendChild(strong);
    card.appendChild(image);card.appendChild(copy);
    menu.appendChild(card);
   }
   if(!card.classList.contains('home-feature-v306')){
    /* Ei korvata taydennyksia, jos kortti on vanhan koodin mukainen. */
    card.classList.add('home-feature-v306');
   }
   if(!card.querySelector('.feature-art-v306')){
    const picture=document.createElement('span');picture.className='feature-art-v306 '+art;
    picture.setAttribute('aria-hidden','true');card.prepend(picture);
   }
   if(!menu.contains(card))menu.appendChild(card);
  }
  /* Opasteen linkit; olemassaolevia kuntia tai kohdesivuja ei muokata. */
  if(!document.getElementById('ms343-help') && ![...document.querySelectorAll('h2,h3')].some(h=>h.textContent.trim()==='Löydä enemmän matkan varrelta')){
   const help=document.createElement('section');help.className='ms343-help';help.id='ms343-help';
   help.setAttribute('aria-labelledby','ms343-help-heading');
   const h=document.createElement('h2');h.id='ms343-help-heading';h.textContent='Löydä enemmän matkan varrelta';help.appendChild(h);
   const intro=document.createElement('p');intro.className='ms343-help-intro';intro.textContent='Mitä kaikkea Matkaile Suomessa tarjoaa?';help.appendChild(intro);
   const links=[
    ['maakunnat.html','🗺','Tutustu Suomen paikkakuntiin','Nähtävyyksiä, paikallisia erikoisuuksia ja kiinnostavia vierailukohteita.'],
    ['leirintaalueet.html','🏕','Löydä sopiva yöpymispaikka','Leirintäalueet, matkaparkit ja matkailijan palvelut.'],
    ['pysahdy-matkalla.html','🌲','Pysähdy matkalla','Luontokohteet, nähtävyydet ja taukopaikat matkasi varrella.'],
    ['reittisuunnittelu.html','🗺','Suunnittele oma reitti','Etsi kiinnostavaa nähtävää matkan varrelta.']
   ];
   for(const [href,icon,title,desc] of links){
    const a=document.createElement('a');a.className='ms343-help-item';a.href=href;
    const iconspan=document.createElement('span');iconspan.className='ms343-help-icon';iconspan.setAttribute('aria-hidden','true');iconspan.textContent=icon;
    const copy=document.createElement('span');copy.className='ms343-help-copy';
    const t=document.createElement('strong');t.textContent=title;
    const d=document.createElement('span');d.textContent=desc;copy.append(t,d);a.append(iconspan,copy);help.appendChild(a);
   }
   menu.closest('.home-primary-links-v290').insertAdjacentElement('afterend',help);
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
