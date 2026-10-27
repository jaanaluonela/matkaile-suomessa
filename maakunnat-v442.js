(()=>{'use strict';
const order=['Lappi','Pohjois-Pohjanmaa','Kainuu','Keski-Pohjanmaa','Pohjanmaa','Etelä-Pohjanmaa','Keski-Suomi','Pohjois-Savo','Pohjois-Karjala','Etelä-Savo','Satakunta','Pirkanmaa','Päijät-Häme','Kanta-Häme','Etelä-Karjala','Kymenlaakso','Varsinais-Suomi','Uusimaa','Ahvenanmaa'];
const descriptions={"Lappi":"Lapissa tunturit, erämaat ja pohjoisen luonnon rauha kutsuvat retkille. Koe kansallispuistot, jokimaisemat ja Lapin kylät kaikkina vuodenaikoina.","Pohjois-Pohjanmaa":"Pohjois-Pohjanmaa tarjoaa merenrantaa, jokilaaksoja ja Koillismaan vaaramaisemia. Tutustu Oulun seutuun, hiekkarantoihin ja luontoreitteihin.","Kainuu":"Kainuu tunnetaan upeista vaaramaisemistaan, laajoista metsistään ja kirkkaista järvistään. Alueelta löydät rauhallisia luontokohteita, kiinnostavia nähtävyyksiä ja elämyksiä ympäri vuoden.","Keski-Pohjanmaa":"Keski-Pohjanmaalla kohtaavat Pohjanlahden rannikko, jokilaaksot ja elävät kylät. Tutustu Kokkolan vanhaan kaupunkiin ja alueen luontokohteisiin.","Pohjanmaa":"Pohjanmaalla meri, saaristo ja perinteiset puutalokaupungit luovat omaleimaisen tunnelman. Tutustu Merenkurkun saaristoon ja rannikon kyliin.","Etelä-Pohjanmaa":"Etelä-Pohjanmaa tunnetaan lakeuksistaan, kylämaisemistaan ja tapahtumistaan. Löydä perheiden käyntikohteita, kulttuuria ja retkipaikkoja.","Keski-Suomi":"Keski-Suomen järvet, metsät ja kumpuilevat maisemat sopivat rauhalliseen lomailuun. Tutustu Jyväskylän seutuun, kansallispuistoihin ja pieniin kesäkaupunkeihin.","Pohjois-Savo":"Pohjois-Savossa järvimaisemat, satamat ja savolainen kulttuuri kulkevat käsi kädessä. Koe Kuopion seutu, Puijon maisemat ja viihtyisät matkailukohteet.","Pohjois-Karjala":"Pohjois-Karjalassa odottavat vaarat, järvet ja karjalainen vieraanvaraisuus. Koli, Pielinen ja alueen kylät tarjoavat monenlaisia retkiä.","Etelä-Savo":"Etelä-Savossa Saimaa, saaristot ja kesäkaupungit houkuttelevat pysähtymään. Tutustu Savonlinnaan, Mikkelin seutuun ja kauniisiin järvimaisemiin.","Satakunta":"Satakunnassa yhdistyvät Yyterin hiekkarannat, Kokemäenjoen maisemat ja vanhat puutalokorttelit. Löydä rannikon ja sisämaan kiinnostavat kohteet.","Pirkanmaa":"Pirkanmaa tarjoaa järviä, harjuja, kaupunkikulttuuria ja koko perheen kohteita. Tutustu Tampereen seutuun sekä maakunnan pienempiin paikkakuntiin.","Päijät-Häme":"Päijät-Hämeessä Salpausselän harjut ja Päijänteen järvimaisemat tarjoavat elämyksiä. Tutustu Lahteen, Asikkalaan ja maakunnan retkikohteisiin.","Kanta-Häme":"Kanta-Hämeessä historia, linnat, puistot ja järvimaisemat ovat lähellä toisiaan. Tutustu Hämeenlinnaan ja maakunnan rauhallisiin luontokohteisiin.","Etelä-Karjala":"Etelä-Karjala tunnetaan Saimaan rannoista, kanavamaisemista ja karjalaisesta tunnelmasta. Tutustu Lappeenrantaan, Imatraan ja järviluontoon.","Kymenlaakso":"Kymenlaaksossa Kymijoki, merellinen Kotka ja metsien retkireitit tarjoavat vaihtelua. Löydä rannikon, jokivarren ja Kouvolan seudun kohteet.","Varsinais-Suomi":"Varsinais-Suomessa saaristo, historialliset kaupungit ja maaseudun kylät kutsuvat matkalle. Tutustu Turkuun, saaristoreitteihin ja rannikon nähtävyyksiin.","Uusimaa":"Uudellamaalla merellinen rannikko, historialliset kaupungit ja monipuoliset luontokohteet ovat lähellä. Löydä retkipaikkoja Helsingistä Hankoon ja Porvooseen.","Ahvenanmaa":"Ahvenanmaa tarjoaa saaristoteitä, merimaisemia ja rauhallisia kyliä. Tutustu Maarianhaminaan, saariston nähtävyyksiin ja pyöräilyreitteihin."};
const colors=['#43715b','#66a0b9','#85a889','#ac8abb','#88bce0','#deb159','#c8755b','#8f9c7b','#db8293','#9490b7','#7395af','#ceb091','#e78e76','#579482','#e1ba6b','#8399b9','#82b4ba','#437b9b','#ae8cc4'];
const regions=window.msFinlandRegions2026||{},list=document.querySelector('#regions-list'),input=document.querySelector('#region-search'),all=document.querySelector('#show-all'),status=document.querySelector('#regions-status');
const norm=s=>s.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');let expanded=false,selected=new URLSearchParams(location.search).get('maakunta')||'';
if(selected && order.includes(selected)){location.replace(regionUrl(selected));return;}
const mapToggle=document.querySelector('#map-toggle');const mq=matchMedia('(min-width:900px)');function adapt(){mapToggle.open=mq.matches}adapt();mq.addEventListener('change',adapt);
const menu=document.querySelector('.ms375-menu');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#ms375-menu-links').hidden=!open});
function regionUrl(name){return name.toLowerCase().replace(/ä/g,'a').replace(/ö/g,'o').replace(/å/g,'a').replace(/ /g,'-')+'.html'}
function render(){
 const q=norm(input.value.trim());list.replaceChildren();let count=0;
 order.forEach((name,i)=>{
  const towns=regions[name]||[];
  if(q&&!norm(name).includes(q)&&!towns.some(t=>norm(t).includes(q)))return;
  count++;
  const a=document.createElement('a');a.className='region-card ms-region-direct';a.dataset.region=name;
  a.style.setProperty('--color',colors[i]);a.href=regionUrl(name);
  const label=document.createElement('span');label.className='ms-region-name';label.textContent=name;
  a.append(label);list.append(a);
 });
 status.textContent=q?(count?count+' maakuntaa hakutuloksissa':'Ei osumia. Kokeile toista hakusanaa.'):'';
 all.hidden=true;
}
function highlight(name){document.querySelectorAll('.ms-map-link').forEach(a=>a.classList.toggle('is-selected',a.dataset.region===name))}
document.querySelectorAll('.ms-map-link').forEach(a=>{
 const i=order.indexOf(a.dataset.region);
 if(i>=0){const shape=a.querySelector('.region');if(shape)shape.style.setProperty('--c',colors[i]);}
 a.setAttribute('href',regionUrl(a.dataset.region));
});
input.addEventListener('input',render);document.querySelector('form').addEventListener('submit',e=>{e.preventDefault();render()});render();highlight(selected);
})();
