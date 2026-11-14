"""End-to-end smoke against built static pages served over local HTTP.

No real data and no external host. This validates navigation that inline-DOM smoke cannot.
"""
from contextlib import closing
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from zipfile import ZipFile
from openpyxl import load_workbook
from playwright.sync_api import sync_playwright

webroot = Path(__file__).resolve().parents[1] / 'dist'
assert (webroot / 'index.html').is_file(), 'Run npm run build first'

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
        assert page.locator('.metrics .metric-card').count() == 8
        assert page.locator('.coverage-row').count() == 6
        assert page.locator('.corporate-brand').inner_text() == 'CÔNG TY CỔ PHẦN THE SUPRA - DC HƯNG YÊN'
        assert page.locator('.shortcut-panel').count() == 0
        assert page.locator('.overview-page [data-action="add"]').count() == 0
        assert page.locator('.overview-page [data-action="export"]').count() == 0
        page.locator('button[data-action="settings"]').click()
        assert page.locator('.font-steps output').inner_text() == '110%'
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

        second.locator('button[data-action="add"]').click()
        second.locator('#record-form input[name="id"]').fill('90009999')
        second.locator('#record-form input[name="name"]').fill('Nhân viên kiểm thử liên tab')
        second.locator('#record-form input[name="position"]').fill('Pick')
        second.locator('#record-form select[name="shift"]').select_option('Ca 1')
        second.locator('#record-form input[name="user"]').fill('pp1291.pk99')
        second.locator('#record-form button[type="submit"]').click()
        assert second.locator('.records-label b').inner_text() == '37'
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

        mobile_context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True)
        mobile = mobile_context.new_page()
        assert mobile.goto(base + '/index.html').ok
        mobile.locator('#demo-user').fill('admin')
        mobile.locator('#demo-password').fill('admin')
        mobile.locator('#login-form button[type="submit"]').click()
        mobile.wait_for_url('**/app.html?view=dashboard*')
        assert mobile.locator('button.menu-button').is_visible()
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth + 3')
        mobile.locator('button.menu-button').click()
        mobile.locator('a.nav-main[href*="view=shifts"]').click()
        assert mobile.locator('#shift-scan-form').is_visible()
        assert mobile.evaluate('document.documentElement.scrollWidth <= innerWidth + 3')
        assert not errors, errors
        assert not external, external
        print('HOSTED_SMOKE_PASS: full dashboard read-only, 7 light themes, font 110, login, Ctrl+tab, storage sync, valid Excel XLSX via openpyxl, scanning, mobile, no external requests')
        browser.close()
finally:
    server.shutdown()
    server.server_close()
