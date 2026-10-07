(() => {
 const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const towns=window.siteMunicipalities || {}, places=window.caravanPlaces || [];
 const select=document.getElementById('municipality'), box=document.getElementById('municipality-results'), status=document.getElementById('list-status');
 if(!select)return;
 const region=document.getElementById('region'), mapping=window.municipalityRegions || {};
 (window.siteRegions || []).forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;region.append(o);});
 function fillTowns(){select.innerHTML='<option value="">'+(region.value?'Koko maakunta':'Valitse ensin maakunta…')+'</option>';select.disabled=!region.value;Object.keys(towns).filter(c=>mapping[c]===region.value).sort((a,b)=>a.localeCompare(b,'fi')).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;select.append(o);});}
 const kind=document.body.dataset.kind || 'town';
 function render(){
 const city=select.value;box.innerHTML='';
 if(!region.value){status.textContent='Valitse maakunta ja kunta nähdäksesi '+(kind==='town'?'kunnan sivun.':'sen kohteet.');return;}
 if(kind==='town'&&!city){const cities=Object.keys(towns).filter(c=>mapping[c]===region.value).sort((a,b)=>a.localeCompare(b,'fi'));status.textContent=region.value+' · '+cities.length+' kuntaa oppaassa';box.innerHTML=cities.length?cities.map(c=>`<a class="municipality" href="${esc(towns[c])}">${esc(c)} →</a>`).join(''):'<p class="empty">Tämän maakunnan kuntasivuja ei ole vielä lisätty oppaaseen.</p>';return;}
 if(kind==='town'){status.textContent=city;box.innerHTML=`<a class="municipality" href="${esc(towns[city])}">Avaa ${esc(city)} →</a>`;return;}
 const filtered=places.filter(d=>(city?d.city===city:mapping[d.city]===region.value) && (kind==='all'||d.type===kind));status.textContent=(city||region.value)+' · '+filtered.length+' kohdetta';
 if(!filtered.length){box.innerHTML='<p class="empty">Tähän kuntaan ei ole vielä lisätty tämän ryhmän kohteita.</p>';return;}
 box.innerHTML=filtered.map(d=>`<article class="stay"><span class="badge">${esc(d.season || (d.type==='park'?'🅿️ Matkaparkki':'🏕️ Leirintäalue'))}</span><h2>${esc(d.name)}</h2><p class="address">${esc(d.city)} · ${esc(d.address)}</p><p class="description">${esc(d.description)}</p><div class="buttons"><a class="btn" href="${esc(d.url)}">Kohteen tiedot →</a>${d.website?`<a class="btn secondary" href="${esc(d.website)}" target="_blank" rel="noopener">Omat sivut ↗</a>`:''}<a class="btn secondary" href="${esc(d.navigate || d.map)}" target="_blank" rel="noopener">Ajo-ohje ↗</a></div></article>`).join('');
 }
 const params=new URLSearchParams(location.search), city=params.get('kunta');region.value=(city&&mapping[city])||params.get('maakunta')||'';fillTowns();if(city&&towns[city])select.value=city;region.addEventListener('change',()=>{fillTowns();const u=new URL(location.href);u.searchParams.delete('kunta');if(region.value)u.searchParams.set('maakunta',region.value);else u.searchParams.delete('maakunta');history.replaceState(null,'',u);render();});
 select.addEventListener('change',()=>{if(document.body.dataset.home&&select.value){location.href=towns[select.value];return;}const url=new URL(location.href);if(select.value)url.searchParams.set('kunta',select.value);else url.searchParams.delete('kunta');history.replaceState(null,'',url);render();});render();
})();