/* Campus rebuilt from user-supplied entrance, library, stage and athletics-side photographs.
   Recognizable architecture with a compact, accessible gameplay layout, not a surveyed replica. */
(function(root){
 'use strict';
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const walls=[box(-12,-4,.3,28),box(12,-4,.3,28),box(0,-18,24,.3),box(-9.25,-10,5.5,.25),box(0,-10,7,.25),box(9.25,-10,5.5,.25),box(0,-16.8,.25,2.4),box(0,-11.2,.25,2.4)];
 const furniture=[box(-7,-15,2,1.3),box(-2,-15,2,1.3),box(7,-15,2,1.3),box(2,-15,2,1.3),box(7,-5,3.8,2.4),box(-10.3,-14,2,6),box(-4,-5,4.6,2.4),box(0,6.8,2.4,1),box(-5.6,-17.25,4.4,1.5),box(-9,7.5,4,2.4)];
 function sign(T,text,w=3,plain=false){const c=root.document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');if(!plain){ctx.fillStyle='#1c4b59';ctx.fillRect(0,0,1024,256);ctx.strokeStyle='#e4c17a';ctx.lineWidth=10;ctx.strokeRect(12,12,1000,232);}ctx.fillStyle=plain?'#e9bd56':'#fff8df';ctx.font='bold '+(plain?(text.length<9?100:/[一-鿿]/.test(text)?44:26):66)+'px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,128,950);const tex=new T.CanvasTexture(c);tex.encoding=T.sRGBEncoding;return new T.Mesh(new T.PlaneGeometry(w,w/4),new T.MeshBasicMaterial({map:tex,transparent:plain,depthWrite:!plain}));}
 function build(manager,group){
  const T=root.THREE,w=manager.world,geo={box:new T.BoxGeometry(1,1,1),sphere:new T.SphereGeometry(1,16,12),cylinder:new T.CylinderGeometry(1,1,1,20),torus:new T.TorusGeometry(1,.1,8,24)};
  const mat={wall:new T.MeshStandardMaterial({color:0xf1e8d9,map:manager.tex.restaurantPlaster,roughness:.94}),brick:new T.MeshStandardMaterial({color:0x84433d,roughness:.9}),wood:new T.MeshStandardMaterial({color:0xc8a77d,map:manager.tex.restaurantWood,roughness:.72}),stone:new T.MeshStandardMaterial({color:0xe0ded4,map:manager.tex.marbleFountain,roughness:.7}),blue:new T.MeshStandardMaterial({color:0x265766,roughness:.55}),green:new T.MeshStandardMaterial({color:0x42794c,roughness:.9}),white:new T.MeshStandardMaterial({color:0xfff7e6,roughness:.65}),gold:new T.MeshStandardMaterial({color:0xe6b850,metalness:.4,roughness:.42}),red:new T.MeshStandardMaterial({color:0xb73d3d,roughness:.65}),black:new T.MeshStandardMaterial({color:0x202b32,roughness:.55}),glass:new T.MeshStandardMaterial({color:0x95c8d2,metalness:.2,roughness:.28}),floor:new T.MeshStandardMaterial({color:0xa72e3c,roughness:.98}),concrete:new T.MeshStandardMaterial({color:0xa5a6a2,roughness:.92}),aluminum:new T.MeshStandardMaterial({color:0xdce3e4,metalness:.55,roughness:.42}),coral:new T.MeshStandardMaterial({color:0xcb8987,roughness:.86}),cyan:new T.MeshStandardMaterial({color:0x42bad0,roughness:.65}),stageGreen:new T.MeshStandardMaterial({color:0x164b40,roughness:.85}),orange:new T.MeshStandardMaterial({color:0xf4823b,roughness:.8}),purple:new T.MeshStandardMaterial({color:0x777aac,roughness:.78}),yellow:new T.MeshStandardMaterial({color:0xdec855,roughness:.78})};
  // Material colours are authored in sRGB; linear conversion prevents pastel washout.
  for(const material of Object.values(mat))material.color.convertSRGBToLinear();
  const staticMeshes=[];function mesh(kind,m,x,y,z,a,b,c,dynamic=false){const o=new T.Mesh(geo[kind],mat[m]);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=o.receiveShadow=true;group.add(o);if(!dynamic)staticMeshes.push(o);return o;}const b=(m,x,y,z,a,c,d,dyn=false)=>mesh('box',m,x,y,z,a,c,d,dyn);
  function label(text,x,y,z,width=3,rotation=0,plain=false){const o=sign(T,text,width,plain);o.position.set(x,y,z);o.rotation.y=rotation;group.add(o);return o;}
  function target(id,text,x,y,z,a=2,c=1.4,d=1){const o=new T.Mesh(new T.BoxGeometry(a,c,d),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'school_'+id,name:text,label:text,hint:'口說辨識通過才完成步驟',onClick:()=>root.SchoolChapter.open(id)};group.add(o);w.interactables.push(o);return o;}

  // Red forecourt and a three-storey grey school; ground-floor passages stay open.
  b('floor',0,-.12,-4,24,.22,28);b('stone',0,-.06,-14,24,.12,8);
  b('wall',6,3.75,-14,12,.2,8);b('wall',-6,7.15,-14,12,.2,8);
  for(const c of walls){const x=(c.minX+c.maxX)/2,z=(c.minZ+c.maxZ)/2,a=c.maxX-c.minX,d=c.maxZ-c.minZ;
   if(d>20){b('wall',x,3.45,-14,a,6.9,8);b('stone',x,.32,0,a,.64,20);b('aluminum',x,1.0,0,.08,.07,20);for(let zz=-9;zz<=9;zz+=1)b('aluminum',x,.66,zz,.045,.66,.045);}
   else b(z===-10?'concrete':'wall',x,z===-18?3.45:1.85,z,a,z===-18?6.9:3.7,d);
  }
  const lawn=new T.MeshStandardMaterial({color:0x65864d,roughness:.98});
  lawn.color.convertSRGBToLinear();
  const outdoor=new T.Mesh(new T.BoxGeometry(90,.1,65),lawn);outdoor.position.set(-10,-.24,3);outdoor.receiveShadow=true;group.add(outdoor);
  function palm(x,z,height=7){
   mesh('cylinder','stone',x,height/2,z,.16,height,.16);
   for(let y=.35;y<height;y+=.22)mesh('torus','concrete',x,y,z,.17,.17,.17).rotation.x=Math.PI/2;
   for(let a=0;a<8;a++){const angle=a*Math.PI/4;
    for(let j=0;j<5;j++){const r=.35+j*.43,yy=height+.25+Math.sin(j*.7)*.25-j*.19;
     const leaf=mesh('sphere','green',x+Math.cos(angle)*r,yy,z+Math.sin(angle)*r,.54,.035,.19);leaf.rotation.y=-angle;leaf.rotation.z=-.13*j;}
   }
  }
  for(const x of [-14,14])for(const z of [1,8])palm(x,z,7.2);
  // Grid aluminium windows and narrow coloured window surrounds, as in the photographs.
  function windowBay(x,y,z,width=3.5,height=1.95,accent=null){
   if(accent)b(accent,x,y,z-.035,width+.2,height+.2,.12);
   b('glass',x,y,z,width,height,.05);
   for(let i=0;i<=4;i++)b('aluminum',x-width/2+width*i/4,y,z+.05,.045,height+.09,.075);
   for(const yy of [y-height/2,y,y+height/2])b('aluminum',x,yy,z+.05,width+.09,.045,.075);
   b('stone',x,y-height/2-.075,z+.04,width+.2,.09,.2);
  }
  for(const x of [-9,-5,5,9])windowBay(x,2.15,-17.72,3.45,1.7);
  for(const x of [-9,-5,-1,3,7,10.8]){
   for(const y of [5.35,8.55]){b('concrete',x,y,-10.13,3.9,3.1,.25);if(x===-5&&y===5.35){windowBay(x,5.85,-9.96,3.2,.48,'green');windowBay(x-1,4.85,-9.96,1.35,.4,'coral');windowBay(x+1,4.85,-9.96,1.35,.4,'purple');}else windowBay(x,y,-9.96,x===10.8?2.6:3.45,1.95);}
  }
  b('concrete',6,3.95,-14,12,.24,8.4);for(const y of [7.0,10.15])b('concrete',0,y,-14,24,.24,8.4);
  // Library clerestories preserve the open double-height interior below the second slab.
  for(const x of [-9,-5,-1])windowBay(x,5.6,-17.72,3.45,1.3);
  for(const x of [-11,-7,-3,3,7,11])mesh('cylinder','brick',x,1.73,-9.42,.14,3.46,.14);
  b('concrete',0,3.53,-9.2,24,.66,1.55);
  label('新竹縣新港國民小學',0,3.68,-8.40,11.5,0,true);
  label('Hsinchu County XinGang Elementary School',0,3.29,-8.40,9.3,0,true);
  label('閱讀角 · 校史線索',-5,2.95,-9.48,2.3);label('CLASSROOM · 教室',5,2.95,-9.48,2.3);
  // Balloon/cloud and airplane reliefs flanking the gold entrance lettering.
  mesh('sphere','red',-8.7,3.65,-8.33,.48,.65,.10);for(const x of [-8.95,-8.65])b('cyan',x,3.65,-8.20,.16,.85,.06);
  b('gold',-8.7,2.94,-8.28,.4,.26,.12);for(const x of [-9.8,-9.5,-9.2])mesh('sphere','white',x,3.24,-8.3,.25,.17,.08);
  mesh('sphere','white',8.6,3.52,-8.27,.7,.25,.14);b('white',8.6,3.52,-8.25,.35,1.1,.16).rotation.z=.65;
  b('red',8.42,3.88,-8.13,.35,.18,.1).rotation.z=.65;b('red',8.81,3.18,-8.13,.35,.18,.1).rotation.z=.65;
  b('white',9.15,3.8,-8.3,.17,.45,.1).rotation.z=-.5;
  // Athletics-side wing: open corridors, colourful parapets and the tall stair tower.
  b('concrete',-27,5.1,-14,5,10.2,8);
  for(let y=1.8;y<=8.2;y+=3.2){windowBay(-27,y,-9.91,2,2.1);for(const x of [-28.4,-27.5,-26.6,-25.7])b(['green','yellow','purple','coral'][Math.round((x+28.4)/.9)],x,5.1,-9.8,.13,8.8,.12);}
  for(const y of [3.25,6.45,9.65]){
   b('concrete',-19.5,y,-14,10,.24,8);
   for(const x of [-23.5,-20,-16.5]){b('concrete',x,y-1.5,-9.8,.22,3,.24);b('concrete',x+1.5,y-2.1,-9.8,2.8,.75,.22);
    b(y===3.25?'green':y===6.45?'coral':'yellow',x+1.5,y-2.08,-9.66,2.55,.54,.06);windowBay(x+1.5,y-1.3,-15.3,2.5,1.1);}
  }
  // Running track bordering the field; long uninterrupted surfaces avoid image seams.
  b('floor',-24,-.1,3,20,.12,2.8);for(const z of [1.7,2.8,4.3])b('white',-24,-.025,z,20,.015,.035);
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

  // Tiled gate piers and guardhouse, with an open centre for the playable entrance.
  for(const x of [-8,-4,4,8]){b('coral',x,.85,9.7,.55,1.7,.55);b('aluminum',x,.9,9.7,3.45,.055,.065);}
  b('coral',-9,1.3,7.5,4,2.6,2.4);b('black',-9,2.7,7.5,4.3,.23,2.7);windowBay(-9,1.5,8.73,2.6,1.3);
  for(const x of [-8,8]){b('wood',x,.65,3,3,.12,.65);b('wood',x,1.02,3.3,3,.5,.1);for(const xx of [-1,1])b('aluminum',x+xx,.33,3,.12,.65,.55);}
  // Library signature: orange stair wall, cyan perforated rail and sloped book shelving.
  for(let n=0;n<12;n++){const z=-11.25-n*.48,y=.12+n*.255;b('stone',-10.3,y/2,z,1.7,y,.5);}
  for(let n=0;n<12;n++)b('orange',-9.35,.62+n*.13,-11.25-n*.48,.14,1.24+n*.26,.5);
  b('wood',-9.25,1.8,-14,.17,.17,6.6).rotation.x=-.48;
  b('wood',-10.25,3.22,-16.8,3.1,.17,2);
  for(const z of [-17.8,-15.8]){b('cyan',-10.25,4.1,z,3.15,.09,.08);b('cyan',-10.25,3.32,z,3.15,.09,.08);
   for(let x=-11.75;x<=-8.75;x+=.1)b('cyan',x,3.7,z,.025,.75,.025);for(let y=3.4;y<=4.0;y+=.1)b('cyan',-10.25,y,z,3.15,.025,.025);}
  for(let n=0;n<10;n++){const z=-11.4-n*.55,top=.6+n*.27;
   b('wood',-9.13,top/2,z,.11,top,.5);b('wood',-8.78,top,z,.75,.08,.5);
   for(let j=0;j<4;j++)b(['red','blue','gold','green'][j],-8.84,.32+n*.18,z-.16+j*.1,.34,.4,.065);
  }
  // Exposed mesh catwalk and high beams of the actual double-height reading room.
  for(const z of [-17,-12]){b('aluminum',-10.6,6.15,z,2.2,.1,.12);}
  for(let z=-17;z<=-11.5;z+=.3)b('aluminum',-10.6,6.13,z,2.2,.04,.035);
  for(const x of [-11.6,-9.6]){b('aluminum',x,6.65,-14,.045,1,6);b('aluminum',x,6.2,-14,.045,.08,6);}
  for(const z of [-16,-12])b('wall',-6,6.88,z,12,.32,.45);
  // Wood-floor book nook and orange/green polygon reading seats.
  b('wood',-5.5,.025,-17,5,.05,1.8);
  function nook(x,m){
   b(m,x,.68,-17.5,1.15,1.36,.25);b('wood',x,.4,-17.16,.9,.13,.7);b('black',x,.52,-17.17,.85,.18,.65);
   for(const side of [-1,1]){b(m,x+side*.58,.75,-17.05,.12,1.1,.8);b(m,x+side*.43,1.42,-17.05,.12,.5,.8).rotation.z=side*.65;}
   b(m,x,1.61,-17.05,.68,.12,.8);
  }
  nook(-6.8,'orange');nook(-4.4,'green');
  for(const x of [-7.7,-5.6,-3.5])b('wood',x,1.05,-17.65,.08,2.1,.35);
  for(const y of [.25,.9,1.75,2.1])b('wood',-5.6,y,-17.65,4.3,.08,.35);
  for(let i=0;i<48;i++)b(['red','blue','gold','white'][i%4],-7.5+(i%24)*.165,i<24?.56:1.35,-17.62,.12,.48,.22);
  b('wood',0,.62,6.8,2.4,1.2,1);b('white',0,1.25,6.8,1.2,.04,.6);label('SCHOOL · 校園任務',0,1.7,6.7,1.5);target('school','校門迎賓桌 · SCHOOL',0,1.6,6.8,2.6,1.4,1.2);
  // Lion-dance props: painted head, curled brows, mouth, teeth and soft tassel beard.
  b('wood',7,.2,-5,3.8,.35,2.4);const head=new T.Group();head.position.set(7,1.65,-5);group.add(head);
  function part(kind,m,x,y,z,a,c,d){const o=mesh(kind,m,x,y,z,a,c,d,true);group.remove(o);head.add(o);return o;}
  part('sphere','green',0,.15,0,.85,.75,.7);part('sphere','cyan',0,.25,.05,.72,.66,.64);for(const x of [-.42,.42]){part('sphere','white',x,.42,.52,.3,.3,.2);part('sphere','black',x,.43,.69,.13,.15,.06);part('sphere','white',x-.035,.49,.74,.045,.045,.025);part('torus','gold',x,.7,.55,.32,.15,.25);part('torus','blue',x,.7,.61,.23,.11,.19);part('sphere','red',x*1.8,.53,-.05,.25,.3,.16);}
  part('sphere','red',0,.12,.78,.25,.16,.15);part('sphere','black',0,-.27,.56,.5,.23,.12);part('sphere','red',0,-.46,.6,.58,.09,.2);for(const x of [-.3,-.1,.1,.3])part('box','white',x,-.16,.72,.14,.17,.1);for(let n=0;n<15;n++){const a=n*Math.PI*2/15;part('sphere','white',Math.cos(a)*.79,.2+Math.sin(a)*.67,.05,.13,.13,.12);}for(let n=0;n<9;n++)part('cylinder','gold',-.48+n*.12,-.79+Math.abs(4-n)*.04,.6,.025,.6,.025);
  // Embroidered body cloth and layered crest recall the school's colourful dragon/phoenix dance props.
  for(let n=0;n<13;n++){part('sphere',n%3===0?'red':n%3===1?'green':'gold',Math.sin(n*.6)*.12,.05-n*.018,-.65-n*.15,.65-.018*n,.54,.18);}
  for(const side of [-1,1])for(let n=0;n<5;n++){const feather=part('sphere',['cyan','gold','orange','red','blue'][n],side*(.36+n*.09),1.0+n*.13,-.16,.09,.38,.08);feather.rotation.z=side*-.5;}
  label('LION · 龍鳳舞獅特色',7,3.05,-5.4,2.4);target('lion','舞獅獅頭 · LION',7,1.6,-3.7,3,1.8,1);
  mesh('cylinder','red',3,1,-5,.8,.7,.8);mesh('cylinder','gold',3,1.38,-5,.81,.07,.81);for(const x of [2.45,3.55])b('wood',x,.42,-5,.09,.85,.1);for(const x of [2.65,3.35])b('wood',x,1.46,-5,.05,.05,1);label('DRUM · 咚 咚 鏘',3,2.2,-5.2,2.8);target('drum','迎賓鼓台 · DRUM 與鼓點',3,1.65,-4.2);
  // The actual pink/cyan assembly stage, green base, painted mural and track colours.
  b('stageGreen',-4,.25,-5,4.6,.5,2.4);b('stone',-4,.52,-5,4.55,.06,2.35);
  for(const x of [-6,-2])mesh('cylinder','cyan',x,1.85,-4.05,.13,2.65,.13);
  b('wall',-4,1.87,-6.13,4.55,2.65,.16);b('stageGreen',-4,3.23,-5,4.9,.18,2.65);b('cyan',-4,3.41,-5,5,.2,2.7);b('coral',-4,3.65,-3.6,2.85,.55,.15);
  label('司 令 台',-4,3.65,-3.5,2.65,0,true);label('新 港 國 小',-4,.27,-3.77,3.8,0,true);
  for(let n=0;n<4;n++){const rainbow=mesh('torus',['red','yellow','cyan','purple'][n],-4,1.6,-6.01,1.2-n*.15,.65-n*.07,.12);rainbow.scale.z=.1;}
  for(const x of [-5.45,-2.55]){b('green',x,1.4,-5.93,.14,1.4,.08);for(const dx of [-.2,0,.2])mesh('sphere','green',x+dx,2.12,-5.92,.32,.35,.055);}
  for(const x of [-4.8,-3.2]){mesh('sphere','gold',x,1.62,-5.84,.14,.14,.045);b('cyan',x,1.32,-5.84,.22,.37,.06);for(const dx of [-.07,.07])b('green',x+dx,1.05,-5.84,.06,.22,.06);}
  for(const x of [-5.8,-2.2]){const speaker=mesh('cylinder','black',x,3,-3.94,.15,.17,.15);speaker.rotation.x=Math.PI/2;}
  b('blue',-4,-.013,-2.8,5,.025,.43);b('white',-4,.007,-2.53,5,.016,.04);
  label('WELCOME · 迎賓台',-4,1.02,-3.73,2.1);target('welcome','迎賓台 · WELCOME',-4,1.6,-4.1,3,1.8,1);
  const banner=label('Welcome to our school!',-4,2.65,-5.88,3.1);banner.visible=false;
  const exit=target('exit','南側校門 · 返回冒險操場',0,1.6,9.3,3,2,.7);exit.userData.onClick=()=>{if(manager.switchZone('zone4')){w.player.pos.set(-3,1.6,8);w.player.yaw=Math.PI;w.adventureProgress?.save(true);}};
  // Batch the moving prop in local space as well as the static campus.
  head.updateMatrix();const headBatches=new Map();for(const o of head.children){o.updateMatrix();const key=o.geometry.uuid+':'+o.material.uuid;if(!headBatches.has(key))headBatches.set(key,[]);headBatches.get(key).push(o);}for(const list of headBatches.values()){const inst=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;for(const o of list)head.remove(o);head.add(inst);}
  group.updateMatrixWorld(true);const batches=new Map();for(const o of staticMeshes){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const list of batches.values()){const first=list[0],inst=new T.InstancedMesh(first.geometry,first.material,list.length);list.forEach((o,i)=>inst.setMatrixAt(i,o.matrixWorld));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of list)o.parent.remove(o);}
  const sun=new T.DirectionalLight(0xfff7ed,1.1);sun.position.set(-7,16,8);sun.target.position.set(0,0,-6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-24,right:24,top:26,bottom:-26,near:.5,far:55});sun.shadow.bias=-.0003;sun.shadow.normalBias=.03;group.add(sun,sun.target);for(const x of [-5,5]){const light=new T.PointLight(0xffefce,.45,10,2);light.position.set(x,3.1,-14);group.add(light);}
  w.animators.push(time=>{if(root.SchoolChapter.solved(w.gameState.realmPuzzles.zone12)&&!w.settings?.reducedMotion)head.rotation.x=Math.sin(time*2)*.08;else head.rotation.x=0;});w.schoolRefs={banner,card};root.HarmonicaScene?.buildEntrance?.(manager,group);root.SchoolChapter.sync?.();
  if (root.ModelAssetManager && root.ModelAssetManager.isReady && root.ModelAssetManager.models.has('lion_head')) {
    const lionModel = root.ModelAssetManager.cloneModel('lion_head');
    if (lionModel) {
      lionModel.scale.set(1.1, 1.1, 1.1);
      lionModel.position.set(0, 0, 0);
      head.add(lionModel);
      head.children.forEach(c => { if (c !== lionModel) c.visible = false; });
    }
  }
 }
 function buildEntrance(manager,group){const T=root.THREE,w=manager.world;const entrance=new T.Group();entrance.position.set(-3,0,10);group.add(entrance);const wood=new T.MeshStandardMaterial({color:0xc7a46c,map:manager.tex.restaurantWood,roughness:.8});for(const x of [-1.4,1.4]){const p=new T.Mesh(new T.BoxGeometry(.18,3.4,.2),wood);p.position.set(x,1.7,0);entrance.add(p);}const label=sign(T,'新港國小 · 舞獅迎賓',4);label.position.set(0,3.25,.15);label.rotation.y=Math.PI;entrance.add(label);const hit=new T.Mesh(new T.BoxGeometry(2.7,2.8,1),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));hit.position.y=1.4;hit.userData={id:'athletic_school_entry',name:'新港國小校園委託',label:'新港國小校園委託',hint:'完成操場任務後，協助校園舞獅迎賓',onClick:()=>{if(!root.RealmQuests.solved('zone4',w.gameState.realmPuzzles?.zone4)){w.showToast('先完成操場的運動任務，再沿林蔭小徑到新港國小協助迎賓！');return;}if(manager.switchZone('zone12'))w.adventureProgress?.save(true);}};entrance.add(hit);w.interactables.push(hit);}
 const api={build,buildEntrance,colliders:()=>[...walls,...furniture],bounds:{minX:-11.7,maxX:11.7,minZ:-17.7,maxZ:9.7}};root.SchoolScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
