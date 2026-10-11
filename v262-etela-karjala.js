/* Matkailu Suomessa v262 – Etelä-Karjala: täydennetään viisi kuntasivua */
(function(){'use strict';
const towns={"Lappeenranta":"lappeenranta.html","Imatra":"imatra.html","Lemi":"lemi.html","Luumäki":"luumaki.html","Parikkala":"parikkala.html","Rautjärvi":"rautjarvi.html","Ruokolahti":"ruokolahti.html","Savitaipale":"savitaipale.html","Taipalsaari":"taipalsaari.html"};
Object.assign(window.siteMunicipalities||(window.siteMunicipalities={}),towns);
Object.assign(window.msBundledMunicipalityPages253||(window.msBundledMunicipalityPages253={}),towns);
const aliases={
 "Särä":{"town":"Lemi","url":"lemi.html#ruoka"},"Lemin särä":{"town":"Lemi","url":"lemi.html#ruoka"},"Kuukanniemi":{"town":"Lemi","url":"lemi.html#helmet"},"Ruominkapia":{"town":"Lemi","url":"lemi.html#retket"},"Lemin kirkko":{"town":"Lemi","url":"lemi.html#helmet"},
 "Taavetti":{"town":"Luumäki","url":"luumaki.html#helmet"},"Taavetin linnoitus":{"town":"Luumäki","url":"luumaki.html#helmet"},"Kotkaniemi":{"town":"Luumäki","url":"luumaki.html#helmet"},"Hotelli Salpa":{"town":"Luumäki","url":"luumaki.html#yopyminen"},"Salpa Matkaparkki":{"town":"Luumäki","url":"luumaki.html#yopyminen"},"Palvaanjärvi":{"town":"Luumäki","url":"luumaki.html#yopyminen"},"Kivijärvi":{"town":"Luumäki","url":"luumaki.html#retket"},"Jurvala":{"town":"Luumäki","url":"luumaki.html"},
 "Simpele":{"town":"Rautjärvi","url":"rautjarvi.html"},"Hiitolanjoki":{"town":"Rautjärvi","url":"rautjarvi.html#retket"},"Haukkavuori":{"town":"Rautjärvi","url":"rautjarvi.html#retket"},"Kollaa ja Simo Häyhä -museo":{"town":"Rautjärvi","url":"rautjarvi.html#helmet"},"Miettilä":{"town":"Rautjärvi","url":"rautjarvi.html#helmet"},
 "Partakoski":{"town":"Savitaipale","url":"savitaipale.html#helmet"},"Kärnäkoski":{"town":"Savitaipale","url":"savitaipale.html#helmet"},"Orrainpolku":{"town":"Savitaipale","url":"savitaipale.html#retket"},"Kuolimo":{"town":"Savitaipale","url":"savitaipale.html#retket"},"Olkkola Camping":{"town":"Savitaipale","url":"savitaipale.html#yopyminen"},"Olkkolan Hovi":{"town":"Savitaipale","url":"savitaipale.html#yopyminen"},
 "Saimaanharju":{"town":"Taipalsaari","url":"taipalsaari.html"},"Sarviniemi":{"town":"Taipalsaari","url":"taipalsaari.html#retket"},"Päihäniemi":{"town":"Taipalsaari","url":"taipalsaari.html#retket"},"Haikkaanlahti":{"town":"Taipalsaari","url":"taipalsaari.html#retket"},"Röytty":{"town":"Taipalsaari","url":"taipalsaari.html#helmet"}
};
Object.assign(window.msPlaceAliases253||(window.msPlaceAliases253={}),aliases);
Object.assign(window.msRegionGuides254||(window.msRegionGuides254={}),{"Etelä-Karjala":"etela-karjala.html"});
})();
