/* PickPack 1291 — offline Office preview only. Synthetic browser-local records and test credentials. No production API or real identity. */
(()=>{
'use strict';
const root=document.getElementById('root');
 const WEB_VERSION='0.12.2';
const PAGES={dashboard:{title:'Tổng quan'},people:{title:'Nhân sự'},shifts:{title:'Ra / vào ca'},labor:{title:'Công nhật'},minutes:{title:'Biên bản'},assets:{title:'Công cụ dụng cụ'},pda:{title:'Mượn / trả PDA'},categories:{title:'Danh mục nhân sự'},resources:{title:'Quản lý tài nguyên'},access:{title:'Quản lý quyền truy cập'}};
const NAV_LABELS={dashboard:'Tổng quan vận hành',people:'Quản lý nhân sự',shifts:'Quét vào / ra ca',labor:'Quản lý công nhật',minutes:'Quản lý biên bản',assets:'Quản lý CCDC',pda:'Mượn / trả PDA',resources:'Quản lý tài nguyên',access:'Quản lý quyền truy cập'};
const SIDEBAR=[['dashboard','grid'],['people','users'],['shifts','clock'],['pda','device'],['labor','calendar'],['minutes','file'],['assets','boxes'],['resources','list'],['access','shield']];
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
 minus:'<path d="M5 12h14"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M15 15h2v2h-2zM20 14v4M15 20h5"/>',
 shield:'<path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5zM9 12l2 2 4-4"/>'
};
function icon(name,size=18){return `<svg class="ui-svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]||PATHS.grid}</svg>`}
const ICONS=Object.fromEntries(['grid','users','clock','calendar','file','boxes','device','list','shield'].map(k=>[k,icon(k)]));
// Completely synthetic, reproducible operational examples. No real employee or device records.
const STORAGE_KEY='pickpack1291_office_records_v094';
const LEGACY_STORAGE_KEY='pickpack1291_office_records_v07';
const CATALOG_KEY='pickpack1291_office_catalogs_v094';
const LEGACY_CATALOG_KEY='pickpack1291_office_catalogs_v083';
const CATEGORY_FIELDS=[['position','Vị trí chính'],['supplier','Nhà cung cấp'],['department','Bộ phận'],['site','Site'],['warehouse','Kho']];
const RESOURCE_FIELDS=[['userTypes','Loại user'],['pickUsers','User Pick'],['packUsers','User Pack'],['packDesks','Bàn Pack']];
const RESOURCE_DEFAULTS={assetsType:['PDA'],assetsCondition:['Tốt','Cần kiểm tra','Hư hỏng','Bảo trì']};
const EXTRA_CATALOGS={
 labor:{key:'laborWork',label:'Công việc công nhật',records:'labor',property:'work',title:'Danh mục công nhật'},
 minutes:{key:'minutesType',label:'Loại biên bản',records:'minutes',property:'type',title:'Danh mục biên bản'},
 assets:{key:'assetsType',label:'Loại CCDC',records:'assets',property:'type',title:'Danh mục CCDC'},
 assetsCondition:{key:'assetsCondition',label:'Tình trạng vật lý',records:'assets',property:'condition',title:'Danh mục CCDC'}
};
function catalogFields(scope){return scope==='resources'?RESOURCE_FIELDS:scope==='people'?CATEGORY_FIELDS:scope==='assets'?[['assetsType','Loại CCDC'],['assetsCondition','Tình trạng vật lý']]:EXTRA_CATALOGS[scope]?[[EXTRA_CATALOGS[scope].key,EXTRA_CATALOGS[scope].label]]:CATEGORY_FIELDS}
function catalogOwner(field){const resource={userTypes:'userType',pickUsers:'user',packUsers:'user',packDesks:'desk'}[field];if(resource)return {records:'shifts',property:resource};const extra=Object.values(EXTRA_CATALOGS).find(x=>x.key===field);return extra?{records:extra.records,property:extra.property}:{records:'people',property:field}}
const LEGACY_FONT_KEY='pickpack1291_office_font_v06';
 const FONT_KEY='pickpack1291_office_font_setting_v082';
const THEME_KEY='pickpack1291_office_theme_v06';
const VN_ZONE='Asia/Ho_Chi_Minh';
function vnTodayISO(now=new Date()){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:VN_ZONE,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(p=>[p.type,p.value]));
 return parts.year+'-'+parts.month+'-'+parts.day;
}
const VN_TIME=new Intl.DateTimeFormat('en-US',{timeZone:VN_ZONE,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true});
const VN_HOUR=new Intl.DateTimeFormat('en-GB',{timeZone:VN_ZONE,hour:'2-digit',hourCycle:'h23'});
function resolveTheme(mode,now=new Date()){if(mode!=='auto')return mode;const hour=Number(VN_HOUR.format(now));return hour>=6&&hour<18?'light':'dark'}
function clockNow(now=new Date()){return {time:VN_TIME.format(now),iso:now.toISOString()}}
function clockMarkup(){
 const now=clockNow();
 return `<div class="header-clock" title="Giờ Việt Nam (UTC+7)" aria-label="Giờ Việt Nam"><time id="clock-time" class="office-clock" datetime="${now.iso}" aria-label="${escape(now.time)}" aria-live="off"><span id="clock-hours" class="office-clock-main">${escape(now.time.slice(0,5))}</span><span id="clock-seconds" class="office-clock-seconds">${escape(now.time.slice(5,8))}</span><span id="clock-period" class="office-clock-period">${escape(now.time.slice(-2))}</span></time></div>`;
}
let lastFilterDay=vnTodayISO();
function tickClock(){
 const today=vnTodayISO();if(today!==lastFilterDay){lastFilterDay=today;if(!['custom','all'].includes(state.periodPreset)){[state.periodFrom,state.periodTo]=periodBounds(state.periodPreset);render()}}
 const now=clockNow(),clock=document.getElementById('clock-time');
 if(clock&&clock.getAttribute('aria-label')!==now.time){
  const hours=document.getElementById('clock-hours'),seconds=document.getElementById('clock-seconds');
  if(hours&&hours.textContent!==now.time.slice(0,5))hours.textContent=now.time.slice(0,5);
  if(seconds&&seconds.textContent!==now.time.slice(5,8))seconds.textContent=now.time.slice(5,8);
  const period=document.getElementById('clock-period');if(period&&period.textContent!==now.time.slice(-2))period.textContent=now.time.slice(-2);
  clock.setAttribute('aria-label',now.time);
  clock.dateTime=now.iso;
 }
 const next=resolveTheme(state.themeMode);if(next!==state.theme){state.theme=next;render()}
 const overdue=store.shifts.filter(r=>shiftIsOverdue(r)).length;
 if(overdue!==lastOverdueCount){lastOverdueCount=overdue;if(state.view==='dashboard'||state.view==='shifts')render()}
}

const ACCENT_KEY='pickpack1291_office_light_accent_v08';
const FONT_MIGRATED_KEY='pickpack1291_office_font_boost_v08';
const ACCENTS=[['red','Đỏ'],['orange','Cam'],['yellow','Vàng'],['green','Lục'],['blue','Lam'],['indigo','Chàm'],['violet','Tím']];
const SESSION_KEY='pickpack1291_office_session_v096';
const DEMO_USERS_KEY='pickpack1291_office_users_v096';
const PERMISSION_AREAS=SIDEBAR.map(([key])=>key).filter(key=>key!=='access');
const PERMISSION_ACTIONS=[['view','Xem'],['create','Thêm'],['edit','Sửa'],['delete','Xóa']];
const BACKUP_FORMAT='pickpack1291-browser-backup';
const BACKUP_SCHEMA=2;
function storageGet(key){try{return localStorage.getItem(key)}catch{return null}}
function storageSet(key,val){try{localStorage.setItem(key,val);return true}catch{return false}}
function storageRemove(key){try{localStorage.removeItem(key)}catch{}}
function defaultPermissions(role) {
 const full=role==='superadmin'||role==='admin';
 return Object.fromEntries(PERMISSION_AREAS.map(key=>[key,Object.fromEntries(PERMISSION_ACTIONS.map(([act])=>[act,full||(['shifts','pda'].includes(key)&&['view','create'].includes(act))]))]));
}
function demoDefaults(){return [['superadmin','superadmin'],['admin1','admin'],['admin2','admin'],['dieuphoile','mod'],['dieuphoichan','mod']].map(([username,role])=>({username,fullName:username,password:'1',role,permissions:defaultPermissions(role)}))}
function readDemoUsers(){
 const fallback=demoDefaults();
 try{
  const raw=JSON.parse(storageGet(DEMO_USERS_KEY)||'null');
  if(!Array.isArray(raw)||raw.length<5||raw.length>30)return fallback;
  const names=new Set();
  const output=raw.map(u=>{
   if(!u||!(/^[a-z][a-z0-9_-]{2,29}$/.test(u.username))||names.has(u.username))throw Error('Tài khoản trùng');
   names.add(u.username);
   const role=u.username==='superadmin'?'superadmin':(['admin','mod'].includes(u.role)?u.role:'mod');
   const base=defaultPermissions(role);
   for(const key of PERMISSION_AREAS)for(const [action] of PERMISSION_ACTIONS)if(role!=='superadmin')base[key][action]=!!u.permissions?.[key]?.[action];
   return {username:u.username,fullName:String(u.fullName||u.username).slice(0,100),password:String(u.password||'1').slice(0,100),role,permissions:base,photo:typeof u.photo==='string'&&u.photo.length<250000&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(u.photo)?u.photo:''};
  });
  if(!fallback.every(u=>names.has(u.username)))return fallback;
  return output;
 }catch{return fallback}
}
const demoUsers=readDemoUsers();
function persistDemoUsers(){storageSet(DEMO_USERS_KEY,JSON.stringify(demoUsers))}
function actualUser(){return demoUsers.find(u=>u.username===storageGet(SESSION_KEY))||null}
function previewUser(){const me=actualUser();return me?.role==='superadmin'&&state.previewUser?demoUsers.find(u=>u.username===state.previewUser)||me:me}
function canAccess(view,action='view'){
 const me=actualUser(),display=previewUser();
 if(!me||!display)return false;
 if(view==='access')return me.role==='superadmin'&&!state.previewUser;
 if(view==='categories')view=state.catalogScope;
 if(me.role==='superadmin'&&!state.previewUser)return true;
 const matrix=display.permissions?.[view];return !!matrix?.[action]&&(action==='view'||!!matrix?.view);
}
function firstAllowed(){return PERMISSION_AREAS.find(key=>canAccess(key))||'dashboard'}
function denyOperation(view=state.view,action='edit'){if(canAccess(view,action))return false;state.notice='Tài khoản không có quyền thực hiện thao tác này';refreshToasts();return true}
function demoSession(){return !!actualUser()}
function emptyRecords(){return {people:[],shifts:[],labor:[],minutes:[],assets:[],pda:[],pdaDevices:[]}}

function readRecords(){try{const data=JSON.parse(storageGet(STORAGE_KEY)||'null');if(data&&Object.keys(emptyRecords()).every(k=>Array.isArray(data[k])&&data[k].length<500)){for(const person of data.people){delete person.user;delete person.shift}return data}}catch{}return emptyRecords()}
const store=readRecords();
let lastOverdueCount=-1;
function readCatalogs(){
 const fields=[...CATEGORY_FIELDS,...Object.values(EXTRA_CATALOGS).map(x=>[x.key,x.label]),...RESOURCE_FIELDS];
 const defaults=Object.fromEntries(fields.map(([key])=>{
  const owner=catalogOwner(key);
  return [key,RESOURCE_DEFAULTS[key]?[...RESOURCE_DEFAULTS[key]]:[...new Set((store[owner.records]||[]).map(r=>String(r[owner.property]||'').trim()).filter(v=>v&&v!=='—'))]];
 }));
 try{
  const raw=JSON.parse(storageGet(CATALOG_KEY)||'null');
  if(raw&&typeof raw==='object')for(const [key] of fields)
   if(Array.isArray(raw[key])&&raw[key].length<200&&raw[key].every(v=>typeof v==='string'&&v.length<=80))defaults[key]=[...new Set(raw[key])];
 }catch{}
 return defaults;
}

const catalogs=readCatalogs();
function persistCatalogs(){storageSet(CATALOG_KEY,JSON.stringify(catalogs))}

function persist(){storageSet(STORAGE_KEY,JSON.stringify(store))}
function updateRecord(key,id,changes){const row=store[key]?.find(r=>r.id===id);if(!row)return false;Object.assign(row,changes);persist();return true}
const columns={
 people:[['name','Họ và tên'],['id','Mã nhân viên'],['phone','Số điện thoại'],['position','Vị trí chính'],['supplier','Nhà cung cấp'],['department','Bộ phận'],['site','Site'],['warehouse','Kho'],['startDate','Ngày nhận việc'],['updatedBy','Cập nhật bởi'],['pdaInUse','PDA đang dùng']],
 shifts:[['date','Ngày'],['shift','Ca'],['name','Họ và tên'],['supplier','Nhà thầu'],['staff','Mã nhân viên'],['position','Vị trí chính'],['currentPosition','Vị trí hiện tại'],['pdaInUse','PDA đang dùng'],['checkin','Vào ca'],['checkout','Ra ca'],['user','User làm việc'],['desk','Bàn Pack'],['state','Trạng thái']],
 labor:[['name','Nhân sự'],['staff','Mã nhân viên'],['date','Ngày'],['shift','Ca'],['work','Công việc công nhật'],['startTime','Giờ bắt đầu'],['endTime','Giờ kết thúc']],
 minutes:[['type','Phân loại'],['date','Ngày biên bản'],['note','Ghi chú'],['images','Số ảnh']],
 assets:[['id','Mã CCDC'],['type','Loại CCDC'],['serial','Serial / IMEI'],['condition','Tình trạng vật lý'],['state','Trạng thái sử dụng'],['custodyLabel','Bàn giao / sửa chữa'],['note','Ghi chú']],
 pda:[['name','Thiết bị'],['holder','Người mượn'],['user','User làm việc'],['borrow','Giờ mượn'],['return','Giờ trả'],['returner','Người trả'],['state','Trạng thái']]
};
const ASSET_EDITOR=[['type','Loại CCDC'],['serial','Serial / IMEI'],['condition','Tình trạng vật lý'],['state','Trạng thái sử dụng'],['note','Ghi chú']];
const ASSET_IMPORT_FIELDS=ASSET_EDITOR;
const ASSET_DETAILS=[['id','Mã CCDC (tự động)'],...ASSET_EDITOR,['custodyLabel','Bàn giao / sửa chữa'],['updatedBy','Cập nhật bởi'],['updatedAt','Thời gian cập nhật']];
const PERSON_EDITOR=[['id','Mã nhân viên'],['name','Họ và tên'],['phone','Số điện thoại'],['position','Vị trí chính'],['supplier','Nhà cung cấp'],['department','Bộ phận'],['site','Site'],['warehouse','Kho'],['startDate','Ngày nhận việc'],['note','Ghi chú']];
const PERSON_DETAILS=[...PERSON_EDITOR,['updatedBy','Cập nhật bởi'],['updatedAt','Thời gian cập nhật']];
const PERSON_VIEW_DETAILS=[...PERSON_DETAILS,['pdaInUse','PDA đang dùng']];

