from pathlib import Path
import os
import base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
js=(root/'assets/app.js').read_text(encoding='utf-8')
css=(root/'assets/styles.css').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path=os.environ['CHROMIUM_PATH'] if os.environ.get('CHROMIUM_PATH') else None,args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':1440,'height':900},accept_downloads=True)
 ctx.set_default_timeout(2000)
 def new_screen(screen='app',mobile=False):
  pg=(browser.new_context(viewport={'width':390,'height':844},is_mobile=True) if mobile else ctx).new_page()
  pg.set_default_timeout(2000)
  pg.set_content(f'<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body data-screen="{screen}"><div id="root"></div></body></html>')
  pg.evaluate("""() => {let m = new Map([['pickpack1291_office_session_v06','demo-admin-only']]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}})}""")
  pg.add_style_tag(content=css)
  pg.add_script_tag(content=js)
  return pg
 login=new_screen('login')
 assert login.locator('form#login-form').count()==1
 assert login.locator('.login-links .web-version').inner_text()=='Web v0.8.2'
 login.locator('input[name="username"]').fill('bad')
 login.locator('input[name="password"]').fill('bad')
 login.locator('button[type="submit"]').click()
 assert login.get_by_text('Tên đăng nhập hoặc mật khẩu không đúng').count()==1
 login.locator('input[name="username"]').fill('admin')
 login.locator('input[name="password"]').fill('admin')
 login.locator('button[data-action="show-password"]').click()
 assert login.locator('input[name="password"]').input_value()=='admin'
 assert login.locator('input[name="password"]').get_attribute('type')=='text'
 login.screenshot(path=str(root/'preview-login.png'),full_page=True)
 app=new_screen()
 errs=[];app.on('pageerror',lambda e:errs.append(str(e)))
 assert app.locator('a.nav-main').count()==7
 assert app.locator('.side-bottom .web-version').inner_text()=='Web v0.8.2'
 assert app.locator('.site-footer').inner_text()=='Phát triển hệ thống - tamnv2 | Pick Pack 1291'
 assert app.locator('.site-footer').evaluate("el => getComputedStyle(el).position")=='fixed'
 assert app.locator('.site-footer').evaluate("el => getComputedStyle(el).textAlign")=='right'
 assert float(app.locator('.site-footer').evaluate("el => getComputedStyle(el).opacity"))<=0.70
 assert app.locator('.corporate-brand span').all_inner_texts()==['CÔNG TY CỔ PHẦN THE SUPRA','DC HƯNG YÊN']
 assert app.locator('.top-profile').get_by_text('Quản trị viên').count()==1
 assert app.locator('.side-bottom').get_by_text('Quản trị viên').count()==0
 assert app.locator('.breadcrumb').count()==0
 assert app.locator('.page-header .eyebrow').count()==0
 assert app.locator('.page-header h1').count()==1
 assert app.locator('.metrics.overview-metrics .metric-card').count()==8
 assert app.locator('.coverage-row').count()==6
 assert app.get_by_text('Trạng thái toàn hệ thống').count()==1
 assert app.locator('.shortcut-panel').count()==0
 assert app.locator('.overview-page button[data-action="add"]').count()==0
 assert app.locator('.overview-page button[data-action="export"]').count()==0
 assert app.locator('.demo-note').count()==0
 assert app.locator('button[data-action="settings"]').count()==1
 assert app.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--text-scale').trim()")=='1.1'
 app.locator('button[data-action="settings"]').click()
 assert app.get_by_text('Cỡ chữ',exact=True).count()==1
 assert app.locator('.font-steps output').inner_text()=='100%'
 app.locator('button[data-font="5"]').click()
 assert app.locator('.font-steps output').inner_text()=='105%'
 assert app.locator('button[data-accent-choice]').count()==7
 app.locator('button[data-accent-choice="green"]').click()
 assert app.evaluate("document.documentElement.dataset.accent")=='green'
 assert app.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()")=='#198056'
 assert app.evaluate("localStorage.getItem('pickpack1291_office_light_accent_v08')")=='green'
 app.locator('button[data-theme-choice="dark"]').click()
 assert app.evaluate("document.documentElement.getAttribute('data-theme')")=='dark'
 assert app.locator('button[data-accent-choice]').count()==0
 app.locator('button[data-theme-choice="light"]').click()
 assert app.locator('button[data-accent-choice]').count()==7
 assert app.locator('button[data-accent-choice="green"]').get_attribute('aria-pressed')=='true'
 app.locator('button[data-action="close-modal"]').last.click()
 assert app.locator('.nav-external').count()==0
 assert app.locator('a.nav-main').first.get_attribute('href').startswith('app.html?')
 app.screenshot(path=str(root/'preview-dashboard.png'),full_page=True)
 expected={'people':36,'shifts':42,'labor':42,'minutes':30,'assets':30,'pda':30}
 print('testing modules',flush=True)
 for module,n in expected.items():
  app.locator(f'a.nav-main[href*="view={module}"]').click()
  assert app.locator('.table-panel').last.locator('.records-label b').inner_text()==str(n),(module,app.locator('.table-panel').last.locator('.records-label b').inner_text())
  assert app.locator('.table-panel').last.locator('table tbody tr').count()==n
  assert app.locator('a.cell-record-link').first.get_attribute('href').startswith(f'app.html?view={module}')
  assert app.locator('.table-panel').last.locator('button[data-action="export"]').inner_text().strip().endswith('Xuất Excel')
  assert app.locator('.record-card').count()==0
  assert app.locator('[data-action="layout-cards"],[data-action="layout-table"]').count()==0
  assert app.locator('.page-header h1').count()==1
  assert app.locator('.module-summary').count()==0
 print('testing labor QR scan',flush=True)
 app.locator('a.nav-main[href*="view=labor"]').click()
 assert app.locator('#labor-scan-form').count()==1
 assert app.locator('button[data-action="add"]').count()==0
 app.locator('#labor-staff-code').fill('90000034')
 assert '90000034' in app.locator('#labor-scan-preview').inner_text()
 app.locator('#labor-staff-code').press('Enter')
 assert 'Đã ghi nhận công nhật' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.records-label b').inner_text()=='43'
 app.locator('#labor-staff-code').fill('90000034')
 app.locator('#labor-staff-code').press('Enter')
 assert 'Không tạo trùng' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.records-label b').inner_text()=='43'
 app.locator('#labor-staff-code').fill('NOT_FOUND')
 app.locator('#labor-staff-code').press('Enter')
 assert 'Không tìm thấy mã nhân viên' in app.locator('.scan-outcome').inner_text()
 print('testing PDA QR borrow-return',flush=True)
 app.locator('a.nav-main[href*="view=pda"]').click()
 assert app.locator('#pda-scan-form').count()==1
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
 assert 'Người trả không khớp' in app.locator('.scan-outcome').inner_text()
 app.locator('#pda-staff-code').fill('90000034')
 app.locator('#pda-device-code').fill('PDA-03')
 app.locator('#pda-device-code').press('Enter')
 assert 'Đã trả PDA-03' in app.locator('.scan-outcome').inner_text()
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='31'
 app.locator('a.nav-main[href*="view=shifts"]').click()
 assert app.locator('form#shift-scan-form').count()==1
 assert app.locator('input#shift-code').count()==1
 assert app.locator('button[data-scan-mode="enter"]').get_attribute('aria-pressed')=='true'
 assert app.locator('button[data-action="add"]').count()==0
 app.locator('input#shift-code').fill('90000001')
 assert app.locator('#scan-preview').get_by_text('Mã nhân viên:',exact=False).count()>=1
 app.locator('input#shift-code').press('Enter')
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='43'
 assert 'Đã vào ca' in app.locator('.scan-outcome').inner_text()
 app.locator('input#shift-code').fill('90000001')
 app.locator('input#shift-code').press('Enter')
 assert app.locator('.table-panel').last.locator('.records-label b').inner_text()=='43'
 assert 'không ghi nhận vào ca lần hai' in app.locator('.scan-outcome').inner_text()
 app.locator('button[data-scan-mode="exit"]').click()
 assert app.locator('button[data-scan-mode="exit"]').get_attribute('aria-pressed')=='true'
 app.locator('input#shift-code').fill('90000001')
 app.locator('input#shift-code').press('Enter')
 assert 'Đã ra ca' in app.locator('.scan-outcome').inner_text()
 app.locator('input#shift-code').fill('90000001')
 app.locator('input#shift-code').press('Enter')
 assert 'Không có lượt vào ca đang mở' in app.locator('.scan-outcome').inner_text()
 app.locator('input#shift-code').fill('NOT_FOUND')
 app.locator('input#shift-code').press('Enter')
 assert 'Không tìm thấy mã nhân viên' in app.locator('.scan-outcome').inner_text()
 app.locator('a.nav-main[href*="view=people"]').click()
 app.screenshot(path=str(root/'preview-people.png'),full_page=True)
 print('testing create',flush=True)
 app.locator('button[data-action="add"]').click()
 assert app.locator('form#record-form').count()==1
 app.locator('input[name="id"]').fill('90009999')
 app.locator('input[name="name"]').fill('Nhân viên giả lập bổ sung')
 app.locator('input[name="position"]').fill('Pick')
 app.locator('input[name="phone"]').fill('0001234567')
 app.locator('select[name="shift"]').select_option('Ca 1')
 # Tiny PNG fixture is fully synthetic; assert local avatar conversion from image.
 png=base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB6YAAAAASUVORK5CYII=')
 app.locator('#staff-photo').set_input_files({'name':'portrait.png','mimeType':'image/png','buffer':png})
 app.locator('#photo-preview img').wait_for()
 assert app.locator('#photo-preview img').get_attribute('src').startswith('data:image/jpeg;base64,')
 app.locator('#record-form button[type="submit"]').click()
 assert app.locator('.records-label b').inner_text()=='37'
 assert app.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v07')).people.find(x=>x.id==='90009999').photo.startsWith('data:image/jpeg;base64,')")
 print('testing edit',flush=True)
 app.locator('table tbody tr').first.locator('[data-edit]').click()
 app.locator('#record-form input[name="name"]').fill('Nhân viên giả lập đã chỉnh sửa')
 app.locator('#record-form button[type="submit"]').click()
 assert 'đã chỉnh sửa' in app.locator('table tbody tr').first.inner_text()
 app.once('dialog',lambda d:d.accept())
 print('testing delete',flush=True)
 app.locator('table tbody tr').first.locator('[data-delete]').click()
 assert app.locator('.records-label b').inner_text()=='36'
 print('testing search',flush=True)
 app.locator('input#global-search').fill('KhôngCóTrongDanhSách_TEST')
 assert app.get_by_text('Không tìm thấy bản ghi phù hợp').count()==1
 app.locator('input#global-search').fill('')
 assert app.locator('.record-card').count()==0
 print('testing bulk',flush=True)
 app.locator('table tbody tr').first.locator('[data-select]').check()
 assert 'Xóa đã chọn (1)' in app.locator('button[data-action="bulk-delete"]').inner_text()
 app.once('dialog',lambda d:d.accept())
 app.locator('button[data-action="bulk-delete"]').click()
 assert app.locator('.records-label b').inner_text()=='35'
 print('testing PDA',flush=True)
 app.locator('a.nav-main[href*="view=pda"]').click()
 assert app.locator('.device-registry table tbody tr').count()==3
 assert 'Seri PDA' in app.locator('.device-registry thead').inner_text()
 app.locator('.table-panel').last.locator('table tbody tr').first.locator('[data-record]').click()
 assert app.locator('.detail-drawer').count()==1
 assert app.locator('.detail-drawer button[data-quick]').count()==0
 app.locator('button[data-action="close-drawer"]').click()
 app.locator('button[data-action="theme"]').click()
 assert app.locator('html').count()==0 or app.evaluate("document.documentElement.getAttribute('data-theme')")=='dark'
 assert not errs,errs
 print('testing mobile',flush=True)
 mobile=new_screen(mobile=True)
 assert mobile.locator('button.menu-button').is_visible()
 mobile.screenshot(path=str(root/'preview-mobile.png'),full_page=True)
 assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth+3')
 mobile.locator('button.menu-button').click()
 mobile.locator('a.nav-main[href*="view=people"]').click()
 assert mobile.locator('.records-label b').inner_text()=='36'
 assert not mobile.locator('.nav-external').count()
 print('PASS: base 110% at setting 100%, two-line brand, dense single-header table UI, labor QR and PDA scan validation, login/CRUD/Excel, mobile')
 browser.close()
