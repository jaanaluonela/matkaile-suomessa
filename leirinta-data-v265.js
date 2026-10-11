/* Matkailu Suomessa v265 – ympärivuotiset caravan- ja leirintäalueet. Vain varmennetut kohteet. */
(() => {
  'use strict';
  const additions = [
  {
    "id": "v265-sf-caravan-lintulahti",
    "name": "SF-Caravan Lintulahti",
    "city": "Äänekoski",
    "address": "Lintulantie 5 A, 44440 Räihä",
    "website": "https://www.kskaravaanarit.fi/alueet/lintulahti/",
    "openingStatus": "yearround",
    "season": "Avoinna 1.1.–31.12.; isäntäpäivystys ympäri vuoden.",
    "description": "Karavaanialue Konginkankaalla E75-tien lähellä. Vastaanotto palvelee myös talvikaudella; saunojen vuorot vaihtelevat.",
    "phone": "+358 40 748 5377",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sf-caravan-lintulahti",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Lintulahti%2C%20Lintulantie%205%20A%2C%2044440%20R%C3%A4ih%C3%A4",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Lintulahti%2C%20Lintulantie%205%20A%2C%2044440%20R%C3%A4ih%C3%A4",
    "region": "Keski-Suomi"
  },
  {
    "id": "v265-sf-caravan-hietasaari",
    "name": "SF-Caravan Hietasaari",
    "city": "Uurainen",
    "address": "Hietasaarentie 128, 41240 Kyynämöinen",
    "website": "https://www.kskaravaanarit.fi/hietasaari-tanaan/",
    "openingStatus": "yearround",
    "season": "Avoinna 1.1.–31.12.; 1.10. alkaen rajoitetut isäntä- ja toimistoajat.",
    "description": "Luonnonkaunis Hietasaaren leirintäalue. Syksyn ja talven vastaanottoajat poikkeavat kesäajoista; soita tarvittaessa isännälle.",
    "phone": "+358 400 259 899",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sf-caravan-hietasaari",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Hietasaari%2C%20Hietasaarentie%20128%2C%2041240%20Kyyn%C3%A4m%C3%B6inen",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Hietasaari%2C%20Hietasaarentie%20128%2C%2041240%20Kyyn%C3%A4m%C3%B6inen",
    "region": "Keski-Suomi"
  },
  {
    "id": "v265-riihivuori-caravan",
    "name": "Riihivuori Caravan",
    "city": "Muurame",
    "address": "Riihivuorentie 313, 40950 Muurame",
    "website": "https://www.riihivuorenlomakyla.fi/riihivuori-caravan/",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; paikka ostetaan verkosta ja saapumisohje toimitetaan sähköpostiin.",
    "description": "Riihivuoren huipulla sijaitseva matkailuajoneuvoalue. Sähkö, sauna, huoltotilat, kemiallisen WC:n tyhjennys. Ennakkopidä maksukuitti tallessa.",
    "phone": "",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-riihivuori-caravan",
    "map": "https://www.google.com/maps/search/?api=1&query=Riihivuori%20Caravan%2C%20Riihivuorentie%20313%2C%2040950%20Muurame",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Riihivuori%20Caravan%2C%20Riihivuorentie%20313%2C%2040950%20Muurame",
    "region": "Keski-Suomi"
  },
  {
    "id": "v265-niemenharjun-matkailukeskus-caravan",
    "name": "Niemenharjun Matkailukeskus – Caravan",
    "city": "Pihtipudas",
    "address": "Harjukatu 2, 44800 Pihtipudas",
    "website": "https://niemenharju.fi/",
    "openingStatus": "yearround",
    "season": "Caravan-alue avoinna 24/7, 1.1.–31.12.",
    "description": "Matkailukeskuksen caravan-alueella on 44 sähköistettyä paikkaa ja huoltorakennus palveluineen.",
    "phone": "",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-niemenharjun-matkailukeskus-caravan",
    "map": "https://www.google.com/maps/search/?api=1&query=Niemenharjun%20Matkailukeskus%20%E2%80%93%20Caravan%2C%20Harjukatu%202%2C%2044800%20Pihtipudas",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Niemenharjun%20Matkailukeskus%20%E2%80%93%20Caravan%2C%20Harjukatu%202%2C%2044800%20Pihtipudas",
    "region": "Keski-Suomi"
  },
  {
    "id": "v265-sf-caravan-alatalo",
    "name": "SF-Caravan Alatalo",
    "city": "Kuopio",
    "address": "Jänneniementie 264, 70940 Jännevirta",
    "website": "https://www.sfc-kuopionseutu.net/",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; 1.9.–31.5. omatoimialue.",
    "description": "Juurusveden rannalla sijaitseva yhdistyksen caravan-alue. Talvikaudella saapuminen ja maksu omatoimiohjeiden mukaan.",
    "phone": "+358 50 309 8012",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sf-caravan-alatalo",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Alatalo%2C%20J%C3%A4nneniementie%20264%2C%2070940%20J%C3%A4nnevirta",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Alatalo%2C%20J%C3%A4nneniementie%20264%2C%2070940%20J%C3%A4nnevirta",
    "region": "Pohjois-Savo"
  },
  {
    "id": "v265-sf-caravan-hiilimutka",
    "name": "SF-Caravan Hiilimutka",
    "city": "Vieremä",
    "address": "Nissiläntie 135, 74230 Salahmi",
    "website": "https://hiilimutka.fi/",
    "openingStatus": "yearround",
    "season": "Ympärivuotinen caravan-alue; 1.6.–31.8. isäntäpäivystys, muu aika omatoiminen.",
    "description": "Salahmijärven rannalla Vieremällä. Talvikäytössä yläpihan sora-alue; osa kesän nurmipaikoista ei ole talvella käytettävissä.",
    "phone": "+358 400 496 950",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sf-caravan-hiilimutka",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Hiilimutka%2C%20Nissil%C3%A4ntie%20135%2C%2074230%20Salahmi",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Hiilimutka%2C%20Nissil%C3%A4ntie%20135%2C%2074230%20Salahmi",
    "region": "Pohjois-Savo"
  },
  {
    "id": "v265-sf-caravan-jokiranta",
    "name": "SF-Caravan Jokiranta",
    "city": "Joroinen",
    "address": "Tuohilahdentie 104, 79600 Joroinen",
    "website": "https://www.sfcjokiranta.fi/",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; omatoimialue 1.9.2026–31.5.2027.",
    "description": "Rannan caravan-alue, jossa suihkut, WC, sauna ja kemiallisen WC:n tyhjennys. Talvikauden ilmoittautumisohjeet sivustolta.",
    "phone": "+358 50 376 7171",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sf-caravan-jokiranta",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Jokiranta%2C%20Tuohilahdentie%20104%2C%2079600%20Joroinen",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Jokiranta%2C%20Tuohilahdentie%20104%2C%2079600%20Joroinen",
    "region": "Pohjois-Savo"
  },
  {
    "id": "v265-sfc-hietajarvi",
    "name": "SFC-Hietajärvi",
    "city": "Joensuu",
    "address": "Kiihtelystie 201, 82140 Kiihtelysvaara",
    "website": "https://www.sfc-hietajarvi.fi/hinnasto/",
    "openingStatus": "yearround",
    "season": "Ympäri vuoden; 1.10.–30.4. omatoimialue VAIN SF-Caravan-jäsenille.",
    "description": "Joensuun Kiihtelysvaaran caravan-alue. HUOM! Talvikaudella alue on avoinna vain SF-Caravan-jäsenille. Kesäisäntäpäivystyksen aikana myös muut voivat majoittua.",
    "phone": "+358 44 323 7227",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sfc-hietajarvi",
    "map": "https://www.google.com/maps/search/?api=1&query=SFC-Hietaj%C3%A4rvi%2C%20Kiihtelystie%20201%2C%2082140%20Kiihtelysvaara",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SFC-Hietaj%C3%A4rvi%2C%20Kiihtelystie%20201%2C%2082140%20Kiihtelysvaara",
    "region": "Pohjois-Karjala"
  },
  {
    "id": "v265-caravan-kalajarvi",
    "name": "Caravan-Kalajärvi",
    "city": "Seinäjoki",
    "address": "Kalajärventie 4, 61100 Peräseinäjoki",
    "website": "https://www.caravan-kalajarvi.fi/",
    "openingStatus": "yearround",
    "season": "Caravan-alue avoinna ympäri vuoden; talvikauden palvelut ja isäntäajat poikkeavat kesästä.",
    "description": "SF-Caravan Seinäjoen seudun caravan-alue Kalajärvellä. 250 vaunupaikkaa; leirintämökit ja telttailu ovat kausiluonteisia.",
    "phone": "+358 6 417 5602",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-caravan-kalajarvi",
    "map": "https://www.google.com/maps/search/?api=1&query=Caravan-Kalaj%C3%A4rvi%2C%20Kalaj%C3%A4rventie%204%2C%2061100%20Per%C3%A4sein%C3%A4joki",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Caravan-Kalaj%C3%A4rvi%2C%20Kalaj%C3%A4rventie%204%2C%2061100%20Per%C3%A4sein%C3%A4joki",
    "region": "Etelä-Pohjanmaa"
  },
  {
    "id": "v265-sfc-lukkuhaka",
    "name": "SFC-Lukkuhaka",
    "city": "Isokyrö",
    "address": "Kortesluomantie 148, 61550 Orismala",
    "website": "https://www.lukkuhaka.fi/",
    "openingStatus": "yearround",
    "season": "Caravan-alue avoinna myös talvella; talvisin isäntäpäivystys viikonloppuina.",
    "description": "Kalliojärven Lukkuhaan caravan-alue. Vuoden 2026 leirintäopas kuvaa talvikauden isäntäpäivystyksen viikonloppuisin; varmista saapuminen etukäteen.",
    "phone": "",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sfc-lukkuhaka",
    "map": "https://www.google.com/maps/search/?api=1&query=SFC-Lukkuhaka%2C%20Kortesluomantie%20148%2C%2061550%20Orismala",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SFC-Lukkuhaka%2C%20Kortesluomantie%20148%2C%2061550%20Orismala",
    "region": "Etelä-Pohjanmaa"
  },
  {
    "id": "v265-sfc-sexsjo",
    "name": "SFC-Sexsjö",
    "city": "Pedersöre",
    "address": "Sandvikintie 111, 68940 Lillby",
    "website": "https://sexsjo.fi/fi/tapahtumat-ja-hinnasto",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; talvikauden järjestelyt varmistettava alueelta.",
    "description": "Pedersören kunnan mukaan Sexsjö on avoinna ympärivuotisesti. Luonnonkaunis järvenrantainen SF-Caravan-alue, jossa on myös talvikausipaikkoja.",
    "phone": "+358 50 310 1247",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sfc-sexsjo",
    "map": "https://www.google.com/maps/search/?api=1&query=SFC-Sexsj%C3%B6%2C%20Sandvikintie%20111%2C%2068940%20Lillby",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SFC-Sexsj%C3%B6%2C%20Sandvikintie%20111%2C%2068940%20Lillby",
    "region": "Pohjanmaa"
  },
  {
    "id": "v265-sf-caravan-kattivankkuri",
    "name": "SF-Caravan Kattivankkuri",
    "city": "Sotkamo",
    "address": "Veikontie 13, 88610 Vuokatti",
    "website": "https://www.kattivankkuri.fi/",
    "openingStatus": "yearround",
    "season": "Caravan-alue avoinna ympäri vuoden; 30.9.–31.5. vastaanotto Kattikeskuksella.",
    "description": "Vuokatin caravan-alue. Talvella ei ole säännöllistä alueisäntää. Vierailijat ilmoittautuvat Kattikeskuksella osoitteessa Ilkantie 8; tarkista ennen saapumista.",
    "phone": "+358 8 619 410",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sf-caravan-kattivankkuri",
    "map": "https://www.google.com/maps/search/?api=1&query=SF-Caravan%20Kattivankkuri%2C%20Veikontie%2013%2C%2088610%20Vuokatti",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SF-Caravan%20Kattivankkuri%2C%20Veikontie%2013%2C%2088610%20Vuokatti",
    "region": "Kainuu"
  },
  {
    "id": "v265-sfc-sautinkari",
    "name": "SFC-Sautinkari",
    "city": "Kalajoki",
    "address": "Sautinkarintie 40, 68100 Himanka",
    "website": "https://www.sautinkari.info/sfc-alue.html",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; kesävastaanotto 1.6.–31.8. klo 9–21.",
    "description": "Perämeren ja Lestijoen suistossa sijaitseva SF-Caravan-alue. Noin 250 matkailuajoneuvopaikkaa, lähes kaikki sähköistettyjä.",
    "phone": "+358 40 162 0357",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sfc-sautinkari",
    "map": "https://www.google.com/maps/search/?api=1&query=SFC-Sautinkari%2C%20Sautinkarintie%2040%2C%2068100%20Himanka",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SFC-Sautinkari%2C%20Sautinkarintie%2040%2C%2068100%20Himanka",
    "region": "Pohjois-Pohjanmaa"
  },
  {
    "id": "v265-emolahti-camping-beach",
    "name": "Emolahti Camping-Beach",
    "city": "Pyhäjärvi",
    "address": "Pellikantie 430, 86800 Pyhäsalmi",
    "website": "https://www.emolahti.com/www/leirintaalue/",
    "openingStatus": "yearround",
    "season": "Leirintäalue avoinna ympäri vuoden; huoltotilat käytettävissä talvellakin.",
    "description": "Pyhäjärven rannalla sijaitseva camping-alue; noin 60 caravan-paikkaa, joista 40 sähköistettyä. Osa lisäpalveluista kesäisin.",
    "phone": "",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-emolahti-camping-beach",
    "map": "https://www.google.com/maps/search/?api=1&query=Emolahti%20Camping-Beach%2C%20Pellikantie%20430%2C%2086800%20Pyh%C3%A4salmi",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Emolahti%20Camping-Beach%2C%20Pellikantie%20430%2C%2086800%20Pyh%C3%A4salmi",
    "region": "Pohjois-Pohjanmaa"
  },
  {
    "id": "v265-kylmaluoman-retkeilykeskus-camping",
    "name": "Kylmäluoman Retkeilykeskus – Camping",
    "city": "Taivalkoski",
    "address": "Pajuluomantie 20, 93540 Tyrövaara",
    "website": "https://hossa-kylmaluoma.fi/leirintaalueet-ja-mokkivuokraus-ympari-vuoden/",
    "openingStatus": "yearround",
    "season": "Leirintäalue avoinna ympäri vuoden; talvella portilta soitettava henkilökunnalle.",
    "description": "Kylmäluoman caravan- ja leirintäalue. Talvikaudella vastaanotto ja ravintola suljettu, mutta majoittuminen onnistuu puhelinohjeilla; lämmin huoltorakennus.",
    "phone": "+358 40 500 3476",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-kylmaluoman-retkeilykeskus-camping",
    "map": "https://www.google.com/maps/search/?api=1&query=Kylm%C3%A4luoman%20Retkeilykeskus%20%E2%80%93%20Camping%2C%20Pajuluomantie%2020%2C%2093540%20Tyr%C3%B6vaara",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Kylm%C3%A4luoman%20Retkeilykeskus%20%E2%80%93%20Camping%2C%20Pajuluomantie%2020%2C%2093540%20Tyr%C3%B6vaara",
    "region": "Pohjois-Pohjanmaa"
  },
  {
    "id": "v265-sfc-hopeapera",
    "name": "SFC-Hopeaperä",
    "city": "Simo",
    "address": "Ranuantie 383 B, 95260 Tainionjoki",
    "website": "https://www.sfc-perapohjola.com/",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; syyskuun puolivälistä toukokuun puoliväliin omatoimialue.",
    "description": "Simojoen rannalla sijaitseva SF-Caravan Peräpohjolan alue, noin 120 sähköistettyä matkailuajoneuvopaikkaa.",
    "phone": "+358 40 561 4259",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sfc-hopeapera",
    "map": "https://www.google.com/maps/search/?api=1&query=SFC-Hopeaper%C3%A4%2C%20Ranuantie%20383%20B%2C%2095260%20Tainionjoki",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=SFC-Hopeaper%C3%A4%2C%20Ranuantie%20383%20B%2C%2095260%20Tainionjoki",
    "region": "Lappi"
  },
  {
    "id": "v265-ranua-resort-camping-elainpuisto",
    "name": "Ranua Resort – Camping Eläinpuisto",
    "city": "Ranua",
    "address": "Rovaniementie 29, 97700 Ranua",
    "website": "https://ranuaresort.com/majoitus/camping-elainpuisto/",
    "openingStatus": "yearround",
    "season": "Camping Eläinpuisto avoinna ympäri vuoden; ympärivuorokautinen saapuminen mahdollista.",
    "description": "Ranuan eläinpuiston vieressä oleva ympärivuotinen camping-alue. Saapuessa vastaanoton sulkeuduttua saa huoltorakennuksen ovikoodin päivystysnumerosta.",
    "phone": "+358 16 469 2050",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-ranua-resort-camping-elainpuisto",
    "map": "https://www.google.com/maps/search/?api=1&query=Ranua%20Resort%20%E2%80%93%20Camping%20El%C3%A4inpuisto%2C%20Rovaniementie%2029%2C%2097700%20Ranua",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Ranua%20Resort%20%E2%80%93%20Camping%20El%C3%A4inpuisto%2C%20Rovaniementie%2029%2C%2097700%20Ranua",
    "region": "Lappi"
  },
  {
    "id": "v265-ivalo-river-camping",
    "name": "Ivalo River Camping",
    "city": "Inari",
    "address": "Kerttuojantie 1, 99800 Ivalo",
    "website": "https://camping.fi/leirintaalueet-ja-lomakylat/ivalo-river-camping/",
    "openingStatus": "yearround",
    "season": "Avoinna 1.1.–31.12.2026; caravan-paikat käytössä ympäri vuoden.",
    "description": "Ivalojoen rannassa E75-tien varrella. Sähköistetyt caravan-paikat, ravintola ja huoltopalveluja.",
    "phone": "+358 400 395 046",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-ivalo-river-camping",
    "map": "https://www.google.com/maps/search/?api=1&query=Ivalo%20River%20Camping%2C%20Kerttuojantie%201%2C%2099800%20Ivalo",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Ivalo%20River%20Camping%2C%20Kerttuojantie%201%2C%2099800%20Ivalo",
    "region": "Lappi"
  },
  {
    "id": "v265-camping-tornio",
    "name": "Camping Tornio",
    "city": "Tornio",
    "address": "Matkailijantie 49, 95420 Tornio",
    "website": "https://www.campingtornio.com/",
    "openingStatus": "yearround",
    "season": "Ympärivuotinen caravan-majoitus; 1.10. alkaen talvipaikat vain ennakkovarauksella.",
    "description": "Caravan-paikat käytössä myös vastaanoton sulkeuduttua 30.9. Talvella sähköpaikka varattava etukäteen; käytössä pienempi huoltorakennus. Osoite alueen oman sivun mukaan.",
    "phone": "+358 16 445 945",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-camping-tornio",
    "map": "https://www.google.com/maps/search/?api=1&query=Camping%20Tornio%2C%20Matkailijantie%2049%2C%2095420%20Tornio",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Camping%20Tornio%2C%20Matkailijantie%2049%2C%2095420%20Tornio",
    "region": "Lappi"
  },
  {
    "id": "v265-sallainen-caravan-cottages",
    "name": "Sallainen Caravan & Cottages",
    "city": "Salla",
    "address": "Tunturikummuntie 2, 98900 Salla",
    "website": "https://www.sallaiset.fi/",
    "openingStatus": "yearround",
    "season": "Leirintäalue avoinna ympäri vuoden; talvihinnasto 1.10.2026–30.4.2027.",
    "description": "Sallatunturin läheinen caravan-alue ja mökkimajoitus. Myöhäisestä saapumisesta pyydetään ottamaan yhteyttä etukäteen.",
    "phone": "+358 40 832 0932",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-sallainen-caravan-cottages",
    "map": "https://www.google.com/maps/search/?api=1&query=Sallainen%20Caravan%20%26%20Cottages%2C%20Tunturikummuntie%202%2C%2098900%20Salla",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Sallainen%20Caravan%20%26%20Cottages%2C%20Tunturikummuntie%202%2C%2098900%20Salla",
    "region": "Lappi"
  },
  {
    "id": "v265-levilehto-caravan",
    "name": "Levilehto Caravan",
    "city": "Kittilä",
    "address": "Levintie 1625, 99130 Sirkka",
    "website": "https://www.levilehto.fi/karavaanarit",
    "openingStatus": "yearround",
    "season": "Caravan-paikat ympäri vuoden; talvikausi 1.9.–5.5. ja kesäkausi 5.5.–1.9.",
    "description": "Levin keskustan rauhallinen sähköistetty caravan-alue, 46 paikkaa. Kesällä myös telttailumahdollisuus.",
    "phone": "+358 403 120 200",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-levilehto-caravan",
    "map": "https://www.google.com/maps/search/?api=1&query=Levilehto%20Caravan%2C%20Levintie%201625%2C%2099130%20Sirkka",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Levilehto%20Caravan%2C%20Levintie%201625%2C%2099130%20Sirkka",
    "region": "Lappi"
  },
  {
    "id": "v265-muumarin-caravan-levi",
    "name": "Muumarin Caravan – Levi",
    "city": "Kittilä",
    "address": "Konttisenkuja 1, 99130 Sirkka",
    "website": "https://www.levi.fi/palvelut/muumarin-asuntovaunualue-myos-leirintaalue/",
    "openingStatus": "yearround",
    "season": "Avoinna ympäri vuoden; talvikauden kausipaikat tiedusteltava erikseen.",
    "description": "Immeljärven rannalla sijaitseva itsepalvelu-caravanalue. Talvikauden paikkojen ja lyhyiden vierailujen saatavuus on varmistettava etukäteen.",
    "phone": "+358 16 644 240",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-muumarin-caravan-levi",
    "map": "https://www.google.com/maps/search/?api=1&query=Muumarin%20Caravan%20%E2%80%93%20Levi%2C%20Konttisenkuja%201%2C%2099130%20Sirkka",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Muumarin%20Caravan%20%E2%80%93%20Levi%2C%20Konttisenkuja%201%2C%2099130%20Sirkka",
    "region": "Lappi"
  },
  {
    "id": "v265-camping-nilimella",
    "name": "Camping Nilimella",
    "city": "Sodankylä",
    "address": "Kelukoskentie 5, 99600 Sodankylä",
    "website": "https://nilimella.fi/leirintaalue/",
    "openingStatus": "yearround",
    "season": "Leirintä- ja caravan-alue avoinna ympäri vuoden; talvihinnat 1.10.–31.5.",
    "description": "Nelitähtinen leirintäalue Kitisen rannalla Sodankylässä. 80 caravan-paikkaa, joista 60 sähköistettyä; huoltotilat.",
    "phone": "+358 40 588 5886",
    "checked": "2026-10-11",
    "type": "camping",
    "url": "leirintakohde-v265.html?kohde=v265-camping-nilimella",
    "map": "https://www.google.com/maps/search/?api=1&query=Camping%20Nilimella%2C%20Kelukoskentie%205%2C%2099600%20Sodankyl%C3%A4",
    "navigate": "https://www.google.com/maps/dir/?api=1&destination=Camping%20Nilimella%2C%20Kelukoskentie%205%2C%2099600%20Sodankyl%C3%A4",
    "region": "Lappi"
  }
];
  const regions = {
  "Äänekoski": "Keski-Suomi",
  "Uurainen": "Keski-Suomi",
  "Muurame": "Keski-Suomi",
  "Pihtipudas": "Keski-Suomi",
  "Kuopio": "Pohjois-Savo",
  "Vieremä": "Pohjois-Savo",
  "Joroinen": "Pohjois-Savo",
  "Joensuu": "Pohjois-Karjala",
  "Seinäjoki": "Etelä-Pohjanmaa",
  "Isokyrö": "Etelä-Pohjanmaa",
  "Pedersöre": "Pohjanmaa",
  "Sotkamo": "Kainuu",
  "Kalajoki": "Pohjois-Pohjanmaa",
  "Pyhäjärvi": "Pohjois-Pohjanmaa",
  "Taivalkoski": "Pohjois-Pohjanmaa",
  "Simo": "Lappi",
  "Ranua": "Lappi",
  "Inari": "Lappi",
  "Tornio": "Lappi",
  "Salla": "Lappi",
  "Kittilä": "Lappi",
  "Sodankylä": "Lappi"
};
  const list = window.caravanPlaces || (window.caravanPlaces = []);
  const normal = s => String(s || '').toLocaleLowerCase('fi').normalize('NFD')
    .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'');
  const host = u => {try{return new URL(u).hostname.replace(/^www\./,'');}catch(_){return '';}};
  for (const extra of additions) {
    const match = list.find(p => p && p.type === 'camping' && (
      p.id === extra.id ||
      (normal(p.city) === normal(extra.city) && (
        normal(p.name) === normal(extra.name) ||
        (p.address && normal(p.address) === normal(extra.address)) ||
        (p.website && host(p.website) === host(extra.website) && host(extra.website) &&
          !['camping.fi','karavaanarit.fi'].includes(host(extra.website)))
      ))
    ));
    if (match) {
      // Aukioloaika on tarkistettu nimenomaan camping-/caravan-paikalle.
      // Korjaa aiempi puuttuva tai epäselvä arvo, mutta säilytä olemassa oleva nimi ja linkki.
      if (match.openingStatus !== 'yearround') {
        match.openingStatus = 'yearround';
        match.season = extra.season;
        match.checked = extra.checked;
      }
      if (!match.website) match.website = extra.website;
      if (!match.description) match.description = extra.description;
      if (!match.phone) match.phone = extra.phone;
      continue;
    }
    list.push(extra);
  }
  const mapping = window.municipalityRegions || (window.municipalityRegions = {});
  for (const [town,county] of Object.entries(regions)) mapping[town] = county;
  if (document.body && ['camping','all'].includes(document.body.dataset.kind)) {
    const towns = window.siteMunicipalities || (window.siteMunicipalities = {});
    for (const town of Object.keys(regions)) {
      if (!towns[town]) towns[town] = 'leirintaalueet.html?kunta='+encodeURIComponent(town);
    }
  }
  window.campgroundsAddedV265 = additions;
})();
