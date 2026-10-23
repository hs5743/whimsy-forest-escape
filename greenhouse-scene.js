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
  const geo={box:new T.BoxGeometry(1,1,1),ball:new T.SphereGeometry(1,12,8),stem:new T.CylinderGeometry(1,1,1,10),cone:new T.ConeGeometry(1,1,8),pot:new T.CylinderGeometry(.8,1,1,16),ring:new T.TorusGeometry(1,.08,6,24),leaf:new T.SphereGeometry(1,10,6)};
  const colors={frame:0xffffff,brass:0xbba474,stone:0xc4b7a0,brick:0xffffff,pot:0x875a42,earth:0x49382a,wood:0x87664a,bench:0x74817b,leaf:0xffffff,lightLeaf:0xd7dfad,darkLeaf:0x234f3c,flower:0xe6b3aa,cream:0xf2deb1,violet:0x9c8bb8,black:0x27332b,yellow:0xe2ae47,water:0x6b9393,pipe:0x9caa99};
  const mat=Object.fromEntries(Object.entries(colors).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:k==='brass'?.36:k==='pipe'?.55:.85,metalness:k==='brass'?.65:k==='pipe'?.3:0})]));
  mat.stone.map=manager.tex.landscapeStone||null;mat.brick.map=manager.tex.greenhouseBrick||null;mat.brick.bumpMap=manager.tex.greenhouseBrick||null;mat.brick.bumpScale=.022;mat.frame.map=manager.tex.greenhouseFrame||null;mat.frame.bumpMap=manager.tex.greenhouseFrame||null;mat.frame.bumpScale=.012;mat.wood.map=manager.tex.restaurantWood||null;
  const floor=new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.greenhouseFloor||null,bumpMap:manager.tex.greenhouseFloor||null,bumpScale:.018,roughness:.92});
  const glass=new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.greenhouseGlass||null,bumpMap:manager.tex.greenhouseGlass||null,bumpScale:.008,transparent:true,opacity:.48,roughness:.2,metalness:.06,depthWrite:false,side:T.DoubleSide});
  for(const m of [...Object.values(mat),floor,glass])m.color.convertSRGBToLinear();
  // Curved leaf blades carry fine veins rather than uniform plastic ellipsoids.
  const lp=[],lu=[],li=[],rows=12,cols=6;for(let j=0;j<=rows;j++){const t=j/rows,half=Math.pow(Math.sin(Math.PI*t),.72);for(let i=0;i<=cols;i++){const u=i/cols*2-1;lp.push(u*half,.14*Math.sin(Math.PI*t)*(1-u*u)+.08*t*t,t*2-1);lu.push(i/cols,t);if(j<rows&&i<cols){const a=j*(cols+1)+i,b=a+cols+1;li.push(a,b,a+1,b,b+1,a+1);}}}
  geo.leaf.dispose();geo.leaf=new T.BufferGeometry();geo.leaf.setAttribute('position',new T.Float32BufferAttribute(lp,3));geo.leaf.setAttribute('uv',new T.Float32BufferAttribute(lu,2));geo.leaf.setIndex(li);geo.leaf.computeVertexNormals();
  const lc=root.document.createElement('canvas');lc.width=256;lc.height=512;const lq=lc.getContext('2d');lq.fillStyle='#9cab72';lq.fillRect(0,0,256,512);for(let i=0;i<800;i++){lq.fillStyle=i%2?'rgba(45,74,30,.12)':'rgba(228,235,171,.16)';lq.fillRect(rng()*256,rng()*512,1+rng()*3,1+rng()*4);}lq.strokeStyle='#c5cf9b';lq.lineWidth=3;lq.beginPath();lq.moveTo(128,0);lq.lineTo(128,512);lq.stroke();lq.lineWidth=1;for(let y=30;y<500;y+=28)for(const sign of [-1,1]){lq.beginPath();lq.moveTo(128,y);lq.quadraticCurveTo(128+sign*40,y-7,128+sign*125,y-50);lq.stroke();}const veinTex=new T.CanvasTexture(lc);veinTex.encoding=T.sRGBEncoding;for(const key of ['leaf','lightLeaf','darkLeaf']){mat[key].side=T.DoubleSide;if(key!=='darkLeaf'){mat[key].map=manager.tex.greenhouseLeaf||veinTex;mat[key].bumpMap=veinTex;mat[key].bumpScale=.01;}}
  const statics=[];
  function mesh(g,m,x,y,z,a,b,c,rx=0,ry=0,rz=0,parent=group,dynamic=false){const material=(g==='pot'&&m==='brick')?mat.pot:mat[m];const o=new T.Mesh(geo[g],material);o.position.set(x,y,z);o.scale.set(a,b,c);o.rotation.set(rx,ry,rz);parent.add(o);if(!dynamic&&parent===group)statics.push(o);return o;}
  function staticMesh(geometry,material,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){const o=new T.Mesh(geometry,material);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);group.add(o);statics.push(o);return o;}
  const b=(m,x,y,z,a,h,d)=>mesh('box',m,x,y,z,a,h,d);
  function plaque(title,subtitle,x,y,z,width=3.5,height=.85,rotation=0){const p=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:label(T,title,subtitle)}));p.position.set(x,y,z);p.rotation.y=rotation;group.add(p);return p;}
  function target(id,text,x,y,z,width=2,height=1.8,depth=1){const hit=new T.Mesh(new T.BoxGeometry(width,height,depth),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.set(x,y,z);hit.userData={id:'greenhouse_'+id,name:text,label:text,hint:'先觀察線索，再口說完成任務',onClick:()=>root.GreenhouseChapter.open(id)};group.add(hit);w.interactables.push(hit);return hit;}
  // Continuous brick paths, inset drainage and a stone plinth anchor every exhibit.
  b('stone',0,-.16,0,22,.32,28);
  const floorPlane=new T.Mesh(new T.PlaneGeometry(22,28),floor);floorPlane.rotation.x=-Math.PI/2;floorPlane.position.y=.012;floorPlane.receiveShadow=true;group.add(floorPlane);
  for(const x of [-3.1,3.1]){b('black',x,.035,0,.22,.025,27);for(let z=-13.2;z<13.5;z+=.23)b('brass',x,.055,z,.23,.025,.035);}
  // Repeated arched ribs, structural purlins and curved glazing follow real conservatory construction.
  for(const x of [-11,11])for(let z=-14;z<=14;z+=3.5){b('frame',x,2.6,z,.12,5.2,.13);b('brass',x,.25,z,.24,.5,.24);}
  for(const y of [.85,2.4,4.1,5.2])for(const x of [-11,11])b('frame',x,y,0,.11,.09,28);
  const roofY=x=>5.2+2.8*Math.sqrt(Math.max(0,1-(x/11)*(x/11)));
  {const points=[];for(let i=0;i<=32;i++){const x=-11+22*i/32;points.push(new T.Vector3(x,roofY(x),0));}const archGeo=new T.TubeGeometry(new T.CatmullRomCurve3(points),64,.075,8,false);for(let z=-14;z<=14;z+=3.5)staticMesh(archGeo,mat.frame,0,0,z);}
  for(let x=-11;x<=11.01;x+=2.75)staticMesh(geo.stem,mat.frame,x,roofY(x),0,.035,28,.035,Math.PI/2);
  // One curved glazing surface is divided visually by the purlins above, avoiding dozens of draw calls.
  {const verts=[],uv=[],idx=[],nx=40,nz=8;for(let iz=0;iz<=nz;iz++)for(let ix=0;ix<=nx;ix++){const x=-11+22*ix/nx,z=-14+28*iz/nz;verts.push(x,roofY(x)-.025,z);uv.push(ix/nx,iz/nz);if(iz<nz&&ix<nx){const a=iz*(nx+1)+ix,b=a+nx+1;idx.push(a,b,a+1,b,b+1,a+1);}}const roofGeo=new T.BufferGeometry();roofGeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));roofGeo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));roofGeo.setIndex(idx);roofGeo.computeVertexNormals();const roof=new T.Mesh(roofGeo,glass);roof.userData.nonBlocking=true;group.add(roof);}
  for(const sign of [-1,1]){const side=new T.Mesh(new T.PlaneGeometry(28,4.25),glass);side.rotation.y=sign*Math.PI/2;side.position.set(sign*10.98,3.05,0);side.userData.nonBlocking=true;group.add(side);}
  // Gutters, downpipes and suspended irrigation show the working systems of a real planted space.
  for(const x of [-10.75,10.75]){b('frame',x,5.18,0,.24,.18,28);for(let z=-12;z<=12;z+=6)staticMesh(geo.stem,mat.frame,x,2.95,z,.055,4.4,.055);}
  for(const x of [-.48,.48]){const ventRail=b('frame',x,8.02,0,.07,.07,24);ventRail.castShadow=true;const vent=new T.Mesh(new T.BoxGeometry(.84,.035,24),glass);vent.position.set(x,8.12,0);group.add(vent);vent.userData.nonBlocking=true;}
  for(const x of [-4.2,4.2]){staticMesh(geo.stem,mat.pipe,x,4.65,0,.045,25,.045,Math.PI/2);for(let z=-11;z<=11;z+=2.2)staticMesh(geo.cone,mat.brass,x,4.52,z,.07,.17,.07,Math.PI);}
  for(const z of [-14,14]){
   for(const x of [-9,-6,-3,3,6,9])b('frame',x,2.6,z,.1,5.2,.13);
   b('frame',0,5.2,z,22,.12,.15);
   if(z<0){const end=new T.Mesh(new T.PlaneGeometry(22,4.25),glass);end.position.set(0,3.05,z);end.userData.nonBlocking=true;group.add(end);b('brick',0,.4,z,22,.8,.25);}
   else{for(const x of [-6.5,6.5])b('brick',x,.4,z,9,.8,.25);for(const x of [-6.25,6.25]){const panel=new T.Mesh(new T.PlaneGeometry(9.5,4.25),glass);panel.position.set(x,3.05,z);panel.userData.nonBlocking=true;group.add(panel);}}
   const capVerts=[],capUvs=[],capIdx=[],capSegments=40,capRows=4;for(let row=0;row<=capRows;row++)for(let i=0;i<=capSegments;i++){const x=-11+22*i/capSegments,base=5.22,top=roofY(x);capVerts.push(x,base+(top-base)*row/capRows,z);capUvs.push(i/capSegments,row/capRows);if(row<capRows&&i<capSegments){const a=row*(capSegments+1)+i,b=a+capSegments+1;capIdx.push(a,b,a+1,b,b+1,a+1);}}
   const capGeo=new T.BufferGeometry();capGeo.setAttribute('position',new T.Float32BufferAttribute(capVerts,3));capGeo.setAttribute('uv',new T.Float32BufferAttribute(capUvs,2));capGeo.setIndex(capIdx);capGeo.computeVertexNormals();const cap=new T.Mesh(capGeo,glass);cap.userData.nonBlocking=true;group.add(cap);
   for(let x=-9;x<=9;x+=3){const post=b('frame',x,6.3,z,.075,Math.max(.25,roofY(x)-5.3),.09);post.position.y=(5.3+roofY(x))*.5;}
  }
  // End-wall circulation fans and diagonal tie rods add the small construction details missing from a model greenhouse.
  for(const x of [-7,7]){staticMesh(geo.ring,mat.frame,x,4.25,-13.82,.72,.72,.72);for(let i=0;i<8;i++)staticMesh(geo.stem,mat.brass,x,4.25,-13.82,.018,1.26,.018,0,0,i*Math.PI/8);staticMesh(geo.ball,mat.brass,x,4.25,-13.82,.13,.13,.13);for(let i=0;i<3;i++){const a=i*Math.PI*2/3;staticMesh(geo.leaf,mat.frame,x+Math.cos(a)*.28,4.25+Math.sin(a)*.28,-13.785,.12,.34,.025,0,0,a+.35);}}
  for(const z of [-10.5,-3.5,3.5,10.5])for(const sign of [-1,1])staticMesh(geo.stem,mat.frame,sign*10.94,3.05,z,.027,4.2,.027,0,0,sign*.58);
  // The south doorway remains clear and aligns with the return interaction.
  for(const x of [-1.5,1.5])b('brass',x,1.6,13.8,.13,3.2,.2);
  b('frame',0,3.25,13.8,3.2,.2,.22);
  for(const x of [-10.75,10.75])for(let z=-12;z<=12;z+=4){b('brass',x,.95,z,.09,.08,3.9);for(const y of [.35,1.5])b('brass',x,y,z,.14,.07,.14);}
  function leafCluster(x,y,z,size=1,parent=group){for(let i=0;i<8;i++){const a=i*2.39996,reach=size*(.22+rng()*.18);mesh('stem','darkLeaf',x+Math.cos(a)*reach*.4,y+size*.35,z+Math.sin(a)*reach*.4,.022,size*.7,.022,0,a,.2,parent);mesh('leaf',i%2?'leaf':'lightLeaf',x+Math.cos(a)*reach,y+size*(.4+rng()*.35),z+Math.sin(a)*reach,size*.17,1,size*.34,.12+(i%3)*.17,a,(i%2?1:-1)*.22,parent);}}
  function flower(x,y,z,color='flower',size=.4,parent=group){mesh('stem','darkLeaf',x,y-.3,z,.02,.6,.02,0,0,0,parent);for(let i=0;i<6;i++){const a=i*Math.PI/3;mesh('ball',color,x+Math.cos(a)*size*.55,y,z+Math.sin(a)*size*.55,size*.45,.055,size*.23,0,-a,0,parent);}mesh('ball','yellow',x,y+.025,z,size*.25,.07,size*.25,0,0,0,parent);}
  function bed(x,z,style){b('brick',x,.3,z,4.8,.6,3);b('stone',x,.63,z,4.9,.07,3.1);b('earth',x,.67,z,4.5,.12,2.7);for(let i=0;i<15;i++){const xx=x+(rng()-.5)*4,zz=z+(rng()-.5)*2.3;leafCluster(xx,.69,zz,.5+rng()*.7);if(style)flower(xx,1+rng()*.6,zz,style,.22+rng()*.12);}for(let i=0;i<20;i++)mesh('ball','earth',x+(rng()-.5)*4.3,.74,z+(rng()-.5)*2.5,.045,.025,.04);}
  bed(-6.8,6);bed(6.8,6,'cream');bed(-6.8,-2,'flower');bed(6.8,-2,'violet');bed(-6.8,-10);bed(6.8,-10,'cream');
  for(const x of [-9.8,9.8])for(const z of [-12,-5,2,10]){mesh('pot','brick',x,.55,z,.62,1.1,.62);mesh('ring','brass',x,1.08,z,.51,.51,.51,Math.PI/2);leafCluster(x,1.05,z,1.5);}
  // Hanging propagation baskets break the flat horizon with a second layer of real greenhouse planting.
  for(const x of [-7.6,7.6])for(const z of [-7,4]){const rim=roofY(x),basketY=3.55,chainLength=rim-basketY-.18;staticMesh(geo.stem,mat.brass,x,(rim+basketY+.18)/2,z,.018,chainLength,.018);staticMesh(geo.ball,mat.brass,x,rim-.08,z,.09,.07,.09);mesh('pot','brick',x,basketY,z,.35,.38,.35);mesh('ring','brass',x,basketY+.18,z,.3,.3,.3,Math.PI/2);for(let vine=0;vine<4;vine++){const a=vine*Math.PI/2+.4,vx=x+Math.cos(a)*.12,vz=z+Math.sin(a)*.12;mesh('stem','darkLeaf',vx,basketY-.32,vz,.014,.66,.014,0,a,0);for(let leaf=0;leaf<3;leaf++){const y=basketY-.08-leaf*.36;mesh('leaf',leaf%2?'leaf':'lightLeaf',vx+Math.cos(a+leaf)*.1,y,vz+Math.sin(a+leaf)*.1,.055,.22,.12,.2,a+leaf*.45,(leaf%2?1:-1)*.28);}}}
  // Central seedling: its crown grows only after successful spoken GROW.
  mesh('pot','brick',0,.5,-10,1.55,1,1.55);mesh('ring','brass',0,1,-10,1.25,1.25,1.25,Math.PI/2);mesh('ball','earth',0,.97,-10,1.2,.06,1.2);
  const sapling=new T.Group();sapling.position.set(0,1,-10);group.add(sapling);leafCluster(0,0,0,.9,sapling);
  const bloom=new T.Group();bloom.position.set(0,0,-10);group.add(bloom);for(let i=0;i<12;i++){const a=i*Math.PI/6;flower(Math.cos(a),2+Math.sin(i)*.15,Math.sin(a),'flower',.36,bloom);}bloom.visible=false;
  // Galvanized propagation benches, trays and seedlings make the space function as a real working glasshouse.
  for(const x of [-6.8,6.8]){b('bench',x,1.45,-2,3.3,.12,1.7);for(const dx of [-1.4,1.4]){b('frame',x+dx,.8,-2,.12,1.3,1.25);b('frame',x+dx,.3,-2,.22,.1,1.8);}for(let row=0;row<2;row++)for(let col=0;col<5;col++){const px=x-1.15+col*.57,pz=-2.35+row*.7;mesh('pot','brick',px,1.66,pz,.2,.25,.2);leafCluster(px,1.78,pz,.23);}}
  function insect(x,y,z,butterfly){const g=new T.Group();g.position.set(x,y,z);group.add(g);mesh('ball',butterfly?'black':'yellow',0,0,0,.13,.13,.32,0,0,0,g);mesh('ball','black',0,.03,.3,.11,.1,.11,0,0,0,g);if(!butterfly)for(const zz of [-.15,0,.15])mesh('ring','black',0,0,zz,.13,.13,.13,0,0,0,g);
   const wings=[];for(const sign of [-1,1]){const wing=new T.Group();wing.position.x=sign*.07;g.add(wing);for(const dz of [-.13,.15]){mesh('leaf',butterfly?'violet':'cream',sign*.28,.04,dz,.36,.018,.24,0,sign*.2,0,wing);mesh('ball',butterfly?'cream':'brass',sign*.3,.065,dz,.075,.014,.045,0,0,0,wing);}wings.push([wing,sign]);}
   for(const sign of [-1,1]){mesh('stem','black',sign*.11,.13,.36,.012,.2,.012,0,0,-sign*.5,g);for(let i=0;i<3;i++)mesh('stem','black',sign*.13,-.1,(i-1)*.16,.01,.22,.01,0,0,sign*.7,g);}
   return {group:g,wings};}
  const bee=insect(-6.8,2.1,-2,false),butterfly=insect(6.8,2.1,-2,true);
  // Small observation cards and finely framed signs stay readable at exploration distance.
  const stations=[['garden','入口委託 · GARDEN',0,1.7,10.7],['green','葉片觀察 · GREEN',-6.8,1.7,8],['bee','訪花昆蟲 · BEE',-6.8,1.8,.1],['butterfly','翅膀觀察 · BUTTERFLY',6.8,1.8,.1],['grow','幼苗照護 · GROW',0,1.8,-7.8],['smell','香草氣味 · SMELL',6.8,1.7,8],['pickup','花園整理 · PICK UP',-6.8,1.7,-7.8],['beautiful','花園明信片 · BEAUTIFUL',6.8,1.7,-7.8]];
  for(const [id,title,x,y,z]of stations){const sx=id==='garden'?-0.75:x,sz=id==='garden'?10.25:z-.45;const tagY=id==='garden'?.65:.78;b('bench',sx,tagY,sz,.86,.055,.28);plaque(title,'',sx,tagY+.035,sz+.15,.78,.22);target(id,title,x,y,z,2.8,1.8,.8);}
  const litter=[];for(let i=0;i<3;i++){const m=mat[i===1?'water':'cream'].clone();m.transparent=true;const o=new T.Mesh(i===1?geo.stem:geo.box,m);o.position.set(-5.6-i*.7,.15,-7.7);o.scale.set(.24,.18,i===1?.24:.38);o.rotation.y=i*.7;group.add(o);litter.push(o);}
  // A low sorting basket and reusable gloves make the clean-up task legible through its objects.
  b('frame',-9.35,.47,-8.2,.82,.82,.7);b('black',-9.35,.9,-8.2,.88,.08,.76);for(let x=-9.63;x<=-9.07;x+=.28)b('cream',x,.48,-7.83,.11,.62,.035);
  for(const z of [7,-7])for(const x of [-10,10]){mesh('stem','frame',x,3.7,z,.035,2.2,.035);mesh('ball','cream',x,2.65,z,.2,.3,.2);mesh('ring','brass',x,2.65,z,.22,.22,.22,Math.PI/2);}
  const exit=target('exit','返回守護獸花園',0,1.6,13.1,2.8,2,.8);exit.userData.onClick=()=>{if(manager.switchZone('zone3'))w.adventureProgress?.save(true);};
  // Merge repeated leaves, stones, tiles and beams by geometry/material, with local transforms.
  group.updateMatrixWorld(true);const batches=new Map();for(const o of statics){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xe8f1dd,0x5b6045,.56);group.add(hemi);const sun=new T.DirectionalLight(0xffedcf,.86);sun.position.set(-10,18,12);sun.target.position.set(0,0,-3);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:22,bottom:-22,near:.5,far:65});sun.shadow.bias=-.0002;sun.shadow.normalBias=.035;group.add(sun,sun.target);
  w.greenhouseRefs={sapling,bloom,litter};w.animators.push(t=>{for(const [i,insect]of [bee,butterfly].entries()){const motion=w.settings?.reducedMotion?0:Math.sin(t*(i?3:5))*.08;insect.group.position.y=2.1+motion;for(const [wing,sign]of insect.wings)wing.rotation.z=sign*(.15+motion*3);}});root.GreenhouseChapter.sync?.();
  if (root.ModelAssetManager && root.ModelAssetManager.isReady) {
    root.ModelAssetManager.upgradeGreenhouseScene(group);
  }
 }
 function buildEntrance(manager,group){
  const T=root.THREE,w=manager.world,g=new T.Group();g.position.set(-10.2,0,7);g.rotation.y=Math.PI/4;group.add(g);
  const frame=new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.greenhouseFrame||null,bumpMap:manager.tex.greenhouseFrame||null,bumpScale:.01,roughness:.74}),gold=new T.MeshStandardMaterial({color:0xc8ac6f,metalness:.5,roughness:.4});
  for(const x of [-1.1,1.1]){const p=new T.Mesh(new T.BoxGeometry(.14,3,.14),frame);p.position.set(x,1.5,0);g.add(p);const cap=new T.Mesh(new T.SphereGeometry(.17,12,8),gold);cap.position.set(x,3.05,0);g.add(cap);}
  const arch=new T.Mesh(new T.TorusGeometry(1.1,.08,8,32,Math.PI),frame);arch.position.y=2.8;g.add(arch);
  const sign=new T.Mesh(new T.PlaneGeometry(1.65,.42),new T.MeshBasicMaterial({map:label(T,'玻璃溫室','GARDEN')}));sign.position.set(0,3.35,.1);g.add(sign);
  const entranceLeaf=new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.greenhouseLeaf||null,side:T.DoubleSide,roughness:.78});
  for(let i=0;i<12;i++){const leaf=new T.Mesh(new T.SphereGeometry(1,8,6),entranceLeaf);leaf.scale.set(.11,.035,.26);leaf.position.set((i%2?1:-1)*1.02,.45+Math.floor(i/2)*.37,.05);leaf.rotation.set(.12,i*.7,(i%2?1:-1)*.15);g.add(leaf);}
  // A small glazed vestibule and planted approach physically belong to the old garden.
  const stone=new T.MeshStandardMaterial({map:manager.tex.landscapeStone||null,color:0xb2aa8d,roughness:.95});
  for(let row=0;row<5;row++)for(let col=0;col<3;col++){const tile=new T.Mesh(new T.BoxGeometry(.85,.1,.68),stone);tile.position.set((col-1)*.9,.04,1.2+row*.73);g.add(tile);}
  const glazing=new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.greenhouseGlass||null,bumpMap:manager.tex.greenhouseGlass||null,bumpScale:.007,transparent:true,opacity:.13,depthWrite:false,roughness:.24,side:T.DoubleSide});
  for(const sign of [-1,1]){const pane=new T.Mesh(new T.PlaneGeometry(2.5,2.4),glazing);pane.position.set(sign*1.2,1.65,-1.25);pane.rotation.y=sign*Math.PI/2;g.add(pane);for(const z of [-2.5,-1.25,0]){const mullion=new T.Mesh(new T.BoxGeometry(.06,2.6,.07),frame);mullion.position.set(sign*1.2,1.6,z);g.add(mullion);}const roof=new T.Mesh(new T.BoxGeometry(1.36,.08,2.65),frame);roof.position.set(sign*.6,3.15,-1.25);roof.rotation.z=-sign*.4;g.add(roof);const pot=new T.Mesh(new T.CylinderGeometry(.33,.27,.5,12),stone);pot.position.set(sign*1.9,.26,1.4);g.add(pot);for(let j=0;j<9;j++){const frond=new T.Mesh(new T.SphereGeometry(1,8,6),entranceLeaf);const a=j*2.39996;frond.position.set(sign*1.9+Math.cos(a)*.18,.55+j*.045,1.4+Math.sin(a)*.18);frond.scale.set(.07,.025,.36);frond.rotation.set(.25,a,.18);g.add(frond);}}
  // Double glazed door leaves, gaskets, handles and a threshold turn the gateway into a usable vestibule.
  for(const [sign,offset]of [[-1,-.09],[1,.09]]){const door=new T.Mesh(new T.PlaneGeometry(1.08,2.55),glazing);door.position.set(sign*.53,1.35,.04);door.rotation.y=offset;g.add(door);for(const x of [-.52,.52]){const seal=new T.Mesh(new T.BoxGeometry(.035,2.62,.045),frame);seal.position.set(sign*.53+x,1.35,.05);g.add(seal);}const handle=new T.Mesh(new T.CylinderGeometry(.022,.022,.46,8),gold);handle.position.set(sign*.12,1.32,.12);g.add(handle);}
  const threshold=new T.Mesh(new T.BoxGeometry(2.3,.08,.22),gold);threshold.position.set(0,.08,.16);g.add(threshold);
  const hit=new T.Mesh(new T.BoxGeometry(2.3,2.5,1),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.4;hit.userData={id:'garden_greenhouse_entry',name:'玻璃溫室入口',label:'玻璃溫室 · 新的八字冒險',hint:'先完成三位花園夥伴的照護任務',onClick:()=>{if(!root.RealmQuests.solved('zone3',w.gameState.realmPuzzles?.zone3)){w.showToast('先完成花園的三位夥伴照護，再到玻璃溫室幫忙！');return;}if(manager.switchZone('zone14'))w.adventureProgress?.save(true);}};g.add(hit);w.interactables.push(hit);
 }
 const api={bounds,colliders:()=>obstacles.map(c=>({...c})),build,buildEntrance};root.GreenhouseScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
