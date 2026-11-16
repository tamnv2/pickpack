from pathlib import Path
import os
import base64
import json
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
js=(root/'assets/app.js').read_text(encoding='utf-8')
css=(root/'assets/styles.css').read_text(encoding='utf-8')
fixture=json.loads((root/'tests/legacy_fixture.json').read_text(encoding='utf-8'))
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
  return pg
 login=new_screen('login')
 assert login.locator('form#login-form').count()==1
 assert login.locator('.login-links .web-version').inner_text()=='Web v0.9.8'
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
 # A fresh Web v0.9.8 browser must have no test records or catalogs.
 clean=new_screen(seed=False)
 assert clean.locator('.metrics .metric-number').first.inner_text()=='0'
 for module in ['people','shifts','labor','minutes','assets','pda','resources']:
  clean.locator(f'a.nav-main[href*="view={module}"]').click()
  assert not clean.locator('.module-table tbody tr,.people-table tbody tr').count(),module
  if module=='pda':assert clean.locator('.device-registry tbody tr').count()==0
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
 assert app.locator('.side-bottom .web-version').inner_text()=='Web v0.9.8'
 assert app.locator('.site-footer').inner_text()=='Phát triển hệ thống - tamnv2 | Pick Pack 1291'
 assert app.locator('.side-bottom .site-footer').count()==1
 assert app.locator('.app-main .site-footer').count()==0
 assert app.locator('.site-footer').evaluate("el => getComputedStyle(el).position")=='static'
 assert app.locator('.site-footer').evaluate("el => getComputedStyle(el).textAlign")=='left'
 assert float(app.locator('.site-footer').evaluate("el => getComputedStyle(el).opacity"))<=0.75
 assert not app.locator('button.menu-button').is_visible()
 labels=app.locator('.nav-flat .nav-label').all_inner_texts()
 assert len(labels)==9,labels
 assert labels==['Tổng quan vận hành','Quản lý nhân sự','Quét vào/ra ca','Mượn / trả PDA','Quản lý công nhật','Quản lý biên bản','Quản lý CCDC','Quản lý tài nguyên','Quản lý quyền truy cập']
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
 app.wait_for_timeout(1250)
 assert app.locator('#clock-time').inner_text()!=old_clock
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
 assert app.locator('.overview-page button[data-action="export"]').count()==0
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
 app.locator('button[data-theme-choice="light"]').click()
 app.locator('.top-profile').click()
 app.locator('button[data-action="settings"]').click()
 assert app.locator('button[data-accent-choice="green"]').get_attribute('aria-pressed')=='true'
 app.locator('button[data-action="close-modal"]').last.click()
 assert app.locator('.nav-external').count()==0
 assert app.locator('a.nav-main').first.get_attribute('href').startswith('app.html?')
 app.screenshot(path=str(root/'preview-dashboard.png'),full_page=True)
 expected={'people':36,'shifts':42,'labor':42,'minutes':30,'assets':30,'pda':30}
 print('testing modules',flush=True)
 for module,n in expected.items():
  app.locator(f'a.nav-main[href*="view={module}"]').click()
  assert not errs,(module,errs)
  assert all(abs(a-b)<1 for x,y in zip(overview_slots,header_slots()) for a,b in zip(x,y)),module
  assert app.locator('.table-panel').last.locator('.records-label b').inner_text()==str(n),(module,app.locator('.table-panel').last.locator('.records-label b').inner_text())
  assert app.locator('.table-panel').last.locator('table tbody tr').count()==n
  assert app.locator('a.cell-record-link').first.get_attribute('href').startswith(f'app.html?view={module}'),(module,app.locator('a.cell-record-link').first.get_attribute('href'))
  assert app.locator('.table-panel').last.locator('button[data-action="export"]').inner_text().strip().endswith('Xuất Excel')
  assert app.locator('.record-card').count()==0
  assert app.locator('[data-action="layout-cards"],[data-action="layout-table"]').count()==0
  assert app.locator('.page-header h1').count()==0
  assert app.locator('.module-summary').count()==0
 def authorize(password='1'):
  assert app.locator('#confirm-form').count()==1
  app.locator('#confirm-password').fill(password)
  app.locator('#confirm-form button[type="submit"]').click()
 print('testing labor QR scan',flush=True)
 app.locator('a.nav-main[href*="view=labor"]').click()
 assert app.locator('#labor-scan-form').count()==1
 assert app.locator('[data-catalog-scope="labor"]').count()==1
 assert app.locator('button[data-action="add"]').count()==0
 assert ['Giờ bắt đầu','Giờ kết thúc']==app.locator('.table-panel thead th').all_inner_texts()[-3:-1]
 app.locator('#labor-work').select_option('Pick')
 app.locator('#labor-staff-code').fill('90000034')
 app.locator('#labor-staff-code').press('Enter')
 assert 'Đã bắt đầu công nhật' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.records-label b').inner_text()=='43'
 assert app.locator('#labor-work').input_value()=='Pick'
 app.locator('.table-panel').last.locator('tbody tr').first.locator('[data-edit]').click()
 authorize('wrong')
 assert app.locator('#confirm-error').inner_text()=='Mật khẩu không đúng'
 authorize()
 assert app.locator('#record-form').count()==1
 app.locator('#record-form select[name="work"]').select_option('Pick')
 app.locator('#record-form input[name="startTime"]').fill('06:30:01')
 app.locator('#record-form button[type="submit"]').click()
 assert '06:30:01' in app.locator('.table-panel').last.locator('tbody tr').first.inner_text()
 app.locator('#labor-staff-code').fill('90000034')
 app.locator('#labor-staff-code').press('Enter')
 assert 'Đã kết thúc công nhật' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.records-label b').inner_text()=='43'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor[0].endTime!='—'")
 app.locator('#labor-staff-code').fill('NOT_FOUND')
 app.locator('#labor-staff-code').press('Enter')
 assert 'Không tìm thấy mã nhân viên' in app.locator('.scan-outcome').inner_text()
 print('testing PDA QR borrow-return',flush=True)
 app.locator('a.nav-main[href*="view=pda"]').click()
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
 assert app.locator('form#shift-scan-form').count()==1
 assert app.locator('input#shift-code').count()==1
 assert app.locator('button[data-scan-mode="enter"]').get_attribute('aria-pressed')=='true'
 assert app.locator('[data-scan-shift]').count()==3
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
 assert 'không ghi nhận vào ca lần hai' in app.locator('.scan-outcome').inner_text()
 app.locator('button[data-scan-mode="exit"]').click()
 assert app.locator('button[data-scan-mode="exit"]').get_attribute('aria-pressed')=='true'
 assert app.locator('[data-scan-shift]').count()==0
 app.locator('input#shift-code').fill('90000001')
 app.locator('input#shift-code').press('Enter')
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
 app.locator('a.nav-main[href*="view=people"]').click()
 app.screenshot(path=str(root/'preview-people.png'),full_page=True)
 print('testing catalogs',flush=True)
 app.locator('a[data-nav="categories"]').click()
 assert app.locator('.catalog-tabs [data-category-tab]').count()==5
 assert app.locator('.catalog-panel tbody tr').count()==4
 app.locator('.catalog-panel [data-category-edit="0"]').click()
 assert app.locator('#confirm-form').count()==1
 authorize()
 app.locator('#catalog-form input[name="value"]').fill('Pick thử')
 assert 'is-valid' in app.locator('#catalog-form input[name="value"]').get_attribute('class')
 app.locator('#catalog-form button[type="submit"]').click()
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
 authorize()
 app.locator('#catalog-form input[name="value"]').fill('pp1291.pk98')
 app.locator('#catalog-form button[type="submit"]').click()
 assert app.get_by_text('pp1291.pk98',exact=True).count()==1
 app.locator('[data-category-delete="20"]').click()
 authorize()
 assert app.locator('.catalog-panel tbody tr').count()==20
 app.locator('a.nav-main[href*="view=people"]').click()
 print('testing staff columns',flush=True)
 head=app.locator('.people-table thead th').all_inner_texts()
 assert head[-3:]==['Ngày nhận việc','Cập nhật bởi','Thao tác'],head
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
 authorize()
 app.locator('[data-action="adjust-photo"]').click()
 app.locator('#crop-dialog #crop-canvas').wait_for()
 app.locator('#crop-dialog [data-action="crop-cancel"]').first.click()
 assert app.locator('#crop-dialog').count()==0
 app.locator('#record-form input[name="name"]').fill('Nhân viên giả lập đã chỉnh sửa')
 app.locator('#record-form button[type="submit"]').click()
 assert 'đã chỉnh sửa' in app.locator('table tbody tr').first.inner_text()
 app.locator('table tbody tr').first.locator('[data-edit]').click()
 authorize()
 assert app.locator('#record-form input[name="startDate"]').input_value()=='2026-12-01'
 app.locator('#record-form input[name="startDate"]').fill('2026-10-03')
 app.locator('#record-form button[type="submit"]').click()
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(p=>p.id==='90009999').startDate")=='03/10/2026'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(p=>p.id==='90009999').phone")=='0001234567'
 print('testing delete',flush=True)
 app.locator('table tbody tr').first.locator('[data-delete]').click()
 assert app.locator('#confirm-form').count()==1
 authorize()
 assert app.locator('.records-label b').inner_text()=='36'
 print('testing toast queue',flush=True)
 for _ in range(6):app.locator('button[data-action="export"]').click()
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
 assert app.locator('.device-registry table tbody tr').count()==3
 assert 'Seri PDA' in app.locator('.device-registry thead').inner_text()
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
 # v0.9.8: local permission preview, batch catalogs, Vietnamese IME, personal settings.
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
 rolecheck.locator('#personal-settings-form [name="fullName"]').fill('Nguyễn Văn Thử')
 rolecheck.locator('#personal-settings-form [name="oldPassword"]').fill('1')
 rolecheck.locator('#personal-settings-form [name="newPassword"]').fill('moi')
 rolecheck.locator('#personal-settings-form button[type="submit"]').click()
 assert rolecheck.locator('.top-profile .profile-name strong').inner_text()=='Nguyễn Văn Thử'
 assert rolecheck.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_users_v096')).find(x=>x.username==='superadmin').password")=='moi'
 rolecheck.close()
 print('PASS: v0.9.8 blank bootstrap plus synthetic-fixture regressions, catalog/shift/PDA, offline backup and responsive layout')
 browser.close()
