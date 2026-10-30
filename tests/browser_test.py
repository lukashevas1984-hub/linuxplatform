"""Functional checks of the built offline artifact in Chromium. No remote website is used."""
import json, tempfile, unittest
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]

class BrowserTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.p=sync_playwright().start();cls.browser=cls.p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 @classmethod
 def tearDownClass(cls):cls.browser.close();cls.p.stop()
 def setUp(self):
  self.context=self.browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True);self.errors=[];self.requests=[]
  self.context.route('**/*',self.route)
  self.page=self.context.new_page();self.page.on('pageerror',lambda e:self.errors.append(str(e)));self.page.goto('https://linuxlab.test/')
 def route(self,route):
  if route.request.url=='https://linuxlab.test/':route.fulfill(path=str(ROOT/'dist/LinuxLab.html'),content_type='text/html')
  else:self.requests.append(route.request.url);route.abort()
 def tearDown(self):
  self.assertEqual(self.errors,[]);self.assertEqual(self.requests,[]);self.context.close()
 def goto(self,hash):
  self.page.evaluate('(h)=>{location.hash=h}',hash);self.page.wait_for_function('(h)=>location.hash===h',arg=hash);self.page.wait_for_timeout(25)
 def prepared(self):
  # Explicit fixture only for component tests; the separate full journey starts with empty storage.
  self.page.evaluate('''()=>{for(const u of TEACHING)learningState().units[u.id]=true;for(const m of COURSE)learningState().guides[m.id]=true;save();render();}''')
 def test_01_new_learner_and_gates(self):
  self.assertIn('Научиться разбираться',self.page.locator('h1').inner_text())
  for route in ['#lab/service','#prepare/config-proposal','#exam']:
   self.goto(route);self.assertEqual(self.page.locator('#terminal-form').count(),0);self.assertIn('объяснен',self.page.locator('#main').inner_text().lower())
  self.goto('#learn/foundation-system');self.assertIn('НЕ ПОЛЕ ВВОДА',self.page.locator('#main').inner_text());self.assertEqual(self.page.locator('[data-study-answer]:disabled').count(),3)
  self.page.click('[data-study-fill]');self.assertEqual(self.page.evaluate('learningSession.lab.commandCount'),0)
  self.page.click('#study-form button[type=submit]');self.page.click('[data-study-answer="1"]')
  self.assertTrue(self.page.evaluate('!!learningState().units["foundation-system"]'))
 def test_02_all_54_lessons_and_12_guides_from_zero(self):
  units=self.page.evaluate('TEACHING.map(u=>({id:u.id,moduleId:u.moduleId,answer:u.answer}))')
  for i,u in enumerate(units):
   with self.subTest(lesson=u['id']):
    self.goto('#learn/'+u['id']);self.assertEqual(self.page.locator('[data-study-answer]').count(),3)
    steps=self.page.evaluate('(id)=>INTRO_DRILLS[id]||[]',u['id'])
    for step in steps:
     self.page.click('[data-study-fill]');self.page.click('#study-form button[type=submit]')
    self.page.click(f'[data-study-answer="{u["answer"]}"]');self.assertTrue(self.page.evaluate('(id)=>!!learningState().units[id]',u['id']))
    if i==len(units)-1 or units[i+1]['moduleId']!=u['moduleId']:
     self.goto('#guide/'+u['moduleId']);steps=self.page.evaluate('(id)=>GUIDES[id].steps',u['moduleId'])
     for _ in steps:self.page.click('[data-study-fill]');self.page.click('#study-form button[type=submit]')
     self.page.click('[data-guide-answer="0"]');self.assertTrue(self.page.evaluate('(id)=>!!learningState().guides[id]',u['moduleId']))
  self.assertEqual(self.page.evaluate('Object.keys(learningState().units).length'),54)
  self.assertEqual(self.page.evaluate('Object.keys(learningState().micro).length'),12)
  self.assertEqual(self.page.evaluate('Object.keys(learningState().guides).length'),12)
  self.page.reload();self.assertEqual(self.page.evaluate('Object.keys(learningState().units).length'),54)
 def test_03_new_labs_terminal_result_and_quiz(self):
  self.prepared()
  for id in ['http-summary','config-proposal']:
   self.goto('#prepare/'+id);self.page.click(f'a[href="#lab/{id}"]');self.page.wait_for_selector('#terminal-input')
   spec=self.page.evaluate('(id)=>ALL_LABS.find(l=>l.id===id)',id)
   for cmd in spec['solution']:
    self.page.fill('#terminal-input',cmd);self.page.press('#terminal-input','Enter')
   self.assertTrue(self.page.evaluate('currentLab.checks().every(Boolean)'))
   if id=='config-proposal':self.assertIn('найдены различия',self.page.locator('#terminal-output').inner_text())
   self.page.click(f'[data-action=quiz][data-index="{spec["answer"]}"]');self.page.click('[data-action=check-lab]')
   self.assertTrue(self.page.evaluate('(id)=>!!data.completed[id]',id));self.page.click('[data-action=close-modal]')
 def test_04_links_independent_and_no_progress_side_effect(self):
  self.prepared();self.goto('#learn/storage-links');before=self.page.evaluate('JSON.stringify(data)')
  self.page.click('[data-links-action=primary]');self.assertIn('битая ссылка',self.page.locator('.links-model').inner_text());self.assertIn('Жёстких имён: 1',self.page.locator('.links-model').inner_text())
  self.page.click('[data-links-action=alias]');self.assertIn('Данные удерживаются',self.page.locator('.links-model').inner_text())
  self.page.click('[data-links-action=open]');self.assertIn('можно освободить',self.page.locator('.links-model').inner_text());self.assertEqual(before,self.page.evaluate('JSON.stringify(data)'))
  self.page.click('[data-links-action=reset]');self.page.click('[data-links-action=open]');self.assertIn('Жёстких имён: 2',self.page.locator('.links-model').inner_text());self.assertIn('Данные удерживаются',self.page.locator('.links-model').inner_text())
 def test_05_export_import_and_legacy(self):
  self.prepared();self.page.evaluate('''()=>{data.notes.service={hypothesis:'<img src=x onerror=alert(1)>',evidence:'status',prevention:'CI'};learningState().micro['foundation-system']=true;data.completed.service={date:Date.now(),hints:1,commands:4};reader.size=20;reader.englishHelp=false;saveReader();save();}''')
  with self.page.expect_download() as download:self.page.click('#export-side')
  payload=json.loads(Path(download.value.path()).read_text());self.assertEqual(payload['reader']['size'],20);self.assertEqual(len(payload['learning']['units']),54)
  self.page.evaluate('()=>{data=structuredClone(BASE);save();}')
  self.page.locator('#import-file').set_input_files({'name':'progress.json','mimeType':'application/json','buffer':json.dumps(payload).encode()});self.page.wait_for_function('Object.keys(learningState().units).length===54')
  self.assertEqual(self.page.evaluate('reader.size'),20);self.assertFalse(self.page.evaluate('reader.englishHelp'));self.assertEqual(self.page.evaluate('Object.keys(data.sessions).length'),0)
  self.goto('#lab/service');self.assertEqual(self.page.locator('[data-note=hypothesis]').input_value(),payload['notes']['service']['hypothesis']);self.assertEqual(self.page.locator('img[src=x]').count(),0)
  legacy={k:payload[k] for k in ['version','completed','notes','reviews','read','examHistory']}
  self.page.locator('#import-file').set_input_files({'name':'old.json','mimeType':'application/json','buffer':json.dumps(legacy).encode()});self.page.wait_for_function('Object.keys(learningState().units).length===0')
  self.assertTrue(self.page.evaluate('!!data.completed.service'));self.assertEqual(self.page.evaluate('data.notes.service.evidence'),'status')
 def test_06_exam_reload_expiry_and_no_hints(self):
  self.prepared();self.goto('#exam');self.page.click('[data-action=start-exam]');self.page.wait_for_selector('#terminal-form');queue=self.page.evaluate('data.exam.queue');self.assertEqual(len(set(queue)),3)
  self.assertTrue(self.page.locator('[data-action=hint]').is_disabled());self.assertEqual(self.page.locator('[data-action=show-solution]').count(),0)
  self.page.reload();self.assertEqual(queue,self.page.evaluate('data.exam.queue'));self.page.evaluate('()=>{data.exam.deadline=Date.now()-1;save();render();}');self.page.wait_for_function('!activeExam()');self.assertFalse(self.page.evaluate('data.examHistory.at(-1).passed'))
 def test_07_layout_and_reader_settings(self):
  self.prepared()
  for width in [1440,768,390,360]:
   self.page.set_viewport_size({'width':width,'height':1000});self.page.evaluate('()=>{reader.size=20;saveReader()}')
   for route in ['#home','#path','#learn/foundation-terminal','#learn/storage-links','#guide/observability','#lab/config-proposal','#journal','#atlas']:
    self.goto(route)
    with self.subTest(width=width,route=route):self.assertLessEqual(self.page.evaluate('document.documentElement.scrollWidth'),width+1)
  self.page.reload();self.assertEqual(self.page.evaluate('reader.size'),20)
  self.page.screenshot(path=str(ROOT/'docs/mobile.png'),full_page=True)
 def test_08_unavailable_storage_keeps_export(self):
  self.context.add_init_script('''Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})''');self.page.reload();self.assertEqual(self.page.locator('#storage-warning').count(),1)
  with self.page.expect_download() as d:self.page.click('#export-side')
  self.assertEqual(json.loads(Path(d.value.path()).read_text())['version'],1)
 def test_09_local_file_runs_without_network(self):
  context=self.browser.new_context();page=context.new_page();errors=[];requests=[];page.on('pageerror',lambda e:errors.append(str(e)));page.on('request',lambda r:requests.append(r.url))
  try:page.goto((ROOT/'dist/LinuxLab.html').as_uri())
  except Exception as e:
   context.close()
   if 'ERR_BLOCKED_BY_ADMINISTRATOR' in str(e):self.skipTest('Host browser policy blocks file://; identical artifact tested through intercepted HTTPS without network')
   raise
  self.assertIn('Научиться разбираться',page.locator('h1').inner_text());self.assertEqual(errors,[]);self.assertTrue(all(r.startswith(('file:','data:')) for r in requests));context.close()
if __name__=='__main__':unittest.main(verbosity=2)