const state={periodOpen:false,shiftFilter:{shift:'all',position:'all',supplier:'all'},transferId:'',transferAction:'',pdaPrefill:'',profilePhotoDraft:null,periodPreset:'today',periodFrom:vnTodayISO(),periodTo:vnTodayISO(),view:'dashboard',theme:'light',themeMode:'auto',accent:'blue',fontPct:100,search:'',filter:'all',drawer:'',modal:'',sidebar:false,notice:'',editId:'',selected:new Set(),loginError:'',loginVisible:false,photoDraft:'',photoOriginalFile:null,photoRemoveOriginal:false,scanOutcome:null,scanMode:'enter',scanShift:'Ca 1',scanCurrentStaff:'',scanUser:'',scanDesk:'',laborScan:null,laborWork:'',pdaScan:null,pdaMode:'borrow',profileMenu:false,categoryTab:'position',categoryEdit:'',catalogScope:'people',deviceEdit:'',minuteDraftFiles:[],minuteRemoved:[],minuteSaving:false,minuteZoomUrl:'',confirmData:null,previewUser:'',accessUser:'dieuphoile',accountEdit:'',categoryInputs:1};
const notices=[];let noticeSerial=0;let currentNotice='';
function toastItems(){return notices.map(n=>`<div class="toast ${n.error?'toast-error':'toast-success'}" role="${n.error?'alert':'status'}" data-toast="${n.id}"><span class="toast-symbol">${n.error?'!':'✓'}</span><span>${escape(n.text)}</span><button data-toast-close="${n.id}" aria-label="Đóng thông báo">×</button></div>`).join('')}
function refreshToasts(){const region=root.querySelector('#toast-stack');if(region)region.innerHTML=toastItems()}
Object.defineProperty(state,'notice',{configurable:true,get:()=>currentNotice,set(value){
 currentNotice=String(value||'');if(!currentNotice)return;
 const id=++noticeSerial,error=/không|trùng|lỗi|vượt|chưa hợp lệ|phải có|cần chọn|mật khẩu/i.test(currentNotice);
 notices.push({id,text:currentNotice,error});
 while(notices.length>5)notices.shift();
 setTimeout(()=>{const i=notices.findIndex(n=>n.id===id);if(i>=0)notices.splice(i,1);refreshToasts()},5000);
 refreshToasts();
}});
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const qs=new URLSearchParams(location.search);state.view=PAGES[qs.get('view')]?qs.get('view'):'dashboard';if(state.view==='people'){state.periodPreset='all';state.periodFrom='';state.periodTo=''}const savedTheme=storageGet(THEME_KEY);state.themeMode=['auto','light','dark'].includes(savedTheme)?savedTheme:'auto';if(!savedTheme)storageSet(THEME_KEY,'auto');state.theme=resolveTheme(state.themeMode);const storedFont=Number(storageGet(FONT_KEY));const oldFont=Number(storageGet(LEGACY_FONT_KEY));state.fontPct=Math.max(90,Math.min(120,Math.round((storedFont||(oldFont?oldFont/1.1:100))/5)*5));if(!storedFont)storageSet(FONT_KEY,String(state.fontPct));state.accent=ACCENTS.some(([key])=>key===storageGet(ACCENT_KEY))?storageGet(ACCENT_KEY):'blue';state.drawer=qs.get('record')||'';state.catalogScope=['people','labor','minutes','assets','resources'].includes(qs.get('scope'))?qs.get('scope'):'people';state.categoryTab=catalogFields(state.catalogScope)[0][0];if(state.view==='resources'){state.catalogScope='resources';state.categoryTab='userTypes'}
function addDaysISO(iso,days){const d=new Date(iso+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
function periodBounds(preset){
 const today=vnTodayISO();
 if(preset==="today")return [today,today];
 if(preset==="yesterday"){const day=addDaysISO(today,-1);return [day,day]}
 if(preset==="week")return [addDaysISO(today,-6),today];
 if(preset==="month30")return [addDaysISO(today,-29),today];
 if(preset==="month")return [today.slice(0,7)+"-01",today];
 if(preset==="lastMonth"){const prev=addDaysISO(today.slice(0,7)+"-01",-1);return [prev.slice(0,7)+"-01",prev]}
 return ["",""];
}
function periodDate(raw){
 const str=String(raw||"").trim();
 const vn=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(str);
 const iso=vn?vn[3]+"-"+vn[2]+"-"+vn[1]:(/^\d{4}-\d{2}-\d{2}/.exec(str)||[])[0];
 if(!iso)return "";
 const test=new Date(iso+"T00:00:00Z");
 return !Number.isNaN(+test)&&test.toISOString().slice(0,10)===iso?iso:"";
}
const VN_SCAN_TIME=new Intl.DateTimeFormat('en-GB',{timeZone:VN_ZONE,hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
const vnScanDate=(now)=>vnTodayISO(now).split('-').reverse().join('/');
const vnScanTime=(now)=>VN_SCAN_TIME.format(now);
const SHIFT_END_TIMES={'Ca 1':'14:00','Ca 2':'22:00','Ca HC':'17:00','HC 09–18':'18:00','HC 10–19':'19:00'};
function shiftIsOverdue(row,now=new Date()){
 if(row.state!=='Trong ca'||!row.checkin||row.checkin==='—'||(row.checkout&&row.checkout!=='—'))return false;
 const end=SHIFT_END_TIMES[row.shift],stamp=end?shiftStamp(row.date,end):null;
 return !!stamp&&now.getTime()>new Date(stamp.iso).getTime();
}
lastOverdueCount=store.shifts.filter(r=>shiftIsOverdue(r)).length;
function datedRows(view){
 const rows=store[view]||[];
 if(state.periodPreset==="all")return rows;
 return rows.filter(row=>{
  const raw=view==="people"||view==="assets"?(row.createdAt||row.recordedAt||""):view==="pda"?(row.date||row.borrowAt||""):(row.date||"");
  const day=periodDate(raw);
  if(!day)return view==="people"||view==="assets";
  return day>=state.periodFrom&&day<=state.periodTo;
 });
}
function datePicker(){
 const opts=[['today','Hôm nay'],['yesterday','Hôm qua'],['week','7 ngày'],['month30','30 ngày'],['month','Tháng này'],['lastMonth','Tháng trước'],['custom','Tùy chọn'],['all','Tất cả']];
 return `<div class="date-toolbar" aria-label="Lọc thời gian phân hệ"><div class="date-inline"><button type="button" class="date-calendar-trigger" data-action="period-custom" aria-label="Chọn khoảng ngày tùy chỉnh" aria-expanded="${state.periodOpen}" title="Chọn từ ngày đến ngày">${icon('calendar',15)}</button><select id="period-preset" aria-label="Chọn khoảng thời gian">${opts.map(([key,label])=>`<option value="${key}" ${state.periodPreset===key?'selected':''}>${label}</option>`).join('')}</select></div>${state.periodOpen?`<div class="date-popover" role="group" aria-label="Tùy chọn thời gian"><label>Từ ngày<input type="date" id="period-from" value="${state.periodFrom||vnTodayISO()}" aria-label="Từ ngày"></label><label>Đến ngày<input type="date" id="period-to" value="${state.periodTo||vnTodayISO()}" aria-label="Đến ngày"></label><button type="button" class="btn primary tiny" data-action="period-done">Đóng</button></div>`:''}</div>`;
}
const href=(view=state.view,record='',theme=state.theme)=>`app.html?view=${encodeURIComponent(view)}&theme=${theme}`+(record?`&record=${encodeURIComponent(record)}`:'')+(view==='categories'?'&scope='+encodeURIComponent(state.catalogScope):'')+(location.protocol==='file:'?'&demo=1':'');
const badge=(v)=>{const s=String(v);const type=/Chờ|Cần kiểm tra|Chưa/.test(s)?'warn':/Đã lưu|Đã xác nhận|Sẵn sàng|Đã ra/.test(s)?'neutral':/Trong ca|Đang|Tạm tính/.test(s)?'good':'neutral';return `<span class="status ${type}"><span class="status-dot"></span>${escape(s)}</span>`};
const avatar=(x,big=false)=>/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(x.photo||'')?`<img class="person-avatar ${big?'big':''}" src="${x.photo}" alt="">`:`<span class="person-avatar ${big?'big':''}" aria-hidden="true">${escape(x.initial || String(x.name||'A').slice(-2).toUpperCase())}</span>`;
function side(){
 return `<aside class="sidebar ${state.sidebar?'is-open':''}" aria-label="Điều hướng PickPack"><div class="side-top"><img class="brand-logo" src="assets/supra-mark.png" alt="The Supra"><div><strong class="corporate-brand"><span>CÔNG TY CỔ PHẦN THE SUPRA</span><span>DC HƯNG YÊN</span></strong></div><button class="mobile-hide" data-action="close-nav" aria-label="Đóng menu">×</button></div><div class="sidebar-scroll"><nav class="side-group nav-flat" aria-label="Nghiệp vụ">${SIDEBAR.filter(([view])=>view==='access'||canAccess(view)).map(([view,ic])=>`<div class="side-link ${state.view===view||(state.view==='categories'&&view==='people')?'selected':''} ${view==='access'&&!canAccess('access')?'nav-locked':''}"><a class="nav-main" href="${href(view)}" ${view==='access'&&!canAccess('access')?'aria-disabled="true" tabindex="-1"':'data-nav="'+view+'"'} title="${PAGES[view].title}" aria-current="${state.view===view?'page':'false'}"><span class="nav-icon">${ICONS[ic]}</span><span class="nav-label">${NAV_LABELS[view]}</span></a></div>`).join('')}</nav></div><div class="side-bottom"><span class="web-version" title="Phiên bản Web Office">Web v${WEB_VERSION}</span><footer class="site-footer">Phát triển hệ thống - tamnv2 | Pick Pack 1291</footer></div></aside>`;
}
function top(){
 const me=actualUser(),preview=me?.role==='superadmin',hasOverdue=datedRows('shifts').some(r=>shiftIsOverdue(r)),hasPeriod=['dashboard','people','shifts','labor','minutes','assets','pda'].includes(state.view);
 return `<header class="topbar ${hasPeriod?'topbar-dated':''}"><div class="topbar-primary"><div class="top-left"><button class="icon-button menu-button" data-action="toggle-nav" aria-label="Mở danh mục" title="Mở danh mục">${icon('grid',17)}<span>Mục</span></button><div class="profile-area"><button type="button" class="top-profile" data-action="profile-menu" aria-expanded="${state.profileMenu}" aria-haspopup="menu" aria-label="Tài khoản và tùy chọn cá nhân">${avatar({photo:me?.photo||'',initial:(me?.username||'NV').slice(0,2).toUpperCase()})}<span class="profile-name"><strong>${escape(me?.fullName||'Người dùng')}</strong><small>${escape(me?.role||'')}</small></span><span class="caret">⌄</span></button>${state.profileMenu?`<div class="profile-dropdown" role="menu"><div class="profile-role">${escape(me?.username||'')}</div><button type="button" role="menuitem" data-action="settings">${icon('settings',16)} Cài đặt cá nhân</button><button type="button" role="menuitem" data-action="logout">${icon('logout',16)} Đăng xuất</button></div>`:''}</div>${preview?`<label class="role-preview">Hiển thị theo quyền <select id="role-preview" aria-label="Hiển thị theo tài khoản"><option value="">Superadmin (đầy đủ)</option>${demoUsers.filter(u=>u.username!==me.username).map(u=>`<option value="${escape(u.username)}" ${state.previewUser===u.username?'selected':''}>${escape(u.username)} · ${escape(u.role)}</option>`).join('')}</select></label>`:''}</div><div class="top-right">${hasPeriod?datePicker():''}<div class="top-search">${icon('search',17)}<input id="global-search" type="search" placeholder="Tìm trong ${escape(PAGES[state.view].title.toLowerCase())}..." value="${escape(state.search)}" aria-label="Tìm nhanh"></div><div class="header-theme" role="group" aria-label="Chế độ sáng tối"><button type="button" data-theme-choice="auto" class="${state.themeMode==='auto'?'active':''}" title="Tự động">${icon('clock',15)}</button><button type="button" data-theme-choice="light" class="${state.themeMode==='light'?'active':''}" title="Sáng">${icon('sun',15)}</button><button type="button" data-theme-choice="dark" class="${state.themeMode==='dark'?'active':''}" title="Tối">${icon('moon',15)}</button></div><button class="icon-button notif ${hasOverdue?'overdue-bell':''}" data-action="notifications" title="Thông báo" aria-label="Thông báo">${icon("bell",19)}${notificationItems().length?'<i></i>':''}</button>${clockMarkup()}</div></div></header>`;
}
function pageHead(action='',other=''){return action||other?`<div class="page-header"><div class="header-actions">${other}${action}</div></div>`:''}
function stat(label,value,small,accent='blue',ic='grid'){return `<div class="metric-card"><div class="metric-top"><span>${label}</span><span class="metric-icon ${accent}">${icon(({'♙':'users','◷':'clock','▯':'device','▤':'file','≡':'list','▦':'grid'})[ic]||ic,20)}</span></div><div class="metric-number">${value}</div><div class="metric-foot">${small}</div></div>`}
function activity(){
 const entries=datedRows('shifts').slice(0,4);
 return `<section class="panel activity-panel"><div class="panel-title"><div><h2>Ra / vào ca gần đây</h2></div></div><div class="timeline">${entries.length?entries.map((r,i)=>`<div class="timeline-row"><span class="timeline-indicator ${i===0?'current':''}"></span><div><strong>${escape(r.name)}</strong><small>${escape(r.staff)} · ${escape(r.shift)} · ${escape(r.state)}</small></div><time>${escape(r.checkin==='—'?r.date:r.date+' '+r.checkin)}</time></div>`).join(''):'<div class="scan-empty">Chưa có lượt quét</div>'}</div></section>`;
}
function workload(){const labs=['05h','07h','09h','11h','13h','15h','17h'];
 const today=datedRows('shifts').filter(r=>r.checkin!=='—');
 const counts=labs.map(t=>today.filter(r=>r.checkin<=t.slice(0,2)+':59'&&(r.checkout==='—'||r.checkout>t.slice(0,2)+':59')).length);
 const max=Math.max(1,...counts);
 return `<section class="panel chart-panel"><div class="panel-title"><div><h2>Phân bổ nhân sự theo giờ</h2></div><span class="legend"><i></i>Đang làm việc</span></div><div class="chart-area"><div class="chart-lines"><span>${max}</span><span>${Math.round(max*.75)}</span><span>${Math.round(max*.5)}</span><span>${Math.round(max*.25)}</span></div><div class="chart-bars">${counts.map((n,i)=>`<div class="chart-col"><div class="bar-wrap"><div class="bar" style="height:${n?Math.max(4,Math.round(n/max*100)):0}%"><span>${n}</span></div></div><small>${labs[i]}</small></div>`).join('')}</div></div></section>`}
function panelAttention(){
 const items=notificationItems();
 return `<section class="panel alert-panel"><div class="panel-title"><div><h2>Cần xử lý</h2></div><span class="bubble">${items.reduce((n,x)=>n+x.count,0)}</span></div><div class="alert-list">${items.length?items.map(x=>`<div class="alert-row"><span class="alert-icon amber">${icon(x.ic,17)}</span><span><strong>${x.title}</strong><small>${x.count} bản ghi cần xử lý</small></span><b class="overview-count">${x.count}</b></div>`).join(''):'<p class="no-alerts">Không có mục cần xử lý</p>'}</div></section>`;
}
function coveragePanel(){
 const total=(x)=>x.length,confirmed=(x,s)=>x.filter(r=>r.state===s).length;
 const sets=[
 ['Nhân sự',total(store.people),store.people.filter(r=>r.shift).length,'Đã phân ca'],
 ['Ra / vào ca',total(store.shifts),confirmed(store.shifts,'Trong ca'),'Trong ca'],
 ['Công nhật',total(store.labor),confirmed(store.labor,'Đã xác nhận'),'Đã xác nhận'],
 ['Biên bản',total(store.minutes),total(store.minutes),'Đã lưu trữ'],
 ['Công cụ dụng cụ',total(store.assets),store.assets.filter(r=>assetUse(r)==='Có sử dụng').length,'Có sử dụng'],
 ['Mượn / trả PDA',total(pdaAssets()),new Set(store.pda.filter(r=>r.state==='Đang mượn').map(r=>r.name)).size,'Đang mượn']
 ];
 return `<section class="panel coverage-panel"><div class="panel-title"><div><h2>Trạng thái toàn hệ thống</h2></div></div><div class="coverage-list">${sets.map(([name,total,part,desc])=>`<div class="coverage-row"><strong>${escape(name)}</strong><span>${escape(desc)}</span><b>${part} / ${total}</b><div class="coverage-track"><span style="width:${total?Math.min(100,Math.round(part/total*100)):0}%"></span></div></div>`).join('')}</div></section>`;
}
function dashboardSearchResults(){
 const query=state.search.trim().toLocaleLowerCase('vi');if(!query)return '';
 const all=SIDEBAR.filter(([view])=>view!=='dashboard'&&canAccess(view)).flatMap(([view])=>datedRows(view).filter(row=>Object.entries(row).some(([key,value])=>key!=='photo'&&typeof value!=='object'&&String(value??'').toLocaleLowerCase('vi').includes(query))).map(row=>({view,row})));
 const hits=all.slice(0,12);
 return `<section class="panel dashboard-search-panel" aria-label="Kết quả tìm kiếm toàn hệ thống"><div class="dashboard-search-head"><strong>Kết quả tìm kiếm</strong><span>${all.length} bản ghi${all.length>hits.length?' · Hiển thị 12 đầu tiên':''}</span></div>${hits.length?`<div class="dashboard-search-list">${hits.map(({view,row})=>`<a class="dashboard-search-hit" href="${href(view,row.id)}" title="Mở ${escape(PAGES[view].title)}: ${escape(row.name||row.id)}"><span class="search-module">${escape(PAGES[view].title)}</span><strong>${escape(row.name||row.staff||row.id)}</strong><small>${escape(row.staff||row.id)}</small><span class="search-hit-open" aria-hidden="true">›</span></a>`).join('')}</div>`:'<div class="dashboard-no-results">Không tìm thấy bản ghi phù hợp trong 6 phân hệ.</div>'}</section>`;
}
function dashboard(){
 const todayDate=state.periodPreset==='all'?'Toàn bộ':state.periodFrom+' → '+state.periodTo;
 const inShift=datedRows('shifts').filter(r=>r.state==='Trong ca').length;
 const pendingLabor=datedRows('labor').filter(r=>!r.endTime||r.endTime==='—').length;
 const archivedMinutes=datedRows('minutes').length;
 const flaggedAssets=datedRows('assets').filter(r=>r.condition&&r.condition!=='Tốt'||!!r.activeTransfer).length;
 const borrowed=new Set(datedRows('pda').filter(r=>r.state==='Đang mượn').map(r=>r.name)).size;
 const todayScans=datedRows('shifts').filter(r=>r.checkin!=='—').length;
 return `<div class="page-content overview-page">${pageHead()}<div id="dashboard-search-results" aria-live="polite">${dashboardSearchResults()}</div><div class="metrics overview-metrics">${stat('Tổng nhân sự',store.people.length,'Hồ sơ đang quản lý','blue','users')}${stat('Đã phân ca',store.people.filter(r=>r.shift).length,'Nhân sự có thông tin ca','green','calendar')}${stat('Đang trong ca',inShift,'Lượt ra/vào chưa kết thúc','green','clock')}${stat('Lượt vào ca trong kỳ',todayScans,todayDate,'blue','clock')}${stat('Công nhật chưa chốt',pendingLabor,'Chưa xác nhận','orange','calendar')}${stat('Biên bản lưu trữ',archivedMinutes,'Hồ sơ trong kỳ','orange','file')}${stat('CCDC cần kiểm tra',flaggedAssets,'Theo tình trạng thiết bị','purple','boxes')}${stat('PDA đang mượn',`${borrowed} / ${pdaAssets().length}`,'Thiết bị hiện quản lý','purple','device')}</div><div class="overview-sections">${coveragePanel()}${panelAttention()}</div><div class="two-col lower">${workload()}${activity()}</div></div>`;
}

function activePdaLabel(person,day=''){
 if(!person||workRole(person.position)!=='Pick')return '—';
 const loan=store.pda.find(r=>r.staff===person.id&&r.state==='Đang mượn'&&(!day||periodDate(r.date||r.borrowAt)===day));
 if(!loan)return 'Chưa mượn';
 const asset=store.assets.find(a=>a.id===(loan.assetId||loan.name));
 return asset?.serial?asset.id+' · '+asset.serial:loan.name||'Chưa rõ';
}
function enrichOperationalRow(view,row){
 if(view==='people')return {...row,pdaInUse:activePdaLabel(row)};
 if(view==='shifts'){
  const person=store.people.find(p=>p.id===row.staff);
  const day=periodDate(row.date),activeLabor=store.labor.find(r=>r.staff===row.staff&&periodDate(r.date)===day&&r.startTime&&r.startTime!=='—'&&(!r.endTime||r.endTime==='—'));
  return {...row,position:row.position||person?.position||'—',supplier:row.supplier||person?.supplier||'—',currentPosition:activeLabor?.work||row.position||person?.position||'—',pdaInUse:activePdaLabel(person,day)};
 }
 return row;
}
function shiftFilterControls(){
 const records=datedRows('shifts').map(r=>enrichOperationalRow('shifts',r));
 return '<div class="shift-table-filters">'+[['shift','Ca'],['position','Vị trí chính'],['supplier','Nhà thầu']].map(([key,label])=>{
  const options=[...new Set(records.map(r=>r[key]||'—'))].sort((a,b)=>a.localeCompare(b,'vi'));
  return `<label>${escape(label)} <select data-shift-filter="${key}" aria-label="Lọc ${escape(label)}"><option value="all">Tất cả</option>${options.map(v=>`<option value="${escape(v)}" ${state.shiftFilter[key]===v?'selected':''}>${escape(v)}</option>`).join('')}</select></label>`;
 }).join('')+'</div>';
}
function assetDashboard(){
 const assets=store.assets.filter(a=>!(Number(a.qty)>1));
 const openPda=new Set(store.pda.filter(r=>r.state==='Đang mượn').map(r=>r.assetId||r.name));
 const lending=a=>a.activeTransfer?.kind==='lend'||openPda.has(a.id);
 const repair=a=>a.activeTransfer?.kind==='repair';
 const count=fn=>assets.filter(fn).length;
 const types=[...new Set([...(catalogs.assetsType||[]),...assets.map(a=>a.type)].filter(Boolean))].map(type=>({type,items:assets.filter(a=>a.type===type)}))
  .sort((a,b)=>b.items.length-a.items.length||a.type.localeCompare(b.type,'vi'));
 const total=assets.length;
 const kpis=[
  ['Tổng CCDC',total,'Thiết bị vật lý','boxes'],
  ['Số loại CCDC',types.length,'Theo danh mục CCDC','list'],
  ['Đang cho mượn',count(lending),'Bộ phận và Picker','users'],
  ['Đang sửa chữa',count(repair),'Chưa nhận lại','settings']
 ];
 const tiles=types.map(({type,items})=>{
  const n=items.length,used=items.filter(a=>assetUse(a)==='Có sử dụng').length,unused=n-used,borrow=items.filter(lending).length,fix=items.filter(repair).length;
  const pct=total?Math.round(n/total*100):0;
  return `<article class="asset-type-card" data-asset-type="${escape(type)}"><div class="asset-type-heading"><strong title="${escape(type)}">${escape(type)}</strong><span>${n} CCDC</span></div><div class="asset-type-track" role="img" aria-label="${escape(type)}: ${n} trong ${total} CCDC"><i style="width:${pct}%"></i></div><div class="asset-type-stats"><span>Có sử dụng <b>${used}</b></span><span>Không sử dụng <b>${unused}</b></span><span>Đang cho mượn <b>${borrow}</b></span><span>Đang sửa chữa <b>${fix}</b></span></div></article>`;
 }).join('');
 const group=(title,items)=>{
  const all=items.reduce((n,[,amount])=>n+amount,0);
  return `<section class="asset-dashboard-group"><h3>${escape(title)}</h3>${items.filter(([,amount])=>amount>0).sort((a,b)=>b[1]-a[1]).map(([name,amount])=>`<div class="shift-summary-line"><span title="${escape(name)}">${escape(name)}</span><div class="shift-summary-track"><i style="width:${Math.round(amount/Math.max(all,1)*100)}%"></i></div><b>${amount}</b></div>`).join('')||'<p class="shift-summary-empty">Chưa có dữ liệu</p>'}</section>`;
 };
 const conditions=[...new Set(assets.map(a=>a.condition||'Chưa xác định'))].map(condition=>[condition,count(a=>(a.condition||'Chưa xác định')===condition)]);
 const locations=[['Tại kho',count(a=>!a.activeTransfer&&!openPda.has(a.id))],['Picker đang mượn',count(a=>openPda.has(a.id))],['Bộ phận đang mượn',count(a=>a.activeTransfer?.kind==='lend')],['Đang sửa chữa',count(repair)]];
 return `<section class="asset-dashboard" aria-label="Dashboard theo dõi CCDC"><div class="asset-dashboard-head"><strong>Tổng quan CCDC</strong><small>Hiện trạng CCDC</small></div><div class="asset-kpi-grid">${kpis.map(([label,value,note,ic])=>`<div class="asset-kpi"><span class="asset-kpi-icon">${icon(ic,17)}</span><span class="asset-kpi-title">${label}</span><strong>${value}</strong><small>${note}</small></div>`).join('')}</div><div class="asset-type-board"><div class="asset-type-board-heading"><strong>CCDC theo từng loại</strong><small>${types.length} loại</small></div><div class="asset-type-grid">${tiles||'<p class="asset-type-empty">Chưa có loại CCDC.</p>'}</div></div><div class="asset-dashboard-breakdowns">${group('Tình trạng vật lý',conditions)}${group('Đang ở đâu / bàn giao',locations)}</div></section>`;
}

function tableCell(row,key,view){if(view==='minutes'&&key==='images')return `<span class="mono">${(row.imageIds||[]).length}</span>`;if(key==='note')return `<span class="table-note" title="${escape(row.note||'')}">${escape(row.note||'—')}</span>`;if(view==='assets'&&key==='custodyLabel')return escape(assetCustody(row));if(view==='assets'&&key==='state')return badge(assetUse(row));if(view==='shifts'&&key==='state'&&shiftIsOverdue(row))return `<span class="shift-overdue" data-overdue-shift="${escape(row.id)}" role="alert">Thiếu quét ra</span>`;if(key==='name')return `<div class="cell-name">${view==='people'?avatar(row):''}<div><strong>${escape(row.name)}</strong></div></div>`;if(key==='state'||(view==='assets'&&key==='condition'))return badge(row[key]||'Chưa rõ');if(key==='id')return `<span class="mono">${escape(row[key])}</span>`;return escape(row[key]??'—')}
function filtered(){const set=datedRows(state.view);let rows=set.map(x=>enrichOperationalRow(state.view,x)).filter(x=>(state.view==='minutes'?[x.type,x.date,x.note]:Object.values(x)).some(v=>String(v??'').toLocaleLowerCase('vi').includes(state.search.toLocaleLowerCase('vi'))));if(state.filter!=='all')rows=rows.filter(x=>String(x.state)===state.filter);if(state.view==='shifts')rows=rows.filter(x=>Object.entries(state.shiftFilter).every(([field,value])=>value==='all'||x[field]===value));return rows}
function controls(){
 const statuses=['people','labor','minutes'].includes(state.view)?[]:[...new Set((store[state.view]||[]).map(x=>x.state))];
 return `<div class="table-controls"><div class="table-control-left"><span class="listing-icon">${icon('list',18)}</span><span class="records-label">Danh sách <b>${store[state.view].length}</b></span>${statuses.length?`<span class="separator"></span><label class="filter-label">Trạng thái <select id="status-filter" aria-label="Lọc theo trạng thái"><option value="all">Tất cả</option>${statuses.map(x=>`<option value="${escape(x)}" ${state.filter===x?'selected':''}>${escape(x)}</option>`).join('')}</select></label>`:''}${state.view==='shifts'?shiftFilterControls():''}</div><div class="table-control-right"><button class="btn ghost tiny" data-action="export" title="Xuất bản ghi đang lọc">${icon('download',15)} Xuất Excel</button>${state.view==='assets'&&canAccess(state.view,'create')?`<button type="button" class="btn ghost tiny" data-action="assets-excel-template">${icon('download',15)} Tải mẫu Excel</button><button type="button" class="btn ghost tiny" data-action="assets-excel-import">${icon('plus',15)} Nhập Excel</button><input id="assets-excel-file" hidden type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">`:''}${state.view==='people'&&canAccess(state.view,'create')?`<button type="button" class="btn ghost tiny" data-action="excel-template">${icon('download',15)} Tải mẫu Excel</button><button type="button" class="btn ghost tiny" data-action="excel-import">${icon('plus',15)} Nhập Excel</button><input id="staff-excel-import" hidden type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">`:''}${['people','labor','minutes','assets'].includes(state.view)?`<a class="btn ghost tiny" data-nav="categories" data-catalog-scope="${state.view}" href="${href('categories').replace(/&scope=[^&]*/, '&scope='+state.view)}">${icon('list',15)} Quản lý danh mục</a>`:''}${['people','minutes','assets'].includes(state.view)&&canAccess(state.view,'create')?`<button class="btn primary tiny" data-action="add">${icon('plus',15)} ${state.view==='people'?'Thêm nhân sự':state.view==='minutes'?'Lưu biên bản':'Thêm CCDC'}</button>`:''}${state.view==='shifts'||!canAccess(state.view,'delete')?'':`<button class="btn danger tiny" data-action="bulk-delete" ${state.selected.size?'':'disabled'}>Xóa đã chọn (${state.selected.size})</button>`}</div></div>`;
}
function recordActions(r){
 if(state.view==='shifts')return `<span class="row-actions"><button class="row-open" data-record="${escape(r.id)}" title="Xem lượt quét">${icon('eye',16)}</button>${canAccess('shifts','edit')?`<button class="row-open" data-edit="${escape(r.id)}" title="Sửa giờ vào / ra ca">${icon('edit',16)}</button>`:''}${r.checkout&&r.checkout!=='—'&&canAccess('shifts','delete')?`<button class="row-open danger-text" data-shift-undo="${escape(r.id)}" title="Hủy lượt ra ca">${icon('trash',16)}</button>`:''}</span>`;
 return `<span class="row-actions"><button class="row-open" data-record="${escape(r.id)}" title="Xem chi tiết">${icon('eye',16)}</button>${state.view==='assets'&&isPdaAsset(r)&&canAccess('pda')?`<button class="row-open" data-asset-loan="${escape(r.id)}" title="Mượn / trả PDA">${icon('device',16)}</button>`:''}${state.view==='pda'||!canAccess(state.view,'edit')?'':`<button class="row-open" data-edit="${escape(r.id)}" title="Sửa bản ghi">${icon('edit',16)}</button>`}${canAccess(state.view,'delete')?`<button class="row-open danger-text" data-delete="${escape(r.id)}" title="Xóa bản ghi">${icon('trash',16)}</button>`:''}</span>`;
}
function table(){
 const cols=columns[state.view],rows=filtered(),locked=state.view==='shifts'||!canAccess(state.view,'delete');
 return `<section class="panel table-panel">${controls()}${rows.length?`<div class="table-scroll"><table class="records-table ${state.view==='people'?'people-table':'module-table'}"><thead><tr>${locked?'':'<th class="selection-col"><input type="checkbox" id="select-all" aria-label="Chọn tất cả bản ghi đang hiển thị" '+(rows.every(x=>state.selected.has(x.id))?'checked':'')+'></th>'}${cols.map(([key,lab])=>`<th data-col="${key}">${lab}</th>`).join('')}<th class="actions-col">Thao tác</th></tr></thead><tbody>${rows.map(r=>`<tr class="${state.view==='shifts'&&shiftIsOverdue(r)?'row-overdue':''}">${locked?'':`<td class="selection-col"><input type="checkbox" data-select="${escape(r.id)}" aria-label="Chọn ${escape(r.id)}" ${state.selected.has(r.id)?'checked':''}></td>`}${cols.map(([k])=>`<td data-col="${k}">${k==='name'||(state.view==='assets'&&k==='id')||(state.view==='minutes'&&k==='type')?`<a class="inline-link cell-record-link" href="${href(state.view,r.id)}">${tableCell(r,k,state.view)}</a>`:tableCell(r,k,state.view)}</td>`).join('')}<td class="actions-col">${recordActions(r)}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty"><strong>${store[state.view].length?"Không tìm thấy bản ghi phù hợp":"Chưa có dữ liệu"}</strong><span>${store[state.view].length?"Thử điều chỉnh bộ lọc hoặc từ khóa":""}</span></div>`}<div class="table-footer"><span>Hiển thị ${rows.length} / ${store[state.view].length} bản ghi</span></div></section>`;
}
function modulePage(){
 const scanner=!canAccess(state.view,'create')?'':state.view==='shifts'?shiftScanPanel():state.view==='labor'?laborScanPanel():state.view==='pda'?pdaScanPanel():'';
 return `<div class="page-content">${scanner}${state.view==='assets'?assetDashboard():''}${state.view==='assets'&&store.assets.some(a=>Number(a.qty)>1)?`<p class="asset-legacy-warning">${store.assets.filter(a=>Number(a.qty)>1).length} hồ sơ số lượng cũ cần tách thành từng CCDC có mã riêng; không tự tạo mã giả.</p>`:''}${table()}</div>`;
}
function accessPage(){
 const selected=demoUsers.find(u=>u.username===state.accessUser)||demoUsers[0];
 return `<div class="page-content access-page"><div class="access-header"><button class="btn primary tiny" data-action="account-add">${icon('plus',15)} Thêm tài khoản</button></div><div class="access-layout"><section class="panel access-users"><div class="access-section-title">Tài khoản <span>${demoUsers.length}</span></div>${demoUsers.map(u=>`<button type="button" class="access-user ${u.username===selected.username?'chosen':''}" data-account-pick="${escape(u.username)}"><strong>${escape(u.fullName)}</strong><small>${escape(u.username)} · ${escape(u.role)}</small></button>`).join('')}</section><section class="panel access-permissions"><div class="access-detail-heading"><div><strong>${escape(selected.fullName)}</strong><small>${escape(selected.username)} · ${escape(selected.role)}</small></div><button class="btn ghost tiny" data-account-edit="${escape(selected.username)}">${icon('edit',15)} Sửa tài khoản</button></div><div class="table-scroll"><table class="access-matrix"><thead><tr><th>Phân hệ</th>${PERMISSION_ACTIONS.map(([,label])=>`<th>${label}</th>`).join('')}</tr></thead><tbody>${PERMISSION_AREAS.map(key=>`<tr><td>${escape(NAV_LABELS[key])}</td>${PERMISSION_ACTIONS.map(([action])=>`<td><input type="checkbox" data-permission="${key}:${action}" aria-label="${action} ${escape(NAV_LABELS[key])}" ${selected.permissions?.[key]?.[action]?'checked':''} ${selected.role==='superadmin'?'disabled':''}></td>`).join('')}</tr>`).join('')}<tr><td>Quản lý quyền truy cập</td><td><input type="checkbox" ${selected.role==='superadmin'?'checked':''} disabled aria-label="Quyền quản lý truy cập"></td><td colspan="3"><small>Chỉ superadmin</small></td></tr></tbody></table></div></section></div></div>`;
}
function accountModal(){
 const editing=!!state.accountEdit,u=demoUsers.find(x=>x.username===state.accountEdit);
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal preferences-modal" role="dialog" aria-modal="true" aria-labelledby="account-title"><div class="modal-head"><h2 id="account-title">${editing?'Sửa tài khoản':'Thêm tài khoản'}</h2><button class="icon-button" data-action="close-modal">×</button></div><form id="account-form" class="account-form"><label>Tên đăng nhập<input name="username" maxlength="30" pattern="[a-z][a-z0-9_-]{2,29}" required value="${escape(u?.username||'')}" ${editing?'readonly':''} autocomplete="off"></label><label>Họ và tên<input name="fullName" maxlength="100" required value="${escape(u?.fullName||'')}" autocomplete="off"></label><label>Vai trò<select name="role" ${u?.role==='superadmin'?'disabled':''}><option value="admin" ${u?.role==='admin'?'selected':''}>admin</option><option value="mod" ${u?.role==='mod'||!u?'selected':''}>mod</option>${u?.role==='superadmin'?'<option value="superadmin" selected>superadmin</option>':''}</select></label><label>${editing?'Mật khẩu mới (để trống nếu giữ nguyên)':'Mật khẩu'}<input name="password" type="password" ${editing?'':'required'} minlength="1" autocomplete="new-password" ${editing?'':'value="1"'}></label><div class="modal-actions"><button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button class="btn primary" type="submit">Lưu tài khoản</button></div></form></section></div>`;
}
function saveAccount(form){
 if(denyOperation('access'))return;
 const fd=new FormData(form),username=String(fd.get('username')||'').trim(),fullName=String(fd.get('fullName')||'').trim(),password=String(fd.get('password')||''),role=fd.get('role')==='admin'?'admin':'mod';
 if(!/^[a-z][a-z0-9_-]{2,29}$/.test(username)||!fullName||fullName.length>100){state.notice='Thông tin tài khoản không hợp lệ';return}
 const existing=demoUsers.find(u=>u.username===username);
 if(state.accountEdit){
  if(!existing||state.accountEdit!==username)return;
  existing.fullName=fullName;if(password)existing.password=password;
  if(username!=='superadmin'&&existing.role!==role){existing.role=role;existing.permissions=defaultPermissions(role)}
 }else{
  if(existing||demoUsers.length>=30){state.notice='Tài khoản đã tồn tại hoặc vượt giới hạn';return}
  demoUsers.push({username,fullName,password:password||'1',role,permissions:defaultPermissions(role)});
 }
 persistDemoUsers();state.accessUser=username;state.modal='';state.accountEdit='';state.notice='Đã lưu tài khoản';render();
}
function savePersonalSettings(form){
 const me=actualUser();if(!me)return;
 const fd=new FormData(form),fullName=String(fd.get('fullName')||'').trim(),oldPassword=String(fd.get('oldPassword')||''),newPassword=String(fd.get('newPassword')||'');
 if(!fullName||fullName.length>100){state.notice='Họ và tên không hợp lệ';return}
 if(newPassword&&oldPassword!==me.password){state.notice='Mật khẩu hiện tại không đúng';return}
 me.fullName=fullName;if(newPassword)me.password=newPassword;me.photo=state.profilePhotoDraft??me.photo??'';state.profilePhotoDraft=null;
 persistDemoUsers();state.notice='Đã cập nhật cài đặt cá nhân';state.modal='';render();
}
function categoriesPage(){
 const field=state.categoryTab,fields=catalogFields(state.catalogScope),label=fields.find(([k])=>k===field)?.[1]||'Danh mục',values=catalogs[field]||[];const owner=catalogOwner(field),heading=state.catalogScope==='people'?'Danh mục nhân sự':state.catalogScope==='resources'?'Quản lý tài nguyên':EXTRA_CATALOGS[state.catalogScope]?.title||'Danh mục';const rows=values.map((value,i)=>({value,i})).filter(({value})=>value.toLocaleLowerCase('vi').includes(state.search.trim().toLocaleLowerCase('vi')));
 return `<div class="page-content catalog-page"><div class="catalog-heading">${state.catalogScope==='resources'?'':`<strong>${escape(heading)}</strong>`}${state.catalogScope==='resources'?'':`<a class="btn ghost" data-nav="${state.catalogScope}" href="${href(state.catalogScope)}">← ${escape(PAGES[state.catalogScope].title)}</a>`}</div><div class="catalog-tabs" role="group" aria-label="Chọn danh mục">${fields.map(([key,name])=>`<button type="button" class="${field===key?'active':''}" data-category-tab="${key}" aria-pressed="${field===key}">${escape(name)} <small>${catalogs[key].length}</small></button>`).join('')}</div><section class="panel table-panel catalog-panel"><div class="table-controls"><span class="records-label">${escape(label)} <b>${values.length}</b></span>${canAccess(state.catalogScope,'create')?`<button class="btn primary" data-action="category-add">${icon('plus',16)} Thêm mục</button>`:''}</div><div class="table-scroll"><table><thead><tr><th>Tên danh mục</th><th>Đang sử dụng</th><th>Thao tác</th></tr></thead><tbody>${rows.map(({value,i})=>`<tr><td><strong>${escape(value)}</strong></td><td>${store[owner.records].filter(p=>p[owner.property]===value).length}</td><td><span class="row-actions">${canAccess(state.catalogScope,'edit')?`<button class="row-open" data-category-edit="${i}" title="Sửa ${escape(value)}" aria-label="Sửa ${escape(value)}">${icon('edit',16)}</button>`:''}${canAccess(state.catalogScope,'delete')?`<button class="row-open danger-text" data-category-delete="${i}" title="Xóa ${escape(value)}" aria-label="Xóa ${escape(value)}">${icon('trash',16)}</button>`:''}</span></td></tr>`).join('')}</tbody></table></div><div class="table-footer">Dữ liệu dùng cho nghiệp vụ liên quan; không xóa mục đang được sử dụng. User làm việc không phải tài khoản đăng nhập hệ thống.</div></section></div>`;
}
function catalogModal(){
 const editing=state.modal==='category-edit',caption=catalogFields(state.catalogScope).find(([k])=>k===state.categoryTab)?.[1],value=editing?state.categoryEdit:'';
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal preferences-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${editing?'Sửa':'Thêm'} ${escape(caption)}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div><form id="catalog-form"><div class="catalog-editor"><strong>Tên danh mục</strong><div id="catalog-inputs"><div class="catalog-input-line"><input name="value" maxlength="80" minlength="2" required autocomplete="off" value="${escape(value)}" placeholder="Nhập tên danh mục 1"></div></div>${editing?'':`<div class="catalog-input-tools"><button type="button" class="btn ghost tiny" data-action="catalog-input-add" aria-label="Thêm dòng nhập danh mục">${icon('plus',16)} Thêm dòng</button><button type="button" class="btn ghost tiny" data-action="catalog-input-remove" aria-label="Bớt dòng cuối" disabled>${icon('minus',16)} Bớt dòng</button></div>`}</div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button class="btn primary" type="submit">${editing?'Lưu thay đổi':'Thêm toàn bộ danh mục'}</button></div></form></section></div>`;
}
function saveCatalog(form){
 if(denyOperation(state.catalogScope,state.modal==='category-edit'?'edit':'create'))return;
 const field=state.categoryTab,list=catalogs[field];if(!list)return;
 const values=new FormData(form).getAll('value').map(v=>String(v).replace(/\s+/g,' ').trim());
 const editing=state.modal==='category-edit',old=state.categoryEdit,seen=new Set();
 if(!values.length||values.some(v=>v.length<2||v.length>80)){state.notice='Mỗi tên danh mục phải dài từ 2 đến 80 ký tự';refreshToasts();return}
 for(const value of values){
  const folded=value.toLocaleLowerCase('vi');
  if(seen.has(folded)||list.some(item=>item.toLocaleLowerCase('vi')===folded&&(!editing||item!==old))){state.notice='Tên danh mục trùng trong danh sách hoặc đã tồn tại';refreshToasts();return}
  seen.add(folded);
 }
 if(editing){
  const i=list.indexOf(old);if(i<0)return;
  if(field==='assetsType'&&old.toUpperCase()==='PDA'&&store.assets.some(isPdaAsset)){state.notice='Không thể đổi tên loại PDA khi đang có thiết bị mượn/trả';render();return}
  list[i]=values[0];const owner=catalogOwner(field);
  for(const row of store[owner.records])if(row[owner.property]===old)row[owner.property]=values[0];if(field==='department')for(const asset of store.assets)if(asset.activeTransfer?.kind==='lend'&&asset.activeTransfer.target===old)asset.activeTransfer.target=values[0];persist();
 }else{
  if(list.length+values.length>=200){state.notice='Đạt giới hạn 199 mục trong một danh mục';refreshToasts();return}
  list.push(...values);
 }
 persistCatalogs();state.notice=editing?'Đã cập nhật danh mục và hồ sơ liên quan':`Đã thêm ${values.length} danh mục`;state.modal='';state.categoryEdit='';render();
}
function deleteCatalog(index){
 const field=state.categoryTab,value=catalogs[field]?.[index];if(value===undefined)return;
 const owner=catalogOwner(field);if(store[owner.records].some(p=>p[owner.property]===value)||(field==='department'&&store.assets.some(a=>a.activeTransfer?.kind==='lend'&&a.activeTransfer.target===value))){state.notice='Không thể xóa: danh mục đang được sử dụng';render();return}
 confirmDialog('Xóa danh mục',`Xóa danh mục "${value}"?`,()=>{catalogs[field].splice(index,1);persistCatalogs();state.notice='Đã xóa danh mục'});
}
function scanPreview(person){
 if(!person)return '<div class="scan-empty">Nhập hoặc quét mã nhân viên để xem hồ sơ.</div>';
 return `<div class="scan-person-layout"><div class="scan-photo-box" id="scan-portrait" data-person="${escape(person.id)}">${avatar(person,true)}</div><div class="scan-person-info"><div class="scan-identity"><div><strong>${escape(person.name)}</strong><small>Mã nhân viên: ${escape(person.id)} · ${escape(person.position||'Chưa có vị trí')}</small></div>${canAccess('people','edit')?`<button type="button" class="btn ghost tiny" data-photo-edit="${escape(person.id)}">${icon('edit',15)} Căn chỉnh ảnh</button>`:''} </div><dl class="scan-fields">${PERSON_VIEW_DETAILS.filter(([k])=>k!=='name'&&k!=='id'&&(k!=='pdaInUse'||workRole(person.position)==='Pick')).map(([k,l])=>`<div><dt>${escape(l)}</dt><dd>${escape(k==='pdaInUse'?activePdaLabel(person):person[k]||'Chưa cập nhật')}</dd></div>`).join('')}</dl></div></div>`;
}
async function renderScanPortrait(person){
 const id=person?.id,area=root.querySelector('#scan-portrait');
 if(!id||area?.dataset.person!==id)return;
 try{
  if(portraitObjectId!==id){
   const blob=await portraitTransaction(id,'readonly');
   if(!(blob instanceof Blob)||root.querySelector('#scan-portrait')?.dataset.person!==id)return;
   releasePortraitUrl();
   portraitObjectUrl=URL.createObjectURL(blob);portraitObjectId=id;
  }
  const live=root.querySelector('#scan-portrait');
  if(portraitObjectUrl&&live?.dataset.person===id)live.innerHTML=`<img class="scan-photo-original" src="${portraitObjectUrl}" alt="Chân dung của ${escape(person.name)}">`;
 }catch{}
}

function workRole(position){
 const value=String(position||'').toLocaleLowerCase('vi');
 if(value.includes('pick'))return 'Pick';
 if(value.includes('pack'))return 'Pack';
 return '';
}
function scanAssignment(person){
 if(state.scanMode!=='enter'||!person)return '';
 const role=workRole(person.position);
 if(!role)return '<p class="scan-no-user">Vị trí này không cần phát User Pick/Pack.</p>';
 const items=role==='Pick'?catalogs.pickUsers:catalogs.packUsers;
 const option=(item)=>`<option value="${escape(item)}" ${state.scanUser===item?'selected':''}>${escape(item)}</option>`;
 return `<div class="scan-allocation-row"><label>User ${role} <select id="scan-user-choice" aria-required="true"><option value="">— Chọn user làm việc —</option>${items.map(option).join('')}</select></label>${role==='Pack'?`<label>Bàn Pack (tùy chọn)<select id="scan-desk-choice"><option value="">— Chưa chọn bàn —</option>${catalogs.packDesks.map(item=>`<option value="${escape(item)}" ${state.scanDesk===item?'selected':''}>${escape(item)}</option>`).join('')}</select></label>`:''}</div>`;
}
function shiftScanPanel(){
 const result=state.scanOutcome,person=result?.code?store.people.find(p=>p.id===result.code):null,mode=state.scanMode;
 return `<section class="panel scan-station shift-scan-station"><form id="shift-scan-form" autocomplete="off"><div class="shift-scan-toolbar ${mode==='exit'?'shift-scan-exit':''}"><div class="shift-scan-choice"><span class="scan-code-label">Loại thao tác</span><div class="scan-mode" role="group" aria-label="Loại thao tác quét"><button type="button" class="${mode==='enter'?'active':''}" data-scan-mode="enter" aria-pressed="${mode==='enter'}">Vào ca</button><button type="button" class="${mode==='exit'?'active':''}" data-scan-mode="exit" aria-pressed="${mode==='exit'}">Ra ca</button></div></div>${mode==='enter'?`<div class="shift-scan-choice"><span class="scan-code-label">Ca làm việc</span><div class="scan-mode" role="group" aria-label="Ca làm việc">${[['Ca 1','Ca 1'],['Ca 2','Ca 2'],['Ca HC','HC 08–17'],['HC 09–18','HC 09–18'],['HC 10–19','HC 10–19']].map(([v,label])=>`<button type="button" data-scan-shift="${v}" class="${state.scanShift===v?'active':''}" aria-pressed="${state.scanShift===v}">${label}</button>`).join('')}</div></div>`:''}<div class="shift-scan-entry"><label class="scan-code-label" for="shift-code">Quét mã nhân viên</label><div class="shift-scan-input-row"><span class="qr-input"><span class="qr-mark">${icon('qr',18)}</span><input id="shift-code" name="employeeCode" placeholder="Nhập / quét mã nhân viên" inputmode="numeric" maxlength="30" required autocomplete="off" autocapitalize="off" spellcheck="false"></span><button class="btn primary" type="submit" value="${mode}">${icon('clock',16)} Ghi nhận ${mode==='enter'?'vào':'ra'} ca</button></div></div></div><div id="scan-allocation">${scanAssignment(state.scanCurrentStaff?store.people.find(p=>p.id===state.scanCurrentStaff):null)}</div></form>${result?`<div class="scan-outcome ${result.ok?'scan-success':'scan-error'}" role="status">${escape(result.message)}</div>`:''}<div class="scan-preview" id="scan-preview">${scanPreview(person)}</div></section>`;
}

function scanShift(code,operation,selectedShift,workUser,workDesk){if(denyOperation('shifts','create'))return false;
 const staff=String(code||'').trim(),p=store.people.find(x=>x.id===staff),now=new Date();
 const date=vnScanDate(now),time=vnScanTime(now),day=vnTodayISO(now);
 const outcome=(ok,message)=>{
  state.scanOutcome={ok,code:staff,message};
  if(ok){state.scanCurrentStaff='';state.scanUser='';state.scanDesk=''}
  state.notice='';
  render();root.querySelector('#shift-code')?.focus();return ok;
 };
 if(!p)return outcome(false,'Không tìm thấy mã nhân viên. Vui lòng kiểm tra hoặc bổ sung hồ sơ.');
 const current=store.shifts.find(x=>x.staff===p.id&&x.state==='Trong ca'&&periodDate(x.date)===day);
 if(operation==='enter'){
  if(!Object.hasOwn(SHIFT_END_TIMES,selectedShift))return outcome(false,'Chọn ca hợp lệ trước khi vào ca.');
  if(current)return outcome(false,`Nhân viên ${p.name} đang trong ca, không ghi nhận vào ca lần hai.`);
  const role=workRole(p.position),list=role==='Pick'?catalogs.pickUsers:role==='Pack'?catalogs.packUsers:[];
  if(role&&(!workUser||!list.includes(workUser)))return outcome(false,`Chọn User ${role} từ Quản lý tài nguyên trước khi vào ca.`);
  if(workUser&&store.shifts.some(x=>x.state==='Trong ca'&&periodDate(x.date)===day&&x.user===workUser))return outcome(false,`User ${workUser} đang được sử dụng trong ca khác.`);
  if(role==='Pack'&&workDesk&&!catalogs.packDesks.includes(workDesk))return outcome(false,'Bàn Pack không hợp lệ.');
  if(role==='Pack'&&workDesk&&store.shifts.some(x=>x.state==='Trong ca'&&periodDate(x.date)===day&&x.desk===workDesk))return outcome(false,`Bàn ${workDesk} đang được sử dụng.`);
  const assigned=role?workUser:'—',desk=role==='Pack'&&workDesk?workDesk:'—';
  store.shifts.unshift({id:`CA-${Date.now().toString(36).toUpperCase()}`,staff:p.id,name:p.name,date,shift:selectedShift,position:p.position||'—',supplier:p.supplier||'—',checkin:time,checkout:'—',user:assigned,userType:role||'—',desk,state:'Trong ca',checkinAt:now.toISOString(),checkoutAt:''});
  persist();return outcome(true,`Đã vào ca · ${p.name} · ${selectedShift} · ${assigned} · ${date} ${time}`);
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
 const active=store.shifts.find(x=>x.staff===person.id&&x.state==='Trong ca'&&periodDate(x.date)===vnTodayISO());
 const detail=active?`${active.shift} · User: ${active.user||'—'}`:'Chưa vào ca';
 return `<div class="scan-identity compact-identity">${avatar(person)}<div><strong>${escape(person.name)} · ${escape(person.id)}</strong><small>${escape(person.position||'Chưa cập nhật')} · ${escape(detail)}</small></div></div>`;
}
function laborScanPanel(){
 const result=state.laborScan,person=result?.code?store.people.find(p=>p.id===result.code):null;
 return `<section class="panel scan-station compact-scanner"><form id="labor-scan-form" autocomplete="off"><div class="labor-scan-fields"><label class="scan-code-label">Công việc công nhật<select id="labor-work" name="work" required><option value="">— Chọn công việc —</option>${catalogs.laborWork.map(value=>`<option value="${escape(value)}" ${state.laborWork===value?'selected':''}>${escape(value)}</option>`).join('')}</select></label><label class="scan-code-label" for="labor-staff-code">Mã nhân viên / QR nhân viên<span class="qr-input"><span class="qr-mark">${icon('qr',18)}</span><input id="labor-staff-code" name="employeeCode" placeholder="Quét hoặc nhập mã nhân viên" maxlength="30" required autocomplete="off" spellcheck="false"></span></label><button class="btn primary" type="submit">Ghi nhận công nhật</button></div></form>${result?`<div class="scan-outcome ${result.ok?'scan-success':'scan-error'}" role="status">${escape(result.message)}</div>`:''}<div class="scan-preview" id="labor-scan-preview">${compactPersonPreview(person)}</div></section>`;
}

function scanLabor(code,work){if(denyOperation('labor','create'))return false;
 const staff=String(code||'').trim(),person=store.people.find(p=>p.id===staff),now=new Date();if(work)state.laborWork=work;
 const date=vnScanDate(now),time=vnScanTime(now),day=vnTodayISO(now);
 const result=(ok,message)=>{state.laborScan={ok,code:staff,message};render();root.querySelector('#labor-staff-code')?.focus();return ok};
 if(!person)return result(false,'Không tìm thấy mã nhân viên.');
 const existing=store.labor.find(r=>r.staff===staff&&r.date===date&&r.startTime&&r.startTime!=='—'&&(!r.endTime||r.endTime==='—'));
 if(existing){
  updateRecord('labor',existing.id,{endTime:time});
  return result(true,`Đã kết thúc công nhật · ${person.name} · ${existing.work} · ${time}`);
 }
 if(!catalogs.laborWork.includes(work))return result(false,'Cần chọn Công việc công nhật hợp lệ.');
 const activeShift=store.shifts.find(r=>r.staff===staff&&r.state==='Trong ca'&&periodDate(r.date)===day),shift=activeShift?.shift||'—';
 store.labor.unshift({id:`CN-${Date.now().toString(36).toUpperCase()}`,name:person.name,staff,date,shift,shiftId:activeShift?.id||'',work,startTime:time,endTime:'—'});
 persist();return result(true,`Đã bắt đầu công nhật · ${person.name} · ${work} · ${time}`);
}

function pdaMatches(code){
 const key=String(code||'').trim().toUpperCase();if(!key)return [];
 const devices=pdaAssets();
 // Full serial / CCDC ID / QR tag always take priority over the short lookup key.
 const exact=devices.filter(a=>[a.id,a.serial,a.tag].some(v=>v&&String(v).trim().toUpperCase()===key));
 if(exact.length)return exact;
 return key.length===5?devices.filter(a=>String(a.serial||'').trim().toUpperCase().endsWith(key)):[];
}
function resolvePda(code){
 const matches=pdaMatches(code);
 return matches.length===1?matches[0]:null;
}
function pdaDeviceLookupPreview(code){
 const matches=pdaMatches(code);
 if(matches.length<2)return pdaDevicePreview(matches[0]||null);
 return `<div class="pda-collision" role="group" aria-label="PDA trùng năm ký tự cuối"><strong>Tìm thấy ${matches.length} PDA trùng mã quét ${escape(String(code).trim())}</strong><p>Đối chiếu serial đầy đủ trên máy rồi chọn đúng thiết bị. Chỉ chọn không tự ghi nhận mượn/trả.</p><div class="pda-collision-list">${matches.map(a=>{
  const open=store.pda.find(r=>r.state==='Đang mượn'&&(r.assetId===a.id||r.name===a.id));
  const availability=open?'Đang mượn: '+open.holder:a.activeTransfer?assetCustody(a):assetUse(a)!=='Có sử dụng'||a.condition!=='Tốt'?'Không đủ điều kiện sử dụng':'Sẵn sàng';
  return `<button type="button" class="pda-collision-option" data-pda-choose="${escape(a.id)}" aria-label="Chọn PDA ${escape(a.serial)}"><strong>${escape(a.serial||a.id)}</strong><small>${escape(a.id)} · ${escape(availability)}</small></button>`;
 }).join('')}</div></div>`;
}
function pdaDevicePreview(asset){
 if(!asset)return '<div class="scan-empty">Nhập hoặc quét mã CCDC PDA / serial / 5 ký tự cuối.</div>';
 const active=store.pda.find(r=>r.name===asset.id&&r.state==='Đang mượn');
 const ready=assetUse(asset)==='Có sử dụng'&&asset.condition==='Tốt'&&!asset.activeTransfer;
 return `<div class="scan-device"><strong>${escape(asset.id)} · ${escape(asset.serial||'Chưa có serial')}</strong><span>${escape(asset.condition||'Chưa rõ')} · ${escape(assetCustody(asset))}</span><span>${active?`Đang mượn: ${escape(active.holder)}`:ready?'Sẵn sàng cho Picker':'Không được cấp phát'}</span></div>`;
}
function pdaScanPanel(){
 const result=state.pdaScan,person=result?.staff?store.people.find(p=>p.id===result.staff):null,mode=state.pdaMode;
 return `<section class="panel scan-station compact-scanner"><div class="scan-mode-wrapper"><span class="scan-code-label">Thao tác</span><div class="scan-mode" role="group" aria-label="Chế độ mượn trả PDA"><button type="button" class="${mode==='borrow'?'active':''}" data-pda-mode="borrow" aria-pressed="${mode==='borrow'}">Mượn PDA</button><button type="button" class="${mode==='return'?'active':''}" data-pda-mode="return" aria-pressed="${mode==='return'}">Trả PDA</button></div></div><form id="pda-scan-form" autocomplete="off"><div class="scan-code-grid"><label class="scan-code-label" for="pda-staff-code">Mã nhân viên / QR nhân viên<span class="qr-input"><span class="qr-mark">${icon('qr',18)}</span><input id="pda-staff-code" name="employeeCode" maxlength="30" placeholder="Quét mã nhân viên" required autocomplete="off"></span></label><label class="scan-code-label" for="pda-device-code">Mã CCDC PDA / Serial / 5 ký tự cuối<input id="pda-device-code" name="deviceCode" maxlength="120" placeholder="Quét PDA từ CCDC" value="${escape(state.pdaPrefill)}" required autocomplete="off"></label><button class="btn primary" type="submit">Ghi nhận ${mode==='borrow'?'mượn':'trả'} PDA</button></div></form><div id="pda-scan-ambiguity" class="pda-ambiguity scan-error" role="alert" hidden></div>${result?`<div class="scan-outcome ${result.ok?'scan-success':'scan-error'}" role="status">${escape(result.message)}</div>`:''}<div class="scan-pair-preview"><div id="pda-person-preview">${compactPersonPreview(person)}</div><div id="pda-device-preview">${pdaDeviceLookupPreview(state.pdaPrefill||result?.device||'')}</div></div></section>`;
}
function scanPda(employeeCode,deviceCode){if(denyOperation('pda','create'))return false;
 const staff=String(employeeCode||'').trim(),deviceInput=String(deviceCode||'').trim();
 const person=store.people.find(x=>x.id===staff),asset=resolvePda(deviceInput),now=new Date(),date=vnScanDate(now),time=vnScanTime(now),day=vnTodayISO(now);
 const out=(ok,message)=>{state.pdaPrefill='';state.pdaScan={ok,staff,device:deviceInput,message};render();root.querySelector('#pda-staff-code')?.focus();return ok};
 if(!person)return out(false,'Không tìm thấy mã nhân viên.');
 const candidates=pdaMatches(deviceInput);
 if(candidates.length>1){
  const box=root.querySelector('#pda-scan-ambiguity');
  if(box){box.hidden=false;box.textContent='Có '+candidates.length+' PDA khớp mã '+deviceInput+'. Đối chiếu serial đầy đủ rồi chọn đúng PDA bên dưới trước khi ghi nhận.'}
  const preview=root.querySelector('#pda-device-preview');
  if(preview)preview.innerHTML=pdaDeviceLookupPreview(deviceInput);
  root.querySelector('[data-pda-choose]')?.focus();
  return false;
 }
 if(!asset)return out(false,'Không tìm thấy PDA trong danh sách CCDC loại PDA. Hãy kiểm tra serial đầy đủ hoặc mã CCDC.');
 const open=store.pda.find(r=>r.name===asset.id&&r.state==='Đang mượn');
 if(state.pdaMode==='borrow'){
  if(open)return out(false,`${asset.id} đang được mượn bởi ${open.holder}. Không được mượn trùng.`);
  if(asset.activeTransfer)return out(false,`CCDC ${asset.id} đang bàn giao cho ${asset.activeTransfer.target}; không thể cấp cho Picker.`);
  if(assetUse(asset)!=='Có sử dụng'||asset.condition!=='Tốt')return out(false,`CCDC ${asset.id} không đủ điều kiện sử dụng: ${asset.condition||'Chưa rõ'}.`);
  store.pda.unshift({id:`MT-${Date.now().toString(36).toUpperCase()}`,name:asset.id,staff:person.id,holder:person.name,user:store.shifts.find(x=>x.staff===person.id&&x.state==='Trong ca'&&periodDate(x.date)===day)?.user||'—',shiftId:store.shifts.find(x=>x.staff===person.id&&x.state==='Trong ca'&&periodDate(x.date)===day)?.id||'',date,borrow:time,borrowAt:now.toISOString(),return:'—',returner:'—',assetId:asset.id,state:'Đang mượn'});
  appendAssetHistory(asset,'Picker mượn PDA',person.id+' · '+person.name,{kind:'picker-borrow',contact:person.name});
  persist();return out(true,`Đã mượn ${asset.id} · ${person.name} · ${date} ${time}`);
 }
 if(state.pdaMode==='return'){
  if(!open)return out(false,`${asset.id} chưa có lượt mượn đang mở.`);
  updateRecord('pda',open.id,{return:time,returnAt:now.toISOString(),returnDate:date,returner:person.name,returnStaff:person.id,state:'Đã trả'});
  appendAssetHistory(asset,'Picker trả PDA',person.id+' · '+person.name,{kind:'picker-return',contact:person.name});
  persist();return out(true,`Đã trả ${asset.id} · ${person.name} · ${date} ${time}`);
 }
 return out(false,'Thao tác không hợp lệ.');
}
function isPdaAsset(asset){return String(asset?.type||'').trim().toUpperCase()==='PDA'&&!(Number(asset.qty)>1)}
function pdaAssets(){return store.assets.filter(isPdaAsset)}
function assetUse(asset){return asset?.state==='Không sử dụng'||asset?.state==='Ngừng sử dụng'?'Không sử dụng':'Có sử dụng'}
function assetCustody(asset){
 const t=asset?.activeTransfer;
 return !t?'Tại kho':t.kind==='lend'?'Bộ phận mượn: '+(t.target==='Khác'?'Khác · '+(t.note||'Chưa ghi rõ'):t.target):'Đang gửi sửa: '+t.target;
}
function assetLoanOpen(asset){return store.pda.some(r=>r.state==='Đang mượn'&&(r.assetId===asset.id||r.name===asset.id))}
function appendAssetHistory(asset,action,detail='',extra={}){
 if(!Array.isArray(asset.history))asset.history=[];
 asset.history.unshift({at:new Date().toISOString(),action,detail,by:actualUser()?.fullName||'Người dùng',...extra});
 if(asset.history.length>200)asset.history.length=200;
}
function saveAssetForm(fd,editing){
 const current=editing?store.assets.find(a=>a.id===state.editId):null;
 if(editing&&!current)return;
 const type=String(fd.get('type')||'').trim(),serial=String(fd.get('serial')||'').trim(),condition=String(fd.get('condition')||'').trim();
 const stateValue=String(fd.get('state')||'').trim(),note=String(fd.get('note')||'').trim();
 if(!catalogs.assetsType.includes(type)||!catalogs.assetsCondition.includes(condition)||!['Có sử dụng','Không sử dụng'].includes(stateValue)){
  state.notice='Vui lòng chọn loại, tình trạng và trạng thái CCDC hợp lệ';render();return;
 }
 if(serial.length>120||note.length>500||isPdaAsset({type})&&!serial){
  state.notice='Serial/IMEI PDA là bắt buộc; ghi chú không vượt 500 ký tự';render();return;
 }
 if(serial&&store.assets.some(a=>a.id!==current?.id&&String(a.serial||'').trim().toUpperCase()===serial.toUpperCase())){
  state.notice='Serial / IMEI đã tồn tại';render();return;
 }
 if(type.toUpperCase()==='PDA'&&serial.length<5){
  state.notice='Serial PDA cần ít nhất 5 ký tự để nhận diện khi quét';render();return;
 }
 if(current&&(assetLoanOpen(current)||current.activeTransfer)&&
   (type!==current.type||stateValue==='Không sử dụng'&&assetUse(current)==='Có sử dụng'||serial!==String(current.serial||'')||current.activeTransfer&&condition!==current.condition)){
  state.notice='CCDC đang được mượn hoặc gửi đi; không thể đổi loại, serial hoặc ngừng sử dụng';render();return;
 }
 const id=current?.id||'CCDC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
 const changes={type,serial,condition,state:stateValue,note,name:type,updatedBy:actualUser()?.fullName||'Người dùng',updatedAt:new Date().toLocaleString('vi-VN',{hour12:false})};
 const asset=current||{id,createdAt:vnTodayISO(),history:[]};
 const prior=current?ASSET_EDITOR.map(([k])=>String(current[k]??'')).join('|'):'';
 Object.assign(asset,changes);
 if(!current)store.assets.unshift(asset);
 if(!editing||prior!==ASSET_EDITOR.map(([k])=>String(asset[k]??'')).join('|'))appendAssetHistory(asset,editing?'Cập nhật hồ sơ CCDC':'Thêm CCDC',serial);
 persist();state.modal='';state.editId='';state.search='';state.filter='all';
 state.notice=editing?'Đã cập nhật CCDC':'Đã tạo hồ sơ CCDC riêng biệt';render();
}
function assetTransferModal(){
 const a=store.assets.find(x=>x.id===state.transferId);if(!a)return '';
 const receive=state.transferAction==='receive',repair=state.transferAction==='repair',sent=a.activeTransfer;
 const title=receive?(sent?.kind==='repair'?'Nhận lại sau sửa chữa':'Nhận lại CCDC'):repair?'Gửi CCDC đi sửa chữa':'Cho bộ phận mượn CCDC';
 const departments=[...new Set([...(catalogs.department||[]).filter(Boolean),'Khác'])];
 const noteRequired=repair;
 const destination=receive
  ? `<div class="asset-transfer-context"><span>Hình thức: ${sent?.kind==='repair'?'Sửa chữa':'Cho mượn'}</span><strong>Nơi đã bàn giao: ${escape(sent?.target==='Khác'?(sent.note||'Khác'):sent?.target||'—')}</strong><small>Người nhận trước: ${escape(sent?.contact||'—')} · Ghi chú: ${escape(sent?.note||'—')}</small></div>`
  : '';
 const body=receive?`<label>Người bàn giao lại<input name="contact" required maxlength="120" placeholder="Họ tên người giao lại"></label><label>Tình trạng khi nhận<select name="condition" required>${catalogs.assetsCondition.map(v=>`<option value="${escape(v)}" ${v===a.condition?'selected':''}>${escape(v)}</option>`).join('')}</select></label><label>Trạng thái sử dụng<select name="state" required><option value="Có sử dụng" ${assetUse(a)==='Có sử dụng'?'selected':''}>Có sử dụng</option><option value="Không sử dụng" ${assetUse(a)==='Không sử dụng'?'selected':''}>Không sử dụng</option></select></label>`
 : `${repair?`<label>${'Đơn vị sửa chữa'}<input name="target" required maxlength="120" placeholder="Nhập tên đơn vị nhận sửa chữa"></label>`:`<label>Bộ phận mượn<select name="target" id="transfer-department" required><option value="">— Chọn bộ phận —</option>${departments.map(d=>`<option value="${escape(d)}">${escape(d)}</option>`).join('')}</select></label>`}<label>Người tiếp nhận<input name="contact" required maxlength="120" placeholder="Họ tên người nhận"></label>`;
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal modal-wide asset-transfer-modal" role="dialog" aria-modal="true" aria-labelledby="transfer-title"><div class="modal-head"><div><small>BIẾN ĐỘNG CCDC</small><h2 id="transfer-title">${title}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div><form id="asset-transfer-form"><div class="asset-transfer-summary"><strong>${escape(a.id)}</strong><span>${escape(a.type)} · ${escape(a.serial||'Không serial')}</span><small>${escape(assetCustody(a))}</small></div>${destination}<div class="form-grid">${body}<label class="wide-field">${repair?'Lý do sửa chữa / Ghi chú':receive?'Ghi chú khi nhận lại':'Ghi chú / Chứng từ'}<textarea name="note" id="asset-transfer-note" rows="3" maxlength="500" ${noteRequired?'required':''} placeholder="${repair?'Mô tả hỏng hóc hoặc lý do cần sửa':receive?'Tình trạng nhận, thông tin biên bản (nếu có)':'Nếu chọn Khác, bắt buộc ghi rõ bộ phận/nơi mượn'}"></textarea></label></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button type="submit" class="btn primary">Xác nhận ${receive?'nhận lại':repair?'gửi sửa':'cho mượn'}</button></div></form></section></div>`;
}
function saveAssetTransfer(form){
 if(denyOperation('assets','edit'))return;
 const asset=store.assets.find(a=>a.id===state.transferId);if(!asset)return;
 const fd=new FormData(form),target=String(fd.get('target')||'').trim(),contact=String(fd.get('contact')||'').trim(),note=String(fd.get('note')||'').trim();
 const reject=message=>{state.notice=message;refreshToasts();return};
 if(!contact||contact.length>120||note.length>500)return reject('Cần nhập người giao/nhận hợp lệ; ghi chú tối đa 500 ký tự');
 if(state.transferAction==='receive'){
  const sent=asset.activeTransfer;if(!sent)return reject('CCDC không có lượt bàn giao đang mở');
  const condition=String(fd.get('condition')||''),use=String(fd.get('state')||'');
  if(!catalogs.assetsCondition.includes(condition))return reject('Tình trạng vật lý chưa có trong danh mục');
  if(!['Có sử dụng','Không sử dụng'].includes(use))return reject('Trạng thái sử dụng không hợp lệ');
  if(use==='Có sử dụng'&&condition!=='Tốt')return reject('Chỉ đặt Có sử dụng khi tình trạng vật lý là Tốt');
  asset.condition=condition;asset.state=use;asset.activeTransfer=null;
  appendAssetHistory(asset,sent.kind==='repair'?'Nhận lại sau sửa chữa':'Nhận lại từ bộ phận',sent.target+' · '+contact,{kind:'receive',sourceKind:sent.kind,target:sent.target,contact,note,condition,state:use});
 }else{
  const kind=state.transferAction;
  if(!['lend','repair'].includes(kind)||asset.activeTransfer)return reject('CCDC đang có lượt bàn giao chưa kết thúc');
  if(!target||target.length>120)return reject('Cần chọn bộ phận hoặc nhập đơn vị nhận');
  if(kind==='lend'&&target!=='Khác'&&!catalogs.department.includes(target))return reject('Bộ phận mượn phải có trong danh mục Nhân sự');
  if(kind==='lend'&&target==='Khác'&&!note)return reject('Khi chọn Khác, cần ghi rõ nơi mượn trong Ghi chú');
  if(kind==='repair'&&!note)return reject('Cần ghi rõ lý do sửa chữa trong Ghi chú');
  if(Number(asset.qty)>1)return reject('Hồ sơ số lượng cũ cần tách từng CCDC trước khi bàn giao');
  if(assetLoanOpen(asset))return reject('PDA đang được Picker mượn, cần trả trước khi bàn giao');
  if(kind==='lend'&&(assetUse(asset)==='Không sử dụng'||asset.condition!=='Tốt'))return reject('CCDC không đủ điều kiện để cho bộ phận mượn');
  const at=new Date().toISOString();
  asset.activeTransfer={kind,target,contact,at,note,condition:asset.condition};
  appendAssetHistory(asset,kind==='lend'?'Cho bộ phận mượn':'Gửi đi sửa chữa',target+' · '+contact,{kind,target,contact,note,condition:asset.condition});
 }
 asset.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});asset.updatedBy=actualUser()?.fullName||'Người dùng';
 persist();state.modal='';state.transferId='';state.transferAction='';
 state.notice='Đã ghi nhận biến động CCDC và lưu lịch sử';render();
}
function quickLabel(){return state.view==='pda'?'Mượn / trả':state.view==='shifts'?'Quét ca':state.view==='labor'?'Xác nhận công':'Đổi trạng thái'}
function drawer(){
 if(!state.drawer)return '';
 const source=store[state.view]?.find(x=>x.id===state.drawer);if(!source)return '';const row=enrichOperationalRow(state.view,source);
 const fields=state.view==='people'?PERSON_VIEW_DETAILS:state.view==='assets'?ASSET_DETAILS:state.view==='minutes'?[['type','Phân loại'],['date','Ngày biên bản'],['note','Ghi chú']]:columns[state.view].slice(1);
 return `<div class="modal-overlay detail-overlay" data-action="close-drawer"><section class="modal detail-drawer" role="dialog" aria-modal="true" aria-label="Chi tiết ${escape(row.id)}"><div class="detail-head"><div><small>CHI TIẾT HỒ SƠ</small><h2>${escape(state.view==='assets'?row.type||'CCDC':state.view==='minutes'?row.type||'Biên bản':row.name)}</h2></div><button class="icon-button" data-action="close-drawer" aria-label="Đóng chi tiết">×</button></div><div class="detail-content"><div class="detail-hero">${state.view==='people'?avatar(row,true):`<span class="detail-icon">${icon(state.view==='pda'?'device':'file',23)}</span>`}<div><strong>${escape(state.view==='assets'?row.type||'CCDC':state.view==='minutes'?row.type||'Biên bản':row.name)}</strong><small>${escape(row.id)}</small></div></div>${state.view==='people'?`<div class="portrait-original" id="portrait-original"><div class="portrait-placeholder">${avatar(row,true)}<p>Chưa có ảnh gốc trong trình duyệt này.</p></div></div>`:''}${row.state&&state.view!=='minutes'?badge(state.view==='assets'?assetUse(row):row.state):''}${state.view==='minutes'?'<div class="minute-drawer-photos"><strong>Ảnh biên bản</strong><div class="minute-photo-list" id="minute-drawer-gallery"></div></div>':''}<div class="detail-fields">${fields.filter(([k])=>k!=='name').map(([k,label])=>`<div><span>${escape(label)}</span><b>${escape(state.view==='assets'&&k==='custodyLabel'?assetCustody(row):state.view==='assets'&&k==='state'?assetUse(row):row[k]||'—')}</b></div>`).join('')}</div>${state.view==='assets'?`<div class="asset-history"><strong>Nhật ký CCDC</strong>${(Array.isArray(row.history)?row.history:[]).slice(0,30).map(ev=>`<div class="asset-history-item"><small>${escape(new Date(ev.at).toLocaleString('vi-VN',{timeZone:VN_ZONE}))} · ${escape(ev.by||'—')}</small><span>${escape(ev.action)}${ev.detail?' · '+escape(ev.detail):''}${ev.note?' · '+escape(ev.note):''}${ev.condition?' · '+escape(ev.condition):''}</span></div>`).join('')||'<small>Chưa có biến động được ghi nhận.</small>'}</div>`:''}<div class="drawer-actions">${state.view==='assets'&&isPdaAsset(row)&&canAccess('pda')?`<button type="button" class="btn ghost" data-asset-loan="${escape(row.id)}">${icon('device',16)} Mượn / trả PDA</button>`:''}${state.view==='assets'&&canAccess('assets','edit')?(row.activeTransfer?`<button class="btn primary" data-asset-transfer="receive" data-asset-id="${escape(row.id)}">Nhận lại CCDC</button>`:`<button class="btn ghost" data-asset-transfer="lend" data-asset-id="${escape(row.id)}">Cho bộ phận mượn</button><button class="btn ghost" data-asset-transfer="repair" data-asset-id="${escape(row.id)}">Gửi sửa chữa</button>`):''}${state.view==='people'&&canAccess('people','edit')&&row.photo?`<button class="btn ghost" type="button" data-photo-edit="${escape(row.id)}">${icon('edit',16)} Căn chỉnh ảnh</button>`:''}${state.view==='shifts'?`${canAccess('shifts','edit')?`<button class="btn primary" data-edit="${escape(row.id)}">${icon('edit',16)} Sửa giờ vào / ra</button>`:''}${row.checkout&&row.checkout!=='—'&&canAccess('shifts','delete')?`<button class="btn danger" data-shift-undo="${escape(row.id)}">Hủy lượt ra ca</button>`:''}`:`${state.view==='pda'?'':`${canAccess(state.view,'edit')?`<button class="btn primary" data-edit="${escape(row.id)}">${icon('edit',16)} Chỉnh sửa</button>`:''}`}${['people','labor','pda','assets'].includes(state.view)?'':`${canAccess(state.view,'edit')?`<button class="btn ghost" data-quick="${escape(row.id)}">${quickLabel()}</button>`:''}`}${canAccess(state.view,'delete')?`<button class="btn danger" data-delete="${escape(row.id)}">Xóa</button>`:''}`}</div></div></section></div>`;
}
const FIELD_OPTIONS={team:['Pick','Pack thường','Pack Auto','Điều phối'],shift:['Ca 1','Ca 2'],state:['Đang làm việc','Chờ vào ca','Nghỉ ca','Trong ca','Đã ra ca','Tạm tính','Đã xác nhận','Chưa chấm','Chờ xác nhận','Đã lưu','Sẵn sàng','Đang sử dụng','Cần kiểm tra','Đang mượn','Đã trả'],type:['Bàn giao ca','Thiết bị','Tác nghiệp','An toàn','Kỷ luật'],work:['Pick','Pack thường','Pack Auto','Điều phối']};
const STATES_BY_MODULE={people:['Đang làm việc','Chờ vào ca','Nghỉ ca'],shifts:['Chờ vào ca','Trong ca','Đã ra ca'],labor:['Chưa chấm','Tạm tính','Đã xác nhận'],minutes:['Chờ xác nhận','Đã lưu','Đã xác nhận'],assets:['Có sử dụng','Không sử dụng'],pda:['Đang mượn','Đã trả']};
const INITIAL_STATE={people:'Đang làm việc',shifts:'Chờ vào ca',labor:'Tạm tính',minutes:'Chờ xác nhận',assets:'Có sử dụng',pda:'Đang mượn'};
function fieldInput(key,label,value,editing=false){
 const v=String(value??'');
 if(key==='id')return `<label>${escape(label)}<input name="id" value="${escape(v)}" maxlength="30" inputmode="numeric" pattern="[0-9]{2,30}" ${editing?'readonly':''} required autocomplete="off"></label>`;
 const listKey=state.view==='people'&&CATEGORY_FIELDS.some(([k])=>k===key)?key:state.view==='labor'&&key==='work'?'laborWork':state.view==='minutes'&&key==='type'?'minutesType':state.view==='assets'&&key==='type'?'assetsType':state.view==='assets'&&key==='condition'?'assetsCondition':'';
 if(listKey){const choices=catalogs[listKey]||[];return `<label>${escape(label)}<select name="${key}" required><option value="">— Chọn ${escape(label.toLowerCase())} —</option>${[...new Set([...choices,...(v&&!choices.includes(v)?[v]:[])])].filter(Boolean).map(x=>`<option value="${escape(x)}" ${x===v?'selected':''}>${escape(x)}</option>`).join('')}</select></label>`}
 const opts=key==='state'?STATES_BY_MODULE[state.view==='dashboard'?'minutes':state.view]:FIELD_OPTIONS[key];
 if(opts)return `<label>${escape(label)}<select name="${key}" ${key==='shift'?'':'required'}>${state.view==='assets'?'':`<option value="">${key==='shift'?'Chưa phân ca':'— Chọn —'}</option>`}${[...new Set([...opts,state.view==='assets'?assetUse({state:v}):v])].filter(Boolean).map(x=>`<option value="${escape(x)}" ${x===(state.view==='assets'?assetUse({state:v}):v)?'selected':''}>${escape(x)}</option>`).join('')}</select></label>`;
 
 if(key==='startDate'||(state.view==='minutes'&&key==='date')){const parts=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v),iso=parts?`${parts[3]}-${parts[2]}-${parts[1]}`:v;return `<label>${escape(label)}<input type="date" name="${key}" value="${escape(iso)}" ${key==='date'?'required':''} autocomplete="off"></label>`}
 if(key==='startTime'||key==='endTime')return `<label>${escape(label)}<input name="${key}" type="time" step="1" value="${v==='—'?'':escape(v)}" ${key==='startTime'?'required':''}></label>`;
 if(key==='qty')return `<label>${escape(label)}<input type="number" min="0" max="99999" name="${key}" value="${escape(v)}" required></label>`;
 if(state.view==='people'&&key==='name')return `<label>${escape(label)}<input name="name" value="${escape(v)}" maxlength="120" minlength="2" placeholder="${escape(label)}" required autocomplete="off"></label>`;
 if(state.view==='people'&&key==='phone')return `<label>${escape(label)}<input type="tel" name="phone" inputmode="numeric" pattern="[0-9]*" maxlength="120" value="${escape(v)}" placeholder="${escape(label)}" autocomplete="off"></label>`;
 if(key==='note')return `<label class="wide-field">${escape(label)}<textarea name="note" rows="2" maxlength="500">${escape(v)}</textarea></label>`;
 return `<label>${escape(label)}<input name="${key}" maxlength="120" value="${escape(v)}" placeholder="${escape(label)}" ${key==='name'?'minlength="2" required':''} ${key==='phone'?'type="tel"':''} autocomplete="off"></label>`;
}

/* Full-resolution portraits are browser-local blobs; never added to the public repository or localStorage. */
let portraitObjectUrl='',portraitObjectId='';
function portraitDB(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB' in window))return reject(new Error('Trình duyệt không hỗ trợ lưu ảnh gốc'));
  const req=indexedDB.open('pickpack1291_demo_portraits_v094',2);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('portraits'))req.result.createObjectStore('portraits');if(!req.result.objectStoreNames.contains('minuteImages'))req.result.createObjectStore('minuteImages')};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('Không mở được kho ảnh'));
 });
}
async function portraitTransaction(id,mode,blob){
 const db=await portraitDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('portraits',mode),store=tx.objectStore('portraits');
  const req=blob===undefined&&mode==='readonly'?store.get(id):blob===null?store.delete(id):store.put(blob,id);
  let answer=null;req.onsuccess=()=>{answer=req.result};
  tx.oncomplete=()=>{db.close();resolve(answer)};
  tx.onerror=()=>{db.close();reject(tx.error||new Error('Không lưu được ảnh'))};
  tx.onabort=()=>{db.close();reject(tx.error||new Error('Thao tác ảnh bị hủy'))};
 });
}
function releasePortraitUrl(){if(portraitObjectUrl)URL.revokeObjectURL(portraitObjectUrl);portraitObjectUrl='';portraitObjectId=''}

