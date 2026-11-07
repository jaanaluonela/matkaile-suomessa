/* Maakuntien yhtenäiset valintakortit, 2026-11-07 */
(function(){
const icons={
nature:'<path d="M16 3 6 17h6l-7 9h22l-7-9h6L16 3Z"/><path d="M16 26v4"/>',
sight:'<path d="M4 12h24M7 12V27M13 12V27M19 12V27M25 12V27M4 28h24M3 9l13-6 13 6v3H3Z"/>',
stay:'<rect x="3" y="9" width="26" height="17" rx="3"/><path d="M3 17h26M8 13h6v4H8zM20 17v9"/><circle cx="9" cy="27" r="2"/><circle cx="24" cy="27" r="2"/>',
food:'<path d="M5 12h19v7a9 9 0 0 1-9 9h-1a9 9 0 0 1-9-9v-7ZM24 14h3a4 4 0 0 1 0 8h-4M9 3c-3 3 3 4 0 7M16 3c-3 3 3 4 0 7M23 3c-3 3 3 4 0 7"/>',
tips:'<path d="M5 4v25M5 6h22l-5 6 5 6H5M5 21h17l-4 5H5"/>'
};
function apply(){
 const cards=[...document.querySelectorAll('.pp-categories .pp-category,.ks-categories .ks-category,.categories .category')];
 if(cards.length<3)return;
 cards.forEach((card,i)=>{
  const heading=card.querySelector('h2,h3');if(!heading)return;
  const t=heading.textContent.toLowerCase();
  const kind=/luonto|retke|kansallispuisto/.test(t)?'nature':/nähtäv|käyntikoh|museo|kulttuur/.test(t)?'sight':/leirint|matkapark|yöpymi|majoitu/.test(t)?'stay':/kahvil|ravintol|ruoka/.test(t)?'food':'tips';
  card.querySelectorAll('.ph-emoji,.ks-category-icon,.pk-category-icon,.category-icon').forEach(el=>el.remove());
  if(!card.querySelector('.region-unified-icon')){
   const holder=document.createElement('span');holder.className='region-unified-icon';
   holder.innerHTML='<svg viewBox="0 0 32 32" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+icons[kind]+'</svg>';
   card.insertBefore(holder,card.firstChild);
  }
  const cta=card.querySelector('strong');if(cta)cta.textContent='Tutustu kohteisiin ›';
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
})();