"""End-to-end smoke against built static pages served over local HTTP.

No real data and no external host. This validates navigation that inline-DOM smoke cannot.
"""
from contextlib import closing
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
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
        assert page.locator('.metrics .metric-card').count() == 4

        link = page.locator('a.nav-main[href*="view=people"]')
        assert link.get_attribute('href').startswith('app.html?view=people')
        with context.expect_page() as opened:
            link.click(modifiers=['Control'])
        second = opened.value
        second.wait_for_load_state()
        assert 'view=people' in second.url
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
        page.locator('.metrics .metric-number').first.get_by_text('37').wait_for(timeout=5000)

        with second.expect_download() as finished:
            second.locator('button[data-action="export"]').click()
        download = finished.value
        assert download.suggested_filename == 'pickpack-people.csv'
        exported = Path(download.path()).read_text(encoding='utf-8-sig')
        assert '90009999' in exported and 'Nhân viên kiểm thử liên tab' in exported

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
        print('HOSTED_SMOKE_PASS: login redirect, Ctrl+new-tab, real storage sync, CSV download, scan/clock-out, mobile, no external calls')
        browser.close()
finally:
    server.shutdown()
    server.server_close()