const MINUTE_IMAGE_LIMIT=8,minuteUrls=new Set();
function releaseMinuteUrls(){for(const url of minuteUrls)URL.revokeObjectURL(url);minuteUrls.clear()}
async function minuteTxn(mode,cb){
 const db=await portraitDB();
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('minuteImages',mode),box=tx.objectStore('minuteImages'),req=cb(box);
  tx.oncomplete=()=>{db.close();resolve(req?.result)};
  tx.onerror=()=>{db.close();reject(tx.error||new Error('Không lưu được ảnh biên bản'))};
  tx.onabort=()=>{db.close();reject(tx.error||new Error('Không lưu được ảnh biên bản'))};
 });
}
function minuteGet(id){return minuteTxn('readonly',box=>box.get(id))}
function minuteWrite(add,del){return minuteTxn('readwrite',box=>{for(const id of del)box.delete(id);for(const [id,blob] of add)box.put(blob,id)})}
async function minuteReadAll(){
 const db=await portraitDB();return new Promise((resolve,reject)=>{
  const tx=db.transaction('minuteImages','readonly'),box=tx.objectStore('minuteImages'),keys=box.getAllKeys(),values=box.getAll();
  tx.oncomplete=()=>{db.close();resolve(keys.result.map((id,i)=>[id,values.result[i]]))};
  tx.onerror=()=>{db.close();reject(tx.error||new Error('Không đọc được ảnh biên bản'))};
 });
}
function minuteReplace(entries){return minuteTxn('readwrite',box=>{box.clear();for(const [id,blob] of entries)box.put(blob,id)})}
function minutePhotoEditor(){
 return `<section class="minute-photo-editor"><strong>Ảnh biên bản (<span id="minute-image-count">0</span>/${MINUTE_IMAGE_LIMIT})</strong><label class="btn ghost photo-picker">Chọn ảnh<input id="minute-photo" type="file" accept="image/jpeg,image/png,image/webp" multiple></label><small>Chọn nhiều ảnh hoặc dán Ctrl + V. JPEG, PNG, WebP, tối đa 5 MB/ảnh. Lưu bản gốc trên máy và kèm trong bản sao lưu.</small><div id="minute-editor-gallery" class="minute-photo-list"></div></section>`;
}
async function renderMinuteImages(){
 const target=root.querySelector('#minute-editor-gallery')||root.querySelector('#minute-drawer-gallery');if(!target)return;
 const editing=!!root.querySelector('#minute-editor-gallery'),row=store.minutes.find(x=>x.id===(editing?state.editId:state.drawer));
 const ids=(row?.imageIds||[]).filter(id=>!editing||!state.minuteRemoved.includes(id));
 const entries=[];
 for(const id of ids){const blob=await minuteGet(id);if(blob instanceof Blob)entries.push([id,blob])}
 if(editing)entries.push(...state.minuteDraftFiles);
 if(!target.isConnected)return;
 releaseMinuteUrls();
 target.innerHTML=entries.map(([id,blob],i)=>{const url=URL.createObjectURL(blob);minuteUrls.add(url);return `<div class="minute-photo-item"><button type="button" class="minute-photo-thumb" data-minute-open="${escape(id)}" title="Xem ảnh"><img src="${url}" alt="Ảnh biên bản ${i+1}"></button>${editing?`<button type="button" class="minute-remove" data-minute-remove="${escape(id)}" aria-label="Bỏ ảnh ${i+1}">×</button>`:''}<span>Ảnh ${i+1}</span></div>`}).join('')||'<small>Chưa có ảnh</small>';
 const counter=root.querySelector('#minute-image-count');if(counter)counter.textContent=String(entries.length);
}
async function addMinuteDraftImages(files){
 const old=store.minutes.find(x=>x.id===state.editId),remaining=(old?.imageIds||[]).filter(id=>!state.minuteRemoved.includes(id)).length;
 if(remaining+state.minuteDraftFiles.length+files.length>MINUTE_IMAGE_LIMIT)throw Error('Tối đa '+MINUTE_IMAGE_LIMIT+' ảnh cho mỗi biên bản');
 for(const file of files)if(!(file instanceof Blob)||!/^image\/(jpeg|png|webp)$/.test(file.type)||!file.size||file.size>5*1024*1024)throw Error('Ảnh phải là JPEG, PNG hoặc WebP và tối đa 5 MB');
 for(const file of files)state.minuteDraftFiles.push(['MIN-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),file]);
 await renderMinuteImages();
}
async function saveMinutesForm(form,editing){
 if(state.minuteSaving)return;
 const fd=new FormData(form),type=String(fd.get('type')||'').trim(),dateISO=String(fd.get('date')||'').trim(),note=String(fd.get('note')||'').trim();
 if(!catalogs.minutesType.includes(type)){state.notice='Cần chọn phân loại biên bản hợp lệ';refreshToasts();return}
 const valid=/^\d{4}-\d{2}-\d{2}$/.test(dateISO)&&!Number.isNaN(Date.parse(dateISO))&&new Date(dateISO+'T00:00:00Z').toISOString().slice(0,10)===dateISO;
 if(!valid||note.length>500){state.notice='Ngày biên bản không hợp lệ hoặc ghi chú vượt 500 ký tự';refreshToasts();return}
 const date=dateISO.slice(8,10)+'/'+dateISO.slice(5,7)+'/'+dateISO.slice(0,4);
 const row=editing?store.minutes.find(x=>x.id===state.editId):null;if(editing&&!row)return;
 const images=[...(row?.imageIds||[]).filter(id=>!state.minuteRemoved.includes(id)),...state.minuteDraftFiles.map(([id])=>id)];
 const id=row?.id||'BB-'+Date.now().toString(36).toUpperCase();
 state.minuteSaving=true;
 try{
  await minuteWrite(state.minuteDraftFiles,state.minuteRemoved);
  const changes={type,date,note,imageIds:images,updatedAt:new Date().toISOString()};
  if(row)Object.assign(row,changes);else store.minutes.unshift({id,...changes});
  persist();state.minuteDraftFiles=[];state.minuteRemoved=[];state.minuteSaving=false;state.modal='';state.editId='';state.search='';state.notice=editing?'Đã cập nhật hồ sơ biên bản':'Đã lưu hồ sơ biên bản';render();
 }catch(err){state.minuteSaving=false;state.notice=err?.message||'Không lưu được biên bản';refreshToasts()}
}

async function renderFullPortrait(){
 const target=root.querySelector('#portrait-original');if(!target||state.view!=='people'||!state.drawer)return;
 const id=state.drawer;
 if(portraitObjectId!==id){
  releasePortraitUrl();
  try{
   const blob=await portraitTransaction(id,'readonly');
   if(!(blob instanceof Blob)||!root.querySelector('#portrait-original')||state.drawer!==id)return;
   portraitObjectUrl=URL.createObjectURL(blob);portraitObjectId=id;
  }catch{return}
 }
 const live=root.querySelector('#portrait-original');
 if(portraitObjectUrl&&live&&state.drawer===id){
  live.innerHTML=`<button type="button" class="portrait-open" data-action="zoom-portrait" aria-label="Phóng to ảnh chân dung"><img src="${portraitObjectUrl}" alt="Ảnh chân dung gốc của ${escape(store.people.find(p=>p.id===id)?.name||'nhân sự')}"></button><small>Chạm vào ảnh để xem nguyên bản · Chỉ lưu trên trình duyệt này</small>`;
 }
}
function portraitModal(){return `<div class="modal-overlay" data-action="close-modal"><section class="modal portrait-lightbox" role="dialog" aria-modal="true" aria-label="Ảnh chân dung"><button class="icon-button portrait-close" data-action="close-modal" aria-label="Đóng ảnh">×</button><img src="${portraitObjectUrl}" alt="Ảnh chân dung kích thước gốc"></section></div>`}
let cropSession=null;
function photoEditor(person){
 const x={name:person?.name||'',photo:state.photoDraft||'',initial:person?.initial||''};
 return `<section class="photo-editor"><div id="photo-preview">${avatar(x,true)}</div><div class="photo-editor-info"><strong>Ảnh đại diện</strong><div class="photo-editor-actions"><label class="btn ghost photo-picker">Chụp / Chọn ảnh<input id="staff-photo" type="file" accept="image/jpeg,image/png,image/webp" capture="user"></label>${x.photo?'<button class="btn ghost" data-action="adjust-photo" type="button">Căn chỉnh ảnh</button>':''}<button class="btn ghost" data-action="remove-photo" type="button">Xóa ảnh</button></div><small>JPEG/PNG/WebP · Tối đa 5 MB</small></div></section>`;
}
function startPhotoEdit(id){
 if(denyOperation('people','edit'))return;
 const person=store.people.find(x=>x.id===id);if(!person)return;
 state.view='people';state.drawer='';state.editId=id;state.photoDraft=person.photo||'';
 state.photoOriginalFile=null;state.photoRemoveOriginal=false;state.modal='edit';
 state.minuteDraftFiles=[];state.minuteRemoved=[];safeHistory('replaceState',href('people'));render();
 requestAnimationFrame(()=>{void adjustExistingPhoto().catch(err=>{state.notice=err.message||'Không thể mở ảnh';refreshToasts()})});
}
function closeCrop(){
 if(!cropSession)return;
 cropSession.overlay.remove();
 URL.revokeObjectURL(cropSession.url);
 cropSession=null;
}
function paintCrop(){
 const c=cropSession;if(!c)return;
 const w=c.img.naturalWidth*c.scale*c.zoom,h=c.img.naturalHeight*c.scale*c.zoom;
 c.offsetX=Math.max((320-w)/2,Math.min((w-320)/2,c.offsetX));
 c.offsetY=Math.max((320-h)/2,Math.min((h-320)/2,c.offsetY));
 const ctx=c.canvas.getContext('2d');
 ctx.clearRect(0,0,320,320);
 ctx.drawImage(c.img,(320-w)/2+c.offsetX,(320-h)/2+c.offsetY,w,h);
 c.overlay.querySelector('#crop-percentage').textContent=Math.round(c.zoom*100)+'%';
 c.overlay.querySelector('#crop-zoom').value=String(Math.round(c.zoom*100));
}
function changeCropZoom(value){
 if(!cropSession)return;
 cropSession.zoom=Math.max(1,Math.min(4,Number(value)||1));
 paintCrop();
}
async function beginCrop(file,isNew,targetScope='person'){
 if(!file||!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size>5*1024*1024)throw Error('Ảnh không hợp lệ hoặc vượt 5 MB');
 closeCrop();
 const url=URL.createObjectURL(file),img=new Image();
 try{await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('Không đọc được ảnh'));img.src=url})}
 catch(err){URL.revokeObjectURL(url);throw err}
 if(targetScope==='personal'?state.modal!=='settings':(!['new','edit'].includes(state.modal)||state.view!=='people')){URL.revokeObjectURL(url);return}
 const layer=document.createElement('div');
 layer.id='crop-dialog';layer.className='crop-overlay modal-overlay';
 layer.innerHTML=`<section class="modal crop-modal" role="dialog" aria-modal="true" aria-labelledby="crop-title"><div class="modal-head"><div><span>CHỈNH ẢNH ĐẠI DIỆN</span><h2 id="crop-title">Căn chỉnh và cắt ảnh</h2></div><button class="icon-button" data-action="crop-cancel" type="button" aria-label="Đóng">×</button></div><div class="crop-content"><div class="crop-stage"><canvas id="crop-canvas" width="320" height="320" tabindex="0" aria-label="Kéo để chỉnh vị trí ảnh"></canvas><div class="crop-circle"></div></div><small>Kéo ảnh trong vòng tròn. Lăn chuột hoặc dùng thanh trượt để thu/phóng.</small><div class="crop-controls"><button type="button" class="btn ghost" data-action="crop-zoom-out" aria-label="Thu nhỏ">−</button><label for="crop-zoom">Phóng to <input id="crop-zoom" type="range" min="100" max="400" step="1" value="125"></label><button type="button" class="btn ghost" data-action="crop-zoom-in" aria-label="Phóng to">+</button><output id="crop-percentage">125%</output></div><div class="crop-modal-actions modal-actions"><button class="btn ghost" data-action="crop-reset" type="button">Căn giữa</button><button class="btn ghost" data-action="crop-cancel" type="button">Hủy</button><button class="btn primary" data-action="crop-apply" type="button">Áp dụng ảnh</button></div></div></section>`;
 root.appendChild(layer);
 const canvas=layer.querySelector('#crop-canvas');
 cropSession={file,isNew,targetScope,url,img,overlay:layer,canvas,scale:Math.max(320/img.naturalWidth,320/img.naturalHeight),zoom:1.25,offsetX:0,offsetY:0};
 let pointer=null;
 canvas.addEventListener('pointerdown',e=>{if(!cropSession)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{
  if(!cropSession||!pointer||pointer.id!==e.pointerId)return;
  const ratio=320/canvas.getBoundingClientRect().width;
  cropSession.offsetX+=(e.clientX-pointer.x)*ratio;
  cropSession.offsetY+=(e.clientY-pointer.y)*ratio;
  pointer.x=e.clientX;pointer.y=e.clientY;paintCrop();
 });
 for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{pointer=null});
 canvas.addEventListener('wheel',e=>{e.preventDefault();changeCropZoom(cropSession.zoom+(e.deltaY<0?0.1:-0.1))},{passive:false});
 canvas.addEventListener('keydown',e=>{
  const delta={ArrowLeft:[-8,0],ArrowRight:[8,0],ArrowUp:[0,-8],ArrowDown:[0,8]}[e.key];
  if(delta&&cropSession){e.preventDefault();cropSession.offsetX+=delta[0];cropSession.offsetY+=delta[1];paintCrop()}
 });
 paintCrop();canvas.focus();
}
async function adjustExistingPhoto(){
 if(!['new','edit'].includes(state.modal)||state.view!=='people')return;
 let file=state.photoOriginalFile;
 if(!file&&state.editId)try{file=await portraitTransaction(state.editId,'readonly')}catch{}
 if(!(file instanceof Blob)&&state.photoDraft?.startsWith('data:image/')){
  const [header,payload]=state.photoDraft.split(',');
  if(/;base64$/.test(header)&&payload){const binary=atob(payload),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));file=new Blob([bytes],{type:header.slice(5).split(';')[0]})}
 }
 if(!(file instanceof Blob)){state.notice='Không tìm thấy ảnh gốc. Vui lòng chọn lại ảnh';refreshToasts();return}
 await beginCrop(file,!!state.photoOriginalFile);
}
function acceptCrop(){
 if(!cropSession)return;
 const c=cropSession,preview=document.createElement('canvas');preview.width=192;preview.height=192;
 const ctx=preview.getContext('2d');if(!ctx)return;
 ctx.drawImage(c.canvas,0,0,192,192);
 const cropped=preview.toDataURL('image/jpeg',0.82);
 if(c.targetScope==='personal'){
  state.profilePhotoDraft=cropped;closeCrop();
  const target=root.querySelector('#personal-photo-preview');if(target)target.innerHTML=avatar({photo:cropped},true);
  const button=root.querySelector('[data-action="adjust-profile-photo"]');if(button)button.disabled=false;
  return;
 }
 state.photoDraft=cropped;
 if(c.isNew)state.photoOriginalFile=c.file;
 state.photoRemoveOriginal=false;closeCrop();
 const target=root.querySelector('#photo-preview');if(target)target.innerHTML=avatar({photo:state.photoDraft,initial:''},true);
 const actions=root.querySelector('.photo-editor-actions');
 if(actions&&!actions.querySelector('[data-action="adjust-photo"]')){
  const button=document.createElement('button');button.type='button';button.className='btn ghost';button.dataset.action='adjust-photo';button.textContent='Căn chỉnh ảnh';
  actions.querySelector('[data-action="remove-photo"]')?.before(button);
 }
}
async function applyStaffPhoto(file){await beginCrop(file,true)}
async function applyProfilePhoto(file){await beginCrop(file,true,'personal')}
async function adjustProfilePhoto(){
 const data=(state.profilePhotoDraft??actualUser()?.photo)||'';
 const match=/^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(data);
 if(!match){state.notice='Chưa có ảnh đại diện để căn chỉnh';refreshToasts();return}
 const binary=atob(match[1]),bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
 await beginCrop(new Blob([bytes],{type:'image/jpeg'}),false,'personal');
}
function notificationItems(){return [
 {view:'labor',title:'Công nhật chưa kết thúc',count:store.labor.filter(r=>!r.endTime||r.endTime==='—').length,ic:'calendar'},
{view:'assets',title:'CCDC cần kiểm tra',count:store.assets.filter(r=>r.state==='Cần kiểm tra').length,ic:'boxes'},
{view:'shifts',title:'Thiếu quét ra quá giờ',count:datedRows('shifts').filter(r=>shiftIsOverdue(r)).length,ic:'clock'},
 {view:'shifts',title:'Nhân sự chờ vào ca',count:datedRows('shifts').filter(r=>r.state==='Chờ vào ca').length,ic:'clock'}
].filter(x=>x.count>0&&canAccess(x.view))}
function prefsModal(){
 const me=actualUser();
 const accentRow=`<div class="setting-row accent-setting"><div><strong>Màu chủ đạo</strong><small>7 màu chủ đạo</small></div><div class="accent-swatches" role="group" aria-label="Màu chủ đạo">${ACCENTS.map(([key,label])=>`<button type="button" data-accent-choice="${key}" class="accent-swatch accent-${key} ${state.accent===key?'active':''}" aria-label="${label}" title="${label}" aria-pressed="${state.accent===key}">${state.accent===key?'✓':''}</button>`).join('')}</div></div>`;
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal preferences-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><span>TÀI KHOẢN VÀ GIAO DIỆN</span><h2 id="modal-title">Cài đặt cá nhân</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng cửa sổ">×</button></div><div class="setting-body"><form id="personal-settings-form" class="personal-settings-form"><div class="personal-avatar-row"><div id="personal-photo-preview">${avatar({photo:(state.profilePhotoDraft??me?.photo)||'',initial:(me?.username||'NV').slice(0,2).toUpperCase()},true)}</div><div class="personal-avatar-actions"><strong>Ảnh đại diện của tôi</strong><div><label class="btn ghost photo-picker">Chọn ảnh<input id="profile-photo" type="file" accept="image/jpeg,image/png,image/webp"></label><button type="button" class="btn ghost" data-action="adjust-profile-photo" ${(state.profilePhotoDraft??me?.photo)?'':'disabled'}>Căn chỉnh</button><button type="button" class="btn ghost" data-action="remove-profile-photo">Xóa ảnh</button></div><small>JPEG/PNG/WebP · Tối đa 5 MB</small></div></div><label>Họ và tên<input type="text" name="fullName" value="${escape(me?.fullName||'')}" maxlength="100" required autocomplete="name"></label><label>Mật khẩu hiện tại<input type="password" name="oldPassword" autocomplete="current-password" placeholder="Chỉ cần nhập khi đổi mật khẩu"></label><label>Mật khẩu mới<input type="password" name="newPassword" autocomplete="new-password" placeholder="Để trống nếu không thay đổi"></label><button type="submit" class="btn primary">Lưu thông tin cá nhân</button></form><div class="setting-row"><div><strong>Cỡ chữ</strong><small>Tăng giảm kích thước chữ toàn hệ thống</small></div><div class="font-steps"><button data-font="-5" aria-label="Giảm cỡ chữ">A−</button><output>${state.fontPct}%</output><button data-font="5" aria-label="Tăng cỡ chữ">A+</button></div></div>${accentRow}<div class="setting-row backup-setting"><div><strong>Sao lưu dữ liệu</strong><small>Bao gồm bản ghi và ảnh. Không gồm tài khoản và quyền truy cập.</small></div><div class="backup-actions">${me?.role==='superadmin'&&!state.previewUser?`<button type="button" class="btn ghost" data-action="backup-export">${icon('download',15)} Xuất dữ liệu</button>`:''}${me?.role==='superadmin'&&!state.previewUser?`<button type="button" class="btn ghost" data-action="backup-import">${icon('plus',15)} Nhập dữ liệu</button><button type="button" class="btn danger" data-action="backup-reset">${icon('trash',15)} Xóa dữ liệu</button>`:''}<input id="backup-import-file" type="file" accept=".json,application/json" hidden></div></div><div class="setting-row"><div><strong>Thiết lập mặc định</strong><small>Đưa cỡ chữ về mức tiêu chuẩn</small></div><button class="btn ghost" data-action="reset-font">Đặt lại</button></div></div><div class="modal-actions"><button class="btn primary" data-action="close-modal">Hoàn tất</button></div></section></div>`;
}
function noticesModal(){const notices=notificationItems();return `<div class="modal-overlay" data-action="close-modal"><section class="modal preferences-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><span>TRUNG TÂM THÔNG BÁO</span><h2 id="modal-title">Thông báo</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div><div class="notification-list">${notices.length?notices.map(i=>`<a class="notification-item" href="${href(i.view)}" data-nav="${i.view}"><span class="notification-icon">${icon(i.ic,18)}</span><span><strong>${i.title}</strong><small>${i.count} mục cần xử lý</small></span><span>›</span></a>`).join(''):'<div class="notification-empty">Không có thông báo cần xử lý</div>'}</div></section></div>`}



