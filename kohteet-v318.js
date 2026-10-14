/* v318 · Uusia kohteita: varmennetut osoitteet, palvelut ja viralliset sivut. */
(()=>{'use strict';
const places=window.caravanPlaces||[];
const existing=places.filter(p=>p.city==='Pihtipudas'&&/niemenharju/i.test(p.name||'')&&p.type==='camping');
if(existing.length){
  const primary=existing.find(p=>p.id==='v265-niemenharjun-matkailukeskus-caravan')||existing[0];
  Object.assign(primary,{url:'niemenharju-matkailukeskus.html',website:'https://niemenharju.fi/',openingStatus:'yearround',season:'Caravan-alue avoinna ympäri vuoden',description:'Nelostien varrella Pihtiputaalla. 44 sähköistettyä caravan-paikkaa, sauna, suihkut, WC, keittiö ja pyykinpesu. Ravintola, kahvila ja majoitusta.',verifiedServices:['electric','shower','sauna','wc','cottages','cafe','kitchen','laundry'],checked:'2026-10-14'});
  for(const p of existing){if(p!==primary){const i=places.indexOf(p);if(i>=0)places.splice(i,1);}}
}
// Pihtiputaan keskusta (GeoNames/Wikidata) lähtöpaikaksi myös Lähellä minua -hakuun.
const origins=window.nearbyOrigins||(window.nearbyOrigins=[]);
if(!origins.some(o=>o.name==='Pihtipudas'))origins.push({name:'Pihtipudas',lat:63.369603,lon:25.575418,aliases:[]});
// Lisätään lähihakuun kohde vain, kun GPS on varmennettu.
const nearby=window.nearbyData||(window.nearbyData=[]);
const addNearby=p=>{if(!nearby.some(x=>x.city===p.city&&x.name===p.name))nearby.push(p);};
addNearby({name:'Niemenharjun Matkailukeskus',city:'Pihtipudas',address:'Harjukatu 2, 44800 Pihtipudas',description:'Nelostien varrella ravintola, kahvila ja ympärivuotinen caravan-alue.',type:'stop',url:'niemenharju-matkailukeskus.html',lat:63.347066,lon:25.605677,coordinate_source:'Visit Jyväskylä Region / Outdooractive',id:'ms318-niemenharju-stop'});
// Lönnebergalle ei aseteta keksittyjä GPS-koordinaatteja. Näkyy Pysähdy matkalla -haussa.
const highlights=window.visitHighlights||(window.visitHighlights=[]);
const visits=[
 {name:'Kotieläinpiha Lönneberga',city:'Siuntio',region:'Uusimaa',address:'Kynnarintie 310, 02570 Siuntio',description:'Lasten kanssa: noin 60 eläintä, eläinten silittelyä ja ruokintaa sekä kesäkahvila. Kausikohde – tarkista aukiolo ennen lähtöä.',type:'sight',family:true,url:'lonneberga-siuntio.html',mapUrl:'https://www.google.com/maps/search/?api=1&query=Kynnarintie+310+02570+Siuntio'},
 {name:'Niemenharjun Matkailukeskus',city:'Pihtipudas',region:'Keski-Suomi',address:'Harjukatu 2, 44800 Pihtipudas',description:'Nelostien taukopaikka: lounas, kahvila ja ravintolat sekä ympärivuotinen caravan-alue.',type:'stop',url:'niemenharju-matkailukeskus.html',mapUrl:'https://www.google.com/maps/search/?api=1&query=Harjukatu+2+Pihtipudas'}
];
for(const v of visits){if(!highlights.some(p=>p.name===v.name&&p.city===v.city))highlights.push(v);}
})();
