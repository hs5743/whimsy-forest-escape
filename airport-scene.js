/* Modelled international airport terminal and runway apron. Seeded details and instancing keep repeat visits bounded. */
(function(root){
 'use strict';
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const obstacles=[box(-11,0,.3,28),box(11,0,.3,28),box(0,-14,22,.3),box(-6,14,10,.3),box(6,14,10,.3),box(-6.8,6,4.8,3),box(6.8,6,4.8,3),box(-6.8,-2,4.8,3),box(6.8,-2,4.8,3),box(-6.8,-10,4.8,3),box(6.8,-10,4.8,3),box(0,-10,3.2,3)];
 const bounds={minX:-10.65,maxX:10.65,minZ:-13.65,maxZ:13.65};
 function label(T,title,subtitle){const c=root.document.createElement('canvas');c.width=1024;c.height=256;const q=c.getContext('2d');q.fillStyle='#102a43';q.fillRect(0,0,1024,256);q.strokeStyle='#f0b429';q.lineWidth=4;q.strokeRect(12,12,1000,232);q.fillStyle='#f8fafc';q.textAlign='center';q.font='bold 52px sans-serif';q.fillText(title,512,115,950);q.font='28px sans-serif';q.fillStyle='#9fb3c8';q.fillText(subtitle,512,180,950);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
 function build(manager,group){
  const T=root.THREE,w=manager.world,rng=root.RealmLandscape?.random(15487)||(()=>.5);
  const sky=manager.tex.landscapeNightSky||manager.tex.landscapeDaySky;if(sky&&root.RealmLandscape)root.RealmLandscape.build(manager,group,'zone15',sky);
  const geo={box:new T.BoxGeometry(1,1,1),ball:new T.SphereGeometry(1,12,8),stem:new T.CylinderGeometry(1,1,1,12),cone:new T.ConeGeometry(1,1,12),ring:new T.TorusGeometry(1,.08,6,24)};
  const colors={steel:0x243b53,brass:0xd69e2e,stone:0xd9e2ec,slate:0x829ab1,asphalt:0x1f2933,navy:0x102a43,white:0xf5f7fa,sky:0x38bdf8,amber:0xf59e0b,red:0xe12d39,taxi:0xfacc15,black:0x101820,emerald:0x10b981};
  const mat=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:['brass','steel','white','taxi'].includes(k)?.32:.82,metalness:['brass','steel'].includes(k)?.68:.1})]));
  mat.stone.map=manager.tex.landscapeStone||null;mat.slate.map=manager.tex.landscapeStone||null;
  const glass=new T.MeshStandardMaterial({color:0x93c5fd,transparent:true,opacity:.14,roughness:.15,metalness:.18,depthWrite:false,side:T.DoubleSide});
  for(const m of [...Object.values(mat),glass])m.color.convertSRGBToLinear();
  const statics=[];
  function mesh(g,m,x,y,z,a,b,c,rx=0,ry=0,rz=0,parent=group,dynamic=false){const o=new T.Mesh(geo[g],mat[m]);o.position.set(x,y,z);o.scale.set(a,b,c);o.rotation.set(rx,ry,rz);parent.add(o);if(!dynamic&&parent===group)statics.push(o);return o;}
  const b=(m,x,y,z,a,h,d)=>mesh('box',m,x,y,z,a,h,d);
  function plaque(title,subtitle,x,y,z,width=3.5,height=.85,rotation=0){const p=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:label(T,title,subtitle)}));p.position.set(x,y,z);p.rotation.y=rotation;group.add(p);return p;}
  function target(id,text,x,y,z,width=2,height=1.8,depth=1){const hit=new T.Mesh(new T.BoxGeometry(width,height,depth),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.set(x,y,z);hit.userData={id:'airport_'+id,name:text,label:text,hint:'先觀察航廈線索，再口說完成任務',onClick:()=>root.AirportChapter.open(id)};group.add(hit);w.interactables.push(hit);return hit;}
  // Terrazzo terminal floor with tactile brass guidance strips and runway apron markings.
  b('stone',0,-.16,0,22,.32,28);
  for(let z=-13.5;z<14;z+=.75)for(let x=-10.5;x<11;x+=1.2){const offset=Math.round(z/.75)%2?.3:0;b((Math.round(x+z)*3)%5?'stone':'slate',x+offset,-.015,z,1.14,.08,.69);}
  for(const x of [-3.1,3.1]){b('navy',x,.035,0,.22,.025,27);for(let z=-13.2;z<13.5;z+=.25)b('brass',x,.055,z,.22,.025,.04);}
  // Terminal steel arches, glazed curtain walls and skylight ribs.
  for(const x of [-11,11])for(let z=-14;z<=14;z+=3.5){b('steel',x,2.6,z,.14,5.2,.14);b('brass',x,.25,z,.25,.5,.25);}
  for(const y of [.85,2.4,4.1,5.2])for(const x of [-11,11])b('steel',x,y,0,.11,.09,28);
  for(let z=-14;z<=14;z+=3.5){for(const sign of [-1,1]){const rail=b('steel',sign*5.5,6.6,z,11.35,.14,.16);rail.rotation.z=-sign*.249;}b('brass',0,8,z,.18,.14,.18);}
  for(const x of [-11,-8.25,-5.5,-2.75,0,2.75,5.5,8.25,11])b('steel',x,8-Math.abs(x)*2.8/11,0,.07,.09,28);
  for(const sign of [-1,1]){const p=new T.Mesh(new T.PlaneGeometry(11.36,28),glass);p.rotation.set(-Math.PI/2,-sign*.249,0);p.position.set(sign*5.5,6.6,0);p.userData.nonBlocking=true;group.add(p);const side=new T.Mesh(new T.PlaneGeometry(28,4.25),glass);side.rotation.y=sign*Math.PI/2;side.position.set(sign*10.98,3.05,0);side.userData.nonBlocking=true;group.add(side);}
  for(const z of [-14,14]){for(const x of [-9,-6,-3,3,6,9])b('steel',x,2.6,z,.1,5.2,.13);b('steel',0,5.2,z,22,.12,.15);if(z<0)b('navy',0,.4,z,22,.8,.25);else for(const x of [-6.5,6.5])b('navy',x,.4,z,9,.8,.25);}
  for(const x of [-1.5,1.5])b('brass',x,1.6,13.8,.13,3.2,.2);
  b('steel',0,3.25,13.8,3.2,.2,.22);plaque('星光國際機場','STARLIGHT INTERNATIONAL AIRPORT',0,4.15,-13.8,6.7,1.45);
  for(const x of [-10.75,10.75])for(let z=-12;z<=12;z+=4){b('brass',x,.95,z,.09,.08,3.9);for(const y of [.35,1.5])b('brass',x,y,z,.14,.07,.14);}
  // Station plinths with runway lights, check-in desks, lounge seats, baggage belt and taxi stand.
  function zonePad(x,z,accent='sky'){b('navy',x,.3,z,4.8,.6,3);b('brass',x,.63,z,4.9,.07,3.1);b('asphalt',x,.67,z,4.5,.12,2.7);for(let i=0;i<14;i++){const xx=x-2+i*.31;for(const zz of [z-1.15,z+1.15])mesh('ball',i%2?accent:'amber',xx,.76,zz,.055,.04,.055);}for(let i=0;i<18;i++)mesh('box','white',x+(rng()-.5)*3.8,.735,z+(rng()-.5)*2.1,.18,.015,.06);}
  zonePad(-6.8,6,'sky');zonePad(6.8,6,'amber');zonePad(-6.8,-2,'sky');zonePad(6.8,-2,'emerald');zonePad(-6.8,-10,'amber');zonePad(6.8,-10,'taxi');
  // Check-in counter & ticket kiosk (-6.8, 6 & -6.8, -2)
  b('white',-6.8,1.15,6,2.6,.9,.9);b('navy',-6.8,1.65,6,2.7,.1,1.0);
  for(const dx of [-.8,0,.8]){b('steel',-6.8+dx,1.25,-2,.55,1.1,.45);b('sky',-6.8+dx,1.65,-1.76,.42,.28,.04);b('amber',-6.8+dx,1.35,-1.75,.28,.05,.05);}
  // Baggage conveyor belt (6.8, -2)
  mesh('ring','steel',6.8,.85,-2,1.45,1.45,1.2,Math.PI/2);
  for(let i=0;i<16;i++){const a=i*Math.PI/8;mesh('box','black',6.8+Math.cos(a)*1.35,.86,-2+Math.sin(a)*.95,.32,.05,.22,0,-a,0);}
  // Boarding lounge benches (-6.8, -10) & departure clock tower (6.8, -10)
  for(const dz of [-.55,.55]){b('steel',-6.8,.88,-10+dz,3.2,.08,.45);for(let i=-3;i<=3;i++)b('navy',-6.8+i*.44,1.08,-10+dz,.36,.35,.38);}
  // Yellow Airport Taxi cab (6.8, 6)
  b('taxi',6.8,1.08,6,2.4,.48,1.15);b('taxi',6.8,1.46,6,1.35,.38,1.02);b('sky',6.8,1.46,6,1.38,.28,.96);b('white',6.8,1.72,6,.42,.12,.22);
  for(const dx of [-.75,.75])for(const dz of [-.58,.58])mesh('stem','black',6.8+dx,.88,6+dz,.24,.12,.24,Math.PI/2,0,0);
  for(let i=-4;i<=4;i++)b(i%2?'black':'white',6.8+i*.24,1.12,6.59,.12,.08,.02);
  // Central runway apron and gleaming jetliner (0, -10)
  b('asphalt',0,.3,-10,3.2,.6,3);b('brass',0,.63,-10,3.3,.07,3.1);
  for(let i=-4;i<=4;i++)b('white',0,.62,-10+i*.3,.14,.02,.18);
  const plane=new T.Group();plane.position.set(0,1.65,-10);group.add(plane);
  mesh('stem','white',0,0,0,.38,2.6,.38,Math.PI/2,0,0,plane);
  mesh('ball','white',0,0,1.3,.37,.35,.55,0,0,0,plane);
  mesh('ball','sky',0,.12,1.45,.26,.16,.32,0,0,0,plane);
  mesh('cone','white',0,0,-1.55,.36,.65,.36,-Math.PI/2,0,0,plane);
  mesh('box','white',0,.02,.1,3.6,.07,.55,0,0,0,plane);
  mesh('box','sky',0,.48,-1.35,.08,.82,.48,.22,0,0,plane);
  mesh('box','white',0,.12,-1.35,1.25,.05,.32,0,0,0,plane);
  const rotors=[];
  for(const sign of [-1,1]){
   mesh('box','sky',sign*1.78,.22,.1,.06,.36,.24,0,0,-sign*.18,plane);
   mesh('stem','steel',sign*.88,-.16,.25,.16,.48,.16,Math.PI/2,0,0,plane);
   const r=new T.Group();r.position.set(sign*.88,-.16,.5);plane.add(r);
   for(let k=0;k<4;k++)mesh('box','brass',0,0,0,.04,.26,.02,0,0,k*Math.PI/4,r);
   rotors.push(r);
  }
  const beacon=new T.Group();beacon.position.set(0,2.5,-10);group.add(beacon);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;mesh('ball',i%2?'emerald':'amber',Math.cos(a)*1.2,Math.sin(i)*.1,Math.sin(a)*1.2,.09,.09,.09,0,0,0,beacon);}
  beacon.visible=false;
  // Terminal perimeter columns with departure lamps.
  for(const x of [-9.8,9.8])for(const z of [-12,-5,2,10]){mesh('stem','steel',x,.55,z,.48,1.1,.48);mesh('ring','brass',x,1.08,z,.51,.51,.51,Math.PI/2);for(let i=0;i<6;i++){const a=i*Math.PI/3;mesh('box','sky',x+Math.cos(a)*.28,1.35,z+Math.sin(a)*.28,.08,.45,.08,0,a,0);}}
  const stations=[
   ['airport','航廈迎賓櫃檯 · AIRPORT',0,1.7,10.7],
   ['plane','停機坪觀景窗 · PLANE',-6.8,1.7,8],
   ['ticket','自助報到機 · TICKET',-6.8,1.8,.1],
   ['bag','行李輸送帶 · BAG',6.8,1.8,.1],
   ['wait','候機室指示燈 · WAIT',-6.8,1.7,-7.8],
   ['hurry','登機門廣播台 · HURRY',0,1.8,-7.8],
   ['taxi','計程車乘車處 · TAXI',6.8,1.7,8],
   ['late','航班準點電子鐘 · LATE',6.8,1.7,-7.8]
  ];
  for(const [id,title,x,y,z]of stations){const sx=id==='airport'?-6.8:x,sz=id==='airport'?10.2:z-.5;for(const side of [-1,1])b('brass',sx+side*1.35,(y+.6)/2,sz,.045,y+.6,.055);b('steel',sx,y+.8,sz-.035,3.2,.84,.09);plaque(title,id==='hurry'?'登機門 2 號 · 召集燈 2 格':'OBSERVE · LISTEN · SPEAK',sx,y+.8,sz+.025,3.12,.76);target(id,title,x,y,z,2.8,1.8,.8);}
  const bags=[];for(let i=0;i<3;i++){const m=mat[i===0?'red':i===1?'sky':'amber'].clone();m.transparent=true;const o=new T.Mesh(geo.box,m);o.position.set(5.6+i*.6,.98,-2);o.scale.set(.32,.26,.22);o.rotation.y=i*.4;group.add(o);bags.push(o);}
  const exit=target('exit','返回星光鐘樓車站',0,1.6,13.1,2.8,2,.8);exit.userData.onClick=()=>{if(manager.switchZone('zone5'))w.adventureProgress?.save(true);};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of statics){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xdbeafe,0x1e293b,.68);group.add(hemi);const sun=new T.DirectionalLight(0xfffbeb,1.22);sun.position.set(-10,18,12);sun.target.position.set(0,0,-3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:22,bottom:-22,near:.5,far:65});sun.shadow.bias=-.0002;sun.shadow.normalBias=.035;group.add(sun,sun.target);
  w.airportRefs={plane,beacon,bags};w.animators.push(t=>{const motion=w.settings?.reducedMotion?0:Math.sin(t*2.4)*.06;plane.position.y=1.65+motion;for(const r of rotors)r.rotation.z=w.settings?.reducedMotion?0:t*8;});root.AirportChapter.sync?.();
  if(root.ModelAssetManager&&root.ModelAssetManager.isReady&&root.ModelAssetManager.upgradeAirportScene){
   root.ModelAssetManager.upgradeAirportScene(group);
  }
 }
 function buildEntrance(manager,group){
  const T=root.THREE,w=manager.world,g=new T.Group();g.position.set(-7.5,0,7.5);g.rotation.y=Math.PI/4;group.add(g);
  const frame=new T.MeshStandardMaterial({color:0x1e3a8a,roughness:.55,metalness:.4}),gold=new T.MeshStandardMaterial({color:0xf59e0b,metalness:.65,roughness:.3});
  for(const x of [-1.1,1.1]){const p=new T.Mesh(new T.BoxGeometry(.16,3,.16),frame);p.position.set(x,1.5,0);g.add(p);const cap=new T.Mesh(new T.SphereGeometry(.18,12,8),gold);cap.position.set(x,3.05,0);g.add(cap);}
  const arch=new T.Mesh(new T.TorusGeometry(1.1,.09,8,32,Math.PI),gold);arch.position.y=2.8;g.add(arch);
  const sign=new T.Mesh(new T.PlaneGeometry(3.1,.95),new T.MeshBasicMaterial({map:label(T,'星光國際機場','完成車站驗票任務後開放')}));sign.position.set(0,3.8,.1);g.add(sign);
  const hit=new T.Mesh(new T.BoxGeometry(2.4,2.6,1.1),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.4;hit.userData={id:'station_airport_entry',name:'星光國際機場快線入口',label:'星光國際機場 · 新的八字冒險',hint:'先完成車站的準時驗票任務',onClick:()=>{if(!root.RealmQuests.solved('zone5',w.gameState.realmPuzzles?.zone5)){w.showToast('先完成星光車站的準時驗票任務，再搭乘機場快線前往星光國際機場！');return;}if(manager.switchZone('zone15'))w.adventureProgress?.save(true);}};g.add(hit);w.interactables.push(hit);
 }
 const api={bounds,colliders:()=>obstacles.map(c=>({...c})),build,buildEntrance};root.AirportScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
