const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const THREE=require('../three.min.js'),P=require('../game-polish.js'),base=path.resolve(__dirname,'..');
function worldFixture(){
 const ids=new Map();let now=0;
 function el(tag){const attrs={},n={tagName:tag,style:{},children:[],disabled:false,setAttribute(k,v){attrs[k]=v;},getAttribute:k=>attrs[k]??null,appendChild(ch){this.children.push(ch);if(ch.id)ids.set(ch.id,ch);},append(...nodes){nodes.forEach(ch=>this.appendChild(ch));},querySelectorAll(){return this.children.flatMap(n=>[n,...(n.querySelectorAll?.()||[])]);},focus(){doc.activeElement=this;}};let html='';Object.defineProperty(n,'innerHTML',{get:()=>html,set:s=>{html=s;n.children=[];}});return n;}
 const doc={body:el('body'),activeElement:null,createElement:el,getElementById:id=>ids.get(id)||null};
 const window={addEventListener(){},GamePolish:P};const ctx=vm.createContext({window,document:doc,THREE:{...THREE},console,performance:{now:()=>now},requestAnimationFrame(){}});
 vm.runInContext(fs.readFileSync(path.join(base,'world-3d.js'),'utf8')+';window.World=World3D;',ctx);
 const w=Object.create(window.World.prototype);Object.assign(w,{isFallback2D:true,gameState:{xp:0,level:1,doorOpened:false,escaped:false},interactables:[],isAnyModalOpen:()=>false,showToast(){},zoneManager:{currentZoneId:'zone1',getCurrentZone:()=>({id:'zone1',name:'Test study'})}});
 return {w,ctx,window,doc,ids,tick:t=>{now=t;w.animate();},buttons:()=>ids.get('fallback2DPanel')?.querySelectorAll().filter(n=>n.tagName==='button')||[]};
}
test('actual first-room exit cannot open SUN before the stone door is solved in either interaction path',()=>{
 const f=worldFixture(),calls=[];f.w.openSpeechCard=word=>calls.push(word);f.w.buildOutsideMeadow(new THREE.Group());
 const exit=f.w.interactables.find(o=>o.userData.id==='exit_portal_zone1');f.w.renderFallback2DPanel();
 const card=f.buttons().find(b=>b.getAttribute('data-fallback-key')==='exit_portal_zone1');assert.equal(card.disabled,true);
 f.w.triggerInteraction(exit);exit.userData.onClick();f.w.triggerEscapeCelebration();assert.deepEqual(calls,[]);assert.equal(f.w.gameState.escaped,false);
 f.w.gameState.doorOpened=true;f.tick(300);const unlocked=f.buttons().find(b=>b.getAttribute('data-fallback-key')==='exit_portal_zone1');assert.equal(unlocked.disabled,false);unlocked.onclick();assert.deepEqual(calls,['SUN']);
});
test('an asynchronously revealed object becomes a 2D card without another player click',()=>{
 const f=worldFixture(),o=new THREE.Group();o.userData={id:'flower',name:'FLOWER'};o.visible=false;f.w.interactables=[o];
 f.w.renderFallback2DPanel();assert.equal(f.buttons().some(b=>b.getAttribute('data-fallback-key')==='flower'),false);
 o.visible=true;f.w.gameState.mimicFed=true;f.tick(300);assert.equal(f.buttons().some(b=>b.getAttribute('data-fallback-key')==='flower'),true);
});
test('hidden ancestor targets are absent from the 2D panel and cannot trigger actions',()=>{
 const f=worldFixture(),parent=new THREE.Group(),o=new THREE.Group();let clicked=0;parent.visible=false;o.userData={id:'future',name:'Future',onClick:()=>clicked++};parent.add(o);f.w.interactables=[o];
 f.w.renderFallback2DPanel();assert.equal(f.buttons().some(b=>b.getAttribute('data-fallback-key')==='future'),false);f.w.triggerInteraction(o);assert.equal(clicked,0);
});
test('WebGL retry replaces only the renderer and retains puzzle state and the scene manager',()=>{
 const f=worldFixture();let attempts=0,disposed=0,resets=0;const canvas={},old={domElement:canvas,dispose(){disposed++;}},state=f.w.gameState,manager=f.w.zoneManager;
 f.w.renderer=old;f.w.frameCadence={reset(){resets++;}};f.w.clock={getDelta(){}};f.w.setGraphicQuality=()=>{};
 f.ctx.THREE.WebGLRenderer=function(){attempts++;if(attempts===1)throw Error('high unavailable');return {setSize(){},dispose(){}};};
 f.ctx.THREE.PMREMGenerator=undefined;assert.equal(f.w.tryRestore3D(),true);assert.equal(attempts,2);assert.equal(disposed,1);assert.equal(resets,1);assert.equal(f.w.isFallback2D,false);assert.equal(f.w.gameState,state);assert.equal(f.w.zoneManager,manager);
});
test('a failed WebGL retry leaves 2D interactions and all puzzle progress intact',()=>{
 const f=worldFixture();let attempts=0;const old={domElement:{}},state=f.w.gameState;f.w.renderer=old;
 f.ctx.THREE.WebGLRenderer=function(){attempts++;throw Error('disabled');};assert.equal(f.w.tryRestore3D(),false);assert.equal(attempts,2);assert.equal(f.w.renderer,old);assert.equal(f.w.isFallback2D,true);assert.equal(f.w.gameState,state);
});
test('a hunt in a different realm does not claim a matching local object or block ordinary interactions',()=>{
 const f=worldFixture();let wins=0,clicked=0;f.w.scavengerHunt={isQuestActive:()=>true,currentQuest:{zoneId:'zone7',targetWord:'SUN'},handleQuestSuccess:()=>wins++};
 f.w.triggerInteraction({userData:{id:'SUN',onClick:()=>clicked++}});assert.equal(wins,0);assert.equal(clicked,1);
});
