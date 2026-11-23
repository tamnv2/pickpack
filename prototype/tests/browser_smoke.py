from pathlib import Path
import os
import base64
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
js=(root/'assets/app.js').read_text(encoding='utf-8')
css=(root/'assets/styles.css').read_text(encoding='utf-8')
fixture=json.loads((root/'tests/legacy_fixture.json').read_text(encoding='utf-8'))
# Synthetic fixtures: each PDA is a single CCDC asset. No production data is seeded.
for i,device in enumerate(fixture['records']['pdaDevices']):
 fixture['records']['assets'][-(i+1)]={'id':device['id'],'name':'PDA','type':'PDA','serial':device['serial'],'condition':'Tốt','state':'Có sử dụng','note':'Mẫu thử nghiệm','createdAt':'2026-11-16','history':[]}

with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=os.environ['CHROMIUM_PATH'] if os.environ.get('CHROMIUM_PATH') else None,args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':1440,'height':900},accept_downloads=True)
 ctx.set_default_timeout(2000)
 def new_screen(screen='app',mobile=False,seed=True):
  pg=(browser.new_context(viewport={'width':390,'height':844},is_mobile=True) if mobile else ctx).new_page()
  pg.set_default_timeout(2000)
  pg.set_content(f'<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body data-screen="{screen}"><div id="root"></div></body></html>')
  pg.evaluate("""() => {let m = new Map([['pickpack1291_office_session_v096','superadmin']]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}})}""")
  if seed:pg.evaluate("""fixture=>{localStorage.setItem('pickpack1291_office_records_v094',JSON.stringify(fixture.records));localStorage.setItem('pickpack1291_office_catalogs_v094',JSON.stringify(fixture.catalogs))}""",fixture)
  pg.add_style_tag(content=css)
  pg.add_script_tag(content=js)
  if screen=='app' and seed:
   assert pg.locator('#period-preset').input_value()=='today'
   pg.locator('#period-preset').select_option('all')  # Legacy fixture rows predate today.
  return pg
 login=new_screen('login')
 assert login.locator('form#login-form').count()==1
 assert login.locator('.login-links .web-version').inner_text()=='Web v0.12.3'
 login.locator('input[name="username"]').fill('bad')
 login.locator('input[name="password"]').fill('bad')
 login.locator('button[type="submit"]').click()
 assert login.get_by_text('Tên đăng nhập hoặc mật khẩu không đúng').count()==1
 login.locator('input[name="username"]').fill('superadmin')
 login.locator('input[name="password"]').fill('1')
 login.locator('button[data-action="show-password"]').click()
 assert login.locator('input[name="password"]').input_value()=='1'
 assert login.locator('input[name="password"]').get_attribute('type')=='text'
 login.screenshot(path=str(root/'preview-login.png'),full_page=True)
 # A fresh Web v0.12.3 browser must have no test records or catalogs.
 clean=new_screen(seed=False)
 assert clean.locator('.metrics .metric-number').first.inner_text()=='0'
 for module in ['people','shifts','labor','minutes','assets','pda','resources']:
  clean.locator(f'a.nav-main[href*="view={module}"]').click()
  assert not clean.locator('.module-table tbody tr,.people-table tbody tr').count(),module
  if module=='pda':assert clean.locator('.device-registry').count()==0 and clean.locator('#pda-scan-form').count()==1
  if module=='resources':assert clean.locator('.catalog-panel tbody tr').count()==0
 clean.locator('a.nav-main[href*="view=people"]').click()
 clean.locator('[data-catalog-scope="people"]').click()
 assert clean.locator('.catalog-panel tbody tr').count()==0
 clean.close()
 app=new_screen()
 errs=[];app.on('pageerror',lambda e:errs.append(str(e)))
 assert app.locator('a.nav-main').count()==9
 assert 'undefined' not in app.locator('.sidebar').inner_text()
 assert app.locator('a.nav-main[href*="view=resources"] .ui-svg').count()==1
 assert app.locator('.side-bottom .web-version').inner_text()=='Web v0.12.3'
 assert app.locator('.site-footer').inner_text()=='Phát triển hệ thống - tamnv2 | Pick Pack 1291'
 assert app.locator('.side-bottom .site-footer').count()==1
 assert app.locator('.app-main .site-footer').count()==0
 assert app.locator('.site-footer').evaluate("el => getComputedStyle(el).position")=='static'
 assert app.locator('.site-footer').evaluate("el => getComputedStyle(el).textAlign")=='left'
 assert float(app.locator('.site-footer').evaluate("el => getComputedStyle(el).opacity"))<=0.75
 assert not app.locator('button.menu-button').is_visible()
 labels=app.locator('.nav-flat .nav-label').all_inner_texts()
 assert len(labels)==9,labels
 assert labels==['Tổng quan vận hành','Quản lý nhân sự','Quét vào / ra ca','Mượn / trả PDA','Quản lý công nhật','Quản lý biên bản','Quản lý CCDC','Quản lý tài nguyên','Quản lý quyền truy cập']
 assert app.locator('.nav-flat .nav-label').evaluate_all("(els)=>els.every(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)")
 assert app.locator('.topbar').evaluate("el=>getComputedStyle(el).position")=='sticky'
 assert app.locator('#clock-time').count()==1 and app.locator('#clock-date').count()==0
 assert app.locator('.flip-digit,.flip-pane,.flip-flap').count()==0
 assert app.locator('#clock-hours').count()==1 and app.locator('#clock-seconds').count()==1
 assert app.locator('#clock-time').get_attribute('aria-live')=='off'
 assert app.locator('#clock-time').evaluate("el => /^\\d{2}:\\d{2}:\\d{2} [AP]M$/.test(el.getAttribute('aria-label'))")
 assert app.locator('#clock-period').inner_text() in ('AM','PM')
 assert app.locator('.header-clock').get_attribute('aria-label')=='Giờ Việt Nam'
 assert app.locator('#clock-time').evaluate("el=>{const c=el.getBoundingClientRect(),h=el.closest('.header-clock').getBoundingClientRect();return c.left>=h.left-1&&c.right<=h.right+1&&c.top>=h.top-1&&c.bottom<=h.bottom+1}")
 assert app.locator('#clock-time').evaluate("el=>getComputedStyle(el).backgroundColor")=='rgba(0, 0, 0, 0)'
 assert app.locator('#clock-hours').evaluate("el=>getComputedStyle(el).color")!=app.locator('#clock-seconds').evaluate("el=>getComputedStyle(el).color")
 old_clock=app.locator('#clock-time').inner_text()
 app.evaluate("() => window.__clockNode=document.querySelector('#clock-time')")
 app.wait_for_function("old => document.querySelector('#clock-time')?.textContent !== old",arg=old_clock,timeout=5000)
 assert app.evaluate("() => window.__clockNode===document.querySelector('#clock-time')")
 app.set_viewport_size({'width':1024,'height':768})
 assert app.locator('#clock-time').evaluate("el=>{const c=el.getBoundingClientRect(),h=el.closest('.header-clock').getBoundingClientRect();return c.left>=h.left-1&&c.right<=h.right+1}")
 assert not app.locator('button.menu-button').is_visible()
 assert app.locator('.nav-flat .nav-label').evaluate_all("(els)=>els.every(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)")
 app.set_viewport_size({'width':1440,'height':900})
 assert app.locator('.corporate-brand span').all_inner_texts()==['CÔNG TY CỔ PHẦN THE SUPRA','DC HƯNG YÊN']
 assert app.locator('.top-profile .profile-name strong').inner_text()=='superadmin'
 assert app.locator('.side-bottom').get_by_text('superadmin').count()==0
 assert app.locator('.breadcrumb').count()==0
 assert app.locator('.page-header .eyebrow').count()==0
 assert app.locator('.page-header h1').count()==0
 assert app.locator('.metrics.overview-metrics .metric-card').count()==8
 assert app.locator('#global-search').is_visible()
 header_slots=lambda: app.evaluate("""() => ['.top-search','.topbar .notif','.header-clock'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.x,r.y,r.width]})""")
 overview_slots=header_slots()
 assert app.locator('#dashboard-search-results .dashboard-search-panel').count()==0
 app.evaluate("() => window.__overviewClock=document.querySelector('#clock-time')")
 app.locator('#global-search').fill('90000001')
 assert app.locator('#dashboard-search-results .dashboard-search-panel').count()==1
 assert app.locator('#dashboard-search-results .dashboard-search-hit[href*="view=people"][href*="record=90000001"]').count()==1
 assert app.evaluate("() => window.__overviewClock===document.querySelector('#clock-time')")
 assert app.locator('.metrics.overview-metrics .metric-card').count()==8
 app.locator('#global-search').fill('KHONG_CO_BAN_GHI_1291')
 assert app.locator('#dashboard-search-results .dashboard-no-results').count()==1
 app.locator('#global-search').fill('')
 assert app.locator('#dashboard-search-results .dashboard-search-panel').count()==0
 assert app.locator('.coverage-row').count()==6
 assert app.get_by_text('Trạng thái toàn hệ thống').count()==1
 assert app.locator('.shortcut-panel').count()==0
 assert app.locator('.overview-page button[data-action="add"]').count()==0
 assert app.locator('.topbar .period-export,.topbar [data-action="export"]').count()==0
 assert app.locator('.demo-note').count()==0
 assert app.locator('button[data-action="settings"]').count()==0
 assert app.locator('.location-chip,.group-title').count()==0
 assert app.locator('.side-link').count()==9
 assert app.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--text-scale').trim()")=='1.1'
 assert app.locator('#role-preview').count()==1
 assert app.locator('.header-theme [data-theme-choice]').count()==3
 app.locator('button[data-theme-choice="light"]').click()
 app.locator('.top-profile').click()
 assert app.locator('.profile-dropdown button[data-action="settings"]').count()==1
 app.locator('button[data-action="settings"]').click()
 assert app.locator('#personal-settings-form [name="fullName"]').input_value()=='superadmin'
 assert app.locator('#personal-settings-form [name="newPassword"]').count()==1
 assert app.get_by_text('Cỡ chữ',exact=True).count()==1
 assert app.locator('.font-steps output').inner_text()=='100%'
 assert app.locator('[data-action="backup-export"]').is_visible()
 assert app.locator('[data-action="backup-import"]').is_visible()
 assert app.locator('#backup-import-file[type="file"]').count()==1
 app.locator('button[data-font="5"]').click()
 assert app.locator('.font-steps output').inner_text()=='105%'
 assert app.locator('button[data-accent-choice]').count()==7
 assert app.locator('.accent-swatches').evaluate('el=>getComputedStyle(el).flexWrap')=='nowrap'
 app.locator('button[data-accent-choice="green"]').click()
 assert app.evaluate('document.documentElement.dataset.accent')=='green'
 assert app.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()")=='#198056'
 assert app.evaluate("localStorage.getItem('pickpack1291_office_light_accent_v08')")=='green'
 app.locator('button[data-action="close-modal"]').last.click()
 assert app.locator('[data-theme-choice="auto"]').count()==1
 app.locator('button[data-theme-choice="auto"]').click()
 assert app.evaluate("localStorage.getItem('pickpack1291_office_theme_v06')")=='auto'
 vn_hour=app.evaluate("Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',hour:'2-digit',hourCycle:'h23'}).format(new Date()))")
 assert app.evaluate('document.documentElement.dataset.theme')==('light' if 6<=vn_hour<18 else 'dark')
 app.locator('button[data-theme-choice="dark"]').click()
 assert app.evaluate("document.documentElement.getAttribute('data-theme')")=='dark'
 app.locator('.top-profile').click()
 app.locator('button[data-action="settings"]').click()
 assert app.locator('button[data-accent-choice="green"]').get_attribute('aria-pressed')=='true'
 assert app.locator('.accent-swatches').is_visible()
 app.locator('button[data-accent-choice="violet"]').click()
 assert app.evaluate("document.documentElement.dataset.accent")=='violet'
 assert app.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()")=='#d2a3f9'
 app.locator('button[data-action="close-modal"]').last.click()
 app.locator('button[data-theme-choice="light"]').click()
 assert app.locator('.nav-external').count()==0
 assert app.locator('a.nav-main').first.get_attribute('href').startswith('app.html?')
 app.screenshot(path=str(root/'preview-dashboard.png'),full_page=True)
 expected={'people':36,'shifts':42,'labor':42,'minutes':30,'assets':30,'pda':30}
 print('testing modules',flush=True)
 for module,n in expected.items():
  app.locator(f'a.nav-main[href*="view={module}"]').click()
  app.locator('#period-preset').select_option('all')  # Legacy synthetic fixtures span old dates; module default is today.
  assert not errs,(module,errs)
  assert all(abs(a-b)<1 for x,y in zip(overview_slots,header_slots()) for a,b in zip(x,y)),module
  assert app.locator('.table-panel').last.locator('.records-label b').inner_text()==str(n),(module,app.locator('.table-panel').last.locator('.records-label b').inner_text())
  assert app.locator('.table-panel').last.locator('table tbody tr').count()==n
  assert app.locator('.table-panel .records-table').count()==1
  assert app.locator('.table-panel .records-table').evaluate("el=>{const th=el.querySelector('th[data-col]'),td=el.querySelector('td[data-col]');return getComputedStyle(el).tableLayout==='auto'&&parseFloat(getComputedStyle(th).paddingLeft)>=10&&parseFloat(getComputedStyle(td).paddingRight)>=10}"),module
  if module=='labor':
   assert app.locator('.module-table thead th[data-col]').all_inner_texts()[:5]==['Ngày','Ca','Mã nhân viên','Họ và tên','Nhà thầu']
  if module=='pda':
   assert app.locator('.module-table thead th[data-col]').all_inner_texts()[:5]==['Ngày','Ca','Mã nhân viên','Họ và tên','Nhà thầu']
  if module=='minutes':
   assert app.locator('.module-table thead th[data-col]').all_inner_texts()[0]=='Ngày biên bản'
  if module=='assets':
   assert app.locator('.module-table thead th[data-col]').all_inner_texts()[0]=='Ngày ghi nhận'
   assert app.locator('.asset-dashboard .asset-kpi').count()==4
   assert app.locator('.asset-dashboard-group').count()==2
   assert app.locator('.asset-type-card').count()>=1
   assert int(app.locator('.asset-dashboard .asset-kpi').first.locator('strong').inner_text())==app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).assets.filter(a=>!(Number(a.qty)>1)).length")
  assert app.locator('a.cell-record-link').first.get_attribute('href').startswith(f'app.html?view={module}'),(module,app.locator('a.cell-record-link').first.get_attribute('href'))
  assert app.locator('.table-panel').last.locator('button[data-action="export"]').inner_text().strip().endswith('Xuất Excel')
  assert app.locator('.record-card').count()==0
  assert app.locator('[data-action="layout-cards"],[data-action="layout-table"]').count()==0
  assert app.locator('.page-header h1').count()==0
  assert app.locator('.module-summary').count()==0
  if module=='shifts':
   assert app.locator('.module-table thead th[data-col]').all_inner_texts()[:5]==['Ngày','Ca','Mã nhân viên','Họ và tên','Nhà thầu']
   assert app.locator('.shift-summary,.shift-summary-group').count()==0
   assert app.locator('.shift-scan-toolbar').evaluate("el=>{const a=el.querySelector('.shift-scan-choice'),b=el.querySelectorAll('.shift-scan-choice')[1],c=el.querySelector('.shift-scan-entry');const x=a.getBoundingClientRect(),y=b.getBoundingClientRect(),z=c.getBoundingClientRect();return Math.abs(x.bottom-y.bottom)<3&&Math.abs(x.bottom-z.bottom)<3&&z.left>y.right}")
 def authorize(password='1'):
  if app.locator('#draft-confirm-form').count():
   app.locator('#draft-password').fill(password)
   app.locator('#draft-confirm-form button[type="submit"]').click()
  else:
   assert app.locator('#confirm-form').count()==1
   app.locator('#confirm-password').fill(password)
   app.locator('#confirm-form button[type="submit"]').click()
 print('testing labor QR scan',flush=True)
 app.locator('a.nav-main[href*="view=labor"]').click()
 app.locator('#period-preset').select_option('all')
 assert app.locator('#labor-scan-form').count()==1
 assert app.locator('[data-catalog-scope="labor"]').count()==1
 assert app.locator('button[data-action="add"]').count()==0
 assert ['Giờ bắt đầu','Giờ kết thúc']==app.locator('.table-panel thead th').all_inner_texts()[-3:-1]
 app.locator('#labor-work').select_option('Pick')
 # No current open shift means neither a single scan nor a batch scan may stage labor.
 app.locator('#labor-staff-code').fill('90000034')
 app.locator('#labor-staff-code').press('Enter')
 assert 'chưa vào ca hoặc đã ra ca' in app.locator('.scan-outcome').inner_text()
 assert app.locator('#labor-entry-form').count()==0
 assert app.locator('.records-label b').inner_text()=='42'
 # Add synthetic same-day shifts only for this labor scenario. Remove them before shift count tests.
 app.evaluate("""() => {
  const key='pickpack1291_office_records_v094',d=JSON.parse(localStorage.getItem(key));
  const date=new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Ho_Chi_Minh'});
  for(const staff of ['90000034','90000035','90000036']){
   d.shifts.push({id:'CA-LAB-'+staff.slice(-2),staff,date,shift:'Ca 1',checkin:'00:00:00',checkout:'—',state:'Trong ca',user:'—'});
  }
  d.shifts.push({id:'CA-LAB-32',staff:'90000032',date,shift:'Ca 1',checkin:'00:00:00',checkout:'01:00:00',state:'Đã ra ca',user:'—'});
  localStorage.setItem(key,JSON.stringify(d));dispatchEvent(new StorageEvent('storage',{key}));
 }""")
 app.locator('#labor-staff-code').fill('90000032')
 app.locator('#labor-staff-code').press('Enter')
 assert 'chưa vào ca hoặc đã ra ca' in app.locator('.scan-outcome').inner_text()
 app.locator('#labor-staff-code').fill('90000034')
 app.locator('#labor-staff-code').press('Enter')
 assert app.locator('#labor-entry-form').count()==1
 assert 'Kiểm tra giờ bắt đầu' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.records-label b').inner_text()=='42'  # No persistence on initial scan.
 assert app.locator('#labor-entry-start').input_value()
 assert app.locator('#labor-entry-end').input_value()==''
 assert app.locator('#labor-work').input_value()=='Pick'
 app.locator('#labor-entry-start').fill('06:30:01')
 app.locator('#labor-entry-form button[type="submit"]').click()
 assert app.locator('#labor-entry-form').count()==0
 assert app.locator('.records-label b').inner_text()=='43'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor[0].endTime==='—'")
 app.locator('.table-panel').last.locator('tbody tr').first.locator('[data-edit]').click()
 assert app.locator('#record-form').count()==1
 app.locator('#record-form select[name="work"]').select_option('Pick')
 app.locator('#record-form input[name="startTime"]').fill('06:31:01')
 app.locator('#record-form button[type="submit"]').click()
 authorize('wrong')
 assert app.locator('#draft-confirm-error').inner_text()=='Mật khẩu không đúng'
 authorize()
 assert '06:31:01' in app.locator('.table-panel').last.locator('tbody tr').first.inner_text()
 app.locator('#labor-staff-code').fill('90000034')
 app.locator('#labor-staff-code').press('Enter')
 assert app.locator('#labor-entry-form').count()==1
 assert app.locator('#labor-entry-end').input_value()!=''
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor[0].endTime==='—'")
 app.locator('#labor-entry-end').fill('07:00:00')
 app.locator('#labor-entry-form button[type="submit"]').click()
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor[0].endTime==='07:00:00'")
 app.locator('#labor-staff-code').fill('NOT_FOUND')
 app.locator('#labor-staff-code').press('Enter')
 assert 'Không tìm thấy mã nhân viên' in app.locator('.scan-outcome').inner_text()
 # Batch: scans stay pending until one atomic confirmation.
 app.locator('#labor-batch-mode').check()
 assert app.locator('#labor-batch-mode').is_checked()
 app.locator('#labor-work').select_option('Pick')
 assert app.locator('.labor-batch-toggle').evaluate("el=>el.getBoundingClientRect().top>=document.querySelector('#labor-work').getBoundingClientRect().bottom")
 assert app.locator('#labor-batch-mode').evaluate("el=>el.getBoundingClientRect().height<=18")
 app.locator('#labor-staff-code').fill('90000035')
 app.locator('#labor-staff-code').press('Enter')
 assert app.locator('.labor-queue-table tbody tr').count()==1
 app.locator('#labor-copy-start').check()
 app.locator('#labor-copy-end').check()
 assert app.locator('#labor-copy-start').evaluate("el=>el.getBoundingClientRect().height<=18")
 app.locator('[data-labor-id="90000035"][data-labor-time="startTime"]').fill('06:20:00')
 app.locator('[data-labor-id="90000035"][data-labor-time="endTime"]').fill('07:00:00')
 app.locator('#labor-staff-code').fill('90000036')
 app.locator('#labor-staff-code').press('Enter')
 assert app.locator('.labor-queue-table tbody tr').count()==2
 assert app.locator('.records-label b').inner_text()=='43'
 assert app.locator('[data-labor-id="90000036"][data-labor-time="startTime"]').input_value()=='06:20:00'
 assert app.locator('[data-labor-id="90000036"][data-labor-time="endTime"]').input_value()=='07:00:00'
 assert app.locator('[data-labor-id="90000036"][data-labor-time="startTime"]').is_disabled()
 assert app.locator('[data-labor-id="90000036"][data-labor-time="endTime"]').is_disabled()
 app.locator('[data-labor-id="90000035"][data-labor-time="endTime"]').fill('07:05:00')
 assert app.locator('[data-labor-id="90000036"][data-labor-time="endTime"]').input_value()=='07:05:00'
 app.locator('#labor-copy-start').uncheck()
 app.locator('[data-labor-id="90000036"][data-labor-time="startTime"]').fill('06:25:00')
 assert app.locator('[data-labor-id="90000035"][data-labor-time="startTime"]').input_value()=='06:20:00'
 # If any queued employee leaves their shift before confirmation, nothing is saved.
 app.evaluate("""() => {const key='pickpack1291_office_records_v094',d=JSON.parse(localStorage.getItem(key)),r=d.shifts.find(x=>x.id==='CA-LAB-36');r.state='Đã ra ca';r.checkout='01:00:00';localStorage.setItem(key,JSON.stringify(d));dispatchEvent(new StorageEvent('storage',{key}));}""")
 app.locator('[data-action="labor-queue-save"]').click()
 assert 'đã ra ca' in app.locator('#toast-stack').inner_text()
 assert app.locator('.records-label b').inner_text()=='43'
 assert app.locator('.labor-queue-table tbody tr').count()==2
 app.evaluate("""() => {const key='pickpack1291_office_records_v094',d=JSON.parse(localStorage.getItem(key)),r=d.shifts.find(x=>x.id==='CA-LAB-36');r.state='Trong ca';r.checkout='—';localStorage.setItem(key,JSON.stringify(d));dispatchEvent(new StorageEvent('storage',{key}));}""")
 app.locator('[data-action="labor-queue-save"]').click()
 assert app.locator('.labor-queue-table tbody tr').count()==0
 assert app.locator('.records-label b').inner_text()=='45'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor.filter(r=>['90000035','90000036'].includes(r.staff)&&r.date===new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Ho_Chi_Minh'})).length")==2
 # Selected employee records can be edited together with a single authenticated commit.
 for code in ['90000035','90000036']:
  app.locator('.table-panel tbody tr').filter(has_text=code).first.locator('[data-select]').check()
 app.locator('[data-action="labor-bulk-edit"]').click()
 assert app.locator('#labor-bulk-form').count()==1
 ys=[app.locator('#labor-bulk-'+field).bounding_box()['y'] for field in ['work','start','end']]
 assert max(ys)-min(ys)<3,ys  # Inputs must align despite the hint below the grid.
 app.locator('#labor-bulk-form button[type="submit"]').click()
 assert 'Chọn ít nhất' in app.locator('#labor-bulk-error').inner_text()
 app.locator('[name="bulkWork"]').check()
 app.locator('#labor-bulk-work').select_option('Điều phối')
 app.locator('[name="bulkStart"]').check()
 app.locator('#labor-bulk-start').fill('06:30:00')
 app.locator('[name="bulkEnd"]').check()
 app.locator('#labor-bulk-end').fill('06:30:00')  # Equal times are invalid.
 app.locator('#labor-bulk-form button[type="submit"]').click()
 assert 'Giờ kết thúc' in app.locator('#labor-bulk-error').inner_text()
 assert app.locator('#draft-confirm-form').count()==0
 assert app.locator('.records-label b').inner_text()=='45'  # Invalid bulk edit changed no saved rows.
 app.locator('#labor-bulk-end').fill('07:05:00')
 app.locator('#labor-bulk-form button[type="submit"]').click()
 authorize('wrong')
 assert 'Mật khẩu không đúng' in app.locator('#draft-confirm-error').inner_text()
 authorize()
 assert app.locator('#labor-bulk-form').count()==0
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor.filter(r=>['90000035','90000036'].includes(r.staff)&&r.work==='Điều phối'&&r.startTime==='06:30:00'&&r.endTime==='07:05:00').length")==2
 # Restore the preexisting shift set before the original shift scenarios below.
 app.evaluate("""() => {const key='pickpack1291_office_records_v094',d=JSON.parse(localStorage.getItem(key));d.shifts=d.shifts.filter(r=>!r.id.startsWith('CA-LAB-'));localStorage.setItem(key,JSON.stringify(d));dispatchEvent(new StorageEvent('storage',{key}));}""")
 print('testing PDA QR borrow-return',flush=True)
 app.locator('a.nav-main[href*="view=pda"]').click()
 app.locator('#period-preset').select_option('all')
 assert app.locator('#pda-scan-form').count()==1
 assert app.locator('.table-panel').last.locator('[data-edit]').count()==0
 assert app.locator('button[data-action="add"]').count()==0
 app.locator('#pda-staff-code').fill('90000034')
 app.locator('#pda-staff-code').press('Enter')
 assert app.locator('#pda-device-code').evaluate('(el)=>document.activeElement===el')
 app.locator('#pda-device-code').fill('00003')
 assert 'PDA-03' in app.locator('#pda-device-preview').inner_text()
 app.locator('#pda-device-code').press('Enter')
 assert 'Đã mượn PDA-03' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='31'
 app.locator('#pda-staff-code').fill('90000034')
 app.locator('#pda-device-code').fill('PDA-03')
 app.locator('#pda-device-code').press('Enter')
 assert 'Không được mượn trùng' in app.locator('.scan-outcome').inner_text()
 app.locator('[data-pda-mode="return"]').click()
 app.locator('#pda-staff-code').fill('90000035')
 app.locator('#pda-device-code').fill('PDA-03')
 app.locator('#pda-device-code').press('Enter')
 assert 'Đã trả PDA-03' in app.locator('.scan-outcome').inner_text()
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).pda.find(x=>x.name==='PDA-03'&&x.state==='Đã trả').returnStaff")=='90000035'
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='31'
 app.locator('#pda-staff-code').fill('90000034')
 app.locator('#pda-device-code').fill('PDA-03')
 app.locator('#pda-device-code').press('Enter')
 assert 'chưa có lượt mượn đang mở' in app.locator('.scan-outcome').inner_text()
 app.locator('a.nav-main[href*="view=shifts"]').click()
 app.locator('#period-preset').select_option('all')
 assert app.locator('form#shift-scan-form').count()==1
 assert app.locator('input#shift-code').count()==1
 assert app.locator('button[data-scan-mode="enter"]').get_attribute('aria-pressed')=='true'
 assert app.locator('[data-scan-shift]').count()==5
 app.locator('[data-scan-shift="Ca HC"]').click()
 assert app.locator('[data-scan-shift="Ca HC"]').get_attribute('aria-pressed')=='true'
 assert app.locator('button[data-action="add"]').count()==0
 app.locator('input#shift-code').fill('90000001')
 assert app.locator('#scan-preview').get_by_text('Mã nhân viên:',exact=False).count()>=1
 assert app.locator('#scan-user-choice').count()==1
 assert app.locator('#scan-desk-choice').count()==0
 app.locator('#scan-user-choice').select_option('pp1291.pk20')
 app.locator('input#shift-code').press('Enter')
 assert app.evaluate("document.activeElement.id")=='shift-code'
 assert app.locator('[data-scan-shift="Ca HC"]').get_attribute('aria-pressed')=='true'
 assert app.locator('[data-scan-mode="enter"]').get_attribute('aria-pressed')=='true'
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='43'
 assert 'Đã vào ca' in app.locator('.scan-outcome').inner_text()
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].shift")=='Ca HC'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].user")=='pp1291.pk20'
 app.locator('input#shift-code').fill('90000001')
 app.locator('#shift-scan-form button[type="submit"]').click()
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='43'
 assert 'không ghi nhận vào ca lần hai' in app.locator('.scan-outcome').inner_text(), (app.locator('.scan-outcome').inner_text(), app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts.slice(0,2)"))
 app.locator('button[data-scan-mode="exit"]').click()
 assert app.locator('button[data-scan-mode="exit"]').get_attribute('aria-pressed')=='true'
 assert app.locator('[data-scan-shift]').count()==0
 app.locator('input#shift-code').fill('90000001')
 app.locator('input#shift-code').press('Enter')
 assert 'Đã ra ca' in app.locator('.scan-outcome').inner_text()
 # Shift clock corrections: failed password must not change data; undo checkout retains check-in.
 newest=app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].id")
 app.locator('.table-panel tbody tr').filter(has_text='90000001').first.locator('[data-edit]').click()
 assert app.locator('#record-form [name="checkin"]').get_attribute('type')=='time'
 app.locator('#record-form [name="checkin"]').fill('06:45:00')
 app.locator('#record-form [name="checkout"]').fill('07:10:00')
 app.locator('#record-form button[type="submit"]').click()
 assert app.locator('#draft-confirm-form').count()==1
 app.locator('#draft-password').fill('wrong')
 app.locator('#draft-confirm-form button[type="submit"]').click()
 assert 'Mật khẩu không đúng' in app.locator('#draft-confirm-error').inner_text()
 assert app.evaluate("(id)=>JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts.find(x=>x.id===id).checkin!=='06:45:00'",newest)
 app.locator('#draft-password').fill('1')
 app.locator('#draft-confirm-form button[type="submit"]').click()
 assert app.evaluate("(id)=>{const x=JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts.find(r=>r.id===id);return x.checkin==='06:45:00'&&x.checkout==='07:10:00'&&x.corrections.length===1}",newest)
 app.locator('.table-panel tbody tr').filter(has_text='90000001').first.locator('[data-shift-undo]').click()
 assert app.locator('#confirm-form').count()==1
 app.locator('#confirm-password').fill('bad')
 app.locator('#confirm-form button[type="submit"]').click(timeout=10000)
 assert 'Mật khẩu không đúng' in app.locator('#confirm-error').inner_text()
 app.locator('#confirm-password').fill('1')
 app.locator('#confirm-form button[type="submit"]').click(timeout=10000)
 assert app.evaluate("(id)=>{const x=JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts.find(r=>r.id===id);return x.checkout==='—'&&x.state==='Trong ca'&&x.corrections.length===2}",newest)
 app.locator('#shift-code').fill('90000001')
 app.locator('#shift-code').press('Enter')
 assert 'Đã ra ca' in app.locator('.scan-outcome').inner_text()
 app.locator('input#shift-code').fill('90000001')
 app.locator('input#shift-code').press('Enter')
 assert 'Không có lượt vào ca đang mở' in app.locator('.scan-outcome').inner_text()
 app.locator('input#shift-code').fill('NOT_FOUND')
 app.locator('input#shift-code').press('Enter')
 assert 'Không tìm thấy mã nhân viên' in app.locator('.scan-outcome').inner_text()
 # Pack user and optional desk come from resource catalogs, selected independently of fixed staff fields.
 app.locator('[data-scan-mode="enter"]').click()
 app.locator('[data-scan-shift="Ca 2"]').click()
 app.locator('#shift-code').fill('90000002')
 assert app.locator('#scan-user-choice').count()==1
 assert app.locator('#scan-desk-choice').count()==1
 app.locator('#scan-user-choice').select_option('pp1291.pa20')
 app.locator('#scan-desk-choice').select_option('Bàn Pack 12')
 app.locator('#shift-code').press('Enter')
 assert app.evaluate("document.activeElement.id")=='shift-code'
 assert app.locator('[data-scan-shift="Ca 2"]').get_attribute('aria-pressed')=='true'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].user")=='pp1291.pa20'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].desk")=='Bàn Pack 12'
 app.locator('#shift-code').fill('90000003')
 app.locator('#scan-user-choice').select_option('pp1291.pa20')
 app.locator('#shift-scan-form button[type="submit"]').click()
 assert 'đang được sử dụng' in app.locator('.scan-outcome').inner_text()
 app.locator('[data-scan-mode="exit"]').click()
 assert app.locator('[data-scan-shift]').count()==0
 app.locator('#shift-code').fill('90000002')
 app.locator('#shift-code').press('Enter')
 assert 'Đã ra ca' in app.locator('.scan-outcome').inner_text()
 # Deleting a check-in or a complete pair requires the current account password and audits the deletion.
 app.locator('.table-panel tbody tr').filter(has_text='90000001').first.locator('[data-shift-delete]').click()
 assert app.locator('#confirm-form').count()==1
 authorize('wrong')
 assert 'Mật khẩu không đúng' in app.locator('#confirm-error').inner_text()
 authorize()
 assert app.evaluate("(id)=>{const r=JSON.parse(localStorage.getItem('pickpack1291_office_records_v094'));return !r.shifts.some(x=>x.id===id)&&r.shiftDeletions.some(x=>x.id===id&&x.by==='superadmin')}",newest)
 app.locator('a.nav-main[href*="view=people"]').click()
 app.screenshot(path=str(root/'preview-people.png'),full_page=True)
 print('testing catalogs',flush=True)
 app.locator('a[data-nav="categories"]').click()
 assert app.locator('.catalog-tabs [data-category-tab]').count()==5
 assert app.locator('.catalog-panel tbody tr').count()==4
 app.locator('.catalog-panel [data-category-edit="0"]').click()
 assert app.locator('#catalog-form').count()==1
 app.locator('#catalog-form input[name="value"]').fill('Pick thử')
 assert 'is-valid' in app.locator('#catalog-form input[name="value"]').get_attribute('class')
 app.locator('#catalog-form button[type="submit"]').click()
 authorize()
 assert app.get_by_text('Pick thử',exact=True).count()==1
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people[0].position")=='Pick thử'
 app.locator('.catalog-panel [data-category-delete="0"]').click()
 assert 'Không thể xóa' in app.locator('.toast-stack .toast').last.inner_text()
 app.locator('button[data-action="category-add"]').click()
 app.locator('#catalog-form input[name="value"]').fill('Vị trí thử')
 app.locator('#catalog-form button[type="submit"]').click()
 assert app.locator('.catalog-panel tbody tr').count()==5
 app.locator('button[data-action="category-add"]').click()
 app.locator('#catalog-form input[name="value"]').fill('vị trí thử')
 app.locator('#catalog-form button[type="submit"]').click()
 assert 'đã tồn tại' in app.locator('.toast-stack .toast').last.inner_text()
 app.locator('.modal [data-action="close-modal"]').first.click()
 app.locator('.catalog-panel [data-category-delete="4"]').click()
 assert app.locator('#confirm-form').count()==1
 authorize()
 assert app.locator('.catalog-panel tbody tr').count()==4
 app.locator('button[data-category-tab="supplier"]').click()
 assert app.locator('.catalog-panel tbody tr').count()==3
 app.locator('.catalog-heading a[data-nav="people"]').click()
 app.locator('a[data-nav="categories"]').click()
 assert app.locator('#global-search').is_visible()
 assert all(abs(a-b)<1 for x,y in zip(overview_slots,header_slots()) for a,b in zip(x,y))
 app.locator('#global-search').fill('NoMatchingCategory_1291')
 assert app.locator('.catalog-panel tbody tr').count()==0
 app.locator('#global-search').fill('')
 assert app.locator('.catalog-panel tbody tr').count()>=1
 app.locator('.catalog-heading a[data-nav="people"]').click()
 print('testing scoped catalogs',flush=True)
 for module,field in [('labor','laborWork'),('minutes','minutesType'),('assets','assetsType')]:
  app.locator(f'a.nav-main[href*="view={module}"]').click()
  app.locator(f'a[data-catalog-scope="{module}"]').click()
  assert app.locator(f'[data-category-tab="{field}"]').count()==1
  assert app.locator('.catalog-panel tbody tr').count()>0
  app.locator(f'.catalog-heading a[data-nav="{module}"]').click()
 print('testing work resources',flush=True)
 app.locator('a.nav-main[href*="view=resources"]').click()
 assert app.locator('.catalog-tabs [data-category-tab]').count()==4
 for tab in ['userTypes','pickUsers','packUsers','packDesks']:
  app.locator(f'[data-category-tab="{tab}"]').click()
  assert app.locator('.catalog-panel tbody tr').count()>0
 app.locator('[data-category-tab="pickUsers"]').click()
 app.locator('[data-action="category-add"]').click()
 app.locator('#catalog-form input[name="value"]').fill('pp1291.pk99')
 app.locator('#catalog-form button[type="submit"]').click()
 assert app.get_by_text('pp1291.pk99',exact=True).count()==1
 app.locator('[data-category-edit="20"]').click()
 app.locator('#catalog-form input[name="value"]').fill('pp1291.pk98')
 app.locator('#catalog-form button[type="submit"]').click()
 authorize()
 assert app.get_by_text('pp1291.pk98',exact=True).count()==1
 app.locator('[data-category-delete="20"]').click()
 authorize()
 assert app.locator('.catalog-panel tbody tr').count()==20
 app.locator('a.nav-main[href*="view=people"]').click()
 print('testing staff columns',flush=True)
 head=app.locator('.people-table thead th').all_inner_texts()
 assert head[-4:]==['Ngày nhận việc','Cập nhật bởi','Thời gian cập nhật','Thao tác'],head
 assert app.locator('.people-table').evaluate("el=>getComputedStyle(el).tableLayout")=='auto'
 assert app.locator('.people-table tbody tr .cell-name small').count()==0
 assert app.locator('#record-form input[name="user"]').count()==0
 assert app.locator('#record-form select[name="shift"]').count()==0
 assert app.locator('.table-scroll').last.evaluate("el=>el.scrollWidth>=el.clientWidth")
 app.evaluate('window.scrollTo(0, 600)')
 assert abs(app.locator('.topbar').bounding_box()['y'])<2
 print('testing create',flush=True)
 app.locator('button[data-action="add"]').click()
 assert app.locator('form#record-form').count()==1
 assert app.locator('#record-form input[name="user"],#record-form select[name="shift"]').count()==0
 # Date defaults to the current date in Vietnam, independent of computer timezone.
 today=app.evaluate("""() => {const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day}""")
 assert app.locator('#record-form input[name="startDate"]').input_value()==today
 assert app.locator('#record-form input[name="id"]').get_attribute('inputmode')=='numeric'
 assert app.locator('#record-form input[name="phone"]').get_attribute('inputmode')=='numeric'
 app.locator('#record-form input[name="id"]').fill('9Ab-123')
 assert app.locator('#record-form input[name="id"]').input_value()=='9123'
 app.locator('#record-form input[name="phone"]').fill('000-12 a345')
 assert app.locator('#record-form input[name="phone"]').input_value()=='00012345'
 app.locator('#record-form input[name="name"]').fill('Nguyễn123 Trần!')
 assert app.locator('#record-form input[name="name"]').input_value()=='Nguyễn123 Trần!' # Do not mutate active Vietnamese IME input
 app.locator('#record-form input[name="name"]').fill('Đặng Thị Ánh')
 assert app.locator('#record-form input[name="name"]').evaluate("el=>el.checkValidity()")
 # Simulate bypassing live input sanitizer. Save handler must also reject bad values.
 for key,bad,expected in [('id','AB-09','Mã nhân viên chỉ'),('name','Tên 123','Họ và tên chỉ'),('phone','090A34','Số điện thoại chỉ')]:
  app.evaluate("""([key,value])=>{const f=document.querySelector('#record-form');f.elements['id'].value='90009999';f.elements['name'].value='Nhân viên kiểm thử';f.elements['phone'].value='0001234567';f.elements[key].value=value;f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}))}""",[key,bad])
  assert expected in app.locator('#toast-stack .toast').last.inner_text(),(key,app.locator('#toast-stack .toast').all_inner_texts())
  assert app.locator('.records-label b').inner_text()=='36'
 app.locator('input[name="id"]').fill('90009999')
 app.locator('input[name="name"]').fill('Nhân viên giả lập bổ sung')
 app.locator('select[name="position"]').select_option('Pick thử')
 app.locator('select[name="supplier"]').select_option('Nội bộ')
 app.locator('select[name="department"]').select_option('Pick Pack')
 app.locator('select[name="site"]').select_option('1291')
 app.locator('select[name="warehouse"]').select_option('1291')
 app.locator('input[name="phone"]').fill('0001234567')
 assert app.locator('input[name="startDate"]').get_attribute('type')=='date'
 app.locator('input[name="startDate"]').fill('2026-12-01')
 # Tiny PNG fixture is fully synthetic; assert local avatar conversion from image.
 png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB6YAAAAASUVORK5CYII=')
 app.locator('#staff-photo').set_input_files({'name':'portrait.png','mimeType':'image/png','buffer':png})
 assert app.locator('#file-confirm-form').count()==1
 assert app.locator('#crop-dialog').count()==0
 app.locator('[data-file-cancel]').last.click()
 assert app.locator('#crop-dialog').count()==0
 app.locator('#staff-photo').set_input_files({'name':'portrait.png','mimeType':'image/png','buffer':png})
 app.locator('#file-confirm-form button[type="submit"]').click()
 app.locator('#crop-dialog #crop-canvas').wait_for()
 assert app.locator('#crop-dialog #crop-zoom').input_value()=='125'
 app.locator('#crop-dialog #crop-zoom').evaluate("el=>{el.value='180';el.dispatchEvent(new Event('input',{bubbles:true}))}")
 assert app.locator('#crop-dialog #crop-percentage').inner_text()=='180%'
 app.locator('#crop-dialog [data-action="crop-apply"]').click()
 assert app.locator('#crop-dialog').count()==0
 app.locator('#photo-preview img').wait_for()
 assert app.locator('#photo-preview img').get_attribute('src').startswith('data:image/jpeg;base64,')
 app.locator('#record-form button[type="submit"]').click()
 assert app.locator('.records-label b').inner_text()=='37'
 assert '01/12/2026' in app.locator('.people-table tbody tr').first.inner_text()
 assert 'superadmin' in app.locator('.people-table tbody tr').first.inner_text()
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(x=>x.id==='90009999').photo.startsWith('data:image/jpeg;base64,')")
 print('testing edit',flush=True)
 app.locator('table tbody tr').first.locator('[data-edit]').click()
 app.locator('[data-action="adjust-photo"]').click()
 app.locator('#crop-dialog #crop-canvas').wait_for()
 app.locator('#crop-dialog [data-action="crop-cancel"]').first.click()
 assert app.locator('#crop-dialog').count()==0
 app.locator('#record-form input[name="name"]').fill('Nhân viên giả lập đã chỉnh sửa')
 app.locator('#record-form button[type="submit"]').click()
 authorize()
 assert 'đã chỉnh sửa' in app.locator('table tbody tr').first.inner_text()
 app.locator('table tbody tr').first.locator('[data-edit]').click()
 assert app.locator('#record-form input[name="startDate"]').input_value()=='2026-12-01'
 app.locator('#record-form input[name="startDate"]').fill('2026-10-03')
 app.locator('#record-form button[type="submit"]').click()
 authorize()
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(p=>p.id==='90009999').startDate")=='03/10/2026'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(p=>p.id==='90009999').phone")=='0001234567'
 print('testing delete',flush=True)
 app.locator('table tbody tr').first.locator('[data-delete]').click()
 assert app.locator('#confirm-form').count()==1
 authorize()
 assert app.locator('.records-label b').inner_text()=='36'
 print('testing toast queue',flush=True)
 for _ in range(6):
  app.locator('button[data-action="export"]').click()
  assert app.locator('#file-confirm-form').count()==1
  app.locator('#file-confirm-form button[type="submit"]').click()
 assert app.locator('#toast-stack .toast').count()==5
 app.wait_for_timeout(5200)
 assert app.locator('#toast-stack .toast').count()==0
 print('testing search',flush=True)
 app.locator('input#global-search').fill('KhôngCóTrongDanhSách_TEST')
 assert app.get_by_text('Không tìm thấy bản ghi phù hợp').count()==1
 app.locator('input#global-search').fill('')
 assert app.locator('.record-card').count()==0
 print('testing bulk',flush=True)
 app.locator('table tbody tr').first.locator('[data-select]').check()
 assert 'Xóa đã chọn (1)' in app.locator('button[data-action="bulk-delete"]').inner_text()
 app.locator('button[data-action="bulk-delete"]').click()
 assert app.locator('#confirm-form').count()==1
 authorize()
 assert app.locator('.records-label b').inner_text()=='35'
 print('testing PDA',flush=True)
 app.locator('a.nav-main[href*="view=pda"]').click()
 app.locator('#period-preset').select_option('all')  # Historical fixture totals are not today's totals.
 assert app.locator('.device-registry').count()==0
 assert app.locator('#pda-scan-form').count()==1
 assert app.locator('.table-panel table tbody tr').count()==int(app.locator('.table-panel .records-label b').inner_text())
 assert app.locator('.table-panel thead th[data-col]').all_inner_texts()[:5]==['Ngày','Ca','Mã nhân viên','Họ và tên','Nhà thầu']
 app.locator('.table-panel').last.locator('table tbody tr').first.locator('[data-record]').click()
 assert app.locator('.detail-drawer').count()==1
 assert app.locator('.detail-drawer button[data-quick]').count()==0
 app.locator('button[data-action="close-drawer"]').click()
 app.locator('button[data-theme-choice="dark"]').click()
 app.locator('.top-profile').click()
 app.locator('button[data-action="settings"]').click()
 assert app.evaluate("document.documentElement.getAttribute('data-theme')")=='dark'
 app.locator('button[data-action="close-modal"]').last.click()
 assert not errs,errs
 print('testing mobile',flush=True)
 mobile=new_screen(mobile=True)
 assert mobile.locator('button.menu-button').is_visible()
 assert mobile.locator('#clock-date').count()==0
 assert mobile.locator('.flip-digit').count()==0
 assert mobile.locator('#clock-time').is_visible()
 assert mobile.locator('#clock-time').evaluate("el=>{const c=el.getBoundingClientRect(),h=el.closest('.header-clock').getBoundingClientRect();return c.right<=h.right+1&&c.left>=h.left-1}")
 assert mobile.locator('button.menu-button').inner_text()=='Mục'
 mobile.screenshot(path=str(root/'preview-mobile.png'),full_page=True)
 assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+3')
 mobile.locator('button.menu-button').click()
 assert mobile.locator('.sidebar').evaluate('(el)=>el.classList.contains("is-open")')
 assert mobile.locator('.nav-flat .nav-label').evaluate_all('(els)=>els.every(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)')
 mobile.locator('a.nav-main[href*="view=people"]').click()
 assert mobile.locator('.records-label b').inner_text()=='36'
 assert not mobile.locator('.nav-external').count()
 # v0.11.0: local permission preview, batch catalogs, Vietnamese IME, personal settings.
 rolecheck=new_screen()
 rolecheck.locator('a.nav-main[href*="view=access"]').click()
 assert rolecheck.locator('.access-user').count()==5
 rolecheck.locator('[data-account-pick="dieuphoile"]').click()
 assert not rolecheck.locator('[data-permission="people:view"]').is_checked()
 rolecheck.locator('[data-permission="people:view"]').click()
 assert rolecheck.locator('[data-permission="people:view"]').is_checked()
 rolecheck.locator('#role-preview').select_option('dieuphoile')
 assert rolecheck.locator('.nav-locked').count()==1
 assert rolecheck.locator('a.nav-main[href*="view=assets"]').count()==0
 rolecheck.locator('a.nav-main[href*="view=people"]').click()
 assert rolecheck.locator('[data-action="add"]').count()==0
 assert rolecheck.locator('[data-edit]').count()==0
 rolecheck.locator('#role-preview').select_option('')
 rolecheck.locator('a.nav-main[href*="view=people"]').click()
 rolecheck.locator('[data-catalog-scope="people"]').click()
 rolecheck.locator('[data-action="category-add"]').click()
 assert rolecheck.locator('#catalog-form input[name="value"]').count()==1
 assert rolecheck.locator('[data-action="catalog-input-remove"]').is_disabled()
 rolecheck.locator('[data-action="catalog-input-add"]').click()
 assert rolecheck.locator('#catalog-form input[name="value"]').count()==2
 rolecheck.locator('[data-action="catalog-input-remove"]').click()
 assert rolecheck.locator('#catalog-form input[name="value"]').count()==1
 rolecheck.locator('[data-action="catalog-input-add"]').click()
 rolecheck.locator('#catalog-form input[name="value"]').nth(0).fill('Nhóm thử một')
 rolecheck.locator('#catalog-form input[name="value"]').nth(1).fill('Nhóm thử hai')
 rolecheck.locator('#catalog-form button[type="submit"]').click()
 assert rolecheck.locator('.catalog-panel').get_by_text('Nhóm thử một').count()==1
 assert rolecheck.locator('.catalog-panel').get_by_text('Nhóm thử hai').count()==1
 rolecheck.locator('a.nav-main[href*="view=people"]').click()
 rolecheck.locator('[data-action="add"]').click()
 rolecheck.locator('#record-form input[name="name"]').fill('Nguyễn Thị Ánh')
 assert rolecheck.locator('#record-form input[name="name"]').input_value()=='Nguyễn Thị Ánh'
 assert rolecheck.locator('#record-form input[name="name"]').evaluate("el=>!el.hasAttribute('pattern')")
 rolecheck.locator('button[data-action="close-modal"]').last.click()
 rolecheck.locator('.top-profile').click()
 rolecheck.locator('[data-action="settings"]').click()
 assert rolecheck.locator('#personal-photo-preview').count()==1
 rolecheck.locator('#profile-photo').set_input_files({'name':'account.png','mimeType':'image/png','buffer':png})
 rolecheck.locator('#file-confirm-form button[type="submit"]').click()
 rolecheck.locator('#crop-dialog').wait_for(timeout=10000)
 rolecheck.locator('#crop-dialog [data-action="crop-zoom-in"]').click()
 rolecheck.locator('#crop-dialog [data-action="crop-apply"]').click()
 assert rolecheck.locator('#personal-photo-preview img').count()==1
 rolecheck.locator('#personal-settings-form [name="fullName"]').fill('Nguyễn Văn Thử')
 rolecheck.locator('#personal-settings-form [name="oldPassword"]').fill('1')
 rolecheck.locator('#personal-settings-form [name="newPassword"]').fill('moi')
 rolecheck.locator('#personal-settings-form button[type="submit"]').click()
 assert rolecheck.locator('.top-profile .profile-name strong').inner_text()=='Nguyễn Văn Thử'
 assert rolecheck.locator('.top-profile img.person-avatar').count()==1
 assert rolecheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_users_v096')).find(x=>x.username==='superadmin').photo.startsWith('data:image/jpeg;base64,')")
 assert rolecheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_users_v096')).find(x=>x.username==='superadmin').password")=='moi'
 rolecheck.locator('a.nav-main[href*="view=shifts"]').click()
 assert rolecheck.locator('#period-preset').input_value()=='today'
 rolecheck.locator('#period-preset').select_option('yesterday')
 assert rolecheck.locator('#period-preset').input_value()=='yesterday'
 rolecheck.locator('#period-preset').select_option('today')
 rolecheck.locator('[data-action="period-custom"]').click()
 assert rolecheck.locator('#period-from').input_value()==rolecheck.locator('#period-to').input_value()
 rolecheck.close()
 # v0.12.3: daily scope and same-day personnel/PDA/labor linkage.
 daycheck=new_screen(seed=False)
 daycheck.evaluate("""() => {
  const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));
  const today=p.year+'-'+p.month+'-'+p.day;
  const prev=new Date(today+'T00:00:00Z');prev.setUTCDate(prev.getUTCDate()-1);
  const yesterday=prev.toISOString().slice(0,10);
  const vn=x=>x.split('-').reverse().join('/');
  const person=(id,name,position,createdAt)=>({id,name,position,createdAt,supplier:'Nhà thầu thử'});
  const shift=(id,staff,date,kind,user)=>({id,staff,name:staff==='99000001'?'Nguyễn Văn Một':'Nguyễn Văn Hai',date:vn(date),shift:kind,user,position:staff==='99000001'?'Pick':'Điều phối',supplier:'Nhà thầu thử',checkin:'00:00:00',checkout:'—',state:'Trong ca'});
  const labor=(id,date,work)=>({id,staff:'99000001',date:vn(date),work,startTime:'00:10:00',endTime:'—'});
  const loan=(id,date,device)=>({id,staff:'99000001',name:device,assetId:device,date:vn(date),state:'Đang mượn'});
  const asset=id=>({id,type:'PDA',serial:id+'-SERIAL',state:'Có sử dụng',condition:'Tốt'});
  const records={people:[person('99000001','Nguyễn Văn Một','Pick',today),person('99000002','Nguyễn Văn Hai','Điều phối',yesterday)],
   shifts:[shift('CA-NEW','99000001',today,'Ca 1','user-new'),shift('CA-OLD','99000001',yesterday,'Ca 1','user-old'),shift('CA-OLD2','99000002',yesterday,'Ca 2','other-old')],
   labor:[labor('CN-NEW',today,'Hỗ trợ 1399'),labor('CN-OLD',yesterday,'Hỗ trợ 9999')],
   pda:[loan('MT-NEW',today,'PDA-2'),loan('MT-OLD',yesterday,'PDA-1')],
   assets:[asset('PDA-1'),asset('PDA-2')],minutes:[],pdaDevices:[]};
  localStorage.setItem('pickpack1291_office_records_v094',JSON.stringify(records));
  dispatchEvent(new StorageEvent('storage',{key:'pickpack1291_office_records_v094'}));
  dispatchEvent(new StorageEvent('storage',{key:'pickpack1291_office_catalogs_v094'}));
 }""")
 daycheck.locator('a.nav-main[href*="view=people"]').click()
 assert daycheck.locator('#period-preset').input_value()=='all'
 assert daycheck.locator('.people-table tbody tr').count()==2
 daycheck.locator('#period-preset').select_option('today')
 assert daycheck.locator('.people-table tbody tr').count()==1
 daycheck.locator('a.nav-main[href*="view=dashboard"]').click()
 assert daycheck.locator('#period-preset').input_value()=='today'
 daycheck.locator('a.nav-main[href*="view=shifts"]').click()
 assert daycheck.locator('.module-table tbody tr').count()==1
 assert daycheck.locator('.module-table thead th[data-col]').all_inner_texts()[:7]==['Ngày','Ca','Mã nhân viên','Họ và tên','Nhà thầu','Vị trí chính','Vị trí hiện tại']
 assert daycheck.locator('.module-table tbody tr [data-col="currentPosition"]').inner_text()=='Hỗ trợ 1399'
 assert 'PDA-2' in daycheck.locator('.module-table tbody tr [data-col="pdaInUse"]').inner_text()
 assert daycheck.locator('.qr-input #shift-code').count()==1
 assert daycheck.locator('[data-scan-shift]').all_inner_texts()==['Ca 1','Ca 2','HC 08–17','HC 09–18','HC 10–19']
 assert daycheck.locator('.shift-scan-station h2').count()==0
 daycheck.locator('#period-preset').select_option('all')
 assert daycheck.locator('.module-table tbody tr').count()==3
 assert daycheck.locator('.row-overdue .shift-overdue').count()>=1
 daycheck.locator('#period-preset').select_option('today')
 daycheck.locator('[data-scan-shift="HC 10–19"]').click()
 daycheck.locator('#shift-code').fill('99000002')
 daycheck.locator('#shift-code').press('Enter')
 assert 'Đã vào ca' in daycheck.locator('.scan-outcome').inner_text()
 assert daycheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].shift")=='HC 10–19'
 daycheck.locator('.module-table tbody tr').filter(has_text='99000002').first.locator('[data-shift-delete]').click()
 assert 'Xóa lượt vào' in daycheck.locator('#confirm-message').inner_text()
 daycheck.locator('#confirm-password').fill('1')
 daycheck.locator('#confirm-form button[type="submit"]').click()
 assert daycheck.evaluate("(()=>{const d=JSON.parse(localStorage.getItem('pickpack1291_office_records_v094'));return d.shiftDeletions.some(r=>r.staff==='99000002'&&r.checkout==='—')&&!d.shifts.some(r=>r.staff==='99000002'&&r.date===new Date().toLocaleDateString('en-GB',{timeZone:'Asia/Ho_Chi_Minh'}))})()")
 daycheck.locator('[data-scan-mode="exit"]').click()
 daycheck.locator('#shift-code').fill('99000001')
 daycheck.locator('#shift-code').press('Enter')
 assert 'công nhật chưa chốt giờ kết thúc' in daycheck.locator('.scan-outcome').inner_text()
 assert daycheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts.find(r=>r.id==='CA-NEW').state")=='Trong ca'
 daycheck.locator('.module-table tbody tr').filter(has_text='99000001').first.locator('[data-shift-delete]').click()
 assert daycheck.locator('#confirm-form').count()==0  # Open labor also protects full-shift deletion.
 assert 'Cần chốt công nhật trước khi xóa lượt quét ca' in daycheck.locator('#toast-stack').inner_text()
 daycheck.locator('a.nav-main[href*="view=labor"]').click()
 daycheck.locator('.table-panel tbody tr').filter(has_text='99000001').first.locator('[data-edit]').click()
 daycheck.locator('#record-form [name="endTime"]').fill('00:20:00')
 daycheck.locator('#record-form button[type="submit"]').click()
 daycheck.locator('#draft-password').fill('1')
 daycheck.locator('#draft-confirm-form button[type="submit"]').click()
 assert daycheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor.find(r=>r.id==='CN-NEW').endTime")=='00:20:00'
 daycheck.locator('a.nav-main[href*="view=shifts"]').click()
 daycheck.locator('[data-scan-mode="exit"]').click()
 daycheck.locator('#shift-code').fill('99000001')
 daycheck.locator('#shift-code').press('Enter')
 assert 'Đã ra ca' in daycheck.locator('.scan-outcome').inner_text()
 daycheck.locator('.module-table tbody tr').filter(has_text='99000001').first.locator('[data-edit]').click()
 daycheck.locator('#record-form [name="checkout"]').fill('00:15:00')
 daycheck.locator('#record-form button[type="submit"]').click()
 daycheck.locator('#draft-password').fill('1')
 daycheck.locator('#draft-confirm-form button[type="submit"]').click()
 assert 'công nhật có giờ kết thúc sau giờ ra ca' in daycheck.locator('#toast-stack').inner_text()
 daycheck.locator('button[data-action="close-modal"]').last.click()
 daycheck.locator('a.nav-main[href*="view=labor"]').click()
 daycheck.locator('.table-panel tbody tr').filter(has_text='99000001').first.locator('[data-edit]').click()
 daycheck.locator('#record-form [name="endTime"]').fill('23:59:00')
 daycheck.locator('#record-form button[type="submit"]').click()
 daycheck.locator('#draft-password').fill('1')
 daycheck.locator('#draft-confirm-form button[type="submit"]').click()
 assert 'Giờ kết thúc công nhật không được sau giờ ra ca' in daycheck.locator('#toast-stack').inner_text()
 assert daycheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor.find(r=>r.id==='CN-NEW').endTime")=='00:20:00'
 daycheck.locator('button[data-action="close-modal"]').last.click()
 assert daycheck.locator('.qr-input #labor-staff-code').count()==1
 assert daycheck.locator('.compact-scanner h2').count()==0
 daycheck.locator('a.nav-main[href*="view=pda"]').click()
 assert daycheck.locator('.qr-input #pda-staff-code').count()==1
 assert daycheck.locator('.compact-scanner h2').count()==0
 daycheck.locator('a.nav-main[href*="view=access"]').click()
 assert daycheck.locator('.access-header h2').count()==0
 daycheck.locator('a.nav-main[href*="view=resources"]').click()
 assert daycheck.locator('.catalog-heading strong').count()==0
 daycheck.close()

 print('PASS: v0.12.3 blank bootstrap plus synthetic-fixture regressions, catalog/shift/PDA, offline backup and responsive layout')
 browser.close()
