/* Lapin kuntahaku ja avattavien osioiden pikavalinnat. */
(()=>{
 'use strict';
 document.querySelectorAll('.quick a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{
  const section=document.getElementById(a.hash.slice(1));
  if(section&&section.tagName==='DETAILS')section.open=true;
 }));
 const normal=s=>String(s||'').toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
 const input=document.getElementById('lappi-search');
 if(!input)return;
 // Use an existing app page when one is already present in the installed site.
 document.querySelectorAll('[data-town-link]').forEach(a=>{
  const name=a.dataset.townLink,u=(window.siteMunicipalities||{})[name];
  if(!u||/^lappi(?:-v245)?\.html#/.test(u))return;
  a.href=u;a.removeAttribute('target');a.removeAttribute('rel');
  a.querySelector('small').textContent='Avaa kuntasivu';
 });
 const rows=[...document.querySelectorAll('.town-row')],status=document.getElementById('lappi-status'),empty=document.getElementById('lappi-empty');
 function filter(){const q=normal(input.value);let count=0;rows.forEach(row=>{row.hidden=!!q&&!normal(row.dataset.search).includes(q);if(!row.hidden)count++;});status.textContent=q?count+' kuntaa hakua vastaamassa':rows.length+' kuntaa';empty.hidden=count!==0;}
 input.addEventListener('input',filter);
 input.addEventListener('keydown',event=>{if(event.key==='Enter'){const row=rows.find(r=>!r.hidden);if(row){const links=[...row.querySelectorAll('a')],query=normal(input.value),match=links.find(a=>query&&normal(a.textContent).includes(query));event.preventDefault();location.href=(match||links[0]).href;}}});
 filter();
})();
