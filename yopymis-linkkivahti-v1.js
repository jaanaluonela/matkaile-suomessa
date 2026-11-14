/* Hide unavailable destination buttons on accommodation result cards. */
(()=>{'use strict';
const cache=new Map();
const base=new URL('./',location.href);
function destination(a){
 const raw=a.getAttribute('href');
 if(!raw||/^(#|javascript:|mailto:|tel:)/i.test(raw))return null;
 try {const u=new URL(raw,location.href);if(!/^https?:$/.test(u.protocol))return null;return u;}catch{return null;}
}
function hide(a){a.hidden=true;a.style.setProperty('display','none','important');a.setAttribute('aria-hidden','true');}
async function valid(u){
 if(u.origin!==location.origin)return true; // External destinations cannot be reliably checked cross-origin.
 if(u.pathname===base.pathname||/\/(index|404)\.html$/i.test(u.pathname))return false;
 if(!u.pathname.endsWith('.html'))return true;
 const key=u.pathname;
 if(!cache.has(key))cache.set(key,fetch(u.href,{method:'HEAD',cache:'no-store'}).then(r=>r.ok&&new URL(r.url).pathname===u.pathname).catch(()=>null));
 return cache.get(key);
}
async function inspect(a){
 if(a.dataset.linkGuard==='done')return;
 const u=destination(a);
 if(!u){hide(a);a.dataset.linkGuard='done';return;}
 const result=await valid(u);
 if(!a.isConnected)return;
 if(result===false)hide(a);
 a.dataset.linkGuard='done';
}
function scan(){
 document.querySelectorAll('#municipality-results .stay .buttons a').forEach(a=>{
   if(a.dataset.linkGuard==='done'&&a.dataset.linkGuardHref===a.getAttribute('href'))return;
   a.dataset.linkGuardHref=a.getAttribute('href')||'';
   a.dataset.linkGuard='pending';
   inspect(a);
 });
}
const start=()=>{scan();new MutationObserver(scan).observe(document.getElementById('municipality-results'),{childList:true,subtree:true,attributes:true,attributeFilter:['href']});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();