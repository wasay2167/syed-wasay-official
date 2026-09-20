const projects = window.WASAY_PROJECTS || [];
const grid = document.querySelector("#portfolioGrid");
const filters = document.querySelectorAll(".filters button");
const loadMore = document.querySelector("#loadMore");
let activeFilter = "all", showAll = false;

const label = type => type === "shopify" ? "Shopify" : type === "wordpress" ? "WordPress" : type === "custom" ? "Custom Web" : type;

function renderProjects(){
  const filtered = projects.filter(p => activeFilter === "all" || p[2] === activeFilter);
  const visible = showAll ? filtered : filtered.slice(0,8);
  grid.innerHTML = visible.map((p,i)=>`
    <a class="portfolio-item" href="${p[4] || '#'}" ${p[4] ? 'target="_blank"' : ''} rel="noopener" data-category="${p[2]}" style="animation-delay:${Math.min(i*45,300)}ms">
      <div class="project-media">
        <img src="${p[3]}" alt="${p[0]} website project" loading="lazy" onerror="this.parentElement.classList.add('no-image');this.remove()">
        <span class="project-type">${label(p[2])}</span>
      </div>
      <div class="project-body"><h3>${p[0]}</h3><p>${p[1]}</p><span class="project-link"><i class="fa-solid fa-arrow-up-right"></i></span></div>
    </a>`).join("");
  loadMore.style.display = filtered.length > 8 && !showAll ? "flex" : "none";
}
filters.forEach(btn=>btn.addEventListener("click",()=>{
  filters.forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  activeFilter=btn.dataset.filter; showAll=false; renderProjects();
}));
loadMore.addEventListener("click",()=>{showAll=true;renderProjects()});
renderProjects();

const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}})
},{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const menuToggle=document.querySelector(".menu-toggle"), nav=document.querySelector("#mainNav");
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",open)});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));

window.addEventListener("scroll",()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  document.querySelector("#progress").style.width=(scrollY/Math.max(h,1)*100)+"%";
},{passive:true});

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"},{passive:true});

document.querySelectorAll(".magnetic").forEach(el=>{
  el.addEventListener("pointermove",e=>{
    const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    el.style.transform=`translate(${x*.12}px,${y*.12}px)`;
  });
  el.addEventListener("pointerleave",()=>el.style.transform="");
});

const heroObject=document.querySelector("#heroObject");
window.addEventListener("pointermove",e=>{
  if(!heroObject || matchMedia("(max-width:720px)").matches) return;
  const x=(e.clientX/innerWidth-.5)*12, y=(e.clientY/innerHeight-.5)*-12;
  heroObject.style.transform=`rotateX(${y}deg) rotateY(${x}deg)`;
},{passive:true});

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener("click",e=>{
  const target=document.querySelector(a.getAttribute("href"));
  if(target){e.preventDefault();target.scrollIntoView({behavior:"smooth",block:"start"})}
}));

// Lightweight 3D particle scene — no WebGL dependency, GitHub Pages friendly.
const canvas=document.querySelector("#scene"), ctx=canvas.getContext("2d");
let particles=[], W,H;
function resize(){W=canvas.width=innerWidth*devicePixelRatio;H=canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.scale(devicePixelRatio,devicePixelRatio)}
function seed(){particles=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,z:.3+Math.random()*.9,r:.5+Math.random()*1.5,s:(Math.random()-.5)*.08}))}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const t=performance.now()/1000;
  particles.forEach(p=>{
    p.y-=p.s*p.z; if(p.y<0)p.y=innerHeight;
    const alpha=.08+.13*p.z, r=p.r*p.z;
    ctx.beginPath();ctx.arc(p.x+Math.sin(t*p.s+p.z)*7,p.y,r,0,Math.PI*2);
    ctx.fillStyle=`rgba(215,180,91,${alpha})`;ctx.fill();
  });
  requestAnimationFrame(draw);
}
addEventListener("resize",()=>{resize();seed()});resize();seed();draw();

document.querySelector("#year").textContent=new Date().getFullYear();

// FormSubmit: fill the return URL dynamically so the same code works on GitHub Pages/custom domains.
const form=document.querySelector(".contact-form");
if(form) form.querySelector('input[name="_next"]').value=location.href.split("#")[0]+"?sent=1#contact";
if(new URLSearchParams(location.search).get("sent")==="1"){
  const note=document.createElement("div");
  note.textContent="Thanks — your enquiry was sent successfully.";
  note.style.cssText="position:fixed;right:18px;bottom:18px;z-index:80;padding:14px 18px;border:1px solid rgba(134,211,154,.3);background:#111813;color:#bfe9c9;border-radius:12px;font-size:13px;box-shadow:0 15px 40px #0008";
  document.body.appendChild(note); setTimeout(()=>note.remove(),6000);
}
