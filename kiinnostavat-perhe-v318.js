/* Matkaile Suomessa v318 – tarkistetut erikoiskohteet ja lapsiperheiden vierailukohteet.
   Lähteet: Visit Häme, Visit Naantali/Muumimaailma, Ranua Resort, Korkeasaari. */
window.ms318Kohteet = [
  {
    name: "Mommilan Kyläpuoti", city: "Hausjärvi", type: "sight", special: true,
    group: "special", subtypes: ["museum", "food"],
    address: "Kordelinintie 64, 12170 Hausjärvi",
    description: "Tunnelmallinen vanhan ajan kyläpuoti, kesäkahvila ja kyläkauppamuseo Mommilan kartanon maisemissa. Pihapiirissä myös retrokioski ja myymäläautomuseo.",
    season: "Kesäkohde – tarkista aukiolo ja tapahtumat ennen lähtöä.",
    url: "https://visithame.fi/tuotteet/mommilan-kylapuoti/",
    aliases: "Mommila kyläpuoti kyläkauppa kyläkauppamuseo Hausjärvi Hietoinen kahvila"
  },
  {
    name: "Muumimaailma", city: "Naantali", type: "sight", group: "kids",
    subtypes: ["play", "adventure"],
    address: "Kaivokatu 5, 21101 Naantali (Kailon saari)",
    description: "Muumien satumaailma Kailon saaressa: Muumitalo, hahmoja, tarinoita, leikkiä ja teatteria koko perheelle.",
    access: "Pääsymaksullinen. Pysäköinti erillisellä Muumiparkin alueella.",
    season: "Kesäkohde; seuraava ilmoitettu kesäkausi 15.6.–20.8.2027.",
    url: "https://www.muumimaailma.fi/",
    aliases: "Moominworld Naantali Kailo Muumilaakso Muumitalo"
  },
  {
    name: "Korkeasaaren eläintarha", city: "Helsinki", type: "sight", group: "kids",
    subtypes: ["animals"],
    address: "Mustikkamaanpolku 12, 00570 Helsinki",
    description: "Eläintarha saaressa Helsingin edustalla. Tutustu eläinlajeihin ja luonnonsuojeluun koko perheen retkellä.",
    access: "Pääsymaksullinen.", season: "Avoinna ympäri vuoden.",
    url: "https://korkeasaari.fi/",
    aliases: "Korkeasaari Helsinki eläinpuisto eläintarha Mustikkamaa"
  },
  {
    name: "Ranuan eläinpuisto", city: "Ranua", type: "sight", group: "kids",
    subtypes: ["animals"],
    address: "Rovaniementie 29, 97700 Ranua",
    description: "Arktisiin eläinlajeihin erikoistunut metsäinen eläinpuisto, jossa voi nähdä muun muassa jääkarhuja, ilveksiä ja naaleja.",
    access: "Pääsymaksullinen.", season: "Avoinna ympäri vuoden.",
    url: "https://ranuaresort.com/elainpuisto/",
    aliases: "Ranua Zoo Ranua Wildlife Park eläintarha eläinpuisto"
  }
];
/* Päivitetyt vierailutiedot v277:n jo olemassa oleville, nyt näkyville lasten kohteille. */
window.ms318PerhePaivitykset = {
  "Pelle Hermannin leikkipuisto": {
    description: "Kirjurinluodon noin kolmen hehtaarin maksuton leikkipuisto: merirosvolaiva, kiipeilyä, liukumäkiä sekä leikkialueita eri-ikäisille.",
    url: "https://www.visitpori.fi/kirjurinluoto/pelle-hermannin-leikkipuisto/"
  },
  "Launeen perhepuisto": {
    description: "Lahden maksuton, ympärivuotinen koko perheen leikkipuisto. Launeen linna ja erilaiset leikkialueet; alueella tehty kunnostustöitä 2026.",
    season: "Puisto ympäri vuoden. Tarkista ajankohtaiset työmaat ja käytössä olevat leikkialueet."
  },
  "Yli-Marolan 4H-kotieläinpiha": {
    description: "Maksuton kesäinen kotieläinpiha Lahden matkakeskuksen lähellä. Kesäisin voi nähdä esimerkiksi vuohia, lampaita, aaseja ja kanoja.",
    season: "Kesäkausi 2026 päättynyt 18.8.; tarkista seuraavan kesän aukiolo."
  }
};
