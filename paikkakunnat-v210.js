(() => {
const input=document.getElementById('regionSearch'), box=document.createElement('div');input.after(box);
const norm=s=>s.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
input.addEventListener('input',()=>{box.replaceChildren();const q=norm(input.value.trim());if(!q)return;const matches=Object.entries(window.siteMunicipalities||{}).filter(([n])=>norm(n).includes(q));for(const [name,url] of matches){const a=document.createElement('a');a.className='municipality';a.href=url;a.textContent=name+' →';box.append(a);}if(!matches.length)box.textContent='Kuntaa ei vielä ole oppaassa.';});
})();