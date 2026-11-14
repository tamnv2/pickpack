"""End-to-end smoke against built static pages served over local HTTP.

No real data and no external host. This validates navigation that inline-DOM smoke cannot.
"""
from contextlib import closing
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
assert version=='0.8.4'

class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass

server = ThreadingHTTPServer(('127.0.0.1', 0), partial(QuietHandler, directory=str(webroot)))
Thread(target=server.serve_forever, daemon=True).start()
base = f'http://127.0.0.1:{server.server_port}'
try:
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
        context = browser.new_context(viewport={'width': 1440, 'height': 900}, accept_downloads=True)
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
        assert page.locator('a.nav-main').count() == 7
        assert page.locator('.side-bottom .web-version').inner_text()==f'Web v{version}'
        assert page.locator('.site-footer').inner_text()=='Phát triển hệ thống - tamnv2 | Pick Pack 1291'
        assert page.locator('.side-bottom .site-footer').count()==1
        assert page.locator('.app-main .site-footer').count()==0
        assert page.evaluate("() => getComputedStyle(document.querySelector('.site-footer')).position")=='static'
        assert not page.locator('button.menu-button').is_visible()
        labels=page.locator('.nav-flat .nav-label').all_inner_texts()
        assert len(labels)==7 and all(5 <= len(text.split()) <= 6 for text in labels),labels
        assert page.locator('.nav-flat .nav-label').evaluate_all("(els)=>els.every(el=>el.scrollHeight<=el.clientHeight+2&&el.scrollWidth<=el.clientWidth+2)")
        assert page.locator('.metrics .metric-card').count() == 8
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
        assert page.locator('[data-accent-choice]').count() == 7
        page.locator('[data-accent-choice="violet"]').click()
        assert page.evaluate("document.documentElement.dataset.accent") == 'violet'
        assert page.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()") == '#823eab'
        page.locator('[data-action="close-modal"]').last.click()

        link = page.locator('a.nav-main[href*="view=people"]')
        assert link.get_attribute('href').startswith('app.html?view=people')
        with context.expect_page() as opened:
            link.click(modifiers=['Control'])
        second = opened.value
        second.wait_for_url('**/app.html?view=people*', timeout=5000)
        second.wait_for_load_state()
        assert second.locator('.records-label b').inner_text() == '36'
        assert 'view=dashboard' in page.url

        # Categories are browser-local, persist across tabs and feed the employee form.
        second.locator('a[data-nav="categories"]').click()
        assert second.locator('[data-category-tab]').count() == 5
        second.locator('button[data-action="category-add"]').click()
        second.locator('#catalog-form input[name="value"]').fill('Điều phối thử')
        second.locator('#catalog-form button[type="submit"]').click()
        assert 'Điều phối thử' in second.locator('.catalog-panel').inner_text()
        assert 'Điều phối thử' in second.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_catalogs_v083')).position")
        second.locator('.catalog-heading a[data-nav="people"]').click()
        second.locator('button[data-action="add"]').click()
        second.locator('#record-form input[name="id"]').fill('90009999')
        second.locator('#record-form input[name="name"]').fill('Nhân viên kiểm thử liên tab')
        second.locator('#record-form select[name="position"]').select_option('Điều phối thử')
        second.locator('#record-form select[name="supplier"]').select_option('Nội bộ')
        second.locator('#record-form select[name="department"]').select_option('Pick Pack')
        second.locator('#record-form select[name="site"]').select_option('1291')
        second.locator('#record-form select[name="warehouse"]').select_option('1291')
        second.locator('#record-form select[name="shift"]').select_option('Ca 1')
        second.locator('#record-form input[name="user"]').fill('pp1291.pk99')
        second.locator('#record-form button[type="submit"]').click()
        assert second.locator('.records-label b').inner_text() == '37'
        assert second.evaluate("JSON.parse(localStorage.getItem('pickpack1291_office_records_v07')).people.find(x=>x.id==='90009999').position")=='Điều phối thử'
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
        assert sheet.max_row == 38
        workbook.close()

        second.locator('a.nav-main[href*="view=shifts"]').click()
        second.locator('#shift-code').fill('90009999')
        second.locator('#shift-code').press('Enter')
        assert 'Đã vào ca' in second.locator('.scan-outcome').inner_text()
        assert 'Ca 1' in second.locator('.scan-outcome').inner_text()
        second.locator('[data-scan-mode="exit"]').click()
        second.locator('#shift-code').fill('90009999')
        second.locator('#shift-code').press('Enter')
        assert 'Đã ra ca' in second.locator('.scan-outcome').inner_text()

        second.locator('a.nav-main[href*="view=labor"]').click()
        assert second.locator('#labor-scan-form').count() == 1
        assert second.locator('[data-action="layout-cards"],[data-action="layout-table"]').count() == 0
        assert second.locator('.module-summary').count() == 0
        second.locator('#labor-staff-code').fill('90000034')
        second.locator('#labor-staff-code').press('Enter')
        assert 'Đã ghi nhận công nhật' in second.locator('.scan-outcome').inner_text()
        assert second.locator('.records-label b').inner_text() == '43'
        second.locator('.table-panel').last.locator('tbody tr').first.locator('[data-edit]').click()
        second.locator('#record-form select[name="work"]').select_option('Pick')
        second.locator('#record-form input[name="hours"]').fill('8,5')
        second.locator('#record-form select[name="state"]').select_option('Đã xác nhận')
        second.locator('#record-form button[type="submit"]').click()
        assert 'Đã xác nhận' in second.locator('.table-panel').last.locator('tbody tr').first.inner_text()
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
        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        mobile = mobile_context.new_page()
        assert mobile.goto(base + '/index.html').ok
        mobile.locator('#demo-user').fill('admin')
        mobile.locator('#demo-password').fill('admin')
        mobile.locator('#login-form button[type="submit"]').click()
        mobile.wait_for_url('**/app.html?view=dashboard*')
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
        second.locator('.top-profile').click()
        second.locator('.profile-dropdown [data-action="logout"]').click()
        second.wait_for_url('**/index.html',timeout=5000)
        assert second.locator('#login-form').is_visible()
        page.wait_for_function("() => !!document.querySelector('.auth-required')",timeout=5000)
        assert not errors, errors
        assert not external, external
        print('HOSTED_SMOKE_PASS: v0.8.4 5-6 word sidebar labels and credit, mobile-only menu, CRUD/catalogs/QR/XLSX no external calls')
        browser.close()
finally:
    server.shutdown()
    server.server_close()
