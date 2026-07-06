/* Matkaile Suomessa v88 - tarkistettu julkaisuversio */

// v87: Varmistetaan, että kohdekortit avaavat aina oman sivunsa.
// Tämä estää tilanteen, jossa kortin sisäinen elementti tai selainvälimuisti
// jättää käyttäjän vanhaan ankkuriosoitteeseen kuten asikkala.html#ala-missaa.
(function(){
  document.addEventListener('click', function(e){
    const row = e.target.closest('a.place-row');
    if(!row) return;
    const href = row.getAttribute('href');
    if(!href || href === '#' || href.startsWith('#')) return;
    if(e.defaultPrevented) return;
    e.preventDefault();
    window.location.href = href;
  }, true);
})();


const q = (s)=>document.querySelector(s);
function go(url){ window.location.href=url; }
function saveTrip(){
  const name = q('#tripName')?.value || 'Uusi matka';
  localStorage.setItem('ms_last_trip', name);
  window.location.href = 'matka-paijat-hame.html';
}
function toggleVisited(el){
  el.classList.toggle('done');
}


// v30: etusivun taustakuva vaihtuu välillä, mutta etusivun rakenne pysyy samana.
(function rotateHomeHero(){
  const hero = document.querySelector('.home-hero.clean-home');
  if(!hero) return;
  const images = [
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1100&q=85',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1100&q=85',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1100&q=85',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=1100&q=85'
  ];
  const index = new Date().getDate() % images.length;
  hero.style.backgroundImage = `linear-gradient(180deg,rgba(7,32,28,.18) 0%,rgba(7,32,28,.10) 34%,rgba(7,32,28,.62) 100%), url('${images[index]}')`;
})();

// v52: Kohteen tallennuspainikkeet – kevyt testitoiminto ilman kirjautumista.
(function(){
  const labels = {
    visited: 'Merkitty käydyksi',
    memory: 'Tallennettu muistoksi',
    trip: 'Lisätty omaan matkaan',
    note: 'Muisto tallennettu'
  };
  function toast(text){
    let el = document.querySelector('.ms-toast');
    if(!el){ el = document.createElement('div'); el.className='ms-toast'; document.body.appendChild(el); }
    el.textContent = '✅ ' + text;
    el.classList.add('show');
    setTimeout(()=>el.classList.remove('show'), 1900);
  }
  document.addEventListener('click', function(e){
    const btn = e.target.closest('[data-save-action]');
    if(!btn) return;
    const action = btn.dataset.saveAction;
    const place = btn.dataset.place || 'Kohde';
    try{
      const key = 'matkaile_saved_' + action;
      const old = JSON.parse(localStorage.getItem(key) || '[]');
      if(!old.includes(place)) old.push(place);
      localStorage.setItem(key, JSON.stringify(old));
    }catch(err){}
    toast(labels[action] || 'Tallennettu');
  });
})();
