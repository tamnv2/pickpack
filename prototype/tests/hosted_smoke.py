"""End-to-end smoke against built static pages served over local HTTP.

No real data and no external host. This validates navigation that inline-DOM smoke cannot.
"""
from contextlib import closing
import base64
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
from threading import Thread
from zipfile import ZipFile
from openpyxl import load_workbook
from playwright.sync_api import sync_playwright

webroot = Path(__file__).resolve().parents[1] / 'dist'
assert (webroot / 'index.html').is_file(), 'Run npm run build first'
version=json.loads((webroot.parent/'package.json').read_text(encoding='utf-8'))['version']
fixture=json.loads((webroot.parent/'tests/legacy_fixture.json').read_text(encoding='utf-8'))
assert version=='0.9.4'

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(webroot)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        # Browser without preexisting storage starts with no synthetic records or catalogs.
        blank_context=browser.new_context(viewport={'width': 1440, 'height': 900})
        blank=blank_context.new_page()
        assert blank.goto(base+'/index.html').ok
        blank.locator('#demo-user').fill('admin')
        blank.locator('#demo-password').fill('admin')
        blank.locator('#login-form button[type="submit"]').click()
        blank.wait_for_url('**/app.html?view=dashboard*')
        assert blank.locator('.metrics .metric-number').first.inner_text()=='0'
        blank.locator('a.nav-main[href*="view=people"]').click()
        assert blank.locator('.records-label b').inner_text()=='0'
        blank.locator('[data-catalog-scope="people"]').click()
        assert blank.locator('.catalog-panel tbody tr').count()==0
        blank.locator('a.nav-main[href*="view=resources"]').click()
        assert blank.locator('.catalog-panel tbody tr').count()==0
        blank.locator('a.nav-main[href*="view=pda"]').click()
        assert blank.locator('.device-registry tbody tr').count()==0
        assert blank.locator('[data-action="device-add"]').is_visible()
        blank.locator('[data-action="device-add"]').click()
        blank.locator('#device-form [name="id"]').fill('PDA-11')
        blank.locator('#device-form [name="serial"]').fill('SYNTHETIC-54321')
        blank.locator('#device-form [name="source"]').fill('Kho thử nghiệm')
        blank.locator('#device-form button[type="submit"]').click()
        assert blank.locator('.device-registry tbody tr').count()==1
        assert '54321' in blank.locator('.device-registry tbody tr').first.inner_text()
        blank.locator('a.nav-main[href*="view=people"]').click()
        blank.locator('[data-catalog-scope="people"]').click()
        for field,value in [('position','Pick'),('supplier','Nhà cung cấp A'),('department','Pick Pack'),('site','1291'),('warehouse','HY1')]:
            blank.locator(f'[data-category-tab="{field}"]').click()
            blank.locator('[data-action="category-add"]').click()
            blank.locator('#catalog-form [name="value"]').fill(value)
            blank.locator('#catalog-form button[type="submit"]').click()
            assert blank.locator('.catalog-panel tbody tr').count()==1
        blank.locator('.catalog-heading a[data-nav="people"]').click()
        blank.locator('[data-action="add"]').click()
        blank.locator('#record-form [name="id"]').fill('98765432')
        blank.locator('#record-form [name="name"]').fill('Nguyễn Thị Lan')
        blank.locator('#record-form [name="phone"]').fill('0123456789')
        for field,value in [('position','Pick'),('supplier','Nhà cung cấp A'),('department','Pick Pack'),('site','1291'),('warehouse','HY1')]:
            blank.locator(f'#record-form [name="{field}"]').select_option(value)
        blank.locator('#record-form button[type="submit"]').click()
        assert blank.locator('.records-label b').inner_text()=='1'
        assert blank.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people[0].id")=='98765432'
        blank.locator('a.nav-main[href*="view=pda"]').click()
        blank.locator('#pda-staff-code').fill('98765432')
        blank.locator('#pda-staff-code').press('Enter')
        blank.locator('#pda-device-code').fill('PDA-11')
        blank.locator('#pda-device-code').press('Enter')
        assert 'Đã mượn PDA-11' in blank.locator('.scan-outcome').inner_text()
        blank.locator('[data-pda-mode="return"]').click()
        blank.locator('#pda-staff-code').fill('98765432')
        blank.locator('#pda-device-code').fill('PDA-11')
        blank.locator('#pda-device-code').press('Enter')
        assert 'Đã trả PDA-11' in blank.locator('.scan-outcome').inner_text()
        blank_context.close()
        context = browser.new_context(viewport={'width': 1440, 'height': 900}, accept_downloads=True)
        # Regression fixtures live in tests/, never in the public app's initialization.
        seed='''(() => {const fixture=__FIXTURE__;if(localStorage.getItem("pickpack1291_office_records_v094")===null){
          localStorage.setItem("pickpack1291_office_records_v094",JSON.stringify(fixture.records));
          localStorage.setItem("pickpack1291_office_catalogs_v094",JSON.stringify(fixture.catalogs));
        }})()'''.replace('__FIXTURE__',json.dumps(fixture,ensure_ascii=False))
        context.add_init_script(seed)
        page = context.new_page()
        errors, external = [], []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('request', lambda req: external.append(req.url) if not req.url.startswith(base) else None)

        assert page.goto(base + '/index.html').ok
        assert page.locator('#login-form').is_visible()
        page.locator('#demo-user').fill('admin')
        page.locator('#demo-password').fill('admin')
        page.locator('#login-form button[type="submit"]').click()
        page.wait_for_url('**/app.html?view=dashboard*')
        assert page.locator('a.nav-main').count() == 8
        assert page.locator('.side-bottom .web-version').inner_text()==f'Web v{version}'
        assert page.locator('.site-footer').inner_text()=='Phát triển hệ thống - tamnv2 | Pick Pack 1291'
        assert page.locator('.side-bottom .site-footer').count()==1
        assert page.locator('.app-main .site-footer').count()==0
        assert page.evaluate("() => getComputedStyle(document.querySelector('.site-footer')).position")=='static'
        assert not page.locator('button.menu-button').is_visible()
        labels=page.locator('.nav-flat .nav-label').all_inner_texts()
        assert labels==['Tổng quan vận hành','Quản lý nhân sự','Quét vào/ra ca','Mượn / trả PDA','Quản lý công nhật','Quản lý biên bản','Quản lý CCDC','Quản lý tài nguyên'],labels
        assert page.locator('.nav-flat .nav-label').evaluate_all("(els)=>els.every(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)")
        assert page.locator('.topbar').evaluate("el=>getComputedStyle(el).position")=='sticky'
        assert page.locator('#clock-time').is_visible()
        assert page.locator('#clock-date,.flip-digit,.flip-pane,.flip-flap').count()==0
        assert page.locator('#clock-hours').count()==1 and page.locator('#clock-seconds').count()==1
        assert page.locator('#clock-time').evaluate("el => /^\\d{2}:\\d{2}:\\d{2} [AP]M$/.test(el.getAttribute('aria-label'))")
        assert page.locator('#clock-period').inner_text() in ('AM','PM')
        assert page.locator('.header-clock').get_attribute('aria-label')=='Giờ Việt Nam'
        assert page.locator('#clock-time').evaluate("el=>{const c=el.getBoundingClientRect(),h=el.closest('.header-clock').getBoundingClientRect();return c.left>=h.left-1&&c.right<=h.right+1&&c.top>=h.top-1&&c.bottom<=h.bottom+1}")
        assert page.locator('#clock-time').evaluate("el=>getComputedStyle(el).backgroundColor")=='rgba(0, 0, 0, 0)'
        assert page.locator('#clock-hours').evaluate("el=>getComputedStyle(el).color")!=page.locator('#clock-seconds').evaluate("el=>getComputedStyle(el).color")
        assert page.locator('.metrics .metric-card').count() == 8
        assert page.locator('#global-search').is_visible()
        slots=lambda: page.evaluate("""() => ['.top-search','.topbar .notif','.header-clock'].map(selector=>{const r=document.querySelector(selector).getBoundingClientRect();return [r.x,r.y,r.width]})""")
        overview_slots=slots()
        for module in ['people','shifts','pda','labor','minutes','assets','resources','categories']:
            page.locator(f'a.nav-main[href*="view={module}"]').click() if module!='categories' else page.goto(base + '/app.html?view=categories')
            assert all(abs(a-b)<1 for u,v in zip(overview_slots,slots()) for a,b in zip(u,v)),module
            assert page.locator('#global-search').is_visible()
        page.locator('a.nav-main[href*="view=dashboard"]').click()
        assert all(abs(a-b)<1 for u,v in zip(overview_slots,slots()) for a,b in zip(u,v))
        page.evaluate("() => window.__searchClock=document.querySelector('#clock-time')")
        page.locator('#global-search').fill('90000001')
        assert page.locator('.dashboard-search-hit[href*="view=people"][href*="record=90000001"]').count()==1
        assert page.evaluate("() => window.__searchClock===document.querySelector('#clock-time')")
        assert page.locator('.metrics .metric-card').count() == 8
        page.locator('#global-search').fill('KHONG_CO_BAN_GHI_1291')
        assert page.locator('.dashboard-no-results').count()==1
        page.locator('#global-search').fill('')
        assert page.locator('.dashboard-search-panel').count()==0
        assert page.locator('.coverage-row').count() == 6
        assert page.locator('.breadcrumb').count() == 0
        assert page.locator('.page-header .eyebrow').count() == 0
        assert page.locator('.page-header h1').count() == 0
        assert page.locator('.location-chip,.group-title').count() == 0
        assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--text-scale').trim()") == '1.1'
        assert page.locator('.corporate-brand span').all_inner_texts() == ['CÔNG TY CỔ PHẦN THE SUPRA','DC HƯNG YÊN']
        assert page.locator('.shortcut-panel').count() == 0
        assert page.locator('.overview-page [data-action="add"]').count() == 0
        assert page.locator('.overview-page [data-action="export"]').count() == 0
        page.locator('.top-profile').click()
        page.locator('button[data-action="settings"]').click()
        assert page.locator('.font-steps output').inner_text() == '100%'
        page.locator('[data-theme-choice="auto"]').click()
        assert page.evaluate("localStorage.getItem('pickpack1291_office_theme_v06')") == 'auto'
        page.locator('[data-theme-choice="light"]').click()
        assert page.evaluate("document.documentElement.dataset.theme") == 'light'
        assert page.locator('[data-accent-choice]').count() == 7
        page.locator('[data-accent-choice="violet"]').click()
        assert page.evaluate("document.documentElement.dataset.accent") == 'violet'
        assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()") == '#823eab'
        page.locator('[data-action="close-modal"]').last.click()
        # Verify live clock text and no page rerender, including the minute rollover.
        time_probe=context.new_page()
        time_probe.clock.install(time=datetime(2026,11,14,10,32,58,tzinfo=timezone.utc))
        assert time_probe.goto(base + '/app.html?view=dashboard').ok
        assert time_probe.locator('#clock-time').get_attribute('aria-label')=='05:32:58 PM'
        time_probe.evaluate("() => window.__clockNode=document.querySelector('#clock-time')")
        time_probe.clock.fast_forward(3000)
        assert time_probe.locator('#clock-time').get_attribute('aria-label')=='05:33:01 PM'
        assert time_probe.locator('#clock-hours').inner_text()=='05:33'
        assert time_probe.locator('#clock-seconds').inner_text()==':01'
        assert time_probe.evaluate("() => window.__clockNode===document.querySelector('#clock-time')")
        assert time_probe.locator('.flip-digit,.flip-pane,.flip-flap').count()==0
        time_probe.close()
        # Midnight in Vietnam is 17:00 UTC; date must not depend on local browser timezone.
        midnight=context.new_page()
        midnight.clock.install(time=datetime(2026,11,15,17,0,1,tzinfo=timezone.utc))
        assert midnight.goto(base+'/app.html?view=people').ok
        midnight.locator('button[data-action="add"]').click()
        assert midnight.locator('#record-form input[name="startDate"]').input_value()=='2026-11-16'
        midnight.locator('#record-form input[name="startDate"]').fill('2026-11-12')
        assert midnight.locator('#record-form input[name="startDate"]').input_value()=='2026-11-12'
        midnight.close()
        # Check the exact 18:00 Vietnam transition with Playwright's deterministic browser clock.
        page.locator('.top-profile').click()
        page.locator('button[data-action="settings"]').click()
        page.locator('button[data-theme-choice="auto"]').click()
        page.locator('[data-action="close-modal"]').last.click()
        probe=context.new_page()
        probe.clock.install(time=datetime(2026,11,14,10,59,58,tzinfo=timezone.utc))
        assert probe.goto(base + '/app.html?view=dashboard').ok
        assert probe.evaluate("document.documentElement.dataset.theme")=='light'
        probe.clock.fast_forward(3000)
        assert probe.evaluate("document.documentElement.dataset.theme")=='dark'
        probe.close()

        link = page.locator('a.nav-main[href*="view=people"]')
        assert link.get_attribute('href').startswith('app.html?view=people')
        with context.expect_page() as opened:
            link.click(modifiers=['Control'])
        second = opened.value
        second.wait_for_url('**/app.html?view=people*', timeout=5000)
        second.wait_for_load_state()
        assert second.locator('.records-label b').inner_text() == '36'
        assert second.locator('.people-table thead th').all_inner_texts()[-3:]==['Ngày nhận việc','Cập nhật bởi','Thao tác']
        assert second.locator('.people-table').evaluate("el=>getComputedStyle(el).tableLayout")=='auto'
        second.evaluate('window.scrollTo(0, 600)')
        assert abs(second.locator('.topbar').bounding_box()['y'])<2
        assert 'view=dashboard' in page.url

        # Categories are browser-local, persist across tabs and feed the employee form.
        second.locator('a[data-nav="categories"]').click()
        assert second.locator('[data-category-tab]').count() == 5
        second.locator('button[data-action="category-add"]').click()
        second.locator('#catalog-form input[name="value"]').fill('Điều phối thử')
        second.locator('#catalog-form button[type="submit"]').click()
        assert 'Điều phối thử' in second.locator('.catalog-panel').inner_text()
        assert 'Điều phối thử' in second.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_catalogs_v094')).position")
        second.locator('.catalog-heading a[data-nav="people"]').click()
        second.locator('button[data-action="add"]').click()
        assert second.locator('#record-form input[name="startDate"]').input_value()==second.evaluate("""() => {const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(x=>[x.type,x.value]));return p.year+'-'+p.month+'-'+p.day}""")
        second.locator('#record-form input[name="id"]').fill('ABC-90009999')
        assert second.locator('#record-form input[name="id"]').input_value()=='90009999'
        second.locator('#record-form input[name="id"]').fill('90009999')
        second.locator('#record-form input[name="name"]').fill('Nhân viên kiểm thử liên tab 12!')
        assert second.locator('#record-form input[name="name"]').input_value().strip()=='Nhân viên kiểm thử liên tab'
        second.locator('#record-form input[name="name"]').fill('Nhân viên kiểm thử liên tab')
        second.locator('#record-form input[name="phone"]').fill('000-123a456')
        assert second.locator('#record-form input[name="phone"]').input_value()=='000123456'
        assert second.locator('#record-form input[name="name"]').evaluate('el=>el.checkValidity()')
        second.locator('#record-form select[name="position"]').select_option('Điều phối thử')
        second.locator('#record-form select[name="supplier"]').select_option('Nội bộ')
        second.locator('#record-form select[name="department"]').select_option('Pick Pack')
        second.locator('#record-form select[name="site"]').select_option('1291')
        second.locator('#record-form select[name="warehouse"]').select_option('1291')
        assert second.locator('#record-form [name="user"],#record-form [name="shift"]').count()==0
        second.locator('#record-form input[name="startDate"]').fill('2026-12-01')
        # Entirely synthetic high-resolution portrait: 480x640, never contacts a remote service.
        photo_b64=second.evaluate("""() => {
          const c=document.createElement('canvas');c.width=480;c.height=640;const g=c.getContext('2d');
          g.fillStyle='#e0e7ed';g.fillRect(0,0,480,640);
          g.fillStyle='#5c7892';g.beginPath();g.arc(240,235,82,0,Math.PI*2);g.fill();
          g.fillStyle='#668da5';g.fillRect(105,340,270,230);
          return c.toDataURL('image/png').split(',')[1]
        }""")
        second.locator('#staff-photo').set_input_files({'name':'synthetic-portrait.png','mimeType':'image/png','buffer':base64.b64decode(photo_b64)})
        second.locator('#photo-preview img').wait_for()
        second.locator('#record-form button[type="submit"]').click()
        assert second.locator('.records-label b').inner_text() == '37'
        assert '01/12/2026' in second.locator('.people-table tbody tr').first.inner_text()
        assert 'Quản trị viên' in second.locator('.people-table tbody tr').first.inner_text()
        assert second.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(x=>x.id==='90009999').position")=='Điều phối thử'
        second.locator('.people-table tbody tr').first.locator('[data-record]').click()
        second.locator('#portrait-original img').wait_for(timeout=5000)
        assert second.locator('#portrait-original img').evaluate("el=>el.naturalWidth===480 && el.naturalHeight===640")
        second.locator('[data-action="zoom-portrait"]').click()
        assert second.locator('.portrait-lightbox img').evaluate("el=>el.naturalWidth===480")
        second.locator('.portrait-lightbox [data-action="close-modal"]').click()
        second.locator('.detail-head [data-action="close-drawer"]').click()
        # The other open tab receives a native storage event and updates the dashboard.
        page.wait_for_function("() => document.querySelector('.metrics .metric-number')?.textContent?.trim() === '37'", timeout=5000)

        with second.expect_download() as finished:
            second.locator('button[data-action="export"]').click()
        download = finished.value
        assert download.suggested_filename.startswith('pickpack-people-')
        assert download.suggested_filename.endswith('.xlsx')
        with ZipFile(download.path()) as archive:
            assert archive.testzip() is None
            assert {'[Content_Types].xml', 'xl/workbook.xml', 'xl/styles.xml', 'xl/worksheets/sheet1.xml'} <= set(archive.namelist())
        workbook = load_workbook(open(download.path(), 'rb'), read_only=True, data_only=True)
        sheet = workbook.active
        assert sheet['A1'].value == 'Họ và tên'
        assert sheet['B1'].value == 'Mã nhân viên'
        assert sheet['A2'].value == 'Nhân viên kiểm thử liên tab'
        assert sheet['B2'].value == '90009999'
        assert sheet['I1'].value == 'Ngày nhận việc'
        assert sheet['J1'].value == 'Cập nhật bởi'
        assert sheet['I2'].value == '01/12/2026'
        assert sheet['J2'].value == 'Quản trị viên'
        assert sheet.max_row == 38
        workbook.close()

        for module,scope in [('labor','laborWork'),('minutes','minutesType'),('assets','assetsType')]:
            second.locator(f'a.nav-main[href*="view={module}"]').click()
            second.locator(f'a[data-catalog-scope="{module}"]').click()
            assert second.locator(f'[data-category-tab="{scope}"]').count()==1
            assert second.locator('.catalog-panel tbody tr').count()>0
            second.locator(f'.catalog-heading a[data-nav="{module}"]').click()
        second.locator('a.nav-main[href*="view=shifts"]').click()
        second.locator('[data-scan-shift="Ca HC"]').click()
        assert second.locator('[data-scan-shift="Ca HC"]').get_attribute('aria-pressed')=='true'
        second.locator('#shift-code').fill('90009999')
        second.locator('#scan-portrait .scan-photo-original').wait_for(timeout=5000)
        assert second.locator('#scan-portrait img').evaluate("el=>el.naturalWidth===480&&el.naturalHeight===640")
        assert second.locator('#scan-portrait img').evaluate("el=>{const r=el.getBoundingClientRect();return r.height<=211&&Math.abs(r.width/r.height-.75)<.03}")
        assert second.locator('#scan-user-choice').count()==0 # Non-Pick/Pack is not issued a work account.
        second.locator('#shift-code').press('Enter')
        assert 'Đã vào ca' in second.locator('.scan-outcome').inner_text()
        assert second.evaluate("document.activeElement.id")=='shift-code'
        assert second.locator('[data-scan-shift="Ca HC"]').get_attribute('aria-pressed')=='true'
        assert 'Ca HC' in second.locator('.scan-outcome').inner_text()
        second.locator('[data-scan-mode="exit"]').click()
        assert second.locator('[data-scan-shift]').count()==0
        second.locator('#shift-code').fill('90009999')
        second.locator('#shift-code').press('Enter')
        assert 'Đã ra ca' in second.locator('.scan-outcome').inner_text()

        # Start/end labor are one row, with job selected from the live catalog.
        # All resource catalogs remain editable and accessible from the sidebar.
        second.locator('a.nav-main[href*="view=resources"]').click()
        assert second.locator('.catalog-tabs [data-category-tab]').count()==4
        second.locator('[data-category-tab="pickUsers"]').click()
        assert second.locator('.catalog-panel tbody tr').count()==20
        second.locator('[data-category-tab="packUsers"]').click()
        assert second.locator('.catalog-panel tbody tr').count()==20
        second.locator('[data-category-tab="packDesks"]').click()
        assert second.locator('.catalog-panel tbody tr').count()==12
        second.locator('a.nav-main[href*="view=shifts"]').click()
        assert second.locator('[data-scan-mode="exit"]').get_attribute('aria-pressed')=='true'
        second.locator('[data-scan-mode="enter"]').click()
        second.locator('[data-scan-shift="Ca 2"]').click()
        second.locator('#shift-code').fill('90000001')
        assert second.locator('#scan-user-choice').count()==1
        assert second.locator('#scan-desk-choice').count()==0
        second.locator('#scan-user-choice').select_option('pp1291.pk19')
        second.locator('#shift-code').press('Enter')
        assert 'Đã vào ca' in second.locator('.scan-outcome').inner_text()
        assert second.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).shifts[0].user")=='pp1291.pk19'
        second.locator('[data-scan-mode="exit"]').click()
        second.locator('#shift-code').fill('90000001')
        second.locator('#shift-code').press('Enter')
        assert 'Đã ra ca' in second.locator('.scan-outcome').inner_text()
        second.locator('a.nav-main[href*="view=labor"]').click()
        assert second.locator('#labor-scan-form').count()==1
        assert second.locator('[data-catalog-scope="labor"]').count()==1
        second.locator('#labor-work').select_option('Pick')
        second.locator('#labor-staff-code').fill('90000034')
        second.locator('#labor-staff-code').press('Enter')
        assert 'Đã bắt đầu công nhật' in second.locator('.scan-outcome').inner_text()
        assert second.locator('.records-label b').inner_text()=='43'
        second.locator('.table-panel').last.locator('tbody tr').first.locator('[data-edit]').click()
        assert second.locator('#confirm-form').is_visible()
        second.locator('#confirm-password').fill('admin')
        second.locator('#confirm-form button[type="submit"]').click()
        second.locator('#record-form select[name="work"]').select_option('Pick')
        second.locator('#record-form input[name="startTime"]').fill('05:35:00')
        second.locator('#record-form button[type="submit"]').click()
        assert '05:35:00' in second.locator('.table-panel').last.locator('tbody tr').first.inner_text()
        second.locator('#labor-staff-code').fill('90000034')
        second.locator('#labor-staff-code').press('Enter')
        assert 'Đã kết thúc công nhật' in second.locator('.scan-outcome').inner_text()
        assert second.locator('.records-label b').inner_text()=='43'
        second.locator('a.nav-main[href*="view=pda"]').click()
        assert second.locator('.table-panel').last.locator('[data-edit]').count()==0
        second.locator('#pda-staff-code').fill('90000034')
        second.locator('#pda-staff-code').press('Enter')
        assert second.locator('#pda-device-code').evaluate("(el)=>document.activeElement===el")
        second.locator('#pda-device-code').fill('SYNTHETIC-1291-00003')
        second.locator('#pda-device-code').press('Enter')
        assert 'Đã mượn PDA-03' in second.locator('.scan-outcome').inner_text()
        second.locator('[data-pda-mode="return"]').click()
        second.locator('#pda-staff-code').fill('90000034')
        second.locator('#pda-device-code').fill('PDA-03')
        second.locator('#pda-device-code').press('Enter')
        assert 'Đã trả PDA-03' in second.locator('.scan-outcome').inner_text()
        assert second.locator('.table-panel').last.locator('.records-label b').inner_text() == '31'
        # Full offline transfer: export records/catalogs/portraits from this browser,
        # import into another isolated browser context, then check parity and continued editing.
        second.locator('.top-profile').click()
        second.locator('button[data-action="settings"]').click()
        assert second.locator('[data-action="backup-export"]').is_visible()
        assert second.locator('[data-action="backup-import"]').is_visible()
        with second.expect_download() as backed_up:
            second.locator('[data-action="backup-export"]').click()
        backup=backed_up.value
        assert backup.suggested_filename.startswith('pickpack-1291-v0.9.4-')
        assert backup.suggested_filename.endswith('.json')
        backup_bytes=Path(backup.path()).read_bytes()
        snapshot=json.loads(backup_bytes)
        assert snapshot['format']=='pickpack1291-browser-backup'
        assert snapshot['schema']==1 and snapshot['webVersion']==version
        assert snapshot['data']['records']['people'][0]['id']=='90009999'
        assert snapshot['data']['records']['labor'][0]['endTime']!='—'
        assert len(snapshot['data']['records']['pda'])==31
        assert 'Điều phối thử' in snapshot['data']['catalogs']['position']
        assert len(snapshot['data']['catalogs']['packDesks'])==12
        assert len(snapshot['data']['portraits'])==1
        assert snapshot['data']['portraits'][0]['id']=='90009999'
        assert snapshot['data']['portraits'][0]['data'].startswith('data:image/png;base64,')

        isolated=browser.new_context(viewport={'width': 1440, 'height': 900},accept_downloads=True)
        target=isolated.new_page()
        target_errors=[]
        target.on('pageerror',lambda e:target_errors.append(str(e)))
        assert target.goto(base+'/index.html').ok
        target.locator('#demo-user').fill('admin')
        target.locator('#demo-password').fill('admin')
        target.locator('#login-form button[type="submit"]').click()
        target.wait_for_url('**/app.html?view=dashboard*')
        assert target.locator('.metrics .metric-number').first.inner_text()=='0'
        target.locator('.top-profile').click()
        target.locator('button[data-action="settings"]').click()
        assert target.locator('#backup-import-file').count()==1
        wrong={**snapshot,'webVersion':'0.9.0'}
        target.locator('#backup-import-file').set_input_files({'name':'wrong-version.json','mimeType':'application/json','buffer':json.dumps(wrong,ensure_ascii=False).encode('utf-8')})
        assert target.locator('#confirm-form').count()==0
        assert 'File dành cho Web v0.9.0' in target.locator('.toast-stack .toast').last.inner_text()
        # Invalid structure must not prompt for overwrite or alter the source browser data.
        bad=json.loads(backup_bytes)
        bad['data']['catalogs']['position']='INVALID'
        target.locator('#backup-import-file').set_input_files({'name':'bad-content.json','mimeType':'application/json','buffer':json.dumps(bad,ensure_ascii=False).encode('utf-8')})
        assert target.locator('#confirm-form').count()==0
        assert 'Danh mục position không hợp lệ' in target.locator('.toast-stack .toast').last.inner_text()
        target.locator('#backup-import-file').set_input_files({'name':'pickpack-test.json','mimeType':'application/json','buffer':backup_bytes})
        assert target.locator('#confirm-form').count()==1
        assert '37 nhân sự và 1 ảnh gốc' in target.locator('#confirm-message').inner_text()
        target.locator('#confirm-password').fill('wrong')
        target.locator('#confirm-form button[type="submit"]').click()
        assert 'Mật khẩu không đúng' in target.locator('#confirm-error').inner_text()
        assert target.locator('#confirm-form').count()==1
        target.locator('#confirm-password').fill('admin')
        target.locator('#confirm-form button[type="submit"]').click()
        target.wait_for_function("() => document.querySelector('.metrics .metric-number')?.textContent?.trim()==='37'",timeout=10000)
        assert 'Đã nhập dữ liệu thành công' in target.locator('.toast-stack .toast').last.inner_text()
        assert target.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.find(x=>x.id==='90009999').phone")=='000123456'
        assert target.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_catalogs_v094')).position.includes('Điều phối thử')")
        assert target.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).labor[0].endTime!='—'")
        assert target.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).pda.length")==31
        target.locator('a.nav-main[href*="view=people"]').click()
        target.locator('.people-table tbody tr').first.locator('[data-record]').click()
        target.locator('#portrait-original img').wait_for(timeout=5000)
        assert target.locator('#portrait-original img').evaluate("el=>el.naturalWidth===480&&el.naturalHeight===640")
        target.locator('.detail-head [data-action="close-drawer"]').click()
        target.locator('.people-table tbody tr').first.locator('[data-edit]').click()
        target.locator('#confirm-password').fill('admin')
        target.locator('#confirm-form button[type="submit"]').click()
        target.locator('#record-form input[name="name"]').fill('Nhân viên sau khi nhập')
        target.locator('#record-form button[type="submit"]').click()
        assert 'Nhân viên sau khi nhập' in target.locator('.people-table tbody tr').first.inner_text()
        # Explicit reset must erase imported data and previous-version keys only after confirmation.
        target.evaluate("() => localStorage.setItem('pickpack1291_office_records_v07','LEGACY_TEST_VALUE')")
        target.locator('.top-profile').click()
        target.locator('button[data-action="settings"]').click()
        target.locator('[data-action="backup-reset"]').click()
        assert target.locator('#confirm-form').count()==1
        target.locator('#confirm-form [data-action="close-modal"]').click()
        assert target.locator('.people-table tbody tr').count()==37
        target.locator('.top-profile').click()
        target.locator('[data-action="settings"]').click()
        target.locator('[data-action="backup-reset"]').click()
        target.locator('#confirm-password').fill('wrong')
        target.locator('#confirm-form button[type="submit"]').click()
        assert 'Mật khẩu không đúng' in target.locator('#confirm-error').inner_text()
        assert target.locator('.people-table tbody tr').count()==37
        target.locator('#confirm-password').fill('admin')
        target.locator('#confirm-form button[type="submit"]').click()
        target.wait_for_function("() => document.querySelector('.metrics .metric-number')?.textContent?.trim()==='0'",timeout=10000)
        assert target.evaluate("localStorage.getItem('pickpack1291_office_records_v07')") is None
        assert target.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v094')).people.length")==0
        assert target.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_catalogs_v094')).position.length")==0
        target.reload()
        assert target.locator('.metrics .metric-number').first.inner_text()=='0'
        target.locator('a.nav-main[href*="view=people"]').click()
        assert target.locator('.records-label b').inner_text()=='0'
        target.locator('[data-catalog-scope="people"]').click()
        assert target.locator('.catalog-panel tbody tr').count()==0
        assert not target_errors,target_errors
        isolated.close()
        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        mobile = mobile_context.new_page()
        assert mobile.goto(base + '/index.html').ok
        mobile.locator('#demo-user').fill('admin')
        mobile.locator('#demo-password').fill('admin')
        mobile.locator('#login-form button[type="submit"]').click()
        mobile.wait_for_url('**/app.html?view=dashboard*')
        assert mobile.locator('#clock-date').count()==0
        assert mobile.locator('.flip-digit').count()==0
        assert mobile.locator('#clock-time').is_visible()
        assert mobile.locator('#clock-time').evaluate("el=>{const c=el.getBoundingClientRect(),h=el.closest('.header-clock').getBoundingClientRect();return c.left>=h.left-1&&c.right<=h.right+1}")
        assert mobile.locator('button.menu-button').is_visible()
        assert mobile.locator('button.menu-button').inner_text()=='Mục'
        assert mobile.locator('.top-profile').is_visible()
        assert mobile.locator('.site-footer').inner_text()=='Phát triển hệ thống - tamnv2 | Pick Pack 1291'
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth + 3')
        mobile.locator('button.menu-button').click()
        assert mobile.locator('.sidebar').evaluate("el=>el.classList.contains('is-open')")
        assert mobile.locator('.nav-flat .nav-label').evaluate_all('(els)=>els.every(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)')
        mobile.locator('a.nav-main[href*="view=shifts"]').click()
        assert mobile.locator('#shift-scan-form').is_visible()
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth + 3')
        # Account dropdown logs out the whole mock browser origin, including other tabs.
        second.locator('.preferences-modal [data-action="close-modal"]').last.click()
        second.locator('.top-profile').click()
        second.locator('.profile-dropdown [data-action="logout"]').click()
        second.wait_for_url('**/index.html',timeout=5000)
        assert second.locator('#login-form').is_visible()
        page.wait_for_function("() => !!document.querySelector('.auth-required')",timeout=5000)
        assert not errors, errors
        assert not external, external
        print('HOSTED_SMOKE_PASS: v0.9.4 empty startup, fixture regressions, import/export original portrait, confirmed reset/cancel, zero API')
        browser.close()
finally:
    server.shutdown()
    server.server_close()