let fileGate=null;
function confirmFileAction(direction,description,callback){
 if(fileGate)return;
 const layer=document.createElement('div');layer.className='modal-overlay file-confirm-overlay';
 layer.innerHTML='<section class="modal confirmation-dialog" role="alertdialog" aria-modal="true" aria-labelledby="file-confirm-title"><div class="modal-head"><h2 id="file-confirm-title">'+(direction==='upload'?'Xác nhận tải lên':'Xác nhận tải xuống')+'</h2><button type="button" class="icon-button" data-file-cancel aria-label="Đóng">×</button></div><form id="file-confirm-form"><p>'+escape(description)+'</p><div class="modal-actions"><button type="button" class="btn ghost" data-file-cancel>Hủy</button><button type="submit" class="btn primary">'+(direction==='upload'?'Tiếp tục tải lên':'Tải xuống')+'</button></div></form></section>';
 fileGate=layer;
 const close=()=>{layer.remove();if(fileGate===layer)fileGate=null};
 layer.addEventListener('click',event=>{if(event.target===layer||event.target.closest('[data-file-cancel]'))close()});
 layer.querySelector('form').addEventListener('submit',event=>{event.preventDefault();if(fileGate!==layer)return;close();callback()});
 root.append(layer);layer.querySelector('[data-file-cancel]')?.focus();
}

