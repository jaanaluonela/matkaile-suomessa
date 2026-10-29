/* Kuntakortin Yöpyminen avaa suoraan kyseisen kunnan tulokset. */
(()=>{'use strict';
const params=new URLSearchParams(location.search),townName=params.get('kunta');
if(!townName)return;
function init(){
 const region=document.getElementById('region'),town=document.getElementById('municipality'),results=document.querySelector('.ms318-camp-list');
 if(!region||!town||!results)return;
 const title=document.querySelector('.ms318-hero--camp h1'),heading=document.querySelector('.ms318-results-header h2');
 document.body.classList.add('ms-town-stays');
 if(title)title.textContent=townName+' – yöpymispaikat';
 if(heading)heading.textContent='Yöpymispaikat: '+townName;
 const regionName=region.value;
 const back=document.createElement('a');back.href=(townName.toLocaleLowerCase('fi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ä/g,'a').replace(/ö/g,'o').replace(/[^a-z0-9]+/g,'-')+'.html');back.textContent='‹ Takaisin: '+townName;back.style.cssText='display:inline-block;margin:8px 0 18px;color:#175744;font-weight:750';results.parentNode.insertBefore(back,results);
 const selectTown=()=>{if([...town.options].some(o=>o.value===townName)&&town.value!==townName){town.value=townName;town.dispatchEvent(new Event('change',{bubbles:true}))}};
 selectTown();setTimeout(selectTown,120);
 const status=document.getElementById('list-status');
 if(status){const observer=new MutationObserver(()=>{if(/0\s*\/\s*0/.test(status.textContent||''))status.textContent='Halsuan kaltaisen kunnan yöpymispaikkoja ei ole vielä lisätty tähän hakemistoon. Voit tarkistaa muut majoitusvaihtoehdot kunnan matkailusivuilta.'.replace('Halsuan kaltaisen kunnan',townName+'n');});observer.observe(status,{childList:true,characterData:true,subtree:true})}
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>setTimeout(init,0),{once:true}):setTimeout(init,0);
})();