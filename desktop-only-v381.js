/* Matkaile Suomessa v381: desktop only. Mobile is never modified. */
(() => {
 const isDesktop = () => window.matchMedia('(min-width: 1051px)').matches;
 if (!isDesktop()) return;
 const start = () => {
   if (!isDesktop()) return;
   const main = document.querySelector('main');
   if (!main || document.getElementById('ms381-desktop')) return;
   const section = document.createElement('div');
   section.id = 'ms381-desktop';
   section.innerHTML = `
<section class="ms381-hero"><div class="ms381-hero-inner"><h1>Matkaile Suomessa</h1><p class="ms381-motto">Vapaus kulkea · Ilo löytää</p><p>Löydä kiinnostavimmat paikat, pysähdykset ja elämykset kotimaan matkoillesi.</p></div></section>
<nav class="ms381-quick" aria-label="Aloita tästä"><a href="maakunnat.html"><span>🗺️</span><strong>Paikkakunnat</strong><small>Tutustu Suomen paikkakuntiin</small></a><a href="leirintaalueet.html"><span>🚐</span><strong>Leirintäalueet</strong><small>Yövy ja löydä palvelut</small></a><a href="matkaparkit.html"><span>🅿️</span><strong>Matkaparkit</strong><small>Matkailuauton pysähdykset</small></a><a href="pysahdy-matkalla.html"><span>📍</span><strong>Pysähdy matkalla</strong><small>Nähtävyydet ja taukopaikat</small></a></nav>
<section class="ms381-search"><div><h2>Pysähdy matkalla</h2><p>Löydä nähtävyydet, luontokohteet, kahvilat ja kiinnostavat taukopaikat.</p></div><form action="pysahdy-matkalla.html" method="get"><label for="ms381-q">Hae kohdetta</label><div><input id="ms381-q" name="q" type="search" placeholder="Esimerkiksi Vääksy, Fiskars tai kahvila"><button type="submit">Hae kohteita →</button></div></form></section>
<nav class="ms381-more" aria-label="Lisää matkailun työkaluja"><a href="reittisuunnittelu.html">🧭 <strong>Suunnittele reitti</strong></a><a href="paivakirja.html">📖 <strong>Omat matkat</strong></a><a href="karavaanarin-vinkit.html">🚐 <strong>Karavaanarin vinkit</strong></a></nav>
<section class="ms381-popular"><div class="ms381-popular-head"><h2>Löydä uusia kohteita</h2><a href="maakunnat.html">Kaikki paikkakunnat →</a></div><div class="ms381-cards"><a href="savonlinna.html"><img src="hero-etusivu.jpg" alt="Suomen järvimaisemia"><strong>Savonlinna</strong><small>Linnakaupunki Saimaan rannalla</small></a><a href="saariston-rengastie.html"><img src="etusivu-kuva-ferry-v346.webp" alt="Saaristo"><strong>Saariston rengastie</strong><small>Tutustu saaristoon</small></a><a href="raasepori.html"><img src="etusivu-kuva-stops-v346.webp" alt="Matkakohde"><strong>Fiskars</strong><small>Historiallinen ruukkikylä</small></a><a href="lieksa.html"><img src="etusivu-kuva-memories-v346.webp" alt="Luonto"><strong>Koli</strong><small>Kansallismaisemat</small></a></div></section>`;
   main.replaceChildren(section);
   document.body.classList.add('ms381-desktop-on');
   window.addEventListener('resize', () => { if (!isDesktop()) location.reload(); }, {passive:true});
 };
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start,{once:true}); else start();
})();
