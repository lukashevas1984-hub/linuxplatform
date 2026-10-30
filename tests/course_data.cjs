const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function load(){const c={console,structuredClone};vm.createContext(c);for(const name of ['course','curriculum','cheatsheet-lessons','text-tools','engine','study-engine'])vm.runInContext(fs.readFileSync(path.join(__dirname,'../src/'+name+'.js'),'utf8'),c,{filename:name+'.js'});vm.runInContext('globalThis.api={COURSE,ALL_LABS,TEACHING,INTRO_DRILLS,GUIDES,UNIT_BY_ID,LinuxLab,practiceStepAccept,TextTools,extraFiles}',c);return c.api;}
module.exports={load};
