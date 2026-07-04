const MAAKUNNAT = {
  "paijat-hame": {
    nimi: "Päijät-Häme",
    vaakuna: "vaakuna-paijat-hame.svg",
    kunnat: ["asikkala","hartola","heinola","hollola","iitti","karkola","lahti","orimattila","padasjoki","sysma"],
    kuvaus: "Järviä, harjuja, kanavia, kaupunkikulttuuria ja retkikohteita Suomen sydämessä."
  }
};

const KUNNAT = {
  asikkala: { nimi:"Asikkala", maakunta:"Päijät-Häme", vaakuna:"vaakuna-asikkala.svg", sivu:"asikkala.html", tunnus:"Vääksyn kanava, Pulkkilanharju ja Päijänteen maisemat", palvelut:["Nähtävyydet","Luonto","Kahvilat","Ravintolat","Leirintäalueet","Matkaparkit","Uimarannat","Satamat"] },
  hartola: { nimi:"Hartola", maakunta:"Päijät-Häme", vaakuna:"vaakuna-hartola.svg", sivu:"hartola.html", tunnus:"Kuninkaanpitäjän järvi- ja kulttuurikohteet", palvelut:["Kulttuuri","Järvikohteet","Kahvilat","Majoitus","Uimarannat","Huoltoasemat"] },
  heinola: { nimi:"Heinola", maakunta:"Päijät-Häme", vaakuna:"vaakuna-heinola.svg", sivu:"heinola.html", tunnus:"Puistot, lintutarha, Jyrängönvirta ja Vierumäki", palvelut:["Satama","Museot","Kahvilat","Ravintolat","Majoitus","Ulkoilureitit"] },
  hollola: { nimi:"Hollola", maakunta:"Päijät-Häme", vaakuna:"vaakuna-hollola.svg", sivu:"hollola.html", tunnus:"Keskiaikainen kirkko, Messilä ja Salpausselkä", palvelut:["Kirkko","Messilä","Retkeily","Ravintolat","Majoitus","Uimarannat"] },
  iitti: { nimi:"Iitti", maakunta:"Päijät-Häme", vaakuna:"vaakuna-iitti.svg", sivu:"iitti.html", tunnus:"Kymijoen maisemat, Kausala ja kyläkohteet", palvelut:["Kaupat","Kahvilat","Jokimaisemat","Majoitus","Huoltoasemat","Uimarannat"] },
  karkola: { nimi:"Kärkölä", maakunta:"Päijät-Häme", vaakuna:"vaakuna-karkola.svg", sivu:"karkola.html", tunnus:"Huovilan puisto, Järvelä ja kylämaisemat", palvelut:["Puistot","Kyläkohteet","Kahvilat","Kaupat","Pysäköinti","Lähiruoka"] },
  lahti: { nimi:"Lahti", maakunta:"Päijät-Häme", vaakuna:"vaakuna-lahti.svg", sivu:"lahti.html", tunnus:"Vesijärven satama, Salpausselkä ja kulttuuri", palvelut:["Satama","Sibeliustalo","Museot","Ravintolat","Hotellit","Julkinen liikenne"] },
  orimattila: { nimi:"Orimattila", maakunta:"Päijät-Häme", vaakuna:"vaakuna-orimattila.svg", sivu:"orimattila.html", tunnus:"Kylät, kulttuuri ja maaseutureitit", palvelut:["Kulttuuri","Kylät","Kahvilat","Ravintolat","Huoltoasemat","Majoitus"] },
  padasjoki: { nimi:"Padasjoki", maakunta:"Päijät-Häme", vaakuna:"vaakuna-padasjoki.svg", sivu:"padasjoki.html", tunnus:"Päijänteen kansallispuisto, Kelvenne ja satama", palvelut:["Kansallispuisto","Satama","Veneily","Leirintä","Kahvilat","Uimarannat"] },
  sysma: { nimi:"Sysmä", maakunta:"Päijät-Häme", vaakuna:"vaakuna-sysma.svg", sivu:"sysma.html", tunnus:"Päijätsalo, Suopelto ja Tainionvirta", palvelut:["Venesatamat","Kahvilat","Kulttuuri","Retkeily","Majoitus","Uimarannat"] }
};

const HAKU = [
  ...Object.values(KUNNAT).map(k => ({nimi:k.nimi, url:k.sivu, tyyppi:'Kunta'})),
  {nimi:'Päijät-Häme', url:'paijat-hame.html', tyyppi:'Maakunta'},
  {nimi:'Pulkkilanharju', url:'pulkkilanharju.html', tyyppi:'Kohde'},
  {nimi:'Vääksyn kanava', url:'asikkala.html', tyyppi:'Kohde'},
  {nimi:'Lahden satama', url:'lahti.html', tyyppi:'Kohde'},
  {nimi:'Päijänteen kansallispuisto', url:'padasjoki.html', tyyppi:'Kohde'}
];
