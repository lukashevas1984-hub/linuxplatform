#!/usr/bin/env python3
"""Build a fully offline HTML, source archive and static VPS bundle. No dependencies."""
from pathlib import Path
import base64,hashlib,json,re,zipfile
ROOT=Path(__file__).resolve().parent

def build():
    out=ROOT/'dist';out.mkdir(exist_ok=True);out.chmod(0o755)
    text=(ROOT/'src/index.html').read_text()
    def style(match):
        css=(ROOT/'src'/match[1]).read_text()
        css=css.replace('../assets/fonts/Onest.ttf','data:font/ttf;base64,'+base64.b64encode((ROOT/'assets/fonts/Onest.ttf').read_bytes()).decode())
        return '<style>\n'+css+'\n</style>'
    text=re.sub(r'<link rel="stylesheet" href="([\w.-]+)">',style,text)
    def script(match):
        js=(ROOT/'src'/match[1]).read_text()
        return '<script>\n'+js.replace('</script','<\\/script')+'\n</script>'
    text=re.sub(r'<script src="([\w.-]+)"></script>',script,text)
    license=(ROOT/'assets/fonts/OFL.txt').read_text()
    text=text.replace('</head>','<script type="text/plain" id="font-license">\n'+license+'\n</script>\n</head>')
    for name in ['LinuxLab.html','LinuxLab-course.html']:(out/name).write_text(text)
    # A ZIP downloads in browsers instead of displaying the raw HTML source.
    with zipfile.ZipFile(out/'LinuxLab.zip','w',zipfile.ZIP_DEFLATED) as z:
        z.write(out/'LinuxLab.html','LinuxLab.html')
    vps=out/'linuxlab-vps';vps.mkdir(exist_ok=True);vps.chmod(0o755)
    (vps/'index.html').write_text(text)
    for name in ['compose.yaml','README-VPS.md']:(vps/name).write_bytes((ROOT/'deploy'/name).read_bytes())
    for p in vps.iterdir():p.chmod(0o644)
    with zipfile.ZipFile(out/'LinuxLab-VPS.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in sorted(vps.iterdir()):z.write(p,'linuxlab-vps/'+p.name)
    with zipfile.ZipFile(out/'LinuxLab-project.zip','w',zipfile.ZIP_DEFLATED) as z:
        for folder in ['src','assets','backups','tests','docs','deploy']:
            for p in sorted((ROOT/folder).rglob('*')):
                if p.is_file() and '__pycache__' not in p.parts:z.write(p,'linuxplatform/'+str(p.relative_to(ROOT)))
        for name in ['build.py','README.md','requirements-test.txt','.gitignore']:
            p=ROOT/name
            if p.exists():z.write(p,'linuxplatform/'+name)
    manifest={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in out.iterdir() if p.is_file() and p.name!='checksums.json'}
    (out/'checksums.json').write_text(json.dumps(manifest,indent=2)+'\n')
    for p in out.iterdir():
        if p.is_file():p.chmod(0o644)
    print(json.dumps(manifest,indent=2))
if __name__=='__main__':build()
