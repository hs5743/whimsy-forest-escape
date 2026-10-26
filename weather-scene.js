/* Open-air meteorological observation yard branching from the existing cloud observatory. */
(function(root){
 'use strict';
 const bounds={minX:-10.65,maxX:10.65,minZ:-13.65,maxZ:13.65};
 const obstacles=[{minX:-9.8,maxX:-8.7,minZ:-1,maxZ:1},{minX:8.7,maxX:9.8,minZ:-1,maxZ:1},{minX:-8,maxX:-6,minZ:-.8,maxZ:1.5},{minX:6,maxX:8,minZ:-8.7,maxZ:-6.8},{minX:-7.5,maxX:-5.5,minZ:-8.5,maxZ:-6.5}];
 function build(manager,group){
  const T=root.THREE,w=manager.world,sky=manager.tex.weatherYardSky||manager.tex.landscapeDaySky;if(sky&&root.RealmLandscape)root.RealmLandscape.build(manager,group,'zone21',sky);
  const geo={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(1,1,1,16),sphere:new T.SphereGeometry(1,16,12),cone:new T.ConeGeometry(1,1,12),ring:new T.TorusGeometry(1,.055,7,28)};
  const color={concrete:0xffffff,gravel:0xffffff,grass:0xffffff,steel:0x89938f,wire:0x7b8581,brass:0xb89c67,blue:0x4c929f,deep:0x344a4c,white:0xf0f1e8,cloud:0xe2e7e3,yellow:0xd4ae54,red:0xaa6255,green:0x657653,dark:0x434b47,glass:0xaac6c2,wood:0x776652};
  const texFor={concrete:manager.tex.coastalConcrete,gravel:manager.tex.weatherGravel,grass:manager.tex.weatherYardGrass};
  const mat={};for(const [k,c]of Object.entries(color)){const map=texFor[k]||null;mat[k]=new T.MeshStandardMaterial({color:c,map,roughness:k==='brass'?.43:k==='glass'?.3:k==='steel'||k==='wire'?.55:.86,metalness:k==='brass'?.48:k==='steel'||k==='wire'?.32:0,transparent:k==='glass',opacity:k==='glass'?.35:1,depthWrite:k!=='glass',side:k==='glass'?T.DoubleSide:T.FrontSide});mat[k].color.convertSRGBToLinear();}
  const staticMeshes=[];
  function mesh(type,material,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group,dynamic=false){const o=new T.Mesh(geo[type],mat[material]);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=type!=='sphere';o.receiveShadow=true;parent.add(o);if(!dynamic&&parent===group)staticMeshes.push(o);return o;}
  function target(id,text,x,y,z,sx=2.5,sy=2,sz=2){const o=new T.Mesh(new T.BoxGeometry(sx,sy,sz),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'weather_'+id,name:text,label:text,hint:'讀取現場儀器線索，選出天氣，再口說完成步驟',onClick:()=>root.WeatherChapter.open(id)};group.add(o);w.interactables.push(o);return o;}
  function linkBar(x,y,z,length,angle){return mesh('box','wire',x,y,z,.018,.018,length,0,angle,0);}
  function fenceLine(x1,z1,x2,z2){
   const dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz),angle=Math.atan2(dx,dz),panels=Math.ceil(len/1.38),spacing=len/panels;
   for(let i=0;i<=panels;i++){const t=i/panels,x=x1+dx*t,z=z1+dz*t;mesh('cyl','steel',x,.72,z,.032,1.38,.032);}
   for(let i=0;i<panels;i++){const t=(i+.5)/panels,x=x1+dx*t,z=z1+dz*t;linkBar(x,1.4,z,spacing+.025,angle);linkBar(x,.73,z,spacing+.025,angle);linkBar(x,.08,z,spacing+.025,angle);for(let y=.2;y<1.32;y+=.19)linkBar(x,y,z,spacing+.025,angle);}
  }
  // Compact galvanized mesh gives the sensors a credible open measurement yard and leaves both gates clear.
  fenceLine(-9.35,-12.2,9.35,-12.2);
  fenceLine(-9.35,-12.2,-9.35,12.65);
  fenceLine(9.35,-12.2,9.35,7.35);fenceLine(9.35,10.25,9.35,12.65);
  fenceLine(-9.35,12.65,-1.85,12.65);fenceLine(1.85,12.65,9.35,12.65);
  // Open gate posts and a swung leaf mark the passage to the tidal-flat branch.
  for(const [x,z]of [[9.35,7.35],[9.35,10.25]]){mesh('cyl','steel',x,.82,z,.065,1.58,.065);mesh('sphere','brass',x,1.66,z,.105,.105,.105);}
  mesh('box','steel',9.35,.76,8.8,.05,1.35,.05);
  mesh('box','steel',9.35,1.42,8.8,.055,.055,.055);
  // A low perimeter gravel margin surrounds short damp grass; service lanes and instrument pads remain open.
  mesh('box','gravel',0,-.15,0,21.8,.3,27.8);
  mesh('box','grass',0,.012,0,18.2,.035,24.1);
  mesh('box','concrete',0,.035,10.3,2.35,.04,4.7);
  mesh('box','gravel',-6.7,.024,0,2.8,.035,17.6);
  mesh('box','gravel',6.9,.024,-1.2,2.3,.035,14.8);
  mesh('box','concrete',-5.8,.04,-1.3,2.2,.07,2.2);
  mesh('box','concrete',6.8,.04,-7.3,2.25,.07,2.25);
  mesh('box','concrete',-8.1,.04,-7.3,2.5,.07,2.25);
  mesh('box','concrete',4.2,.04,-1.25,2.2,.07,2.1);
  // Entry clipboard and weather notebook sit on a small table beside the walking lane.
  mesh('box','wood',-3.8,.72,8.6,1.75,.13,1.15);for(const x of [-4.5,-3.1])for(const z of [8.15,9.05])mesh('cyl','steel',x,.36,z,.045,.72,.045);
  mesh('box','white',-3.8,.81,8.58,.74,.035,.9,0,.08,-.1);mesh('box','brass',-3.8,.84,8.16,.12,.035,.08);
  for(let i=0;i<5;i++)mesh('box','blue',-3.8,.84,8.29+i*.12,.48,.012,.012,0,0,-.1);
  // A waist-high sky compass has simple embossed weather symbols instead of a giant labeled display.
  mesh('cyl','steel',-6.35,.52,-5.65,.075,1.04,.075);mesh('cyl','deep',-6.35,1.08,-5.65,.62,.09,.62);
  mesh('cyl','white',-6.35,1.145,-5.65,.52,.035,.52);
  for(let i=0;i<8;i++){const a=i*Math.PI/4,r=.39;mesh(i%2?'sphere':'cone',i%3?'blue':'yellow',-6.35+Math.sin(a)*r,1.2,-5.65+Math.cos(a)*r,.055,.06,.055,0,0,0);}
  for(const [x,y,s]of [[-6.55,1.25,.15],[-6.32,1.3,.21],[-6.09,1.25,.14]])mesh('sphere','cloud',x,y,-5.65,s,.065,s*.75);
  // Measuring rain cylinder with a funnel, scale marks and a compact service pedestal.
  mesh('cyl','steel',-5.8,.1,-1.3,.42,.2,.42);mesh('cyl','white',-5.8,.25,-1.3,.31,.1,.31);
  mesh('cyl','glass',-5.8,.94,-1.3,.17,1.35,.17);mesh('cone','white',-5.8,1.68,-1.3,.42,.34,.42);
  mesh('cyl','blue',-5.8,.72,-1.3,.12,.76,.12);
  for(let i=0;i<5;i++)mesh('box','steel',-5.62,.38+i*.24,-1.3,.13,.018,.024);
  // A small radiation sensor, reference panel and low cable box occupy a separate clear patch.
  mesh('cyl','steel',4.2,.56,-1.25,.055,1.12,.055);mesh('cyl','white',4.2,1.16,-1.25,.28,.12,.28);
  mesh('cyl','glass',4.2,1.24,-1.25,.19,.045,.19);mesh('cyl','brass',4.2,1.32,-1.25,.11,.04,.11);
  mesh('box','deep',4.68,1.02,-1.25,.72,.055,.48,0,0,-.18);mesh('box','blue',4.68,1.055,-1.25,.64,.022,.4,0,0,-.18);
  for(let i=0;i<3;i++)mesh('box','steel',4.46+i*.2,1.07,-1.25,.012,.012,.39,0,0,-.18);
  mesh('box','deep',4.2,.2,-1.25,.56,.25,.42);mesh('box','steel',4.2,.335,-1.25,.6,.025,.46);
  // Wind vane and cup anemometer on a slender, open mast clear of the screen and trees.
  mesh('cyl','steel',7.25,3.25,-7.3,.065,6.5,.065);
  mesh('cyl','brass',7.25,6.58,-7.3,.095,.18,.095);
  const vane=new T.Group();vane.position.set(7.25,6.3,-7.3);group.add(vane);
  mesh('cyl','brass',0,0,0,.038,.13,.038,0,0,0,vane);
  mesh('cone','red',0,.02,-.42,.13,.62,.13,Math.PI/2,0,0,vane);mesh('box','white',0,0,-.78,.14,.2,.62,0,0,0,vane);
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3,cup=mesh('sphere',i===1?'red':'white',7.25+Math.cos(a)*.34,6.78,-7.3+Math.sin(a)*.34,.19,.13,.17);cup.position.x=7.25+Math.cos(a)*.34;cup.position.y=6.78;cup.position.z=-7.3+Math.sin(a)*.34;}
  mesh('sphere','brass',7.25,6.78,-7.3,.11,.11,.11);
  // Ventilated louvered temperature screen stands above the lawn on narrow legs.
  for(const x of [-8.67,-7.53])for(const z of [-7.73,-6.87])mesh('cyl','steel',x,.52,z,.034,1.04,.034);
  mesh('box','white',-8.1,1.42,-7.3,1.48,.13,1.08);
  mesh('box','white',-8.1,1.03,-7.3,1.36,.66,.96);
  for(let y=.8;y<=1.4;y+=.12)mesh('box','steel',-8.1,y,-6.79,1.18,.022,.025,0,0,-.12);
  mesh('box','white',-8.1,1.8,-7.3,1.7,.08,1.22);
  for(const x of [-8.55,-8.1,-7.65])mesh('cyl','red',x,1.04,-7.23,.025,.48,.025);
  // Field diary: an open weather chart clipped to a compact side table, drawn only with lines and simple marks.
  mesh('box','wood',-2.65,.72,-8.75,2.3,.14,1.35);for(const x of [-3.62,-1.68])for(const z of [-9.27,-8.23])mesh('cyl','steel',x,.36,z,.05,.72,.05);
  mesh('box','white',-2.65,.81,-8.75,1.65,.04,1.08,0,.04,-.06);mesh('box','brass',-2.65,.84,-9.26,.3,.025,.09);
  for(let i=0;i<4;i++)mesh('box','blue',-2.75,.845,-9.12+i*.16,.88,.012,.018,0,0,-.06);
  for(let i=0;i<3;i++)mesh('cyl',i?'yellow':'red',-2.3+i*.18,.88,-8.56,.055,.045,.055);
  // The raincoat stand is a human-scale field object, with a folded hood and visible fasteners.
  mesh('cyl','steel',6.4,.72,4.5,.06,1.44,.06);mesh('cyl','steel',6.4,1.42,4.48,.45,.035,.035,0,0,Math.PI/2);
  const coatShape=new T.Shape();coatShape.moveTo(-.16,.72);coatShape.lineTo(-.43,.62);coatShape.lineTo(-.8,.18);coatShape.lineTo(-.66,.02);coatShape.lineTo(-.49,.2);coatShape.lineTo(-.44,-.25);coatShape.lineTo(-.59,-.68);coatShape.lineTo(-.35,-.75);coatShape.lineTo(0,-.7);coatShape.lineTo(.35,-.75);coatShape.lineTo(.59,-.68);coatShape.lineTo(.44,-.25);coatShape.lineTo(.49,.2);coatShape.lineTo(.66,.02);coatShape.lineTo(.8,.18);coatShape.lineTo(.43,.62);coatShape.lineTo(.16,.72);coatShape.lineTo(0,.56);coatShape.closePath();
  const coat=new T.Mesh(new T.ExtrudeGeometry(coatShape,{depth:.12,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.02,bevelThickness:.02}),mat.yellow);coat.position.set(6.4,1.48,4.31);coat.castShadow=true;coat.receiveShadow=true;group.add(coat);
  mesh('cone','red',6.4,2.25,4.37,.22,.24,.14,Math.PI,0,0);mesh('box','deep',6.4,1.48,4.45,.028,.72,.028);
  for(const y of [1.72,1.92,2.1])mesh('sphere','brass',6.4,y,4.49,.038,.038,.038);
  // Blue water beads on the displayed coat give the WET vocabulary step a visible clue.
  for(const [x,y] of [[6.08,1.57],[6.4,1.84],[6.72,1.55]]){const bead=mesh('sphere','blue',x,y,4.49,.075,.11,.045,0,0,0,group,true);bead.userData.sceneRole='raincoat-water-bead';}
  for(const x of [6.22,6.58])mesh('box','blue',x,1.48,4.46,.18,.12,.035,0,0,x<6.4?-.14:.14);
  // Short bench for the observer and a covered storage case on the service path.
  mesh('box','wood',-.1,.55,5.35,2.45,.13,.72);for(const x of [-1.08,.88])for(const z of [5.08,5.62])mesh('cyl','steel',x,.28,z,.045,.56,.045);
  mesh('box','deep',1.75,.28,5.25,.85,.5,.68);mesh('box','steel',1.75,.55,5.25,.91,.06,.74);
  // Field targets remain tied to actual equipment; instructional wording stays in the quest interface.
  target('station','氣象觀測工作單',-3.8,1,8.6,2.5,2,1.7);
  target('clouds','雲況觀察盤',-6.35,1.3,-5.65,2,1.6,1.8);
  target('rain','雨量筒',-5.8,1.15,-1.3,1.8,2.7,1.8);
  target('diary','今日天氣日誌',-2.65,1,-8.75,3,2,2);
  target('sun','日照感測器',4.4,1.3,-1.25,2.1,2.3,2);
  target('wind','風向風速計',7.25,4.6,-7.3,2.2,5.2,2.2);
  target('temperature','百葉箱溫度計',-8.1,1.4,-7.3,2.3,2.8,2.1);
  target('coat','雨衣與天氣裝備',6.4,1.75,4.5,2,2.8,1.9);
  // Clear, unlettered passages return to the observatory or continue to the tidal-flat chapter.
  const exit=target('exit','返回雲頂觀測站',0,1.55,13.15,3.3,2.1,1.3);exit.userData.onClick=()=>{if(manager.switchZone('zone7'))w.adventureProgress?.save(true);};
  const coastGate=target('coast','香山潮間帶入口',9.35,1.25,8.8,2.1,2.5,1.8);
  coastGate.userData.hint='完成氣象觀測紀錄後，開啟香山潮間帶支線';
  coastGate.userData.onClick=()=>{if(!manager.isZoneUnlocked('zone16')){w.showToast('先完成八個氣象觀測口說任務，再前往香山潮間帶。');return;}if(manager.switchZone('zone16'))w.adventureProgress?.save(true);};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of staticMeshes){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){if(items.length<2)continue;const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  group.add(new T.HemisphereLight(0xe4f2f5,0x596856,.67));const key=new T.DirectionalLight(0xffefd5,.96);key.position.set(-10,17,9);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-18,right:18,top:20,bottom:-20,near:.5,far:60});group.add(key,key.target);
  w.weatherRefs={vane};root.WeatherChapter?.sync?.();
 }
 const api={bounds,colliders:()=>obstacles.map(o=>({...o})),build};root.WeatherScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
