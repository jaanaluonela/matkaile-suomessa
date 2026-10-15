/* Matkaile Suomessa v330 — sisältösivujen kevyt selkeytys.
 * Etusivun elementteihin ei kosketa. Sisältö, linkit ja vanhat haut säilyvät.
 */
(()=>{
  'use strict';
  const filename=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  if(filename==='index.html'||filename==='404.html')return;
  function afterReady(){
    document.body.classList.add('ms330-content-page');
    const main=document.querySelector('main,.map-page,.ou329-main')||document.body;
    if(filename==='maakunnat.html'||filename==='kunnat.html')compactRegionPage(main);
    compactHeading(main);
    simplifyDuplicateHomeLinks(main);
    enhanceLists(main);
  }
  function compactHeading(main){
    const h1=main.querySelector('h1');if(!h1)return;
    let block=h1.closest('header,section');
    if(!block||block===main||block.querySelectorAll('h1').length!==1)return;
    // Class name scoped: avoid broad changes to cards and navigation.
    if(block.querySelectorAll('article').length===0)block.classList.add('ms330-page-intro');
  }
  function compactRegionPage(main){
    const h1=main.querySelector('h1');
    if(h1&&/^maakunnat$/i.test(h1.textContent.trim()))h1.textContent='Paikkakunnat';
    const intro=h1?.closest('header,section,.hero,.intro');
    if(intro){
      const paragraphs=[...intro.querySelectorAll('p')].filter(p=>p.closest('header,section,.hero,.intro')===intro);
      const long=paragraphs.find(p=>p.textContent.trim().length>125);
      if(long){
        // The interactive map has its own controls. Replace only redundant instructions,
        // not regional or destination content.
        long.textContent='Hae paikkakuntaa tai valitse maakunta. Tutustu sen kohteisiin ja palveluihin.';
      }
      intro.classList.add('ms330-regions-intro');
    }
    // Keep the map available, but on a phone put it behind an optional disclosure.
    const toggles=[...main.querySelectorAll('details')].filter(d=>{
      const t=d.querySelector(':scope > summary');
      return t&&/tutki suomen karttaa|näytä suomen kartta/i.test(t.textContent||'');
    });
    if(window.matchMedia&&window.matchMedia('(max-width: 760px)').matches){
      for(const d of toggles)d.open=false;
      for(const b of main.querySelectorAll('button[aria-expanded="true"]')){
        if(/tutki suomen karttaa|näytä suomen kartta/i.test(b.textContent||''))b.click();
      }
    }
    // Prioritize searching and selecting regions above the large map graphic.
    // This only moves an entire pre-existing details element, preserving SVG and handlers.
    const directList=[...main.children].filter(x=>x.matches?.('.region-list,.maakunta-list,.region-grid,.maakunnat-list'));
    const lastDirectRegionRow=[...main.children].filter(x=>x.matches?.('.region-row')).at(-1);
    const anchor=directList.at(-1)||lastDirectRegionRow;
    const mapToggle=toggles.find(d=>d.parentElement===main);
    if(anchor&&mapToggle&&!(anchor.compareDocumentPosition(mapToggle)&Node.DOCUMENT_POSITION_FOLLOWING)){
      anchor.after(mapToggle);
    }
  }
  function simplifyDuplicateHomeLinks(main){
    if(!main.querySelector('.ms302-crumb'))return;
    const links=[...main.querySelectorAll('a')].filter(a=>/^(?:‹|←|<)?\s*Takaisin etusivulle$/i.test(a.textContent.trim()));
    for(const a of links){
      // Breadcrumb already has an Etusivu link; avoid a second one directly below it.
      if(a.parentElement===main||a.parentElement?.tagName==='HEADER')a.classList.add('ms330-duplicate-back');
    }
  }
  function enhanceLists(main){
    // Only expanded collections of destination cards: no data is removed, and
    // never touch Oulu's independently filtered search results.
    const grids=[...main.querySelectorAll('.es321-grid,.v278-grid,.os328-grid')];
    for(const grid of grids){
      const cards=[...grid.children].filter(el=>el.matches('article,.es321-card,.v278-tip,.os328-card'));
      if(cards.length<=6||grid.dataset.ms330Ready==='1')continue;
      grid.dataset.ms330Ready='1';
      cards.slice(6).forEach(c=>c.classList.add('ms330-extra-card'));
      const more=document.createElement('button');more.type='button';
      more.className='ms330-expand';more.setAttribute('aria-expanded','false');
      const count=cards.length;
      const update=()=>{
        const shown=more.getAttribute('aria-expanded')==='true';
        grid.classList.toggle('ms330-show-all',shown);
        more.textContent=shown?'Näytä vähemmän':`Näytä kaikki ${count} kohdetta`;
      };
      more.addEventListener('click',()=>{more.setAttribute('aria-expanded',String(more.getAttribute('aria-expanded')!=='true'));update();});
      grid.after(more);update();
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',afterReady,{once:true});
  else afterReady();
})();
