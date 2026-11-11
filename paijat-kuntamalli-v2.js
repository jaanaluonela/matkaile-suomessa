/* Yhtenäistää kuntasivujen ylärakenteen Asikkalan mallin mukaiseksi.
   Säilyttää nykyiset kohteet, linkit, tallennukset ja arvioinnit. */
document.addEventListener('DOMContentLoaded',()=>{
 const slug=location.pathname.split('/').pop().replace(/\.html$/,'');
 if(!['asikkala','hartola','heinola','hollola','iitti','karkola','lahti','orimattila','padasjoki','sysma'].includes(slug))return;
 document.body.classList.add('ph-unified-town');
 const main=document.querySelector('#ms375-main')||document.querySelector('main');
 if(!main)return;
 const facts=main.querySelector('.ms375-facts,.hollola-facts,.ms-compact-facts,.facts,.ph-facts');
 const quick=main.querySelector('nav.ms375-quick,nav.hollola-quick,nav.iitti-quick,nav.quick,nav.ms-town-quick');
 const h1=main.querySelector('h1');
 const lead=main.querySelector('.ms375-lead,.hollola-lead,.iitti-lead,.ph-lead');
 if(h1)h1.closest('.ms375-town-top,.ph-town-top')?.classList.add('ph-unified-heading');
 if(facts)facts.classList.add('ph-unified-facts');
 if(quick)quick.classList.add('ph-unified-quick');
 if(lead)lead.classList.add('ph-unified-lead');
 // Siirretään perustiedot esittelyn jälkeen vain silloin kun ne ovat samassa sisältölohkossa.
 if(facts&&lead&&facts.parentElement===lead.parentElement&&(facts.compareDocumentPosition(lead) & Node.DOCUMENT_POSITION_FOLLOWING)){lead.after(facts)}
 // Vanhoja arviointeja ja käyntimerkintöjä ei korvata.
});
