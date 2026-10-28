/* Kuntahaku toimii myös kirjoitettaessa a/ä tai o/ö. */
(()=>{'use strict';
 const input=document.getElementById('municipality-search');
 const cards=[...document.querySelectorAll('.ks-town')];
 const status=document.getElementById('ks-search-status');
 const empty=document.getElementById('ks-no-results');
 if(!input||!status||!empty)return;
 const normalize=value=>value.trim().toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 function filter(){
  const query=normalize(input.value);let count=0;
  for(const card of cards){card.hidden=!normalize(card.dataset.name).includes(query);if(!card.hidden)count++;}
  status.textContent=query?`${count} / ${cards.length} kuntaa`:`${cards.length} kuntaa`;
  empty.hidden=count>0;
 }
 input.addEventListener('input',filter);
 input.addEventListener('search',filter);
 filter();
})();
