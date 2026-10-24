/* Language lounge: physical learning exhibits, collectible NPCs and minimal wayfinding. */
(function(root){
 'use strict';
 const bounds={minX:-12.6,maxX:12.6,minZ:-11.6,maxZ:10.6};
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const colliders=()=>[box(-13,-.5,.3,23),box(13,-.5,.3,23),box(0,-12,26,.3),box(-8,11,10,.3),box(8,11,10,.3),box(0,-7,7,2),box(-7,-3,3.2,2),box(7,-3,3.2,2),box(7,4,3.2,2),box(-7,4,3.2,2)];
 function signTexture(T,title,subtitle=''){
  const c=root.document.createElement('canvas');c.width=768;c.height=192;const q=c.getContext('2d');
  q.fillStyle='#244c51';q.fillRect(0,0,c.width,c.height);q.strokeStyle='#d8bd79';q.lineWidth=6;q.strokeRect(10,10,c.width-20,c.height-20);
  q.textAlign='center';q.fillStyle='#fff0cd';q.font='bold 39px sans-serif';q.fillText(title,c.width/2,subtitle?78:112,c.width-34);
  if(subtitle){q.fillStyle='#c4dcce';q.font='22px sans-serif';q.fillText(subtitle,c.width/2,139,c.width-34);}
  const texture=new T.CanvasTexture(c);texture.encoding=T.sRGBEncoding;return texture;
 }
 function build(manager,group){
  const T=root.THREE,w=manager.world,geo={box:new T.BoxGeometry(1,1,1),sphere:new T.SphereGeometry(1,20,14),cylinder:new T.CylinderGeometry(1,1,1,24),cone:new T.ConeGeometry(1,1,20),torus:new T.TorusGeometry(1,.06,8,48)};
  const colors={wall:0xe4dac4,wood:0x8f6647,teal:0x244c51,gold:0xc9a369,ivory:0xf4ead5,orange:0xc98750,green:0x83a88b,blue:0x8fb8c2,brown:0x806b5d,pink:0xd8aaa3,black:0x213c40};
  const mats={};for(const [k,color]of Object.entries(colors)){mats[k]=new T.MeshStandardMaterial({color,roughness:k==='gold'?.38:.68,metalness:k==='gold'?.55:0});mats[k].color.convertSRGBToLinear();}
  mats.wood.map=manager.tex.restaurantWood;mats.wall.map=manager.tex.restaurantPlaster;
  mats.glow=new T.MeshBasicMaterial({color:0xffe2ab});const statics=[];
  function mesh(k,m,x,y,z,a,b,c,dynamic=false){const o=new T.Mesh(geo[k],mats[m]);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=o.receiveShadow=true;group.add(o);if(!dynamic)statics.push(o);return o;}
  const b=(m,x,y,z,a,h,d)=>mesh('box',m,x,y,z,a,h,d);
  function plaque(title,subtitle,x,y,z,width,height,rotation=0){const frame=b('gold',x,y,z,width+.14,height+.14,.13);frame.rotation.y=rotation;const p=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:signTexture(T,title,subtitle)}));p.position.set(x+Math.sin(rotation)*.08,y,z+Math.cos(rotation)*.08);p.rotation.y=rotation;group.add(p);}
  function hit(id,label,x,y,z,a,h,d,fn){const o=new T.Mesh(new T.BoxGeometry(a,h,d),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'hub_'+id,name:label,label,hint:'E / 點擊互動 · '+label,onClick:fn};group.add(o);w.interactables.push(o);}
  b('wood',0,-.13,-.5,26,.25,23);for(let n=0;n<23;n++){b(n%2?'ivory':'wall',0,-.001,-11.5+n,25,.016,.97);for(let x=-12;x<=12;x+=4)b('gold',x,0,-11.5+n,.024,.018,.97);}
  b('wall',-13,4,-.5,.3,8,23);b('wall',13,4,-.5,.3,8,23);b('wall',0,4,-12,26,8,.3);b('wall',-8,4,11,10,8,.3);b('wall',8,4,11,10,8,.3);b('teal',0,8.05,-.5,26,.15,23);
  for(const x of [-12.8,12.8]){b('teal',x,1,-.5,.22,2,23);b('gold',x,2.05,-.5,.28,.08,23);for(let z=-11;z<11;z+=1.15)b('wood',x,1,z,.25,1.9,.065);}
  for(let x=-12;x<=12;x+=3){b('wood',x,4.8,-11.75,.3,6,.28);b('gold',x,2.1,-11.6,.36,.11,.18);}
  for(const z of [-9,-1,7]){b('wood',0,7.5,z,25,.4,.4);for(const x of [-9,9]){b('gold',x,6.7,z,.055,1.6,.055);mesh('sphere','glow',x,5.85,z,.32,.38,.32);mesh('torus','gold',x,5.85,z,.42,.42,.42);}}
  for(const x of [-9,-6,-3,3,6,9])b('gold',x,7.9,-.5,.045,.04,22);
  for(const x of [-12.8,12.8])for(const z of [-8,-1,6]){b('gold',x,7,z,.12,1.6,2.85);b('blue',x+(x<0?.08:-.08),7,z,.05,1.43,2.67);for(const d of [-.87,0,.87])b('ivory',x+(x<0?.12:-.12),7,z+d,.06,1.46,.055);b('ivory',x+(x<0?.2:-.2),6.2,z,.4,.1,3);}
  plaque('英語探險家學習大廳','EXPLORER LANGUAGE LOUNGE',0,6.65,-11.55,7.2,1.15);
  b('teal',0,.65,-7,7,1.3,2);b('wood',0,1.35,-7,7.2,.14,2.2);for(let x=-3;x<=3;x+=.45)b('gold',x,.64,-5.96,.03,1.1,.025);
  mesh('sphere','blue',0,2.45,-7,.75,.75,.75);const globe=mesh('torus','gold',0,2.45,-7,.9,.9,.9);globe.rotation.z=.3;const ring=mesh('torus','gold',0,2.45,-7,.78,.78,.78);ring.rotation.x=Math.PI/2;b('gold',0,1.8,-7,.08,.45,.08);mesh('cylinder','wood',0,1.52,-7,.55,.12,.55);
  for(const side of [-1,1])for(let shelf=0;shelf<3;shelf++){b('wood',side*10,1+shelf*.7,-10,3.3,.11,1);for(let n=0;n<12;n++){const book=b(['teal','green','orange','blue','ivory'][n%5],side*10-1.4+n*.25,1.28+shelf*.7,-10,.18,.45+(n%3)*.07,.72);book.rotation.z=(n%4===0?.1:0);}}
  const stations=[['fox','狐狸館長 · 主題單字','words',-7,-3,'orange'],['owl','貓頭鷹老師 · 句型','sentences',7,-3,'brown'],['rabbit','兔子教練 · 複習','review',7,4,'ivory'],['collection','我的單字收藏牆','collection',-7,4,'teal']];
  const exhibitRoles={};
  for(const [id,title,tab,x,z,color]of stations){
   b('teal',x,.5,z,3.2,1,2);b('wood',x,1.05,z,3.35,.13,2.15);for(let a=-1.3;a<=1.3;a+=.35)b('gold',x+a,.5,z+1.02,.04,.84,.025);
   if(id!=='collection'){
    mesh('sphere',color,x,1.63,z,.64,.64,.46);mesh('sphere',color,x,2.3,z+.05,.66,.58,.5);mesh('sphere','ivory',x,1.65,z+.34,.39,.39,.16);
    for(const a of [-1,1]){
     mesh('sphere','black',x+a*.22,2.4,z+.5,.073,.095,.065);mesh('sphere','ivory',x+a*.24,1.14,z+.3,.18,.12,.24);
     if(id==='fox'){mesh('cone','orange',x+a*.43,2.87,z,.23,.5,.18);mesh('cone','pink',x+a*.43,2.92,z+.12,.12,.24,.04);}
     if(id==='rabbit'){mesh('sphere','ivory',x+a*.26,3.03,z,.17,.57,.15);mesh('sphere','pink',x+a*.26,3.03,z+.12,.08,.39,.025);}
     if(id==='owl'){mesh('sphere','ivory',x+a*.29,2.36,z+.44,.25,.26,.1);mesh('sphere','black',x+a*.29,2.4,z+.535,.085,.095,.035);mesh('torus','gold',x+a*.29,2.36,z+.55,.26,.26,.26);}
    }
    mesh('sphere',id==='owl'?'gold':'ivory',x,2.15,z+.57,id==='owl'?.12:.26,.14,.15);mesh('sphere','black',x,2.2,z+.7,.055,.05,.04);
    if(id==='fox'){const tail=mesh('sphere','orange',x-.7,1.72,z-.18,.55,.3,.28);tail.rotation.z=.8;mesh('sphere','ivory',x-1,1.97,z-.16,.25,.21,.24);}
    const scarf=b('green',x,1.93,z+.22,.68,.12,.4);b('gold',x+.19,1.79,z+.44,.11,.32,.06);
   }else{for(let i=0;i<3;i++){const book=b(['green','orange','blue'][i],x-.7+i*.7,1.65,z,.5,1,.22);book.rotation.z=(i-1)*.12;mesh('sphere','gold',x-.7+i*.7,1.65,z+.15,.1,.1,.035);}}
   if(id==='fox'){
    b('blue',x-1.02,1.18,z-.45,.82,.1,.62);b('ivory',x-1.02,1.25,z-.45,.72,.035,.53);b('teal',x-1.02,1.29,z-.45,.035,.04,.55);
    mesh('sphere','orange',x+1.02,1.42,z-.4,.29,.28,.27);mesh('cylinder','green',x+1.02,1.68,z-.4,.035,.13,.035);mesh('sphere','green',x+1.11,1.68,z-.4,.1,.035,.045);
    exhibitRoles.words='illustrated-book-and-apple';
   }else if(id==='owl'){
    b('ivory',x+.98,1.19,z-.46,.54,.045,.58);b('ivory',x+1.54,1.19,z-.46,.54,.045,.58);b('gold',x+1.26,1.22,z-.46,.045,.08,.59);
    for(let i=0;i<4;i++)b(['orange','blue','green','pink'][i],x+.52+i*.33,1.36,z+.38,.27,.27,.27);
    mesh('sphere','gold',x+1.91,1.37,z+.38,.09,.09,.09);
    exhibitRoles.sentences='open-book-and-word-blocks';
   }else if(id==='rabbit'){
    for(let i=0;i<3;i++){b(['blue','orange','green'][i],x+1.15,1.2+i*.12,z-.36,.55-i*.05,.09,.46);}
    mesh('cone','ivory',x+.35,1.41,z-.35,.17,.25,.17);const hourglass=mesh('cone','ivory',x+.35,1.25,z-.35,.17,.25,.17);hourglass.rotation.z=Math.PI;
    mesh('cylinder','gold',x+.35,1.55,z-.35,.035,.09,.035);mesh('cylinder','gold',x+.35,1.08,z-.35,.25,.045,.25);
    exhibitRoles.review='stacked-books-and-hourglass';
   }else{
    b('wood',x+1.03,1.28,z-.4,.95,.07,.58);for(let i=0;i<4;i++)b(['green','orange','blue','pink'][i],x+.68+i*.23,1.53,z-.4,.17,.42,.16);
    mesh('cylinder','gold',x+1.65,1.44,z+.17,.16,.34,.16);mesh('torus','gold',x+1.65,1.63,z+.17,.17,.17,.17);
    exhibitRoles.collection='collection-ledger-books-and-token-jar';
   }
   hit(id,title,x,2,z,3.4,3,2.4,()=>root.LearningHub.open(tab));
  }
  for(const x of [-12,12])for(const z of [-8,1,8]){mesh('cylinder','gold',x,.4,z,.48,.8,.48);for(let n=0;n<5;n++){const leaf=mesh('sphere','green',x+Math.sin(n*1.5)*.27,1+n*.17,z+Math.cos(n*1.5)*.28,.24,.65,.19);leaf.rotation.z=(n-2)*.3;}}
  // Open-book reliefs are dimensional wall decorations on the side walls.
  for(const side of [-1,1])for(const z of [-5,5]){
   const x=side*12.68,back=b('wood',x,4.85,z,.12,1.15,1.35),left=b('ivory',x+side*.09,4.86,z-.31,.045,.72,.5),right=b('ivory',x+side*.09,4.86,z+.31,.045,.72,.5);
   back.rotation.y=left.rotation.y=right.rotation.y=side<0?Math.PI/2:-Math.PI/2;
   left.rotation.z=-.04;right.rotation.z=.04;
  }
  for(const x of [-2.2,2.2]){b('wood',x,1.8,10.7,.3,3.6,.45);b('gold',x,2,10.42,.1,3.7,.07);}b('wood',0,3.6,10.7,4.7,.35,.45);plaque('RETURN','返回冒險',0,4.48,10.42,2.7,.7,Math.PI);hit('exit','返回原本的冒險',0,1.6,10.6,4,3,.6,()=>root.LearningHub.leave());
  group.userData.learningHubPhysicalExhibits={...exhibitRoles,title:'small-identity-plaque',wallMedallions:4,return:'arched-doorway-and-small-direction-plaque'};
  group.add(new T.HemisphereLight(0xffeed0,0x52626a,.65));const light=new T.PointLight(0xffe6bd,.9,32,1.7);light.position.set(0,6,1);group.add(light);
  group.updateMatrixWorld(true);const batches=new Map();for(const o of statics){const k=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(k))batches.set(k,[]);batches.get(k).push(o);}for(const list of batches.values()){const inst=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>inst.setMatrixAt(i,o.matrixWorld));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of list)o.parent.remove(o);}
 }
 function buildEntrance(manager,group){
  const T=root.THREE,w=manager.world,wood=new T.MeshStandardMaterial({color:0x76543e,roughness:.78}),gold=new T.MeshStandardMaterial({color:0xc9a369,metalness:.55,roughness:.38}),ivory=new T.MeshStandardMaterial({color:0xf4ead5,roughness:.72}),blue=new T.MeshStandardMaterial({color:0x8fb8c2,roughness:.58});
  const plinth=new T.Mesh(new T.BoxGeometry(1.25,.68,.95),wood);plinth.position.set(-5.1,.34,3.3);group.add(plinth);
  const cover=new T.Mesh(new T.BoxGeometry(.9,.07,.68),gold);cover.position.set(-5.1,.74,3.3);group.add(cover);
  for(const side of [-1,1]){const page=new T.Mesh(new T.BoxGeometry(.4,.045,.6),ivory);page.position.set(-5.1+side*.22,.79,3.3);page.rotation.z=side*.035;group.add(page);}
  const stem=new T.Mesh(new T.CylinderGeometry(.05,.07,.3,12),gold);stem.position.set(-4.55,1.02,3.3);group.add(stem);const globe=new T.Mesh(new T.SphereGeometry(.35,16,12),blue);globe.position.set(-4.55,1.33,3.3);group.add(globe);
  const sign=new T.Mesh(new T.BoxGeometry(1.2,.08,.34),wood);sign.position.set(-5.1,1.45,3.3);group.add(sign);const face=new T.Mesh(new T.PlaneGeometry(1.05,.22),new T.MeshBasicMaterial({map:signTexture(T,'學習大廳')}));face.position.set(-5.1,1.46,3.475);group.add(face);
  const target=new T.Mesh(new T.BoxGeometry(2.1,1.55,1.2),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));target.position.set(-5.1,.95,3.3);target.userData={id:'study_learning_hub',name:'英語探險家學習大廳',label:'進入學習大廳',hint:'靠近書本與地球儀，進入自由選題學習',onClick:()=>root.LearningHub.enter()};group.add(target);w.interactables.push(target);
 }
 root.LearningHubScene={build,buildEntrance,bounds,colliders};if(typeof module!=='undefined')module.exports=root.LearningHubScene;
})(typeof window!=='undefined'?window:globalThis);
