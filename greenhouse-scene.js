/* Modelled glass conservatory. Seeded details and instancing keep repeat visits bounded. */
(function(root){
 'use strict';
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const obstacles=[box(-11,0,.3,28),box(11,0,.3,28),box(0,-14,22,.3),box(-6,14,10,.3),box(6,14,10,.3),box(-6.8,6,4.8,3),box(6.8,6,4.8,3),box(-6.8,-2,4.8,3),box(6.8,-2,4.8,3),box(-6.8,-10,4.8,3),box(6.8,-10,4.8,3),box(0,-10,3.2,3)];
 const bounds={minX:-10.65,maxX:10.65,minZ:-13.65,maxZ:13.65};
 function label(T,title,subtitle){const c=root.document.createElement('canvas');c.width=1024;c.height=256;const q=c.getContext('2d');q.fillStyle='#153e39';q.fillRect(0,0,1024,256);q.strokeStyle='#d3b97c';q.lineWidth=4;q.strokeRect(12,12,1000,232);q.fillStyle='#f4e4b8';q.textAlign='center';q.font='bold 52px sans-serif';q.fillText(title,512,115,950);q.font='28px sans-serif';q.fillStyle='#bad0b6';q.fillText(subtitle,512,180,950);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
 function build(manager,group){
  const T=root.THREE,w=manager.world,rng=root.RealmLandscape?.random(14357)||(()=>.5);
  const sky=manager.tex.landscapeDaySky;if(sky&&root.RealmLandscape)root.RealmLandscape.build(manager,group,'zone14',sky);
  const geo={box:new T.BoxGeometry(1,1,1),ball:new T.SphereGeometry(1,12,8),stem:new T.CylinderGeometry(1,1,1,10),pot:new T.CylinderGeometry(.8,1,1,16),ring:new T.TorusGeometry(1,.08,6,24),leaf:new T.SphereGeometry(1,10,6)};
  const colors={frame:0x23473c,brass:0xbba474,stone:0xc4b7a0,brick:0x8b7965,earth:0x49382a,wood:0x87664a,leaf:0x36633c,lightLeaf:0x6e9144,darkLeaf:0x234f3c,flower:0xe6b3aa,cream:0xf2deb1,violet:0x9c8bb8,black:0x27332b,yellow:0xe2ae47,water:0x6b9393};
  const mat=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:['brass'].includes(k)?.36:.85,metalness:k==='brass'?.65:0})]));
  mat.stone.map=manager.tex.landscapeStone||null;mat.brick.map=manager.tex.landscapeStone||null;mat.wood.map=manager.tex.restaurantWood||null;
  const glass=new T.MeshStandardMaterial({color:0xb0d3cf,transparent:true,opacity:.12,roughness:.18,metalness:.12,depthWrite:false,side:T.DoubleSide});
  for(const m of [...Object.values(mat),glass])m.color.convertSRGBToLinear();
  // Curved leaf blades carry fine veins rather than uniform plastic ellipsoids.
  const lp=[],lu=[],li=[],rows=12,cols=6;for(let j=0;j<=rows;j++){const t=j/rows,half=Math.pow(Math.sin(Math.PI*t),.72);for(let i=0;i<=cols;i++){const u=i/cols*2-1;lp.push(u*half,.14*Math.sin(Math.PI*t)*(1-u*u)+.08*t*t,t*2-1);lu.push(i/cols,t);if(j<rows&&i<cols){const a=j*(cols+1)+i,b=a+cols+1;li.push(a,b,a+1,b,b+1,a+1);}}}
  geo.leaf.dispose();geo.leaf=new T.BufferGeometry();geo.leaf.setAttribute('position',new T.Float32BufferAttribute(lp,3));geo.leaf.setAttribute('uv',new T.Float32BufferAttribute(lu,2));geo.leaf.setIndex(li);geo.leaf.computeVertexNormals();
  const lc=root.document.createElement('canvas');lc.width=256;lc.height=512;const lq=lc.getContext('2d');lq.fillStyle='#9cab72';lq.fillRect(0,0,256,512);for(let i=0;i<800;i++){lq.fillStyle=i%2?'rgba(45,74,30,.12)':'rgba(228,235,171,.16)';lq.fillRect(rng()*256,rng()*512,1+rng()*3,1+rng()*4);}lq.strokeStyle='#c5cf9b';lq.lineWidth=3;lq.beginPath();lq.moveTo(128,0);lq.lineTo(128,512);lq.stroke();lq.lineWidth=1;for(let y=30;y<500;y+=28)for(const sign of [-1,1]){lq.beginPath();lq.moveTo(128,y);lq.quadraticCurveTo(128+sign*40,y-7,128+sign*125,y-50);lq.stroke();}const vein=new T.CanvasTexture(lc);vein.encoding=T.sRGBEncoding;for(const key of ['leaf','lightLeaf','darkLeaf']){mat[key].side=T.DoubleSide;if(key!=='darkLeaf'){mat[key].map=vein;mat[key].bumpMap=vein;mat[key].bumpScale=.025;}}
  const statics=[];
  function mesh(g,m,x,y,z,a,b,c,rx=0,ry=0,rz=0,parent=group,dynamic=false){const o=new T.Mesh(geo[g],mat[m]);o.position.set(x,y,z);o.scale.set(a,b,c);o.rotation.set(rx,ry,rz);parent.add(o);if(!dynamic&&parent===group)statics.push(o);return o;}
  const b=(m,x,y,z,a,h,d)=>mesh('box',m,x,y,z,a,h,d);
  function plaque(title,subtitle,x,y,z,width=3.5,height=.85,rotation=0){const p=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:label(T,title,subtitle)}));p.position.set(x,y,z);p.rotation.y=rotation;group.add(p);return p;}
  function target(id,text,x,y,z,width=2,height=1.8,depth=1){const hit=new T.Mesh(new T.BoxGeometry(width,height,depth),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.set(x,y,z);hit.userData={id:'greenhouse_'+id,name:text,label:text,hint:'先觀察線索，再口說完成任務',onClick:()=>root.GreenhouseChapter.open(id)};group.add(hit);w.interactables.push(hit);return hit;}
  // Continuous brick paths, inset drainage and a stone plinth anchor every exhibit.
  b('stone',0,-.16,0,22,.32,28);
  for(let z=-13.5;z<14;z+=.75)for(let x=-10.5;x<11;x+=1.2){const offset=Math.round(z/.75)%2?.3:0;b((Math.round(x+z)*3)%5?'brick':'stone',x+offset,-.015,z,1.14,.08,.69);}
  for(const x of [-3.1,3.1]){b('black',x,.035,0,.22,.025,27);for(let z=-13.2;z<13.5;z+=.23)b('brass',x,.055,z,.23,.025,.035);}
  // A pitched roof with actual framed panes; no photographic wall plane or horizon seam.
  for(const x of [-11,11])for(let z=-14;z<=14;z+=3.5){b('frame',x,2.6,z,.12,5.2,.13);b('brass',x,.25,z,.24,.5,.24);}
  for(const y of [.85,2.4,4.1,5.2])for(const x of [-11,11])b('frame',x,y,0,.11,.09,28);
  for(let z=-14;z<=14;z+=3.5){for(const sign of [-1,1]){const rail=b('frame',sign*5.5,6.6,z,11.35,.13,.15);rail.rotation.z=-sign*.249;}b('brass',0,8,z,.16,.13,.16);}
  for(const x of [-11,-8.25,-5.5,-2.75,0,2.75,5.5,8.25,11])b('frame',x,8-Math.abs(x)*2.8/11,0,.065,.09,28);
  for(const sign of [-1,1]){const p=new T.Mesh(new T.PlaneGeometry(11.36,28),glass);p.rotation.set(-Math.PI/2,-sign*.249,0);p.position.set(sign*5.5,6.6,0);p.userData.nonBlocking=true;group.add(p);const side=new T.Mesh(new T.PlaneGeometry(28,4.25),glass);side.rotation.y=sign*Math.PI/2;side.position.set(sign*10.98,3.05,0);side.userData.nonBlocking=true;group.add(side);}
  for(const z of [-14,14]){for(const x of [-9,-6,-3,3,6,9])b('frame',x,2.6,z,.1,5.2,.13);b('frame',0,5.2,z,22,.12,.15);if(z<0)b('brick',0,.4,z,22,.8,.25);else for(const x of [-6.5,6.5])b('brick',x,.4,z,9,.8,.25);}
  // The south doorway remains clear and aligns with the return interaction.
  for(const x of [-1.5,1.5])b('brass',x,1.6,13.8,.13,3.2,.2);
  b('frame',0,3.25,13.8,3.2,.2,.22);plaque('玻璃溫室','GARDEN CONSERVATORY',0,4.15,-13.8,6.7,1.45);
  for(const x of [-10.75,10.75])for(let z=-12;z<=12;z+=4){b('brass',x,.95,z,.09,.08,3.9);for(const y of [.35,1.5])b('brass',x,y,z,.14,.07,.14);}
  function leafCluster(x,y,z,size=1,parent=group){for(let i=0;i<8;i++){const a=i*2.39996,reach=size*(.22+rng()*.18);mesh('stem','darkLeaf',x+Math.cos(a)*reach*.4,y+size*.35,z+Math.sin(a)*reach*.4,.022,size*.7,.022,0,a,.2,parent);mesh('leaf',i%2?'leaf':'lightLeaf',x+Math.cos(a)*reach,y+size*(.4+rng()*.35),z+Math.sin(a)*reach,size*.17,1,size*.34,.12+(i%3)*.17,a,(i%2?1:-1)*.22,parent);}}
  function flower(x,y,z,color='flower',size=.4,parent=group){mesh('stem','darkLeaf',x,y-.3,z,.02,.6,.02,0,0,0,parent);for(let i=0;i<6;i++){const a=i*Math.PI/3;mesh('ball',color,x+Math.cos(a)*size*.55,y,z+Math.sin(a)*size*.55,size*.45,.055,size*.23,0,-a,0,parent);}mesh('ball','yellow',x,y+.025,z,size*.25,.07,size*.25,0,0,0,parent);}
  function bed(x,z,style){b('stone',x,.3,z,4.8,.6,3);b('brass',x,.63,z,4.9,.07,3.1);b('earth',x,.67,z,4.5,.12,2.7);for(let i=0;i<15;i++){const xx=x+(rng()-.5)*4,zz=z+(rng()-.5)*2.3;leafCluster(xx,.69,zz,.5+rng()*.7);if(style)flower(xx,1+rng()*.6,zz,style,.22+rng()*.12);}for(let i=0;i<20;i++)mesh('ball','earth',x+(rng()-.5)*4.3,.74,z+(rng()-.5)*2.5,.045,.025,.04);}
  bed(-6.8,6);bed(6.8,6,'cream');bed(-6.8,-2,'flower');bed(6.8,-2,'violet');bed(-6.8,-10);bed(6.8,-10,'cream');
  for(const x of [-9.8,9.8])for(const z of [-12,-5,2,10]){mesh('pot','brick',x,.55,z,.62,1.1,.62);mesh('ring','brass',x,1.08,z,.51,.51,.51,Math.PI/2);leafCluster(x,1.05,z,1.5);}
  // Central seedling: its crown grows only after successful spoken GROW.
  mesh('pot','brick',0,.5,-10,1.55,1,1.55);mesh('ring','brass',0,1,-10,1.25,1.25,1.25,Math.PI/2);mesh('ball','earth',0,.97,-10,1.2,.06,1.2);
  const sapling=new T.Group();sapling.position.set(0,1,-10);group.add(sapling);leafCluster(0,0,0,.9,sapling);
  const bloom=new T.Group();bloom.position.set(0,0,-10);group.add(bloom);for(let i=0;i<12;i++){const a=i*Math.PI/6;flower(Math.cos(a),2+Math.sin(i)*.15,Math.sin(a),'flower',.36,bloom);}bloom.visible=false;
  // Brass observation displays, tools and habitat diagrams provide close-range detail.
  for(const [x,z]of [[-6.8,-2],[6.8,-2]]){b('wood',x,1.45,z,3.3,.13,1.7);for(const dx of [-1.4,1.4])b('frame',x+dx,.8,z,.12,1.3,1.25);}
  function insect(x,y,z,butterfly){const g=new T.Group();g.position.set(x,y,z);group.add(g);mesh('ball',butterfly?'black':'yellow',0,0,0,.13,.13,.32,0,0,0,g);mesh('ball','black',0,.03,.3,.11,.1,.11,0,0,0,g);if(!butterfly)for(const zz of [-.15,0,.15])mesh('ring','black',0,0,zz,.13,.13,.13,0,0,0,g);
   const wings=[];for(const sign of [-1,1]){const wing=new T.Group();wing.position.x=sign*.07;g.add(wing);for(const dz of [-.13,.15]){mesh('leaf',butterfly?'violet':'cream',sign*.28,.04,dz,.36,.018,.24,0,sign*.2,0,wing);for(let i=0;i<4;i++)mesh('ball',butterfly?'cream':'brass',sign*(.18+i*.055),.065,dz+.07*Math.sin(i),.027,.012,.035,0,0,0,wing);}wings.push([wing,sign]);}
   for(const sign of [-1,1]){mesh('stem','black',sign*.11,.13,.36,.012,.2,.012,0,0,-sign*.5,g);for(let i=0;i<3;i++)mesh('stem','black',sign*.13,-.1,(i-1)*.16,.01,.22,.01,0,0,sign*.7,g);}
   return {group:g,wings};}
  const bee=insect(-6.8,2.1,-2,false),butterfly=insect(6.8,2.1,-2,true);
  // Small observation cards and finely framed signs stay readable at exploration distance.
  const stations=[['garden','入口委託 · GARDEN',0,1.7,10.7],['green','葉片觀察 · GREEN',-6.8,1.7,8],['bee','訪花昆蟲 · BEE',-6.8,1.8,.1],['butterfly','翅膀觀察 · BUTTERFLY',6.8,1.8,.1],['grow','幼苗照護 · GROW',0,1.8,-7.8],['smell','香草氣味 · SMELL',6.8,1.7,8],['pickup','花園整理 · PICK UP',-6.8,1.7,-7.8],['beautiful','花園明信片 · BEAUTIFUL',6.8,1.7,-7.8]];
  for(const [id,title,x,y,z]of stations){const sx=id==='garden'?-6.8:x,sz=id==='garden'?10.2:z-.5;for(const side of [-1,1])b('brass',sx+side*1.35,(y+.6)/2,sz,.045,y+.6,.055);b('frame',sx,y+.8,sz-.035,3.2,.84,.09);plaque(title,id==='grow'?'水分 2 格 · 光線 2 格':'OBSERVE · LISTEN · SPEAK',sx,y+.8,sz+.025,3.12,.76);target(id,title,x,y,z,2.8,1.8,.8);}
  const litter=[];for(let i=0;i<3;i++){const m=mat[i===1?'water':'cream'].clone();m.transparent=true;const o=new T.Mesh(i===1?geo.stem:geo.box,m);o.position.set(-5.6-i*.7,.15,-7.7);o.scale.set(.24,.18,i===1?.24:.38);o.rotation.y=i*.7;group.add(o);litter.push(o);}
  for(const z of [7,-7])for(const x of [-10,10]){mesh('stem','frame',x,3.7,z,.035,2.2,.035);mesh('ball','cream',x,2.65,z,.2,.3,.2);mesh('ring','brass',x,2.65,z,.22,.22,.22,Math.PI/2);}
  const exit=target('exit','返回守護獸花園',0,1.6,13.1,2.8,2,.8);exit.userData.onClick=()=>{if(manager.switchZone('zone3'))w.adventureProgress?.save(true);};
  // Merge repeated leaves, stones, tiles and beams by geometry/material, with local transforms.
  group.updateMatrixWorld(true);const batches=new Map();for(const o of statics){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xe8f1dd,0x5b6045,.62);group.add(hemi);const sun=new T.DirectionalLight(0xffedcf,1.2);sun.position.set(-10,18,12);sun.target.position.set(0,0,-3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:22,bottom:-22,near:.5,far:65});sun.shadow.bias=-.0002;sun.shadow.normalBias=.035;group.add(sun,sun.target);
  w.greenhouseRefs={sapling,bloom,litter};w.animators.push(t=>{for(const [i,insect]of [bee,butterfly].entries()){const motion=w.settings?.reducedMotion?0:Math.sin(t*(i?3:5))*.08;insect.group.position.y=2.1+motion;for(const [wing,sign]of insect.wings)wing.rotation.z=sign*(.15+motion*3);}});root.GreenhouseChapter.sync?.();
  if (root.ModelAssetManager && root.ModelAssetManager.isReady) {
    root.ModelAssetManager.upgradeGreenhouseScene(group);
  }
 }
 function buildEntrance(manager,group){
  const T=root.THREE,w=manager.world,g=new T.Group();g.position.set(-10.2,0,7);g.rotation.y=Math.PI/4;group.add(g);
  const frame=new T.MeshStandardMaterial({color:0x294c3d,roughness:.7}),gold=new T.MeshStandardMaterial({color:0xc8ac6f,metalness:.5,roughness:.4});
  for(const x of [-1.1,1.1]){const p=new T.Mesh(new T.BoxGeometry(.14,3,.14),frame);p.position.set(x,1.5,0);g.add(p);const cap=new T.Mesh(new T.SphereGeometry(.17,12,8),gold);cap.position.set(x,3.05,0);g.add(cap);}
  const arch=new T.Mesh(new T.TorusGeometry(1.1,.08,8,32,Math.PI),frame);arch.position.y=2.8;g.add(arch);
  const sign=new T.Mesh(new T.PlaneGeometry(2.9,.95),new T.MeshBasicMaterial({map:label(T,'玻璃溫室','完成花園照護任務後開放')}));sign.position.set(0,3.8,.1);g.add(sign);
  for(let i=0;i<10;i++){const leaf=new T.Mesh(new T.SphereGeometry(1,8,6),frame);leaf.scale.set(.14,.045,.28);leaf.position.set((i%2?1:-1)*1.05,.6+Math.floor(i/2)*.47,.05);leaf.rotation.y=i*.7;g.add(leaf);}
  // A small glazed vestibule and planted approach physically belong to the old garden.
  const stone=new T.MeshStandardMaterial({map:manager.tex.landscapeStone||null,color:0xb2aa8d,roughness:.95});
  for(let row=0;row<5;row++)for(let col=0;col<3;col++){const tile=new T.Mesh(new T.BoxGeometry(.85,.1,.68),stone);tile.position.set((col-1)*.9,.04,1.2+row*.73);g.add(tile);}
  const glazing=new T.MeshStandardMaterial({color:0xbad9ce,transparent:true,opacity:.12,depthWrite:false,roughness:.2,side:T.DoubleSide});
  for(const sign of [-1,1]){const pane=new T.Mesh(new T.PlaneGeometry(2.5,2.4),glazing);pane.position.set(sign*1.2,1.65,-1.25);pane.rotation.y=sign*Math.PI/2;g.add(pane);for(const z of [-2.5,-1.25,0]){const mullion=new T.Mesh(new T.BoxGeometry(.06,2.6,.07),frame);mullion.position.set(sign*1.2,1.6,z);g.add(mullion);}const roof=new T.Mesh(new T.BoxGeometry(1.36,.08,2.65),frame);roof.position.set(sign*.6,3.15,-1.25);roof.rotation.z=-sign*.4;g.add(roof);const pot=new T.Mesh(new T.CylinderGeometry(.33,.27,.5,12),stone);pot.position.set(sign*1.9,.26,1.4);g.add(pot);for(let j=0;j<9;j++){const frond=new T.Mesh(new T.SphereGeometry(1,8,6),frame);const a=j*2.39996;frond.position.set(sign*1.9+Math.cos(a)*.18,.55+j*.045,1.4+Math.sin(a)*.18);frond.scale.set(.07,.025,.36);frond.rotation.set(.25,a,.18);g.add(frond);}}
  const hit=new T.Mesh(new T.BoxGeometry(2.3,2.5,1),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.4;hit.userData={id:'garden_greenhouse_entry',name:'玻璃溫室入口',label:'玻璃溫室 · 新的八字冒險',hint:'先完成三位花園夥伴的照護任務',onClick:()=>{if(!root.RealmQuests.solved('zone3',w.gameState.realmPuzzles?.zone3)){w.showToast('先完成花園的三位夥伴照護，再到玻璃溫室幫忙！');return;}if(manager.switchZone('zone14'))w.adventureProgress?.save(true);}};g.add(hit);w.interactables.push(hit);
 }
 const api={bounds,colliders:()=>obstacles.map(c=>({...c})),build,buildEntrance};root.GreenhouseScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
