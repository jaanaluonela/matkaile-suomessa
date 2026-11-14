/* Yöpymispaikkojen linkkivahti: älä näytä puuttuvan kohdesivun painiketta. */
(()=>{'use strict';
const cache=new Map();
const root=document.getElementById('municipality-results');
if(!root)return;
function hide(a){a.hidden=true;a.style.setProperty('display','none','important');a.setAttribute('aria-hidden','true');}
function destination(a){
 const raw=(a.getAttribute('href')||'').trim();
 if(!raw||raw==='#'||/^(javascript:|mailto:|tel:|#)/i.test(raw))return null;
 try{const u=new URL(raw,location.href);return /^https?:$/.test(u.protocol)?u:null;}catch{return null;}
}
async function valid(u){
 if(u.origin!==location.origin)return true; // Ulkoisten sivujen tilaa ei voi luotettavasti tarkistaa selaimesta.
 if(/\/(index|404)\.html$/i.test(u.pathname)||u.pathname===new URL('./',location.href).pathname)return false;
 if(!/\.html$/i.test(u.pathname))return true;
 if(!cache.has(u.pathname)){
  cache.set(u.pathname,(async()=>{
   try{
    let response=await fetch(u.href,{method:'HEAD',cache:'no-store',redirect:'follow'});
    if(response.status===405||response.status===501)response=await fetch(u.href,{method:'GET',cache:'no-store',redirect:'follow'});
    return response.ok&&new URL(response.url).pathname===u.pathname;
   }catch{return null;} // Verkkovirhe ei todista linkkiä rikkinäiseksi.
  })());
 }
 return cache.get(u.pathname);
}
async function inspect(a){
 const raw=a.getAttribute('href')||'';
 if(a.dataset.linkGuardHref===raw&&a.dataset.linkGuard==='done')return;
 a.dataset.linkGuardHref=raw;
 a.dataset.linkGuard='pending';
 const u=destination(a);
 if(!u){hide(a);a.dataset.linkGuard='done';return;}
 const ok=await valid(u);
 if(!a.isConnected||a.getAttribute('href')!==raw)return;
 if(ok===false)hide(a);
 a.dataset.linkGuard='done';
}
function scan(){root.querySelectorAll('.stay .buttons a').forEach(a=>{if(a.dataset.linkGuard!=='pending')inspect(a);});}
scan();
new MutationObserver(scan).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['href']});
})();