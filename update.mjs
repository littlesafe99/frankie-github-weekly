import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {parseTrending,taipeiDate,monday} from './parser.mjs';
const filename=new URL('./data/snapshots.json',import.meta.url);
let snapshots;
try{snapshots=JSON.parse(await readFile(filename,'utf8'))}catch(e){if(e.code!=='ENOENT')throw e;snapshots=[]}
const date=taipeiDate(),week=monday(date);
async function status(){await mkdir(new URL('./data/',import.meta.url),{recursive:true});await writeFile(new URL('./data/status.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),lastSnapshotAt:snapshots[0]?.capturedAt||null,snapshots:snapshots.length},null,2)+'\n')}
if(snapshots.some(s=>monday(s.date)===week)){await status();console.log('This week is already saved; no snapshot changes.');process.exit(0)}
const response=await fetch('https://github.com/trending?since=weekly',{headers:{'User-Agent':'FrankieNotesWeekly/2.0','Accept':'text/html'},signal:AbortSignal.timeout(25000)});
if(!response.ok)throw Error(`GitHub Trending HTTP ${response.status}`);
const snapshot={date,capturedAt:new Date().toISOString(),source:'https://github.com/trending?since=weekly',kind:'live',repos:parseTrending(await response.text())};
snapshots.push(snapshot);snapshots.sort((a,b)=>b.date.localeCompare(a.date));
await mkdir(new URL('./data/',import.meta.url),{recursive:true});
await writeFile(filename,JSON.stringify(snapshots,null,2)+'\n');
const saved=JSON.parse(await readFile(filename,'utf8'));
if(saved[0].date!==date||saved[0].repos.length!==10)throw Error('Saved data verification failed');
await status();
console.log(`Saved ${date}: ten repositories; ${saved.length} snapshots total.`);
