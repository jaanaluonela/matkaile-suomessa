/* Matkaile Suomessa v303 – Järvisydän, Rantasalmi (tiedot: jarvisydan.com/karavaanialue/ 14.10.2026). */
(()=>{'use strict';
const destination={
 id:'ms303-rantasalmi-jarvisydamen-karavaanialue',
 name:'Järvisydämen karavaanialue',
 aliases:['Järvisydän','Nature Hotel & Spa Resort Järvisydän','Karavaanialue Järvisydän'],
 city:'Rantasalmi',region:'Etelä-Savo',
 address:'Porosalmentie 313, 58900 Rantasalmi',
 type:'park',
 season:'Karavaanipaikka varattava ennen yöpymistä. Tarkista aukiolo ja saatavuus.',
 openingStatus:'unknown',
 verifiedServices:['electric','water','wc','shower'],
 website:'https://www.jarvisydan.com/karavaanialue/',
 source:'https://www.jarvisydan.com/karavaanialue/',
 checked:'2026-10-14',
 url:'jarvisydan.html',
 map:'https://www.google.com/maps/search/?api=1&query=J%C3%A4rvisyd%C3%A4n%20Rantasalmi',
 description:'Saimaan rannalla sijaitseva karavaanialue Järvisydämen kylpylä- ja ravintolapalvelujen äärellä. Sähköpaikat, vesipiste, jätehuolto ja vastaanoton aukioloaikoina WC ja suihku. Ei kemiallisen WC:n tyhjennystä eikä erillistä huoltorakennusta. Karavaanialue sijaitsee rinteessä; liittymä voi olla hankala pitkille ajoneuvoille. Paikka varattava etukäteen.'
};
const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
const collection=window.caravanPlaces||(window.caravanPlaces=[]);
const old=collection.find(p=>p && p.city && norm(p.city)===norm(destination.city) && (
  norm(p.name||'').includes('jarvisydam')||norm(p.name||'').includes('jarvisydan')||
  norm(p.address||'')===norm(destination.address)));
if(old){
 // Retain original place identity, enrich with verified info; never create a duplicate.
 old.aliases=[...new Set([...(old.aliases||[]),...destination.aliases,destination.name])];
 old.verifiedServices=[...new Set([...(old.verifiedServices||[]),...destination.verifiedServices])];
 if(!old.website)old.website=destination.website;
 if(!old.source)old.source=destination.source;
 if(!old.address)old.address=destination.address;
 if(!old.region)old.region=destination.region;
 if(!old.description)old.description=destination.description;
 else if(!/tyhjennys/i.test(old.description))old.description+=' Huom. kemiallisen WC:n tyhjennystä ei ole; varaa paikka etukäteen.';
 old.url=destination.url;
 old.type='park';
 if(!old.openingStatus)old.openingStatus='unknown';
}else collection.push(destination);
const regions=window.municipalityRegions||(window.municipalityRegions={});
if(!regions.Rantasalmi)regions.Rantasalmi='Etelä-Savo';
const visit=window.visitHighlights||(window.visitHighlights=[]);
if(!visit.some(p=>p?.city==='Rantasalmi' && /j[aä]rvisyd[aä][nm]/i.test(p?.name||''))){
 visit.push({name:'Järvisydän',city:'Rantasalmi',region:'Etelä-Savo',type:'sight',nature:false,
  address:'Porosalmentie 313, 58900 Rantasalmi',
  description:'Saimaan rannalla sijaitseva elämyshotelli ja järvikylpylä. Ravintoloita, luontoaktiviteetteja sekä erikseen varattava karavaanialue.',
  url:'jarvisydan.html',mapUrl:'https://www.google.com/maps/search/?api=1&query=J%C3%A4rvisyd%C3%A4n%20Rantasalmi'});
}
window.ms303Jarvisydan=destination;
})();
