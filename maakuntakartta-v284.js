/* Matkailu Suomessa v284 – kartan/listan yhtenevät värit ja kunnan valinta */
(()=>{'use strict';
  function init(){
    const map=document.querySelector('.ms-finland-map');
    const list=document.getElementById('regions-list');
    const search=document.getElementById('region-search');
    const panel=document.getElementById('suomen-maakuntakartta');
    const accordion=panel&&panel.querySelector('.ms-map-toggle');
    const selection=panel&&panel.querySelector('.ms-map-selection');
    const label=document.getElementById('ms-map-selected-region');
    const hint=document.getElementById('ms-map-selected-hint');
    const actions=document.getElementById('ms-selected-actions');
    const guideButton=document.getElementById('ms-selected-guide');
    const backButton=document.getElementById('ms-back-to-towns');
    if(!map||!list)return;
    const links=[...map.querySelectorAll('.ms-map-link')];
    const palette=new Map(links.map(a=>[a.dataset.region,a.querySelector('.region').style.getPropertyValue('--c').trim()]));
    const townsByRegion=window.msFinlandRegions2026||{};
    const motion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
    const params=new URLSearchParams(location.search);
    const valid=(name,town)=>Boolean(name&&Array.isArray(townsByRegion[name])&&townsByRegion[name].includes(town));
    let region=palette.has(params.get('maakunta'))?params.get('maakunta'):null;
    let town=valid(region,params.get('kunta'))?params.get('kunta'):null;
    function applyColors(){
      list.querySelectorAll('.region-card[data-name]').forEach(card=>{
        const color=palette.get(card.dataset.name);
        if(color)card.style.setProperty('--region-color',color);
        card.classList.toggle('is-map-selected',card.dataset.name===region);
      });
      list.querySelectorAll('.region-town[data-town]').forEach(el=>{
        el.classList.toggle('is-selected-town',!!town&&el.dataset.town===town&&el.closest('.region-card')?.dataset.name===region);
      });
    }
    function paint(){
      links.forEach(a=>{const active=a.dataset.region===region;a.classList.toggle('is-selected',active);a.setAttribute('aria-current',active?'true':'false')});
      applyColors();
      if(label)label.textContent=town||region||'Valitse maakunta kartalta';
      if(hint)hint.textContent=town?'Maakunta: '+region:region?'Vastaava maakunta korostuu myös listassa':'Kartta ja maakuntalista käyttävät samoja värejä';
      if(selection)selection.classList.toggle('has-town',!!town);
      if(actions)actions.hidden=!town;
      if(town&&guideButton){
        const destination=typeof window.msTownUrl253==='function' ? window.msTownUrl253(town):{url:'kuntakortti.html?kunta='+encodeURIComponent(town),ready:false};
        guideButton.href=destination.url;
        guideButton.textContent=destination.ready?'Avaa '+town+' – matkaopas ↗':'Avaa '+town+' – kuntakortti ↗';
      }
    }
    function setQuery(selectedRegion,selectedTown){
      const u=new URL(location.href);
      if(selectedRegion)u.searchParams.set('maakunta',selectedRegion);
      else u.searchParams.delete('maakunta');
      if(selectedTown)u.searchParams.set('kunta',selectedTown);
      else u.searchParams.delete('kunta');
      history.replaceState(null,'',u);
    }
    function selectRegion(nextRegion,nextTown=null,updateUrl=false){
      region=palette.has(nextRegion)?nextRegion:null;
      town=valid(region,nextTown)?nextTown:null;
      paint();
      if(updateUrl)setQuery(region,town);
    }
    function findCard(name){return [...list.querySelectorAll('.region-card[data-name]')].find(c=>c.dataset.name===name)}
    function showMap(){
      if(accordion)accordion.open=true;
      // Puhelimessa kartta on listan yläpuolella. Selaa kartan kohdalle, jotta värin vaihtuminen näkyy.
      if(window.matchMedia('(max-width: 959px)').matches&&panel){
        requestAnimationFrame(()=>{
          const active=map.querySelector('.ms-map-link.is-selected .region');
          if(!active){panel.scrollIntoView({behavior:motion(),block:'start'});return}
          const rect=active.getBoundingClientRect();
          const y=Math.max(0,window.scrollY+rect.top+rect.height/2-window.innerHeight*.38);
          window.scrollTo({top:y,behavior:motion()});
        });
      }
    }
    // Korostus ei muutu vain osoittimen liikkeestä: valinta pysyy selkeänä myös vieritettäessä.
    map.addEventListener('click',e=>{
      const a=e.target.closest('.ms-map-link');if(!a||!palette.has(a.dataset.region))return;
      const chosen=a.dataset.region;
      if(!search)return;
      if(search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));}
      const card=findCard(chosen);
      if(!card)return; // Sivun varalinkki toimii ilman luettelotietoja.
      e.preventDefault();
      list.querySelectorAll('details.region-card[open]').forEach(other=>{if(other!==card)other.open=false});
      card.open=true;
      selectRegion(chosen,null,true);
      card.scrollIntoView({behavior:motion(),block:'start'});
    });
    list.addEventListener('click',e=>{
      const summary=e.target.closest('.region-card summary');
      if(summary){
        const card=summary.closest('.region-card');
        requestAnimationFrame(()=>{
          if(!card.isConnected)return;
          if(card.open)selectRegion(card.dataset.name,null,true);
          else if(region===card.dataset.name)selectRegion(null,null,true);
        });
      }
      const guide=e.target.closest('.region-town-guide');
      if(guide){
        const townEl=guide.closest('.region-town');
        const card=guide.closest('.region-card');
        if(townEl&&card)selectRegion(card.dataset.name,townEl.dataset.town,true);
      }
    });
    window.addEventListener('ms:town-picked',e=>{
      const {region:chosen,town:chosenTown}=e.detail||{};
      if(!valid(chosen,chosenTown))return;
      selectRegion(chosen,chosenTown,true);
      showMap();
    });
    if(backButton)backButton.addEventListener('click',()=>{
      const card=findCard(region);
      if(card){card.open=true;card.scrollIntoView({behavior:motion(),block:'start'});}
      else list.scrollIntoView({behavior:motion(),block:'start'});
    });
    if(search)search.addEventListener('input',()=>requestAnimationFrame(applyColors));
    const observer=new MutationObserver(applyColors);
    observer.observe(list,{childList:true});
    window.addEventListener('popstate',()=>{
      const p=new URLSearchParams(location.search);
      selectRegion(p.get('maakunta'),p.get('kunta'));
    });
    paint();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
