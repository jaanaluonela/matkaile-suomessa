/* Satakunta v318 – rekisteröi oppaat aikaisempia kuntalinkkejä poistamatta. */
(function(){'use strict';const names=window.msSatakunta318?.map(x=>x.name)||["Eura","Eurajoki","Harjavalta","Huittinen","Jämijärvi","Kankaanpää","Karvia","Kokemäki","Merikarvia","Nakkila","Pomarkku","Pori","Rauma","Siikainen","Säkylä","Ulvila"];
const routes={};for(const name of names)routes[name]='satakunta-kunta.html?kunta='+encodeURIComponent(name);
Object.assign(window.siteMunicipalities||(window.siteMunicipalities={}),routes);
Object.assign(window.msBundledMunicipalityPages253||(window.msBundledMunicipalityPages253={}),routes);
(window.msRegionGuides254||(window.msRegionGuides254={})).Satakunta='satakunta.html';
(window.municipalityRegions||(window.municipalityRegions={}));for(const name of names)window.municipalityRegions[name]='Satakunta';
})();
