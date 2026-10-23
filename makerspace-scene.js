/* Fictional, school-aged makerspace branch using workshop-scale tools and a clear central aisle. */
(function(root){
 'use strict';
 const bounds={minX:-11.5,maxX:11.5,minZ:-12.5,maxZ:12.5};
 const obstacles=[
  {minX:-11.5,maxX:-11.1,minZ:-12.5,maxZ:12.5},{minX:11.1,maxX:11.5,minZ:-12.5,maxZ:12.5},
  {minX:-11.5,maxX:11.5,minZ:-12.5,maxZ:-12.1},
  {minX:-10.8,maxX:-2.1,minZ:10.95,maxZ:11.45},{minX:2.1,maxX:10.8,minZ:10.95,maxZ:11.45},
  {minX:-7.55,maxX:-2.45,minZ:-5.3,maxZ:-3.1},{minX:2.45,maxX:7.55,minZ:-5.3,maxZ:-3.1},
  {minX:-7.4,maxX:-2.6,minZ:3.8,maxZ:5.8},{minX:2.6,maxX:7.4,minZ:3.8,maxZ:5.8},
  {minX:-10.5,maxX:-8.7,minZ:-10.2,maxZ:-7.2},{minX:8.7,maxX:10.5,minZ:-10.2,maxZ:-7.2}
 ];
 function build(manager,group){
  const T=root.THREE,w=manager.world;
  const geo={box:new T.BoxGeometry(1,1,1),plane:new T.PlaneGeometry(1,1),cyl:new T.CylinderGeometry(1,1,1,16),sphere:new T.SphereGeometry(1,16,10),torus:new T.TorusGeometry(1,.1,8,24),cone:new T.ConeGeometry(1,1,12)};
  const atlas=(key,row,column,fallback)=>manager.getAtlasTexture?.(key,row,column)||fallback||null;
  const floorMap=atlas('makerspaceMaterialAtlas',0,0,manager.tex.libraryTerrazzo||manager.tex.schoolTerrazzo),woodMap=atlas('makerspaceMaterialAtlas',0,1,manager.tex.libraryWood||manager.tex.restaurantWood),pegMap=atlas('makerspaceMaterialAtlas',1,0,manager.tex.makerspacePegboard),matMap=atlas('makerspaceMaterialAtlas',1,1,manager.tex.makerspaceWorkMat);
  function repeat(texture,x,y){if(texture){texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(x,y);}return texture;}
  repeat(floorMap,10,10);repeat(woodMap,4,2);repeat(pegMap,4,2);repeat(matMap,1,1);
  const mat={
   wall:new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.libraryWall||manager.tex.restaurantPlaster||null,roughness:.96}),
   floor:new T.MeshStandardMaterial({color:0xffffff,map:floorMap,roughness:.91}),
   wood:new T.MeshStandardMaterial({color:0xffffff,map:woodMap,roughness:.84}),
   peg:new T.MeshStandardMaterial({color:0xffffff,map:pegMap,roughness:.68,metalness:.08}),
   mat:new T.MeshStandardMaterial({color:0xffffff,map:matMap,roughness:.82}),
   steel:new T.MeshStandardMaterial({color:0x687475,metalness:.48,roughness:.43}),
   aluminum:new T.MeshStandardMaterial({color:0xb9c1be,metalness:.58,roughness:.34}),
   dark:new T.MeshStandardMaterial({color:0x26333a,roughness:.72}),
   rubber:new T.MeshStandardMaterial({color:0x252c30,roughness:.96}),
   blue:new T.MeshStandardMaterial({color:0x4c8b9a,roughness:.7}),
   teal:new T.MeshStandardMaterial({color:0x347b79,roughness:.7}),
   green:new T.MeshStandardMaterial({color:0x6a8c62,roughness:.77}),
   orange:new T.MeshStandardMaterial({color:0xd67d47,roughness:.76}),
   yellow:new T.MeshStandardMaterial({color:0xd7b64e,roughness:.7}),
   coral:new T.MeshStandardMaterial({color:0xb96458,roughness:.75}),
   white:new T.MeshStandardMaterial({color:0xf0eee5,roughness:.74}),
   glass:new T.MeshStandardMaterial({color:0xa9c8cb,roughness:.22,transparent:true,opacity:.38,depthWrite:false,side:T.DoubleSide}),
   glow:new T.MeshStandardMaterial({color:0x86cfa3,emissive:0x2d7650,emissiveIntensity:.24,roughness:.34}),
   copper:new T.MeshStandardMaterial({color:0xb47f4e,metalness:.5,roughness:.5})
  };
  for(const m of Object.values(mat))m.color.convertSRGBToLinear();
  const staticMeshes=[];
  function mesh(kind,key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group){const o=new T.Mesh(geo[kind],mat[key]);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=kind!=='sphere';o.receiveShadow=true;parent.add(o);if(parent===group)staticMeshes.push(o);return o;}
  const box=(key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>mesh('box',key,x,y,z,sx,sy,sz,rx,ry,rz);
  function target(id,label,x,y,z,sx=2.4,sy=2.1,sz=2.4){const o=new T.Mesh(geo.box,new T.MeshBasicMaterial({visible:false}));o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.userData={id:'maker_'+id,name:label,label,hint:'觀察工坊的零件與操作線索，先選英語，再口說通過。',onClick:()=>id==='exit'?leave():root.MakerspaceChapter.open(id)};group.add(o);w.interactables.push(o);return o;}
  function leave(){if(manager.switchZone('zone12')){w.player.pos.set(6,1.6,9.8);w.player.yaw=Math.PI;w.adventureProgress?.save(true);}}
  function workbench(x,z,width=4.55,depth=2.05){
   box('wood',x,.91,z,width,.16,depth);box('mat',x,.999,z,width*.78,.025,depth*.72);
   for(const dx of [-width*.42,width*.42])for(const dz of [-depth*.34,depth*.34]){
    box('steel',x+dx,.47,z+dz,.09,.78,.09);box('steel',x+dx,.14,z+dz,.28,.06,.32);
   }
   box('wood',x,.2,z,width*.74,.08,.07);
  }
  function robot(x,y,z,scale=1){
   const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(scale);group.add(g);
   mesh('box','dark',0,.14,0,1.12,.2,.78,0,0,0,g);mesh('box','aluminum',0,.32,0,.9,.28,.58,0,0,0,g);
   mesh('box','blue',0,.34,-.03,.42,.3,.52,0,0,0,g);mesh('box','yellow',0,.54,-.05,.16,.13,.16,0,0,0,g);
   for(const sx of [-.48,.48])for(const sz of [-.26,.26])mesh('cyl','rubber',sx,.13,sz,.17,.12,.17,0,0,Math.PI/2,g);
   mesh('box','dark',0,.52,.22,.54,.11,.09);mesh('sphere','glow',-.15,.61,.28,.045,.045,.035);mesh('sphere','glow',.15,.61,.28,.045,.045,.035);
   mesh('box','copper',0,.68,-.24,.12,.13,.12);mesh('cyl','steel',0,.77,-.24,.022,.12,.022);
   return g;
  }
  function gear(x,y,z,r,teeth,color){
   mesh('cyl',color,x,y,z,r*2,.16,r*2);
   for(let i=0;i<teeth;i++){const a=i*2*Math.PI/teeth;box(color,x+Math.cos(a)*r*.91,y,z+Math.sin(a)*r*.91,.13,.16,.13,0,-a,0);}
   mesh('cyl','dark',x,y+.09,z,.16,.025,.16);
  }
  function pegTool(x,y,z,handle,angle=0){box('steel',x,y,z,.09,.48,.09,0,0,angle);mesh('cyl',handle,x,y-.19,z,.075,.24,.075,0,0,angle);mesh('cyl','aluminum',x,y+.12,z,.11,.07,.11,0,0,angle);}
  function printer(x,z){
   const g=new T.Group();g.name='maker_3d_printer';g.position.set(x,1.58,z);group.add(g);
   const part=(kind,key,px,py,pz,sx,sy,sz,rx=0,ry=0,rz=0)=>mesh(kind,key,px,py,pz,sx,sy,sz,rx,ry,rz,g);
   // Enclosed desktop FDM printer: rigid frame, clear safety door, moving carriage and a visible filament spool.
   part('box','dark',0,.08,0,1.52,.16,1.02);
   for(const px of [-.66,.66])for(const pz of [-.42,.42])part('box','aluminum',px,.75,pz,.07,1.2,.07);
   part('box','aluminum',0,1.34,-.42,1.42,.08,.08);part('box','aluminum',0,1.34,.42,1.42,.08,.08);
   part('box','aluminum',-.66,1.34,0,.08,.08,.84);part('box','aluminum',.66,1.34,0,.08,.08,.84);
   part('box','glass',0,.79,.435,1.18,.92,.025);part('box','glass',-.625,.79,0,.025,.92,.72);part('box','glass',.625,.79,0,.025,.92,.72);
   part('box','steel',0,.5,.03,1.05,.055,.68);part('box','dark',0,.56,.03,.88,.04,.55);
   part('box','steel',0,1.11,-.03,1.18,.08,.09);part('box','dark',.12,1.02,.04,.2,.18,.2);part('cone','copper',.12,.9,.06,.075,.16,.075);
   part('box','blue',.46,.53,.47,.27,.22,.04);part('box','white',.46,.53,.442,.21,.13,.012);
   part('torus','orange',-.86,1.15,.08,.35,.35,.055);part('cyl','dark',-.86,1.15,.08,.12,.06,.12,Math.PI/2,0,0);
   part('box','orange',.17,.69,.02,.24,.19,.2);part('box','yellow',.17,.8,.02,.18,.04,.14);
  }
  function windowBay(side,z,y=2.35,width=4.5,height=2.0){
   const x=side*11.36;box('glass',x,y,z,.035,height,width);for(let i=0;i<=4;i++)box('aluminum',x+side*.035,y,z-width/2+i*width/4,.07,height+.1,.045);
   for(const yy of [y-height/2,y,y+height/2])box('aluminum',x+side*.04,yy,z,.08,.05,width+.08);
  }
  // Quiet light terrazzo, cream plaster and exposed classroom-height structure keep the workshop grounded.
  box('floor',0,-.16,0,23.2,.32,25.2);
  const courtyard=manager.tex.libraryCourtyardWindow,sideWindowZ=[-8.5,-2.6,3.3,8.2];
  for(const side of [-1,1]){
   box('wall',side*11.45,.6875,0,.22,1.375,25.2);box('wall',side*11.45,5.0625,0,.22,2.875,25.2);
   let cursor=-12.6;for(const z of sideWindowZ){const near=z-2.4,far=z+2.4;if(near>cursor)box('wall',side*11.45,3.25,(cursor+near)/2,.22,6.5,near-cursor);cursor=far;}if(cursor<12.6)box('wall',side*11.45,3.25,(cursor+12.6)/2,.22,6.5,12.6-cursor);
  }
  // The upper wall now leaves true window openings; the courtyard texture provides a continuous view outside.
  const backWindowX=[-7.65,-2.55,2.55,7.65];
  box('wall',0,2.545,-12.55,23.2,5.09,.22);box('wall',0,6.255,-12.55,23.2,.49,.22);
  let backCursor=-11.6;for(const x of backWindowX){const left=x-2.36,right=x+2.36;if(left>backCursor)box('wall',(backCursor+left)/2,3.25,-12.55,left-backCursor,6.5,.22);backCursor=right;}if(backCursor<11.6)box('wall',(backCursor+11.6)/2,3.25,-12.55,11.6-backCursor,6.5,.22);
  box('wall',-7.25,3.25,12.55,8.7,6.5,.22);box('wall',7.25,3.25,12.55,8.7,6.5,.22);
  box('wall',0,6.42,0,23.1,.18,25.0);
  // Long translucent side windows and slim metal frames admit cool school daylight.
  for(const side of [-1,1])for(const z of sideWindowZ)windowBay(side,z,2.5,4.8,2.25);
  if(courtyard){
   const rearView=new T.Mesh(geo.plane,new T.MeshBasicMaterial({map:courtyard,side:T.DoubleSide,toneMapped:false}));rearView.name='makerspace_rear_courtyard';rearView.position.set(0,3.25,-12.68);rearView.scale.set(23.2,6.5,1);rearView.userData.libraryExteriorBackdrop=true;group.add(rearView);
   for(const side of [-1,1]){const view=new T.Mesh(geo.plane,new T.MeshBasicMaterial({map:courtyard,side:T.DoubleSide,toneMapped:false}));view.name='makerspace_side_courtyard_'+side;view.position.set(side*11.58,3.25,0);view.rotation.y=side*Math.PI/2;view.scale.set(25.2,6.5,1);view.userData.libraryExteriorBackdrop=true;group.add(view);}
  }
  // Repeating perforated pegboard and a continuous lower parts cabinet form the tool wall.
  for(const x of [-7.65,-2.55,2.55,7.65]){
   box('peg',x,3.08,-12.37,4.8,2.55,.075);
   box('steel',x,1.39,-12.32,4.85,.12,.12);box('steel',x,4.75,-12.32,4.85,.12,.12);
   box('wood',x,1.14,-11.7,4.65,.88,.9);
   for(let col=-1;col<=1;col++){
    box(['blue','orange','green'][(col+1)%3],x+col*1.25,1.24,-11.15,1.03,.58,.57);
    box('dark',x+col*1.25,.93,-11.15,1.03,.035,.57);
   }
  }
  printer(-7.65,-11.7);
  // High clerestory glazing exposes the workshop structure and draws daylight across the tool wall.
  for(const x of [-7.65,-2.55,2.55,7.65]){
   box('glass',x,5.55,-12.59,4.72,.92,.045);
   for(const dx of [-2.36,0,2.36])box('aluminum',x+dx,5.55,-12.31,.055,.98,.075);
   for(const y of [5.08,6.02])box('aluminum',x,y,-12.3,4.8,.07,.08);
   // Timber ledges and real component organizers turn the upper wall into storage, not a poster gallery.
   box('wood',x,4.92,-11.91,4.7,.14,.74);
   for(let i=0;i<5;i++){
    const c=['blue','orange','green','yellow','coral'][i];
    box(c,x-1.84+i*.92,5.19,-11.99,.72,.38,.56);
    box('dark',x-1.84+i*.92,5.39,-11.7,.61,.035,.12);
   }
  }
  // Exposed ceiling services and diffuse work lights make the room read as a used school workshop.
  for(const x of [-7.6,-2.55,2.55,7.6]){
   box('steel',x,6.22,-5.8,.09,.09,12.4);
   box('white',x,6.07,-4.5,.42,.08,2.9);
   box('white',x,6.07,4.1,.42,.08,2.9);
  }
  for(const z of [-9.7,-1.9,5.8]){
   box('steel',0,6.26,z,18.8,.1,.09);
   for(const x of [-9.1,-4.6,0,4.6,9.1])mesh('cyl','aluminum',x,6.17,z,.14,.025,.14);
  }
  // A handful of recognizable child-safe hand tools hang on real peg positions.
  for(const [x,handle,a]of [[-9.1,'orange',-.1],[-7.9,'blue',.16],[-6.6,'green',-.08],[-4.3,'yellow',.12],[-3.1,'coral',-.16],[.2,'blue',.1],[1.5,'orange',-.12],[4.4,'green',.16],[6.1,'yellow',-.12],[9,'blue',.1]])pegTool(x,3.3,-12.16,handle,a);
  // Four child-height benches surround a deliberately wide, unblocked central aisle.
  workbench(-5,-4,4.7,2.15);workbench(5,-4,4.7,2.15);workbench(-5,4.8,4.7,2.15);workbench(5,4.8,4.7,2.15);
  // Robot body and loose kit components on the first assembly island.
  robot(0,.98,-4,.9);
  for(const [x,z,key]of [[-1.65,-4.2,'orange'],[-1.12,-3.75,'yellow'],[-1.78,-3.72,'blue'],[1.55,-4.25,'green'],[1.12,-3.78,'coral']]){
   box(key,x,1.12,z,.32,.22,.28,0,(x+z)*.1,0);box('dark',x,1.245,z,.28,.035,.23);
  }
  for(const x of [-1.9,1.9])for(const z of [-4.72,-3.28])mesh('cyl','aluminum',x,1.04,z,.09,.12,.09);
  // Test stations: a paired fast/slow gear set, a steering servo and a protected battery cradle.
  box('dark',-5,1.05,0,1.75,.12,1.1);gear(-5.42,1.16,0,.42,12,'yellow');gear(-4.76,1.16,0,.25,10,'blue');
  box('white',5,1.05,0,1.75,.12,1.1);gear(4.58,1.16,0,.46,12,'blue');gear(5.28,1.16,0,.25,10,'orange');
  box('blue',5,1.08,-4,1.1,.17,.74);mesh('cyl','steel',5,1.2,-4,.27,.09,.27);
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){const arm=box('aluminum',5+Math.cos(a)*.46,1.2,-4+Math.sin(a)*.46,.38,.06,.08);arm.rotation.y=-a;}
  box('dark',0,1.07,4.8,1.75,.16,1.15);box('yellow',0,1.17,4.8,.73,.12,.54);box('dark',0,1.25,4.8,.52,.06,.39);
  box('blue',-.28,1.33,4.8,.1,.07,.1);box('glow',.12,1.34,4.8,.08,.08,.08);
  // A safe, low-speed test lane ends before the return door; colored transverse strips mark the start.
  box('dark',0,.015,8.1,2.15,.025,4.5);for(let z=6.0;z<=10.1;z+=.42)box(z<6.9?'yellow':z>9.7?'coral':'white',0,.032,z,2.05,.02,.045);
  box('blue',0,.14,8.4,1.25,.22,.32);box('dark',0,.27,8.4,.9,.05,.22);robot(0,.05,7.75,.58);
  // Shared work area includes chairs, trays and safe small-component organizers.
  for(const x of [-6.35,-3.65])for(const z of [4.1,5.45]){
   box('blue',x,.48,z,.43,.1,.43);box('steel',x,.24,z,.055,.46,.055);
  }
  box('white',-5,1.06,4.8,.85,.035,.5);for(let i=0;i<5;i++)box(i%2?'green':'orange',-5.27+i*.135,1.13,4.8,.105,.1,.34);
  // Return door has a small glazed safety panel and physical handle, not just a floating sign.
  box('wood',0,1.55,12.35,3.7,3.1,.12);box('blue',0,1.58,12.26,3.46,2.92,.08);box('glass',-.72,2.1,12.2,1.05,1.3,.035);box('aluminum',.96,1.53,12.16,.08,.22,.07);
  target('robot','小型輪式機器人',0,1.25,-4,3.2,2.5,2.4);
  target('make','組裝零件與工作墊',-5,1.25,-4,4.4,2.1,2.5);
  target('fast','高速小齒輪',-5,1.25,0,3.2,2,2.4);
  target('slow','慢速大齒輪',5,1.25,0,3.2,2,2.4);
  target('turn','轉向伺服器',5,1.25,-4,2.8,2.1,2.5);
  target('work','共用工作桌',-5,1.2,4.8,4.4,2.2,2.4);
  target('ready','電池檢查座',0,1.25,4.8,2.8,2.2,2.4);
  target('start','小車測試線',0,1.2,8.1,3.3,2.2,3.6);
  const exit=new T.Mesh(geo.box,new T.MeshBasicMaterial({visible:false}));exit.position.set(0,1.5,11.7);exit.scale.set(3.5,2.8,1.2);exit.userData={id:'maker_exit',name:'返回新港國小校園',label:'返回新港國小校園',hint:'沿著工坊入口返回校園教學樓。',onClick:leave};group.add(exit);w.interactables.push(exit);
  // Batch repeated fixed geometry by shared material so detailed pegboards and benches do not inflate draw calls.
  const batches=new Map();for(const o of staticMeshes){o.updateMatrix();const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}
  let instanceCount=0;for(const list of batches.values())if(list.length>1){const inst=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);list.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.instanceMatrix.needsUpdate=true;inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of list)group.remove(o);instanceCount+=list.length;}
  return{staticMeshes:group.children.filter(o=>o.isMesh).length,instanced:instanceCount,interactables:8};
 }
 function colliders(){return obstacles.map(o=>({type:'box',...o}));}
 const api={bounds,colliders,build};root.MakerspaceScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
