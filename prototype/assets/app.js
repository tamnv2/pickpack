/* PickPack 1291 — offline Office preview only. Synthetic browser-local records and test credentials. No production API or real identity. */
(()=>{
'use strict';
const root=document.getElementById('root');
 const WEB_VERSION='0.8.2';
const PAGES={dashboard:{title:'Tổng quan',desc:'Tình hình vận hành Pick Pack 1291'},people:{title:'Nhân sự',desc:'Danh sách và hồ sơ nhân sự'},shifts:{title:'Ra / vào ca',desc:'Theo dõi quét ca và user làm việc'},labor:{title:'Công nhật',desc:'Tổng hợp công theo ngày và ca'},minutes:{title:'Biên bản',desc:'Quản lý và lưu trữ biên bản'},assets:{title:'Công cụ dụng cụ',desc:'Danh mục, tình trạng và cấp phát'},pda:{title:'Mượn / trả PDA',desc:'Theo dõi thiết bị và người đang sử dụng'}};
const SIDEBAR=[{name:'BẢNG ĐIỀU KHIỂN',items:[['dashboard','grid']]},{name:'QUẢN LÝ NHÂN SỰ',items:[['people','users'],['shifts','clock'],['labor','calendar']]},{name:'HỒ SƠ & THIẾT BỊ',items:[['minutes','file'],['assets','boxes'],['pda','device']]}];
const PATHS={
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
users:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a6 6 0 0 1 12 0v2M17 3a4 4 0 0 1 0 8M17 15a6 6 0 0 1 5 6"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 2v6M16 2v6M3 10h18M8 14h3M8 18h3"/>',
file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6"/>',
boxes:'<path d="m12 2 9 5-9 5-9-5-9-5zM3 7v10l9 5 9-5V7M12 12v10"/>'.replace('l9-5-9-5-9-5','l-9 5-9-5'),
device:'<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4M11 18h2"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>',
moon:'<path d="M20 14A9 9 0 0 1 10 4a9 9 0 1 0 10 10z"/>',
list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
edit:'<path d="M4 20l5-1 10-10-4-4L5 15zM13 7l4 4"/>',
trash:'<path d="M4 7h16M10 3h4M6 7l1 14h10l1-14M10 11v6m4-6v6"/>',
eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7z"/><circle cx="12" cy="12" r="3"/>',
download:'<path d="M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
};
function icon(name,size=18){return `<svg class="ui-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]||PATHS.grid}</svg>`}
const ICONS=Object.fromEntries(['grid','users','clock','calendar','file','boxes','device'].map(k=>[k,icon(k)]));
// Completely synthetic, reproducible operational examples. No real employee or device records.
const STORAGE_KEY='pickpack1291_office_records_v07';
const LEGACY_FONT_KEY='pickpack1291_office_font_v06';
 const FONT_KEY='pickpack1291_office_font_setting_v082';
const THEME_KEY='pickpack1291_office_theme_v06';
const ACCENT_KEY='pickpack1291_office_light_accent_v08';
const FONT_MIGRATED_KEY='pickpack1291_office_font_boost_v08';
const ACCENTS=[['red','Đỏ'],['orange','Cam'],['yellow','Vàng'],['green','Lục'],['blue','Lam'],['indigo','Chàm'],['violet','Tím']];
const SESSION_KEY='pickpack1291_office_session_v06';
function storageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function storageSet(key,val){try{localStorage.setItem(key,val);return true}catch{return false}}
function storageRemove(key){try{localStorage.removeItem(key)}catch{}}
function demoSession(){return storageGet(SESSION_KEY)==='demo-admin-only'||(location.protocol==='file:'&&new URLSearchParams(location.search).get('demo')==='1')}
function seedRecords(){
 // 100% synthetic fixtures, deterministic across browsers and reloads; no real operational records.
 let num=129114;const rand=()=>{num=(num*1664525+1013904223)>>>0;return num/4294967296};
 const first=['Nguyễn','Trần','Lê','Phạm','Hoàng','Vũ','Đặng','Bùi','Đỗ','Phan','Ngô','Hồ'];
 const second=['Văn','Thị','Minh','Quang','Ngọc','Thanh','Đức','Hồng','Gia','Tuấn','Đình','Khánh'];
 const last=['An','Bình','Châu','Dũng','Giang','Hà','Hải','Hạnh','Hiếu','Huy','Khánh','Lan','Linh','Long','Mai','Nam','Nhi','Phúc','Quân','Sơn','Trang','Vy','Yến','Thảo','Tiến','Đạt','Phương','Nhung'];
 const teams=['Pick','Pack thường','Pack Auto','Điều phối'];
 const pick=(arr)=>arr[Math.floor(rand()*arr.length)];
 const people=Array.from({length:36},(_,i)=>{const name=`${pick(first)} ${pick(second)} ${pick(last)}`,position=teams[i%4];return{
   id:String(90000001+i),name,phone:'000'+String(1000000+i).slice(-7),position,supplier:['Nội bộ','Đối tác A','Đối tác B'][i%3],
   department:'Pick Pack',site:'1291',warehouse:'1291',startDate:`${String(1+i%27).padStart(2,'0')}/${String(1+i%11).padStart(2,'0')}/2026`,
   note:'',updatedBy:'Quản trị viên',updatedAt:'14/11/2026 08:00:00',photo:'',
   shift:i%3===0?'Ca 2':'Ca 1',user:`pp1291.${['pk','pa','au','dc'][i%4]}${String(Math.floor(i/4)+1).padStart(2,'0')}`,
   initial:name.split(' ').at(-1).slice(0,2)
  }});
 const shifts=Array.from({length:42},(_,i)=>{const p=people[(i*13)%people.length],day=14-Math.floor(i/7),pending=i%9===0,ended=i>7||i%5===0;return{
  id:`CA-${String(261101+i)}`,name:p.name,staff:p.id,date:`${String(day).padStart(2,'0')}/11/2026`,shift:p.shift,
  checkin:pending?'—':`${p.shift==='Ca 1'?'05':'13'}:${String(26+(i*7)%32).padStart(2,'0')}`,
  checkout:ended&&!pending?`${p.shift==='Ca 1'?'14':'22'}:${String((i*9)%50).padStart(2,'0')}`:'—',
  user:p.user,state:pending?'Chờ vào ca':ended?'Đã ra ca':'Trong ca'
 }});
 const labor=Array.from({length:42},(_,i)=>{const p=people[(i*7)%people.length];return{
   id:`CN-${String(261101+i)}`,name:p.name,date:`${String(14-Math.floor(i/9)).padStart(2,'0')}/11/2026`,
   shift:p.shift,work:p.position,staff:p.id,user:p.user,scannedAt:'—',hours:['8,0','8,0','8,5','9,0','7,5','10,0'][i%6],
   state:['Đã xác nhận','Đã xác nhận','Tạm tính','Chưa chấm'][i%4]
 }});
 const topics=['Bàn giao ca khu Pick','Kiểm tra thiết bị đầu ca','Bàn giao vật tư Pack','Ghi nhận tình trạng dụng cụ','Xác nhận hoàn trả CCDC','Ghi nhận sai lệch bàn giao','Kiểm tra an toàn khu vực','Bàn giao PDA cuối ca','Kiểm tra khu đóng gói','Bàn giao khu Auto'];
 const types=['Bàn giao ca','Thiết bị','Tác nghiệp','An toàn','Kỷ luật'];
 const minutes=Array.from({length:30},(_,i)=>({
  id:`BB-${String(261101+i)}`,name:`${topics[i%topics.length]} - ${String(14-Math.floor(i/6)).padStart(2,'0')}/11`,
  type:types[i%5],date:`${String(14-Math.floor(i/6)).padStart(2,'0')}/11/2026`,
  owner:people[(i*11)%people.length].name,state:['Chờ xác nhận','Đã lưu','Đã xác nhận'][i%3]
 }));
 const goods=['Máy quét mã vạch','Khay phân loại','Bộ sạc thiết bị','Xe đẩy hàng','Bộ niêm phong','Dây sạc','Giỏ nhựa','Kệ để hàng','Bộ đàm','Kéo an toàn','Găng tay','Bảng kê','Bộ pin dự phòng','Máy in tem','Bàn cân'];
 const assets=Array.from({length:30},(_,i)=>({
   id:`CCDC-${String(260201+i)}`,name:`${goods[i%goods.length]} - ${Math.floor(i/15)+1}`,
   type:i%5===0?'Thiết bị':'Dụng cụ',qty:1+(i*7%22),unit:['chiếc','cái','bộ'][i%3],
   holder:['Kho CCDC','Khu Pick','Khu Pack','Khu Auto','Bàn điều phối'][i%5],
   state:['Sẵn sàng','Đang sử dụng','Sẵn sàng','Cần kiểm tra'][i%4]
 }));
 const pda=Array.from({length:30},(_,i)=>{const p=people[(i*7+3)%people.length],active=i<2;return{
    id:`MT-${String(261101+i)}`,name:`PDA-${String(i%3+1).padStart(2,'0')}`,staff:p.id,
    holder:p.name,user:p.user,borrow:`${String(5+(i%5)).padStart(2,'0')}:${String(15+(i*7)%42).padStart(2,'0')}`,
    return:active?'—':`${14+i%4}:${String(10+(i*9)%39).padStart(2,'0')}`,state:active?'Đang mượn':'Đã trả'
  }});
  const pdaDevices=Array.from({length:3},(_,i)=>({id:`PDA-${String(i+1).padStart(2,'0')}`,serial:`SYNTHETIC-1291-${String(i+1).padStart(5,'0')}`,last5:String(i+1).padStart(5,'0'),source:'Thiết bị kiểm thử',state:i<2?'Đang sử dụng':'Sẵn sàng',note:''}));
 return {people,shifts,labor,minutes,assets,pda,pdaDevices};
}
function readRecords(){try{const data=JSON.parse(storageGet(STORAGE_KEY)||'null');if(data&&Object.keys(seedRecords()).every(k=>Array.isArray(data[k])&&data[k].length<500))return data}catch{}return seedRecords()}
const store=readRecords();
function persist(){storageSet(STORAGE_KEY,JSON.stringify(store))}
function updateRecord(key,id,changes){const row=store[key]?.find(r=>r.id===id);if(!row)return false;Object.assign(row,changes);persist();return true}
const columns={
 people:[['name','Họ và tên'],['id','Mã nhân viên'],['phone','Số điện thoại'],['position','Vị trí chính'],['supplier','Nhà cung cấp'],['department','Bộ phận'],['site','Site'],['warehouse','Kho']],
 shifts:[['name','Họ và tên'],['staff','Mã nhân viên'],['date','Ngày'],['shift','Ca'],['checkin','Vào ca'],['checkout','Ra ca'],['user','User làm việc'],['state','Trạng thái']],
 labor:[['name','Nhân sự'],['staff','Mã nhân viên'],['date','Ngày'],['shift','Ca'],['user','User làm việc'],['work','Công việc'],['scannedAt','Giờ ghi nhận'],['hours','Giờ công'],['state','Trạng thái']],
 minutes:[['name','Tên biên bản'],['id','Mã'],['type','Loại'],['date','Ngày'],['owner','Người lập'],['state','Trạng thái']],
 assets:[['name','Tên CCDC'],['id','Mã'],['type','Loại'],['qty','Số lượng'],['holder','Vị trí'],['state','Trạng thái']],
 pda:[['name','Thiết bị'],['holder','Người mượn'],['user','User làm việc'],['borrow','Giờ mượn'],['return','Giờ trả'],['returner','Người trả'],['state','Trạng thái']]
};
const PERSON_EDITOR=[['id','Mã nhân viên'],['name','Họ và tên'],['phone','Số điện thoại'],['position','Vị trí chính'],['supplier','Nhà cung cấp'],['department','Bộ phận'],['site','Site'],['warehouse','Kho'],['startDate','Ngày bắt đầu làm việc'],['shift','Ca được phân'],['user','User làm việc'],['note','Ghi chú']];
const PERSON_DETAILS=[...PERSON_EDITOR,['updatedBy','Người cập nhật'],['updatedAt','Thời gian cập nhật']];

const state={view:'dashboard',theme:'light',accent:'blue',fontPct:100,search:'',filter:'all',drawer:'',modal:'',sidebar:false,notice:'',editId:'',selected:new Set(),loginError:'',loginVisible:false,photoDraft:'',scanOutcome:null,scanMode:'enter',laborScan:null,pdaScan:null,pdaMode:'borrow'};
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const qs=new URLSearchParams(location.search);state.view=PAGES[qs.get('view')]?qs.get('view'):'dashboard';state.theme=qs.has('theme')?(qs.get('theme')==='dark'?'dark':'light'):(storageGet(THEME_KEY)==='dark'?'dark':'light');const storedFont=Number(storageGet(FONT_KEY));const oldFont=Number(storageGet(LEGACY_FONT_KEY));state.fontPct=Math.max(90,Math.min(120,Math.round((storedFont||(oldFont?oldFont/1.1:100))/5)*5));if(!storedFont)storageSet(FONT_KEY,String(state.fontPct));state.accent=ACCENTS.some(([key])=>key===storageGet(ACCENT_KEY))?storageGet(ACCENT_KEY):'blue';state.drawer=qs.get('record')||'';
const href=(view=state.view,record='',theme=state.theme)=>`app.html?view=${encodeURIComponent(view)}&theme=${theme}`+(record?`&record=${encodeURIComponent(record)}`:'')+(location.protocol==='file:'?'&demo=1':'');
const badge=(v)=>{const s=String(v);const type=/Chờ|Cần kiểm tra|Chưa/.test(s)?'warn':/Đã lưu|Đã xác nhận|Sẵn sàng|Đã ra/.test(s)?'neutral':/Trong ca|Đang|Tạm tính/.test(s)?'good':'neutral';return `<span class="status ${type}"><span class="status-dot"></span>${escape(s)}</span>`};
const avatar=(x,big=false)=>/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(x.photo||'')?`<img class="person-avatar ${big?'big':''}" src="${x.photo}" alt="">`:`<span class="person-avatar ${big?'big':''}" aria-hidden="true">${escape(x.initial || String(x.name||'A').slice(-2).toUpperCase())}</span>`;
function side(){return `<aside class="sidebar ${state.sidebar?'is-open':''}" aria-label="Điều hướng PickPack"><div class="side-top"><img class="brand-logo" src="assets/supra-mark.png" alt="The Supra"><div><strong class="corporate-brand"><span>CÔNG TY CỔ PHẦN THE SUPRA</span><span>DC HƯNG YÊN</span></strong></div><button class="mobile-hide" data-action="close-nav" aria-label="Đóng menu">×</button></div><div class="sidebar-scroll"><div class="location-chip"><span class="location-icon">${icon("boxes",17)}</span><div><strong>Kho 1291</strong><small>Trung tâm vận hành</small></div><span class="caret">⌄</span></div>${SIDEBAR.map(group=>`<div class="side-group"><span class="group-title">${group.name}</span>${group.items.map(([view,icon])=>`<div class="side-link ${state.view===view?'selected':''}"><a class="nav-main" href="${href(view)}" data-nav="${view}" aria-current="${state.view===view?'page':'false'}" ><span class="nav-icon">${ICONS[icon]}</span><span>${PAGES[view].title}</span></a></div>`).join('')}</div>`).join('')}</div><div class="side-bottom"><span class="web-version" title="Phiên bản Web Office">Web v${WEB_VERSION}</span><button class="side-logout logout-wide" data-action="logout" title="Đăng xuất">${icon("logout",17)}<span>Đăng xuất</span></button></div></aside>`}
function top(){return `<header class="topbar"><div class="top-left"><button class="icon-button menu-button" data-action="toggle-nav" aria-label="Mở menu">${icon("list",20)}</button></div><div class="top-right">${state.view==='dashboard'?'':`<div class="top-search">${icon("search",17)}<input id="global-search" type="search" placeholder="Tìm nhanh trong ${PAGES[state.view].title.toLowerCase()}..." value="${escape(state.search)}" aria-label="Tìm nhanh"></div>`}<span class="top-divider"></span><button class="icon-button" data-action="theme" title="Chuyển sáng/tối" aria-label="Chuyển chế độ màu">${icon(state.theme==="light"?"moon":"sun",19)}</button><button class="icon-button" data-action="settings" title="Cài đặt" aria-label="Cài đặt">${icon("settings",19)}</button><button class="icon-button notif" data-action="notifications" title="Thông báo" aria-label="Thông báo">${icon("bell",19)}${notificationItems().length?"<i></i>":""}</button><div class="top-profile">${avatar({initial:'AD'})}<div><strong>Quản trị viên</strong><small>Office Admin</small></div><span class="caret">⌄</span></div></div></header>`}
function pageHead(action='',other=''){return `<div class="page-header"><h1>${PAGES[state.view].title}</h1>${action||other?`<div class="header-actions">${other}${action}</div>`:''}</div>`}
function stat(label,value,small,accent='blue',ic='grid'){return `<div class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon ${accent}">${icon(({'♙':'users','◷':'clock','▯':'device','▤':'file','≡':'list','▦':'grid'})[ic]||ic,20)}</span></div><div class="metric-number">${value}</div><div class="metric-foot">${small}</div></div>`}
function activity(){
 const entries=store.shifts.slice(0,4);
 return `<section class="panel activity-panel"><div class="panel-title"><div><h2>Ra / vào ca gần đây</h2><p>Lịch sử ghi nhận theo mã nhân viên</p></div></div><div class="timeline">${entries.length?entries.map((r,i)=>`<div class="timeline-row"><span class="timeline-indicator ${i===0?'current':''}"></span><div><strong>${escape(r.name)}</strong><small>${escape(r.staff)} · ${escape(r.shift)} · ${escape(r.state)}</small></div><time>${escape(r.checkin==='—'?r.date:r.date+' '+r.checkin)}</time></div>`).join(''):'<div class="scan-empty">Chưa có lượt quét</div>'}</div></section>`;
}
function workload(){const labs=['05h','07h','09h','11h','13h','15h','17h'];
 const todayDate=new Date().toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});const today=store.shifts.filter(r=>r.date===todayDate&&r.checkin!=='—');
 const counts=labs.map(t=>today.filter(r=>r.checkin<=t.slice(0,2)+':59'&&(r.checkout==='—'||r.checkout>t.slice(0,2)+':59')).length);
 const max=Math.max(1,...counts);
 return `<section class="panel chart-panel"><div class="panel-title"><div><h2>Phân bổ nhân sự theo giờ</h2><p>Số lượt đang trong ca theo thời gian</p></div><span class="legend"><i></i>Đang làm việc</span></div><div class="chart-area"><div class="chart-lines"><span>${max}</span><span>${Math.round(max*.75)}</span><span>${Math.round(max*.5)}</span><span>${Math.round(max*.25)}</span></div><div class="chart-bars">${counts.map((n,i)=>`<div class="chart-col"><div class="bar-wrap"><div class="bar" style="height:${Math.max(4,Math.round(n/max*100))}%"><span>${n}</span></div></div><small>${labs[i]}</small></div>`).join('')}</div></div></section>`}
