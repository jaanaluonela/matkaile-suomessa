/* Matkailu Suomessa v294: vahvistetut Järvenpään matkaparkit. Säilyttää aiemman datan. */
(()=>{'use strict';
const places=window.caravanPlaces||(window.caravanPlaces=[]);
const norm=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
const records=[
 {id:'ms274-jarvenpaa-pajula-matkaparkki',name:'Pajulan Matkaparkki',city:'Järvenpää',region:'Uusimaa',address:'Kiteentie 16, 04410 Järvenpää',type:'park',aliases:['Pajula Matkaparkki','Pajula'],website:'https://bbpajula.fi/matkaparkki/',verifiedSource:'https://bbpajula.fi/matkaparkki/',description:'Virallinen matkailuauto- ja matkailuvaunuparkki Haarajoen lähellä. Toimijan julkaisemat hinnat 28 €/vrk sis. sähkön tai 48 €/vrk laajemmat sauna-, WC-, suihku- ja vesipalvelut. Varmista palvelujen saatavuus puhelimitse 040 355 3566.',season:'Varmista saatavuus puhelimitse ennen saapumista.',openingStatus:null,verifiedOpeningStatus:null,verifiedServices:['electric','wc','shower','sauna','water'],verifiedNote:'28 € peruspaketti sisältää sähkön; WC, suihku, sauna ja vesipiste ovat 48 € palvelupaketissa. Ei vahvistettua tyhjennyspaikkaa. Soita aina etukäteen: 040 355 3566.',checked:'2026-10-13'},
 {id:'ms294-jarvenpaa-step-kesamatkaparkki',name:'STEP-koulutuksen kesämatkaparkki',city:'Järvenpää',region:'Uusimaa',address:'Järvenpääntie 640, 04400 Järvenpää',type:'park',aliases:['STEP-koulutus','STEP Järvenpää'],website:'https://step.fi/palvelut/majoitus/',verifiedSource:'https://step.fi/palvelut/majoitus/',description:'STEP-koulutuksen Järvenpään kampuksella on kesäisin kuusi paikkaa asuntoautoille. Varmista vapaat paikat, ajankohtainen kausi ja palvelut etukäteen.',season:'Kesäkausi; kuusi asuntoautopaikkaa. Ei vahvistettua ympärivuotista toimintaa.',openingStatus:'seasonal',verifiedOpeningStatus:null,verifiedServices:[],verifiedNote:'Ei vahvistettuja sähkö-, vesi- tai tyhjennyspalveluja. Varmista tiedot suoraan STEPiltä.',checked:'2026-10-13',url:'jarvenpaa.html#matkaparkit'}
];
for(const r of records){
 let p=places.find(x=>x.id===r.id)||places.find(x=>norm(x.city)==='jarvenpaa'&&(norm(x.address).split(' ')[0]===norm(r.address).split(' ')[0]||norm(x.name)===norm(r.name)));
 const navigation='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(r.address);
 const map='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r.address);
 if(p){const keepUrl=p.url;Object.assign(p,r,{url:keepUrl||r.url||'jarvenpaa.html#matkaparkit',map,navigate:navigation});}
 else {p={...r,url:r.url||'jarvenpaa.html#matkaparkit',map,navigate:navigation};places.push(p);}
 // ms274:n erillinen tietolista on matkaparkkikohdesivun lähde.
 const extra=(window.msMatkaparkitV274||[]).find(x=>x.id===p.id||norm(x.name)===norm(p.name));if(extra&&extra!==p)Object.assign(extra,p);
}
(window.municipalityRegions||(window.municipalityRegions={})).Järvenpää='Uusimaa';
window.msJarvenpaaParksV294=records;
})();
