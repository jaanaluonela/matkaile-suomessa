(() => {
 const button=document.getElementById('locate'),status=document.getElementById('status'),results=document.getElementById('nearby');
 button.addEventListener('click',()=>{
  if(!navigator.geolocation){status.textContent='Selaimesi ei tue sijaintihakua. Valitse paikkakunta alta.';return;}
  button.disabled=true;status.textContent='Haetaan sijaintiasi…';results.hidden=true;
  navigator.geolocation.getCurrentPosition(position=>{
   const {latitude,longitude}=position.coords;
   results.querySelectorAll('[data-query]').forEach(a=>{a.href='https://www.google.com/maps/search/'+encodeURIComponent(a.dataset.query)+'/@'+latitude+','+longitude+',12z';});
   results.hidden=false;button.disabled=false;status.textContent='Sijainti löytyi. Valitse kohderyhmä alta.';
  },error=>{button.disabled=false;status.textContent=error.code===1?'Sijaintilupaa ei annettu. Voit sallia sijainnin selaimen asetuksista tai valita paikkakunnan alta.':'Sijaintia ei saatu. Yritä uudelleen tai valitse paikkakunta alta.';},{enableHighAccuracy:false,timeout:15000,maximumAge:60000});
 });
})();
