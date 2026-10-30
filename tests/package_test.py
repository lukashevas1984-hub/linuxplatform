import hashlib,json,re,unittest,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
class PackageTest(unittest.TestCase):
 def test_input_backup_is_exact(self):
  b=(ROOT/'backups/LinuxLab.original.html').read_bytes();self.assertEqual(len(b),588541);self.assertEqual(hashlib.sha256(b).hexdigest(),'0422e28285fa99c62afc223e76d0bf64254e1be5ccc912ce8df2dbd461a29ba5')
 def test_standalone_and_vps_have_identical_html_and_readable_mode(self):
  b=(ROOT/'dist/LinuxLab.html').read_bytes();self.assertEqual(b,(ROOT/'dist/LinuxLab-course.html').read_bytes());s=b.decode();self.assertNotRegex(s,r'<script\b[^>]*\bsrc=');self.assertNotRegex(s,r'<link\b[^>]*rel="stylesheet"');self.assertIn('data:font/ttf;base64,',s);self.assertIn('SIL OPEN FONT LICENSE',s)
  with zipfile.ZipFile(ROOT/'dist/LinuxLab-VPS.zip') as z:
   self.assertEqual(z.read('linuxlab-vps/index.html'),b);mode=z.getinfo('linuxlab-vps/index.html').external_attr>>16;self.assertEqual(mode&0o444,0o444);self.assertIn('linuxlab-vps/README-VPS.md',z.namelist())
 def test_checksums_and_source_archive(self):
  checks=json.loads((ROOT/'dist/checksums.json').read_text())
  for name,expected in checks.items():
   b=(ROOT/'dist'/name).read_bytes();self.assertEqual(len(b),expected['bytes']);self.assertEqual(hashlib.sha256(b).hexdigest(),expected['sha256'])
  with zipfile.ZipFile(ROOT/'dist/LinuxLab-project.zip') as z:
   for p in ['build.py','src/learning.js','src/engine.js','tests/browser_test.py','backups/LinuxLab.original.html']:
    self.assertEqual(z.read('linuxplatform/'+p),(ROOT/p).read_bytes())
if __name__=='__main__':unittest.main(verbosity=2)
