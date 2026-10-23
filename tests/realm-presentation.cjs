const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
function setup(){
 const ctx=vm.createContext({window:{}});for(const f of ['spatial-zone-manager.js','realm-presentation.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',f),'utf8')+(f.startsWith('spatial')?';window.Manager=SpatialZoneManager;':''),ctx);
 const manager=new ctx.window.Manager(null,{metadataOnly:true});manager.currentZoneId='zone20';let open=new Set(['zone1','zone12','learningHub']);manager.isZoneUnlocked=id=>open.has(id);
 function element(){return {children:[],attrs:{},style:{setProperty(){}},append(n){this.children.push(n)},replaceChildren(){this.children=[]},setAttribute(k,v){this.attrs[k]=v},focus(){this.focused=true}}}
 ctx.document={createElement:element};const root=element(),travel=[];const api=ctx.window.RealmPresentation;api.render(root,manager,{completedWords:['SCHOOL']},id=>travel.push(id));
 const all=(node=root)=>[node,...node.children.flatMap(n=>all(n))];const named=text=>all().find(n=>n.textContent===text);const node=id=>all().find(n=>n.attrs['aria-label']?.startsWith(manager.zones[id].name+'，'));
 return {api,manager,root,all,named,node,travel,open};
}
test('all 21 destinations belong to one region and future child chapters inherit their parent region',()=>{
 const {api,manager}=setup(),zones=Object.values(manager.zones),ids=api.regions.flatMap(r=>Array.from(r.ids));assert.equal(ids.length,21);assert.equal(new Set(ids).size,21);
 for(const z of zones)assert.ok(ids.includes(z.id));assert.equal(api.regionFor({id:'zone21',parentZone:'zone12'},zones).id,'school');
});
test('regional and mobile layouts retain distinct coordinates and enough room for every marker as regions grow',()=>{
 const {api}=setup();for(const compact of [false,true])for(const count of [1,4,5,6,12]){const pts=api.layout(count,compact),width=compact?280:620,height=Math.max(340,Math.ceil(count/(compact?2:3))*(compact?154:170));
 for(let i=0;i<pts.length;i++){const [x,y]=pts[i];assert.ok(x>0&&x<100&&y>0&&y<100);for(let j=0;j<i;j++)assert.ok(Math.abs(x-pts[j][0])*width/100>=130||Math.abs(y-pts[j][1])*height/100>=112,'map markers overlap');}}
});
test('selecting a region or locked chapter never travels, and travel rechecks the live unlock gate',()=>{
 const s=setup();s.named('新港校園').onclick();s.node('zone13').onclick();assert.equal(s.travel.length,0);assert.equal(s.all().find(n=>n.className==='atlas-travel').disabled,true);
 s.node('zone12').onclick();const action=s.all().find(n=>n.className==='atlas-travel');assert.equal(action.disabled,false);s.open.delete('zone12');action.onclick();assert.equal(s.travel.length,0);s.open.add('zone12');action.onclick();assert.deepEqual(s.travel,['zone12']);
});
test('cross-region entrances and mainline links select the correct destination without bypassing travel confirmation',()=>{
 const s=setup();s.named('森林海岸').onclick();s.node('zone21').onclick();s.named('入口：星空觀測站 →').onclick();assert.equal(s.node('zone7').attrs['aria-pressed'],'true');assert.ok(s.node('zone7').focused);
 s.named('新港校園').onclick();s.node('zone4').onclick();s.named('下一站：鐘樓車站 →').onclick();assert.equal(s.node('zone5').attrs['aria-pressed'],'true');assert.equal(s.travel.length,0);
 s.named('定位：舞獅彩繪').onclick();assert.equal(s.node('zone20').attrs['aria-pressed'],'true');
});
