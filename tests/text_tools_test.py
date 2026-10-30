"""Compare supported pipelines with real GNU tools over a controlled file, LC_ALL=C."""
import json,os,subprocess,tempfile,unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SAMPLE='node-b /orders 503\nnode-a /health 200\nnode-b /orders 500\nnode-a /health 200\nnode-b /orders 503\n'
COMMANDS=["awk '{print $1}'", "awk '$3 >= 500 {print $2}'", "awk '{print $1}' | sort | uniq -c | sort -nr", "cut -d' ' -f1,3", 'sort | uniq -c','sort -u',"awk '{print $3}' | sort -nr", "sed 's/node-/host-/g'", "sed -n '2,4p'", 'wc -l']
class TextToolsTest(unittest.TestCase):
 def test_supported_pipelines_match_gnu(self):
  script="""const {load}=require('./tests/course_data.cjs');const {LinuxLab}=load();const l=new LinuxLab('compare');l.files['/tmp/sample']=JSON.parse(process.argv[1]);const commands=JSON.parse(process.argv[2]);console.log(JSON.stringify(commands.map(c=>l.run('cat /tmp/sample | '+c))));"""
  actual=json.loads(subprocess.check_output(['node','-e',script,json.dumps(SAMPLE),json.dumps(COMMANDS)],cwd=ROOT))
  with tempfile.TemporaryDirectory() as tmp:
   file=Path(tmp)/'sample';file.write_text(SAMPLE)
   for cmd,result in zip(COMMANDS,actual):
    with self.subTest(command=cmd):
     # Commands are fixed test constants; user input is never interpreted by a real shell.
     real=subprocess.run(['bash','-o','pipefail','-c','cat "$1" | '+cmd,'test',str(file)],capture_output=True,text=True,env={**os.environ,'LC_ALL':'C'},timeout=10)
     self.assertEqual(result['code'],real.returncode);self.assertEqual(result['output'],real.stdout)
if __name__=='__main__':unittest.main(verbosity=2)
