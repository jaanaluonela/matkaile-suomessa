
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
    arrow.textContent='›';
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

// v225: Add town highlights beside existing municipality content.
window.addEventListener('DOMContentLoaded',()=>{
 const title=document.querySelector('h1');if(!title||document.getElementById('town-highlights-v225'))return;
 const city=title.textContent.trim();
 const script=document.createElement('script');script.src='kayntikohteet-data-v227.js';
 script.onload=()=>{
  const places=(window.visitHighlights||[]).filter(p=>p.city===city);if(!places.length)return;
  const section=document.createElement('section');section.id='town-highlights-v225';section.className='card';section.style.margin='16px 0';
  const heading=document.createElement('h2');heading.textContent='⭐ Paikkakunnan helmet';section.append(heading);
  const list=document.createElement('div');list.className='compact-list';
  for(const p of places){const a=document.createElement('a');a.className='place linkcard';a.href=p.url;a.style.cssText='display:block;padding:14px;margin:8px 0;border:1px solid #cfe3db;border-radius:16px;background:#f5faf7;color:#174d40;text-decoration:none';const b=document.createElement('b');b.textContent=p.name;const desc=document.createElement('p');desc.textContent=p.description||'';const more=document.createElement('span');more.textContent='Tutustu →';a.append(b,desc,more);list.append(a);}
  section.append(list);const all=document.createElement('a');all.href='kayntikohteet.html?kunta='+encodeURIComponent(city);all.textContent='Selaa paikkakunnan helmiä →';section.append(all);
  const intro=document.querySelector('.intro-card')||document.querySelector('main > section.card');if(intro)intro.after(section);else(title.closest('header')||title).after(section);
 };document.head.append(script);
});