let draftConfirmation=null;
function askDraftPassword(title,perform){
 if(draftConfirmation)return;
 const layer=document.createElement('div');layer.className='modal-overlay draft-confirm-overlay';
 layer.setAttribute('data-action','draft-confirm-cancel');
 layer.innerHTML=`<section class="modal confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="draft-confirm-title"><div class="modal-head"><h2 id="draft-confirm-title">${escape(title)}</h2><button type="button" class="icon-button" data-action="draft-confirm-cancel" aria-label="Đóng">×</button></div><form id="draft-confirm-form" autocomplete="off"><p>Nhập mật khẩu để xác nhận lưu.</p><label class="confirm-password">Mật khẩu xác nhận<input id="draft-password" name="password" type="password" required autocomplete="off" placeholder="Mật khẩu tài khoản hiện tại"></label><div id="draft-confirm-error" class="confirm-error" role="alert"></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="draft-confirm-cancel">Quay lại chỉnh sửa</button><button type="submit" class="btn primary">Xác nhận và lưu</button></div></form></section>`;
 draftConfirmation={layer,perform};root.appendChild(layer);layer.querySelector('#draft-password')?.focus();
}
function cancelDraftPassword(){draftConfirmation?.layer.remove();draftConfirmation=null}
function finishDraftPassword(form){
 if(!draftConfirmation)return;
 if(new FormData(form).get('password')!==actualUser()?.password){
  const error=draftConfirmation.layer.querySelector('#draft-confirm-error');if(error)error.textContent='Mật khẩu không đúng';return;
 }
 const action=draftConfirmation.perform;cancelDraftPassword();action();
}
function submitRecordDraft(form){
 if(state.modal==='edit')askDraftPassword('Xác nhận lưu bản ghi',()=>saveForm(form));
 else saveForm(form);
}
function submitCatalogDraft(form){
 if(state.modal==='category-edit')askDraftPassword('Xác nhận lưu danh mục',()=>saveCatalog(form));
 else saveCatalog(form);
}
let pendingConfirmation=null;
function confirmDialog(title,message,onApprove,requiresPassword=true){
 pendingConfirmation=onApprove;
 state.confirmData={title,message,requiresPassword};
 state.modal='confirm';render();
}
function confirmModal(){
 const data=state.confirmData;if(!data)return '';
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal confirmation-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message"><div class="modal-head"><div><h2 id="confirm-title">${escape(data.title)}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div><form id="confirm-form" autocomplete="off"><p id="confirm-message">${escape(data.message)}</p>${data.requiresPassword?`<label class="confirm-password">Mật khẩu xác nhận<input id="confirm-password" type="password" name="password" required autocomplete="off" placeholder="Nhập mật khẩu"></label>`:''}<div id="confirm-error" class="confirm-error" role="alert"></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button type="submit" class="btn danger">${data.requiresPassword?'Xác nhận thao tác':'Đồng ý'}</button></div></form></section></div>`;
}
function finishConfirmation(form){
 if(!state.confirmData)return;
 if(state.confirmData.requiresPassword&&new FormData(form).get('password')!==actualUser()?.password){
  const error=root.querySelector('#confirm-error');if(error)error.textContent='Mật khẩu không đúng';return;
 }
 const action=pendingConfirmation;pendingConfirmation=null;state.confirmData=null;state.modal='';
 if(typeof action==='function')action();
 render();
}

