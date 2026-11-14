"""Isolated Chromium UI smoke; hosted navigation blocked by sandbox, inspect real anchors."""
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
from urllib.parse import parse_qs, urlparse
ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'dist/assets/styles.css').read_text(encoding='utf-8')
JS=(ROOT/'dist/assets/app.js').read_text(encoding='utf-8')
previews=ROOT/'previews';previews.mkdir(exist_ok=True)
shots=[]
def doc(pg, d=1,theme='light',module='overview',record=None,screen='app'):
 src=(ROOT/('dist/index.html' if screen=='gallery' else 'dist/app.html')).read_text(encoding='utf-8')
 src=src.replace('<link rel="stylesheet" href="assets/styles.css">',f'<style>{CSS}</style>')
 q=f'?design={d}&mode={theme}&page={module}'+(f'&record={record}' if record else '')
 j=JS.replace('const params=new URLSearchParams(location.search);',f'const params=new URLSearchParams("{q}");')
 src=src.replace('<script defer src="assets/app.js"></script>','').replace('</body>',f'<script>{j}</script></body>')
 pg.set_content(src,wait_until='load')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height in [(1440,900),(390,844)]:
  pg=browser.new_page(viewport={'width':width,'height':height})
  errors=[];external=[];pg.on('pageerror',lambda err:errors.append(str(err)))
  pg.on('request',lambda req:external.append(req.url))
  doc(pg,screen='gallery')
  assert pg.locator('.choice-card').count()==5
  assert pg.locator('.choice-actions a').count()==10
  assert all(t=='_blank' for t in pg.locator('.choice-actions a').evaluate_all('(e)=>e.map(x=>x.target)'))
  for d in range(1,6):
   for theme in ('light','dark'):
    doc(pg,d,theme)
    assert pg.locator('h1').inner_text()=='Tổng quan'
    assert pg.locator('html').get_attribute('data-theme')==theme
    assert pg.locator('html').get_attribute('data-design')==str(d)
    assert (pg.locator('.field-bottom a').count()==4 if d==5 else pg.locator('.nav-item').count()>=7),(d,pg.locator('.nav-item').count())
    assert pg.locator('a[target="_blank"]').count()>=7
    assert pg.locator('.app').count()==1
    assert not pg.evaluate('document.documentElement.scrollWidth > innerWidth + 1'),(width,d,theme,'overflow',pg.evaluate('document.documentElement.scrollWidth'))
    layout=['enterprise','tower','workflow','workbench','field'][d-1]
    assert pg.locator(f'.app.{layout}').count()==1
    assert pg.locator('main').count()==1
    if d==1:assert pg.locator('.e-aside .nav-item').count()==7
    if d==2:assert pg.locator('.tower-alerts .alert-box').count()==3
    if d==3:assert pg.locator('.kanban .lane').count()==3
    if d==4:assert pg.locator('.wb-inspector').count()==1
    if d==5:assert pg.locator('.scan-action').count()==1
    links=pg.locator('a[target="_blank"]').evaluate_all('(els)=>els.map(x=>({href:x.getAttribute("href"),rel:x.rel,target:x.target}))')
    assert all(l['href'].startswith('app.html?') and 'noopener' in l['rel'] and l['target']=='_blank' for l in links)
    assert any(parse_qs(urlparse(l['href']).query).get('page')==['people'] for l in links)
    assert all(parse_qs(urlparse(l['href']).query).get('design')==[str(d)] for l in links)
    if width==1440:
     target=previews/f'concept-{d}-{theme}.png';pg.screenshot(path=str(target),full_page=False);shots.append(target)
   doc(pg,d,'light','people')
   assert pg.locator('h1').inner_text()=='Nhân sự'
   assert pg.locator('input#search-records').count()==1
   pg.locator('#search-records').fill('NV-MAU-003')
   selector='.table-shell tbody tr,.module-kanban .task-card,.field-record-grid .field-record'
   assert pg.locator(selector).count()==1,(d,'search',pg.locator(selector).count())
   pg.locator('#search-records').fill('')
   pg.locator('#filter-records').select_option('warning')
   assert pg.locator(selector).count()==2,(d,'filter',pg.locator(selector).count())
   pg.locator('#filter-records').select_option('all')
   pg.locator('#add-row').click()
   assert pg.locator(selector).count()==7,(d,'add',pg.locator(selector).count())
   doc(pg,d,'light','people')
   assert pg.locator(selector).count()==6,(d,'reset')
   doc(pg,d,'dark','people','NV-MAU-001')
   assert pg.locator('.detail-panel').count()==1
   assert 'NV-MAU-001' in pg.locator('.detail-panel').inner_text()
  assert not errors,(width,errors)
  assert not external,(width,external)
  print(f'PASS viewport {width}x{height}: 5x2 layouts, 7 modules, anchor targets/deep-links, search/filter/add/reset, no requests/pageerrors')
  pg.close()
 browser.close()
montage=Image.new('RGB',(1440,1790),'#f2f5f9')
for i,path in enumerate(shots):
 im=Image.open(path).convert('RGB');im.thumbnail((698,327))
 tile=Image.new('RGB',(720,358),'#fff')
 ImageDraw.Draw(tile).text((16,7),f'MAU {i//2+1} - {"SANG" if i%2==0 else "TOI"}',fill='#2a425a')
 tile.paste(im,((720-im.width)//2,28));montage.paste(tile,((i%2)*720,(i//2)*358))
montage.save(previews/'so-sanh-5-bo-cuc-sang-toi.png',optimize=True)
print('PASS montage 10 screens')