function imgMarkup(w, cls="") { if(!w.img) return `<div class="title-poster ${cls}"><span class="lang-zh">${w.title}</span><span class="lang-en">${w.en}</span><small>${w.year}</small></div>`; const src=w.img.startsWith("http")?w.img:w.img; const altZh=w.coverAltZh||w.title; const altEn=w.coverAltEn||w.en; return `<img class="${cls}" loading="lazy" src="${src}" alt="${altZh}" data-alt-zh="${altZh}" data-alt-en="${altEn}">`; }
let data=[];
async function init(){
 data=window.WORKS||[];
 const grid=document.querySelector('#works-grid'); if(grid) renderWorks(document.body.classList.contains('studio-page')?data.filter(x=>hasCat(x,'studio')):data,grid);
 const search=document.querySelector('#search'); if(search) search.addEventListener('input',()=>filterWorks());
 document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filterWorks()}));
 const searchInput=document.querySelector('#search'); if(searchInput){searchInput.dataset.placeholderZh=searchInput.dataset.placeholderZh||searchInput.placeholder; searchInput.dataset.placeholderEn=searchInput.dataset.placeholderEn||'Search works';}
 document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',toggleLang));
 document.querySelectorAll('.menu').forEach(b=>b.addEventListener('click',()=>document.querySelector('.mobile-nav').classList.toggle('open')));
 const saved=localStorage.getItem('linArchiveLang'); if(saved==='en') setLang(true);
}
function renderWorks(items,grid){grid.innerHTML=items.map((w,i)=>`<article class="work-card" data-cat="${(Array.isArray(w.cat)?w.cat:[w.cat]).join(' ')}"><div class="work-media">${imgMarkup(w)}</div><div class="work-body"><div class="work-year">${w.year}</div><div class="work-title"><span class="lang-zh">${w.title}</span><span class="lang-en">${w.en}</span></div><div class="work-en lang-en">${w.en}</div><div class="work-meta"><span class="lang-zh">${w.creator}<br>${w.director}</span><span class="lang-en">${(w.creator.split(' / ').pop()||w.creator)}<br>${(w.director.split(' / ').pop()||w.director)}</span></div><p class="work-desc lang-zh">${w.desc}</p><p class="work-desc lang-en">${w.endesc}</p></div><button class="work-link" data-open-work="${data.indexOf(w)}"><span class="lang-zh">打开作品档案 →</span><span class="lang-en">Open dossier →</span></button></article>`).join(''); grid.querySelectorAll('[data-open-work]').forEach(el=>el.addEventListener('click',()=>openWork(+el.dataset.openWork)))}
function filterWorks(){let q=(document.querySelector('#search')?.value||'').toLowerCase();let active=document.querySelector('.filter.active')?.dataset.cat||'all';document.querySelectorAll('.work-card').forEach(c=>{let text=c.innerText.toLowerCase();let cats=(c.dataset.cat||'').split(/\s+/).filter(Boolean);c.style.display=(active==='all'||cats.includes(active))&&text.includes(q)?'flex':'none'})}
function hasCat(w,cat){return (Array.isArray(w.cat)?w.cat:[w.cat]).includes(cat)}
function setLang(en){document.body.classList.toggle('english',en);document.documentElement.lang=en?'en':'zh-CN';document.querySelectorAll('.lang-zh').forEach(e=>e.style.display=en?'none':'');document.querySelectorAll('.lang-en').forEach(e=>e.style.display=en?'':'none');document.querySelectorAll('[data-lang]').forEach(e=>e.textContent=en?'中文':'EN');document.querySelectorAll('img[data-alt-en]').forEach(e=>e.alt=en?(e.dataset.altEn||e.alt):e.dataset.altZh||e.getAttribute('alt'));const si=document.querySelector('#search');if(si)si.placeholder=en?(si.dataset.placeholderEn||'Search works'):(si.dataset.placeholderZh||'搜索作品');document.title=(en?(document.body.dataset.titleEn||document.title):document.body.dataset.titleZh)||document.title;localStorage.setItem('linArchiveLang',en?'en':'zh')}
function toggleLang(){setLang(!document.body.classList.contains('english'))}
function textEn(v){return (v||'').includes(' / ')?(v.split(' / ').pop()||v):v}
function mediaMarkup(w){
 if(!w.media||!w.media.length) return `<div class="media-empty"><span class="lang-zh">暂无已核实剧照/海报。档案不使用与作品无关的配图。</span><span class="lang-en">No verified production photo or poster is currently attached. The archive does not use unrelated images.</span></div>`;
 return `<div class="media-gallery">${w.media.map(m=>`<figure><img loading="lazy" src="${m.url}" alt="${m.altZh||w.title}" data-alt-en="${m.altEn||m.altZh||w.en}"><figcaption><span class="lang-zh">${m.captionZh||m.caption||''}</span><span class="lang-en">${m.captionEn||m.caption||''}</span></figcaption></figure>`).join('')}</div>`;
}
function sourceMarkup(w){
 const items=(w.sourceItems&&w.sourceItems.length?w.sourceItems:((w.sources||[]).map(u=>({label:u,url:u}))));
 return `<ol class="dossier-sources">${items.map(s=>`<li><a href="${s.url}" target="_blank" rel="noopener">${s.label||s.url}</a></li>`).join('')}</ol>`;
}
function field(labelZh,labelEn,valueZh,valueEn){return `<div class="dossier-field"><div class="dossier-label"><span class="lang-zh">${labelZh}</span><span class="lang-en">${labelEn}</span></div><div class="dossier-value"><span class="lang-zh">${valueZh||'—'}</span><span class="lang-en">${valueEn||textEn(valueZh)||'—'}</span></div></div>`}
function openWork(i){
 let w=data[i],m=document.querySelector('#modal');
 document.querySelector('#modal-content').innerHTML=`<div class="dossier-head"><div>${mediaMarkup(w)}</div><div><div class="work-year">${w.year} · ${(Array.isArray(w.cat)?w.cat:[w.cat]).filter(x=>!['drama'].includes(x)).join(' / ')}</div><h2 class="serif dossier-title"><span class="lang-zh">${w.title}</span><span class="lang-en">${w.en}</span></h2><div class="dossier-lead"><span class="lang-zh">${w.desc||''}</span><span class="lang-en">${w.endesc||''}</span></div></div></div>
 <div class="dossier-grid">
 ${field('首演年份','Premiere',w.premiere,textEn(w.premiere))}
 ${field('剧本作者 / 原作','Playwright / Source',w.playwright,textEn(w.playwright))}
 ${field('导演','Director',w.director,textEn(w.director))}
 ${field('剧院 / 演出机构','Theatre / Company',w.theatre,textEn(w.theatre))}
 ${field('主要演员','Principal cast',w.cast,textEn(w.cast))}
 ${field('舞美 / 空间','Scenography / Space',w.design,textEn(w.design))}
 ${field('音乐 / 声音','Music / Sound',w.music,textEn(w.music))}
 </div>
 <div class="dossier-sections">
 <section><h3><span class="lang-zh">剧情</span><span class="lang-en">Synopsis</span></h3><p class="lang-zh">${w.synopsis}</p><p class="lang-en">${w.synopsis_en}</p></section>
 <section><h3><span class="lang-zh">创作背景</span><span class="lang-en">Creative context</span></h3><p class="lang-zh">${w.background}</p><p class="lang-en">${w.bg_en}</p></section>
 <section><h3><span class="lang-zh">海外演出</span><span class="lang-en">International performances</span></h3><p class="lang-zh">${w.overseas}</p><p class="lang-en">${w.overseas}</p></section>
 <section><h3><span class="lang-zh">复排 / 版本</span><span class="lang-en">Revival / Versions</span></h3><p class="lang-zh">${w.revivals}</p><p class="lang-en">${w.revivals}</p></section>
 <section><h3><span class="lang-zh">当年评论 / 反响</span><span class="lang-en">Contemporary reception</span></h3><p class="lang-zh">${w.reviews}</p><p class="lang-en">${w.reviews}</p></section>
 </div>
 <section class="dossier-media"><h3><span class="lang-zh">剧照 / 海报</span><span class="lang-en">Production photos / posters</span></h3>${mediaMarkup(w)}</section>
 <div class="dossier-note"><b><span class="lang-zh">档案说明</span><span class="lang-en">Archive note</span></b><span class="lang-zh">${w.evidenceNote}</span><span class="lang-en">${w.evidenceNote_en||w.evidenceNote}</span></div>
 <div class="note"><b><span class="lang-zh">可靠来源 / 继续核查</span><span class="lang-en">Sources / Further verification</span></b>${sourceMarkup(w)}</div></div>`;
 m.classList.add('open');setLang(document.body.classList.contains('english'));
}
document.addEventListener('DOMContentLoaded',init);document.addEventListener('click',e=>{if(e.target.id==='modal'||e.target.id==='close-modal')document.querySelector('#modal').classList.remove('open')});
