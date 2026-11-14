from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
js=(root/'assets/app.js').read_text(encoding='utf-8')
css=(root/'assets/styles.css').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 ctx=browser.new_context(viewport={'width':1440,'height':900},accept_downloads=True)
 ctx.set_default_timeout(2000)
 def new_screen(screen='app',mobile=False):
  pg=(browser.new_context(viewport={'width':390,'height':844},is_mobile=True) if mobile else ctx).new_page()
  pg.set_default_timeout(2000)
  pg.set_content(f'<!doctype html><html lang="vi"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body data-screen="{screen}"><div id="root"></div></body></html>')
  pg.evaluate("""() => {let m = new Map([['pickpack1291_demo_session_v05','demo-admin-only']]);Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k)}})}""")
  pg.add_style_tag(content=css)
  pg.add_script_tag(content=js)
  return pg
 login=new_screen('login')
 assert login.locator('form#login-form').count()==1
 login.locator('input[name="username"]').fill('bad')
 login.locator('input[name="password"]').fill('bad')
 login.locator('button[type="submit"]').click()
 assert login.get_by_text('Sai tên đăng nhập hoặc mật khẩu mẫu').count()==1
 login.locator('input[name="username"]').fill('admin')
 login.locator('input[name="password"]').fill('admin')
 login.locator('button[data-action="show-password"]').click()
 assert login.locator('input[name="password"]').input_value()=='admin'
 assert login.locator('input[name="password"]').get_attribute('type')=='text'
 login.screenshot(path=str(root/'preview-login.png'),full_page=True)
 app=new_screen()
 errs=[];app.on('pageerror',lambda e:errs.append(str(e)))
 assert app.locator('a.nav-main').count()==7
 assert app.locator('.nav-external').count()==0
 assert app.locator('a.nav-main').first.get_attribute('href').startswith('app.html?')
 app.screenshot(path=str(root/'preview-dashboard.png'),full_page=True)
 expected={'people':36,'shifts':42,'labor':42,'minutes':30,'assets':30,'pda':30}
 print('testing modules',flush=True)
 for module,n in expected.items():
  app.locator(f'a.nav-main[href*="view={module}"]').click()
  assert app.locator('.records-label b').inner_text()==str(n),(module,app.locator('.records-label b').inner_text())
  assert app.locator('table tbody tr').count()==n
  assert app.locator('a.cell-record-link').first.get_attribute('href').startswith(f'app.html?view={module}')
 app.locator('a.nav-main[href*="view=people"]').click()
 app.screenshot(path=str(root/'preview-people.png'),full_page=True)
 print('testing create',flush=True)
 app.locator('button[data-action="add"]').click()
 assert app.locator('form#record-form').count()==1
 app.locator('input[name="name"]').fill('Nhân viên giả lập bổ sung')
 app.locator('select[name="team"]').select_option('Pick')
 app.locator('select[name="shift"]').select_option('Ca 1')
 app.locator('#record-form button[type="submit"]').click()
 assert app.locator('.records-label b').inner_text()=='37'
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
 print('testing cards',flush=True)
 app.locator('button[data-action="layout-cards"]').click()
 assert app.locator('.record-card').count()==36
 app.locator('button[data-action="layout-table"]').click()
 print('testing bulk',flush=True)
 app.locator('table tbody tr').first.locator('[data-select]').check()
 assert 'Xóa đã chọn (1)' in app.locator('button[data-action="bulk-delete"]').inner_text()
 app.once('dialog',lambda d:d.accept())
 app.locator('button[data-action="bulk-delete"]').click()
 assert app.locator('.records-label b').inner_text()=='35'
 app.once('dialog',lambda d:d.accept())
 app.locator('button[data-action="reset"]').click()
 assert app.locator('.records-label b').inner_text()=='36'
 print('testing PDA',flush=True)
 app.locator('a.nav-main[href*="view=pda"]').click()
 app.locator('table tbody tr').first.locator('[data-record]').click()
 assert app.locator('.detail-drawer').count()==1
 app.locator('.detail-drawer button[data-quick]').click()
 assert app.locator('.detail-drawer').count()==1
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
 print('PASS: login form validation/password visibility; 6 datasets 30-42 rows; native anchors; CRUD, search, card/table, bulk, reset, PDA status, theme; mobile')
 browser.close()
