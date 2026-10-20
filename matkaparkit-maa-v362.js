/* Maakunnittainen matkaparkkitäydennys 20.10.2026. Lähde: Matkaparkki.comin kohdeluettelo; palvelut vain kun ne käyvät ilmi kohteen kuvauksesta. */
(()=>{'use strict';
const source='https://matkaparkki.com/matkaparkit/';
const rows=[
 ['kaustinen-halpahalli','HalpaHalli Kaustinen','Kaustinen','Pajalantie 4, 69600 Kaustinen','Keski-Pohjanmaa',[]],
 ['alajarvi-sivuparkki','Sivuparkki','Alajärvi','Rengastie 6, 62900 Alajärvi','Etelä-Pohjanmaa',['electric','shower','wc','greywater']],
 ['savonlinna-wanha-asema','Wanhan aseman matkaparkki','Savonlinna','Asemantie 11–13, 57100 Savonlinna','Etelä-Savo',['electric','wc']],
 ['hamina-metsontila','Metsontila','Hamina','Hovintie 15, 49540 Metsäkylä','Kymenlaakso',['electric','wc']],
 ['hailuoto-luovo','LUOVO matkaparkki','Hailuoto','Sumpuntie 103, 90480 Hailuoto','Pohjois-Pohjanmaa',[]],
 ['paimio-kurjenkyla','Kurjenkylän matkaparkki','Paimio','Kurjentie 158, 21530 Paimio','Varsinais-Suomi',[]],
 ['turku-moisio','Turun matkaparkki Moisio','Turku','Moision koulutie 27, 20400 Turku','Varsinais-Suomi',['electric','wc']],
 ['inkoo-keskusta','Inkoon matkaparkki','Inkoo','Suurkirkontie 9, 10210 Inkoo','Uusimaa',['electric','wc']],
 ['raasepori-lovdal','Lövdal','Raasepori','Sotilastorpantie 90, 10380 Raasepori','Uusimaa',[]],
 ['liperi-saturanta','Saturanta','Liperi','Kylänlahti 24, 83450 Liperi','Pohjois-Karjala',[]],
 ['heinola-hameenniemi','Hämeenniemi','Heinola','Paistjärventie 261, 19260 Heinola','Päijät-Häme',[]],
 ['valkeakoski-rantoo','Rantoon matkaparkki','Valkeakoski','Rantoontie 330, 37860 Valkeakoski','Pirkanmaa',[]],
 ['sastamala-tervakallio','Tervakallio Matkaparkki','Sastamala','Uittomiehenkatu 26, 38210 Sastamala','Pirkanmaa',[]],
 ['jyvaskyla-korpilahti-satama','Korpilahden Satama','Jyväskylä','Korpilahdentie 8, 41800 Korpilahti','Keski-Suomi',[]],
 ['tuusniemi-matkapysakki','Tuusniemi Matkapysäkki','Tuusniemi','Laivarannantie 2, 71280 Tuusniemi','Pohjois-Savo',[]],
 ['rauma-haplantie','Rauman matkaparkki','Rauma','Häpläntie 9, 26100 Rauma','Satakunta',[]],
 ['puolanka-saunapiha','Karavaanari P saunapihalla','Puolanka','Hoikanvaarantie 167, 89140 Puolanka','Kainuu',['wc']]
];
const places=window.caravanPlaces||(window.caravanPlaces=[]);
const known=window.msMatkaparkitV274||(window.msMatkaparkitV274=[]);
const regions=window.municipalityRegions||(window.municipalityRegions={});
const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const street=s=>norm(String(s||'').split(',')[0]);
for(const [suffix,name,city,address,region,verifiedServices] of rows){
 const id='ms362-'+suffix;
 const existingPlace=places.find(x=>x.city===city&&(norm(x.name)===norm(name)||street(x.address)===street(address)));
 const description='Matkailuajoneuvon yöpymiskohde. Tarkista ajankohtainen aukiolo, varaus ja palvelut suoraan kohteelta ennen matkaa.';
 const p={id,name,city,address,region,type:'park',season:'🅿️ Matkaparkki · tarkista aukiolo',description,
  url:'matkaparkki-kohde.html?id='+encodeURIComponent(id),website:source,sourceUrl:source,
  map:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address),
  navigate:'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(address),
  verifiedServices,detailId:id,priceText:'Tarkista ajankohtainen hinta ja varaus kohteelta.',
  stayText:'Varmista saapuminen ja mahdollinen kausiluonteisuus kohteelta.',checked:'2026-10-20'};
 if(existingPlace){existingPlace.verifiedServices=[...new Set([...(existingPlace.verifiedServices||[]),...verifiedServices])];}
 else {places.push(p);known.push(p);}
 if(!regions[city])regions[city]=region;
}
window.msRefreshStayFilters?.();
})();
