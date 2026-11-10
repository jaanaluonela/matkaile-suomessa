document.addEventListener('DOMContentLoaded',()=>{
document.querySelectorAll('.ph-exp-card img').forEach(img=>{
 const fallback=()=>{img.closest('.ph-exp-card').classList.add('no-photo');img.remove()};
 img.addEventListener('error',fallback,{once:true});
 if(img.complete&&img.naturalWidth===0)fallback();
});
const b=document.getElementById('ph-toggle-towns'),wrap=document.getElementById('ph-all-towns'),q=document.getElementById('ms334-find'),search=wrap.querySelector('.ph-town-search'),count=document.getElementById('ms334-count'),cards=[...wrap.querySelectorAll('.ms334-municipality')];
if(b&&wrap){wrap.after(b);b.classList.add('ph-towns-button');}
const buttonStyle=document.createElement('style');
buttonStyle.textContent='body.ms334-page main.ms334-main #ph-toggle-towns.ph-towns-button{display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;width:100%!important;min-height:52px!important;margin:14px 0 0!important;padding:14px 18px!important;border:2px solid #155548!important;border-radius:14px!important;background:#155548!important;color:#fff!important;font:750 16px/1.3 system-ui!important;text-decoration:none!important;cursor:pointer}body.ms334-page main.ms334-main #ph-toggle-towns.ph-towns-button:hover{background:#0d4439!important}body.ms334-page main.ms334-main #ph-toggle-towns.ph-towns-button:focus-visible{outline:3px solid #a26a27!important;outline-offset:3px!important}';
document.head.append(buttonStyle);
let open=false;const normalize=v=>v.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
function render(){const term=normalize(q.value);let n=0;cards.forEach((c,i)=>{const match=normalize(c.dataset.town).includes(term);c.hidden=!match||(!open&&i>=4);if(match)n++});search.hidden=!open;b.setAttribute('aria-expanded',String(open));b.textContent=open?'Näytä vähemmän ↑':'Näytä kaikki kunnat ›';count.textContent=term?(n===1?'1 kunta':n+' kuntaa'):'';}
b.addEventListener('click',()=>{open=!open;if(!open)q.value='';render()});q.addEventListener('input',render);q.addEventListener('search',render);render();
});