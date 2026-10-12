/* Original modeled campus inspired by public school features, not a surveyed replica. */
(function(root){
 'use strict';
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const walls=[box(-12,-4,.3,28),box(12,-4,.3,28),box(0,-18,24,.3),box(-9.25,-10,5.5,.25),box(0,-10,7,.25),box(9.25,-10,5.5,.25),box(0,-16.8,.25,2.4),box(0,-11.2,.25,2.4)];
 const furniture=[box(-7,-15,2,1.3),box(-2,-15,2,1.3),box(7,-15,2,1.3),box(2,-15,2,1.3),box(7,-5,3.8,2.4)];
 function sign(T,text,w=3){const c=root.document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#1c4b59';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#e4c17a';ctx.lineWidth=10;ctx.strokeRect(12,12,1000,232);ctx.fillStyle='#fff8df';ctx.font='bold 66px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128,950);const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;return new T.Mesh(new T.PlaneGeometry(w,w/4),new T.MeshBasicMaterial({map:tex}));}
 function build(manager,group){
  const T=root.THREE,w=manager.world,geo={box:new T.BoxGeometry(1,1,1),sphere:new T.SphereGeometry(1,16,12),cylinder:new T.CylinderGeometry(1,1,1,20),torus:new T.TorusGeometry(1,.1,8,24)};
  const mat={wall:new T.MeshStandardMaterial({color:0xf1e8d9,map:manager.tex.restaurantPlaster,roughness:.94}),brick:new T.MeshStandardMaterial({color:0xc99175,map:manager.tex.stationBrick,roughness:.9}),wood:new T.MeshStandardMaterial({color:0xc8a77d,map:manager.tex.restaurantWood,roughness:.72}),stone:new T.MeshStandardMaterial({color:0xe0ded4,map:manager.tex.marbleFountain,roughness:.7}),blue:new T.MeshStandardMaterial({color:0x265766,roughness:.55}),green:new T.MeshStandardMaterial({color:0x42794c,roughness:.9}),white:new T.MeshStandardMaterial({color:0xfff7e6,roughness:.65}),gold:new T.MeshStandardMaterial({color:0xe6b850,metalness:.4,roughness:.42}),red:new T.MeshStandardMaterial({color:0xb73d3d,roughness:.65}),black:new T.MeshStandardMaterial({color:0x202b32,roughness:.55}),glass:new T.MeshStandardMaterial({color:0x95c8d2,metalness:.2,roughness:.28}),floor:new T.MeshStandardMaterial({color:0xc9c4b4,map:manager.tex.marketCobble,roughness:.9})};
  const staticMeshes=[];function mesh(kind,m,x,y,z,a,b,c,dynamic=false){const o=new T.Mesh(geo[kind],mat[m]);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=o.receiveShadow=true;group.add(o);if(!dynamic)staticMeshes.push(o);return o;}const b=(m,x,y,z,a,c,d,dyn=false)=>mesh('box',m,x,y,z,a,c,d,dyn);
  function label(text,x,y,z,width=3,rotation=0){const o=sign(T,text,width);o.position.set(x,y,z);o.rotation.y=rotation;group.add(o);return o;}
  function target(id,text,x,y,z,a=2,c=1.4,d=1){const o=new T.Mesh(new T.BoxGeometry(a,c,d),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'school_'+id,name:text,label:text,hint:'口說辨識通過才完成步驟',onClick:()=>root.SchoolChapter.open(id)};group.add(o);w.interactables.push(o);return o;}
  b('floor',0,-.12,-4,24,.22,28);b('stone',0,-.06,-14,20,.12,8);b('wall',0,3.75,-14,24,.2,8);
  for(const c of walls){const x=(c.minX+c.maxX)/2,z=(c.minZ+c.maxZ)/2,a=c.maxX-c.minX,d=c.maxZ-c.minZ;if(d>20){b('wall',x,1.85,-14,a,3.7,8);b('stone',x,.45,0,a,.9,20);b('blue',x,1.15,0,.08,.07,20);for(let zz=-9;zz<=9;zz+=2)b('blue',x,.8,zz,.06,.65,.06);}else b('wall',x,1.85,z,a,3.7,d);}
  const lawn=new T.MeshStandardMaterial({color:0x76946e,roughness:.98});const outdoor=new T.Mesh(new T.BoxGeometry(60,.1,40),lawn);outdoor.position.set(0,-.24,4);outdoor.receiveShadow=true;group.add(outdoor);
  for(const x of [-15,15])for(const z of [-6,0,6]){mesh('cylinder','wood',x,1.3,z,.2,2.6,.2);for(const offset of [-.8,0,.8])mesh('sphere','green',x+offset,3.2,z,1.4,1.6,1.4);}
  for(const x of [-11,-7,-3,3,7,11]){b('brick',x,1.7,-9.65,.32,3.4,.42);b('brick',x,4.2,-10,.36,1,.42);}
  b('stone',0,3.6,-9.65,24,.25,1.1);b('blue',0,4.1,-17.8,24,.2,.5);b('wall',0,4.6,-14,24,.2,8);b('wall',0,4.2,-17.9,24,1,.2);
  for(const x of [-9,-6,-3,3,6,9]){b('glass',x,2.15,-17.72,2.1,1.6,.04);for(const xx of [x-1.1,x,x+1.1])b('blue',xx,2.15,-17.66,.055,1.72,.06);for(const yy of [1.3,2.15,3])b('blue',x,yy,-17.66,2.2,.055,.06);b('stone',x,1.22,-17.6,2.3,.09,.3);}
  label('新港國小 · Xin-gang School',0,4.15,-9.48,6);
  label('閱讀角 · 校史線索',-5,3.16,-9.48,3.4);label('CLASSROOM · 教室',5,3.16,-9.48,3.4);
  for(const z of [-16.8,-11.2])b('brick',0,1.7,z,.35,3.4,.24);b('wood',0,3.12,-14,.4,.2,3.2);
  // Bookshelves and low desks, physical room entrances and natural window frames.
  for(const x of [-10.7,-9.7]){b('wood',x,1.4,-16.5,.12,2.8,2);for(const yy of [.35,1.15,1.95,2.7])b('wood',-10.2,yy,-16.5,1.1,.09,2);}
  for(let i=0;i<30;i++)b(i%3===0?'red':i%3===1?'blue':'gold',-10.2,.67+Math.floor(i/10)*.78,-17.2+i%10*.15,.7,.5,.09);
  function desk(x,z){b('wood',x,1,z,2,.16,1.3);for(const xx of [-.75,.75])for(const zz of [-.4,.4])b('blue',x+xx,.48,z+zz,.06,.95,.06);b('blue',x,.58,z+1,.8,.12,.7);b('wood',x,1.04,z+1.32,.8,.8,.09);for(const xx of [-.3,.3])b('blue',x+xx,.3,z+1,.06,.6,.6);}
  for(const x of [-7,-2,2,7])desk(x,-15);
  b('blue',-7,1.15,-15,.5,.14,.35);mesh('sphere','gold',-7,1.3,-15,.08,.08,.08);label('LISTEN · 校史',-7,2.05,-15.4,2.2);target('listen','閱讀角 · LISTEN 與校史年份',-7,1.55,-14.8);
  label('1960 分校 / 1963 獨立設校',-11.6,2.1,-12.6,5,Math.PI/2);label('2021 新教學大樓落成剪綵',-11.6,2.75,-12.6,4,Math.PI/2);
  target('classroom','教室門口 · CLASSROOM',5,1.55,-10.8,2.5,2.5,.8);
  for(let n=0;n<6;n++)b('white',7,1.12+n*.012,-15,1,.012,.7);label('PAPER · 圖卡材料',7,2.05,-15.4,2.3);target('paper','紙張桌 · PAPER',7,1.5,-14.8);
  b('white',2,1.12,-15,1.25,.035,.85);for(let n=0;n<5;n++)b(['red','gold','blue','green','wood'][n],2.7,1.16,-15.3+n*.1,.36,.025,.025);label('DRAW · 舞獅圖卡',2,2.05,-15.4,2.3);target('draw','畫圖桌 · DRAW',2,1.5,-14.8);
  const card=label('LION · 迎賓圖卡',2,1.8,-15.2,1.5);card.visible=false;
  // Courtyard planting, railings, benches and shaded corridor without picture seams.
  for(const x of [-10.5,10.5])for(const z of [2,7]){mesh('cylinder','stone',x,.2,z,.8,.4,.8);mesh('cylinder','wood',x,1.3,z,.14,2.2,.14);for(const p of [[0,2.7,0],[.6,2.4,.2],[-.6,2.4,-.2]])mesh('sphere','green',x+p[0],p[1],z+p[2],1,1.1,1);}
  for(const x of [-8,8]){b('wood',x,.65,4,3,.12,.65);b('wood',x,1.02,4.3,3,.5,.1);for(const xx of [-1,1])b('blue',x+xx,.33,4,.12,.65,.55);}
  for(const x of [-8,-4,4,8]){b('brick',x,.55,9.7,.35,1.1,.35);b('blue',x,.95,9.7,3.6,.07,.08);}
  b('wood',0,.62,6.8,2.4,1.2,1);b('white',0,1.25,6.8,1.2,.04,.6);label('新竹縣竹北市新港國小',0,3.15,8.9,6,Math.PI);label('SCHOOL · 校園任務',0,1.7,6.7,1.5);target('school','校門迎賓桌 · SCHOOL',0,1.6,6.8,2.6,1.4,1.2);
  // Lion-dance props: painted head, curled brows, mouth, teeth and soft tassel beard.
  b('wood',7,.2,-5,3.8,.35,2.4);const head=new T.Group();head.position.set(7,1.65,-5);group.add(head);
  function part(kind,m,x,y,z,a,c,d){const o=mesh(kind,m,x,y,z,a,c,d,true);group.remove(o);head.add(o);return o;}
  part('sphere','red',0,.15,0,.85,.75,.7);part('sphere','gold',0,.25,.05,.72,.66,.64);for(const x of [-.42,.42]){part('sphere','white',x,.42,.52,.3,.3,.2);part('sphere','black',x,.43,.69,.13,.15,.06);part('sphere','white',x-.035,.49,.74,.045,.045,.025);part('torus','red',x,.7,.55,.32,.15,.25);part('sphere','red',x*1.8,.53,-.05,.25,.3,.16);}
  part('sphere','red',0,.12,.78,.25,.16,.15);part('sphere','black',0,-.27,.56,.5,.23,.12);part('sphere','red',0,-.46,.6,.58,.09,.2);for(const x of [-.3,-.1,.1,.3])part('box','white',x,-.16,.72,.14,.17,.1);for(let n=0;n<15;n++){const a=n*Math.PI*2/15;part('sphere','white',Math.cos(a)*.79,.2+Math.sin(a)*.67,.05,.13,.13,.12);}for(let n=0;n<9;n++)part('cylinder','gold',-.48+n*.12,-.79+Math.abs(4-n)*.04,.6,.025,.6,.025);
  label('LION · 龍鳳舞獅特色',7,3.05,-5.4,3.4);target('lion','舞獅獅頭 · LION',7,1.6,-3.7,3,1.8,1);
  mesh('cylinder','red',3,1,-5,.8,.7,.8);mesh('cylinder','gold',3,1.38,-5,.81,.07,.81);for(const x of [2.45,3.55])b('wood',x,.42,-5,.09,.85,.1);for(const x of [2.65,3.35])b('wood',x,1.46,-5,.05,.05,1);label('DRUM · 咚 咚 鏘',3,2.2,-5.2,2.8);target('drum','迎賓鼓台 · DRUM 與鼓點',3,1.65,-4.2);
  b('stone',-4,.16,-5,4,.3,2);label('WELCOME · 迎賓台',-4,2.1,-5.3,3.4);target('welcome','迎賓台 · WELCOME',-4,1.6,-4.1,3,1.8,1);
  const banner=label('Welcome to our school!',0,3.15,-9.35,6);banner.visible=false;
  const exit=target('exit','南側校門 · 返回冒險操場',0,1.6,9.3,3,2,.7);exit.userData.onClick=()=>{if(manager.switchZone('zone4')){w.player.pos.set(-3,1.6,8);w.player.yaw=Math.PI;w.adventureProgress?.save(true);}};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of staticMeshes){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const list of batches.values()){const first=list[0],inst=new T.InstancedMesh(first.geometry,first.material,list.length);list.forEach((o,i)=>inst.setMatrixAt(i,o.matrixWorld));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of list)o.parent.remove(o);}
  const sun=new T.DirectionalLight(0xffeed9,1.1);sun.position.set(-7,10,8);sun.target.position.set(0,0,-6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-24,right:24,top:26,bottom:-26,near:.5,far:55});sun.shadow.bias=-.0003;sun.shadow.normalBias=.03;group.add(sun,sun.target);for(const x of [-5,5]){const light=new T.PointLight(0xffefce,.45,10,2);light.position.set(x,3.1,-14);group.add(light);}
  w.animators.push(time=>{if(root.SchoolChapter.solved(w.gameState.realmPuzzles.zone12)&&!w.settings?.reducedMotion)head.rotation.x=Math.sin(time*2)*.08;else head.rotation.x=0;});w.schoolRefs={banner,card};root.SchoolChapter.sync?.();
 }
 function buildEntrance(manager,group){const T=root.THREE,w=manager.world;const entrance=new T.Group();entrance.position.set(-3,0,10);group.add(entrance);const wood=new T.MeshStandardMaterial({color:0xc7a46c,map:manager.tex.restaurantWood,roughness:.8});for(const x of [-1.4,1.4]){const p=new T.Mesh(new T.BoxGeometry(.18,3.4,.2),wood);p.position.set(x,1.7,0);entrance.add(p);}const label=sign(T,'新港國小 · 舞獅迎賓',4);label.position.set(0,3.25,.15);label.rotation.y=Math.PI;entrance.add(label);const hit=new T.Mesh(new T.BoxGeometry(2.7,2.8,1),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.4;hit.userData={id:'athletic_school_entry',name:'新港國小校園委託',label:'新港國小校園委託',hint:'完成操場任務後，協助校園舞獅迎賓',onClick:()=>{if(!root.RealmQuests.solved('zone4',w.gameState.realmPuzzles?.zone4)){w.showToast('先完成操場的運動任務，再沿林蔭小徑到新港國小協助迎賓！');return;}if(manager.switchZone('zone12'))w.adventureProgress?.save(true);}};entrance.add(hit);w.interactables.push(hit);}
 const api={build,buildEntrance,colliders:()=>[...walls,...furniture],bounds:{minX:-11.7,maxX:11.7,minZ:-17.7,maxZ:9.7}};root.SchoolScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
