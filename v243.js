/* Matkailu Suomessa v243: yöpymisten oikea laskenta ja tehokkaampi haku. */
(() => {
'use strict';
const norm=s=>String(s??'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
const whenReady=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
whenReady(()=>{
  // Sama alkuperäinen tieto ja määrä kuin Yöpyminen-luettelossa.
  const a=window.caravanPlaces||[];
  const stays=new Map();
  a.forEach((p,i)=>{if(p&&p.name)stays.set(p.id||p.url||`item-${i}`,p)});
  const stayCounter=document.getElementById('v243-stay-count');
  if(stayCounter)stayCounter.textContent=`${stays.size} yöpymispaikkaa`;
  const towns=window.siteMunicipalities||{};
  const townCounter=document.getElementById('v243-town-count');
  if(townCounter)townCounter.textContent=`${Object.keys(towns).length} kuntaa`;

  // Yöpymisnäkymissä tekstihaku toimii maakunta- ja kuntarajauksen rinnalla.
  const staySearch=document.getElementById('v243-stay-search');
  if(staySearch){
    const status=document.getElementById('list-status');
    const container=document.getElementById('municipality-results');
    const filter=()=>{
      if(!container)return;
      const q=norm(staySearch.value);
      const cards=[...container.querySelectorAll('.stay')];
      let visible=0;
      cards.forEach(c=>{const found=!q||norm(c.textContent).includes(q);c.hidden=!found;c.style.display=found?'':'none';if(found)visible++});
      if(q&&status)status.textContent=`Hakusanalla ”${staySearch.value.trim()}” ${visible} / ${cards.length} kohdetta`;
    };
    staySearch.addEventListener('input',filter);
    ['region','municipality'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>filter()));
    const params=new URLSearchParams(location.search);if(params.has('haku')){staySearch.value=params.get('haku');filter()}
  }

  // Maakuntasivun suora kunta-/kylähaku ennen valintalistoja.
  const regionSelect=document.getElementById('v243-region-select');
  const townSelect=document.getElementById('v243-town-select');
  const townSearch=document.getElementById('regionSearch');
  const hits=document.getElementById('v243-town-hits');
  if(regionSelect&&townSelect){
    const regions=window.municipalityRegions||{};
    const allTowns=window.siteMunicipalities||{};
    const regionNames=window.siteRegions||[...new Set(Object.values(regions))].sort((a,b)=>a.localeCompare(b,'fi'));
    regionNames.forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;regionSelect.append(o)});
    function fill(){
      townSelect.replaceChildren();
      const initial=document.createElement('option');initial.value='';initial.textContent=regionSelect.value?'Valitse kunta…':'Valitse ensin maakunta…';townSelect.append(initial);
      townSelect.disabled=!regionSelect.value;
      Object.keys(allTowns).filter(c=>regions[c]===regionSelect.value).sort((a,b)=>a.localeCompare(b,'fi')).forEach(c=>{
        const o=document.createElement('option');o.value=allTowns[c];o.textContent=c;townSelect.append(o);
      });
    }
    regionSelect.addEventListener('change',fill);
    townSelect.addEventListener('change',()=>{if(townSelect.value)location.href=townSelect.value});
    fill();
    if(townSearch&&hits){
      const aliases=[['Levi','Kittilä','levi.html'],['Sirkka','Kittilä','levi.html'],['Ylläs','Kolari','yllas.html'],['Äkäslompolo','Kolari','yllas.html'],['Ylläsjärvi','Kolari','yllas.html'],['Napapiiri','Rovaniemi','rovaniemi.html#helmet'],['Joulupukin Pajakylä','Rovaniemi','rovaniemi-pajakyla.html'],['Vääksy','Asikkala','asikkala.html#vaaksy'],['Kalkkinen','Asikkala','asikkala.html#kalkkinen'],['Vuokatti','Sotkamo','sotkamo.html#vuokatti'],['Ruka','Kuusamo','kuusamo.html#ruka'],['Hossa','Suomussalmi','suomussalmi.html#retket']];
      const entries=[...Object.entries(allTowns).map(([n,u])=>({name:n,meta:regions[n]||'Kunta',url:u})),...aliases.map(([name,meta,url])=>({name,meta,url}))];
      function search(){
        const q=norm(townSearch.value);hits.replaceChildren();hits.classList.remove('active');if(!q)return;
        const matches=entries.filter(p=>norm(`${p.name} ${p.meta}`).includes(q)).sort((a,b)=>{const x=norm(a.name),y=norm(b.name);return Number(y.startsWith(q))-Number(x.startsWith(q))||x.localeCompare(y,'fi')}).slice(0,8);
        matches.forEach(p=>{const a=document.createElement('a');a.href=p.url;const name=document.createElement('span');name.textContent=p.name;const meta=document.createElement('small');meta.textContent=p.meta;a.append(name,meta);hits.append(a)});
        if(matches.length)hits.classList.add('active');
      }
      townSearch.addEventListener('input',search);
      townSearch.addEventListener('keydown',e=>{if(e.key==='Enter'){const a=hits.querySelector('a');if(a){e.preventDefault();location.href=a.href}}});
    }
  }
});
})();
