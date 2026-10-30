
/* Isolated, stateful teaching simulator. It never executes operating-system commands. */
class LinuxLab {
 constructor(id){this.id=id;this.cwd='/home/student';this.history=[];this.seen=new Set();this.events=new Set();this.code=0;this.commandCount=0;this.hints=0;this.files={};this.perms={};this.owner={};this.state={running:true,dns:true,bound:true,route:true,disk:false,inodes:false,lv:10,fs:10,cpu:false,curl:true,apt:false,docker:true,dockerPort:false,firewall:false,wide:false,reloaded:true,mounted:true};this.seed();}
 seed(){
  const put=(p,t,mode='644',owner='root:root')=>{this.files[p]=t;this.perms[p]=mode;this.owner[p]=owner;};
  put('/etc/os-release','PRETTY_NAME="LinuxLab / Ubuntu 24.04 model"\nID=ubuntu\n');
  put('/proc/cmdline','BOOT_IMAGE=/vmlinuz root=UUID=root-2026 ro quiet\n');
  put('/proc/meminfo','MemTotal: 4194304 kB\nMemAvailable: 2936012 kB\nCached: 2800000 kB\nSwapTotal: 2097152 kB\n');
  put('/etc/systemd/system/api.service','[Unit]\nDescription=Training API\nAfter=network.target\n\n[Service]\nExecStart=/usr/local/bin/api\nUser=webapp\nRestart=on-failure\n\n[Install]\nWantedBy=multi-user.target\n');
  put('/etc/api.conf','listen=0.0.0.0:8080\ndatabase_host=db.internal\n');
  put('/srv/app/config.env','DATABASE_URL=postgres://db.internal/app\n','640','webapp:webapp');
  put('/etc/resolv.conf','nameserver 10.0.0.53\n');
  put('/etc/fstab','UUID=root-2026 / ext4 defaults 0 1\nUUID=data-2026 /data ext4 defaults 0 2\n');
  put('/etc/ssh/sshd_config','Port 22\nPermitRootLogin yes\nPasswordAuthentication yes\nPubkeyAuthentication yes\n');
  put('/home/student/.ssh/id_ed25519','[Учебный макет ключа — не настоящий секрет]\n','600','student:student');
  put('/etc/cron.d/backup','0 2 * * * backup scripts/backup.sh\n');
  put('/opt/scripts/backup.sh','#!/bin/bash\nmysqldump --single-transaction app | gzip > /backup/app.sql.gz\n');
  put('/var/log/app.log','10:00 INFO starting API\n10:01 INFO health 200\n10:04 INFO deploy release=2.4\n10:05 ERROR missing DATABASE_URL\n10:06 WARN retry scheduled\n10:07 ERROR startup failed: configuration incomplete\n10:08 ERROR readiness probe failed\n');
  put('/var/log/auth.log','10:01 sshd: Accepted publickey for student\n10:02 sshd: Failed password for root from 198.51.100.7\n');
  put('/var/log/syslog','10:04 systemd: api.service started\n10:05 api: readiness failed\n');
  put('/usr/local/bin/api','[Учебный исполняемый файл]\n','755');
  put('/var/cache/app/session-0001','expired\n');put('/var/cache/app/session-0002','expired\n');
  put('/backup/app.tar.gz','[Учебная резервная копия config.env]\n','600');
  if(['service','incident'].includes(this.id)){this.files['/etc/systemd/system/api.service']=this.files['/etc/systemd/system/api.service'].replace('/usr/local/bin/api','/opt/old/api');this.state.running=false;}
  if(['dns','incident'].includes(this.id)){this.files['/etc/resolv.conf']='nameserver 10.0.0.99\n';this.state.dns=false;}
  if(['disk','incident'].includes(this.id))this.state.disk=true;
  if(this.id==='permissions'){this.owner['/srv/app/config.env']='root:root';this.perms['/srv/app/config.env']='600';this.state.running=false;}
  if(this.id==='ssh-key')this.perms['/home/student/.ssh/id_ed25519']='644';
  if(this.id==='cpu')this.state.cpu=true;
  if(this.id==='boot'){this.files['/etc/fstab']=this.files['/etc/fstab'].replace('UUID=data-2026','UUID=wrong-data');this.state.mounted=false;}
  if(this.id==='inodes')this.state.inodes=true;
  if(this.id==='bind'){this.files['/etc/api.conf']='listen=127.0.0.1:8080\ndatabase_host=db.internal\n';this.state.bound=false;}
  if(this.id==='route')this.state.route=false;
  if(this.id==='packages')this.state.curl=false;
  if(this.id==='docker')this.state.running=false;
  if(this.id==='restore'){this.files['/srv/app/config.env']='';this.state.running=false;}
  if(this.id==='timeline'){this.files['/etc/api.conf']='listen=0.0.0.0:8080\ndatabase_host=old-db\n';this.files['/var/log/app.log']='10:04 INFO deploy database_host=old-db\n10:05 ERROR database connection refused\n10:06 WARN retry storm: 500 retries/sec\n10:07 WARN CPU usage 97%\n';}
  this.originalLog=this.files['/var/log/app.log'];
 }
 path(p){if(!p)return this.cwd;p=p.replace(/^~(?=\/|$)/,'/home/student');let a=(p.startsWith('/')?p:this.cwd+'/'+p).split('/');const out=[];for(const x of a){if(x==='..')out.pop();else if(x&&x!=='.')out.push(x);}return '/'+out.join('/');}
 exists(p){return p==='/'||Object.hasOwn(this.files,p)||Object.keys(this.files).some(x=>x.startsWith(p.replace(/\/$/,'')+'/'));}
 read(p){p=this.path(p);if(!Object.hasOwn(this.files,p))throw Error(p+': файл не найден');this.seen.add('read:'+p);return this.files[p];}
 save(p,t){p=this.path(p);if(!Object.hasOwn(this.files,p))throw Error('В редакторе выбери существующий файл. Новый файл можно создать через echo ... > путь.');this.files[p]=t;this.events.add('edit:'+p);if(p.endsWith('/api.service'))this.state.reloaded=false;if(p==='/etc/resolv.conf')this.state.dns=/^nameserver\s+10\.0\.0\.53\s*$/m.test(t);if(p==='/etc/ssh/sshd_config')this.events.delete('sshd-valid');return p;}
 tokens(s){let result=[],part='',quote='',escaped=false;for(const c of s){if(escaped){part+=c;escaped=false;continue;}if(c==='\\'&&quote!=="'"){escaped=true;continue;}if(quote){if(c===quote)quote='';else part+=c;}else if(c==='"'||c==="'")quote=c;else if(/\s/.test(c)){if(part){result.push(part);part='';}}else part+=c;}if(quote)throw Error('Незакрытая кавычка');if(part)result.push(part);return result;}
 split(s,char){let out=[],q='',cur='',escape=false;for(const c of s){if(escape){cur+=c;escape=false;continue;}if(c==='\\'){cur+=c;escape=true;continue;}if(q){cur+=c;if(c===q)q='';}else if(c==='"'||c==="'"){q=c;cur+=c;}else if(c===char){out.push(cur.trim());cur='';}else cur+=c;}out.push(cur.trim());return out;}
 run(raw){this.history.push(raw);this.commandCount++;try{
  if(/\$\(|`/.test(raw))throw Error('Подстановки команд не поддерживаются учебным shell.');
  if(this.split(raw,';').length>1)throw Error('Вводи по одной команде: так видны результат и код возврата каждого шага.');
  const pipe=this.split(raw,'|');if(pipe.some(s=>!s))throw Error('Пустая команда в конвейере. && и || в этом симуляторе не поддерживаются.');
  let out='';this.code=0;for(let i=0;i<pipe.length;i++){
   let part=pipe[i],target=null,append=false;const redir=this.split(part,'>');
   if(redir.length>1){if(i!==pipe.length-1)throw Error('Перенаправление поддерживается в конце конвейера.');append=redir.length===3&&redir[1]==='';target=this.tokens(redir.at(-1));if(target.length!==1)throw Error('Укажи один путь после >.');target=this.path(target[0]);part=redir[0];}
   const args=this.tokens(part);if(args[0]==='sudo')args.shift();if(!args.length)throw Error('Введи команду.');this.seen.add(args[0]);out=this.exec(args,i>0?out:null);
   if(this.code!==0)break;
   if(target){this.files[target]=(append?(this.files[target]||''):'')+out;this.perms[target]=this.perms[target]||'644';this.owner[target]=this.owner[target]||'student:student';this.events.add('write:'+target);out='';}
  }this.lastOutput=out;return {output:out,code:this.code};
 }catch(e){this.code=1;return {output:e.message,code:1};}}
 exec(a,input){const c=a[0],args=a.slice(1),s=this.state,p=args.at(-1);const fail=(t,code=1)=>{this.code=code;return t+'\n';};
  switch(c){
   case 'help':return 'Учебный shell: команды меняют только модель этой лаборатории.\nФайлы: pwd, ls, cd, cat, grep, head, tail, find, cp, mv, rm, mkdir, touch, echo, wc, edit\nДоступ: id, groups, chmod, chown, namei, getfacl\nСистема: uname, uptime, nproc, ps, top, free, vmstat, dmesg, kill, systemctl, journalctl\nДиски: df, du, lsof, lsblk, blkid, findmnt, mount, vgs, lvs, lvextend, resize2fs\nСеть: ip, ss, dig, host, nslookup, ping, curl, ufw, probe, ssh, sshd\nДоставка: apt, apt-cache, command -v, docker\nАвтоматизация: crontab, bash, tar\nПоддерживаются кавычки, |, > и >>. Это не полный Bash, Docker или Linux.\nedit /путь — открывает встроенный редактор. ↑/↓ — история, Tab — дополнение команды.\n';
   case 'pwd':return this.cwd+'\n';
   case 'whoami':return 'student\n';
   case 'uname':return 'Linux lab-server 6.8.0-linuxlab x86_64 (симулятор)\n';
   case 'hostname':return 'lab-server\n';
   case 'date':return new Date().toISOString()+'\n';
   case 'cd':{const d=this.path(p||'/home/student');if(!this.exists(d)||Object.hasOwn(this.files,d))return fail('cd: '+d+': каталог не найден');this.cwd=d;return '';}
   case 'ls':{const paths=args.filter(x=>!x.startsWith('-'));const d=this.path(paths[0]||this.cwd);if(!this.exists(d))return fail('ls: '+d+': нет такого пути');const list=Object.hasOwn(this.files,d)?[d]:[...new Set(Object.keys(this.files).filter(x=>x.startsWith(d.replace(/\/$/,'')+'/')).map(x=>d.replace(/\/$/,'')+'/'+x.slice(d.replace(/\/$/,'').length+1).split('/')[0]))];return list.map(x=>args.some(x=>x.includes('l'))?`${Object.hasOwn(this.files,x)?'-':'d'}${this.modeText(this.perms[x]||'755')} ${this.owner[x]||'root:root'}  ${this.files[x]?.length||4096} ${Object.hasOwn(this.files,d)?x:x.split('/').at(-1)}`:x.split('/').at(-1)).join('\n')+'\n';}
   case 'cat':{if(!args.length)return input||'';return args.filter(x=>!x.startsWith('-')).map(x=>this.read(x)).join('');}
   case 'grep':{let insensitive=false,invert=false,number=false;const vals=args.filter(x=>{if(x.startsWith('-')&&x!=='-'){insensitive||=x.includes('i');invert||=x.includes('v');number||=x.includes('n');return false;}return true;});if(!vals.length)return fail('grep: укажи шаблон');let source=vals.length>1?vals.slice(1).map(x=>this.read(x)).join(''):input;if(source===null||source===undefined)return fail('grep: укажи файл или передай данные через |');let re;try{re=new RegExp(vals[0],insensitive?'i':'');}catch{return fail('grep: неподдерживаемый шаблон');}const lines=source.trimEnd().split('\n').map((t,i)=>({t,i})).filter(({t})=>re.test(t)!==invert);if(!lines.length)this.code=1;return lines.map(({t,i})=>(number?(i+1)+':':'')+t).join('\n')+(lines.length?'\n':'');}
   case 'head':case 'tail':{let n=10,file=null;for(let i=0;i<args.length;i++){if(args[i]==='-n'){n=Number(args[++i]);}else if(/^-[0-9]+$/.test(args[i]))n=Number(args[i].slice(1));else if(!args[i].startsWith('-'))file=args[i];}if(!Number.isInteger(n)||n<0)return fail('Некорректное число строк');const text=file?this.read(file):input;if(text===null||text===undefined)return fail(c+': укажи файл или конвейер');const lines=text.trimEnd().split('\n');return (c==='head'?lines.slice(0,n):n?lines.slice(-n):[]).join('\n')+'\n';}
   case 'wc':{const text=input??(p&&!p.startsWith('-')?this.read(p):'');return String(text.split('\n').length-(text.endsWith('\n')?1:0))+'\n';}
   case 'find':{const dir=this.path(args[0]||'.');const ni=args.indexOf('-name');const pattern=ni>=0?args[ni+1]:'*';if(args.some(x=>['-delete','-exec'].includes(x)))return fail('Здесь find поддерживает просмотр без -delete/-exec. Используй rm после проверки списка.');const re=new RegExp('^'+pattern.split('*').map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$');if(!this.exists(dir))return fail('find: каталог не найден');return Object.keys(this.files).filter(x=>x.startsWith(dir.replace(/\/$/,'')+'/')&&re.test(x.split('/').at(-1))).join('\n')+(this.id==='inodes'&&dir==='/var/cache/app'?'\n… ещё 262140 одноразовых файлов (учебная сводка)':'')+'\n';}
   case 'echo':return args.join(' ').replace(/\$\?/g,String(this.codeBefore??0))+'\n';
   case 'touch':{if(!p)return fail('touch: укажи файл');this.files[this.path(p)]??='';return '';}
   case 'mkdir':{if(!p)return fail('mkdir: укажи каталог');this.files[this.path(p)+'/.keep']='';return '';}
   case 'cp':case 'mv':{if(args.length!==2)return fail(c+': укажи источник и назначение');const src=this.path(args[0]),dst=this.path(args[1]);this.files[dst]=this.read(src);this.perms[dst]=this.perms[src];this.owner[dst]=this.owner[src];if(c==='mv')delete this.files[src];return '';}
   case 'rm':{const targets=args.filter(x=>!x.startsWith('-'));if(targets.length!==1)return fail('rm: укажи один путь (wildcards здесь не поддерживаются)');const path=this.path(targets[0]);if(!this.exists(path))return fail('rm: путь не найден');if(path==='/var/cache/app'&&s.inodes){if(!args.some(x=>x.startsWith('-')&&x.includes('r')))return fail('rm: это каталог, нужен -r');s.inodes=false;this.events.add('cache-clean');for(const x of Object.keys(this.files))if(x.startsWith(path+'/'))delete this.files[x];return ''; }if(!Object.hasOwn(this.files,path))return fail('rm: удаление этого каталога отключено в учебной модели');delete this.files[path];this.events.add('delete:'+path);return '';}
   case 'edit':case 'nano':case 'vi':case 'vim':{if(!p||!Object.hasOwn(this.files,this.path(p)))return fail('Укажи существующий файл для редактора');this.editRequest=this.path(p);this.seen.add('read:'+this.editRequest);return 'Файл открыт во встроенном редакторе.\n';}
   case 'id':return (p==='webapp'?'uid=1001(webapp) gid=1001(webapp) groups=1001(webapp)':'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)')+'\n';
   case 'groups':return (p==='webapp'?'webapp : webapp':'student : student sudo')+'\n';
   case 'chmod':{if(args.length!==2)return fail('chmod: поддерживается chmod 640 /путь');const path=this.path(p);if(!Object.hasOwn(this.files,path))return fail('chmod: файл не найден');if(!/^[0-7]{3}$/.test(args[0]))return fail('В этой модели используй три восьмеричные цифры, например 640.');this.perms[path]=args[0];this.events.add('chmod:'+path);return '';}
   case 'chown':{if(args.length!==2||!args[0].includes(':'))return fail('chown: используй владелец:группа путь');const path=this.path(p);if(!Object.hasOwn(this.files,path))return fail('chown: файл не найден');this.owner[path]=args[0];this.events.add('chown:'+path);return '';}
   case 'namei':return 'f: '+p+'\ndrwxr-xr-x root root /\ndrwxr-xr-x root root srv\ndrwxr-x--- webapp webapp app\n-'+this.modeText(this.perms[this.path(p)]||'640')+' '+(this.owner[this.path(p)]||'webapp:webapp')+' config.env\n';
   case 'getfacl':return '# file: '+p+'\n# owner: '+(this.owner[this.path(p)]||'root:root')+'\nuser::rw-\ngroup::r--\nother::---\n';
   case 'uptime':return '10:15:00 up 3 days, 2 users, load average: '+(s.cpu?'8.12, 7.45, 5.20':'0.24, 0.32, 0.29')+'\n';
   case 'nproc':return '2\n';
   case 'ps':return 'USER       PID %CPU %MEM STAT COMMAND\nroot         1  0.0  0.2 Ss   /sbin/init\nnginx      912  0.4  1.5 S    nginx: master process\nwebapp    1240  1.0  3.2 S    /usr/local/bin/api\n'+(s.cpu?'worker    1842 198.0  8.0 R    runaway-worker\n':'');
   case 'top':case 'htop':return 'Tasks: '+(s.cpu?'104':'103')+' total, '+(s.cpu?'2':'1')+' running\n%Cpu(s): '+(s.cpu?'98.0 us, 1.0 sy, 1.0 id, 0.0 wa':'3.0 us, 1.0 sy, 96.0 id, 0.0 wa')+'\nMiB Mem: 4096 total, 310 free, 920 used, 2866 buff/cache\n'+(s.cpu?'PID 1842 runaway-worker 198.0% CPU':'Нет runaway-worker; CPU вернулся к норме')+'\n';
   case 'free':return '               total    used    free   shared  buff/cache available\nMem:           4.0Gi   0.9Gi   310Mi    50Mi      2.8Gi     2.8Gi\nSwap:          2.0Gi      0B   2.0Gi\n';
   case 'vmstat':return 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b swpd   free    buff   cache  si so   bi   bo   in   cs us sy id wa\n 1  0    0 317440  131072 2800000   0  0    1    4  120  200  3  1 96  0\n';
   case 'dmesg':return '[0.000] Linux version 6.8.0-linuxlab\n[1.320] EXT4-fs: mounted filesystem root-2026\n[2.100] systemd started\nOOM-killer events: 0\n';
   case 'iostat':return 'Device    r/s w/s  await  %util\nvda       2.0 4.0   1.2    2.0\n';
   case 'kill':{const pid=args.at(-1),sig=args.length>1?args[0]:'-TERM';if(pid==='1842'&&s.cpu){if(!['-TERM','-15','-9','-KILL'].includes(sig))return fail('Для завершения worker используй SIGTERM (kill -TERM 1842).');s.cpu=false;this.events.add(sig==='-9'||sig==='-KILL'?'cpu-force':'cpu-graceful');return sig==='-9'||sig==='-KILL'?'Процесс уничтожен. SIGKILL не дал ему выполнить очистку.\n':'SIGTERM отправлен; worker завершился корректно.\n';}if(pid==='912'&&s.disk){if(sig!=='-USR1'&&sig!=='-10')return fail('Для nginx переоткрытие логов — SIGUSR1. Не уничтожай рабочий процесс.');s.disk=false;this.events.add('logs-reopened');return 'nginx переоткрыл журналы; удалённый файл закрыт.\n';}return fail('kill: такого процесса или поддерживаемого действия нет');}
   case 'systemctl':return this.systemctl(args);
   case 'journalctl':{if(args.includes('cron'))return '10:00 cron: (backup) CMD scripts/backup.sh\n10:00 cron: scripts/backup.sh: not found\n';if(this.id==='timeline')return this.read('/var/log/app.log');if(this.id==='permissions')return 'api: open /srv/app/config.env: Permission denied\napi.service: Main process exited, status=1/FAILURE\n';if(['service','incident'].includes(this.id))return s.running?'api: listening on 0.0.0.0:8080\napi: ready\n':'api.service: Failed at step EXEC spawning /opt/old/api: No such file or directory\napi.service: status=203/EXEC\n';return this.read('/var/log/app.log');}
   case 'df':{if(!s.disk&&this.events.has('logs-reopened'))this.events.add('disk-verified');if(!s.inodes&&this.events.has('cache-clean')&&args.includes('-i'))this.events.add('inodes-verified');if(s.fs>=15)this.events.add('fs-verified');if(args.some(x=>x.includes('i')))return 'Filesystem     Inodes IUsed IFree IUse% Mounted on\n/dev/vda1     262144 '+(s.inodes?'262144 0 100%':'50000 212144 20%')+' /\n';return 'Filesystem                Size Used Avail Use% Mounted on\n/dev/vda1                  40G '+(s.disk?'39G 1G 98%':'16G 24G 40%')+' /\n'+(s.mounted?'/dev/vg_data/lv_app        '+s.fs+'G 8G '+(s.fs-8)+'G '+Math.round(800/s.fs)+'% /data\n':'');}
   case 'du':return '180M /var/log\n20M /var/cache/app\n';
   case 'lsof':return s.disk?'COMMAND PID USER FD TYPE DEVICE SIZE/OFF NLINK NAME\nnginx 912 nginx 5w REG 252,1 24696061952 0 /var/log/nginx/access.log (deleted)\n':'COMMAND PID USER FD TYPE NAME\napi 1240 webapp 3u IPv4 TCP *:8080 (LISTEN)\n';
   case 'lsblk':return 'NAME                 FSTYPE UUID       SIZE MOUNTPOINT\nvda                                      40G\n└─vda1               ext4   root-2026     40G /\nvdb                  LVM2_member         30G\n└─vg_data-lv_app      ext4   data-2026     '+s.lv+'G '+(s.mounted?'/data':'')+'\n';
   case 'blkid':return '/dev/vda1: UUID="root-2026" TYPE="ext4"\n/dev/vg_data/lv_app: UUID="data-2026" TYPE="ext4"\n';
   case 'findmnt':{if(this.files['/etc/fstab'].includes('wrong-data'))return fail('/data: UUID=wrong-data: источник не найден');this.events.add('fstab-valid');return 'Success, no errors or warnings detected\n';}
   case 'mount':{if(!args.includes('-a'))return '/dev/vda1 on / type ext4 (rw,relatime)\n';if(this.files['/etc/fstab'].includes('wrong-data')||!this.files['/etc/fstab'].includes('UUID=data-2026 /data ext4'))return fail('mount: /data: не найден корректный UUID в fstab');s.mounted=true;this.events.add('mounted');return '';}
   case 'vgs':case 'vgdisplay':return 'VG       #PV #LV Attr   VSize VFree\nvg_data    1   1 wz--n-  30G '+(30-s.lv)+'G\n';
   case 'lvs':case 'lvdisplay':return 'LV     VG      Attr       LSize\nlv_app vg_data -wi-ao---- '+s.lv+'G\n';
   case 'lvextend':{if(p!=='/dev/vg_data/lv_app')return fail('lvextend: укажи /dev/vg_data/lv_app');if(!args.includes('+5G'))return fail('В этом стенде поддерживается увеличение на +5G через -L +5G');if(s.lv+5>30)return fail('Недостаточно свободного места VG');s.lv+=5;this.events.add('lv-extended');if(args.includes('-r')){s.fs=s.lv;this.events.add('fs-grown');}return 'Logical volume lv_app successfully resized to '+s.lv+' GiB.\n';}
   case 'resize2fs':{if(p!=='/dev/vg_data/lv_app')return fail('resize2fs: неверное устройство');if(s.lv===s.fs)return 'Nothing to do!\n';s.fs=s.lv;this.events.add('fs-grown');return 'The filesystem is now '+s.fs+' GiB.\n';}
   case 'mkfs':case 'mkfs.ext4':case 'mkfs.xfs':return fail('Форматирование уничтожило бы данные. В этой лаборатории нужно сохранить существующую ФС.');
   case 'ip':{if(args[0]==='route'){if(args[1]==='add'){if(args.join(' ')==='route add default via 10.0.0.1'){s.route=true;this.events.add('route-fixed');return '';}return fail('Учебный шлюз — 10.0.0.1.');}return (s.route?'default via 10.0.0.1 dev eth0\n':'')+'10.0.0.0/24 dev eth0 proto kernel src 10.0.0.20\n';}return '1: lo: <LOOPBACK,UP> inet 127.0.0.1/8\n2: eth0: <BROADCAST,UP> inet 10.0.0.20/24\n';}
   case 'ss':case 'netstat':return 'Netid State  Local Address:Port Peer Address:Port Process\ntcp LISTEN 0.0.0.0:22 0.0.0.0:* sshd\n'+(s.running?'tcp LISTEN '+(s.bound?'0.0.0.0':'127.0.0.1')+':8080 0.0.0.0:* api\n':'');
   case 'dig':case 'host':case 'nslookup':return s.dns?'api.internal. 60 IN A 10.0.0.20\nSERVER: 10.0.0.53#53\n':fail(';; communications error to 10.0.0.99#53: timed out; no servers could be reached',9);
   case 'ping':{if(!s.route&&p==='203.0.113.10')return fail('connect: Network is unreachable',2);if(p?.includes('internal')&&!s.dns)return fail('Temporary failure in name resolution',2);this.events.add('ping-ok');return '3 packets transmitted, 3 received, 0% packet loss\n';}
   case 'curl':{if(!s.curl)return fail('curl: command not found',127);const url=args.find(x=>/^https?:/.test(x));if(!url)return fail('curl: укажи http://адрес:порт/путь');if(url.includes('api.internal')&&!s.dns)return fail('curl: (6) Could not resolve host: api.internal',6);if(url.includes(':9100/metrics'))return '# TYPE node_memory_MemAvailable_bytes gauge\nnode_memory_MemAvailable_bytes 3006477107\n';if(this.id==='docker'){if(!s.docker||!s.dockerPort)return fail('curl: (7) Failed to connect to localhost port 8080',7);}else if(!s.running)return fail('curl: (7) Failed to connect: Connection refused',7);if(!s.bound&&url.includes('10.0.0.20'))return fail('curl: (7) Connection refused on 10.0.0.20',7);this.events.add('http-ok');if(url.includes('api.internal'))this.events.add('http-name-ok');if(url.includes('10.0.0.20'))this.events.add('http-ip-ok');return 'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"status":"ok","database":"connected"}\n';}
   case 'ufw':{if(args[0]==='status')return 'Status: active\nDefault: deny (incoming), allow (outgoing)\n22/tcp ALLOW 10.0.0.0/24\n'+(s.firewall?'8080/tcp ALLOW 10.0.0.0/24\n':'')+(s.wide?'8080/tcp ALLOW Anywhere\n':'');if(args.join(' ')==='allow from 10.0.0.0/24 to any port 8080 proto tcp'){s.firewall=true;return 'Rule added\n';}if(args[0]==='allow'&&args[1]?.startsWith('8080')){s.wide=true;return 'Rule added. Внимание: теперь API открыт всем источникам.\n';}if(args[0]==='delete'&&args[1]==='allow'&&args[2]?.startsWith('8080')){s.wide=false;return 'Rule deleted\n';}if(args[0]==='disable')return fail('Отключение защиты не решает задачу минимального доступа.');return fail('Используй узкое правило: ufw allow from СЕТЬ to any port ПОРТ proto tcp');}
   case 'probe':{if(args[0]==='internal'){if(!s.firewall&&!s.wide)return fail('Internal client: timeout (firewall)');this.events.add('probe-internal');return 'Internal client 10.0.0.15 → HTTP 200\n';}if(args[0]==='external'){if(s.wide)return fail('External client 198.51.100.7 → HTTP 200: доступ слишком широкий');this.events.add('probe-external');return 'External client 198.51.100.7 → BLOCKED, ожидаемый запрет\n';}return fail('probe internal или probe external — учебные сетевые клиенты');}
   case 'ssh':{const mode=this.perms['/home/student/.ssh/id_ed25519'];if(mode!=='600'&&mode!=='400')return fail('WARNING: UNPROTECTED PRIVATE KEY FILE!\nPermissions '+mode+' for id_ed25519 are too open.\nThis private key will be ignored.');if(this.id==='hardening'&&!this.events.has('sshd-applied'))return fail('Новую конфигурацию SSH ещё не применили.');this.events.add('ssh-ok');return 'Authenticated to web1 using publickey.\nУчебная проверка пройдена; shell остаётся на lab-server.\n';}
   case 'sshd':{if(!args.includes('-t')&&!args.includes('-T'))return fail('Используй sshd -t или sshd -T');const text=this.files['/etc/ssh/sshd_config'];if(!this.sshValid())return fail('sshd_config: некорректная конфигурация. Проверь Port и yes/no директивы.');this.events.add('sshd-valid');return args.includes('-T')?text:'';}
   case 'command':{if(args[0]==='-v'){if(args[1]==='curl'&&!s.curl)return fail('',1);return '/usr/bin/'+args[1]+'\n';}return fail('command -v имя');}
   case 'apt-cache':return 'curl:\n  Installed: '+(s.curl?'8.5.0':'(none)')+'\n  Candidate: 8.5.0\n  Trusted Ubuntu package repository\n';
   case 'apt':case 'apt-get':{if(args[0]==='update'){s.apt=true;return 'Package lists updated. Repository signatures verified (учебная модель).\n';}if(args[0]==='install'&&args.includes('curl')){if(!s.apt)return fail('Сначала обнови индекс: apt update');s.curl=true;this.events.add('curl-installed');return 'curl installed from trusted repository.\n';}return fail('В этом стенде поддерживаются apt update и apt install curl.');}
   case 'docker':{if(args[0]==='ps')return 'CONTAINER ID  IMAGE       STATUS        PORTS          NAMES\n'+(s.docker?'c0ffee12      nginx:1.27  Up 5 minutes  '+(s.dockerPort?'0.0.0.0:8080->80/tcp':'80/tcp')+'  web\n':'');if(args[0]==='inspect')return JSON.stringify({Name:'web',State:{Running:s.docker},HostConfig:{PortBindings:s.dockerPort?{'80/tcp':[{HostPort:'8080'}]}:{}}},null,2)+'\n';if(args[0]==='logs')return 'nginx: configuration test successful\nnginx: ready, listening on :80\n';if(args[0]==='rm'&&args.includes('web')){s.docker=false;s.dockerPort=false;return 'web\n';}if(args[0]==='run'){if(s.docker)return fail('Conflict: name web is already in use');if(!args.includes('8080:80')||!args.includes('--name')||!args.includes('web'))return fail('В этой лаборатории нужен web с -p 8080:80');s.docker=true;s.dockerPort=true;this.events.add('docker-published');return 'c0ffee12web\n';}return fail('Поддерживаются docker ps, inspect, logs, rm, run.');}
   case 'crontab':return args.includes('-l')?this.read('/etc/cron.d/backup'):fail('Открой /etc/cron.d/backup через edit.');
   case 'bash':{if(p!=='/opt/scripts/backup.sh')return fail('В стенде исполняется только учебный /opt/scripts/backup.sh. Произвольный Bash не выполняется.');const text=this.files[p];if(!text.includes('mysqldump')||!text.includes('gzip'))return fail('Сохрани исходную операцию mysqldump | gzip.');if(this.id==='pipefail'){if(/^\s*set\s+(?:-o\s+pipefail|-euo\s+pipefail)\s*$/m.test(text)){this.events.add('pipefail-detected');return fail('mysqldump: access denied\nBackup failed: pipeline exit status 1');}return 'mysqldump: access denied\nBackup completed successfully (ложный успех: gzip завершился с 0)\n';}this.events.add('backup-ok');return 'Backup completed successfully. Test archive created (учебная модель).\n';}
   case 'tar':{if(!args.includes('/backup/app.tar.gz'))return fail('В стенде есть архив /backup/app.tar.gz');if(args.some(x=>x.includes('t')&&x.startsWith('-'))){this.events.add('archive-inspected');return 'config.env\n';}if(args.some(x=>x.includes('x')&&x.startsWith('-'))&&args[args.indexOf('-C')+1]==='/srv/app'){this.files['/srv/app/config.env']='DATABASE_URL=postgres://db.internal/app\n';this.events.add('restored');return 'config.env restored to /srv/app\n';}return fail('Сначала tar -tzf архив; для восстановления tar -xzf архив -C /srv/app.');}
   case 'sysctl':return 'fs.file-max = 9223372036854775807\nvm.swappiness = 60\n';
   case 'ulimit':return '1024\n';
   case 'clear':return '\u0000CLEAR';
   case 'man':return 'Краткая справка по '+(p||'командам')+': открой вкладку «База знаний» или введи help. Полные man pages доступны в настоящем Linux.\n';
   default:return fail(c+': команда не реализована в симуляторе. help — список поддерживаемых команд. Это не ошибка Linux.',127);
  }
 }
 systemctl(a){const s=this.state,action=a[0],service=a.find((x,i)=>i>0&&!x.startsWith('-'))?.replace(/\.service$/,'');const err=t=>{this.code=1;return t+'\n';};
  if(action==='daemon-reload'){s.reloaded=true;this.events.add('daemon-reloaded');return '';}
  if(action==='list-units'||action==='list-unit-files')return 'api.service '+(s.running?'loaded active running':'loaded failed failed')+'\nsshd.service loaded active running\n';
  if(action==='list-timers')return 'NEXT                 UNIT          ACTIVATES\nTomorrow 02:00:00     backup.timer  backup.service\n';
  if(action==='status'){if(!s.running)this.code=3;return '● '+(service||'api')+'.service — Training service\n   Active: '+(s.running?'active (running)':'failed')+'\n   User: webapp\n   '+(!s.running&&['service','incident'].includes(this.id)?'Process: ExecStart=/opt/old/api (code=exited, status=203/EXEC)':'Main PID: 1240')+'\n';}
  if(action==='cat')return this.read('/etc/systemd/system/api.service');
  if(action==='show')return 'LimitNOFILE=1024\n';
  if(action==='is-active'){if(!s.running)this.code=3;return s.running?'active\n':'failed\n';}
  if(action==='reload'&&service==='sshd'){if(!this.sshValid())return err('Invalid sshd configuration');if(!this.events.has('sshd-valid'))return err('Сначала проверь текущую конфигурацию: sshd -t');this.events.add('sshd-applied');return '';}
  if(['start','restart','reload'].includes(action)||(action==='enable'&&a.includes('--now'))){
   if(service!=='api')return err('В этой лаборатории управляй api или reload sshd.');
   if(!s.reloaded)return err('Unit changed on disk. Run systemctl daemon-reload first.');
   const config=this.files['/etc/systemd/system/api.service']||'';
   if(!/^ExecStart=\/usr\/local\/bin\/api\s*$/m.test(config)){s.running=false;return err('Job failed: status=203/EXEC — неверный ExecStart.');}
   if(s.disk){s.running=false;return err('api: No space left on device');}
   const mode=this.perms['/srv/app/config.env']||'000',owner=this.owner['/srv/app/config.env']||'';
   if(this.id==='permissions'&&!this.canReadConfig()){s.running=false;return err('api: Permission denied reading config.env');}
   if(!this.files['/srv/app/config.env']?.includes('DATABASE_URL=')){s.running=false;return err('api: missing DATABASE_URL');}
   const bind=this.files['/etc/api.conf']||'';if(!/^listen=(0\.0\.0\.0|127\.0\.0\.1):8080\s*$/m.test(bind))return err('api: invalid listen directive');s.bound=bind.includes('listen=0.0.0.0:8080');s.running=true;this.events.add('api-restarted');return '';}
  if(action==='stop'&&service==='api'){s.running=false;return '';}
  if(action==='enable'){this.events.add('enabled');return 'Created symlink for autostart (не означает запуск сейчас).\n';}
  return err('Поддерживаются status, cat, start, restart, reload, daemon-reload, enable, is-active, list-units, list-timers.');
 }
 sshValid(){const t=this.files['/etc/ssh/sshd_config']||'';const lines=t.split('\n').map(x=>x.trim()).filter(x=>x&&!x.startsWith('#'));return lines.every(x=>/^(Port\s+(22|2222)|PermitRootLogin\s+(yes|no|prohibit-password)|PasswordAuthentication\s+(yes|no)|PubkeyAuthentication\s+(yes|no)|MaxAuthTries\s+\d+)\s*$/.test(x))&&/^PubkeyAuthentication\s+yes\s*$/m.test(t);}
 canReadConfig(){const [user,group]=(this.owner['/srv/app/config.env']||'root:root').split(':');const mode=this.perms['/srv/app/config.env']||'000';return Boolean(Number(mode[user==='webapp'?0:group==='webapp'?1:2])&4);}
 modeText(mode){return mode.split('').map(n=>{const v=Number(n);return (v&4?'r':'-')+(v&2?'w':'-')+(v&1?'x':'-');}).join('');}
 checks(){const s=this.state,e=this.events,r=this.seen,has=(...x)=>x.every(y=>r.has(y)),read=p=>r.has('read:'+p),all=this.files;switch(this.id){
  case 'first-evidence':return [has('ls'),has('grep')&&read('/var/log/app.log'),has('grep')&&read('/var/log/app.log')];
  case 'pipeline':return [has('grep','tail'),all['/tmp/errors.txt']==='10:07 ERROR startup failed: configuration incomplete\n10:08 ERROR readiness probe failed\n',all['/var/log/app.log']===this.originalLog&&e.has('write:/tmp/errors.txt')];
  case 'permissions':{const mode=this.perms['/srv/app/config.env'];return [has('ls','id'),this.canReadConfig()&&['0','4','6'].includes(mode[0])&&['0','4'].includes(mode[1])&&mode[2]==='0',s.running&&e.has('http-ok')];}
  case 'ssh-key':return [has('ssh','ls'),['400','600'].includes(this.perms['/home/student/.ssh/id_ed25519']),e.has('ssh-ok')];
  case 'cpu':return [has('uptime','ps','top'),e.has('cpu-graceful')&&!e.has('cpu-force'),!s.cpu&&this.history.filter(x=>/^top$/.test(x.trim())).length>1];
  case 'memory':return [has('free'),has('vmstat'),has('dmesg')];
  case 'service':return [has('systemctl','journalctl'),/^ExecStart=\/usr\/local\/bin\/api\s*$/m.test(all['/etc/systemd/system/api.service'])&&s.reloaded&&e.has('daemon-reloaded'),s.running&&e.has('http-ok')];
  case 'boot':return [has('blkid')&&read('/etc/fstab'),!all['/etc/fstab'].includes('wrong-data')&&e.has('fstab-valid'),s.mounted&&e.has('mounted')];
  case 'disk':return [has('df','du'),has('lsof'),!s.disk&&e.has('disk-verified')];
  case 'inodes':return [this.history.some(x=>x.includes('df -h'))&&this.history.some(x=>x.includes('df -i')),has('find'),!s.inodes&&e.has('inodes-verified')];
  case 'lvm':return [has('lsblk','vgs','lvs'),s.lv>=15&&e.has('lv-extended'),s.fs>=15&&e.has('fs-grown')&&e.has('fs-verified')];
  case 'dns':return [has('curl','dig'),read('/etc/resolv.conf'),s.dns&&e.has('http-name-ok')];
  case 'bind':return [has('ss'),s.bound&&e.has('edit:/etc/api.conf')&&e.has('api-restarted'),e.has('http-ip-ok')];
  case 'route':return [this.history.some(x=>x==='ip addr')&&this.history.some(x=>x==='ip route'),s.route&&e.has('route-fixed'),e.has('ping-ok')];
  case 'hardening':{const t=all['/etc/ssh/sshd_config'];return [read('/etc/ssh/sshd_config'),/^PermitRootLogin\s+no\s*$/m.test(t)&&/^PasswordAuthentication\s+no\s*$/m.test(t)&&/^PubkeyAuthentication\s+yes\s*$/m.test(t),e.has('sshd-valid')&&e.has('sshd-applied')&&e.has('ssh-ok')];}
  case 'firewall':return [has('ss','ufw'),s.firewall&&!s.wide,e.has('probe-internal')&&e.has('probe-external')&&!s.wide];
  case 'packages':return [has('command'),s.apt&&e.has('curl-installed'),e.has('http-ok')];
  case 'docker':return [this.history.some(x=>x==='docker ps')&&this.history.some(x=>x==='docker inspect web'),s.docker&&s.dockerPort,e.has('http-ok')];
  case 'timeline':return [has('journalctl'),read('/etc/api.conf'),has('journalctl')&&read('/etc/api.conf')];
  case 'cron':return [read('/etc/cron.d/backup')&&has('journalctl'),/^0 2 \* \* \* backup \/opt\/scripts\/backup\.sh\s*$/m.test(all['/etc/cron.d/backup']),e.has('backup-ok')];
  case 'pipefail':return [read('/opt/scripts/backup.sh'),/^\s*set\s+(?:-o\s+pipefail|-euo\s+pipefail)\s*$/m.test(all['/opt/scripts/backup.sh']),e.has('pipefail-detected')&&this.history.some(x=>x==='echo $?')];
  case 'restore':return [e.has('archive-inspected'),e.has('restored'),s.running&&e.has('http-ok')];
  case 'incident':return [has('journalctl','df','dig'),!s.disk&&s.reloaded&&s.running&&e.has('logs-reopened'),s.dns&&e.has('http-name-ok')];
  default:return [false,false,false];
 }}
 snapshot(){return {id:this.id,cwd:this.cwd,history:this.history,seen:[...this.seen],events:[...this.events],code:this.code,commandCount:this.commandCount,hints:this.hints,files:this.files,perms:this.perms,owner:this.owner,state:this.state,originalLog:this.originalLog};}
 static restore(data){const lab=new LinuxLab(data.id);for(const k of ['cwd','history','code','commandCount','hints','files','perms','owner','state','originalLog'])if(data[k]!==undefined)lab[k]=data[k];lab.seen=new Set(data.seen);lab.events=new Set(data.events);return lab;}
}
/* Preserve the previous command status for echo $?. */
const originalRun=LinuxLab.prototype.run;
LinuxLab.prototype.run=function(raw){this.codeBefore=this.code;return originalRun.call(this,raw);};
if(typeof module!=='undefined')module.exports={LinuxLab};

