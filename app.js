
function key(id){return 'ms_'+id}function visited(id,btn){localStorage.setItem(key('visited_'+id),'1'); if(btn) btn.textContent='✓ Olen käynyt täällä';}
function addTrip(id,name){let a=JSON.parse(localStorage.getItem(key('trips'))||'[]'); if(!a.find(x=>x.id===id)) a.push({id,name,date:new Date().toISOString().slice(0,10)}); localStorage.setItem(key('trips'),JSON.stringify(a)); alert('Lisätty omiin matkoihin: '+name)}
window.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('[data-visited]').forEach(b=>{let id=b.dataset.visited;if(localStorage.getItem(key('visited_'+id))) b.textContent='✓ Olen käynyt täällä';})})
