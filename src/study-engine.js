/* Extend the extracted simulator without replacing existing labs. */
const extraFiles={
 '/home/student/samples/states.txt':'INFO started\nWARN retry\nERROR config missing\nINFO completed\n',
 '/var/log/requests.log':'10.0.0.31 /health 200\n10.0.0.32 /orders 503\n10.0.0.31 /orders 500\n10.0.0.33 /health 200\n10.0.0.32 /orders 503\n',
 '/etc/training-app.conf':'port=8080\ndebug=true\nworkers=4\n',
 '/proc/1240/status':'Name:\tapi\nState:\tS (sleeping)\nPid:\t1240\nPPid:\t1\nVmRSS:\t65536 kB\nThreads:\t4\n',
 '/proc/1240/limits':'Limit                     Soft Limit  Hard Limit\nMax open files            1024        1024\n',
 '/proc/pressure/io':'some avg10=12.50 avg60=4.10 avg300=1.20 total=1250000\nfull avg10=2.00 avg60=0.50 avg300=0.10 total=200000\n',
 '/sys/fs/cgroup/training-api/memory.current':'125829120\n',
 '/sys/fs/cgroup/training-api/memory.max':'134217728\n',
 '/sys/fs/cgroup/training-api/memory.events':'low 0\nhigh 0\nmax 0\noom 0\noom_kill 0\n'
};
const baseSeed=LinuxLab.prototype.seed;
LinuxLab.prototype.seed=function(){baseSeed.call(this);for(const [p,t] of Object.entries(extraFiles)){this.files[p]=t;this.perms[p]='644';this.owner[p]='root:root';}};
const baseExec=LinuxLab.prototype.exec;
LinuxLab.prototype.exec=function(a,input){if(TextTools.names.has(a[0]))return TextTools.exec(this,a[0],a.slice(1),input);let out=baseExec.call(this,a,input);if(a[0]==='help')out+='Дополнительно: type, command -v; awk {print $N}, числовой фильтр; cut -d -f; sort -n -r -u; uniq -c; sed s/old/new/g или -n N,Mp (без -i); tee -a; diff -u (до 1000 строк); wc -l.\nНет полного Bash, AWK, TLS, rsync, RAID или настоящих namespaces.\n';return out;};
const baseChecks=LinuxLab.prototype.checks;
LinuxLab.prototype.checks=function(){
 if(this.id==='http-summary'){
  const text=this.files['/tmp/http-statuses.txt']||'',rows=text.trim().split('\n').map(t=>t.trim().split(/\s+/)),counts=new Map(rows.map(r=>[r[1],Number(r[0])])),valid=rows.length===3&&counts.size===3&&counts.get('200')===2&&counts.get('500')===1&&counts.get('503')===2;
  return [this.seen.has('read:/var/log/requests.log'),valid,this.seen.has('read:/tmp/http-statuses.txt')&&this.files['/var/log/requests.log']===extraFiles['/var/log/requests.log']];
 }
 if(this.id==='config-proposal')return [this.seen.has('read:/etc/training-app.conf'),this.files['/tmp/training-app.conf']==='port=8080\ndebug=false\nworkers=4\n'&&this.files['/etc/training-app.conf']===extraFiles['/etc/training-app.conf'],this.events.has('diff:/etc/training-app.conf:/tmp/training-app.conf')&&this.lastDiff?.code===1];
 return baseChecks.call(this);
};
const baseSnapshot=LinuxLab.prototype.snapshot;
LinuxLab.prototype.snapshot=function(){return {...baseSnapshot.call(this),lastDiff:this.lastDiff};};
const baseRestore=LinuxLab.restore;
LinuxLab.restore=function(s){const lab=baseRestore(s);lab.lastDiff=s.lastDiff;return lab;};
function practiceAccept(lab,key,command,result){
 const steps=INTRO_DRILLS[key]||GUIDES[key]?.steps,step=steps?.[lab.practiceIndex??0];
 return !!step&&practiceStepAccept(lab,step,command,result);
}
function practiceStepAccept(lab,step,command,result){
 const normalized=c=>lab.tokens(c).join('\u0001');
 return normalized(command)===normalized(step.command)&&result.code===(step.code||0)&&(!step.contains||result.output.includes(step.contains))&&(!step.file||lab.files[step.file]===step.content);
}
if(typeof module!=='undefined')module.exports={LinuxLab,practiceStepAccept,extraFiles};