function panelAttention(){
 const items=notificationItems();
 return `<section class="panel alert-panel"><div class="panel-title"><div><h2>Cần xử lý</h2><p>Tổng hợp tồn đọng nghiệp vụ</p></div><span class="bubble">${items.reduce((n,x)=>n+x.count,0)}</span></div><div class="alert-list">${items.length?items.map(x=>`<div class="alert-row"><span class="alert-icon amber">${icon(x.ic,17)}</span><span><strong>${x.title}</strong><small>${x.count} bản ghi cần xử lý</small></span><b class="overview-count">${x.count}</b></div>`).join(''):'<p class="no-alerts">Không có mục cần xử lý</p>'}</div></section>`;
}
function coveragePanel(){
 const total=(x)=>x.length,confirmed=(x,s)=>x.filter(r=>r.state===s).length;
 const sets=[
 ['Nhân sự',total(store.people),store.people.filter(r=>r.shift).length,'Đã phân ca'],
 ['Ra / vào ca',total(store.shifts),confirmed(store.shifts,'Trong ca'),'Trong ca'],
 ['Công nhật',total(store.labor),confirmed(store.labor,'Đã xác nhận'),'Đã xác nhận'],
 ['Biên bản',total(store.minutes),confirmed(store.minutes,'Đã xác nhận'),'Đã xác nhận'],
 ['Công cụ dụng cụ',total(store.assets),confirmed(store.assets,'Sẵn sàng'),'Sẵn sàng'],
 ['Mượn / trả PDA',total(store.pdaDevices),new Set(store.pda.filter(r=>r.state==='Đang mượn').map(r=>r.name)).size,'Đang mượn']
 ];
 return `<section class="panel coverage-panel"><div class="panel-title"><div><h2>Trạng thái toàn hệ thống</h2><p>Tổng hợp trực tiếp từ 6 phân hệ nghiệp vụ</p></div></div><div class="coverage-list">${sets.map(([name,total,part,desc])=>`<div class="coverage-row"><strong>${escape(name)}</strong><span>${escape(desc)}</span><b>${part} / ${total}</b><div class="coverage-track"><span style="width:${total?Math.min(100,Math.round(part/total*100)):0}%"></span></div></div>`).join('')}</div></section>`;
}
function dashboard(){
 const todayDate=new Date().toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
 const inShift=store.shifts.filter(r=>r.state==='Trong ca').length;
 const pendingLabor=store.labor.filter(r=>r.state!=='Đã xác nhận').length;
 const pendingMinutes=store.minutes.filter(r=>r.state==='Chờ xác nhận').length;
 const flaggedAssets=store.assets.filter(r=>r.state==='Cần kiểm tra').length;
 const borrowed=new Set(store.pda.filter(r=>r.state==='Đang mượn').map(r=>r.name)).size;
 const todayScans=store.shifts.filter(r=>r.date===todayDate&&r.checkin!=='—').length;
 return `<div class="page-content overview-page">${pageHead()}<div class="metrics overview-metrics">${stat('Tổng nhân sự',store.people.length,'Hồ sơ đang quản lý','blue','users')}${stat('Đã phân ca',store.people.filter(r=>r.shift).length,'Nhân sự có thông tin ca','green','calendar')}${stat('Đang trong ca',inShift,'Lượt ra/vào chưa kết thúc','green','clock')}${stat('Vào ca hôm nay',todayScans,todayDate,'blue','clock')}${stat('Công nhật chưa chốt',pendingLabor,'Chưa xác nhận','orange','calendar')}${stat('Biên bản chờ duyệt',pendingMinutes,'Chờ xác nhận','orange','file')}${stat('CCDC cần kiểm tra',flaggedAssets,'Theo tình trạng thiết bị','purple','boxes')}${stat('PDA đang mượn',`${borrowed} / ${store.pdaDevices.length}`,'Thiết bị hiện quản lý','purple','device')}</div><div class="overview-sections">${coveragePanel()}${panelAttention()}</div><div class="two-col lower">${workload()}${activity()}</div></div>`;
}
function tableCell(row,key,view){if(key==='name')return `<div class="cell-name">${view==='people'?avatar(row):''}<div><strong>${escape(row.name)}</strong>${view==='people'?`<small>${escape(row.user)}</small>`:''}</div></div>`;if(key==='state')return badge(row[key]);if(key==='id')return `<span class="mono">${escape(row[key])}</span>`;return escape(row[key])}
function filtered(){const set=store[state.view]||[];let rows=set.filter(x=>Object.values(x).some(v=>String(v).toLowerCase().includes(state.search.toLowerCase())));if(state.filter!=='all')rows=rows.filter(x=>String(x.state)===state.filter);return rows}
function controls(){
 const statuses=state.view==='people'?[]:[...new Set((store[state.view]||[]).map(x=>x.state))];
 return `<div class="table-controls"><div class="table-control-left"><span class="listing-icon">${icon('list',18)}</span><span class="records-label">Danh sách <b>${store[state.view].length}</b></span>${statuses.length?`<span class="separator"></span><label class="filter-label">Trạng thái <select id="status-filter" aria-label="Lọc theo trạng thái"><option value="all">Tất cả</option>${statuses.map(x=>`<option value="${escape(x)}" ${state.filter===x?'selected':''}>${escape(x)}</option>`).join('')}</select></label>`:''}</div><div class="table-control-right"><button class="btn ghost tiny" data-action="export" title="Xuất bản ghi đang lọc">${icon('download',15)} Xuất Excel</button>${state.view==='shifts'?'':`<button class="btn danger tiny" data-action="bulk-delete" ${state.selected.size?'':'disabled'}>Xóa đã chọn (${state.selected.size})</button>`}</div></div>`;
}
function recordActions(r){
 if(state.view==='shifts')return `<span class="row-actions"><button class="row-open" data-record="${escape(r.id)}" title="Xem lượt quét">${icon('eye',16)}</button></span>`;
 return `<span class="row-actions"><button class="row-open" data-record="${escape(r.id)}" title="Xem chi tiết">${icon('eye',16)}</button><button class="row-open" data-edit="${escape(r.id)}" title="Sửa bản ghi">${icon('edit',16)}</button><button class="row-open danger-text" data-delete="${escape(r.id)}" title="Xóa bản ghi">${icon('trash',16)}</button></span>`;
}
function table(){
 const cols=columns[state.view],rows=filtered(),locked=state.view==='shifts';
 return `<section class="panel table-panel">${controls()}${rows.length?`<div class="table-scroll"><table><thead><tr>${locked?'':'<th><input type="checkbox" id="select-all" aria-label="Chọn tất cả bản ghi đang hiển thị" '+(rows.every(x=>state.selected.has(x.id))?'checked':'')+'></th>'}${cols.map(([,lab])=>`<th>${lab}</th>`).join('')}<th>Thao tác</th></tr></thead><tbody>${rows.map(r=>`<tr>${locked?'':`<td><input type="checkbox" data-select="${escape(r.id)}" aria-label="Chọn ${escape(r.id)}" ${state.selected.has(r.id)?'checked':''}></td>`}${cols.map(([k])=>`<td>${k==='name'?`<a class="inline-link cell-record-link" href="${href(state.view,r.id)}">${tableCell(r,k,state.view)}</a>`:tableCell(r,k,state.view)}</td>`).join('')}<td>${recordActions(r)}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty"><strong>Không tìm thấy bản ghi phù hợp</strong><span>Thử điều chỉnh bộ lọc hoặc từ khóa</span></div>`}<div class="table-footer"><span>Hiển thị ${rows.length} / ${store[state.view].length} bản ghi</span></div></section>`;
}
function modulePage(){
 const records=store[state.view]||[];
 const call={people:'Thêm nhân sự',minutes:'Tạo biên bản',assets:'Thêm CCDC'}[state.view];
 const head=call?`<button class="btn primary" data-action="add">${icon('plus',16)} ${call}</button>`:'';
 const scanner=state.view==='shifts'?shiftScanPanel():state.view==='labor'?laborScanPanel():state.view==='pda'?pdaScanPanel():'';
 return `<div class="page-content">${pageHead(head)}${scanner}${state.view==='pda'?deviceRegistry():''}${table()}</div>`;
}
function scanPreview(person){
 if(!person)return '<div class="scan-empty">Nhập hoặc quét mã nhân viên để xem hồ sơ.</div>';
 return `<div class="scan-identity">${avatar(person,true)}<div><strong>${escape(person.name)}</strong><small>Mã nhân viên: ${escape(person.id)} · ${escape(person.position||'Chưa có vị trí')}</small></div></div><dl class="scan-fields">${PERSON_DETAILS.filter(([k])=>k!=='name'&&k!=='id').map(([k,l])=>`<div><dt>${escape(l)}</dt><dd>${escape(person[k]||'Chưa cập nhật')}</dd></div>`).join('')}</dl>`;
}
function shiftScanPanel(){
 const result=state.scanOutcome,person=result?.code?store.people.find(p=>p.id===result.code):null,mode=state.scanMode;
 return `<section class="panel scan-station"><div class="scan-station-head"><span class="scan-mark">${icon('clock',22)}</span><div><h2>Quét mã ra / vào ca</h2><p>Chọn loại thao tác một lần rồi quét liên tiếp. Máy quét gửi Enter sẽ tự ghi nhận.</p></div></div><div class="scan-mode-wrapper"><span class="scan-code-label">Loại thao tác</span><div class="scan-mode" role="group" aria-label="Loại thao tác quét"><button type="button" class="${mode==='enter'?'active':''}" data-scan-mode="enter" aria-pressed="${mode==='enter'}">Vào ca</button><button type="button" class="${mode==='exit'?'active':''}" data-scan-mode="exit" aria-pressed="${mode==='exit'}">Ra ca</button></div></div><form id="shift-scan-form" autocomplete="off"><label class="scan-code-label" for="shift-code">Mã nhân viên</label><div class="scan-form-row"><input id="shift-code" name="employeeCode" placeholder="Quét hoặc nhập mã nhân viên" maxlength="30" required autocomplete="off" autocapitalize="off" spellcheck="false"><button class="btn primary" type="submit" value="${mode}">${icon('clock',16)} Ghi nhận ${mode==='enter'?'vào ca':'ra ca'}</button></div></form>${result?`<div class="scan-outcome ${result.ok?'scan-success':'scan-error'}" role="status">${escape(result.message)}</div>`:''}<div class="scan-preview" id="scan-preview">${scanPreview(person)}</div></section>`;
}
function scanShift(code,operation){
 const staff=String(code||'').trim(),p=store.people.find(x=>x.id===staff),now=new Date();
 const date=now.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
 const time=now.toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
 const outcome=(ok,message)=>{state.scanOutcome={ok,code:staff,message};state.notice='';render();root.querySelector('#shift-code')?.focus();return ok};
 if(!p)return outcome(false,'Không tìm thấy mã nhân viên. Vui lòng kiểm tra hoặc bổ sung hồ sơ.');
 if(!p.shift)return outcome(false,'Nhân viên chưa được phân ca. Cần cập nhật hồ sơ trước khi quét.');
 const current=store.shifts.find(x=>x.staff===p.id&&x.state==='Trong ca');
 if(operation==='enter'){
  if(current)return outcome(false,`Nhân viên ${p.name} đang trong ca, không ghi nhận vào ca lần hai.`);
  store.shifts.unshift({id:`CA-${Date.now().toString(36).toUpperCase()}`,staff:p.id,name:p.name,date,shift:p.shift,checkin:time,checkout:'—',user:p.user||'—',state:'Trong ca',checkinAt:now.toISOString(),checkoutAt:''});
  persist();return outcome(true,`Đã vào ca · ${p.name} · ${p.shift} · ${date} ${time}`);
 }
 if(operation==='exit'){
  if(!current)return outcome(false,`Không có lượt vào ca đang mở của ${p.name}. Không thể ghi nhận ra ca.`);
  updateRecord('shifts',current.id,{checkout:time,checkoutAt:now.toISOString(),state:'Đã ra ca'});
  return outcome(true,`Đã ra ca · ${p.name} · ${current.shift} · ${date} ${time}`);
 }
 return outcome(false,'Thao tác không hợp lệ.');
}
function compactPersonPreview(person){
 if(!person)return '<div class="scan-empty">Chưa xác định nhân viên.</div>';
 return `<div class="scan-identity compact-identity">${avatar(person)}<div><strong>${escape(person.name)} · ${escape(person.id)}</strong><small>${escape(person.position||'Chưa cập nhật')} · ${escape(person.shift||'Chưa phân ca')} · User: ${escape(person.user||'—')}</small></div></div>`;
}
function laborScanPanel(){
 const result=state.laborScan,person=result?.code?store.people.find(p=>p.id===result.code):null;
 return `<section class="panel scan-station compact-scanner"><div class="scan-station-head"><span class="scan-mark">${icon('calendar',20)}</span><div><h2>Quét mã công nhật</h2><p>Quét mã nhân viên để xác định hồ sơ, ca và user. Giờ công được chấm sau khi có căn cứ.</p></div></div><form id="labor-scan-form" autocomplete="off"><label class="scan-code-label" for="labor-staff-code">Mã nhân viên / QR nhân viên</label><div class="scan-form-row"><input id="labor-staff-code" name="employeeCode" placeholder="Quét hoặc nhập mã nhân viên" maxlength="30" required autocomplete="off" spellcheck="false"><button class="btn primary" type="submit">Ghi nhận công nhật</button></div></form>${result?`<div class="scan-outcome ${result.ok?'scan-success':'scan-error'}" role="status">${escape(result.message)}</div>`:''}<div class="scan-preview" id="labor-scan-preview">${compactPersonPreview(person)}</div></section>`;
}
function scanLabor(code){
 const staff=String(code||'').trim(),p=store.people.find(row=>row.id===staff),now=new Date();
 const date=now.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
 const time=now.toLocaleTimeString('vi-VN',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
 const result=(ok,message)=>{state.laborScan={ok,code:staff,message};render();root.querySelector('#labor-staff-code')?.focus();return ok};
 if(!p)return result(false,'Không tìm thấy mã nhân viên.');
 if(!p.shift)return result(false,`Nhân viên ${p.name} chưa được phân ca.`);
 if(store.labor.some(row=>row.date===date&&row.staff===p.id))return result(false,`Đã có bản ghi công nhật ngày ${date} của ${p.name}. Không tạo trùng.`);
 store.labor.unshift({id:`CN-${Date.now().toString(36).toUpperCase()}`,name:p.name,staff:p.id,user:p.user||'—',date,shift:p.shift,work:'—',scannedAt:time,hours:'—',state:'Tạm tính'});
 persist();return result(true,`Đã ghi nhận công nhật · ${p.name} · ${p.shift} · ${date} ${time}. Giờ công chờ xác nhận.`);
}
function resolvePda(code){
 const key=String(code||'').trim().toUpperCase();
 if(!key)return null;
 const exact=store.pdaDevices.filter(d=>[d.id,d.serial,d.last5].some(v=>String(v).toUpperCase()===key));
 return exact.length===1?exact[0]:null;
}
function pdaDevicePreview(device){
 if(!device)return '<div class="scan-empty">Nhập hoặc quét QR/seri PDA để nhận diện thiết bị.</div>';
 const active=store.pda.find(r=>r.name===device.id&&r.state==='Đang mượn');
 return `<div class="scan-device"><strong>${escape(device.id)} · ${escape(device.serial)}</strong><span>${active?`Đang mượn: ${escape(active.holder)}`:'Sẵn sàng cho mượn'}</span></div>`;
}
function pdaScanPanel(){
 const result=state.pdaScan,person=result?.staff?store.people.find(p=>p.id===result.staff):null,device=result?.device?resolvePda(result.device):null,mode=state.pdaMode;
 return `<section class="panel scan-station compact-scanner"><div class="scan-station-head"><span class="scan-mark">${icon('device',20)}</span><div><h2>Quét mã mượn / trả PDA</h2><p>Quét mã nhân viên, sau đó QR/seri PDA. Mỗi thiết bị chỉ có một lượt mượn đang mở.</p></div></div><div class="scan-mode-wrapper"><span class="scan-code-label">Thao tác</span><div class="scan-mode" role="group" aria-label="Chế độ mượn trả PDA"><button type="button" class="${mode==='borrow'?'active':''}" data-pda-mode="borrow" aria-pressed="${mode==='borrow'}">Mượn PDA</button><button type="button" class="${mode==='return'?'active':''}" data-pda-mode="return" aria-pressed="${mode==='return'}">Trả PDA</button></div></div><form id="pda-scan-form" autocomplete="off"><div class="scan-code-grid"><label class="scan-code-label" for="pda-staff-code">Mã nhân viên / QR nhân viên<input id="pda-staff-code" name="employeeCode" maxlength="30" placeholder="Quét mã nhân viên" required autocomplete="off"></label><label class="scan-code-label" for="pda-device-code">Mã PDA / QR / seri / 5 số cuối<input id="pda-device-code" name="deviceCode" maxlength="120" placeholder="Quét mã PDA" required autocomplete="off"></label><button class="btn primary" type="submit">Ghi nhận ${mode==='borrow'?'mượn':'trả'} PDA</button></div></form>${result?`<div class="scan-outcome ${result.ok?'scan-success':'scan-error'}" role="status">${escape(result.message)}</div>`:''}<div class="scan-pair-preview"><div id="pda-person-preview">${compactPersonPreview(person)}</div><div id="pda-device-preview">${pdaDevicePreview(device)}</div></div></section>`;
}
function scanPda(employeeCode,deviceCode){
 const staff=String(employeeCode||'').trim(),deviceInput=String(deviceCode||'').trim();
 const p=store.people.find(x=>x.id===staff),device=resolvePda(deviceInput),now=new Date(),date=now.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
 const time=now.toLocaleTimeString('vi-VN',{hour12:false,hour:'2-digit',minute:'2-digit',second:'2-digit'});
 const out=(ok,message)=>{state.pdaScan={ok,staff,device:deviceInput,message};render();root.querySelector('#pda-staff-code')?.focus();return ok};
 if(!p)return out(false,'Không tìm thấy mã nhân viên.');
 if(!device)return out(false,'Mã PDA không tồn tại hoặc không xác định được duy nhất một thiết bị.');
 const open=store.pda.find(row=>row.name===device.id&&row.state==='Đang mượn');
 if(state.pdaMode==='borrow'){
  if(open)return out(false,`${device.id} đang được mượn bởi ${open.holder}. Không được mượn trùng.`);
  store.pda.unshift({id:`MT-${Date.now().toString(36).toUpperCase()}`,name:device.id,staff:p.id,holder:p.name,user:p.user||'—',date,borrow:time,borrowAt:now.toISOString(),return:'—',returner:'—',state:'Đang mượn'});
  persist();return out(true,`Đã mượn ${device.id} · ${p.name} · ${date} ${time}`);
 }
 if(state.pdaMode==='return'){
  if(!open)return out(false,`${device.id} chưa có lượt mượn đang mở.`);
  updateRecord('pda',open.id,{return:time,returnAt:now.toISOString(),returner:p.name,returnStaff:p.id,state:'Đã trả'});
  return out(true,`Đã trả ${device.id} · ${p.name} · ${date} ${time}`);
 }
 return out(false,'Thao tác không hợp lệ.');
}
function deviceRegistry(){
 const devices=store.pdaDevices||[];
 return `<section class="panel table-panel device-registry"><div class="table-controls"><div class="table-control-left"><span class="listing-icon">${icon('device',17)}</span><span class="records-label">Danh sách PDA <b>${devices.length}</b></span></div></div><div class="table-scroll"><table><thead><tr><th>Seri PDA</th><th>5 số cuối Seri</th><th>Nguồn</th><th>Tình trạng</th><th>Ghi chú</th></tr></thead><tbody>${devices.map(d=>{const active=store.pda.some(x=>x.name===d.id&&x.state==='Đang mượn');return `<tr><td><span class="mono">${escape(d.serial)}</span></td><td>${escape(d.last5)}</td><td>${escape(d.source)}</td><td>${badge(active?'Đang sử dụng':'Sẵn sàng')}</td><td>${escape(d.note||'—')}</td></tr>`}).join('')}</tbody></table></div></section>`;
}
function quickLabel(){return state.view==='pda'?'Mượn / trả':state.view==='shifts'?'Quét ca':state.view==='labor'?'Xác nhận công':state.view==='minutes'?'Duyệt biên bản':'Đổi trạng thái'}
function drawer(){
 if(!state.drawer)return '';
 const row=store[state.view]?.find(x=>x.id===state.drawer);if(!row)return '';
 const fields=state.view==='people'?PERSON_DETAILS:columns[state.view].slice(1);
 return `<div class="drawer-shade" data-action="close-drawer"></div><aside class="detail-drawer" role="dialog" aria-modal="true" aria-label="Chi tiết ${escape(row.id)}"><div class="detail-head"><div><small>CHI TIẾT HỒ SƠ</small><h2>${escape(row.name)}</h2></div><button class="icon-button" data-action="close-drawer" aria-label="Đóng chi tiết">×</button></div><div class="detail-content"><div class="detail-hero">${state.view==='people'?avatar(row,true):`<span class="detail-icon">${icon(state.view==='pda'?'device':'file',23)}</span>`}<div><strong>${escape(row.name)}</strong><small>${escape(row.id)}</small></div></div>${row.state?badge(row.state):''}<div class="detail-fields">${fields.filter(([k])=>k!=='name').map(([k,label])=>`<div><span>${escape(label)}</span><b>${escape(row[k]||'—')}</b></div>`).join('')}</div><div class="drawer-actions">${state.view==='shifts'?'':`<button class="btn primary" data-edit="${escape(row.id)}">${icon('edit',16)} Chỉnh sửa</button>${['people','labor','pda'].includes(state.view)?'':`<button class="btn ghost" data-quick="${escape(row.id)}">${quickLabel()}</button>`}<button class="btn danger" data-delete="${escape(row.id)}">Xóa</button>`}</div></div></aside>`;
}
const FIELD_OPTIONS={team:['Pick','Pack thường','Pack Auto','Điều phối'],shift:['Ca 1','Ca 2'],state:['Đang làm việc','Chờ vào ca','Nghỉ ca','Trong ca','Đã ra ca','Tạm tính','Đã xác nhận','Chưa chấm','Chờ xác nhận','Đã lưu','Sẵn sàng','Đang sử dụng','Cần kiểm tra','Đang mượn','Đã trả'],type:['Bàn giao ca','Thiết bị','Tác nghiệp','An toàn','Kỷ luật'],work:['Pick','Pack thường','Pack Auto','Điều phối']};
const STATES_BY_MODULE={people:['Đang làm việc','Chờ vào ca','Nghỉ ca'],shifts:['Chờ vào ca','Trong ca','Đã ra ca'],labor:['Chưa chấm','Tạm tính','Đã xác nhận'],minutes:['Chờ xác nhận','Đã lưu','Đã xác nhận'],assets:['Sẵn sàng','Đang sử dụng','Cần kiểm tra'],pda:['Đang mượn','Đã trả']};
const INITIAL_STATE={people:'Đang làm việc',shifts:'Chờ vào ca',labor:'Tạm tính',minutes:'Chờ xác nhận',assets:'Sẵn sàng',pda:'Đang mượn'};
function fieldInput(key,label,value,editing=false){
 const v=String(value??'');
 if(key==='id')return `<label>${escape(label)}<input name="id" value="${escape(v)}" maxlength="30" pattern="[A-Za-z0-9-]{2,30}" ${editing?'readonly':''} required autocomplete="off"></label>`;
 const opts=key==='state'?STATES_BY_MODULE[state.view==='dashboard'?'minutes':state.view]:FIELD_OPTIONS[key];
 if(opts)return `<label>${escape(label)}<select name="${key}" ${key==='shift'?'':'required'}><option value="">${key==='shift'?'Chưa phân ca':'— Chọn —'}</option>${[...new Set([...opts,v])].filter(Boolean).map(x=>`<option value="${escape(x)}" ${x===v?'selected':''}>${escape(x)}</option>`).join('')}</select></label>`;
 if(key==='qty')return `<label>${escape(label)}<input type="number" min="0" max="99999" name="${key}" value="${escape(v)}" required></label>`;
 if(key==='note')return `<label class="wide-field">${escape(label)}<textarea name="note" rows="2" maxlength="500">${escape(v)}</textarea></label>`;
 return `<label>${escape(label)}<input name="${key}" maxlength="120" value="${escape(v)}" placeholder="${escape(label)}" ${key==='name'?'minlength="2" required':''} ${key==='phone'?'type="tel"':''} autocomplete="off"></label>`;
}
function photoEditor(person){
 const x={name:person?.name||'',photo:state.photoDraft||'',initial:person?.initial||''};
 return `<section class="photo-editor"><div id="photo-preview">${avatar(x,true)}</div><div class="photo-editor-info"><strong>Ảnh đại diện</strong><div class="photo-editor-actions"><label class="btn ghost photo-picker">Chọn ảnh<input id="staff-photo" type="file" accept="image/jpeg,image/png,image/webp"></label><button class="btn ghost" data-action="remove-photo" type="button">Xóa ảnh</button></div><small>JPEG, PNG, WebP · tối đa 5 MB</small></div></section>`;
}
async function preparePortrait(file){
 if(!file||!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>5*1024*1024)throw Error('Ảnh không hợp lệ hoặc vượt 5 MB');
 const url=URL.createObjectURL(file);
 try{
  const img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url});
  if(!img.naturalWidth||!img.naturalHeight)throw Error('Không đọc được ảnh');
  const canvas=document.createElement('canvas');canvas.width=192;canvas.height=192;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('Không xử lý được ảnh');
  const side=Math.min(img.naturalWidth,img.naturalHeight);
  ctx.drawImage(img,(img.naturalWidth-side)/2,(img.naturalHeight-side)/2,side,side,0,0,192,192);
  return canvas.toDataURL('image/jpeg',0.73);
 }finally{URL.revokeObjectURL(url)}
}
function notificationItems(){return [
 {view:'labor',title:'Công nhật chưa xác nhận',count:store.labor.filter(r=>r.state!=='Đã xác nhận').length,ic:'calendar'},
{view:'minutes',title:'Biên bản chờ xác nhận',count:store.minutes.filter(r=>r.state==='Chờ xác nhận').length,ic:'file'},
{view:'assets',title:'CCDC cần kiểm tra',count:store.assets.filter(r=>r.state==='Cần kiểm tra').length,ic:'boxes'},
{view:'shifts',title:'Nhân sự chờ vào ca',count:store.shifts.filter(r=>r.state==='Chờ vào ca').length,ic:'clock'}
].filter(x=>x.count>0)}
function prefsModal(){
 const accentRow=state.theme==='light'?`<div class="setting-row accent-setting"><div><strong>Màu chủ đạo</strong><small>Chọn một trong bảy màu cho giao diện sáng</small></div><div class="accent-swatches" role="group" aria-label="Màu giao diện sáng">${ACCENTS.map(([key,label])=>`<button type="button" data-accent-choice="${key}" class="accent-swatch accent-${key} ${state.accent===key?'active':''}" aria-label="${label}" title="${label}" aria-pressed="${state.accent===key}">${state.accent===key?'✓':''}</button>`).join('')}</div></div>`:'';
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal preferences-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><span>TÙY CHỌN HIỂN THỊ</span><h2 id="modal-title">Cài đặt</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng cửa sổ">×</button></div><div class="setting-body"><div class="setting-row"><div><strong>Cỡ chữ</strong><small>Tăng giảm kích thước chữ toàn hệ thống</small></div><div class="font-steps"><button data-font="-5" aria-label="Giảm cỡ chữ">A−</button><output>${state.fontPct}%</output><button data-font="5" aria-label="Tăng cỡ chữ">A+</button></div></div><div class="setting-row"><div><strong>Chế độ hiển thị</strong><small>Điều chỉnh nền sáng hoặc tối</small></div><div class="theme-steps"><button class="${state.theme==='light'?'active':''}" data-theme-choice="light">${icon('sun',15)} Sáng</button><button class="${state.theme==='dark'?'active':''}" data-theme-choice="dark">${icon('moon',15)} Tối</button></div></div>${accentRow}<div class="setting-row"><div><strong>Thiết lập mặc định</strong><small>Đưa cỡ chữ về mức tiêu chuẩn mới</small></div><button class="btn ghost" data-action="reset-font">Đặt lại</button></div></div><div class="modal-actions"><button class="btn primary" data-action="close-modal">Hoàn tất</button></div></section></div>`;
}
function noticesModal(){const notices=notificationItems();return `<div class="modal-overlay" data-action="close-modal"><section class="modal preferences-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><span>TRUNG TÂM THÔNG BÁO</span><h2 id="modal-title">Thông báo</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div><div class="notification-list">${notices.length?notices.map(i=>`<a class="notification-item" href="${href(i.view)}" data-nav="${i.view}"><span class="notification-icon">${icon(i.ic,18)}</span><span><strong>${i.title}</strong><small>${i.count} mục cần xử lý</small></span><span>›</span></a>`).join(''):'<div class="notification-empty">Không có thông báo cần xử lý</div>'}</div></section></div>`}
function modal(){
 if(!state.modal)return '';
 if(state.modal==='settings')return prefsModal();
 if(state.modal==='notifications')return noticesModal();
 const key=state.view;
 if(['shifts','dashboard','labor','pda'].includes(key))return '';
 const existing=store[key]?.find(r=>r.id===state.editId);
 const editing=state.modal==='edit'&&!!existing;
 const title=editing?`Sửa ${PAGES[key].title.toLowerCase()}`:`Thêm ${PAGES[key].title.toLowerCase()}`;
 const fields=key==='people'?PERSON_EDITOR:columns[key].filter(([k])=>k!=='id');
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><span>QUẢN LÝ DỮ LIỆU</span><h2 id="modal-title">${title}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng cửa sổ">×</button></div><form id="record-form">${key==='people'?photoEditor(existing):''}<div class="form-grid">${fields.map(([k,l])=>fieldInput(k,l,editing?existing[k]:k==='state'?INITIAL_STATE[key]:'',editing)).join('')}</div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button class="btn primary" type="submit">${editing?'Lưu chỉnh sửa':'Tạo bản ghi'}</button></div></form></section></div>`;
}
function toast(){return state.notice?`<div class="toast" role="status">${escape(state.notice)}<button data-action="clear-notice" aria-label="Đóng thông báo">×</button></div>`:''}
function render(){document.documentElement.setAttribute('data-theme',state.theme);document.documentElement.setAttribute('data-accent',state.accent);document.documentElement.style.setProperty('--text-scale',String(state.fontPct/100*1.1));if(document.body.dataset.screen==='login'){renderLogin();return}if(!demoSession()){root.innerHTML=`<main class="auth-required"><img src="assets/supra-mark.png" alt="The Supra"><h2>Vui lòng đăng nhập</h2><p>Đăng nhập Quản trị viên trước khi sử dụng giao diện và các tab nghiệp vụ.</p><a class="btn primary" href="index.html">Đăng nhập</a></main>`;return}root.innerHTML=`${side()}<div class="screen-shade ${state.sidebar?'show':''}" data-action="close-nav"></div><div class="app-main">${top()}${state.view==='dashboard'?dashboard():modulePage()}<footer class="site-footer">Phát triển hệ thống - tamnv2 | Pick Pack 1291</footer></div>${drawer()}${modal()}${toast()}`}
function renderLogin(){root.innerHTML=`<main class="login-screen"><div class="login-panel"><div class="login-left"><div class="login-brand"><img class="brand-logo" src="assets/supra-mark.png" alt="The Supra"><span class="login-corporate"><span>CÔNG TY CỔ PHẦN THE SUPRA</span><span>DC HƯNG YÊN</span></span></div><div class="login-art"><div class="art-greeting">QUẢN LÝ VẬN HÀNH</div><h1>Quản lý Pick & Pack tập trung.</h1><p>Nhân sự, công ca, hồ sơ và thiết bị trong cùng một hệ thống.</p><div class="art-metrics"><div><strong>07</strong><span>Phân hệ</span></div><div><strong>03</strong><span>Thiết bị PDA</span></div><div><strong>05</strong><span>Phiên Web</span></div></div></div></div><div class="login-right"><span class="login-kicker">PICKPACK OFFICE</span><h2>Đăng nhập hệ thống</h2><p>Nhập thông tin tài khoản để tiếp tục.</p><form id="login-form" autocomplete="off" class="login-form"><label>Tên đăng nhập<input id="demo-user" name="username" value="" placeholder="Nhập tên đăng nhập" autocomplete="off" required></label><label>Mật khẩu<div class="password-wrap"><input id="demo-password" name="password" type="${state.loginVisible?'text':'password'}" placeholder="Nhập mật khẩu" autocomplete="off" required><button type="button" class="password-toggle" data-action="show-password" aria-label="${state.loginVisible?'Ẩn':'Hiện'} mật khẩu">${state.loginVisible?'Ẩn':'Hiện'}</button></div></label>${state.loginError?`<div class="login-error" role="alert">${escape(state.loginError)}</div>`:''}<button class="btn primary login-submit" type="submit">Đăng nhập <span>→</span></button></form><div class="login-links"><button data-action="theme" class="text-button">${state.theme==='dark'?'☼ Sáng':'☾ Tối'}</button><span class="web-version">Web v${WEB_VERSION}</span></div></div></div></main>`}
function safeHistory(method,url){try{history[method](null,'',url)}catch{ /* Browser file:// history restrictions do not block UI. */ }}
function closeStuff(){state.sidebar=false;state.modal='';state.drawer='';state.editId=''}
function setView(view){state.view=view;state.search='';state.filter='all';state.drawer='';state.sidebar=false;state.selected.clear();safeHistory('pushState',href(view));render();window.scrollTo(0,0)}
function saveForm(form){
 const key=state.view;
 if(['shifts','dashboard','labor','pda'].includes(key))return;
 const fd=new FormData(form),editing=state.modal==='edit'&&!!state.editId;
 if(key==='people'){
  const id=String(fd.get('id')||'').trim(),name=String(fd.get('name')||'').trim();
  if(!/^[A-Za-z0-9-]{2,30}$/.test(id)||name.length<2){state.notice='Mã nhân viên hoặc họ tên không hợp lệ';render();return}
  if(!editing&&store.people.some(p=>p.id===id)){state.notice='Mã nhân viên đã tồn tại';render();return}
  const changes={};for(const [k] of PERSON_EDITOR){if(k==='id')continue;changes[k]=String(fd.get(k)||'').trim()}
  changes.photo=state.photoDraft||'';
  changes.initial=name.split(' ').at(-1).slice(0,2);
  changes.updatedBy='Quản trị viên';
  changes.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});
  if(editing){const row=store.people.find(p=>p.id===state.editId);if(!row)return;Object.assign(row,changes);state.notice='Đã cập nhật hồ sơ nhân sự'}
  else{store.people.unshift({id,...changes});state.notice='Đã thêm nhân sự'}
  persist();state.photoDraft='';state.modal='';state.editId='';state.search='';state.filter='all';render();return;
 }
 const changes={};
 for(const [k] of columns[key]){if(k==='id')continue;const value=String(fd.get(k)??'').trim();changes[k]=k==='qty'?Number(value):value||'—'}
 if(String(changes.name).trim().length<2){state.notice='Tên bản ghi cần từ 2 ký tự';render();return}
 if(key==='pda'&&changes.state==='Đang mượn'&&(!store.pdaDevices.some(x=>x.id===changes.name)||store.pda.some(x=>x.name===changes.name&&x.state==='Đang mượn'&&x.id!==state.editId))){state.notice='PDA không hợp lệ hoặc đang có lượt mượn chưa trả';render();return}
 if(editing){updateRecord(key,state.editId,changes);state.notice='Cập nhật thành công'}
 else{const id=`${key.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;store[key].unshift({id,...changes});persist();state.notice='Tạo mới thành công'}
 state.modal='';state.editId='';state.search='';state.filter='all';render();
}
function deleteIds(ids){const key=state.view;if(key==='shifts')return;const matches=store[key].filter(r=>ids.includes(r.id));if(!matches.length)return;if(!window.confirm(`Xóa ${matches.length} bản ghi khỏi ${PAGES[key].title}?`))return;store[key]=store[key].filter(r=>!ids.includes(r.id));persist();state.selected.clear();state.drawer='';safeHistory('replaceState',href());state.notice=`Đã xóa ${matches.length} bản ghi`;render()}
function quickChange(id){const key=state.view;const row=store[key]?.find(x=>x.id===id);if(!row)return;let c={};if(['shifts','labor','pda'].includes(key))return;else if(key==='pda'){const borrowed=row.state==='Đang mượn';if(!borrowed&&store.pda.some(x=>x.name===row.name&&x.state==='Đang mượn'&&x.id!==id)){state.notice='Thiết bị đang được mượn, vui lòng trả trước';render();return}const time=new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',hour12:false});c={state:borrowed?'Đã trả':'Đang mượn',return:borrowed?time:'—',borrow:borrowed?row.borrow:time}}else if(key==='minutes')c={state:'Đã xác nhận'};else if(key==='labor')c={state:'Đã xác nhận'};else if(key==='assets')c={state:row.state==='Sẵn sàng'?'Đang sử dụng':'Sẵn sàng'};updateRecord(key,id,c);state.notice=`Đã thay đổi trạng thái ${row.id}`;render()}
function xmlText(v){return String(v??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]))}
function crc32(bytes){let c=0xFFFFFFFF;for(const byte of bytes){c^=byte;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xEDB88320:0)}return(c^0xFFFFFFFF)>>>0}
function zipStored(files){
 const encoder=new TextEncoder(),locals=[],central=[];let position=0,centralSize=0;
 for(const [name,source] of files){
  const label=encoder.encode(name),data=encoder.encode(source),sum=crc32(data);
  const header=new Uint8Array(30+label.length),h=new DataView(header.buffer);
  h.setUint32(0,0x04034B50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);
  h.setUint32(14,sum,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);
  h.setUint16(26,label.length,true);header.set(label,30);
  locals.push(header,data);
  const entry=new Uint8Array(46+label.length),v=new DataView(entry.buffer);
  v.setUint32(0,0x02014B50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);
  v.setUint16(8,0x0800,true);v.setUint32(16,sum,true);
  v.setUint32(20,data.length,true);v.setUint32(24,data.length,true);
  v.setUint16(28,label.length,true);v.setUint32(42,position,true);entry.set(label,46);
  central.push(entry);centralSize+=entry.length;position+=header.length+data.length;
 }
 const end=new Uint8Array(22),view=new DataView(end.buffer);
 view.setUint32(0,0x06054B50,true);view.setUint16(8,files.length,true);view.setUint16(10,files.length,true);
 view.setUint32(12,centralSize,true);view.setUint32(16,position,true);
 return new Blob([...locals,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function excelColumn(n){let label='';for(n+=1;n;n=Math.floor((n-1)/26))label=String.fromCharCode(65+(n-1)%26)+label;return label}
function makeExcel(rows,fields,title){
 const columnsXml=fields.map(([,name],i)=>`<col min="${i+1}" max="${i+1}" width="${Math.min(42,Math.max(15,String(name).length*1.4))}" customWidth="1"/>`).join('');
 const xmlRow=(values,index)=>`<row r="${index+1}">${values.map((val,j)=>{
  const ref=`${excelColumn(j)}${index+1}`;
  if(index>0&&fields[j][0]==='qty'&&typeof val==='number'&&Number.isFinite(val))return `<c r="${ref}"><v>${val}</v></c>`;
  return `<c r="${ref}" t="inlineStr"${index===0?' s="1"':''}><is><t xml:space="preserve">${xmlText(val)}</t></is></c>`;
 }).join('')}</row>`;
 const body=[fields.map(([,name])=>name),...rows.map(row=>fields.map(([key])=>row[key]??''))].map(xmlRow).join('');
 const cellRange=`A1:${excelColumn(fields.length-1)}${rows.length+1}`;
 const sheetName=title.replace(/[\\/*?:\[\]]/g,' ').slice(0,31);
 const sheet=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><dimension ref="${cellRange}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="16"/><cols>${columnsXml}</cols><sheetData>${body}</sheetData><autoFilter ref="${cellRange}"/></worksheet>`;
 const types=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;
 const rootRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
 const workbook=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlText(sheetName)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
 const workbookRels=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;
 const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF26476B"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs></styleSheet>`;
 return zipStored([['[Content_Types].xml',types],['_rels/.rels',rootRels],['xl/workbook.xml',workbook],['xl/_rels/workbook.xml.rels',workbookRels],['xl/worksheets/sheet1.xml',sheet],['xl/styles.xml',styles]]);
}
function exportExcel(){
 if(state.view==='dashboard')return;
 const rows=filtered(),fields=columns[state.view],blob=makeExcel(rows,fields,PAGES[state.view].title);
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;
 a.download=`pickpack-${state.view}-${new Date().toISOString().slice(0,10)}.xlsx`;
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 state.notice=`Đã xuất Excel ${rows.length} bản ghi`;render();
}
root.addEventListener('submit',function(e){
 if(e.target.id==='login-form'){
  e.preventDefault();const fd=new FormData(e.target);
  const ok=String(fd.get('username')||'').trim()==='admin'&&String(fd.get('password')||'')==='admin';
  if(!ok){state.loginError='Tên đăng nhập hoặc mật khẩu không đúng';render();return}
  storageSet(SESSION_KEY,'demo-admin-only');state.loginError='';location.href=href('dashboard');return;
 }
 if(e.target.id==='shift-scan-form'){
  e.preventDefault();
  const fd=new FormData(e.target),op=state.scanMode;
  scanShift(fd.get('employeeCode'),op);return;
 }
 if(e.target.id==='labor-scan-form'){e.preventDefault();scanLabor(new FormData(e.target).get('employeeCode'));return}
 if(e.target.id==='pda-scan-form'){e.preventDefault();const fd=new FormData(e.target);scanPda(fd.get('employeeCode'),fd.get('deviceCode'));return}
 if(e.target.id==='record-form'){e.preventDefault();saveForm(e.target)}
});
root.addEventListener('click',e=>{
 const submitRecord=e.target.closest('#record-form button[type="submit"]');if(submitRecord){e.preventDefault();const form=submitRecord.form;if(form?.reportValidity())saveForm(form);return}
 const nav=e.target.closest('a[data-nav]');if(nav){if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();setView(nav.dataset.nav)}return}
 const record=e.target.closest('[data-record]');if(record){state.drawer=record.dataset.record;safeHistory('replaceState',href(state.view,state.drawer));render();return}
 const edit=e.target.closest('[data-edit]');if(edit){if(state.view==='shifts')return;state.editId=edit.dataset.edit;state.photoDraft=state.view==='people'?(store.people.find(p=>p.id===state.editId)?.photo||''):'';state.modal='edit';render();return}
 const del=e.target.closest('[data-delete]');if(del){deleteIds([del.dataset.delete]);return}
 const quick=e.target.closest('[data-quick]');if(quick){quickChange(quick.dataset.quick);return}
 const scanMode=e.target.closest('[data-scan-mode]');if(scanMode){state.scanMode=scanMode.dataset.scanMode==='exit'?'exit':'enter';state.scanOutcome=null;render();root.querySelector('#shift-code')?.focus();return}
 const pdaMode=e.target.closest('[data-pda-mode]');if(pdaMode){state.pdaMode=pdaMode.dataset.pdaMode==='return'?'return':'borrow';state.pdaScan=null;render();root.querySelector('#pda-staff-code')?.focus();return}
 const accent=e.target.closest('[data-accent-choice]');if(accent){const chosen=accent.dataset.accentChoice;if(!ACCENTS.some(([key])=>key===chosen))return;state.accent=chosen;storageSet(ACCENT_KEY,chosen);render();return}
 const font=e.target.closest('[data-font]');if(font){state.fontPct=Math.max(90,Math.min(120,state.fontPct+Number(font.dataset.font)));storageSet(FONT_KEY,String(state.fontPct));render();return}const choice=e.target.closest('[data-theme-choice]');if(choice){state.theme=choice.dataset.themeChoice;storageSet(THEME_KEY,state.theme);safeHistory('replaceState',href(state.view,state.drawer));render();return}const btn=e.target.closest('[data-action]');if(!btn)return;const act=btn.dataset.action;if(act==='close-modal'&&btn.classList.contains('modal-overlay')&&e.target.closest('.modal'))return;
 switch(act){case'toggle-nav':state.sidebar=!state.sidebar;break;case'close-nav':state.sidebar=false;break;
 case'theme':state.theme=state.theme==='light'?'dark':'light';storageSet(THEME_KEY,state.theme);safeHistory('replaceState',document.body.dataset.screen==='app'?href(state.view,state.drawer):'index.html?theme='+state.theme);break;
 case'add':if(['shifts','dashboard','labor','pda'].includes(state.view))return;state.editId='';state.photoDraft='';state.modal='new';break;case'close-modal':state.modal='';state.editId='';state.photoDraft='';break;case'remove-photo':state.photoDraft='';{const preview=root.querySelector('#photo-preview');if(preview)preview.innerHTML=avatar({initial:'NV'},true)}return;case'close-drawer':state.drawer='';safeHistory('replaceState',href());break;
 case'notifications':state.modal='notifications';break;case'settings':state.modal='settings';break;case'reset-font':state.fontPct=100;storageSet(FONT_KEY,'100');break;
 case'clear-notice':state.notice='';break;
 case'show-password':{const form=root.querySelector('#login-form');const username=form?.querySelector('#demo-user')?.value||'';const password=form?.querySelector('#demo-password')?.value||'';state.loginVisible=!state.loginVisible;render();root.querySelector('#demo-user').value=username;root.querySelector('#demo-password').value=password;return}
 case'logout':storageRemove(SESSION_KEY);location.href='index.html';return;
 case'bulk-delete':deleteIds([...state.selected]);return;
 
 case'export':exportExcel();return;
 }
 render();
});
root.addEventListener('input',function(e){
 if(e.target.id==='shift-code'){
  const code=e.target.value.trim(),person=store.people.find(p=>p.id===code),preview=root.querySelector('#scan-preview');
  if(preview)preview.innerHTML=code&&!person?'<div class="scan-empty">Chưa tìm thấy mã nhân viên phù hợp.</div>':scanPreview(person);
  return;
 }
 if(e.target.id==='labor-staff-code'){
  const code=e.target.value.trim(),preview=root.querySelector('#labor-scan-preview'),person=store.people.find(p=>p.id===code);
  if(preview)preview.innerHTML=compactPersonPreview(person);return;
 }
 if(e.target.id==='pda-staff-code'){
  const code=e.target.value.trim(),preview=root.querySelector('#pda-person-preview'),person=store.people.find(p=>p.id===code);
  if(preview)preview.innerHTML=compactPersonPreview(person);return;
 }
 if(e.target.id==='pda-device-code'){
  const preview=root.querySelector('#pda-device-preview');if(preview)preview.innerHTML=pdaDevicePreview(resolvePda(e.target.value));return;
 }
 if(e.target.id==='global-search'){
  const input=e.target;state.search=input.value;const pos=input.selectionStart;render();
  const newInput=root.querySelector('#global-search');if(newInput){newInput.focus();newInput.setSelectionRange(pos,pos)}
 }
});
root.addEventListener('keydown',e=>{if(e.target.id==='pda-staff-code'&&e.key==='Enter'){e.preventDefault();root.querySelector('#pda-device-code')?.focus()}});
root.addEventListener('change',async function(e){
 if(e.target.id==='staff-photo'){
  const file=e.target.files?.[0];if(!file)return;
  try{
   const photo=await preparePortrait(file);
   if(state.modal!=='new'&&state.modal!=='edit')return;
   state.photoDraft=photo;
   const target=root.querySelector('#photo-preview');if(target)target.innerHTML=avatar({photo,initial:''},true);
  }catch(err){state.notice=err?.message||'Không đọc được ảnh';const box=root.querySelector('.photo-editor-info small');if(box)box.textContent=state.notice}
  return;
 }
 if(e.target.id==='status-filter'){state.filter=e.target.value;state.selected.clear();render();return}
 if(e.target.id==='select-all'){const ids=filtered().map(x=>x.id);if(e.target.checked)ids.forEach(id=>state.selected.add(id));else ids.forEach(id=>state.selected.delete(id));render();return}
 if(e.target.matches('[data-select]')){if(e.target.checked)state.selected.add(e.target.dataset.select);else state.selected.delete(e.target.dataset.select);render()}
});
window.addEventListener('storage',e=>{if(e.key===STORAGE_KEY){const fresh=readRecords();for(const key of Object.keys(store))store[key]=fresh[key];state.notice='Dữ liệu đã được đồng bộ từ tab khác';render()}if(e.key===SESSION_KEY)render()});
window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);state.view=PAGES[p.get('view')]?p.get('view'):'dashboard';state.theme=p.get('theme')==='dark'?'dark':'light';storageSet(THEME_KEY,state.theme);state.drawer=p.get('record')||'';state.search='';state.filter='all';state.selected.clear();render()});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){closeStuff();render()}});
render();
})();
