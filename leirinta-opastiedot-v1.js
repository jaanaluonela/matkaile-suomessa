/* Matkaile Suomessa – opaskuvista poimitut leirintäalueet, täydennetty 14.11.2026.
   Ei mainoksia. Palvelut oppaasta, ellei erikseen tarkistettu; aukioloa ei päätellä oppaasta. */
(()=>{'use strict';
const records=[{"name":"Tunturikeskus Galdotieva","city":"Enontekiö","region":"Lappi","address":"Ruijantie 2605, 99440 Enontekiö","phone":"0400908300","website":"https://www.aajatieva.fi/en/leirintaalue/","services":["keittiö","suihku","wc","sauna","sähkö"],"description":"Leirintäalue tunturimaisemissa. Oppaan mukaan kesäkausi ja talvella rajoitettu toiminta."},{"name":"Giellajohka","city":"Inari","region":"Lappi","address":"Karigasniementie 2920, Inari","phone":"040 738 6825","website":"https://giellajohka.fi","services":["sähkö","wc","suihku","sauna"],"description":"Kielajoen rannalla sijaitseva leirintäalue; kalastus- ja retkeilymahdollisuuksia."},{"name":"Gröna Uddens Camping","city":"Maarianhamina","region":"Ahvenanmaa","address":"Östernäsvägen 1A, 22100 Maarianhamina","phone":"018 528 700","website":"https://gronaudden.com","services":["sauna","kahvila","uimaranta","wifi"],"description":"Merenrantaleirintäalue lähellä Maarianhaminaa."},{"name":"Hakalanranta","city":"Valkeakoski","region":"Pirkanmaa","address":"Hakalanranta 51, 37720 Ritvala","phone":"040 702 6005","website":"https://sfc-hakalanranta.com","services":["sähkö","wc","suihku","sauna"],"description":"Vanajaveden rannalla sijaitseva SF-Caravan-alue."},{"name":"Halsuan Helmi","city":"Halsua","region":"Keski-Pohjanmaa","address":"Lehtomaantie 151, 69510 Halsua","phone":"040 544 7565","website":"https://halsuanhelmi.fi/camping/","services":["sähkö","wc","suihku","sauna","pyykinpesu","ravintola","uimaranta"],"description":"Halsuanjärven rannalla sijaitseva leirintäalue, jossa on mökkejä ja huoltorakennukset."},{"name":"Camping Pitkäthiekat","city":"Hamina","region":"Kymenlaakso","address":"Pitkähiekat 32, 49400 Hamina","phone":"040 151 3446","website":"https://www.campingpitkathiekat.fi/","services":["sähkö","wc","suihku","sauna","uimaranta"],"description":"Merenrantaleirintäalue noin kuuden kilometrin päässä Haminan keskustasta. Tarkista kausittainen aukiolo."},{"name":"Hanko Camping Silversand","city":"Hanko","region":"Uusimaa","address":"Aarne Karjalaisen tie 15, 10960 Hanko","phone":"019 248 5500","website":"https://silversand.fi/","services":["sähkö","wc","suihku","sauna","uimaranta","wifi"],"description":"Merenrantaleirintäalue, mökkejä ja hiekkaranta. Virallisen sivun mukaan avoinna ympäri vuoden."}];
const list=window.caravanPlaces||(window.caravanPlaces=[]);
const norm=x=>String(x||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
for(const r of records){
 const match=list.find(p=>p&&p.type==='camping'&&norm(p.city)===norm(r.city)&&(
  norm(p.name).includes(norm(r.name))||norm(r.name).includes(norm(p.name))||
  (p.address&&norm(p.address.split(',')[0])===norm(r.address.split(',')[0]))));
 const p=match||{id:'guide-2026-'+norm(r.name),name:r.name,type:'camping',city:r.city,region:r.region,address:r.address};
 if(!match)list.push(p);
 p.phone=p.phone||r.phone;p.website=p.website||r.website;
 p.description=(p.description&&p.description.length>r.description.length)?p.description:r.description;
 p.guideServices=r.services;p.guideServicesSource='Leirintäopas, käyttäjän toimittama kuva (tarkistamaton)';
 p.guideUpdated='2026-11-14';
 if(norm(r.name)==='halsuanhelmi'||norm(r.name)==='hankocampingsilversand'){
  p.verifiedServices=[...new Set([...(p.verifiedServices||[]),...r.services])];
  p.verifiedSource=r.website;
 }
 if(norm(r.name)==='hankocampingsilversand'){p.openingStatus='yearround';p.verifiedOpeningStatus='yearround';p.season='Avoinna ympäri vuoden (virallinen sivu)';}
}
window.msGuideCamping2026=records;
})();