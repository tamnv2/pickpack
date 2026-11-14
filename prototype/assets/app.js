/* PickPack UI review only: zero backend, zero real authentication and zero network. */
(() => {
  'use strict';
  const designs = [
    {id:1,name:'Điều hành',desc:'Sidebar tác nghiệp, bảng số liệu rõ ràng',shape:'side',tint:'blue',note:'Tập trung thao tác nhanh'},
    {id:2,name:'Không gian mở',desc:'Thanh điều hướng ngang, thoáng và tối giản',shape:'top',tint:'cyan',note:'Ưu tiên nội dung rộng'},
    {id:3,name:'Trung tâm kiểm soát',desc:'Bảng vận hành đậm nét, mật độ dữ liệu cao',shape:'compact',tint:'green',note:'Giám sát cùng lúc nhiều chỉ số'},
    {id:4,name:'Thẻ nghiệp vụ',desc:'Bố cục bo mềm, chú trọng theo dõi danh mục',shape:'rail',tint:'orange',note:'Dễ học, dễ thao tác'},
    {id:5,name:'Command Studio',desc:'Thanh công cụ nổi, chia vùng điều khiển',shape:'studio',tint:'purple',note:'Ưu tiên linh hoạt nhiều cửa sổ'}
  ];
  const modules = [
    {id:'overview',name:'Tổng quan',ico:'◫',detail:'Tình hình vận hành mẫu'},
    {id:'people',name:'Nhân sự',ico:'♙',detail:'Danh sách và hồ sơ'},
    {id:'shifts',name:'Ra/vào ca',ico:'◷',detail:'Lịch sử quét theo ca'},
    {id:'labor',name:'Công nhật',ico:'▦',detail:'Theo dõi công theo ngày'},
    {id:'minutes',name:'Biên bản',ico:'▤',detail:'Biên bản nghiệp vụ'},
    {id:'assets',name:'CCDC',ico:'▣',detail:'Tài sản và công cụ'},
    {id:'pda',name:'Mượn/trả PDA',ico:'▥',detail:'Theo dõi thiết bị mẫu'}
  ];
  const params = new URLSearchParams(location.search);
  const validId = n => Math.max(1, Math.min(5, Number.parseInt(n,10) || 1));
  const designId = validId(params.get('design'));
  const mode = params.get('mode') === 'dark' ? 'dark' : 'light';
  const moduleId = modules.some(m=>m.id===params.get('page')) ? params.get('page') : 'overview';
  const root = document.getElementById('root');
  const html = t => String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const url = (page,design=designId,theme=mode) => `app.html?design=${design}&mode=${theme}&page=${encodeURIComponent(page)}`;
  const active = modules.find(m=>m.id===moduleId);
  function gallery(){
    document.documentElement.dataset.mode='light';
    root.innerHTML = `<div class="gallery"><div class="gallery-top"><div class="brand-line"><span class="logo">P<span>·</span></span><div><strong>PickPack 1291</strong><small>UI DESIGN REVIEW / 0.2</small></div></div><span class="demo-chip">DEMO · Không có dữ liệu thật</span></div>
      <div class="gallery-intro"><span class="section-kicker">THƯ VIỆN GIAO DIỆN</span><h1>5 phương án, một hệ thống.</h1><p>Chọn phong cách và chế độ sáng/tối để mở giao diện vận hành thực tế ở <b>tab trình duyệt mới</b>. Các mẫu dùng chung 7 mục, chỉ khác cách bố trí, mật độ và ngôn ngữ hình ảnh.</p></div>
      <div class="design-grid">${designs.map(d=>`<article class="design-card"><div class="design-mini mini-${d.id}" aria-hidden="true"><div class="mini-frame"><span class="mini-nav"></span><div class="mini-main"><span class="mini-header"></span><div class="mini-tiles"><i></i><i></i><i></i></div><div class="mini-content"><i></i><i></i></div></div></div></div><div class="design-text"><span class="design-count">MẪU ${String(d.id).padStart(2,'0')}</span><h2>${d.name}</h2><p>${d.desc}</p><span class="design-note">${d.note}</span><div class="design-links"><a class="cta" href="${url('overview',d.id,'light')}" target="_blank" rel="noopener">Xem sáng <span aria-hidden="true">↗</span></a><a class="outline" href="${url('overview',d.id,'dark')}" target="_blank" rel="noopener">Xem tối <span aria-hidden="true">↗</span></a></div></div></article>`).join('')}</div>
      <footer class="gallery-foot">Bản review UI: mở trực tiếp offline hoặc từ thư mục build. Chưa có login thực, phân quyền, cơ sở dữ liệu, API, Worker và realtime.</footer></div>`;
  }
  const rowData = {
    people:[['NV-DEMO-001','Nhân sự mẫu A','Ca 1','Đang làm việc'],['NV-DEMO-002','Nhân sự mẫu B','Ca 2','Đang làm việc'],['NV-DEMO-003','Nhân sự mẫu C','Ca 1','Tạm nghỉ'],['NV-DEMO-004','Nhân sự mẫu D','Ca 2','Đang làm việc']],
    shifts:[['CA-001','Quét vào ca','08:00','Hoàn tất'],['CA-002','Quét vào ca','08:02','Hoàn tất'],['CA-003','Quét ra ca','17:05','Chờ rà soát'],['CA-004','Quét vào ca','18:00','Hoàn tất']],
    labor:[['CN-001','Công mẫu A','08:00 – 17:00','Đã ghi nhận'],['CN-002','Công mẫu B','08:00 – 17:00','Đã ghi nhận'],['CN-003','Công mẫu C','18:00 – 22:00','Đang rà soát'],['CN-004','Công mẫu D','08:00 – 12:00','Đã ghi nhận']],
    minutes:[['BB-001','Ghi nhận sự việc mẫu','14/11/2026','Nháp'],['BB-002','Biên bản bàn giao mẫu','13/11/2026','Đã lập'],['BB-003','Biên bản CCDC mẫu','12/11/2026','Đã lập']],
    assets:[['CCDC-001','Máy quét cầm tay','Khu vực A','Sẵn sàng'],['CCDC-002','Bộ sạc dự phòng','Khu vực B','Đang sử dụng'],['CCDC-003','Đồng phục mẫu','Kho cấp phát','Sẵn sàng']],
    pda:[['PDA-MOCK-01','Thiết bị mẫu 01','Người mượn giả A','Đang mượn'],['PDA-MOCK-02','Thiết bị mẫu 02','Chưa cấp phát','Sẵn sàng'],['PDA-MOCK-03','Thiết bị mẫu 03','Người mượn giả B','Đang mượn']]
  };
  const fields = {
    people:['Mã nhân sự','Họ tên (giả)','Phân ca','Trạng thái'],shifts:['Mã lượt','Sự kiện','Thời gian','Trạng thái'],
    labor:['Mã công','Người thực hiện','Khung giờ','Trạng thái'],minutes:['Mã biên bản','Tiêu đề','Ngày tạo','Trạng thái'],
    assets:['Mã CCDC','Tên dụng cụ','Vị trí','Trạng thái'],pda:['Mã PDA','Tên thiết bị','Liên kết (giả)','Trạng thái']
  };
  const colorsForStatus = s => /sẵn sàng|hoàn tất|đã lập|đã ghi|đang làm/i.test(s) ? 'ok' : /chờ|rà soát|tạm nghỉ|nháp/i.test(s) ? 'warn' : 'info';
  const nav = () => modules.map(m=>{
    const selected=m.id===moduleId?' current':'';
    const href=url(m.id);
    return `<div class="nav-item${selected}"><a class="nav-main" href="${href}" title="${m.name}"><span class="nav-icon">${m.ico}</span><span class="nav-text">${m.name}</span></a><a class="newtab" href="${href}" target="_blank" rel="noopener" title="Mở ${m.name} trong tab mới" aria-label="Mở ${m.name} trong tab mới">↗</a></div>`
  }).join('');
  function overview(){
    const kpis=[['Nhân sự trong ca','24','người','↗'],['Đã quét vào ca','21','lượt','◷'],['Thiết bị đang mượn','02','PDA','▥'],['Biên bản cần xem','03','mục','▤']];
    return `<div class="metric-grid">${kpis.map((k,i)=>`<article class="metric card"><div class="metric-label">${k[0]}<span class="metric-icon">${k[3]}</span></div><div class="metric-number">${k[1]} <small>${k[2]}</small></div><div class="metric-strap">Số liệu minh họa · Không realtime</div></article>`).join('')}</div>
    <div class="mid-grid"><section class="card chart-card"><div class="card-heading"><div><h2>Nhịp độ vận hành</h2><p>Minh họa theo khung giờ</p></div><span class="tag">DEMO DATA</span></div><div class="chart-visual">${[34,56,44,71,84,68,93,61,79,48].map((v,i)=>`<div class="chart-col"><div class="chart-bar" style="height:${v}%"></div><span>${7+i}h</span></div>`).join('')}</div></section>
    <section class="card"><div class="card-heading"><div><h2>Hoạt động gần đây</h2><p>Nhật ký hiển thị giả lập</p></div></div><div class="event-list">${[['08:02','Quét vào ca được ghi nhận','Hoàn tất'],['08:12','Bàn giao PDA mẫu 01','Đang mượn'],['08:30','Biên bản mẫu đã tạo','Nháp'],['09:10','Công nhật đang rà soát','Chờ rà soát']].map(e=>`<div class="event-row"><span class="event-dot"></span><div><strong>${e[1]}</strong><small>${e[2]}</small></div><time>${e[0]}</time></div>`).join('')}</div></section></div>
    <div class="section-label">Truy cập nhanh · Mở độc lập trong tab mới</div><div class="shortcut-grid">${modules.filter(m=>m.id!=='overview').map(m=>`<a class="shortcut card" href="${url(m.id)}" target="_blank" rel="noopener"><span class="shortcut-icon">${m.ico}</span><div><strong>${m.name}</strong><small>${m.detail}</small></div><span class="shortcut-go">↗</span></a>`).join('')}</div>`;
  }
  function rows(page){return (rowData[page] || []).map(row=>[...row]);}
  let currentRows=rows(moduleId);
  let filter='all';
  function table(){
    const q=(document.querySelector('#query')?.value || '').toLocaleLowerCase('vi');
    const data=currentRows.filter(row=>row.join(' ').toLocaleLowerCase('vi').includes(q) && (filter==='all'||colorsForStatus(row[3])===filter));
    const tableNode=document.getElementById('table-zone');
    tableNode.innerHTML=`<div class="table-scroll"><table><thead><tr>${fields[moduleId].map(f=>`<th>${f}</th>`).join('')}<th>Chi tiết</th></tr></thead><tbody>${data.length?data.map((r,i)=>`<tr>${r.map((v,j)=>`<td>${j===3?`<span class="status ${colorsForStatus(v)}">${html(v)}</span>`:html(v)}</td>`).join('')}<td><a class="detail" href="${url(moduleId)}&record=${encodeURIComponent(r[0])}" target="_blank" rel="noopener" title="Xem riêng bản ghi ${html(r[0])}">Mở tab ↗</a></td></tr>`).join(''):`<tr><td colspan="5" class="empty">Không có bản ghi mẫu phù hợp.</td></tr>`}</tbody></table></div><div class="table-foot"><span>${data.length} / ${currentRows.length} dòng minh họa</span><span>Không có dữ liệu thật</span></div>`;
  }
  function modulePage(){return `<section class="card list-card"><div class="toolbar"><label class="search"><span>⌕</span><input id="query" type="search" placeholder="Tìm trong dữ liệu mẫu..." autocomplete="off"></label><select id="status-filter" aria-label="Lọc trạng thái"><option value="all">Tất cả trạng thái</option><option value="ok">Hoàn tất / Sẵn sàng</option><option value="info">Đang sử dụng</option><option value="warn">Chờ xử lý / Nháp</option></select><button id="add-record" class="btn primary">+ Thêm mẫu</button></div><div id="table-zone"></div></section>`;}
  function detailPanel(){const id=params.get('record');if(!id||moduleId==='overview')return '';
    const r=currentRows.find(row=>row[0]===id);
    if(!r)return `<div class="detail-banner">Không tìm thấy mã minh họa <b>${html(id)}</b> trong dữ liệu trang. Bản ghi thêm cục bộ ở tab khác không được chia sẻ.</div>`;
    return `<div class="detail-banner"><strong>Chi tiết bản ghi giả: ${html(r[0])}</strong><span>${r.map(x=>html(x)).join('　·　')}</span><button id="close-detail" class="btn ghost">Đóng chi tiết</button></div>`;
  }
  function renderApp(){
    const design=designs.find(d=>d.id===designId);
    document.documentElement.dataset.design=String(designId);
    document.documentElement.dataset.mode=mode;
    document.title=`${active.name} · ${design.name} · PickPack 1291`;
    root.innerHTML=`<div class="app-shell"><aside class="sidebar"><a class="brand" href="index.html" title="Chọn mẫu khác"><span class="logo">P<span>·</span></span><span><strong>PickPack 1291</strong><small>VẬN HÀNH / DEMO</small></span></a><div class="nav-title">DANH MỤC</div><nav class="side-links" aria-label="Danh mục chức năng">${nav()}</nav><div class="sidebar-bottom"><strong>Admin Demo</strong><small>Giao diện giả lập · Không có quyền thật</small><a href="index.html">← Chọn mẫu khác</a></div></aside>
      <div class="app-main"><header class="header"><div class="header-start"><button id="mobile-nav" class="icon-btn mobile-only" aria-label="Hiện danh mục" aria-expanded="false">☰</button><span class="top-context">PickPack / <strong>${active.name}</strong></span></div><div class="header-controls"><label class="design-select"><span>Mẫu</span><select id="design-change" aria-label="Chọn phương án">${designs.map(d=>`<option value="${d.id}" ${d.id===designId?'selected':''}>${String(d.id).padStart(2,'0')} · ${d.name}</option>`).join('')}</select></label><button id="mode-change" class="btn mode-btn" aria-label="Chuyển giao diện sáng hoặc tối">${mode==='light'?'☾ Tối':'☀ Sáng'}</button><a class="btn open-button" href="${url(moduleId)}${params.has('record')?'&record='+encodeURIComponent(params.get('record')):''}" target="_blank" rel="noopener" title="Mở trang này trong tab mới">↗ <span>Mở tab mới</span></a><span class="person-pill">AD <span>Admin Demo</span></span></div></header>
      <main class="work-area"><div class="disclaimer"><span><b>UI PROTOTYPE</b> · Tất cả số liệu và nhân sự đều giả lập; chưa có login, API hay lưu trữ thực.</span><a href="index.html">Xem 5 mẫu ↗</a></div><div class="page-head"><div><div class="section-kicker">${String(designId).padStart(2,'0')} / ${design.name} · ${active.detail}</div><h1>${active.name}</h1><p>${moduleId==='overview'?'Bảng điều hành trực quan dành cho bản review.':'Kiểm tra cách hiển thị bảng, tìm kiếm, lọc và mở bản ghi trong tab mới.'}</p></div><div class="page-actions"><a class="btn ghost" href="${url(moduleId)}" target="_blank" rel="noopener">↗ Mở cửa sổ độc lập</a></div></div>${detailPanel()}${moduleId==='overview'?overview():modulePage()}</main>
      <footer class="footer">PickPack 1291 · Bộ mẫu giao diện 0.2 · CODE ONLY / NO BACKEND <span>Không triển khai Production</span></footer></div></div>`;
    document.getElementById('design-change').addEventListener('change',e=>{location.href=url(moduleId,validId(e.target.value),mode)+(params.has('record')?'&record='+encodeURIComponent(params.get('record')):'')});
    document.getElementById('mode-change').addEventListener('click',()=>{location.href=url(moduleId,designId,mode==='light'?'dark':'light')+(params.has('record')?'&record='+encodeURIComponent(params.get('record')):'')});
    document.getElementById('mobile-nav').addEventListener('click',e=>{const open=document.body.classList.toggle('nav-open');e.currentTarget.setAttribute('aria-expanded',String(open))});
    const close=document.getElementById('close-detail'); if(close)close.addEventListener('click',()=>location.href=url(moduleId));
    const query=document.getElementById('query');if(query){query.addEventListener('input',table);document.getElementById('status-filter').addEventListener('change',e=>{filter=e.target.value;table()});document.getElementById('add-record').addEventListener('click',()=>{const idx=currentRows.length+1;currentRows.unshift([`DEMO-${String(idx).padStart(3,'0')}`,`Bản ghi minh họa ${idx}`,`Ca mẫu ${idx%2+1}`,'Chờ rà soát']);query.value='';document.getElementById('status-filter').value='all';filter='all';table()});table()}
  }
  if (document.body.dataset.screen === 'gallery')gallery();else renderApp();
})();
