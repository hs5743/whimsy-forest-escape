/* Original gallery architecture, diagrams and 3D chromatic harmonica exhibits. */
(function(root){
 'use strict';
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const walls=[box(-14,-4,.3,30),box(14,-4,.3,30),box(0,-19,28,.3),box(-8,11,12,.3),box(8,11,12,.3),box(-8,-8,12,.25),box(8,-8,12,.25)];
 const furniture=[box(0,-2,7.5,2.4),box(-8,4,4,1.5),box(8,4,4,1.5),box(-8,-13,4.6,2.2),box(8,-13,4.6,2.2),box(-10,-2.8,2,2),box(10,-2.8,2,2),box(0,-17,7,2.2),box(-5.3,7,3,.95),box(5.3,7,3,.95)];
 const bounds={minX:-13.65,maxX:13.65,minZ:-18.65,maxZ:10.65};
 function canvas(T,kind,title,subtitle){
  const c=root.document.createElement('canvas');c.width=1024;c.height=768;const q=c.getContext('2d');
  q.fillStyle=kind==='floor'?'#e7e3d8':'#133d47';q.fillRect(0,0,1024,768);
  if(kind==='floor'){
   q.strokeStyle='#b4af9e';q.lineWidth=2;for(let x=0;x<=1024;x+=256){q.beginPath();q.moveTo(x,0);q.lineTo(x,768);q.stroke();}for(let y=0;y<=768;y+=256){q.beginPath();q.moveTo(0,y);q.lineTo(1024,y);q.stroke();}
   q.strokeStyle='#c7b889';q.lineWidth=5;q.beginPath();q.moveTo(0,0);q.lineTo(1024,768);q.moveTo(1024,0);q.lineTo(0,768);q.stroke();
   q.strokeStyle='rgba(140,148,146,.17)';q.lineWidth=1;for(let n=0;n<25;n++){q.beginPath();q.moveTo(n*47,0);q.bezierCurveTo(n*47+220,220,n*47-170,420,n*47+180,768);q.stroke();}
  }else{
   q.strokeStyle='#d1b36f';q.lineWidth=3;q.strokeRect(22,22,980,724);q.strokeRect(34,34,956,700);
   q.strokeStyle='rgba(117,189,190,.13)';q.lineWidth=2;for(let y=0;y<768;y+=42){q.beginPath();for(let x=0;x<1024;x+=8){const yy=y+Math.sin(x/62)*15;if(x===0)q.moveTo(x,yy);else q.lineTo(x,yy);}q.stroke();}
   q.fillStyle='#f3deb0';q.font='bold 46px sans-serif';q.textAlign='center';q.fillText(title,512,97,900);q.font='24px sans-serif';q.fillStyle='#b4d2d4';q.fillText(subtitle,512,146,900);
   if(kind==='mouth'||kind==='hero'){
    q.fillStyle='#b7c6c9';q.fillRect(130,300,730,145);q.fillStyle='#15313c';for(let n=0;n<12;n++){q.fillRect(147+n*57,350,36,55);q.fillStyle='#f4dcaa';q.font='21px sans-serif';q.fillText(n+1,165+n*57,335);q.fillStyle='#15313c';}
    q.fillStyle='#dfba69';q.fillRect(863,349,30,45);q.fillStyle='#f4dcaa';q.font='30px sans-serif';q.fillText('1 → 12',512,505);q.font='28px sans-serif';q.fillText(kind==='mouth'?'吹嘴 · MOUTHPIECE  /  滑鍵 · SLIDE':'C 調 · 12 孔 · 48 簧片',512,566);
   }else if(kind==='structure'){
    const layers=[['琴蓋 · COVER','#bccbd0'],['簧板／簧片 · REEDS','#d9b65f'],['琴格 · COMB','#aa7053'],['吹嘴／滑鍵 · SLIDE','#82bcc1']];
    for(let i=0;i<4;i++){q.fillStyle=layers[i][1];q.fillRect(135,220+i*90,385,43);q.fillStyle='#f1e0be';q.textAlign='left';q.font='27px sans-serif';q.fillText(layers[i][0],560,254+i*90);q.strokeStyle='#89b7b7';q.beginPath();q.moveTo(320,270+i*90);q.lineTo(320,299+i*90);q.stroke();}
    q.textAlign='center';q.font='28px sans-serif';q.fillText('氣流 → 金屬簧片振動 → 聲音',512,652);
   }else if(kind==='slide'){
    const lines=['第 1 孔 · BLOW 吹 / DRAW 吸','放開滑鍵    C4       D4','按下滑鍵    C♯4      D♯4','氣道切換另一組簧片 → 升半音'];
    q.font='bold 36px sans-serif';for(let i=0;i<4;i++){q.fillStyle=i%2?'#efc86c':'#a3dadd';q.fillText(lines[i],512,270+i*95,920);}
    for(let n=0;n<12;n++){q.fillStyle=n%2?'#d7b469':'#69b8bd';q.fillRect(160+n*60,630,44,18+(n%3)*18);}
   }else if(kind==='direction'){
    q.strokeStyle='#d8b46a';q.lineWidth=6;q.beginPath();q.moveTo(150,470);q.lineTo(870,260);q.stroke();q.fillStyle='#9ed3d2';for(let n=0;n<12;n++){q.beginPath();q.arc(150+n*65,470-n*19,13,0,Math.PI*2);q.fill();}
    q.font='bold 38px sans-serif';q.fillStyle='#f1d399';q.fillText('LEFT  ←  低音                 高音  →  RIGHT',512,585,915);q.font='26px sans-serif';q.fillText('吹嘴朝向演奏者 · 按鈕在右手側',512,646);
   }else if(kind==='score'){
    q.strokeStyle='#96bec1';q.lineWidth=2;for(let y=310;y<=430;y+=30){q.beginPath();q.moveTo(110,y);q.lineTo(920,y);q.stroke();}
    const labels=['C','D','E','F','G'];for(let n=0;n<5;n++){q.fillStyle='#e6c079';q.beginPath();q.ellipse(225+n*140,430-n*15,18,12,-.3,0,Math.PI*2);q.fill();q.fillRect(240+n*140,350-n*15,3,80);q.font='36px sans-serif';q.fillText(labels[n],230+n*140,505);q.font='28px sans-serif';q.fillText(['1 吹','1 吸','2 吹','2 吸','3 吹'][n],230+n*140,560);}
    q.font='28px sans-serif';q.fillStyle='#a8d3d4';q.fillText('放開滑鍵 · 自然呼吸 · 一次練一孔',512,650);
   }else{
    q.strokeStyle='#d3b46c';q.lineWidth=5;for(let n=0;n<6;n++){q.beginPath();q.arc(512,412,100+n*24,-Math.PI*.8,Math.PI*.8);q.stroke();}
    for(let n=0;n<9;n++){q.fillStyle=n%2?'#e8c785':'#8bd0d3';q.beginPath();q.ellipse(260+n*65,365+Math.sin(n)*100,18,12,-.25,0,Math.PI*2);q.fill();q.fillRect(275+n*65,280+Math.sin(n)*100,4,85);}
    q.font='29px sans-serif';q.fillStyle='#f0d79c';q.fillText('探索形狀 · 看懂結構 · 感受半音',512,657);
   }
  }
  const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;return tex;
 }
 function build(manager,group){
  const T=root.THREE,w=manager.world;
  const shape=new T.Shape();shape.moveTo(-.4,-.5);shape.lineTo(.4,-.5);shape.quadraticCurveTo(.5,-.5,.5,-.4);shape.lineTo(.5,.4);shape.quadraticCurveTo(.5,.5,.4,.5);shape.lineTo(-.4,.5);shape.quadraticCurveTo(-.5,.5,-.5,.4);shape.lineTo(-.5,-.4);shape.quadraticCurveTo(-.5,-.5,-.4,-.5);
  const rounded=new T.ExtrudeGeometry(shape,{depth:1,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1});rounded.center();
  const geo={box:new T.BoxGeometry(1,1,1),round:rounded,sphere:new T.SphereGeometry(1,16,12),cylinder:new T.CylinderGeometry(1,1,1,24),torus:new T.TorusGeometry(1,.055,8,40)};
  const reflectionFaces=[];for(let face=0;face<6;face++){const c=root.document.createElement('canvas');c.width=c.height=256;const q=c.getContext('2d');q.fillStyle='#59676d';q.fillRect(0,0,256,256);q.fillStyle='#f1f2e8';q.fillRect(0,0,256,65);q.fillRect(16,76,45,145);q.fillRect(193,76,45,145);q.fillStyle='#b8a176';q.fillRect(0,230,256,26);reflectionFaces.push(c);}const reflections=new T.CubeTexture(reflectionFaces);reflections.encoding=T.sRGBEncoding;reflections.needsUpdate=true;
  const materials={
   wall:new T.MeshStandardMaterial({color:0xe4ded0,map:manager.tex.restaurantPlaster,roughness:.92}),
   teal:new T.MeshStandardMaterial({color:0x173b44,roughness:.8}),
   wood:new T.MeshStandardMaterial({color:0x98775b,map:manager.tex.restaurantWood,roughness:.55}),
   silver:new T.MeshStandardMaterial({color:0xc8d6db,metalness:.85,roughness:.23}),
   gold:new T.MeshStandardMaterial({color:0xd4b171,metalness:.7,roughness:.35}),
   black:new T.MeshStandardMaterial({color:0x192729,roughness:.65}),
   amber:new T.MeshStandardMaterial({color:0xc79059,roughness:.6}),
   cyan:new T.MeshStandardMaterial({color:0x68b7bc,roughness:.5}),
   red:new T.MeshStandardMaterial({color:0xc57a64,roughness:.6}),
   white:new T.MeshStandardMaterial({color:0xf5ead7,roughness:.6}),
   floor:new T.MeshStandardMaterial({color:0xffffff,map:canvas(T,'floor','',''),roughness:.57,metalness:.08})
  };
  materials.silver.envMap=reflections;materials.gold.envMap=reflections;materials.silver.envMapIntensity=materials.gold.envMapIntensity=1;
  materials.floor.map.wrapS=materials.floor.map.wrapT=T.RepeatWrapping;materials.floor.map.repeat.set(5,5);
  for(const m of Object.values(materials))m.color.convertSRGBToLinear();
  const statics=[];function mesh(k,m,x,y,z,a,b,c,dynamic=false){const o=new T.Mesh(geo[k],materials[m]);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=o.receiveShadow=true;group.add(o);if(!dynamic)statics.push(o);return o;}
  const b=(m,x,y,z,a,h,d,dyn=false)=>mesh('box',m,x,y,z,a,h,d,dyn);
  function panel(kind,title,subtitle,x,y,z,width=4,height=3,rotation=0){
   const frame=b('gold',x,y,z,width+.14,height+.14,.12);frame.rotation.y=rotation;
   const p=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:canvas(T,kind,title,subtitle)}));p.position.set(x+Math.sin(rotation)*.075,y,z+Math.cos(rotation)*.075);p.rotation.y=rotation;group.add(p);return p;
  }
  function target(id,text,x,y,z,a=2,h=1.8,d=.7){const o=new T.Mesh(new T.BoxGeometry(a,h,d),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'harmonica_'+id,name:text,label:text,hint:'探索展示後口說 '+id.toUpperCase(),onClick:()=>root.HarmonicaChapter.open(id)};group.add(o);w.interactables.push(o);return o;}
  b('floor',0,-.1,-4,28,.2,30);b('wall',0,5.85,-4,28,.22,30);
  for(const c of walls)b('wall',(c.minX+c.maxX)/2,2.9,(c.minZ+c.maxZ)/2,c.maxX-c.minX,5.8,c.maxZ-c.minZ);
  for(const z of [-18.75,-8.2,10.8])b('gold',0,4.6,z,27.8,.055,.06);
  b('teal',0,4.9,-8,28,1.5,.32);b('gold',0,4.18,-8,28,.07,.35);
  // Deep timber wall battens, brass trim and graphic acoustic panels.
  for(const x of [-13.76,13.76]){
   b('teal',x,.7,-4,.12,1.4,29.8);b('gold',x,1.43,-4,.15,.055,29.8);
   for(let z=-18.5;z<=10.5;z+=.6)b('wood',x,2.9,z,.12,2.7,.055);
  }
  for(const x of [-12,-6,6,12]){b('teal',x,2.85,-8,.32,5.7,.55);b('gold',x,4.3,-7.65,.5,.06,.06);}
  for(const x of [-10,-5,0,5,10])b('wood',x,5.55,-4,.18,.38,29.9);
  for(const z of [-16,-10,-4,2,8])b('gold',0,5.34,z,27,.05,.12);
  for(const x of [-10,-5,0,5,10])for(const z of [-12,-2,7]){
   mesh('cylinder','gold',x,5.25,z,.12,.18,.12);const bulb=mesh('sphere','white',x,5.12,z,.1,.05,.1);bulb.material=materials.white;
  }
  // Original graphic murals with informative diagrams, not blank classroom walls.
  panel('ornament','掌心裡的音樂祕境','CHROMATIC HARMONICA GALLERY',0,4.85,-18.7,7,1.45);
  panel('structure','簧片的祕密','COVER / REED PLATE / COMB / SLIDE',-8,3.05,-18.73,6.6,3.9);
  panel('slide','半音階實驗室','C → C♯ / D → D♯',8,3.05,-18.73,6.6,3.9);
  panel('mouth','吹嘴與氣流','BLOW 吹氣 / DRAW 吸氣',-13.6,3.08,4,5,3.5,Math.PI/2);
  panel('score','我的五音練習','C D E F G · 滑鍵放開',13.6,3.08,4,5,3.5,-Math.PI/2);
  panel('direction','從左到右的音高地圖','演奏者視角 · C 調獨奏排列',-13.6,3.1,-3,5,3.2,Math.PI/2);
  panel('direction','方向與放鬆的握法','LEFT / RIGHT · 手握琴身',13.6,3.1,-3,5,3.2,-Math.PI/2);
  panel('hero','小小口琴 · 大大世界','12 孔 / 48 簧片 / 3 個八度',-7.2,3.1,10.75,7,3,Math.PI);
  panel('ornament','聲音的線條','用眼睛探索，用耳朵比較',7.2,3.1,10.75,7,3,Math.PI);
  // A central polished instrument on a dark, rounded stone pedestal.
  function pedestal(x,z,width=4,depth=1.5){mesh('round','teal',x,.6,z,width,1.2,depth);b('gold',x,1.22,z,width+.05,.055,depth+.04);}
  pedestal(0,-2,7.5,2.4);pedestal(-8,4);pedestal(8,4);pedestal(-8,-13,4.6,2.2);pedestal(8,-13,4.6,2.2);
  function harmonica(x,y,z,scale=1,spread=0,buttonDynamic=false){
   const len=6*scale;
   mesh('round','black',x,y,z,len,.26*scale,.82*scale);
   for(let n=0;n<12;n++)b('amber',x-len/2+(n+.5)*len/12,y+.02,z,.09*scale,.25*scale,.79*scale);
   const lower=mesh('round','silver',x,y-.27*scale-spread*.3,z,len,.23*scale,.93*scale);
   mesh('round','gold',x,y+.17*scale+spread*.45,z,len,.055*scale,.82*scale);mesh('round','gold',x,y-.16*scale-spread*.15,z,len,.055*scale,.82*scale);
   for(let n=0;n<24;n++){b('gold',x-len/2+(n+.5)*len/24,y-.18*scale-spread*.15,z-.05,.11*scale,.018*scale,.58*scale);b('gold',x-len/2+(n+.5)*len/24,y+.21*scale+spread*.45,z-.05,.11*scale,.018*scale,.58*scale);mesh('sphere','silver',x-len/2+(n+.5)*len/24,y+.22*scale+spread*.45,z-.26,.035*scale,.015*scale,.035*scale);}
   mesh('round','silver',x,y+.32*scale+spread,z,len,.24*scale,.95*scale);
   mesh('round','silver',x,y,z+.48*scale,len,.32*scale,.17*scale);
   for(let n=0;n<12;n++)mesh('round','black',x-len/2+(n+.5)*len/12,y,z+.577*scale,.29*scale,.18*scale,.015*scale);
   for(const xx of [-len/2+.17*scale,len/2-.17*scale])for(const yy of [y-.29*scale-spread*.3,y+.36*scale+spread])mesh('cylinder','gold',x+xx,yy,z,.065*scale,.035*scale,.065*scale);
   b('silver',x+len/2+.22*scale,y,z,.45*scale,.08*scale,.08*scale);
   const slide=mesh('round','silver',x+len/2+.48*scale,y,z,.18*scale,.35*scale,.37*scale,buttonDynamic);
   return {slide,restX:slide.position.x,lower};
  }
  for(const x of [-2.15,2.15]){b('silver',x,1.4,-2,.07,.33,.16);mesh('round','black',x,1.56,-2,.34,.12,.6);}
  harmonica(0,1.78,-2,1);
  const engravingCanvas=root.document.createElement('canvas');engravingCanvas.width=1024;engravingCanvas.height=128;const engraving=engravingCanvas.getContext('2d');engraving.fillStyle='#d7c397';engraving.font='bold 43px sans-serif';engraving.textAlign='center';engraving.fillText('CHROMATIC  12  ·  C SOLO',512,83);engraving.strokeStyle='#d7c397';engraving.lineWidth=3;for(const y of [23,108]){engraving.beginPath();engraving.moveTo(10,y);engraving.lineTo(1014,y);engraving.stroke();}const etched=new T.Mesh(new T.PlaneGeometry(3.8,.2),new T.MeshBasicMaterial({map:new T.CanvasTexture(engravingCanvas),transparent:true,depthWrite:false}));etched.position.set(0,2.1,-1.49);group.add(etched);
  for(const [x,z]of [[-8,4],[8,4],[-8,-13],[8,-13]])for(const dx of [-.8,.8]){b('silver',x+dx,1.39,z,.045,.33,.12);mesh('round','black',x+dx,1.53,z,.21,.09,.33);}
  harmonica(-8,1.62,4,.42);harmonica(8,1.62,4,.42);
  harmonica(-8,1.83,-13,.6,.86);const experiment=harmonica(8,1.85,-13,.6,0,true);
  // Enlarged vibrating reed, rivet, windsaver and air paths beside the exploded instrument.
  const reedMaterial=materials.gold.clone();reedMaterial.emissive.setHex(0x14605d);
  const reed=mesh('box','gold',-7.55,2.42,-12.25,.19,.03,.7,true);reed.material=reedMaterial;
  mesh('sphere','silver',-7.55,2.45,-12.52,.055,.025,.055);
  b('white',-8.25,2.44,-12.25,.19,.025,.64);
  for(let n=0;n<7;n++){const arrow=mesh('sphere','cyan',-8.8+n*.19,1.86,-12.4,.06,.03,.06);}
  // Direction pedestals and an ascending twelve-note sculptural ribbon.
  for(const x of [-10,10]){pedestal(x,-2.8,2,2);mesh('torus','gold',x,2.15,-2.8,.52,.52,.2);b('cyan',x,2.15,-2.55,.8,.045,.03);b('cyan',x+(x<0?-.31:.31),2.26,-2.55,.35,.045,.03).rotation.z=x<0?-.65:.65;}
  for(let n=0;n<12;n++){const x=-5.5+n;mesh('sphere',n%2?'gold':'cyan',x,3.95+n*.055,-6.55,.12,.12,.08);b('gold',x,4.2+n*.055,-6.55,.026,.4,.026);}
  // Intimate small stage, patterned rear wall, score stand and upholstered benches.
  mesh('round','wood',0,.23,-17,7,.46,2.2);b('gold',0,.49,-15.9,7,.04,.045);
  for(const x of [-2.2,2.2]){mesh('cylinder','black',x,1.1,-17,.045,1.25,.045);b('black',x,1.75,-17,1.1,.8,.08).rotation.x=-.12;}
  const banner=panel('score','小小口琴展演完成','This is our song.',0,2.68,-18.55,4.4,1.3);banner.visible=false;
  for(const x of [-5.3,5.3]){mesh('round','teal',x,.48,7,3,.55,.95);b('wood',x,.18,7,2.6,.35,.65);b('gold',x,.66,7.45,3,.035,.05);}
  target('small','完整口琴 · SMALL',0,1.7,.2,3,1.6,1);
  target('mouth','吹嘴與氣流 · MOUTH',-8,1.7,5,3,1.6,1);
  target('hand','分層簧片展示 · HAND',-8,1.85,-11.55,3,2,1);
  target('left','低音方向 · LEFT',-10,1.8,-1.4,2,1.7,1);
  target('right','高音方向 · RIGHT',10,1.8,-1.4,2,1.7,1);
  target('high','滑鍵變音台 · HIGH',8,1.8,-11.55,3,1.7,1);
  target('play','吹吸練習台 · PLAY',8,1.7,5,3,1.7,1);
  target('song','小小展演台 · SONG',0,1.8,-15.2,3,1.8,.7);
  const exit=target('exit','回新港校園',0,1.6,10.1,3,2,.8);exit.userData.onClick=()=>{if(manager.switchZone('zone12')){w.player.pos.set(0,1.6,-7.8);w.player.yaw=Math.PI;w.adventureProgress?.save(true);}};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of statics){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const list of batches.values()){const inst=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>inst.setMatrixAt(i,o.matrixWorld));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of list)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xe6eff2,0x665644,.58);group.add(hemi);
  const key=new T.DirectionalLight(0xffefd4,.9);key.position.set(4,10,5);key.target.position.set(0,0,-5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-20,right:20,top:25,bottom:-25,near:.5,far:45});key.shadow.bias=-.0003;key.shadow.normalBias=.035;group.add(key,key.target);
  for(const p of [[-8,4.8,4],[8,4.8,4],[-8,4.8,-13],[8,4.8,-13],[0,4.8,-3],[0,4.8,8]]){const light=new T.PointLight(0xffe7bd,.7,13,2);light.position.set(...p);group.add(light);}
  w.harmonicaRefs={banner,slide:experiment.slide,restX:experiment.restX,reed};
  w.animators.push(time=>{reed.rotation.x=w.settings?.reducedMotion||Date.now()>(root.HarmonicaChapter.demoUntil||0)?0:Math.sin(time*22)*.035;});root.HarmonicaChapter.sync?.();
  if (root.ModelAssetManager && root.ModelAssetManager.isReady && root.ModelAssetManager.models.has('chromatic_harmonica')) {
    const heroM = root.ModelAssetManager.cloneModel('chromatic_harmonica');
    if (heroM) {
      heroM.position.set(0, 1.25, -2);
      heroM.scale.set(1.5, 1.5, 1.5);
      group.add(heroM);
    }
  }
 }
 function buildEntrance(manager,group){
  const T=root.THREE,w=manager.world,door=new T.Group();door.position.set(0,0,-9.3);group.add(door);
  const teal=new T.MeshStandardMaterial({color:0x194a53,roughness:.8}),gold=new T.MeshStandardMaterial({color:0xd2b275,metalness:.5,roughness:.45});
  for(const x of [-1.18,1.18]){const post=new T.Mesh(new T.BoxGeometry(.12,2.9,.12),gold);post.position.set(x,1.45,0);door.add(post);}
  const plaque=new T.Mesh(new T.PlaneGeometry(2.5,.75),new T.MeshBasicMaterial({map:canvas(T,'hero','半音階口琴展示館','校園音樂翼 · 完成迎賓任務後入館')}));plaque.position.set(0,2.63,.12);door.add(plaque);
  const arch=new T.Mesh(new T.BoxGeometry(2.55,.18,.18),teal);arch.position.set(0,3.04,0);door.add(arch);
  const hit=new T.Mesh(new T.BoxGeometry(2.25,2.35,.85),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.35;hit.userData={id:'school_harmonica_entry',name:'半音階口琴展示館入口',label:'半音階口琴展示館',hint:'完成新港舞獅迎賓任務後，探索校園音樂翼',onClick:()=>{if(!root.SchoolChapter.solved(w.gameState.realmPuzzles?.zone12)){w.showToast('先完成新港的八步迎賓口說，再進入口琴展示館！');return;}if(manager.switchZone('zone13'))w.adventureProgress?.save(true);}};door.add(hit);w.interactables.push(hit);
 }
 const api={build,buildEntrance,colliders:()=>[...walls,...furniture],bounds};root.HarmonicaScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
