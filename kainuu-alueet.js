const search=document.getElementById('area-search'), select=document.getElementById('area-municipality');
const groups=[...document.querySelectorAll('.area-group')], count=document.getElementById('area-count');
const normalize=s=>s.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function filter(){const q=normalize(search.value.trim());let n=0;for(const group of groups){let visible=0;for(const row of group.querySelectorAll('.area')){const matches=(!select.value||group.dataset.municipality===select.value)&&normalize(row.dataset.search).includes(q);row.hidden=!matches;if(matches){visible++;n++;}}group.hidden=!visible;}count.textContent=n+' aluetta';}
select.value=new URLSearchParams(location.search).get('kunta')||'';
search.addEventListener('input',filter);select.addEventListener('change',filter);
function showAnchor(){const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const target=document.getElementById(id);if(target&&target.classList.contains('area')){search.value='';select.value='';filter();target.open=true;target.scrollIntoView();}}
filter();showAnchor();window.addEventListener('hashchange',showAnchor);
