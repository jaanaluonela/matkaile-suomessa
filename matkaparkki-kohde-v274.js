(()=>{'use strict';
const box=document.getElementById('place-detail');if(!box)return;
const id=new URLSearchParams(location.search).get('id');
const item=(window.msMatkaparkitV274||[]).find(x=>x.id===id);
if(!item){box.replaceChildren();const h=document.createElement('h1');h.textContent='Kohdetta ei löydy';const a=document.createElement('a');a.href='matkaparkit.html';a.textContent='Avaa matkaparkit';box.append(h,a);return;}
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const maps='https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(item.address);
document.title=item.name+' – Matkailu Suomessa';
const detailed=Boolean(item.detailId);
const opening=item.verifiedOpeningStatus==='yearround'
 ? 'Matkaparkki ympäri vuoden; tarkista palvelujen ja tilojen aukiolo.'
 : 'Ympärivuotisuutta ei ole vahvistettu. Tarkista saatavuus ennen lähtöä.';
const serviceNames={electric:'⚡ Sähkö',wc:'🚻 WC',greywater:'🛠️ Harmaavesi'};
const services=(item.verifiedServices||[]).filter(key=>serviceNames[key]).map(key=>serviceNames[key]).join(' · ');
box.innerHTML=`<span class="tag">🅿️ Matkaparkki</span><h1>${esc(item.name)}</h1><p class="muted"><strong>${esc(item.city)} · ${esc(item.region)}</strong></p><p><strong>Osoite:</strong> ${esc(item.address)}</p><p>${esc(detailed?item.description:'Matkaparkki tai matkailuajoneuvolle tarkoitettu yöpymispaikka. Tarkista majoittumisen ehdot, sähkö- ja huoltopalvelut sekä soveltuvuus matkailuvaunulle ennen saapumista.')}</p>${detailed?`<p><strong>Hinta:</strong> ${esc(item.priceText)}</p><p><strong>Saapuminen ja lähtö:</strong> ${esc(item.stayText)}</p><p><strong>Vahvistetut suodatinpalvelut:</strong> ${esc(services||'Ei vahvistettuja palveluja; tarkista kohteelta.')}</p>`:''}<p><strong>Aukiolo:</strong> ${esc(opening)}</p><div class="buttons"><a href="${esc(maps)}" target="_blank" rel="noopener">📍 Ajo-ohje →</a><a class="alt" href="${esc(item.website||'https://matkaparkki.com/matkaparkit/')}" target="_blank" rel="noopener">Kohteen sivu ↗</a></div><p class="small muted">Lähde: <a href="${esc(item.sourceUrl||'https://matkaparkki.com/matkaparkit/')}" target="_blank" rel="noopener">kohteen ilmoitus</a>. Tiedot tarkistettu ${detailed?'19.10.2026':'12.10.2026'}. Hinnat, saatavuus ja palvelut voivat muuttua.</p>`;
})();
