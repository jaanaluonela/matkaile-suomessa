
function key(id){return 'ms_'+id}function visited(id,btn){localStorage.setItem(key('visited_'+id),'1'); if(btn) btn.textContent='✓ Olen käynyt täällä';}
function addTrip(id,name){let a=JSON.parse(localStorage.getItem(key('trips'))||'[]'); if(!a.find(x=>x.id===id)) a.push({id,name,date:new Date().toISOString().slice(0,10)}); localStorage.setItem(key('trips'),JSON.stringify(a)); alert('Lisätty omiin matkoihin: '+name)}
window.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-visited]').forEach(b=>{let id=b.dataset.visited;if(localStorage.getItem(key('visited_'+id))) b.textContent='✓ Olen käynyt täällä';})})


// v168: Avattavat/suljettavat kuntasivujen osiot
window.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.section-list').forEach((section, index)=>{
    const title=section.querySelector('h2');
    if(!title || title.dataset.accordionReady) return;
    title.dataset.accordionReady='1';
    title.setAttribute('role','button');
    title.setAttribute('tabindex','0');
    const body=section.querySelector('.compact-list');
    if(body && !body.id) body.id='accordion_'+index+'_'+Math.random().toString(36).slice(2,7);
    if(body) title.setAttribute('aria-controls', body.id);
    const arrow=document.createElement('span');
    arrow.className='acc-arrow';
    arrow.textContent='▼';
    title.appendChild(arrow);
    section.classList.add('collapsed');
    title.setAttribute('aria-expanded','false');
    const toggle=()=>{
      const closed=section.classList.toggle('collapsed');
      title.setAttribute('aria-expanded', String(!closed));
    };
    title.addEventListener('click',toggle);
    title.addEventListener('keydown',(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
});
