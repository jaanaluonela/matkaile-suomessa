/* Matkaile Suomessa v339: erillinen tietokoneen ylävalikko, ei mobiilivalikon muutoksia. */
(()=>{
 'use strict';
 const items=[
  ['index.html','Etusivu','⌂'],
  ['maakunnat.html','Paikkakunnat','⌖'],
  ['pysahdy-matkalla.html','Pysähdy matkalla','✦'],
  ['leirintaalueet.html','Yöpymispaikat','♧'],
  ['paivakirja.html','Omat matkat','▤'],
  ['reittisuunnittelu.html','Suunnittele reitti','↗']
 ];
 function text(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;el.textContent=value;return el}
 function link(url,label){const a=document.createElement('a');a.href=url;a.textContent=label;return a}
 const file=decodeURIComponent(location.pathname.split('/').pop()||'index.html').toLowerCase();
 function init(){
  if(document.getElementById('ms339-desktop-header'))return;
  const header=document.createElement('header');header.className='ms339-topbar';header.id='ms339-desktop-header';
  const shell=document.createElement('div');shell.className='ms339-shell';
  const top=document.createElement('div');top.className='ms339-toprow';
  const brand=link('index.html','');brand.className='ms339-brand';
  brand.appendChild(text('span','ms339-brand-mark','🧭'));
  const brandtext=document.createElement('span');brandtext.append(text('strong','','Matkaile Suomessa'),text('small','','Löydä seuraava pysähdys'));brand.append(brandtext);
  top.appendChild(brand);
  const form=document.createElement('form');form.className='ms339-search';form.method='get';form.action='index.html';form.role='search';
  const q=document.createElement('input');q.type='search';q.name='hae';q.placeholder='Hae kuntaa tai kohdetta';q.setAttribute('aria-label','Hae kuntaa tai kohdetta');q.autocomplete='off';
  const btn=document.createElement('button');btn.type='submit';btn.textContent='Hae →';
  form.append(q,btn);top.appendChild(form);shell.appendChild(top);
  const nav=document.createElement('nav');nav.className='ms339-navbar';nav.setAttribute('aria-label','Tietokoneversion päävalikko');
  for(const [href,label,ico] of items){const a=link(href,'');const i=text('span','ms339-ico',ico);i.setAttribute('aria-hidden','true');a.append(i,document.createTextNode(label));if(href===file||(file==='kunnat.html'&&href==='maakunnat.html'))a.setAttribute('aria-current','page');if(href==='reittisuunnittelu.html')a.classList.add('ms339-nav-cta');nav.appendChild(a)}
  shell.appendChild(nav);header.appendChild(shell);
  document.body.insertBefore(header,document.body.firstChild);
  const main=document.querySelector('main');
  if(document.body.dataset.home==='true' && main){
   const section=document.createElement('section');section.className='ms339-home-features';
   section.innerHTML='<div class="ms339-feature-heading"><div><span class="ms339-eyebrow">LÖYDÄ OMA TAPASI MATKAILLA</span><h2>Suunnittele, löydä ja lähde</h2></div></div>';
   const grid=document.createElement('div');grid.className='ms339-feature-grid';
   const features=[
    ['reittisuunnittelu.html','↗','Suunnittele reitti','Valitse lähtö- ja määränpää sekä etsi kiinnostavia pysähdyksiä matkan varrelta.'],
    ['pysahdy-matkalla.html','✦','Löydä matkakohteita','Nähtävyydet, luonto, lapsiperheiden paikat ja kahvilat yhdessä haussa.'],
    ['maakunnat.html','⌖','Tutustu paikkakuntiin','Selaa Suomen maakuntia ja kuntia. Löydä kiinnostavaa nähtävää.']
   ];
   for(const [url,ico,title,desc] of features){const a=link(url,'');a.className='ms339-feature';const upper=document.createElement('div');upper.appendChild(text('span','ms339-feature-icon',ico));const txt=document.createElement('div');txt.append(text('strong','',title),text('p','',desc));a.append(upper,txt,text('span','ms339-feature-arrow','↗'));grid.appendChild(a)}
   section.appendChild(grid);
   const before=main.querySelector('.home-primary-links-v290');if(before)main.insertBefore(section,before);else main.appendChild(section);
  }
  const footer=document.createElement('footer');footer.className='ms339-end-links';const footshell=document.createElement('div');footshell.className='ms339-shell';footshell.append(text('span','ms339-end-brand','Matkaile Suomessa'),text('span','','Elämyksiä läheltä ja kaukaa'));
  const endnav=document.createElement('div');endnav.className='ms339-end-list';for(const [url,label] of [['maakunnat.html','Kaikki paikkakunnat'],['leirintaalueet.html','Yöpyminen'],['pysahdy-matkalla.html','Pysähdy matkalla'],['paivakirja.html','Omat matkat']])endnav.appendChild(link(url,label));footshell.appendChild(endnav);footer.appendChild(footshell);document.body.appendChild(footer);
  const asked=new URLSearchParams(location.search).get('hae');
  if(asked && file==='index.html'){
   const search=document.getElementById('place-search');if(search){search.value=asked;search.dispatchEvent(new Event('input',{bubbles:true}));search.focus({preventScroll:true});search.scrollIntoView({block:'center',behavior:'instant'});}
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
