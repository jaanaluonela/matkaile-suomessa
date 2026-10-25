/* Matkaile Suomessa v354 – yhtenäiset kuntatiedot, alkuperäiset sisällöt säilyvät. */
(()=>{'use strict';
 const dataset=window.ms354Municipalities;if(!dataset)return;
 const file=decodeURIComponent(location.pathname.split('/').pop()||'index.html').toLowerCase();
 const params=new URLSearchParams(location.search);
 const name=file==='kuntakortti.html'?params.get('kunta'):dataset.pages[file];
 if(!name || !dataset.municipalities[name])return;
 const record=dataset.municipalities[name];
 const main=document.querySelector('main');if(!main)return;
 let h=main.querySelector('h1');if(!h)return;
 document.body.classList.add('ms354-municipality');
 const elt=(tag,cls,txt)=>{let el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};
 const locationLabel=elt('p','ms354-province',record.region);
 const fact=elt('section','ms354-identity');fact.setAttribute('aria-label','Kunnan perustiedot');
 const coat=elt('div','ms354-coat');
 const alt=name+' – kunnan vaakuna';
 const badge=elt('img','ms354-coat-image');badge.alt=alt;badge.loading='lazy';badge.decoding='async';
 // If a site-existing coat is present, prefer it. Otherwise try the Commons image; never show a broken symbol.
 const imgUrl=record.existingCoat||'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(name.split(' - ')[0]+'.vaakuna.svg');
 const fallback=()=>{badge.remove();if(!coat.querySelector('.ms354-coat-link')){
  let a=elt('a','ms354-coat-link','Katso kunnan vaakuna ↗');a.href=record.officialPage;a.target='_blank';a.rel='noopener noreferrer';coat.append(a);
 }};
 badge.onerror=fallback;
 badge.src=imgUrl;
 coat.append(badge);
 const values=elt('div','ms354-facts-values');
 values.append(elt('p','ms354-facts-caption','Kuntatiedot'));
 const population=elt('p','ms354-pop');population.append(elt('strong','','Asukasluku: '));
 if(Number.isFinite(record.pop)){
  population.append(document.createTextNode(new Intl.NumberFormat('fi-FI').format(record.pop)));
 }else{
  population.append(elt('span','ms354-pending','Tieto tarkistettavana'));
 }
 values.append(population);
 const coatSource=elt('a','ms354-coat-source','Vaakunan lähde: Kuntaliitto ↗');coatSource.href=record.officialPage;coatSource.target='_blank';coatSource.rel='noopener noreferrer';
 values.append(coatSource);
 fact.append(coat,values);
 // Fix placement after headline and short introduction; leave the original facts and source text untouched.
 let anchor=h;const next=h.nextElementSibling;
 if(next&&next.matches('p.lead,p.intro,p.lap281-lead,p.ph-lead'))anchor=next;
 anchor.insertAdjacentElement('afterend',fact);
 // Keep municipality quick links consistent, but do not change the underlying anchors.
 for(const a of main.querySelectorAll('nav.quick a')){
  a.textContent=a.textContent.replace(/^[⭐🌲🚐☕🧸ℹ️🏛️📍\s]+/u,'').trim();
 }
 // Back to municipality's region remains available, and add a clearly named homepage link if absent.
 if(!main.querySelector('.ms354-return')){
  const nav=elt('nav','ms354-return');nav.setAttribute('aria-label','Liikkuminen kunnasivulta');
  const back=elt('a','','← Paikkakuntiin');back.href='maakunnat.html';
  const home=elt('a','','Etusivulle');home.href='index.html';
  nav.append(back,home);fact.after(nav);
 }
})();
