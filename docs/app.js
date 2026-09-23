function titlePosterMarkup(w, cls="") { return `<div class="title-poster ${cls}"><span class="lang-zh">${w.title}</span><span class="lang-en">${w.en}</span><small>${w.year}</small></div>`; }
function imgMarkup(w, cls="") { if(!w.img) return titlePosterMarkup(w, cls); const altZh=w.coverAltZh||w.title; const altEn=w.coverAltEn||w.en; return `<img class="${cls}" loading="lazy" src="${w.img}" alt="${altZh}" data-alt-zh="${altZh}" data-alt-en="${altEn}">`; }
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
 bindImageFallbacks();
 if(document.querySelector('#timeline-list')) renderTimeline();
}
function renderWorks(items,grid){grid.innerHTML=items.map(w=>`<article class="work-card" data-cat="${(Array.isArray(w.cat)?w.cat:[w.cat]).join(' ')}"><div class="work-media" data-open-work="${data.indexOf(w)}">${imgMarkup(w)}</div><div class="work-body"><div class="work-year">${w.year}</div><div class="work-title"><span class="lang-zh">${w.title}</span><span class="lang-en">${w.en}</span></div><div class="work-en lang-en">${w.en}</div><div class="work-meta"><span class="lang-zh">${w.creator}<br>${w.director}</span><span class="lang-en">${(w.creator.split(' / ').pop()||w.creator)}<br>${(w.director.split(' / ').pop()||w.director)}</span></div><p class="work-desc lang-zh">${w.desc}</p><p class="work-desc lang-en">${w.endesc}</p></div><button class="work-link" data-open-work="${data.indexOf(w)}"><span class="lang-zh">打开作品档案 →</span><span class="lang-en">Open dossier →</span></button></article>`).join(''); grid.querySelectorAll('[data-open-work]').forEach(el=>el.addEventListener('click',()=>openWork(+el.dataset.openWork))); bindImageFallbacks(grid);}
function filterWorks(){let q=(document.querySelector('#search')?.value||'').toLowerCase();let active=document.querySelector('.filter.active')?.dataset.cat||'all';document.querySelectorAll('.work-card').forEach(c=>{let text=c.innerText.toLowerCase();let cats=(c.dataset.cat||'').split(/\s+/).filter(Boolean);c.style.display=(active==='all'||cats.includes(active))&&text.includes(q)?'flex':'none'})}
function hasCat(w,cat){return (Array.isArray(w.cat)?w.cat:[w.cat]).includes(cat)}
function setLang(en){document.body.classList.toggle('english',en);document.documentElement.lang=en?'en':'zh-CN';document.querySelectorAll('.lang-zh').forEach(e=>e.style.display=en?'none':'');document.querySelectorAll('.lang-en').forEach(e=>e.style.display=en?'':'none');document.querySelectorAll('[data-lang]').forEach(e=>e.textContent=en?'中文':'EN');document.querySelectorAll('img[data-alt-en]').forEach(e=>e.alt=en?(e.dataset.altEn||e.alt):e.dataset.altZh||e.getAttribute('alt'));const si=document.querySelector('#search');if(si)si.placeholder=en?(si.dataset.placeholderEn||'Search works'):(si.dataset.placeholderZh||'搜索作品');document.title=(en?(document.body.dataset.titleEn||document.title):document.body.dataset.titleZh)||document.title;localStorage.setItem('linArchiveLang',en?'en':'zh')}
function toggleLang(){setLang(!document.body.classList.contains('english'))}
function textEn(v){return (v||'').includes(' / ')?(v.split(' / ').pop()||v):v}
function imageFigureMarkup(m,w){const url=m.url||m.src||'';const altZh=m.altZh||m.alt||w.title;const altEn=m.altEn||m.alt||w.en;const capZh=m.captionZh||m.caption||'';const capEn=m.captionEn||m.caption||'';if(!url)return '';return `<figure><img loading="lazy" src="${url}" alt="${altZh}" data-alt-zh="${altZh}" data-alt-en="${altEn}"><figcaption><span class="lang-zh">${capZh}</span><span class="lang-en">${capEn}</span></figcaption></figure>`}
function mediaMarkup(w){
 const list=(w.media&&w.media.length)?w.media:[(w.img?{url:w.img,altZh:w.coverAltZh||w.title,altEn:w.coverAltEn||w.en,captionZh:w.coverCaptionZh||'',captionEn:w.coverCaptionEn||''}:null)].filter(Boolean);
 if(!list.length) return `<div class="media-empty"><span class="lang-zh">暂无已核实剧照/海报。档案不使用与作品无关的配图。</span><span class="lang-en">No verified production photo or poster is currently attached. The archive does not use unrelated images.</span></div>`;
 return `<div class="media-gallery">${list.map(m=>imageFigureMarkup(m,w)).join('')}</div>`;
}
function coverMarkup(w) {
  if (!w.img) {
    return `<div class="media-empty">
      <span class="lang-zh">暂无封面。</span>
      <span class="lang-en">No cover image.</span>
    </div>`;
  }
  const altZh = w.coverAltZh || w.title;
  const altEn = w.coverAltEn || w.en;
  return `
    <div class="media-gallery dossier-cover-gallery">
      <figure>
        <img
          loading="lazy"
          src="${w.img}"
          alt="${altZh}"
          data-alt-zh="${altZh}"
          data-alt-en="${altEn}"
        >
      </figure>
    </div>
  `;
}
function sourceMarkup(w){let items=w.sourceItems||((w.sources||[]).map(s=>({label:s,url:s})));if(!items.length)return '<p class="source-empty">—</p>';return `<ol class="dossier-sources">${items.map(s=>s.url?`<li><a href="${s.url}" target="_blank" rel="noopener">${s.label||s.url}</a></li>`:`<li>${s.label||'—'}</li>`).join('')}</ol>`}
function field(labelZh,labelEn,valueZh,valueEn){return `<div class="dossier-field"><div class="dossier-label"><span class="lang-zh">${labelZh}</span><span class="lang-en">${labelEn}</span></div><div class="dossier-value"><span class="lang-zh">${valueZh||'—'}</span><span class="lang-en">${valueEn||textEn(valueZh)||'—'}</span></div></div>`}
function escapeHtml(v){return String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function timelineEntriesForWork(title){return (window.TIMELINE||[]).filter(e=>(e.works||[]).some(x=>x.canonical===title));}
function timelineTextMarkup(e){
  let text=escapeHtml(e.text);
  (e.works||[]).forEach(ref=>{
    const source=escapeHtml(ref.source);
    const link=`<button type="button" class="timeline-work" data-open-work-title="${escapeHtml(ref.canonical)}">《${source}》</button>`;
    const br=new RegExp('《'+source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'》');
    if(br.test(text)){ text=text.replace(br,link); }
    else {
      const plain=new RegExp('(?<![\\u4e00-\\u9fff])'+source.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\u4e00-\\u9fff])');
      if(plain.test(text)) text=text.replace(plain,link.replace('《'+source+'》',source));
    }
  });
  return text;
}
function renderTimeline(){
  const box=document.querySelector('#timeline-list'); if(!box)return;
  const list=window.TIMELINE||[];
  let current='';
  box.innerHTML=list.map(e=>{
    const head=e.year!==current?`<div class="timeline-year"><span>${escapeHtml(e.year)}</span></div>`:'';
    current=e.year;
    return `${head}<article class="archive-tl-item"><div class="archive-tl-date">${escapeHtml(e.date||'')}</div><div class="archive-tl-dot"></div><div class="archive-tl-body"><p>${timelineTextMarkup(e)}</p><div class="archive-tl-source"><span class="lang-zh">《导演小人书》附录·林兆华戏剧年表，第 ${e.line} 行</span><span class="lang-en">Director’s Memoir appendix · Lin Zhaohua chronology, line ${e.line}</span></div></div></article>`;
  }).join('');
  box.querySelectorAll('.timeline-work').forEach(b=>b.addEventListener('click',()=>{
    const title=b.dataset.openWorkTitle; const i=data.findIndex(w=>w.title===title);
    if(i>=0) openWork(i);
  }));
  setLang(document.body.classList.contains('english'));
}
function dossierTimelineMarkup(w){
  const list=timelineEntriesForWork(w.title);
  if(!list.length)return '';
  return `<section class="dossier-timeline"><h3><span class="lang-zh">年表记录</span><span class="lang-en">Chronology records</span></h3><div class="dossier-timeline-list">${list.map(e=>`<div class="dossier-timeline-item"><div class="archive-tl-date">${escapeHtml(e.year)}${e.date?` · ${escapeHtml(e.date)}`:''}</div><p>${timelineTextMarkup(e)}</p><small><span class="lang-zh">来源：导演小人书年表</span><span class="lang-en">Source: Director’s Memoir chronology</span></small></div>`).join('')}</div></section>`;
}
function openWork(i){const w=data[i];const lang=document.documentElement.lang==='en'?'en':'zh';const cats=(Array.isArray(w.cat)?w.cat:[w.cat]).filter(Boolean).filter(x=>x!=='drama').map(x=>(window.CAT_LABELS&&window.CAT_LABELS[x]&&window.CAT_LABELS[x][lang])||x);document.querySelector('#modal-content').innerHTML=`<div class="dossier-head"><div>${coverMarkup(w)}</div><div><div class="work-year">${w.year}${cats.length?' · '+cats.join(' / '):''}</div><h2 class="serif dossier-title"><span class="lang-zh">${w.title}</span><span class="lang-en">${w.en}</span></h2><div class="dossier-lead"><span class="lang-zh">${w.desc||''}</span><span class="lang-en">${w.endesc||''}</span></div></div></div>
 <div class="dossier-grid">
 ${field('剧本 / 原作','Play / Original',w.creator,w.creator)}${field('导演','Director',w.director,w.director)}${field('演出机构','Venue / Company',w.venue,w.venue)}${field('首演 / 时间','Premiere / Date',w.premiere,w.premiere)}${field('主要演员','Cast',w.cast,w.cast)}${field('舞美 / 设计','Design',w.design,w.design)}${field('音乐','Music',w.music,w.music)}${field('改编 / 编剧','Adaptation / Playwright',w.playwright,w.playwright)}
 </div>
 <div class="dossier-sections">
 <section><h3><span class="lang-zh">剧情</span><span class="lang-en">Synopsis</span></h3><p class="lang-zh">${w.synopsis||'—'}</p><p class="lang-en">${w.synopsis_en||'—'}</p></section>
 <section><h3><span class="lang-zh">创作背景</span><span class="lang-en">Creative context</span></h3><p class="lang-zh">${w.background||'—'}</p><p class="lang-en">${w.bg_en||w.background||'—'}</p></section>
 <section><h3><span class="lang-zh">海外演出</span><span class="lang-en">International performances</span></h3><p class="lang-zh">${w.overseas||'—'}</p><p class="lang-en">${w.overseas||'—'}</p></section>
 <section><h3><span class="lang-zh">复排 / 版本</span><span class="lang-en">Revival / Versions</span></h3><p class="lang-zh">${w.revivals||'—'}</p><p class="lang-en">${w.revivals||'—'}</p></section>
 <section><h3><span class="lang-zh">当年评论 / 反响</span><span class="lang-en">Contemporary reception</span></h3><p class="lang-zh">${w.reviews||'—'}</p><p class="lang-en">${w.reviews||'—'}</p></section>
 ${dossierTimelineMarkup(w)}
 <section class="dossier-media"><h3><span class="lang-zh">剧照 / 海报</span><span class="lang-en">Production photos / posters</span></h3>${mediaMarkup(w)}</section>
 <div class="dossier-note"><b><span class="lang-zh">档案说明</span><span class="lang-en">Archive note</span></b><span class="lang-zh">${w.evidenceNote||''}</span><span class="lang-en">${w.evidenceNote_en||w.evidenceNote||''}</span></div>
 <div class="note"><b><span class="lang-zh">可靠来源 / 继续核查</span><span class="lang-en">Sources / Further verification</span></b>${sourceMarkup(w)}</div></div>`;
 document.querySelector('#modal').classList.add('open');
 bindImageFallbacks(document.querySelector('#modal-content')); bindImageLightbox(document.querySelector('#modal-content')); setLang(document.body.classList.contains('english'));
}
function bindImageFallbacks(scope=document){scope.querySelectorAll('img[data-alt-zh]').forEach(img=>{if(img.dataset.fallbackBound)return;img.dataset.fallbackBound='1';img.addEventListener('error',()=>{const w=data.find(x=>x.title===img.closest('.work-card')?.querySelector('.lang-zh')?.textContent?.trim());if(w&&img.closest('.work-media')){img.replaceWith(document.createRange().createContextualFragment(titlePosterMarkup(w)));}else{const fig=img.closest('figure');if(fig)fig.remove();const gallery=img.closest('.media-gallery');if(gallery&&!gallery.querySelector('figure'))gallery.innerHTML='<div class="media-empty"><span class="lang-zh">图片暂无法显示。</span><span class="lang-en">Image unavailable.</span></div>';}})})}
function ensureLightbox(){if(document.querySelector('#image-lightbox'))return;document.body.insertAdjacentHTML('beforeend',`<div id="image-lightbox" class="image-lightbox" aria-hidden="true"><button class="image-lightbox-close" type="button" aria-label="Close image">×</button><div class="image-lightbox-inner"><img id="image-lightbox-img" src="" alt=""><div id="image-lightbox-caption" class="image-lightbox-caption"></div></div></div>`);const lb=document.querySelector('#image-lightbox');lb.addEventListener('click',e=>{if(e.target===lb||e.target.classList.contains('image-lightbox-inner'))closeLightbox()});lb.querySelector('.image-lightbox-close').addEventListener('click',closeLightbox);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()})}
function openLightbox(img){ensureLightbox();const lb=document.querySelector('#image-lightbox');const big=document.querySelector('#image-lightbox-img');const cap=document.querySelector('#image-lightbox-caption');big.src=img.currentSrc||img.src;big.alt=img.alt||'';cap.textContent=img.closest('figure')?.querySelector('figcaption')?.innerText?.trim()||'';lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.classList.add('lightbox-open')}
function closeLightbox(){const lb=document.querySelector('#image-lightbox');if(!lb)return;lb.classList.remove('open');lb.setAttribute('aria-hidden','true');document.body.classList.remove('lightbox-open');setTimeout(()=>{if(!lb.classList.contains('open'))document.querySelector('#image-lightbox-img').src=''},180)}
function bindImageLightbox(scope=document){ensureLightbox();scope.querySelectorAll('.media-gallery figure img').forEach(img=>{if(img.dataset.lightboxBound)return;img.dataset.lightboxBound='1';img.setAttribute('title',document.documentElement.lang==='en'?'Click to view full image':'点击查看原图');img.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();openLightbox(img)})})}
document.addEventListener('DOMContentLoaded',()=>{init();ensureLightbox();document.querySelector('#close-modal')?.addEventListener('click',()=>document.querySelector('#modal').classList.remove('open'));document.querySelector('#modal')?.addEventListener('click',e=>{if(e.target.id==='modal')e.currentTarget.classList.remove('open')});bindImageLightbox();});
