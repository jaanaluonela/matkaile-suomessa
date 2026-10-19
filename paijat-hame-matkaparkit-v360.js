/* Päijät-Hämeen matkaparkkien tiedot, lähteet tarkistettu 19.10.2026.
 * Ei päätellä puuttuvia palveluita eikä kemiallisen WC:n tyhjennystä harmaavedeksi.
 */
(()=>{'use strict';
const updates={
 'ms274-asikkala-kanavaanari-vaaksyn-matkaparkki':{
  website:'https://asikkala.fi/kohteet/kanavaanari-vaaksyn-matkaparkki/',
  sourceUrl:'https://app.matkaparkki.com/matkaparkit/d67aJnS49r1FZ8OqF1iI',
  priceText:'Alkaen 17 €/yö + varausmaksu; sähkö lisämaksusta (tarkista varatessa).',
  stayText:'Saapuminen klo 14 alkaen, lähtö viimeistään klo 13.45 (sovittavissa).',
  verifiedServices:['electric','wc'],
  description:'Vääksyn kanavan vieressä 20 paikkaa, sähköllisen tai sähköttömän varauksen mukaan. WC, suihku, vesi ja kemiallisen WC:n tyhjennys. Harmaaveden tyhjennystä ei ole vahvistettu.',
  season:'Tarkista saatavuus ja palvelujen aukiolo'
 },
 'ms274-heinola-heinolan-sataman-matkaparkki':{
  website:'https://www.rantakylpyla.fi/matkaparkki',
  sourceUrl:'https://app.matkaparkki.com/matkaparkit/1IaJYZHwufkaUBeIMBYk',
  priceText:'Tarkista ajantasainen yöhinta varauspalvelusta.',
  stayText:'Saapuminen klo 14 alkaen, lähtö viimeistään klo 13.45.',
  verifiedServices:['electric','wc'],
  verifiedOpeningStatus:'yearround',
  description:'Sataman matkaparkki keskustan vieressä. Sähkö, WC, suihku ja vesi. Palveluntarjoajan mukaan matkaparkki on käytössä ympäri vuoden; tarkista yksittäisten tilojen aukiolo.',
  season:'Matkaparkki ympäri vuoden · varmista palvelut'
 },
 'ms274-heinola-vidnasin-kartano':{
  website:'https://www.vidnasinkartano.fi/caravanalue/',
  sourceUrl:'https://www.vidnasinkartano.fi/caravanalue/',
  priceText:'Syys–huhtikuu 18 €/vrk (sähköllä 24 €); touko–elokuu 23 €/vrk (sähköllä 29 €).',
  stayText:'Majoitusvuorokausi klo 14–14; sovi sisäänkirjautumisesta, jos saavut ravintolan aukioloajan ulkopuolella.',
  verifiedServices:['electric','wc'],
  address:'Viikinäistentie 203A, 19210 Lusi',
  description:'Vidnäsin kartanon 18 caravan-paikkaa sähköllä tai ilman. Huoltorakennuksessa WC, suihku ja kasetti-WC:n tyhjennys. Matkaparkki-palvelun listausosoite poikkeaa kartanon ilmoittamasta osoitteesta; varmista ajo-ohje palveluntarjoajalta. Harmaavesipalvelua ei ole vahvistettu.',
  season:'Tarkista caravan-alueen saatavuus'
 },
 'ms274-lahti-hennalan-matkaparkki-lahti':{
  website:'https://app.matkaparkki.com/matkaparkit/nluOkg3TFpOufubuKQmD',
  sourceUrl:'https://app.matkaparkki.com/matkaparkit/nluOkg3TFpOufubuKQmD',
  priceText:'Alkaen 9 €/yö + varausmaksu (tarkista valituille päiville).',
  stayText:'Saapuminen klo 14 alkaen, lähtö viimeistään klo 12.',
  verifiedServices:[],
  description:'Pieni matkaparkki Hennalassa. Kohteen ilmoituksessa mainitaan sähkö, mutta saatavuudesta on ristiriitaisia kokemuksia: varmista sähkö ennen varausta. WC:tä tai harmaaveden tyhjennystä ei ole vahvistettu.',
  season:'Tarkista saatavuus ja sähkö'
 },
 'ms274-lahti-karkkainen-lahti':{
  website:'https://app.matkaparkki.com/matkaparkit/LpZCzejq250RRf6acw61',
  sourceUrl:'https://app.matkaparkki.com/matkaparkit/LpZCzejq250RRf6acw61',
  priceText:'Alkaen 8 €/yö + varausmaksu (tarkista valituille päiville).',
  stayText:'Saapuminen klo 14 alkaen, lähtö viimeistään klo 12.',
  verifiedServices:['electric'],
  description:'Kärkkäisen pihassa kuusi sähköllistä paikkaa. Varausvahvistuksen koodilla saa sähkötolpan avaimen. WC:tä tai harmaaveden tyhjennystä ei ole vahvistettu.',
  season:'Tarkista saatavuus'
 },
 'ms274-lahti-renkomaki':{
  website:'https://app.matkaparkki.com/matkaparkit/50AEFxKzQEH8fSgNNytj',
  sourceUrl:'https://app.matkaparkki.com/matkaparkit/50AEFxKzQEH8fSgNNytj',
  priceText:'Alkaen 19 €/yö + varausmaksu (tarkista valituille päiville).',
  stayText:'Saapuminen klo 15 alkaen, lähtö viimeistään klo 12; ota yhteyttä varauksen jälkeen.',
  verifiedServices:['electric','wc'],
  description:'Yksi paikka matkailuautolle yksityispihassa. Pitkän vaunuyhdistelmän vaunu on irrotettava. Sähkö, WC, suihku ja vesi on ilmoitettu; harmaaveden tyhjennystä ei ole vahvistettu.',
  season:'Tarkista saatavuus'
 }
};
const lookup={
 'Asikkala|Melakuja 4':'ms274-asikkala-kanavaanari-vaaksyn-matkaparkki',
 'Heinola|Maaherrankatu 1':'ms274-heinola-heinolan-sataman-matkaparkki',
 'Heinola|Viquatie 2':'ms274-heinola-vidnasin-kartano',
 'Lahti|Pataljoonankatu 3':'ms274-lahti-hennalan-matkaparkki-lahti',
 'Lahti|Pasaasi 2':'ms274-lahti-karkkainen-lahti',
 'Lahti|Mustatiaisenkatu 11':'ms274-lahti-renkomaki'
};
for(const list of [window.caravanPlaces,window.msMatkaparkitV274]){
 if(!Array.isArray(list))continue;
 for(const place of list){
  const key=place?.city+'|'+String(place?.address||'').split(',')[0];
  const detailId=updates[place?.id]?place.id:lookup[key];
  const extra=updates[detailId];
  if(!extra)continue;
  Object.assign(place,extra,{checked:'2026-10-19',detailId});
  if(detailId==='ms274-heinola-vidnasin-kartano')
    place.navigate='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(place.address);
 }
}
})(); 
