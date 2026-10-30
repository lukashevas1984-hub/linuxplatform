/* Deliberately limited text processing over the virtual filesystem; never eval or OS execution. */
const TextTools = (() => {
 const lines=s=>s===''?[]:s.split('\n').slice(0,s.endsWith('\n')?-1:undefined);
 const emit=a=>a.length?a.join('\n')+'\n':'';
 const names=new Set('awk cut sort uniq sed tee diff wc type command grep'.split(' '));
 function exec(lab,c,args,input){
  const bad=t=>{lab.code=2;return c+': '+t+'\n';};
  const source=(files)=>files.length?files.map(p=>lab.read(p)).join(''):(input??(()=>{throw Error('нужен файл или поток через |');})());
  try{switch(c){
   case 'type':case 'command': {
    if(c==='command'&&(args.length!==2||args[0]!=='-v'))return bad('поддерживается command -v имя');
    const name=c==='command'?args[1]:args[0];if(!name||c==='type'&&args.length!==1)return bad('укажи одно имя');
    const builtins=['cd','pwd','echo','type','command','help'];
    const known=('cat ls grep head tail find cp mv rm mkdir touch wc edit id groups chmod chown namei getfacl uname hostname date uptime nproc ps top free vmstat dmesg kill systemctl journalctl df du lsof lsblk blkid findmnt mount vgs lvs lvextend resize2fs ip ss dig host nslookup ping curl ufw probe ssh sshd apt apt-cache docker crontab bash tar awk cut sort uniq sed tee diff').split(' ');
    if(builtins.includes(name))return c==='type'?name+' is a shell builtin\n':name+'\n';
    if(!known.includes(name)||(name==='curl'&&!lab.state.curl)){lab.code=1;return c==='type'?name+': not found\n':'';}
    return c==='type'?name+' is /usr/bin/'+name+'\n':'/usr/bin/'+name+'\n';
   }
   case 'grep': {
    const flags=args.filter(a=>a.startsWith('-'));if(flags.some(a=>!/^-[EinvF]+$/.test(a)))return bad('поддерживаются -E -F -i -n -v');
    const vals=args.filter(a=>!a.startsWith('-'));if(!vals.length)return bad('нужен шаблон');const fixed=flags.some(a=>a.includes('F')),ignore=flags.some(a=>a.includes('i')),invert=flags.some(a=>a.includes('v')),number=flags.some(a=>a.includes('n'));
    let re;if(!fixed)re=new RegExp(vals[0],ignore?'i':'');let needle=ignore?vals[0].toLowerCase():vals[0];const rows=lines(source(vals.slice(1))).map((t,i)=>({t,i})).filter(({t})=>(fixed?(ignore?t.toLowerCase():t).includes(needle):re.test(t))!==invert);if(!rows.length)lab.code=1;
    return emit(rows.map(({t,i})=>(number?(i+1)+':':'')+t));
   }
   case 'awk': {
    let sep=null;if(args[0]==='-F'){sep=args[1];args=args.slice(2);}else if(args[0]?.startsWith('-F')){sep=args[0].slice(2);args=args.slice(1);}if(sep!==null&&(!sep||sep.length!==1))return bad('-F принимает один буквальный разделитель');
    const program=args[0]||'',m=program.match(/^\s*(?:\$(\d+)\s*(>=|<=|==|!=|>|<)\s*(-?\d+(?:\.\d+)?)\s*)?\{\s*print\s+\$(\d+)\s*\}\s*$/);if(!m)return bad('только {print $N} и $N >= число {print $M}; это не полный AWK');
    const field=Number(m[4]);return emit(lines(source(args.slice(1))).filter(line=>{if(!m[1])return true;const fields=sep?line.split(sep):line.trim().split(/\s+/),v=Number(fields[Number(m[1])-1]||0),n=Number(m[3]);return ({'>=':v>=n,'<=':v<=n,'==':v===n,'!=':v!==n,'>':v>n,'<':v<n})[m[2]];}).map(line=>field===0?line:(sep?line.split(sep):line.trim().split(/\s+/))[field-1]||''));
   }
   case 'cut': {
    let delim='\t',spec,files=[];for(let i=0;i<args.length;i++){let a=args[i];if(a==='-d')delim=args[++i];else if(a.startsWith('-d'))delim=a.slice(2);else if(a==='-f')spec=args[++i];else if(a.startsWith('-f'))spec=a.slice(2);else if(a.startsWith('-'))return bad('только -d и -f');else files.push(a);}
    if(!spec||!/^\d+(?:-\d+)?(?:,\d+(?:-\d+)?)*$/.test(spec)||delim?.length!==1)return bad('нужны поля -f1,3 или -f1-3 и один разделитель');const wanted=new Set();for(const part of spec.split(',')){const [start,end=start]=part.split('-').map(Number);if(start<1||end<start||end>10000)return bad('неверные номера полей');for(let n=start;n<=end;n++)wanted.add(n);}
    return emit(lines(source(files)).map(t=>t.includes(delim)?t.split(delim).filter((_,i)=>wanted.has(i+1)).join(delim):t));
   }
   case 'sort': {
    const flags=args.filter(a=>a.startsWith('-'));if(flags.some(a=>!/^-[nru]+$/.test(a)))return bad('только -n -r -u');const options=flags.join(''),numeric=options.includes('n'),reverse=options.includes('r');let a=lines(source(args.filter(a=>!a.startsWith('-')))).sort((a,b)=>{let d=numeric?(parseFloat(a)||0)-(parseFloat(b)||0):0;return (d||(a<b?-1:a>b?1:0))*(reverse?-1:1);});if(options.includes('u'))a=a.filter((v,i)=>!i||v!==a[i-1]);return emit(a);
   }
   case 'uniq': {
    if(args.some(a=>a.startsWith('-')&&a!=='-c'))return bad('только -c');let rows=[];for(const value of lines(source(args.filter(a=>a!=='-c')))){let last=rows.at(-1);if(last&&last.value===value)last.n++;else rows.push({value,n:1});}return emit(rows.map(r=>args.includes('-c')?String(r.n).padStart(7)+' '+r.value:r.value));
   }
   case 'sed': {
    if(args.some(a=>a.startsWith('-i')))return bad('-i отключён: создавай отдельный кандидат через >');const quiet=args[0]==='-n';if(quiet)args=args.slice(1);const program=args[0]||'',text=source(args.slice(1));if(quiet){const m=program.match(/^(\d+)(?:,(\d+))?p$/);if(!m||Number(m[1])<1||Number(m[2]||m[1])<Number(m[1]))return bad('с -n поддерживается N,Mp');return emit(lines(text).slice(Number(m[1])-1,Number(m[2]||m[1])));}
    const m=program.match(/^s([^\w\s\\])((?:\\.|(?!\1).)*)\1((?:\\.|(?!\1).)*)\1(g?)$/);if(!m)return bad('только s/шаблон/замена/ с необязательным g');
    const pattern=m[2].replaceAll('\\'+m[1],m[1]),replacement=m[3].replaceAll('\\'+m[1],m[1]);if(/\\[1-9]|\(\?/.test(pattern)||/\\[1-9]/.test(replacement))return bad('группы и ссылки не поддерживаются');const re=new RegExp(pattern,m[4]);return emit(lines(text).map(t=>t.replace(re,()=>replacement)));
   }
   case 'tee': {
    if(args.some(a=>a.startsWith('-')&&a!=='-a'))return bad('только -a');const files=args.filter(a=>a!=='-a');if(!files.length)return bad('укажи файл');const text=input??'';for(const file of files){const path=lab.path(file);lab.files[path]=(args.includes('-a')?lab.files[path]||'':'')+text;lab.events.add('write:'+path);}return text;
   }
   case 'wc': {if(args[0]!=='-l')return bad('поддерживается wc -l');const text=source(args.slice(1));return String((text.match(/\n/g)||[]).length)+'\n';}
   case 'diff': {
    const files=args.filter(a=>a!=='-u');if(files.length!==2||files.some(a=>a.startsWith('-')))return bad('используй diff -u файл1 файл2');const [a,b]=files.map(p=>lab.path(p));const x=lab.read(a),y=lab.read(b);if(lines(x).length>1000||lines(y).length>1000)return bad('до 1000 строк');lab.events.add('diff:'+a+':'+b);lab.code=x===y?0:1;lab.lastDiff={a,b,code:lab.code};if(x===y)return '';return '--- '+a+'\n+++ '+b+'\n@@ -1,'+lines(x).length+' +1,'+lines(y).length+' @@\n'+emit(lines(x).map(t=>'-'+t))+emit(lines(y).map(t=>'+'+t));
   }
  }}catch(e){return bad(e.message);}return bad('операция не поддерживается');
 }
 return {exec,names};
})();
const LinuxTextTools=TextTools;
if(typeof module!=='undefined')module.exports={TextTools,LinuxTextTools};
