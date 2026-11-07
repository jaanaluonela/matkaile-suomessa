document.addEventListener('DOMContentLoaded',()=>{
const b=document.getElementById('ph-toggle-towns'),wrap=document.getElementById('ph-all-towns'),q=document.getElementById('ms334-find'),search=wrap.querySelector('.ph-town-search'),count=document.getElementById('ms334-count'),cards=[...wrap.querySelectorAll('.ms334-municipality')];
let open=false;const normalize=v=>v.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
function render(){const term=normalize(q.value);let n=0;cards.forEach((c,i)=>{const match=normalize(c.dataset.town).includes(term);c.hidden=!match||(!open&&i>=4);if(match)n++});search.hidden=!open;b.setAttribute('aria-expanded',String(open));b.textContent=open?'Näytä vähemmän ↑':'Näytä kaikki kunnat ›';count.textContent=term?(n===1?'1 kunta':n+' kuntaa'):'';}
b.addEventListener('click',()=>{open=!open;if(!open)q.value='';render()});q.addEventListener('input',render);q.addEventListener('search',render);render();
});