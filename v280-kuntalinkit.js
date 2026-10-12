/* v280: Lisää uudet kuntasivut olemassa olevaan kuntahakemistoon; vanhat linkit säilyvät. */
(function(){'use strict';
const towns={"Jyväskylä":"jyvaskyla.html","Jämsä":"jamsa.html","Laukaa":"laukaa.html","Äänekoski":"aanekoski.html","Saarijärvi":"saarijarvi.html","Keuruu":"keuruu.html","Petäjävesi":"petajavesi.html","Konnevesi":"konnevesi.html","Muurame":"muurame.html","Joutsa":"joutsa.html","Hankasalmi":"hankasalmi.html","Tampere":"tampere.html","Kangasala":"kangasala.html","Nokia":"nokia.html","Ylöjärvi":"ylojarvi.html","Valkeakoski":"valkeakoski.html","Sastamala":"sastamala.html","Orivesi":"orivesi.html","Mänttä-Vilppula":"mantta-vilppula.html","Ruovesi":"ruovesi.html","Virrat":"virrat.html","Ikaalinen":"ikaalinen.html","Lempäälä":"lempaala.html"};
Object.assign(window.siteMunicipalities||(window.siteMunicipalities={}),towns);
Object.assign(window.msBundledMunicipalityPages253||(window.msBundledMunicipalityPages253={}),towns);
})();
