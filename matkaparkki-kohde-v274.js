(()=>{'use strict';
const box=document.getElementById('place-detail');if(!box)return;
const id=new URLSearchParams(location.search).get('id');
const item=(window.msMatkaparkitV274||[]).find(x=>x.id===id);
if(!item){box.replaceChildren();const h=document.createElement('h1');h.textContent='Kohdetta ei löydy';const a=document.createElement('a');a.href='matkaparkit.html';a.textContent='Avaa matkaparkit';box.append(h,a);return;}
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const maps='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(item.address);
document.title=item.name+' – Matkailu Suomessa';
box.innerHTML=`<span class="tag">🅿️ Matkaparkki · tarkista aukiolo</span><h1>${esc(item.name)}</h1><p class="muted"><strong>${esc(item.city)} · ${esc(item.region)}</strong></p><p><strong>Osoite:</strong> ${esc(item.address)}</p><p>Matkaparkki tai matkailuajoneuvolle tarkoitettu yöpymispaikka. Tarkista majoittumisen ehdot, sähkö- ja huoltopalvelut sekä soveltuvuus matkailuvaunulle ennen saapumista.</p><p><strong>Aukiolo:</strong> Ei vahvistettua ympärivuotisuutta. Tarkista saatavuus ja palvelujen aukiolo ennen matkaa.</p><div class="buttons"><a href="${esc(maps)}" target="_blank" rel="noopener">📍 Ajo-ohje →</a><a class="alt" href="https://matkaparkki.com/matkaparkit/" target="_blank" rel="noopener">Tarkista kohde ja varaus ↗</a></div><p class="small muted">Lähde: Matkaparkki.comin julkinen kohdeluettelo. Tiedot koottu 12.10.2026. Varausmahdollisuus ja hinnat voivat muuttua.</p>`;
})();