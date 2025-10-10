// Minimal interactions: mobile nav + small accessible enhancements
document.addEventListener('DOMContentLoaded', () => {
  function bindToggle(toggleId, navId){
    const t = document.getElementById(toggleId);
    const nav = document.getElementById(navId);
    if(!t || !nav) return;
    t.addEventListener('click', () => nav.classList.toggle('open'));
  }
  bindToggle('navToggle','nav');
  bindToggle('navToggle2','nav2');
  bindToggle('navToggle3','nav3');
  bindToggle('navToggle4','nav4');

  // Smooth internal link scrolling (if used)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el) el.scrollIntoView({behavior:'smooth'});
    });
  });

  // Small accessibility: close menus when clicking outside
  document.addEventListener('click', (e) => {
    const navs = document.querySelectorAll('.main-nav');
    navs.forEach(nav => {
      if(!nav.contains(e.target) && !e.target.classList.contains('nav-toggle')){
        nav.classList.remove('open');
      }
    });
  });
});