function shiftStamp(date,time,nextDay=false){
 const d=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(date||'')),t=/^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(String(time||''));
 if(!d||!t||Number(t[1])>23||Number(t[2])>59||Number(t[3]||0)>59)return null;
 const base=new Date(d[3]+'-'+d[2]+'-'+d[1]+'T00:00:00+07:00');
 if(Number.isNaN(base.getTime())||new Intl.DateTimeFormat('en-GB',{timeZone:VN_ZONE,day:'2-digit',month:'2-digit',year:'numeric'}).format(base)!==date)return null;
 if(nextDay)base.setUTCDate(base.getUTCDate()+1);
 const ms=(Number(t[1])*3600+Number(t[2])*60+Number(t[3]||0))*1000;
 return {iso:new Date(base.getTime()+ms).toISOString(),time:t[1]+':'+t[2]+':'+(t[3]||'00')};
}
function shiftCorrectionModal(){
 const r=store.shifts.find(x=>x.id===state.editId);if(!r)return '';
 const undo=r.checkout&&r.checkout!=='—'&&canAccess('shifts','delete')?'<button type="button" class="btn danger" data-shift-undo="'+escape(r.id)+'">Hủy lượt ra ca</button>':'';
 return '<div class="modal-overlay" data-action="close-modal"><section class="modal modal-wide shift-correction-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">Sửa giờ vào / ra ca</h2><small>'+escape((r.name||r.staff)+' · '+r.staff+' · '+r.date+' · '+r.shift)+'</small></div><button class="icon-button" data-action="close-modal" aria-label="Đóng">×</button></div><form id="record-form"><div class="form-grid"><label>Giờ vào ca<input name="checkin" type="time" step="1" value="'+escape(r.checkin==='—'?'':r.checkin||'')+'" required></label><label>Giờ ra ca<input name="checkout" type="time" step="1" value="'+escape(r.checkout==='—'?'':r.checkout||'')+'"></label></div><div class="modal-actions">'+undo+'<button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button type="submit" class="btn primary">Lưu giờ ca</button></div></form></section></div>';
}
function saveShiftCorrection(fd){
 if(denyOperation('shifts','edit'))return;
 const r=store.shifts.find(x=>x.id===state.editId);if(!r)return;
 const tIn=String(fd.get('checkin')||''),tOut=String(fd.get('checkout')||''),start=shiftStamp(r.date,tIn),end=tOut?shiftStamp(r.date,tOut,tOut<tIn):null;
 const reject=msg=>{state.notice=msg;refreshToasts()};
 if(!start||(tOut&&!end))return reject('Giờ vào / ra ca không hợp lệ');
 if(end&&(new Date(end.iso)-new Date(start.iso))<=0)return reject('Giờ ra ca phải sau giờ vào ca');
 if(!end&&store.shifts.some(x=>x.id!==r.id&&x.staff===r.staff&&periodDate(x.date)===periodDate(r.date)&&x.state==='Trong ca'))return reject('Nhân viên đang có ca khác chưa kết thúc');
 const before={checkin:r.checkin,checkout:r.checkout,state:r.state},after={checkin:start.time,checkout:end?.time||'—',state:end?'Đã ra ca':'Trong ca'};
 if(!Object.keys(after).every(k=>before[k]===after[k])){
  Object.assign(r,after,{checkinAt:start.iso,checkoutAt:end?.iso||''});
  r.corrections=Array.isArray(r.corrections)?r.corrections:[];
  r.corrections.push({at:new Date().toISOString(),by:actualUser()?.username||'—',action:!end&&before.checkout!=='—'?'Hủy giờ ra ca':'Sửa giờ ca',before,after});
  persist();
 }
 state.modal='';state.editId='';state.drawer='';state.notice='Đã cập nhật giờ ra / vào ca';render();
}
function undoShiftCheckout(id){
 if(denyOperation('shifts','delete'))return;
 const row=store.shifts.find(r=>r.id===id);if(!row||!row.checkout||row.checkout==='—')return;
 if(store.shifts.some(x=>x.id!==id&&x.staff===row.staff&&periodDate(x.date)===periodDate(row.date)&&x.state==='Trong ca')){state.notice='Nhân viên đang có ca khác chưa kết thúc';refreshToasts();return}
 confirmDialog('Hủy lượt ra ca','Hủy giờ ra '+row.checkout+' của '+row.name+' ('+row.staff+') ngày '+row.date+'? Lượt vào ca được giữ.',()=>{
  const before={checkin:row.checkin,checkout:row.checkout,state:row.state};
  row.checkout='—';row.checkoutAt='';row.state='Trong ca';
  row.corrections=Array.isArray(row.corrections)?row.corrections:[];
  row.corrections.push({at:new Date().toISOString(),by:actualUser()?.username||'—',action:'Hủy giờ ra ca',before,after:{checkin:row.checkin,checkout:'—',state:'Trong ca'}});
  persist();state.drawer='';state.editId='';state.notice='Đã hủy lượt ra ca';
 },true);
}
function modal(){
 if(!state.modal)return '';
 if(state.modal==='confirm')return confirmModal();
  if(state.modal==='edit'&&state.view==='shifts')return shiftCorrectionModal();
 if(state.modal==='transfer')return assetTransferModal();
 if(state.modal==='portrait')return portraitModal();
 if(state.modal==='minute-zoom')return `<div class="modal-overlay" data-action="close-modal"><section class="modal minute-zoom-modal" role="dialog" aria-modal="true" aria-label="Xem ảnh biên bản"><button type="button" class="icon-button" data-action="close-modal">×</button><img src="${state.minuteZoomUrl}" alt="Ảnh biên bản nguyên bản"></section></div>`;
 if(state.modal==='transfer')return assetTransferModal();
 if(state.modal==='settings')return prefsModal();
 if(state.modal==='account')return accountModal();
 if(state.modal==='notifications')return noticesModal();
 if(state.modal==='category-new'||state.modal==='category-edit')return catalogModal();
 const key=state.view;
 if(['shifts','dashboard','pda'].includes(key)||(key==='labor'&&state.modal!=='edit'))return '';
 const existing=store[key]?.find(r=>r.id===state.editId);
 const editing=state.modal==='edit'&&!!existing;
 const title=editing?`Sửa ${PAGES[key].title.toLowerCase()}`:`Thêm ${PAGES[key].title.toLowerCase()}`;
 const fields=key==='people'?PERSON_EDITOR:key==='assets'?ASSET_EDITOR:key==='minutes'?[['type','Phân loại'],['date','Ngày biên bản'],['note','Ghi chú']]:key==='labor'?[['work','Công việc công nhật'],['startTime','Giờ bắt đầu'],['endTime','Giờ kết thúc']]:columns[key].filter(([k])=>k!=='id');
 return `<div class="modal-overlay" data-action="close-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${title}</h2></div><button class="icon-button" data-action="close-modal" aria-label="Đóng cửa sổ">×</button></div><form id="record-form">${key==='people'?photoEditor(existing):key==='minutes'?minutePhotoEditor():''}<div class="form-grid">${fields.map(([k,l])=>fieldInput(k,l,editing?existing[k]:key==='people'&&k==='startDate'?vnTodayISO():key==='minutes'&&k==='date'?vnTodayISO():key==='assets'&&k==='condition'?(catalogs.assetsCondition[0]||''):k==='state'?INITIAL_STATE[key]:'',editing)).join('')}</div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close-modal">Hủy</button><button class="btn primary" type="submit">${editing?'Lưu chỉnh sửa':key==='minutes'?'Lưu biên bản':'Tạo bản ghi'}</button></div></form></section></div>`;
}
function toast(){return `<div id="toast-stack" class="toast-stack" aria-live="polite">${toastItems()}</div>`}
function render(){if(cropSession)closeCrop();document.documentElement.setAttribute('data-theme',state.theme);document.documentElement.setAttribute('data-accent',state.accent);document.documentElement.style.setProperty('--text-scale',String(state.fontPct/100*1.1));if(document.body.dataset.screen==='login'){renderLogin();return}if(!demoSession()){root.innerHTML=`<main class="auth-required"><img src="assets/supra-mark.png" alt="The Supra"><h2>Vui lòng đăng nhập</h2><p>Đăng nhập để tiếp tục.</p><a class="btn primary" href="index.html">Đăng nhập</a></main>`;return}if(!PERMISSION_AREAS.some(key=>canAccess(key))){root.innerHTML=`<main class="auth-required"><h2>Chưa được cấp quyền truy cập</h2><p>Liên hệ quản trị viên để được cấp quyền.</p><button class="btn primary" data-action="logout">Đăng xuất</button></main>`;return}if(state.view!=='access'&&!canAccess(state.view))state.view=firstAllowed();if(state.view==='access'&&!canAccess('access'))state.view=firstAllowed();root.innerHTML=`${side()}<div class="screen-shade ${state.sidebar?'show':''}" data-action="close-nav"></div><div class="app-main">${top()}${state.view==='dashboard'?dashboard():state.view==='access'?accessPage():['categories','resources'].includes(state.view)?categoriesPage():modulePage()}</div>${drawer()}${modal()}${toast()}`;if(state.view==='people'&&state.drawer)requestAnimationFrame(renderFullPortrait);if(state.view==='shifts'&&state.scanOutcome?.code){const p=store.people.find(x=>x.id===state.scanOutcome.code);if(p)requestAnimationFrame(()=>renderScanPortrait(p))}if(state.view==='minutes'&&(state.modal==='new'||state.modal==='edit'||state.drawer))requestAnimationFrame(()=>{void renderMinuteImages()})}
function renderLogin(){root.innerHTML=`<main class="login-screen"><div class="login-panel"><div class="login-left"><div class="login-brand"><img class="brand-logo" src="assets/supra-mark.png" alt="The Supra"><span class="login-corporate"><span>CÔNG TY CỔ PHẦN THE SUPRA</span><span>DC HƯNG YÊN</span></span></div><div class="login-art"><div class="art-greeting">QUẢN LÝ VẬN HÀNH</div><h1>Quản lý Pick & Pack tập trung.</h1><p>Nhân sự, công ca, hồ sơ và thiết bị trong cùng một hệ thống.</p><div class="art-metrics"><div><strong>08</strong><span>Phân hệ</span></div><div><strong>03</strong><span>Thiết bị PDA</span></div><div><strong>05</strong><span>Phiên Web</span></div></div></div></div><div class="login-right"><span class="login-kicker">PICKPACK OFFICE</span><h2>Đăng nhập hệ thống</h2><form id="login-form" autocomplete="off" class="login-form"><label>Tên đăng nhập<input id="demo-user" name="username" value="" placeholder="Nhập tên đăng nhập" autocomplete="off" required></label><label>Mật khẩu<div class="password-wrap"><input id="demo-password" name="password" type="${state.loginVisible?'text':'password'}" placeholder="Nhập mật khẩu" autocomplete="off" required><button type="button" class="password-toggle" data-action="show-password" aria-label="${state.loginVisible?'Ẩn':'Hiện'} mật khẩu">${state.loginVisible?'Ẩn':'Hiện'}</button></div></label>${state.loginError?`<div class="login-error" role="alert">${escape(state.loginError)}</div>`:''}<button class="btn primary login-submit" type="submit">Đăng nhập <span>→</span></button></form><div class="login-links"><button data-action="theme" class="text-button">${state.theme==='dark'?'☼ Sáng':'☾ Tối'}</button><span class="web-version">Web v${WEB_VERSION}</span></div></div></div></main>`}
function safeHistory(method,url){try{history[method](null,'',url)}catch{ /* Browser file:// history restrictions do not block UI. */ }}
function closeStuff(){state.sidebar=false;state.modal='';state.drawer='';state.editId='';state.profileMenu=false}
function setView(view){if(!canAccess(view)){denyOperation(view,'view');return}if(view!==state.view){state.periodPreset=view==='people'?'all':'today';[state.periodFrom,state.periodTo]=periodBounds(state.periodPreset)}if(view==='resources'){state.catalogScope='resources';state.categoryTab=catalogFields('resources')[0][0]}state.view=view;state.periodOpen=false;state.pdaPrefill='';state.search='';state.filter='all';state.shiftFilter={shift:'all',position:'all',supplier:'all'};state.drawer='';state.sidebar=false;state.profileMenu=false;state.selected.clear();safeHistory('pushState',href(view));render();window.scrollTo(0,0)}
function saveForm(form){if(denyOperation(state.view,state.modal==='edit'?'edit':'create'))return;
 const key=state.view;
 if(['dashboard','pda'].includes(key))return;
 const fd=new FormData(form),editing=state.modal==='edit'&&!!state.editId;
 if(key==='shifts'){saveShiftCorrection(fd);return}
 if(key==='labor'){
  if(!editing)return;
  const work=String(fd.get('work')||'').trim(),startTime=String(fd.get('startTime')||'').trim(),endTime=String(fd.get('endTime')||'').trim()||'—';
  if(!catalogs.laborWork.includes(work)||!/^\d{2}:\d{2}(:\d{2})?$/.test(startTime)||(endTime!=='—'&&!/^\d{2}:\d{2}(:\d{2})?$/.test(endTime))){
   state.notice='Công việc hoặc giờ bắt đầu/kết thúc không hợp lệ';render();return;
  }
  updateRecord('labor',state.editId,{work,startTime,endTime});
  state.notice='Đã cập nhật công nhật';state.modal='';state.editId='';render();return;
 }
 if(key==='minutes'){void saveMinutesForm(form,editing);return}
  if(key==='assets'){saveAssetForm(fd,editing);return}
 if(key==='people'){
  const id=String(fd.get('id')||'').trim(),name=String(fd.get('name')||'').trim(),phone=String(fd.get('phone')||'').trim();
  if(!/^[0-9]{2,30}$/.test(id)){state.notice='Mã nhân viên chỉ được chứa chữ số';render();return}
  if(name.length<2||name.length>120||!/^[\p{L}\p{M} ]+$/u.test(name)){state.notice='Họ và tên chỉ được chứa chữ cái và khoảng trắng';render();return}
  if(!/^[0-9]*$/.test(phone)){state.notice='Số điện thoại chỉ được chứa chữ số';render();return}
  if(!editing&&store.people.some(p=>p.id===id)){state.notice='Mã nhân viên đã tồn tại';render();return}
  const changes={};for(const [k] of PERSON_EDITOR){if(k==='id')continue;changes[k]=k==='startDate'&&fd.get(k)?String(fd.get(k)).replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$3/$2/$1'):String(fd.get(k)||'').trim()}
  changes.photo=state.photoDraft||'';
  changes.initial=name.split(' ').at(-1).slice(0,2);
  changes.updatedBy=actualUser()?.fullName||'Người dùng';
  changes.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});
  if(editing){const row=store.people.find(p=>p.id===state.editId);if(!row)return;Object.assign(row,changes);state.notice='Đã cập nhật hồ sơ nhân sự'}
  else{store.people.unshift({id,...changes,createdAt:vnTodayISO()});state.notice='Đã thêm nhân sự'}
  persist();
  if(state.photoOriginalFile){const image=state.photoOriginalFile;portraitTransaction(id,'readwrite',image).then(()=>{if(portraitObjectId===id)releasePortraitUrl();if(state.drawer===id)renderFullPortrait()}).catch(()=>{state.notice='Không lưu được ảnh gốc trong trình duyệt';refreshToasts()})}
  else if(state.photoRemoveOriginal){portraitTransaction(id,'readwrite',null).then(()=>{if(portraitObjectId===id)releasePortraitUrl()}).catch(()=>{state.notice='Không xóa được ảnh gốc';refreshToasts()})}
  state.photoOriginalFile=null;state.photoRemoveOriginal=false;state.photoDraft='';state.modal='';state.editId='';state.search='';state.filter='all';render();return;
 }
 const changes={};
 for(const [k] of columns[key]){if(k==='id')continue;const value=String(fd.get(k)??'').trim();changes[k]=k==='qty'?Number(value):value||'—'}
 if(String(changes.name).trim().length<2){state.notice='Tên bản ghi cần từ 2 ký tự';render();return}
 if(key==='pda'&&changes.state==='Đang mượn'&&(!pdaAssets().some(x=>x.id===changes.name)||store.pda.some(x=>x.name===changes.name&&x.state==='Đang mượn'&&x.id!==state.editId))){state.notice='PDA không hợp lệ hoặc đang có lượt mượn chưa trả';render();return}
 if(editing){updateRecord(key,state.editId,changes);state.notice='Cập nhật thành công'}
 else{const id=`${key.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;store[key].unshift({id,...changes,...(key==='assets'?{createdAt:vnTodayISO()}:{})});persist();state.notice='Tạo mới thành công'}
 state.modal='';state.editId='';state.search='';state.filter='all';render();
}
function deleteIds(ids){if(denyOperation(state.view,'delete'))return;const key=state.view;if(key==='shifts')return;const matches=store[key].filter(r=>ids.includes(r.id));if(!matches.length)return;
 if(key==='assets'&&matches.some(a=>a.activeTransfer||assetLoanOpen(a)||(a.history||[]).some(h=>h.kind||/mượn|gửi|sửa chữa|nhận lại/i.test(h.action||''))||store.pda.some(p=>p.assetId===a.id))){state.notice='CCDC đã liên kết PDA hoặc có lịch sử mượn/trả; không thể xóa';render();return}
 if(key==='pda'&&matches.some(p=>p.assetId)){state.notice='Lịch sử PDA liên kết CCDC không được xóa';render();return}confirmDialog('Xác nhận xóa',`Xóa ${matches.length} bản ghi khỏi ${PAGES[key].title}?`,()=>{store[key]=store[key].filter(r=>!ids.includes(r.id));if(key==='people')for(const id of ids)portraitTransaction(id,'readwrite',null).catch(()=>{state.notice='Không xóa được ảnh gốc cục bộ'});if(key==='minutes')void minuteWrite([],matches.flatMap(r=>r.imageIds||[])).catch(()=>{state.notice='Không xóa được ảnh biên bản cục bộ';refreshToasts()});persist();state.selected.clear();state.drawer='';safeHistory('replaceState',href());state.notice=`Đã xóa ${matches.length} bản ghi`})}
function quickChange(id){if(denyOperation(state.view,'edit'))return;const key=state.view;const row=store[key]?.find(x=>x.id===id);if(!row)return;let c={};if(['shifts','labor','pda'].includes(key))return;else if(key==='pda'){const borrowed=row.state==='Đang mượn';if(!borrowed&&store.pda.some(x=>x.name===row.name&&x.state==='Đang mượn'&&x.id!==id)){state.notice='Thiết bị đang được mượn, vui lòng trả trước';render();return}const time=new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit',hour12:false});c={state:borrowed?'Đã trả':'Đang mượn',return:borrowed?time:'—',borrow:borrowed?row.borrow:time}}else if(key==='minutes')return;else if(key==='labor')c={state:'Đã xác nhận'};else if(key==='assets')returnupdateRecord(key,id,c);state.notice=`Đã thay đổi trạng thái ${row.id}`;render()}
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
function makeExcel(rows,fields,title,template=false){
 const columnsXml=fields.map(([,name],i)=>`<col min="${i+1}" max="${i+1}" width="${Math.min(42,Math.max(15,String(name).length*1.4))}" customWidth="1"${template&&['id','phone','serial'].includes(fields[i][0])?' style="2"':''}/>`).join('');
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
 const styles=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF26476B"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${template?3:2}"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>${template?'<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>':''}</cellXfs></styleSheet>`;
 return zipStored([['[Content_Types].xml',types],['_rels/.rels',rootRels],['xl/workbook.xml',workbook],['xl/_rels/workbook.xml.rels',workbookRels],['xl/worksheets/sheet1.xml',sheet],['xl/styles.xml',styles]]);
}

