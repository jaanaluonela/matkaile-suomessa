(() => {
 const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const towns=window.siteMunicipalities || {}, places=window.caravanPlaces || [];
 const select=document.getElementById('municipality'), box=document.getElementById('municipality-results'), status=document.getElementById('list-status');
 if(!select)return;
 Object.keys(towns).sort((a,b)=>a.localeCompare(b,'fi')).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;select.append(o);});
 const kind=document.body.dataset.kind || 'town';
 function render(){
 const city=select.value;box.innerHTML='';
 if(!city){status.textContent='Valitse kunta nähdäksesi '+(kind==='town'?'kunnan sivun.':'sen kohteet.');return;}
 if(kind==='town'){status.textContent=city;box.innerHTML=`<a class="municipality" href="${esc(towns[city])}">Avaa ${esc(city)} →</a>`;return;}
 const filtered=places.filter(d=>d.city===city && (kind==='all'||d.type===kind));status.textContent=city+' · '+filtered.length+' kohdetta';
 if(!filtered.length){box.innerHTML='<p class="empty">Tähän kuntaan ei ole vielä lisätty tämän ryhmän kohteita.</p>';return;}
 box.innerHTML=filtered.map(d=>`<article class="stay"><span class="badge">${esc(d.season || (d.type==='park'?'🅿️ Matkaparkki':'🏕️ Leirintäalue'))}</span><h2>${esc(d.name)}</h2><p class="address">${esc(d.address)}</p><p class="description">${esc(d.description)}</p><div class="buttons"><a class="btn" href="${esc(d.url)}">Kohteen tiedot →</a>${d.website?`<a class="btn secondary" href="${esc(d.website)}" target="_blank" rel="noopener">Omat sivut ↗</a>`:''}<a class="btn secondary" href="${esc(d.navigate || d.map)}" target="_blank" rel="noopener">Ajo-ohje ↗</a></div></article>`).join('');
 }
 const city=new URLSearchParams(location.search).get('kunta');if(city&&towns[city])select.value=city;
 select.addEventListener('change',()=>{if(document.body.dataset.home){location.href=towns[select.value];return;}const url=new URL(location.href);if(select.value)url.searchParams.set('kunta',select.value);else url.searchParams.delete('kunta');history.replaceState(null,'',url);render();});render();
})();