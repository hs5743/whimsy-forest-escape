const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const S=require('../scene-music.js');
function fixture(support=true){
 const timers=new Map(),nodes=[],listeners={},storage=new Map();let id=0;
 const param=()=>({value:1,calls:[],setValueAtTime(v,t){this.value=v;this.calls.push(['set',v,t]);},linearRampToValueAtTime(v,t){this.calls.push(['ramp',v,t]);},exponentialRampToValueAtTime(v,t){this.calls.push(['exp',v,t]);},setTargetAtTime(v,t){this.value=v;this.calls.push(['target',v,t]);},cancelScheduledValues(){}});
 const node=()=>{const n={gain:param(),frequency:param(),detune:param(),pan:param(),connect(){},disconnect(){this.disconnected=true;},start(t){this.started=t;},stop(t){this.stopped=t;},type:''};nodes.push(n);return n;};
 const ctx={currentTime:0,state:'running',destination:node(),sampleRate:100,createGain:node,createBiquadFilter:node,createOscillator:node,createStereoPanner:node,createConvolver:node,createBuffer:(c,l)=>({getChannelData:()=>new Float32Array(l)})};
 const labels={bgmThemeLabel:{},bgmStatusLabel:{},bgmIcon:{}};
 const window={SceneMusic:S,document:{hidden:false,addEventListener:(k,fn)=>listeners[k]=fn,getElementById:k=>labels[k]},localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}};if(support)window.AudioContext=function(){return ctx;};
 const c=vm.createContext({window,console,GamePolish:{loadSettings:()=>({master:1,music:1,effects:1})},setTimeout:fn=>{timers.set(++id,fn);return id;},clearTimeout:i=>timers.delete(i)});vm.runInContext(fs.readFileSync(require.resolve('../audio-manager.js'),'utf8')+';window.Manager=AudioManager;',c);
 return {m:window.audioManager,window,ctx,timers,nodes,listeners,labels,storage};
}
test('all ten scenes have distinct original scores with finite, playable variation across a full form',()=>{
 assert.equal(Object.keys(S.themes).length,10);const signatures=new Set();
 for(const t of Object.values(S.themes)){signatures.add(JSON.stringify([t.bpm,t.lead,t.roots,t.motif]));const counts=new Set();for(let step=0;step<t.meter*2*32;step++){const p=S.events(t,step);assert.ok(p.stepSeconds>0);counts.add(p.events.length);for(const e of p.events){assert.ok(Number.isFinite(e.frequency)&&e.frequency>20&&e.frequency<6000);assert.ok(e.duration>0&&e.level<=.13);assert.ok(S.voices[e.voice]);}}assert.ok(counts.size>1);assert.notDeepEqual(S.events(t,0),S.events(t,t.meter*2*12));}assert.equal(signatures.size,10);
});
test('scene changes retire old notes, fade in a new bus and keep a single scheduler',()=>{
 const f=fixture();assert.equal(f.m.startBgm(),true);const old=f.m.musicBus;assert.equal(f.timers.size,1);f.ctx.currentTime=.2;f.m.setZone('zone6');assert.equal(old.retired,true);assert.notEqual(f.m.musicBus,old);assert.equal(f.timers.size,1);assert.equal(f.m.currentThemeKey,'zone6');assert.ok(f.labels.bgmThemeLabel.textContent.includes('海港'));for(const v of old.voices)assert.equal(v.stopped,1.34);const bus=f.m.musicBus;f.m.setZone('zone6');assert.equal(f.m.musicBus,bus);
});
test('rapid changes bound fading buses and release every ended voice and its connections',()=>{
 const f=fixture();f.m.startBgm();const buses=[f.m.musicBus];for(let i=2;i<=10;i++){f.m.setZone('zone'+i);buses.push(f.m.musicBus);}assert.ok(f.m.retiringMusicBuses.length<=2);assert.equal(f.timers.size,1);f.m.stopBgm();assert.equal(f.timers.size,0);for(const b of buses){for(const v of [...b.voices])v.onended();assert.equal(b.voices.size,0);assert.equal(b.gain.disconnected,true);}
});
test('manual music off survives scene changes and reopening without affecting effect volume',()=>{
 const f=fixture();f.m.startBgm();f.m.toggleBgm();assert.equal(f.m.isBgmPlaying,false);assert.equal(f.storage.get('eme.musicEnabled'),'off');f.m.setZone('zone8');assert.equal(f.timers.size,0);assert.equal(f.m.musicBus,null);assert.equal(new f.window.Manager().manualBgmChoice,true);assert.equal(f.m.sfxGain.gain.value,.35);
});
test('hidden tabs fade and halt scheduling; visible tabs resume only if music remains enabled',()=>{
 const f=fixture();f.m.startBgm();f.window.document.hidden=true;f.listeners.visibilitychange();assert.equal(f.timers.size,0);assert.equal(f.m.musicBus,null);assert.equal(f.m.isBgmPlaying,true);f.window.document.hidden=false;f.listeners.visibilitychange();assert.equal(f.timers.size,1);f.m.stopBgm();f.listeners.visibilitychange();assert.equal(f.timers.size,0);
});
test('speech ducking remains active through settings and scene changes and restores the selected volume',()=>{
 const f=fixture();f.m.startBgm();f.m.duckBgm(.2);f.m.applyVolumes({master:.5,music:.4,effects:.6});assert.ok(Math.abs(f.m.bgmGain.gain.value-.22*.4*.2)<1e-10);f.m.setZone('zone5');assert.equal(f.m.duckFactor,.2);f.m.unduckBgm();assert.equal(f.m.duckFactor,1);assert.ok(f.m.bgmGain.gain.calls.some(c=>c[0]==='ramp'&&Math.abs(c[1]-.088)<1e-10));
});
test('stalled audio clocks do not emit an unbounded catch-up burst; unsupported browsers stay off',()=>{
 const f=fixture();f.m.startBgm();f.ctx.currentTime=120;const prior=f.m.musicStep;f.m.clearMusicTimer();f.m.scheduleNextBgmStep();assert.ok(f.m.musicStep-prior<=1);assert.equal(f.timers.size,1);const unsupported=fixture(false);assert.equal(unsupported.m.startBgm(),false);assert.equal(unsupported.m.isBgmPlaying,false);
});

test('speech begun before audio initialization still ducks the first music phrase',()=>{const f=fixture();f.m.duckBgm(.2);assert.equal(f.m.ctx,null);f.m.startBgm();assert.ok(Math.abs(f.m.bgmGain.gain.value-.044)<1e-10);f.m.unduckBgm();assert.equal(f.m.duckFactor,1);});
