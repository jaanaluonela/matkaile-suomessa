/* Matkailu Suomessa v288: Uudenmaan neljä virallisista lähteistä tarkistettua leirintäaluetta; säilyttää alkuperäisen caravan-data.js:n. */
(()=>{'use strict';
const sites=[{"id":"v288-rastila","name":"Rastila Camping Helsinki","aliases":["Rastila Camping","Rastila"],"city":"Helsinki","region":"Uusimaa","address":"Karavaanikatu 4, 00980 Helsinki","type":"camping","website":"https://rastilacamping.hel.fi/","source":"https://rastilacamping.hel.fi/palvelut/","description":"Ympärivuotinen leirintäalue metroaseman vieressä; matkailuajoneuvopaikkoja ja kemiallisen WC:n sekä harmaaveden tyhjennys.","season":"Avoinna vuoden jokaisena päivänä.","openingStatus":"yearround","verifiedOpeningStatus":"yearround","verifiedServices":["electric","chemical","greywater","shower","laundry","kitchen"],"sfcArea":false,"checked":"2026-10-12","verifiedSource":"https://rastilacamping.hel.fi/palvelut/","verifiedNote":"Palveluiden saatavuus ja aukiolo tulee aina tarkistaa ennen saapumista."},{"id":"v288-silversand","name":"Camping Silversand","aliases":["Silversand Hanko"],"city":"Hanko","region":"Uusimaa","address":"Aarne Karjalaisen tie 15, 10900 Hanko","type":"camping","website":"https://silversand.fi/","source":"https://silversand.fi/","description":"Merellinen leirintäalue, caravan-paikkoja ja mökkejä Hangossa.","season":"Toimijan mukaan avoinna ympäri vuoden; varmista palveluiden saatavuus ja paikka etukäteen.","openingStatus":"yearround","verifiedOpeningStatus":"yearround","verifiedServices":["electric","cottages","sauna","beach"],"sfcArea":false,"checked":"2026-10-12","verifiedSource":"https://silversand.fi/","verifiedNote":"Palveluiden saatavuus ja aukiolo tulee aina tarkistaa ennen saapumista."},{"id":"v288-etelalahti","name":"SFC Etelälahti","aliases":["SF-Caravan Etelälahti","Etelälahti"],"city":"Vihti","region":"Uusimaa","address":"Ollilantie 225 A, 03300 Otalampi","type":"camping","website":"https://www.etelalahti.fi/fi/caravanvieraspaikka","source":"https://www.etelalahti.fi/fi/caravanvieraspaikka","description":"SF-Caravanin alue Otalammella; sähköllisiä ja sähköttömiä vieraspaikkoja sekä saunavuoroja. Talvikaudella vastaanottoaikoja on rajoitettu.","season":"Vieraspaikkoja myös talviviikoilla 1–18 ja 41–52; varmista varaus ja vastaanotto etukäteen.","openingStatus":"yearround","verifiedOpeningStatus":"yearround","verifiedServices":["electric","sauna","shower","laundry","kitchen","beach"],"sfcArea":true,"checked":"2026-10-12","verifiedSource":"https://www.etelalahti.fi/fi/caravanvieraspaikka","verifiedNote":"Palveluiden saatavuus ja aukiolo tulee aina tarkistaa ennen saapumista."},{"id":"v288-loviisacamping","name":"Loviisa Camping","aliases":["Loviisan leirintäalue"],"city":"Loviisa","region":"Uusimaa","address":"Kapteenintie 1, 07900 Loviisa","type":"camping","website":"https://www.loviisa.fi/kulttuuri-ja-vapaa-aika/loviisa-camping/","source":"https://www.loviisa.fi/kulttuuri-ja-vapaa-aika/loviisa-camping/","description":"Loviisan keskustan läheinen leirintäalue, matkailuajoneuvopaikkoja sekä sauna-, suihku- ja keittiöpalveluja.","season":"Vuoden 2026 kausi 29.5.–15.9.2026; suljettu kauden ulkopuolella ellei toimija ilmoita muuta.","openingStatus":"seasonal","verifiedOpeningStatus":null,"verifiedServices":["electric","chemical","shower","sauna","laundry","kitchen","cafe","playground"],"sfcArea":false,"checked":"2026-10-12","verifiedSource":"https://www.loviisa.fi/kulttuuri-ja-vapaa-aika/loviisa-camping/","verifiedNote":"Palveluiden saatavuus ja aukiolo tulee aina tarkistaa ennen saapumista."}];
const list=window.caravanPlaces||(window.caravanPlaces=[]);
const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const compact=s=>norm(s).replace(/ /g,'');
for(const site of sites){
 const existing=list.find(p=>{
  if(p.id&&p.id===site.id)return true;
  if(norm(p.city)!==norm(site.city))return false;
  const a=compact(p.name),b=compact(site.name);if(a&&b&&(a===b||(a.length>7&&b.length>7&&(a.includes(b)||b.includes(a)))))return true;
  if(compact(p.address).length>11&&compact(p.address)===compact(site.address))return true;
  return [p.name,...(p.aliases||[])].some(n=>[site.name,...(site.aliases||[])].some(m=>compact(n).length>7&&(compact(n)===compact(m))));
 });
 if(existing){
  existing.region='Uusimaa';existing.city=site.city;existing.address=site.address;
  existing.source=site.source;existing.website=site.website;
  existing.verifiedSource=site.verifiedSource;existing.verifiedNote=site.verifiedNote;
  existing.verifiedServices=[...new Set([...(existing.verifiedServices||[]),...site.verifiedServices])];
  existing.serviceChecked=site.checked; existing.checked=site.checked;
  existing.openingStatus=site.openingStatus;existing.verifiedOpeningStatus=site.verifiedOpeningStatus;
  existing.season=site.season;
  if(site.sfcArea)existing.sfcArea=true;
 }else list.push({...site,url:'uusimaa.html'});
}
window.msUusimaaV288=sites;
})();