function readAllPortraits(){
 return portraitDB().then(db=>new Promise((resolve,reject)=>{
  const tx=db.transaction('portraits','readonly'),bucket=tx.objectStore('portraits');
  const keys=bucket.getAllKeys(),values=bucket.getAll();
  tx.oncomplete=()=>{db.close();resolve(keys.result.map((id,i)=>[id,values.result[i]]))};
  tx.onerror=()=>{db.close();reject(tx.error||new Error('Không thể đọc kho ảnh cục bộ'))};
 }));
}
function replaceAllPortraits(entries){
 return portraitDB().then(db=>new Promise((resolve,reject)=>{
  const tx=db.transaction('portraits','readwrite'),bucket=tx.objectStore('portraits');
  bucket.clear();for(const [id,blob] of entries)bucket.put(blob,id);
  tx.oncomplete=()=>{db.close();resolve()};
  tx.onerror=()=>{db.close();reject(tx.error||new Error('Không thể thay thế ảnh cục bộ'))};
  tx.onabort=()=>{db.close();reject(tx.error||new Error('Thao tác lưu ảnh bị hủy'))};
 }));
}
function portraitToDataURL(blob){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onload=()=>resolve(reader.result);
  reader.onerror=()=>reject(reader.error||new Error('Không thể xuất ảnh'));
  reader.readAsDataURL(blob);
 });
}
function decodeBackupPortrait(item){
 if(!item||typeof item.id!=='string'||typeof item.data!=='string')throw Error('Dữ liệu ảnh không hợp lệ');
 const match=/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(item.data);
 if(!match)throw Error('Định dạng ảnh trong file không hợp lệ');
 const raw=atob(match[2]);
 if(raw.length>5*1024*1024)throw Error('Ảnh gốc vượt 5 MB');
 const bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 return [item.id,new Blob([bytes],{type:'image/'+match[1]})];
}
function validateOfflineBackup(snapshot){
 if(!snapshot||snapshot.format!==BACKUP_FORMAT||snapshot.schema!==BACKUP_SCHEMA)throw Error('File không phải bản sao lưu PickPack hợp lệ');
 if(!['0.9.7','0.9.8','0.9.9','0.10.0','0.11.0','0.11.1','0.11.2','0.12.0',WEB_VERSION].includes(snapshot.webVersion))throw Error('File dành cho Web v'+String(snapshot.webVersion||'?')+'. Hãy mở Web v'+WEB_VERSION+' để nhập');
 const data=snapshot.data||{},records=data.records,catalogData=data.catalogs,pictures=data.portraits,minutePictures=data.minuteImages;
 if(!records||!catalogData||!Array.isArray(pictures)||!Array.isArray(minutePictures))throw Error('File thiếu dữ liệu nghiệp vụ, danh mục hoặc ảnh');
 if(!Object.hasOwn(catalogData,'assetsCondition')&&snapshot.webVersion!==WEB_VERSION)catalogData.assetsCondition=[...RESOURCE_DEFAULTS.assetsCondition];
 for(const key of Object.keys(store)){
  const list=records[key];
  if(!Array.isArray(list)||list.length>=500||list.some(row=>!row||typeof row!=='object'||Array.isArray(row)))throw Error('Dữ liệu '+key+' không hợp lệ');
 }
 const names=[...CATEGORY_FIELDS,...Object.values(EXTRA_CATALOGS).map(v=>[v.key,v.label]),...RESOURCE_FIELDS].map(([key])=>key);
 for(const key of names){
  const list=catalogData[key];
  if(!Array.isArray(list)||list.length>=200||list.some(v=>typeof v!=='string'||v.length>80))throw Error('Danh mục '+key+' không hợp lệ');
 }
 if(pictures.length>500)throw Error('Số lượng ảnh quá giới hạn');
 const ids=new Set(records.people.map(p=>p.id)),seen=new Set(),photos=[];
 for(const item of pictures){
  if(!ids.has(item?.id)||seen.has(item.id))throw Error('Ảnh nhân sự trùng hoặc không tồn tại trong danh sách');
  seen.add(item.id);photos.push(decodeBackupPortrait(item));
 }
 const allowed=new Set(records.minutes.flatMap(r=>Array.isArray(r.imageIds)?r.imageIds:[]));
 if(allowed.size>2000||minutePictures.length!==allowed.size)throw Error('Số lượng ảnh biên bản không khớp');
 const minuteImages=[],minuteSeen=new Set();
 for(const item of minutePictures){
  if(!allowed.has(item?.id)||minuteSeen.has(item.id))throw Error('Ảnh biên bản trùng hoặc không thuộc hồ sơ');
  minuteSeen.add(item.id);minuteImages.push(decodeBackupPortrait(item));
 }
 const prefs=data.preferences||{};
 if(!['auto','light','dark'].includes(prefs.theme)||!ACCENTS.some(([key])=>key===prefs.accent)||!Number.isInteger(prefs.fontPct)||prefs.fontPct<90||prefs.fontPct>120)throw Error('Thiết lập giao diện không hợp lệ');
 return {records,catalogData,photos,minuteImages,prefs};
}
async function exportOfflineBackup(){
 try{
  const photos=await readAllPortraits(),minutes=await minuteReadAll(),pictures=[],minutePictures=[];
  for(const [id,blob] of photos){if(blob instanceof Blob)pictures.push({id,data:await portraitToDataURL(blob)})}
  const used=new Set(store.minutes.flatMap(r=>r.imageIds||[]));for(const [id,blob] of minutes)if(used.has(id)&&blob instanceof Blob)minutePictures.push({id,data:await portraitToDataURL(blob)});
  const snapshot={format:BACKUP_FORMAT,schema:BACKUP_SCHEMA,webVersion:WEB_VERSION,exportedAt:new Date().toISOString(),
   data:{records:store,catalogs,portraits:pictures,minuteImages:minutePictures,preferences:{theme:state.themeMode,accent:state.accent,fontPct:state.fontPct}}};
  const file=new Blob([JSON.stringify(snapshot)],{type:'application/json;charset=utf-8'});
  const url=URL.createObjectURL(file),anchor=document.createElement('a');
  anchor.href=url;anchor.download='pickpack-1291-v'+WEB_VERSION+'-'+vnTodayISO()+'.json';
  document.body.appendChild(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  state.notice='Đã xuất dữ liệu '+store.people.length+' nhân sự và '+pictures.length+' ảnh gốc';render();
 }catch(err){state.notice='Xuất dữ liệu thất bại: '+(err?.message||'Không thể tạo file');render()}
}
async function commitOfflineBackup(checked){
 const keys=[STORAGE_KEY,CATALOG_KEY,THEME_KEY,ACCENT_KEY,FONT_KEY],previous=keys.map(key=>localStorage.getItem(key));
 let previousPhotos=null,previousMinutes=null;
 try{
  previousPhotos=await readAllPortraits();previousMinutes=await minuteReadAll();
  const next=[JSON.stringify(checked.records),JSON.stringify(checked.catalogData),checked.prefs.theme,checked.prefs.accent,String(checked.prefs.fontPct)];
  await replaceAllPortraits(checked.photos);await minuteReplace(checked.minuteImages);
  for(let i=0;i<keys.length;i++)localStorage.setItem(keys[i],next[i]);
  for(const key of Object.keys(store))store[key]=checked.records[key];
  for(const key of Object.keys(catalogs))catalogs[key]=checked.catalogData[key];
  state.themeMode=checked.prefs.theme;state.theme=resolveTheme(state.themeMode);state.accent=checked.prefs.accent;state.fontPct=checked.prefs.fontPct;
  state.view='dashboard';state.drawer='';state.search='';state.filter='all';state.selected.clear();
  releasePortraitUrl();safeHistory('replaceState',href('dashboard'));render();
  state.notice='Đã nhập dữ liệu thành công: '+store.people.length+' nhân sự và '+checked.photos.length+' ảnh gốc';refreshToasts();
 }catch(err){
  let rollbackError='';
  for(let i=0;i<keys.length;i++)try{if(previous[i]===null)localStorage.removeItem(keys[i]);else localStorage.setItem(keys[i],previous[i])}catch{rollbackError=' Không khôi phục được toàn bộ dữ liệu cũ.'}
  if(previousPhotos)try{await replaceAllPortraits(previousPhotos)}catch{rollbackError=' Không khôi phục được toàn bộ ảnh cũ.'}
  if(previousMinutes)try{await minuteReplace(previousMinutes)}catch{rollbackError=' Không khôi phục được ảnh biên bản cũ.'}
  state.notice='Nhập dữ liệu thất bại: '+(err?.message||'Lỗi lưu cục bộ')+'.'+rollbackError;refreshToasts();
 }
}
async function resetOfflineTestData(){
 const preserved=[STORAGE_KEY,CATALOG_KEY,LEGACY_STORAGE_KEY,LEGACY_CATALOG_KEY].map(key=>[key,localStorage.getItem(key)]);
 let currentPhotos=null,currentMinutes=null;
 try{
  currentPhotos=await readAllPortraits();currentMinutes=await minuteReadAll();
  await replaceAllPortraits([]);await minuteReplace([]);
  // Legacy v0.9.3 original photos are isolated from the new version by database name.
  await new Promise((resolve,reject)=>{
   const request=indexedDB.deleteDatabase('pickpack1291_demo_portraits_v1');
   request.onsuccess=()=>resolve();
   request.onerror=()=>reject(request.error||new Error('Không xóa được ảnh phiên bản cũ'));
   request.onblocked=()=>reject(new Error('Đóng các tab Web v0.9.3 trước khi xóa ảnh cũ'));
  });
  for(const [key] of preserved)localStorage.removeItem(key);
  const fresh=emptyRecords();
  for(const key of Object.keys(store))store[key]=fresh[key];
  for(const key of Object.keys(catalogs))catalogs[key]=[];
  // Store explicit empty values to avoid reloading any formerly generated fixtures.
  persist();persistCatalogs();
  state.search='';state.filter='all';state.selected.clear();state.drawer='';state.view='dashboard';
  releasePortraitUrl();safeHistory('replaceState',href('dashboard'));
  state.notice='Đã xóa dữ liệu, danh mục và ảnh';render();
 }catch(err){
  for(const [key,value] of preserved)try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}catch{}
  if(currentPhotos)try{await replaceAllPortraits(currentPhotos)}catch{}
  if(currentMinutes)try{await minuteReplace(currentMinutes)}catch{}
  state.notice='Xóa dữ liệu chưa hoàn tất: '+(err?.message||'Lỗi lưu trữ trên máy')+'. Không tiếp tục sử dụng trước khi kiểm tra lại.';refreshToasts();
 }
}
async function importOfflineBackup(file){
 if(!file)return;
 try{
  const snapshot=JSON.parse(await file.text()),checked=validateOfflineBackup(snapshot);
  confirmDialog('Nhập bản sao lưu','Bản sao lưu v'+snapshot.webVersion+' gồm '+checked.records.people.length+' nhân sự và '+checked.photos.length+' ảnh gốc. Nhập sẽ THAY THẾ toàn bộ dữ liệu và danh mục của trình duyệt này. Hãy xuất bản sao lưu hiện tại trước khi tiếp tục.',()=>{void commitOfflineBackup(checked)});
 }catch(err){state.notice='Không thể nhập file: '+(err?.message||'File không hợp lệ');refreshToasts()}
}


const IMPORT_FIELDS=PERSON_EDITOR.map(([key,label])=>[key,label]);
function downloadPersonnelTemplate(){
 const blob=makeExcel([],IMPORT_FIELDS,'Mau nhan su',true),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='pickpack-mau-nhan-su-v'+WEB_VERSION+'.xlsx';
 document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 state.notice='Đã tải mẫu Excel nhân sự';refreshToasts();
}

function downloadAssetTemplate(){
 const blob=makeExcel([],ASSET_IMPORT_FIELDS,'Mau CCDC',true),url=URL.createObjectURL(blob),link=document.createElement('a');
 link.href=url;link.download='pickpack-mau-ccdc-v'+WEB_VERSION+'.xlsx';
 document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 state.notice='Đã tải mẫu Excel CCDC';refreshToasts();
}
async function readXlsxParts(file){
 if(file.size>8*1024*1024)throw Error('File Excel vượt 8 MB');
 const data=new Uint8Array(await file.arrayBuffer()),view=new DataView(data.buffer),xml={};
 let tail=-1;
 for(let i=data.length-22;i>=Math.max(0,data.length-66000);i--)if(view.getUint32(i,true)===0x06054b50){tail=i;break}
 if(tail<0)throw Error('File không phải Excel XLSX');
 const count=view.getUint16(tail+10,true),offset=view.getUint32(tail+16,true),decoder=new TextDecoder();
 if(count>64||offset>=data.length)throw Error('Cấu trúc file Excel không hợp lệ');
 let cursor=offset;
 for(let i=0;i<count;i++){
  if(cursor+46>data.length||view.getUint32(cursor,true)!==0x02014b50)throw Error('File ZIP của Excel bị hỏng');
  const flag=view.getUint16(cursor+8,true),method=view.getUint16(cursor+10,true),size=view.getUint32(cursor+20,true);
  const n=view.getUint16(cursor+28,true),e=view.getUint16(cursor+30,true),c=view.getUint16(cursor+32,true),start=view.getUint32(cursor+42,true);
  if(cursor+46+n+e+c>data.length||flag&1)throw Error('Excel bị hỏng hoặc đã mã hóa');
  const filename=decoder.decode(data.subarray(cursor+46,cursor+46+n));cursor+=46+n+e+c;
  if(!['xl/worksheets/sheet1.xml','xl/sharedStrings.xml'].includes(filename))continue;
  if(start+30>data.length||view.getUint32(start,true)!==0x04034b50)throw Error('Nội dung ZIP không hợp lệ');
  const begin=start+30+view.getUint16(start+26,true)+view.getUint16(start+28,true);
  if(size>6*1024*1024||begin+size>data.length)throw Error('Bảng Excel quá lớn');
  let bytes=data.slice(begin,begin+size);
  if(method===8){
   if(typeof DecompressionStream==='undefined')throw Error('Trình duyệt không hỗ trợ Excel nén');
   bytes=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
  }else if(method!==0)throw Error('Excel dùng định dạng nén chưa hỗ trợ');
  if(bytes.length>7*1024*1024)throw Error('Dữ liệu Excel quá lớn');
  xml[filename]=decoder.decode(bytes);
 }
 if(!xml['xl/worksheets/sheet1.xml'])throw Error('Không tìm thấy sheet đầu tiên. Hãy dùng file mẫu tải từ Web');
 return xml;
}
function parseExcelXml(source){
 const doc=new DOMParser().parseFromString(source,'application/xml');
 if(doc.querySelector('parsererror'))throw Error('File XML trong Excel không hợp lệ');
 return doc;
}
function parseExcelDate(raw){
 const text=String(raw||'').trim();if(!text)return vnTodayISO().split('-').reverse().join('/');
 let y,m,d;
 if(/^[0-9]{5}(\.0+)?$/.test(text)){const day=new Date(Date.UTC(1899,11,30)+Number(text)*86400000);y=day.getUTCFullYear();m=day.getUTCMonth()+1;d=day.getUTCDate()}
 else if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(text)){[y,m,d]=text.split('-').map(Number)}
 else if(/^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/.test(text)){[d,m,y]=text.split('/').map(Number)}
 else throw Error('Ngày nhận việc không hợp lệ: '+text);
 const date=new Date(Date.UTC(y,m-1,d));
 if(date.getUTCFullYear()!==y||date.getUTCMonth()+1!==m||date.getUTCDate()!==d)throw Error('Ngày nhận việc không hợp lệ: '+text);
 return String(d).padStart(2,'0')+'/'+String(m).padStart(2,'0')+'/'+y;
}
async function readExcelRows(file){
 const files=await readXlsxParts(file),doc=parseExcelXml(files['xl/worksheets/sheet1.xml']);
 const strings=files['xl/sharedStrings.xml']?Array.from(parseExcelXml(files['xl/sharedStrings.xml']).getElementsByTagNameNS('*','si')).map(si=>Array.from(si.getElementsByTagNameNS('*','t')).map(t=>t.textContent).join('')):[];
 const rows=[];
 for(const row of Array.from(doc.getElementsByTagNameNS('*','row'))){
  const cells=[];
  for(const cell of Array.from(row.getElementsByTagNameNS('*','c'))){
   const match=/^[A-Z]+/.exec(cell.getAttribute('r')||'');if(!match)continue;
   let pos=0;for(const c of match[0])pos=pos*26+c.charCodeAt(0)-64;pos--;
   if(pos<0||pos>60)continue;
   if(cell.getElementsByTagNameNS('*','f').length)throw Error('Không nhập công thức trong file Excel');
   const type=cell.getAttribute('t'),raw=cell.getElementsByTagNameNS('*','v')[0]?.textContent||'';
   const val=type==='inlineStr'?Array.from(cell.getElementsByTagNameNS('*','t')).map(t=>t.textContent).join(''):type==='s'?strings[Number(raw)]??'':raw;
   cells[pos]=String(val??'').trim();
  }
  if(cells.length)rows.push({line:Number(row.getAttribute('r')||rows.length+1),cells});
 }
 return rows;
}
async function parsePersonnelExcel(file){
 const rows=await readExcelRows(file);
 if(!rows.length||IMPORT_FIELDS.some(([,label],i)=>rows[0].cells[i]!==label))throw Error('Tiêu đề Excel không đúng mẫu đã tải từ Web');
 rows.shift();const output=[],seen=new Set();
 for(const {line,cells} of rows){
  if(cells.every(x=>!x))continue;
  if(cells.some((x,i)=>i>=IMPORT_FIELDS.length&&x))throw Error('Dòng '+line+': Có dữ liệu ngoài cột mẫu');
  const record=Object.fromEntries(IMPORT_FIELDS.map(([key],i)=>[key,String(cells[i]||'').trim()]));
  if(!/^[0-9]{2,30}$/.test(record.id))throw Error('Dòng '+line+': Mã nhân viên không hợp lệ hoặc mất số 0 đầu');
  if(!/^[\p{L}\p{M} ]{2,120}$/u.test(record.name))throw Error('Dòng '+line+': Tên nhân viên chỉ được chứa chữ và dấu cách');
  if(!/^[0-9]*$/.test(record.phone))throw Error('Dòng '+line+': Số điện thoại chỉ được chứa số');
  for(const [key,label] of CATEGORY_FIELDS)if(!record[key]||record[key].length>80)throw Error('Dòng '+line+': Cần nhập '+label+' (tối đa 80 ký tự)');
  if(seen.has(record.id)||store.people.some(p=>p.id===record.id))throw Error('Dòng '+line+': Mã nhân viên '+record.id+' đã tồn tại. Chưa nhập dòng nào');
  seen.add(record.id);record.startDate=parseExcelDate(record.startDate);record.initial=record.name.split(' ').at(-1).slice(0,2);
  record.photo='';record.updatedBy='Quản trị viên';record.updatedAt=new Date().toLocaleString('vi-VN',{hour12:false});
  output.push(record);if(output.length+store.people.length>=500)throw Error('Tối đa 499 hồ sơ nhân sự');
 }
 if(!output.length)throw Error('File chưa có dữ liệu. Hãy điền từ dòng 2');
 return output;
}

async function parseAssetExcel(file){
 const rows=await readExcelRows(file);
 if(!rows.length||ASSET_IMPORT_FIELDS.some(([,label],i)=>rows[0].cells[i]!==label)||rows[0].cells.length!==ASSET_IMPORT_FIELDS.length)throw Error('Tiêu đề CCDC không đúng mẫu 5 cột');
 rows.shift();const output=[],serials=new Set(store.assets.map(a=>String(a.serial||'').trim().toUpperCase()).filter(Boolean));
 for(const {line,cells} of rows){
  if(cells.every(x=>!x))continue;
  if(cells.some((x,i)=>i>=ASSET_IMPORT_FIELDS.length&&x))throw Error('Dòng '+line+': Có dữ liệu ngoài 5 cột mẫu');
  const item=Object.fromEntries(ASSET_IMPORT_FIELDS.map(([key],i)=>[key,String(cells[i]||'').trim()]));
  if(!catalogs.assetsType.includes(item.type))throw Error('Dòng '+line+': Loại CCDC chưa có trong danh mục: '+item.type);
  if(!catalogs.assetsCondition.includes(item.condition))throw Error('Dòng '+line+': Tình trạng vật lý chưa có trong danh mục');
  if(!['Có sử dụng','Không sử dụng'].includes(item.state))throw Error('Dòng '+line+': Trạng thái phải là Có sử dụng hoặc Không sử dụng');
  if(item.serial.length>120||item.note.length>500)throw Error('Dòng '+line+': Serial/IMEI hoặc ghi chú vượt giới hạn');
  if(item.type.toUpperCase()==='PDA'&&item.serial.length<5)throw Error('Dòng '+line+': Serial PDA phải có ít nhất 5 ký tự');
  if(item.serial){
   const serial=item.serial.toUpperCase();if(serials.has(serial))throw Error('Dòng '+line+': Serial/IMEI trùng với dữ liệu đã có hoặc trong file');serials.add(serial);
  }
  output.push(item);if(output.length+store.assets.length>=500)throw Error('Tối đa 499 CCDC');
 }
 if(!output.length)throw Error('File CCDC chưa có bản ghi từ dòng 2');
 return output;
}
async function importAssetsExcel(file){
 if(denyOperation('assets','create'))return;
 try{
  const rows=await parseAssetExcel(file);
  confirmDialog('Nhập CCDC từ Excel','Thêm '+rows.length+' CCDC vật lý, mỗi dòng tự tạo một mã riêng; không ghi đè dữ liệu có sẵn. Tiếp tục?',()=>{
   const previous=store.assets.slice();
   try{
    for(const item of rows){
     const id='CCDC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
     const asset={id,...item,name:item.type,createdAt:vnTodayISO(),updatedAt:new Date().toLocaleString('vi-VN',{hour12:false}),updatedBy:actualUser()?.fullName||'Người dùng',history:[]};
     appendAssetHistory(asset,'Nhập CCDC từ Excel',asset.serial);store.assets.unshift(asset);
    }
    persist();state.notice='Đã nhập '+rows.length+' CCDC từ Excel';render();
   }catch(err){store.assets=previous;state.notice='Lỗi nhập CCDC: '+err.message;render()}
  });
 }catch(err){state.notice='Không thể nhập Excel CCDC: '+(err?.message||'File không hợp lệ');refreshToasts()}
}
async function importPersonnelExcel(file){if(denyOperation('people','create'))return;
 try{
  const rows=await parsePersonnelExcel(file),toAdd={};
  for(const [key] of CATEGORY_FIELDS)toAdd[key]=[...new Set(rows.map(r=>r[key]).filter(x=>x&&!catalogs[key].includes(x)))];
  const newCategories=Object.values(toAdd).reduce((total,x)=>total+x.length,0);
  confirmDialog('Nhập nhân sự từ Excel','Thêm '+rows.length+' nhân sự và '+newCategories+' mục danh mục. Không ghi đè bản ghi có sẵn. Ảnh nhân sự bổ sung bằng chọn ảnh hoặc Ctrl + V. Tiếp tục?',()=>{
   const old=store.people.slice(),previous=Object.fromEntries(CATEGORY_FIELDS.map(([key])=>[key,catalogs[key].slice()]));
   try{
    for(const [key,values] of Object.entries(toAdd))catalogs[key].push(...values);
    store.people.push(...rows);persist();persistCatalogs();
    state.notice='Đã thêm '+rows.length+' nhân sự từ Excel';render();
   }catch(err){store.people=old;for(const key of Object.keys(previous))catalogs[key]=previous[key];state.notice='Lỗi nhập Excel: '+err.message;render()}
  });
 }catch(err){state.notice='Không thể nhập Excel: '+(err?.message||'File không hợp lệ');refreshToasts()}
}

