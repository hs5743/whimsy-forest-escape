/* Photo-inspired Xin-gang school library: tall windows, orange stair spine, book stairs and reading alcoves. */
(function(root){
 'use strict';
 const bounds={minX:-11.5,maxX:11.5,minZ:-12.4,maxZ:12.35};
 const obstacles=[
  {minX:-11.45,maxX:-11.05,minZ:-12.4,maxZ:12.35},{minX:11.05,maxX:11.45,minZ:-12.4,maxZ:12.35},
  {minX:-11.5,maxX:11.5,minZ:-12.4,maxZ:-12.05},
  {minX:-10.8,maxX:-9.1,minZ:-10.8,maxZ:-8.5},{minX:8.2,maxX:10.45,minZ:-10.5,maxZ:-9.45},
  {minX:-9.6,maxX:-8.1,minZ:-3.5,maxZ:2.8},{minX:8.4,maxX:10.3,minZ:-3.2,maxZ:2.8}
 ];
 function build(manager,group){
  const T=root.THREE,w=manager.world;
  const geo={box:new T.BoxGeometry(1,1,1),panel:new T.PlaneGeometry(1,1),cylinder:new T.CylinderGeometry(1,1,1,12),sphere:new T.SphereGeometry(1,12,8),torus:new T.TorusGeometry(1,.07,6,20)};
  const atlas=(key,row,column,fallback)=>manager.getAtlasTexture?.(key,row,column)||fallback||null;
  const terrazzoMap=atlas('libraryMaterialAtlas',0,0,manager.tex.libraryTerrazzo||manager.tex.schoolTerrazzo),oakMap=atlas('libraryMaterialAtlas',0,1,manager.tex.libraryWood||manager.tex.restaurantWood),orangeMap=atlas('libraryMaterialAtlas',1,0,null),screenMap=atlas('libraryMaterialAtlas',1,1,null);
  function repeat(texture,x,y){if(texture){texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(x,y);}return texture;}
  repeat(terrazzoMap,12,12);repeat(oakMap,4,2);repeat(orangeMap,2,1);repeat(screenMap,1,1);
  const mat={
   wall:new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.libraryWall||manager.tex.restaurantPlaster||null,roughness:.95}),
   floor:new T.MeshStandardMaterial({color:0xffffff,map:terrazzoMap,roughness:.9}),
   wood:new T.MeshStandardMaterial({color:0xffffff,map:oakMap,roughness:.86}),
   bookArt:new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.libraryBookSpines||null,roughness:.9,side:T.DoubleSide}),
   shelf:new T.MeshStandardMaterial({color:0xc9b79e,map:oakMap,roughness:.9}),
   orange:new T.MeshStandardMaterial({color:0xffffff,map:orangeMap,roughness:.82}),
   green:new T.MeshStandardMaterial({color:0x328452,roughness:.83}),
   blue:new T.MeshStandardMaterial({color:0x63aeb8,roughness:.58}),
   screen:new T.MeshStandardMaterial({color:0xffffff,map:screenMap,metalness:.18,roughness:.62}),
   steel:new T.MeshStandardMaterial({color:0x899491,metalness:.45,roughness:.46}),
   // Keep the glazing subtle so the outdoor campus image remains visible instead of becoming a dark flat pane.
   glass:new T.MeshStandardMaterial({color:0xf3f8f8,metalness:.025,roughness:.16,transparent:true,opacity:.09,depthWrite:false,side:T.DoubleSide}),
   white:new T.MeshStandardMaterial({color:0xf3eee2,roughness:.72}),
   red:new T.MeshStandardMaterial({color:0xb95d4f,roughness:.8}),
   yellow:new T.MeshStandardMaterial({color:0xd3ae56,roughness:.75}),
   teal:new T.MeshStandardMaterial({color:0x367c81,roughness:.77}),
   dark:new T.MeshStandardMaterial({color:0x343b3b,roughness:.76}),
   bookBlue:new T.MeshStandardMaterial({color:0x587e9c,roughness:.8}),
   bookRed:new T.MeshStandardMaterial({color:0xa9574f,roughness:.8}),
   bookGold:new T.MeshStandardMaterial({color:0xc6a14b,roughness:.8}),
   bookGreen:new T.MeshStandardMaterial({color:0x5e815e,roughness:.8})
  };
  for(const m of Object.values(mat))m.color.convertSRGBToLinear();
  const courtyard=manager.tex.libraryCourtyardWindow;
  if(courtyard&&T.sRGBEncoding!==undefined)courtyard.encoding=T.sRGBEncoding;
  // Render the outdoor panorama first, then let the real wall piers and window frames cover it.
  // This keeps each image visible through the aperture even when depth precision is marginal.
  const courtyardMaterial=courtyard?new T.MeshBasicMaterial({map:courtyard,side:T.DoubleSide,toneMapped:false,depthTest:false,depthWrite:false}):null;
  const staticMeshes=[];
  function mesh(kind,key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group,dynamic=false){const o=new T.Mesh(geo[kind],mat[key]);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=kind!=='sphere';o.receiveShadow=true;parent.add(o);if(!dynamic&&parent===group)staticMeshes.push(o);return o;}
  function box(key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0){return mesh('box',key,x,y,z,sx,sy,sz,rx,ry,rz);}
  function target(id,label,x,y,z,sx=2.2,sy=2,sz=2){const o=new T.Mesh(new T.BoxGeometry(sx,sy,sz),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'library_'+id,name:label,label,hint:'先看圖書館線索，選對英文，再口說通過。',onClick:()=>root.LibraryChapter.open(id)};group.add(o);w.interactables.push(o);return o;}
  function bookRow(x,y,z,count,face='z',seed=0){
   const keys=['bookBlue','bookRed','bookGold','bookGreen'];
   for(let i=0;i<count;i++){
    const h=.37+((i*7+seed)%4)*.055,wide=.11+((i*3+seed)%3)*.025,offset=i*.145;
    if(face==='z')box(keys[(i+seed)%4],x+offset,y+h/2,z,wide,h,.18);
    else box(keys[(i+seed)%4],x,y+h/2,z+offset,.18,h,wide);
   }
  }
  function bookcase(x,z,width=3.1,height=2.25,front='z'){
   const direction=x<0?1:-1;
   box('shelf',x,.12+height/2,z,width,height,.54);
   // The image atlas supplies real book spines and shelf recesses; physical outer rails keep it grounded in the room.
   for(const y of [.22,height-.12])box('wood',x,.12+y,z,front==='z'?width+.08:.62,.085,front==='z'?.62:width+.08);
   if(front==='z'){
    for(const xx of [-width/2+.12,width/2-.12])box('wood',x+xx,.12+height/2,z,.1,height,.68);
    mesh('panel','bookArt',x,.12+height/2,z+.315,Math.min(width-.28,(height-.28)*2),Math.min(height-.28,(width-.28)/2),1);
   }else{
    for(const zz of [-width/2+.12,width/2-.12])box('wood',x,.12+height/2,z+zz,.68,height,.1);
    mesh('panel','bookArt',x+direction*.315,.12+height/2,z,Math.min(width-.28,(height-.28)*2),Math.min(height-.28,(width-.28)/2),1,0,direction>0?Math.PI/2:-Math.PI/2);
   }
  }
  function windowView(x,y,z,width,height,side,index,count){
   if(!courtyardMaterial)return;
   // Map adjacent landscape strips into each opening so the panorama cannot be hidden by a wall segment.
   const image=courtyard.image||{},imageAspect=(image.naturalWidth||image.width||2172)/(image.naturalHeight||image.height||724),u0=index/count,uSpan=1/count,vSpan=Math.min(1,uSpan*imageAspect/(width/height)),v0=(1-vSpan)/2;
   const geometry=geo.panel.clone(),uv=geometry.getAttribute('uv');
   for(let i=0;i<uv.count;i++)uv.setXY(i,u0+uv.getX(i)*uSpan,v0+uv.getY(i)*vSpan);
   uv.needsUpdate=true;
   const view=new T.Mesh(geometry,courtyardMaterial);view.name='library_window_courtyard_'+side+'_'+index;view.scale.set(width,height,1);
   if(side==='back')view.position.set(x,y,z+.015);else{view.position.set(x+.015,y,z);view.rotation.y=Math.PI/2;}
   view.renderOrder=100;view.userData.libraryExteriorBackdrop=true;view.userData.windowCrop={index,count};group.add(view);
  }
  function windowBay(x,y,z,width,height,side='back',index=0,count=1){
   if(side==='back'){
    box('steel',x,y,z,width+.16,height+.16,.1);box('glass',x,y,z+.04,width,height,.06);
    for(let i=0;i<=4;i++)box('steel',x-width/2+width*i/4,y,z+.09,.045,height+.08,.08);
    for(const yy of [-height/2,0,height/2])box('steel',x,y+yy,z+.09,width+.08,.045,.08);
    windowView(x,y,z,width,height,side,index,count);
   }else{
    box('steel',x,y,z,.1,height+.16,width+.16);box('glass',x+.04,y,z,.06,height,width);
    for(let i=0;i<=4;i++)box('steel',x+.09,y,z-width/2+width*i/4,.08,height+.08,.045);
    for(const yy of [-height/2,0,height/2])box('steel',x+.09,y+yy,z,.08,.045,width+.08);
    windowView(x,y,z,width,height,side,index,count);
   }
  }
  // Tall reading room: pale terrazzo, warm walls and a two-storey volume matching the reference photos.
  box('floor',0,-.13,0,23.4,.22,25.8);
  box('wall',0,7.58,0,22.8,.28,25.1);
  for(const z of [-10,-5,0,5,10])box('white',0,7.38,z,22.2,.08,.11);
  box('wall',-11.3,3.75,0,.38,7.5,25.8);box('wall',11.3,2.5125,0,.38,5.025,25.8);box('wall',11.3,6.9875,0,.38,1.025,25.8);
  // Split the rear wall into a sill, clerestory and piers, leaving real window apertures instead of dark panes over solid plaster.
  const backWindows=[-8.9,-5.1,-1.3,2.5,6.3,9.7],backBottom=4.1,backTop=5.9;
  box('wall',0,backBottom/2,-12.25,23,backBottom,.35);box('wall',0,(backTop+7.5)/2,-12.25,23,7.5-backTop,.35);
  let wallCursor=-11.5;for(const x of backWindows){const left=x-1.625,right=x+1.625;if(left>wallCursor)box('wall',(wallCursor+left)/2,3.75,-12.25,left-wallCursor,7.5,.35);wallCursor=right;}if(wallCursor<11.5)box('wall',(wallCursor+11.5)/2,3.75,-12.25,11.5-wallCursor,7.5,.35);
  backWindows.forEach((x,index)=>windowBay(x,5,-12.03,3.25,1.8,'back',index,backWindows.length));
  const sideWindows=[-8.3,-4.3,-.3,3.7,7.7],sideBottom=3,sideTop=5.5;
  box('wall',11.3,sideBottom/2,0,.38,sideBottom,25.8);box('wall',11.3,(sideTop+7.5)/2,0,.38,7.5-sideTop,25.8);
  let sideCursor=-12.9;for(const z of sideWindows){const near=z-1.625,far=z+1.625;if(near>sideCursor)box('wall',11.3,3.75,(sideCursor+near)/2,.38,7.5,near-sideCursor);sideCursor=far;}if(sideCursor<12.9)box('wall',11.3,3.75,(sideCursor+12.9)/2,.38,7.5,12.9-sideCursor);
  sideWindows.forEach((z,index)=>windowBay(11.08,4.25,z,3.25,2.5,'side',index,sideWindows.length));
  // High steel catwalk and perforated blue screen over the stair-side shelves.
  box('steel',-9.65,4.55,-6.35,2.7,.16,10.4);
  for(let z=-11.4;z<=-1.2;z+=.37)box('steel',-10.85,4.45,z,.07,.11,.07);
  box('steel',-10.85,5.05,-6.3,.08,1.05,10.3);box('steel',-8.45,5.05,-6.3,.08,1.05,10.3);
  for(let z=-11.25;z<=-1.35;z+=.32)box('screen',-9.65,4.98,z,2.3,.82,.035);
  // Raised orange stair spine, wooden treads, handrails and a true open void beneath the flight.
  const stairStart=3.1,stairEnd=-5.9,stairTop=3.25,x0=-7.75,x1=-5.95;
  function stairSide(xa,xb){
   const positions=[xa,.16,stairStart,xa,.16,stairEnd,xa,stairTop,stairEnd,xb,.16,stairStart,xb,.16,stairEnd,xb,stairTop,stairEnd];
   const indices=[0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,0,3,5,0,5,2];
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const side=new T.Mesh(g,mat.orange);side.castShadow=true;side.receiveShadow=true;group.add(side);staticMeshes.push(side);
  }
  stairSide(x0,x0+.18);stairSide(x1-.18,x1);
  const stepCount=13;
  for(let i=0;i<stepCount;i++){const y=.22+i*.24,z=stairStart-i*.69;box('wood',(x0+x1)/2,y,z,.18+(x1-x0),.12,.72);box('orange',(x0+x1)/2,y-.11,z-.3,.18+(x1-x0),.2,.09);}
  const railPts=[new T.Vector3(x1+.08,.8,stairStart+.34),new T.Vector3(x1+.08,3.9,stairEnd-.2)];
  group.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(...railPts),24,.04,7,false),mat.steel));
  const railPts2=[new T.Vector3(x0-.08,.8,stairStart+.34),new T.Vector3(x0-.08,3.9,stairEnd-.2)];group.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(...railPts2),24,.035,7,false),mat.steel));
  for(let i=0;i<=12;i+=2){const y=.92+i*.24,z=stairStart-i*.69;box('steel',x1+.08,y,z,.045,.52,.045);box('steel',x0-.08,y,z,.04,.52,.04);}
  // Under-stair book wall with staggered low shelves, colored spines and picture-book ledges.
  for(const z of [-3.8,-2.1,-.4,1.3]){
   box('shelf',-8.95,.92,z,1.65,1.65,1.25);for(const y of [.3,.82,1.34])box('wood',-8.95,y,z,1.72,.075,1.3);
   for(let j=0;j<8;j++)box(['bookRed','bookBlue','bookGold','bookGreen'][j%4],-9.55+j*.17,.54,z+.67,.12,.4,.08);
   for(let j=0;j<7;j++)box(['bookBlue','bookGold','bookRed','bookGreen'][(j+1)%4],-9.5+j*.18,1.05,z+.67,.13,.42,.08);
  }
  // Low bookcases continue around the room, leaving a clear central walking route.
  bookcase(-9.15,-8.55,2.7,2.05,'x');bookcase(-9.15,-4.6,2.7,2.05,'x');bookcase(-9.15,.2,2.7,1.75,'x');
  bookcase(9.35,-8.35,3.0,2.15,'x');bookcase(9.35,-4.25,3.0,2.15,'x');bookcase(9.35,.05,3.0,2.15,'x');
  bookcase(-6.9,-10.9,3.3,2.05,'z');bookcase(-2.75,-10.9,3.3,2.05,'z');bookcase(1.3,-10.9,3.3,2.05,'z');bookcase(5.35,-10.9,3.3,2.05,'z');
  // Large tables, simple sturdy chairs and individual study lamps.
  function table(x,z){
   box('wood',x,.98,z,3.2,.16,1.5);box('shelf',x,.87,z,3.05,.06,1.35);
   for(const dx of [-1.35,1.35])for(const dz of [-.52,.52])box('steel',x+dx,.47,z+dz,.075,.92,.075);
   box('white',x-.46,1.08,z-.12,.67,.025,.42);box('bookBlue',x+.55,1.1,z-.12,.42,.08,.3);
   for(const dx of [-1,1])for(const dz of [-1.35,1.35]){
    const cx=x+dx,cz=z+dz*.62;box('wood',cx,.5,cz,.72,.1,.72);for(const ox of [-.27,.27])for(const oz of [-.27,.27])box('steel',cx+ox,.25,cz+oz,.045,.5,.045);
   }
  }
  for(const [x,z]of [[-3.4,3.2],[2,3.2],[6.7,3.2],[-3.4,7.1],[2,7.1],[6.7,7.1]])table(x,z);
  // Orange and green reading pods, tall picture-book display and a soft window-side bench.
  function readingPod(x,z,color){
   box(color,x,.7,z,1.55,1.4,.22);box('wood',x,.35,z+.42,1.25,.12,.7);box('dark',x,.5,z+.36,1.18,.18,.6);
   for(const side of [-1,1])box(color,x+side*.77,.85,z+.18,.18,1.45,.76);
   box(color,x,1.46,z+.16,1.34,.18,.75);box('wood',x,.16,z+.42,1.3,.08,.75);
  }
  readingPod(6.8,-7.9,'orange');readingPod(8.75,-7.9,'green');
  box('wood',5.05,.88,-8.45,.22,1.76,.7);for(const y of [.38,.94,1.5]){box('wood',5.05,y,-8.06,.24,.075,.8);for(let i=0;i<4;i++)box(['bookRed','bookBlue','bookGold','bookGreen'][(i+Math.round(y*10))%4],4.66+i*.21,y+.22,-8.08,.16,.39,.09);}
  box('wood',0,.47,-9.25,2.8,.12,.55);for(const x of [-1.2,1.2])box('steel',x,.25,-9.25,.055,.5,.055);
  // Warm linear pendants and wall wash balance the cool daylight from the high windows.
  for(const x of [-5,0,5])for(const z of [-2,4]){
   box('steel',x,7.02,z,.035,.62,.035);box('white',x,6.68,z,1.45,.11,.33);const lamp=new T.PointLight(0xffe5b9,.36,9,2);lamp.position.set(x,6.45,z);group.add(lamp);
  }
  // Small illustrated reading panels add color to the tall room without competing with its real fixtures.
  for(const [x,color,word]of [[-4.8,'orange','STORY'],[0,'teal','READ'],[4.8,'green','QUIET']]){
   box('wood',x,2.55,-11.95,3.2,1.55,.13);box(color,x,2.55,-11.84,2.96,1.31,.06);
   for(let i=0;i<5;i++)box(['bookRed','bookGold','bookBlue','bookGreen','white'][i],x-1.08+i*.54,2.4,-11.79,.34,.62,.035);
   box('white',x,3.03,-11.78,2.45,.09,.04);
  }
  // Eight targets correspond to real fixtures or clear reading areas in the room.
  target('shelf','階梯下故事書架',-8.95,1.35,-2.25,2.5,2.7,2.1);
  target('story','精選故事展示架',5.05,1.6,-8.35,2.8,2.5,2.1);
  target('student','橘綠閱讀座位',7.8,1.55,-7.85,3.6,2.4,2.2);
  target('teacher','圖書館服務桌',0,1.5,-9.2,3.2,2.3,1.8);
  target('study','共讀木桌',2,1.3,3.2,4.1,2.5,2.4);
  target('quiet','窗邊安靜閱讀角',8.7,1.6,-3.4,2.8,2.6,2.5);
  target('boring','故事心情卡',-3.4,1.7,3.2,3.7,2.5,2.3);
  target('exciting','彩色結局展示',2,1.5,7.1,4.4,2.5,2.6);
  const exit=target('exit','回到新港國小校園',0,1.7,12.05,3.4,2.4,1.2);exit.userData.onClick=()=>{if(manager.switchZone('zone12'))w.adventureProgress?.save(true);};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of staticMeshes){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){if(items.length<3)continue;const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xeaf1ee,0x615c4c,.43);group.add(hemi);const sun=new T.DirectionalLight(0xffefd2,.56);sun.position.set(-8,11,5);sun.target.position.set(1,1,-6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:.5,far:40});group.add(sun,sun.target);
  root.LibraryChapter?.sync?.();
 }
 const api={bounds,colliders:()=>obstacles.map(o=>({...o})),build};root.LibraryScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
