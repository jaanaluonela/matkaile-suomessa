/* Matkailu Suomessa v264: tarkistettuja leirintäalueita. Älä lisää kaksoiskohteita. */
(() => {
  'use strict';
  const additions = [
  {
    "id": "v264-nallikari",
    "name": "Nallikari Lomakylä – Camping",
    "city": "Oulu",
    "address": "Leiritie 10, 90510 Oulu",
    "website": "https://nallikari.fi/en/camping/price-list/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden",
    "description": "Matkailuajoneuvo- ja leirintäalue Nallikarin rannalla. Sähköpaikkoja ja huoltorakennuksia. Leirintäalue on ympärivuotinen; vastaanoton aukiolo vaihtelee vuodenajan mukaan.",
    "phone": "+358 44 703 1353",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-nallikari",
    "map": "https://www.google.com/maps/search/?api=1&query=Nallikari%20Lomakyl%C3%A4%20%E2%80%93%20Camping%2C%20Leiritie%2010%2C%2090510%20Oulu",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Nallikari%20Lomakyl%C3%A4%20%E2%80%93%20Camping%2C%20Leiritie%2010%2C%2090510%20Oulu"
  },
  {
    "id": "v264-santalahti",
    "name": "Santalahti Resort – Camping",
    "city": "Kotka",
    "address": "Santalahdentie 150, 48310 Kotka",
    "website": "https://santalahti.fi/en/finland-accommodation-santalahti/5-star-kotka-camping/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden; talvikaudella ennakkovaraus",
    "description": "Merenrannan viiden tähden leirintäalue. Talvikaudella 27.9.2026–29.4.2027 matkailuajoneuvopaikka on varattava etukäteen, ja käytössä on yksi huoltorakennus.",
    "phone": "+358 5 260 5055",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-santalahti",
    "map": "https://www.google.com/maps/search/?api=1&query=Santalahti%20Resort%20%E2%80%93%20Camping%2C%20Santalahdentie%20150%2C%2048310%20Kotka",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Santalahti%20Resort%20%E2%80%93%20Camping%2C%20Santalahdentie%20150%2C%2048310%20Kotka"
  },
  {
    "id": "v264-linnunlahti",
    "name": "Holiday Linnunlahti – Caravan & Camping",
    "city": "Joensuu",
    "address": "Linnunlahdentie 1, 80110 Joensuu",
    "website": "https://linnunlahti.fi/en/caravan-camping/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden (caravan); telttailu kesäisin",
    "description": "Pyhäselän rannalla Joensuun keskustan läheisyydessä. 120 matkailuajoneuvopaikkaa, joista 80 sähköistettyä; huoltorakennukset ja keittiö. Caravan-alue palvelee ympäri vuoden, telttailu painottuu kesään.",
    "phone": "+358 400 333 133",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-linnunlahti",
    "map": "https://www.google.com/maps/search/?api=1&query=Holiday%20Linnunlahti%20%E2%80%93%20Caravan%20%26%20Camping%2C%20Linnunlahdentie%201%2C%2080110%20Joensuu",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Holiday%20Linnunlahti%20%E2%80%93%20Caravan%20%26%20Camping%2C%20Linnunlahdentie%201%2C%2080110%20Joensuu"
  },
  {
    "id": "v264-silversand",
    "name": "Camping Silversand",
    "city": "Hanko",
    "address": "Aarne Karjalaisen tie 15, 10900 Hanko",
    "website": "https://silversand.fi/yhteystiedot/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden",
    "description": "Meren rannalla Hangossa sijaitseva leirintäalue. Omien sivujen mukaan avoinna ympäri vuoden päivittäin klo 10–21; ajoneuvopaikoille sisäänkirjautuminen klo 13 jälkeen.",
    "phone": "+358 19 248 5500",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-silversand",
    "map": "https://www.google.com/maps/search/?api=1&query=Camping%20Silversand%2C%20Aarne%20Karjalaisen%20tie%2015%2C%2010900%20Hanko",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Camping%20Silversand%2C%20Aarne%20Karjalaisen%20tie%2015%2C%2010900%20Hanko"
  },
  {
    "id": "v264-laajis",
    "name": "Laajis Urban Caravan",
    "city": "Jyväskylä",
    "address": "Laajavuorentie 15, 40740 Jyväskylä",
    "website": "https://laajis.fi/urbancaravan/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden; kesä- ja talvihinnat",
    "description": "Laajavuoren caravan-alue noin neljän kilometrin päässä Jyväskylän keskustasta. Yli 80 sähköpaikkaa sekä suihku-, sauna- ja keittiötilat. Syksyllä ja talvella ennakkovaraus suositeltava.",
    "phone": "+358 20 743 6436",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-laajis",
    "map": "https://www.google.com/maps/search/?api=1&query=Laajis%20Urban%20Caravan%2C%20Laajavuorentie%2015%2C%2040740%20Jyv%C3%A4skyl%C3%A4",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Laajis%20Urban%20Caravan%2C%20Laajavuorentie%2015%2C%2040740%20Jyv%C3%A4skyl%C3%A4"
  },
  {
    "id": "v264-kokkola",
    "name": "Kokkola Camping Meripuisto",
    "city": "Kokkola",
    "address": "Vanhansatamanlahdentie 20, 67200 Kokkola",
    "website": "https://www.kokkolacamping.fi/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden; talvella varattava etukäteen",
    "description": "Meripuiston rannan caravan-alueella on noin 70 sähköpaikkaa, huoltorakennus ja leirintäpalvelut. Kesäsesongin ulkopuolella ennakkovaraus on välttämätön.",
    "phone": "+358 44 778 0792",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-kokkola",
    "map": "https://www.google.com/maps/search/?api=1&query=Kokkola%20Camping%20Meripuisto%2C%20Vanhansatamanlahdentie%2020%2C%2067200%20Kokkola",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Kokkola%20Camping%20Meripuisto%2C%20Vanhansatamanlahdentie%2020%2C%2067200%20Kokkola"
  },
  {
    "id": "v264-rauhalahti",
    "name": "Matkailukeskus Rauhalahti – Camping",
    "city": "Kuopio",
    "address": "Rauhankatu 3, 70700 Kuopio",
    "website": "https://visitrauhalahti.fi/rauhalahti/leirinta/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden; talvella supistetut palvelut",
    "description": "Kallaveden läheisyydessä Kuopiossa sijaitseva leirintäalue. Kesällä noin 150 sähköpaikkaa, talvikaudella 27; talvisin käytössä erillinen huoltorakennus.",
    "phone": "+358 30 087 0875",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-rauhalahti",
    "map": "https://www.google.com/maps/search/?api=1&query=Matkailukeskus%20Rauhalahti%20%E2%80%93%20Camping%2C%20Rauhankatu%203%2C%2070700%20Kuopio",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Matkailukeskus%20Rauhalahti%20%E2%80%93%20Camping%2C%20Rauhankatu%203%2C%2070700%20Kuopio"
  },
  {
    "id": "v264-poroholma",
    "name": "Poroholman Lomakeskus – Caravan",
    "city": "Rauma",
    "address": "Poroholmantie 8, 26100 Rauma",
    "website": "https://www.poroholma.fi/fi/paikkavaraukset",
    "openingStatus": "seasonal",
    "season": "Kesäkausi 1.5.–1.10.2026",
    "description": "Rauman merenrannassa sijaitseva lomakeskus, jossa on caravan- ja telttapaikkoja sekä huoltopalveluja. Paikat jaetaan saapumisjärjestyksessä, eikä matkailuajoneuvopaikkoja varata ennakkoon.",
    "phone": "+358 2 533 5522",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-poroholma",
    "map": "https://www.google.com/maps/search/?api=1&query=Poroholman%20Lomakeskus%20%E2%80%93%20Caravan%2C%20Poroholmantie%208%2C%2026100%20Rauma",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Poroholman%20Lomakeskus%20%E2%80%93%20Caravan%2C%20Poroholmantie%208%2C%2026100%20Rauma"
  },
  {
    "id": "v264-harmala",
    "name": "Tampere Camping Härmälä",
    "city": "Tampere",
    "address": "Leirintäkatu 8, 33900 Tampere",
    "website": "https://harmalacamping.fi/",
    "openingStatus": "seasonal",
    "season": "Kesäkausi; 2026 päättynyt, avaus 13.5.2027",
    "description": "Pyhäjärven rannalla Tampereella. Sähköistettyjä matkailuajoneuvopaikkoja ja teltta-alue sekä kesäisin ravintola ja saunapalveluja. Vuoden 2026 kausi on päättynyt.",
    "phone": "+358 300 870 873",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-harmala",
    "map": "https://www.google.com/maps/search/?api=1&query=Tampere%20Camping%20H%C3%A4rm%C3%A4l%C3%A4%2C%20Leirint%C3%A4katu%208%2C%2033900%20Tampere",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Tampere%20Camping%20H%C3%A4rm%C3%A4l%C3%A4%2C%20Leirint%C3%A4katu%208%2C%2033900%20Tampere"
  },
  {
    "id": "v264-yyteri",
    "name": "Yyteri Resort & Camping",
    "city": "Pori",
    "address": "Yyterinsantojentie 1, 28840 Pori",
    "website": "https://yytericamping.fi/yyteri/info/",
    "openingStatus": "unknown",
    "season": "Aukiolo ja saapuminen varmistettava",
    "description": "Leirintäalue Yyterin hiekkarannan vieressä. 28.9.2026 alkaen vastaanotto palvelee sopimuksen mukaan; matkailuajoneuvomajoittumiseen on myös omatoimikirjautuminen. Varmista huoltopalvelut ja varauksen ehdot.",
    "phone": "+358 300 870 876",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-yyteri",
    "map": "https://www.google.com/maps/search/?api=1&query=Yyteri%20Resort%20%26%20Camping%2C%20Yyterinsantojentie%201%2C%2028840%20Pori",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Yyteri%20Resort%20%26%20Camping%2C%20Yyterinsantojentie%201%2C%2028840%20Pori"
  },
  {
    "id": "v264-top-vaasa",
    "name": "Top Camping Vaasa",
    "city": "Vaasa",
    "address": "Niemeläntie 1, 65170 Vaasa",
    "website": "https://www.tropiclandia.fi/topcamping/",
    "openingStatus": "seasonal",
    "season": "15.5.–4.10.2026",
    "description": "Vaskiluodon leirintäalue meren läheisyydessä. Matkailuajoneuvo- ja telttapaikkoja sekä leirintämökkejä. Vuoden 2026 ilmoitettu kausi päättyi 4.10.",
    "phone": "+358 20 796 1255",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-top-vaasa",
    "map": "https://www.google.com/maps/search/?api=1&query=Top%20Camping%20Vaasa%2C%20Niemel%C3%A4ntie%201%2C%2065170%20Vaasa",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Top%20Camping%20Vaasa%2C%20Niemel%C3%A4ntie%201%2C%2065170%20Vaasa"
  },
  {
    "id": "v264-naantali",
    "name": "Naantali Camping",
    "city": "Naantali",
    "address": "Kopenkatu 20, 21100 Naantali",
    "website": "https://www.naantalicamping.fi/",
    "openingStatus": "seasonal",
    "season": "Caravan-paikat 1.3.–30.11.2026; syksyllä omatoimivaraus",
    "description": "Meren rannalla lähellä Naantalin keskustaa. Caravan- ja telttapaikkoja. Pääsesongin jälkeen omatoimikirjautuminen ja varattavat caravan-paikat, rajoitetut palvelut.",
    "phone": "+358 400 225 334",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-naantali",
    "map": "https://www.google.com/maps/search/?api=1&query=Naantali%20Camping%2C%20Kopenkatu%2020%2C%2021100%20Naantali",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Naantali%20Camping%2C%20Kopenkatu%2020%2C%2021100%20Naantali"
  },
  {
    "id": "v264-saloranta",
    "name": "SF-Caravan Naantali Saloranta",
    "city": "Naantali",
    "address": "Vehotniementie 66, Poikko, Naantali",
    "website": "https://sfcnaantali.fi/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden",
    "description": "Naantalin saariston caravan-alue, noin 130 sähköistettyä ajoneuvopaikkaa sekä saunoja ja huoltopalveluja. Ympärivuotinen toiminta; päivystys- ja vastaanottoajat vaihtelevat.",
    "phone": "+358 44 967 4453",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-saloranta",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Naantali%20Saloranta%2C%20Vehotniementie%2066%2C%20Poikko%2C%20Naantali",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Naantali%20Saloranta%2C%20Vehotniementie%2066%2C%20Poikko%2C%20Naantali"
  },
  {
    "id": "v264-tammisaari",
    "name": "Tammisaari Camping Ekenäs",
    "city": "Raasepori",
    "address": "Pursitie 1, 10600 Tammisaari",
    "website": "https://www.ek-camping.com/",
    "openingStatus": "seasonal",
    "season": "Ilmoitettu kausi 1.4.–30.11.2026",
    "description": "Tammisaaren Ormnäsin leirintäalue saaristomaisemissa lähellä Hagenin luonnonpuistoa. Asuntovaunu- ja telttapaikkoja sekä mökkejä. Tarkista loppusyksyn palvelut.",
    "phone": "+358 19 241 4434",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-tammisaari",
    "map": "https://www.google.com/maps/search/?api=1&query=Tammisaari%20Camping%20Eken%C3%A4s%2C%20Pursitie%201%2C%2010600%20Tammisaari",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Tammisaari%20Camping%20Eken%C3%A4s%2C%20Pursitie%201%2C%2010600%20Tammisaari"
  },
  {
    "id": "v264-ahtari",
    "name": "Ähtäri Camping",
    "city": "Ähtäri",
    "address": "Karhunkierros 229, 63700 Ähtäri",
    "website": "https://ahtaricamping.fi/saapuminen-ja-avaimet/",
    "openingStatus": "unknown",
    "season": "Caravan-alueen kausi varmistettava",
    "description": "Eläinpuiston läheisyydessä sijaitseva leirintäalue Hankaveden rannalla. Sähköistettyjä matkailuajoneuvopaikkoja ja huoltopalveluja. Alueella on ympärivuotisia majoitusvaihtoehtoja, mutta caravan-paikkojen syys- ja talvikausi on varmistettava erikseen.",
    "phone": "+358 44 493 6108",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-ahtari",
    "map": "https://www.google.com/maps/search/?api=1&query=%C3%84ht%C3%A4ri%20Camping%2C%20Karhunkierros%20229%2C%2063700%20%C3%84ht%C3%A4ri",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=%C3%84ht%C3%A4ri%20Camping%2C%20Karhunkierros%20229%2C%2063700%20%C3%84ht%C3%A4ri"
  },
  {
    "id": "v264-kalajoki",
    "name": "Top Camping Kalajoki",
    "city": "Kalajoki",
    "address": "Tuomipakkaintie 20, 85100 Kalajoki",
    "website": "https://topcampingkalajoki.fi/",
    "openingStatus": "seasonal",
    "season": "Kesäkausi 15.5.–6.9.2026",
    "description": "Kalajoen Hiekkasärkkien yhteydessä sijaitseva leirintäalue, jossa on matkailuajoneuvo- ja telttapaikkoja. Vuoden 2026 ilmoitettu kausi päättyi 6.9.",
    "phone": "+358 8 469 5200",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v264.html?kohde=v264-kalajoki",
    "map": "https://www.google.com/maps/search/?api=1&query=Top%20Camping%20Kalajoki%2C%20Tuomipakkaintie%2020%2C%2085100%20Kalajoki",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Top%20Camping%20Kalajoki%2C%20Tuomipakkaintie%2020%2C%2085100%20Kalajoki"
  }
];
  const regions = {"Oulu": "Pohjois-Pohjanmaa", "Kotka": "Kymenlaakso", "Joensuu": "Pohjois-Karjala", "Hanko": "Uusimaa", "Jyväskylä": "Keski-Suomi", "Kokkola": "Keski-Pohjanmaa", "Kuopio": "Pohjois-Savo", "Rauma": "Satakunta", "Tampere": "Pirkanmaa", "Pori": "Satakunta", "Vaasa": "Pohjanmaa", "Naantali": "Varsinais-Suomi", "Raasepori": "Uusimaa", "Ähtäri": "Etelä-Pohjanmaa", "Kalajoki": "Pohjois-Pohjanmaa"};
  const list=window.caravanPlaces||(window.caravanPlaces=[]);
  const normal=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const host=u=>{try {return new URL(u).hostname.replace(/^www\./,'');}catch(_){return '';}};
  for(const extra of additions){
    const match=list.find(p => p && p.type==='camping' && (
      p.id===extra.id ||
      (normal(p.city)===normal(extra.city) && (
        normal(p.name)===normal(extra.name) ||
        (p.address && normal(p.address)===normal(extra.address)) ||
        (p.website && host(p.website)===host(extra.website) && host(extra.website) && host(extra.website)!=='camping.fi')
      ))
    ));
    if(match){
      // Ei vaihdeta olemassa olevaa linkkiä tai nimeä. Lisätään vain vahvistettu aukiolostatus,
      // ellei vastaavaa tietoa jo ole.
      if(!match.openingStatus && extra.openingStatus!=='unknown'){
        match.openingStatus=extra.openingStatus;
        match.season=extra.season;
        match.checked=extra.checked;
      }
      if(!match.website)match.website=extra.website;
      continue;
    }
    list.push(extra);
  }
  const mapping=window.municipalityRegions||(window.municipalityRegions={});
  for(const [town,county] of Object.entries(regions)) if(!mapping[town])mapping[town]=county;
  // Leirintäalueiden kuntavalikko näyttää myös ne paikkakunnat, joilta kuntasivu puuttuu.
  // Paikkakunnan suora linkki vie silloin leirintäalueiden kuntasuodatukseen.
  if(document.body && ['camping','all'].includes(document.body.dataset.kind)){
    const towns=window.siteMunicipalities||(window.siteMunicipalities={});
    for(const town of Object.keys(regions)){
      if(!towns[town])towns[town]='leirintaalueet.html?kunta='+encodeURIComponent(town);
    }
  }
  window.campgroundsAddedV264=additions;
})();