function exportExcel(){
 const rows=state.view==='dashboard'?[['people','Nhân sự'],['shifts','Ra/vào ca'],['labor','Công nhật'],['minutes','Biên bản'],['assets','CCDC'],['pda','Mượn/trả PDA']].map(([view,name])=>({name,qty:datedRows(view).length,note:['people','assets'].includes(view)?'Hồ sơ theo ngày ghi nhận (hồ sơ cũ không ngày vẫn hiển thị)':'Phát sinh trong kỳ'})):filtered();
 const fields=state.view==='dashboard'?[['name','Phân hệ'],['qty','Số bản ghi'],['note','Phạm vi']]:state.view==='assets'?ASSET_DETAILS:columns[state.view];
 const exportRows=state.view==='assets'?rows.map(r=>({...r,state:assetUse(r),custodyLabel:assetCustody(r)})):rows;
 const blob=makeExcel(exportRows,fields,PAGES[state.view].title);
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;
 a.download=`pickpack-${state.view}-${state.periodPreset==='all'?'tat-ca':state.periodFrom+'-'+state.periodTo}.xlsx`;
 document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 state.notice=`Đã xuất Excel ${rows.length} ${state.view==='dashboard'?'phân hệ':'bản ghi'} theo khoảng thời gian`;render();
}
root.addEventListener('submit',function(e){
 if(e.target.id==='login-form'){
  e.preventDefault();const fd=new FormData(e.target);
  const username=String(fd.get('username')||'').trim();const ok=demoUsers.some(u=>u.username===username&&u.password===String(fd.get('password')||''));
  if(!ok){state.loginError='Tên đăng nhập hoặc mật khẩu không đúng';render();return}
  storageSet(SESSION_KEY,username);state.loginError='';location.href=href('dashboard');return;
 }
 if(e.target.id==='shift-scan-form'){
  e.preventDefault();
  const fd=new FormData(e.target),op=state.scanMode;
  scanShift(fd.get('employeeCode'),op,state.scanShift,state.scanUser,state.scanDesk);return;
 }
 if(e.target.id==='labor-scan-form'){e.preventDefault();const values=new FormData(e.target);scanLabor(values.get('employeeCode'),values.get('work'));return}
 if(e.target.id==='pda-scan-form'){e.preventDefault();const fd=new FormData(e.target);scanPda(fd.get('employeeCode'),fd.get('deviceCode'));return}
 if(e.target.id==='draft-confirm-form'){e.preventDefault();finishDraftPassword(e.target);return}
  if(e.target.id==='confirm-form'){e.preventDefault();finishConfirmation(e.target);return}
 if(e.target.id==='account-form'){e.preventDefault();const form=e.target;if(state.accountEdit)askDraftPassword('Xác nhận lưu tài khoản',()=>saveAccount(form));else saveAccount(form);return}
 if(e.target.id==='personal-settings-form'){e.preventDefault();savePersonalSettings(e.target);return}
 if(e.target.getAttribute('id')==='record-form'){e.preventDefault();submitRecordDraft(e.target)}
 if(e.target.id==='catalog-form'){e.preventDefault();submitCatalogDraft(e.target)}
 if(e.target.id==='asset-transfer-form'){e.preventDefault();const form=e.target;askDraftPassword('Xác nhận bàn giao CCDC',()=>saveAssetTransfer(form))}
});
root.addEventListener('click',e=>{
  const draftClose=e.target.closest('[data-action="draft-confirm-cancel"]');if(draftClose){if(draftClose.classList.contains('draft-confirm-overlay')&&e.target.closest('.confirmation-dialog'))return;cancelDraftPassword();return}
 const closeToast=e.target.closest('[data-toast-close]');if(closeToast){const i=notices.findIndex(x=>x.id===Number(closeToast.dataset.toastClose));if(i>=0)notices.splice(i,1);refreshToasts();return}
 const submitRecord=e.target.closest('#record-form button[type="submit"]');if(submitRecord){e.preventDefault();const form=submitRecord.form;if(form?.reportValidity())submitRecordDraft(form);else form.querySelectorAll('input,select').forEach(el=>{el.dataset.touched='1';markField(el)});return}
 const submitCategory=e.target.closest('#catalog-form button[type="submit"]');if(submitCategory){e.preventDefault();const form=submitCategory.form;if(form?.reportValidity())submitCatalogDraft(form);else form.querySelectorAll('input').forEach(el=>{el.dataset.touched='1';markField(el)});return}
 const removeMinute=e.target.closest('[data-minute-remove]');if(removeMinute){const id=removeMinute.dataset.minuteRemove;const draft=state.minuteDraftFiles.findIndex(([key])=>key===id);if(draft>=0)state.minuteDraftFiles.splice(draft,1);else if(!state.minuteRemoved.includes(id))state.minuteRemoved.push(id);void renderMinuteImages();return}
 const openMinute=e.target.closest('[data-minute-open]');if(openMinute){const id=openMinute.dataset.minuteOpen;const pending=state.minuteDraftFiles.find(([key])=>key===id)?.[1];void (async()=>{try{const blob=pending||await minuteGet(id);if(!(blob instanceof Blob))return;if(state.minuteZoomUrl)URL.revokeObjectURL(state.minuteZoomUrl);state.minuteZoomUrl=URL.createObjectURL(blob);state.modal='minute-zoom';render()}catch{state.notice='Không đọc được ảnh biên bản';refreshToasts()}})();return}
 const categoryTab=e.target.closest('[data-category-tab]');if(categoryTab){state.categoryTab=categoryTab.dataset.categoryTab;state.notice='';render();return}
 const categoryEdit=e.target.closest('[data-category-edit]');if(categoryEdit){if(denyOperation(state.catalogScope,'edit'))return;const value=catalogs[state.categoryTab]?.[Number(categoryEdit.dataset.categoryEdit)]||'';state.categoryEdit=value;state.modal='category-edit';render();return}
 const categoryDelete=e.target.closest('[data-category-delete]');if(categoryDelete){if(denyOperation(state.catalogScope,'delete'))return;deleteCatalog(Number(categoryDelete.dataset.categoryDelete));return}
 const pickUser=e.target.closest('[data-account-pick]');if(pickUser){if(denyOperation('access'))return;state.accessUser=pickUser.dataset.accountPick;render();return}
 const editAccount=e.target.closest('[data-account-edit]');if(editAccount){if(denyOperation('access'))return;state.accountEdit=editAccount.dataset.accountEdit;state.modal='account';render();return}
 const nav=e.target.closest('a[data-nav]');if(nav){if(e.button===0&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();if(nav.dataset.nav==='categories'||nav.dataset.nav==='resources'){state.catalogScope=nav.dataset.nav==='resources'?'resources':nav.dataset.catalogScope||'people';state.categoryTab=catalogFields(state.catalogScope)[0][0]}setView(nav.dataset.nav)}return}
 const photoEdit=e.target.closest('[data-photo-edit]');if(photoEdit){startPhotoEdit(photoEdit.dataset.photoEdit);return}
 const choosePda=e.target.closest('[data-pda-choose]');if(choosePda){
  const field=root.querySelector('#pda-device-code');if(!field)return;
  const picked=pdaMatches(field.value).find(a=>a.id===choosePda.dataset.pdaChoose);
  if(!picked)return;
  field.value=picked.serial||picked.id;
  const preview=root.querySelector('#pda-device-preview');if(preview)preview.innerHTML=pdaDeviceLookupPreview(field.value);
  const warning=root.querySelector('#pda-scan-ambiguity');if(warning)warning.hidden=true;
  root.querySelector('#pda-scan-form button[type="submit"]')?.focus();return;
 }
 const assetLoan=e.target.closest('[data-asset-loan]');if(assetLoan){if(denyOperation('pda','view'))return;const asset=store.assets.find(a=>a.id===assetLoan.dataset.assetLoan);if(!isPdaAsset(asset))return;setView('pda');state.pdaMode=assetLoanOpen(asset)?'return':'borrow';state.pdaPrefill=asset.id;render();root.querySelector('#pda-staff-code')?.focus();return}
 const transfer=e.target.closest('[data-asset-transfer]');if(transfer){if(denyOperation('assets','edit'))return;const id=transfer.dataset.assetId||state.drawer,action=transfer.dataset.assetTransfer;const asset=store.assets.find(a=>a.id===id);if(!asset||!['lend','repair','receive'].includes(action))return;state.transferId=id;state.transferAction=action;state.drawer='';state.modal='transfer';render();return}
  const record=e.target.closest('[data-record]');if(record){state.drawer=record.dataset.record;safeHistory('replaceState',href(state.view,state.drawer));render();return}
 const edit=e.target.closest('[data-edit]');if(edit){if(denyOperation(state.view,'edit'))return;const record=edit.dataset.edit;state.drawer='';safeHistory('replaceState',href(state.view));state.editId=record;state.photoDraft=state.view==='people'?(store.people.find(p=>p.id===record)?.photo||''):'';state.photoOriginalFile=null;if(state.view==='minutes'){state.minuteDraftFiles=[];state.minuteRemoved=[]}state.modal='edit';render();return}
 const undoShift=e.target.closest('[data-shift-undo]');if(undoShift){undoShiftCheckout(undoShift.dataset.shiftUndo);return}
  const del=e.target.closest('[data-delete]');if(del){deleteIds([del.dataset.delete]);return}
 const quick=e.target.closest('[data-quick]');if(quick){if(denyOperation(state.view,'edit'))return;const id=quick.dataset.quick;confirmDialog('Xác nhận thay đổi',`Nhập mật khẩu trước khi thay đổi bản ghi ${id}`,()=>quickChange(id));return}
 const scanMode=e.target.closest('[data-scan-mode]');if(scanMode){state.scanMode=scanMode.dataset.scanMode==='exit'?'exit':'enter';state.scanOutcome=null;state.scanCurrentStaff='';state.scanUser='';state.scanDesk='';render();root.querySelector('#shift-code')?.focus();return}
 const shiftChoice=e.target.closest('[data-scan-shift]');if(shiftChoice){state.scanShift=shiftChoice.dataset.scanShift;root.querySelectorAll('[data-scan-shift]').forEach(b=>{b.classList.toggle('active',b.dataset.scanShift===state.scanShift);b.setAttribute('aria-pressed',String(b.dataset.scanShift===state.scanShift))});root.querySelector('#shift-code')?.focus();return}
 const pdaMode=e.target.closest('[data-pda-mode]');if(pdaMode){state.pdaMode=pdaMode.dataset.pdaMode==='return'?'return':'borrow';state.pdaScan=null;render();root.querySelector('#pda-staff-code')?.focus();return}
 const accent=e.target.closest('[data-accent-choice]');if(accent){const chosen=accent.dataset.accentChoice;if(!ACCENTS.some(([key])=>key===chosen))return;state.accent=chosen;storageSet(ACCENT_KEY,chosen);render();return}
 const font=e.target.closest('[data-font]');if(font){state.fontPct=Math.max(90,Math.min(120,state.fontPct+Number(font.dataset.font)));storageSet(FONT_KEY,String(state.fontPct));render();return}const choice=e.target.closest('[data-theme-choice]');if(choice){const mode=choice.dataset.themeChoice;if(!['auto','light','dark'].includes(mode))return;state.themeMode=mode;state.theme=resolveTheme(mode);storageSet(THEME_KEY,mode);safeHistory('replaceState',href(state.view,state.drawer));render();return}const btn=e.target.closest('[data-action]');if(!btn)return;const act=btn.dataset.action;
 if(act==='crop-cancel'){closeCrop();return}
 if(act==='crop-apply'){acceptCrop();return}
 if(act==='crop-zoom-in'){if(cropSession)changeCropZoom(cropSession.zoom+0.1);return}
 if(act==='crop-zoom-out'){if(cropSession)changeCropZoom(cropSession.zoom-0.1);return}
 if(act==='crop-reset'){if(cropSession){cropSession.zoom=1.25;cropSession.offsetX=0;cropSession.offsetY=0;paintCrop()}return}
 if(act==='adjust-photo'){void adjustExistingPhoto().catch(err=>{state.notice=err.message;refreshToasts()});return}if(act==='close-modal'&&btn.classList.contains('modal-overlay')&&e.target.closest('.modal'))return;
 if(act==='close-drawer'&&btn.classList.contains('modal-overlay')&&e.target.closest('.detail-drawer'))return;
 switch(act){case'profile-menu':state.profileMenu=!state.profileMenu;break;
 case'catalog-input-add':{const parent=root.querySelector('#catalog-inputs');if(!parent||parent.children.length>=50)return;const n=parent.children.length+1;const row=document.createElement('div');row.className='catalog-input-line';row.innerHTML=`<input name="value" maxlength="80" minlength="2" required autocomplete="off" placeholder="Nhập tên danh mục ${n}">`;parent.append(row);root.querySelector('[data-action="catalog-input-remove"]').disabled=false;row.querySelector('input').focus();return}
 case'catalog-input-remove':{const parent=root.querySelector('#catalog-inputs');if(!parent||parent.children.length<=1)return;parent.lastElementChild.remove();const button=root.querySelector('[data-action="catalog-input-remove"]');if(button)button.disabled=parent.children.length===1;return}
 case'period-custom':state.periodOpen=!state.periodOpen;break;case'period-done':state.periodOpen=false;break;case'account-add':if(denyOperation('access'))return;state.accountEdit='';state.modal='account';break;case'category-add':if(denyOperation(state.catalogScope,'create'))return;state.categoryEdit='';state.modal='category-new';break;case'toggle-nav':state.sidebar=!state.sidebar;break;case'close-nav':state.sidebar=false;break;
 case'theme':state.themeMode=state.theme==='light'?'dark':'light';state.theme=state.themeMode;storageSet(THEME_KEY,state.themeMode);safeHistory('replaceState',document.body.dataset.screen==='app'?href(state.view,state.drawer):'index.html?theme='+state.theme);break;
 case'add':if(denyOperation(state.view,'create'))return;if(['shifts','dashboard','labor','pda'].includes(state.view))return;state.editId='';state.photoDraft='';state.photoOriginalFile=null;state.minuteDraftFiles=[];state.minuteRemoved=[];state.modal='new';break;case'close-modal':closeCrop();if(state.modal==='settings')state.profilePhotoDraft=null;if(state.modal==='minute-zoom'&&state.minuteZoomUrl){URL.revokeObjectURL(state.minuteZoomUrl);state.minuteZoomUrl=''}if(state.modal==='confirm'){pendingConfirmation=null;state.confirmData=null}state.modal='';state.editId='';state.photoDraft='';break;case'remove-photo':closeCrop();state.photoDraft='';state.photoOriginalFile=null;state.photoRemoveOriginal=true;{const preview=root.querySelector('#photo-preview');if(preview)preview.innerHTML=avatar({initial:'NV'},true)}return;case'close-drawer':state.drawer='';safeHistory('replaceState',href());break;
 case'zoom-portrait':if(portraitObjectUrl){state.modal='portrait';break}return;case'notifications':state.profileMenu=false;state.modal='notifications';break;case'settings':state.profileMenu=false;state.profilePhotoDraft=actualUser()?.photo||'';state.modal='settings';break;case'adjust-profile-photo':void adjustProfilePhoto().catch(err=>{state.notice=err.message;refreshToasts()});return;case'remove-profile-photo':state.profilePhotoDraft='';{const box=root.querySelector('#personal-photo-preview');if(box)box.innerHTML=avatar({initial:(actualUser()?.username||'NV').slice(0,2).toUpperCase()},true);const button=root.querySelector('[data-action="adjust-profile-photo"]');if(button)button.disabled=true;}return;case'reset-font':state.fontPct=100;storageSet(FONT_KEY,'100');break;
 case'clear-notice':notices.length=0;state.notice='';refreshToasts();break;
 case'show-password':{const form=root.querySelector('#login-form');const username=form?.querySelector('#demo-user')?.value||'';const password=form?.querySelector('#demo-password')?.value||'';state.loginVisible=!state.loginVisible;render();root.querySelector('#demo-user').value=username;root.querySelector('#demo-password').value=password;return}
 case'logout':document.body.classList.add('is-logging-out');setTimeout(()=>{storageRemove(SESSION_KEY);location.href='index.html'},180);return;
 case'bulk-delete':deleteIds([...state.selected]);return;
 
 case'backup-reset':if(denyOperation('access'))return;confirmDialog('Xóa toàn bộ dữ liệu','Toàn bộ dữ liệu nghiệp vụ, danh mục, user làm việc và ảnh trong trình duyệt này sẽ bị xóa. Không thể hoàn tác.',()=>{void resetOfflineTestData()});return;
 case'assets-excel-template':confirmFileAction('download','Tải file mẫu CCDC (Excel) về thiết bị?',downloadAssetTemplate);return;case'assets-excel-import':if(denyOperation('assets','create'))return;root.querySelector('#assets-excel-file')?.click();return;case'excel-template':confirmFileAction('download','Tải file mẫu nhân sự (Excel) về thiết bị?',downloadPersonnelTemplate);return;
 case'excel-import':if(denyOperation('people','create'))return;root.querySelector('#staff-excel-import')?.click();return;
 case'backup-export':if(denyOperation('access'))return;confirmFileAction('download','Xuất bản sao lưu JSON chứa dữ liệu nghiệp vụ và ảnh?',()=>{void exportOfflineBackup()});return;
 case'backup-import':if(denyOperation('access'))return;root.querySelector('#backup-import-file')?.click();return;
 case'export':if(state.view==='dashboard')return;confirmFileAction('download','Xuất Excel danh sách '+PAGES[state.view].title+' theo kỳ đã chọn?',exportExcel);return;
 }
 render();
});
function filterPersonnelInput(input){
 if(state.view!=='people'||!input?.matches('#record-form input[name="id"],#record-form input[name="phone"]')||input.dataset.composing==='1')return;
 const original=input.value,filtered=v=>v.replace(/[^0-9]/g,'');
 const next=filtered(original);if(next===original)return;
 const caret=input.selectionStart;
 input.value=next;
 if(caret!==null)input.setSelectionRange(filtered(original.slice(0,caret)).length,filtered(original.slice(0,caret)).length);
}
root.addEventListener('compositionstart',e=>{if(e.target.matches('#record-form input[name="id"],#record-form input[name="phone"]'))e.target.dataset.composing='1'});
root.addEventListener('compositionend',e=>{if(e.target.matches('#record-form input[name="id"],#record-form input[name="phone"]')){delete e.target.dataset.composing;filterPersonnelInput(e.target);markField(e.target)}});
root.addEventListener('input',function(e){
 if(e.target.id==='crop-zoom'){changeCropZoom(Number(e.target.value)/100);return}
 if(!e.isComposing)filterPersonnelInput(e.target);
 markField(e.target);
 if(e.target.id==='shift-code'){
  const code=e.target.value.trim(),person=store.people.find(p=>p.id===code),preview=root.querySelector('#scan-preview');
  if(state.scanCurrentStaff!==code){state.scanCurrentStaff=code;state.scanUser='';state.scanDesk=''}
  if(preview)preview.innerHTML=code&&!person?'<div class="scan-empty">Chưa tìm thấy mã nhân viên phù hợp.</div>':scanPreview(person);
  const area=root.querySelector('#scan-allocation');if(area)area.innerHTML=scanAssignment(person);
  if(person)void renderScanPortrait(person);
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
  const preview=root.querySelector('#pda-device-preview');if(preview)preview.innerHTML=pdaDeviceLookupPreview(e.target.value);const warning=root.querySelector('#pda-scan-ambiguity');if(warning)warning.hidden=true;return;
 }
 if(e.target.id==='global-search'){
  const input=e.target;state.search=input.value;
  if(state.view==='dashboard'){const target=root.querySelector('#dashboard-search-results');if(target)target.innerHTML=dashboardSearchResults();return}
  const pos=input.selectionStart;render();
  const newInput=root.querySelector('#global-search');if(newInput){newInput.focus();newInput.setSelectionRange(pos,pos)}
 }
});
root.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='shift-code'&&state.scanMode==='enter'){const person=store.people.find(p=>p.id===e.target.value.trim());if(person&&workRole(person.position)&&!state.scanUser){e.preventDefault();root.querySelector('#scan-user-choice')?.focus();return}}if(e.target.id==='pda-staff-code'&&e.key==='Enter'){e.preventDefault();root.querySelector('#pda-device-code')?.focus()}});
root.addEventListener('paste',async function(e){
 if(state.modal!=='settings'&&(!['new','edit'].includes(state.modal)||!['people','minutes'].includes(state.view)))return;
 const pictures=[...(e.clipboardData?.items||[])].filter(item=>item.kind==='file'&&item.type.startsWith('image/')).map(item=>item.getAsFile()).filter(Boolean);
 if(!pictures.length)return;
 e.preventDefault();
 const target=state.modal==='settings'?'Ảnh đại diện':state.view==='people'?'Ảnh nhân sự':'Ảnh biên bản';
 confirmFileAction('upload','Thêm '+pictures.length+' ảnh vào '+target.toLowerCase()+'?',()=>{
  const work=state.modal==='settings'?applyProfilePhoto(pictures[0]):state.view==='people'?applyStaffPhoto(pictures[0]):addMinuteDraftImages(pictures);
  void work.catch(err=>{state.notice=err?.message||'Không thể dán ảnh';refreshToasts()});
 });
});
root.addEventListener('change',async function(e){
 if(e.target.id==='transfer-department'){
  const note=root.querySelector('#asset-transfer-note');if(note){note.required=e.target.value==='Khác';note.placeholder=note.required?'Bắt buộc: ghi rõ bộ phận/nơi nhận ngoài danh mục':'Tình trạng, thông tin chứng từ (nếu có)'}return;
 }
 if(e.target.id==='crop-zoom'){changeCropZoom(Number(e.target.value)/100);return}
 if(e.target.id==='period-preset'){const value=e.target.value;state.periodPreset=value;const [from,to]=periodBounds(value);if(value!=='custom'){state.periodFrom=from;state.periodTo=to;}state.periodOpen=value==='custom';state.selected.clear();render();return}
 if(e.target.id==='period-from'||e.target.id==='period-to'){
  const from=root.querySelector('#period-from')?.value||'',to=root.querySelector('#period-to')?.value||'';
  if(!from||!to)return;
  if(from>to){state.notice='Ngày bắt đầu không được sau ngày kết thúc';refreshToasts();return}
  state.periodPreset='custom';state.periodFrom=from;state.periodTo=to;state.periodOpen=true;state.selected.clear();render();return;
 }
 if(e.target.id==='profile-photo'){const file=e.target.files?.[0];e.target.value='';if(file)confirmFileAction('upload','Sử dụng ảnh '+file.name+' làm ảnh đại diện?',()=>{void applyProfilePhoto(file).catch(err=>{state.notice=err.message;refreshToasts()})});return}
 if(e.target.id==='staff-excel-import'){const file=e.target.files?.[0];e.target.value='';if(file)confirmFileAction('upload','Đọc file nhân sự '+file.name+' để kiểm tra và nhập Excel?',()=>{void importPersonnelExcel(file)});return}
  if(e.target.id==='assets-excel-file'){const file=e.target.files?.[0];e.target.value='';if(file)confirmFileAction('upload','Đọc file CCDC '+file.name+' để kiểm tra và nhập Excel?',()=>{void importAssetsExcel(file)});return}
 if(e.target.id==='backup-import-file'){if(denyOperation('access'))return;
  const file=e.target.files?.[0];e.target.value='';if(file)confirmFileAction('upload','Đọc bản sao lưu '+file.name+'? Bước thay thế dữ liệu sẽ xác nhận sau khi kiểm tra file.',()=>{void importOfflineBackup(file)});return;
 }
 if(e.target.id==='minute-photo'){const files=Array.from(e.target.files||[]);e.target.value='';if(files.length)confirmFileAction('upload','Thêm '+files.length+' ảnh vào biên bản?',()=>{void addMinuteDraftImages(files).catch(err=>{state.notice=err.message;refreshToasts()})});return}
 if(e.target.id==='staff-photo'){
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  confirmFileAction('upload','Sử dụng ảnh '+file.name+' cho hồ sơ nhân sự?',()=>{void applyStaffPhoto(file).catch(err=>{state.notice=err?.message||'Không đọc được ảnh';refreshToasts()})})
  return;
 }
 markField(e.target);
 if(e.target.id==='labor-work'){state.laborWork=e.target.value;return}
 if(e.target.id==='scan-user-choice'){state.scanUser=e.target.value;return}
 if(e.target.id==='scan-desk-choice'){state.scanDesk=e.target.value;return}
 if(e.target.id==='role-preview'&&actualUser()?.role==='superadmin'){state.previewUser=e.target.value;state.view=firstAllowed();state.accessUser='dieuphoile';state.modal='';render();return}
 if(e.target.matches('[data-permission]')){if(denyOperation('access')){render();return}const user=demoUsers.find(u=>u.username===state.accessUser);if(!user||user.role==='superadmin')return;const [area,action]=e.target.dataset.permission.split(':');if(!PERMISSION_AREAS.includes(area)||!PERMISSION_ACTIONS.some(([name])=>name===action))return;user.permissions[area][action]=e.target.checked;if(action==='view'&&!e.target.checked){for(const [key] of PERMISSION_ACTIONS)user.permissions[area][key]=false}if(action!=='view'&&e.target.checked)user.permissions[area].view=true;persistDemoUsers();render();return}
 if(e.target.matches('[data-shift-filter]')){state.shiftFilter[e.target.dataset.shiftFilter]=e.target.value;state.selected.clear();render();return}
  if(e.target.id==='status-filter'){state.filter=e.target.value;state.selected.clear();render();return}
 if(e.target.id==='select-all'){const ids=filtered().map(x=>x.id);if(e.target.checked)ids.forEach(id=>state.selected.add(id));else ids.forEach(id=>state.selected.delete(id));render();return}
 if(e.target.matches('[data-select]')){if(e.target.checked)state.selected.add(e.target.dataset.select);else state.selected.delete(e.target.dataset.select);render()}
});
window.addEventListener('storage',e=>{if(e.key===CATALOG_KEY){Object.assign(catalogs,readCatalogs());render()}if(e.key===STORAGE_KEY){const fresh=readRecords();for(const key of Object.keys(store))store[key]=fresh[key];state.notice='Dữ liệu đã được đồng bộ từ tab khác';render()}if(e.key===THEME_KEY){const mode=storageGet(THEME_KEY);state.themeMode=['auto','light','dark'].includes(mode)?mode:'auto';state.theme=resolveTheme(state.themeMode);render()}if(e.key===DEMO_USERS_KEY){const updated=readDemoUsers();demoUsers.splice(0,demoUsers.length,...updated);render()}if(e.key===SESSION_KEY)render()});
window.addEventListener('popstate',()=>{const p=new URLSearchParams(location.search);state.view=PAGES[p.get('view')]?p.get('view'):'dashboard';state.periodPreset=state.view==='people'?'all':'today';[state.periodFrom,state.periodTo]=periodBounds(state.periodPreset);state.catalogScope=['people','labor','minutes','assets','resources'].includes(p.get('scope'))?p.get('scope'):'people';state.categoryTab=catalogFields(state.catalogScope)[0][0];if(state.view==='resources'){state.catalogScope='resources';state.categoryTab='userTypes'}state.theme=resolveTheme(state.themeMode);state.drawer=p.get('record')||'';state.search='';state.filter='all';state.selected.clear();render()});
function markField(el){if(!el?.matches('#record-form input:not([type=file]),#record-form select,#catalog-form input'))return;const touched=el.dataset.touched==='1'||String(el.value||'').trim().length>0;const valid=el.checkValidity();el.classList.toggle('is-valid',touched&&valid);el.classList.toggle('is-invalid',touched&&!valid)}
root.addEventListener('focusout',e=>{if(e.target.matches('#record-form input,#record-form select,#catalog-form input')){e.target.dataset.touched='1';markField(e.target)}});
window.addEventListener('keydown',e=>{if(e.key==='Escape'){if(draftConfirmation){cancelDraftPassword();return}if(cropSession){e.preventDefault();closeCrop();return}closeStuff();render()}});
window.addEventListener('focus',tickClock);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tickClock()});
render();
setInterval(tickClock,1000);
})();
