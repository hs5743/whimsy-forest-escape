/* A crafted school-festival art studio branching from the user-referenced Xin-gang campus. */
(function(root){
 'use strict';
 const bounds={minX:-10.35,maxX:10.35,minZ:-11.25,maxZ:11.15};
 const obstacles=[
  {minX:-11,maxX:-10.65,minZ:-12.25,maxZ:12.25},{minX:10.65,maxX:11,minZ:-12.25,maxZ:12.25},
  {minX:-10.6,maxX:-1.85,minZ:-12.3,maxZ:-12.0},{minX:1.85,maxX:10.6,minZ:-12.3,maxZ:-12.0},
  {minX:-10.6,maxX:-1.8,minZ:11.9,maxZ:12.25},{minX:1.8,maxX:10.6,minZ:11.9,maxZ:12.25},
  {minX:-6.8,maxX:-2.1,minZ:-1.8,maxZ:1.5},{minX:2.1,maxX:6.8,minZ:-1.8,maxZ:1.5},
  {minX:-8.7,maxX:-7.8,minZ:-8.9,maxZ:-6.5},{minX:7.8,maxX:8.7,minZ:-8.9,maxZ:-6.5},
  {minX:-9.8,maxX:-8.15,minZ:-4.75,maxZ:-2.05},{minX:8.75,maxX:10.4,minZ:-10.15,maxZ:-6.45},
  {minX:-6.2,maxX:-4.8,minZ:5.45,maxZ:7.8},{minX:8.3,maxX:10.35,minZ:6.05,maxZ:8.55},
  {minX:-5.62,maxX:-4.78,minZ:-2.28,maxZ:-1.42},{minX:-3.72,maxX:-2.88,minZ:-2.28,maxZ:-1.42},
  {minX:2.88,maxX:3.72,minZ:-2.28,maxZ:-1.42},{minX:4.78,maxX:5.62,minZ:-2.28,maxZ:-1.42}
 ];
 function build(manager,group){
  const T=root.THREE,w=manager.world;
  const geo={box:new T.BoxGeometry(1,1,1),cylinder:new T.CylinderGeometry(1,1,1,16),sphere:new T.SphereGeometry(1,16,12),cone:new T.ConeGeometry(1,1,12),torus:new T.TorusGeometry(1,.1,8,24),windowPlane:new T.PlaneGeometry(1,1)};
 function repeatedMap(source,x,y,variant,url){if(!source&&!manager.getTexture)return null;const map=manager.getTexture&&url?manager.getTexture(url,'zone20-'+variant):source?.clone();if(!map)return null;map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(x,y);if(T.sRGBEncoding!==undefined){map.encoding=T.sRGBEncoding;map.needsUpdate=true;}return map;}
 const floorMap=repeatedMap(manager.tex.artStudioTerrazzo||manager.tex.libraryTerrazzo||manager.tex.libraryWood||manager.tex.restaurantWood,18,20,'floor','assets/textures/art-studio-terrazzo-v1.webp');
 const wallMap=repeatedMap(manager.tex.artStudioWall||manager.tex.libraryWall||manager.tex.schoolConcrete,1,1,'wall','assets/textures/art-studio-plaster-v1.webp');
 const mapleMap=repeatedMap(manager.tex.artStudioMaple||manager.tex.libraryWood||manager.tex.restaurantWood,2,1.25,'maple','assets/textures/art-studio-maple-v1.webp');
  const courtyard=manager.tex.libraryCourtyardWindow;
  if(courtyard&&T.sRGBEncoding!==undefined)courtyard.encoding=T.sRGBEncoding;
  const courtyardMaterial=courtyard?new T.MeshBasicMaterial({map:courtyard,side:T.DoubleSide,toneMapped:false,depthTest:false,depthWrite:false}):null;
  let windowViewCount=0,stoolCount=0;
  const materials={
   wall:new T.MeshStandardMaterial({color:0xffffff,map:wallMap,roughness:.94}),
   floor:new T.MeshStandardMaterial({color:0xffffff,map:floorMap,roughness:.92}),
   wood:new T.MeshStandardMaterial({color:0xffffff,map:mapleMap,roughness:.84}),
   darkWood:new T.MeshStandardMaterial({color:0x594638,roughness:.82}),
   trim:new T.MeshStandardMaterial({color:0xe4d8c4,roughness:.7}),
   metal:new T.MeshStandardMaterial({color:0x87969a,metalness:.48,roughness:.46}),
   glass:new T.MeshStandardMaterial({color:0xa9cbd2,metalness:.08,roughness:.25,transparent:true,opacity:.52,depthWrite:false,side:T.DoubleSide}),
   blackboard:new T.MeshStandardMaterial({color:0x254c4c,roughness:.94}),
   paper:new T.MeshStandardMaterial({color:0xf6efd9,roughness:.95}),
   coral:new T.MeshStandardMaterial({color:0xd76755,roughness:.72}),
   teal:new T.MeshStandardMaterial({color:0x4d9e9a,roughness:.76}),
   yellow:new T.MeshStandardMaterial({color:0xe2bd5e,roughness:.72}),
   blue:new T.MeshStandardMaterial({color:0x4e76af,roughness:.72}),
   purple:new T.MeshStandardMaterial({color:0x8875a5,roughness:.76}),
   green:new T.MeshStandardMaterial({color:0x668768,roughness:.8}),
   white:new T.MeshStandardMaterial({color:0xfff9ea,roughness:.72}),
   black:new T.MeshStandardMaterial({color:0x2b3033,roughness:.52}),
   brass:new T.MeshStandardMaterial({color:0xc4a25c,metalness:.52,roughness:.4}),
   mural:new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.schoolLionMural||null,roughness:.92,emissive:0x17100a,emissiveIntensity:.12})
  };
  for(const material of Object.values(materials))material.color.convertSRGBToLinear();
  const staticMeshes=[];
  function mesh(kind,key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group,dynamic=false){
   const o=new T.Mesh(geo[kind],materials[key]);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=kind!=='sphere';o.receiveShadow=true;parent.add(o);if(!dynamic&&parent===group)staticMeshes.push(o);return o;
  }
  const box=(key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0)=>mesh('box',key,x,y,z,sx,sy,sz,rx,ry,rz);
  function windowView(side,z,index,count){
   if(!courtyardMaterial)return;
   const width=3.65,height=2.15,image=courtyard.image||{},aspect=(image.naturalWidth||image.width||2172)/(image.naturalHeight||image.height||724),u0=index/count,uSpan=1/count,vSpan=Math.min(1,uSpan*aspect/(width/height)),v0=(1-vSpan)/2;
   const geometry=geo.windowPlane.clone(),uv=geometry.getAttribute('uv');for(let i=0;i<uv.count;i++)uv.setXY(i,u0+uv.getX(i)*uSpan,v0+uv.getY(i)*vSpan);uv.needsUpdate=true;
   const view=new T.Mesh(geometry,courtyardMaterial);view.name='art_studio_courtyard_window_'+(side<0?'west':'east')+'_'+index;view.scale.set(width,height,1);view.position.set(side*10.97,2.555,z);view.rotation.y=side>0?Math.PI/2:-Math.PI/2;view.renderOrder=-1;view.userData.artWorkshopExteriorBackdrop=true;group.add(view);windowViewCount++;
  }
  function target(id,name,x,y,z,sx=2,sy=1.8,sz=1.5){const o=new T.Mesh(new T.BoxGeometry(sx,sy,sz),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));o.position.set(x,y,z);o.userData={id:'artwork_'+id,name,label:name,hint:'摸到工坊裡的對應物件，再口說辨識完成步驟',onClick:()=>root.ArtWorkshopChapter.open(id)};group.add(o);w.interactables.push(o);return o;}
  function letterMaterial(letter){const canvas=root.document.createElement('canvas');canvas.width=96;canvas.height=96;const context=canvas.getContext('2d');context.fillStyle='#f4ead5';context.fillRect(0,0,96,96);context.fillStyle='#263d45';context.textAlign='center';context.textBaseline='middle';context.font='bold 68px sans-serif';context.fillText(letter,48,50);const map=new T.CanvasTexture(canvas);map.encoding=T.sRGBEncoding;return new T.MeshBasicMaterial({map,toneMapped:false});}
  // Warm timber floor, acoustic ceiling and a broad unobstructed circulation lane.
  box('floor',0,-.16,0,21.6,.32,24.2);
  box('wall',0,2.25,-12,21.6,4.5,.3);
  // Split each side wall around real window openings; the generated school-courtyard panorama sits beyond the glazing.
  const sideWindowZ=[-8.3,-3.4,2.1,7.3],windowWidth=3.65,windowBottom=1.48,windowTop=3.63;
  for(const side of [-1,1]){
   sideWindowZ.forEach((z,index)=>windowView(side,z,index,sideWindowZ.length));
   box('wall',side*10.8,.74,0,.3,1.48,24.2);box('wall',side*10.8,(windowTop+4.5)/2,0,.3,4.5-windowTop,24.2);
   let cursor=-12.1;for(const z of sideWindowZ){const a=z-windowWidth/2,b=z+windowWidth/2;if(a>cursor)box('wall',side*10.8,(windowBottom+windowTop)/2,(cursor+a)/2,.3,windowTop-windowBottom,a-cursor);cursor=b;}if(cursor<12.1)box('wall',side*10.8,(windowBottom+windowTop)/2,(cursor+12.1)/2,.3,windowTop-windowBottom,12.1-cursor);
   for(const z of sideWindowZ){
    box('glass',side*10.58,2.55,z,.045,2.15,windowWidth);
    for(let i=0;i<=3;i++)box('metal',side*10.52,2.55,z-windowWidth/2+i*windowWidth/3,.09,2.3,.065);
    for(const y of [1.42,2.55,3.68])box('metal',side*10.52,y,z,.1,.065,windowWidth+.1);
    box('trim',side*10.36,1.38,z,.42,.18,windowWidth+.2);
   }
  }
  box('wall',-5.9,2.25,12,9.8,4.5,.3);box('wall',5.9,2.25,12,9.8,4.5,.3);box('wall',0,3.85,12,3.6,1.3,.3);
  box('trim',0,4.48,0,21.6,.22,24.2);
  for(const x of [-9,-5,0,5,9])box('darkWood',x,4.26,0,.12,.24,23.5);
  // Tall windows and deep sills make the room read as part of a real school wing.
  // Soft mural lighting, visible acoustic panels and hanging paper lanterns.
  for(const x of [-7,-3,3,7]){box('white',x,4.1,-1,.95,.08,2.5);const lamp=new T.PointLight(0xffe5b5,.24,9,2);lamp.position.set(x,3.82,-1);group.add(lamp);}
  for(const z of [-8.8,-5.8,-2.8,.2,3.2,6.2,9.2])box(z%2?'trim':'white',0,4.34,z,2.1,.035,.08);
  // A hand-painted school mural, framed as a permanent artwork rather than a floating lesson sign.
  box('darkWood',0,2.94,-11.76,10.9,3.15,.22);box('brass',0,2.94,-11.625,10.52,2.78,.045);
  const mural=new T.Mesh(new T.PlaneGeometry(10.32,2.58),materials.mural);mural.position.set(0,2.94,-11.58);mural.castShadow=false;group.add(mural);
  // The chalkboard is a normal classroom fixture with a brass chalk rail and bits of colored chalk.
  box('darkWood',-8.95,2.65,-10.25,2.65,1.9,.22);box('blackboard',-8.95,2.68,-10.11,2.47,1.65,.045);box('brass',-8.95,1.79,-10.06,2.52,.075,.12);
  for(let i=0;i<5;i++)box(['white','coral','yellow','teal','blue'][i],-9.84+i*.4,1.88,-9.99,.25,.035,.04,0,0,-.02);
  // Shallow material cupboards; paper stacks, fabric bolts and pigment jars create layered depth.
  for(const x of [-9.55,9.55]){
   box('wood',x,1.55,1.75,1.62,3.0,.72);box('darkWood',x,3.09,1.75,1.7,.13,.82);box('darkWood',x,.08,1.75,1.7,.13,.82);
   for(const y of [.55,1.38,2.22]){box('darkWood',x,y,1.75,1.65,.075,.78);for(let i=0;i<4;i++){const color=['coral','teal','yellow','blue'][i];box(color,x-.55+i*.36,y+.25,1.69,.28,.42,.49);}}
   for(let i=0;i<4;i++){const roll=mesh('cylinder',i%2?'purple':'coral',x-.48+i*.32,3.2,1.35,.17,.72,.17,Math.PI/2,0,Math.PI/2);mesh('cylinder','paper',x-.48+i*.32,3.2,1.72,.17,.06,.17,Math.PI/2,0,Math.PI/2);}
  }
  // Two large, sturdy work tables with realistic legs, edge guards, paper and brushes.
  function worktable(x,z){
   box('darkWood',x,1.02,z,4.65,.14,2.5);box('wood',x,1.12,z,4.58,.11,2.42);
   for(const dx of [-2.05,2.05])for(const dz of [-.96,.96])box('metal',x+dx,.51,z+dz,.085,1.02,.085);
   for(const dx of [-1.3,0,1.3]){box('paper',x+dx,1.22,z-.18,1.0,.025,.78,0,0,dx*.025);box('white',x+dx,1.235,z-.65,.72,.015,.16);}
   for(let i=0;i<4;i++){const brush=mesh('cylinder',i%2?'teal':'coral',x+1.72,1.55,z+.55+i*.14,.035,.67,.035,0,0,-.16+i*.1);mesh('cone','yellow',x+1.72-.05,1.91,z+.55+i*.14,.038,.16,.038,0,0,-.16+i*.1);}
  }
  worktable(-4.25,-.1);worktable(4.25,-.1);
  box('darkWood',0,1.05,4.5,4.2,.14,2.0);box('wood',0,1.15,4.5,4.12,.11,1.92);
  for(const x of [-1.72,1.72])for(const z of [3.7,5.3])box('metal',x,.53,z,.08,1.05,.08);
  for(let i=0;i<5;i++){box(['coral','teal','yellow','blue','purple'][i],-1.75+i*.72,1.25,4.3,.54,.045,.86,0,0,(i-2)*.035);}
  // Pencil cup and chunky primary pencils with sharpened wood tips.
  mesh('cylinder','teal',-4.55,1.48,-.72,.33,.58,.33);
  for(let i=0;i<7;i++){const a=i*Math.PI*2/7,x=-4.55+Math.cos(a)*.18,z=-.72+Math.sin(a)*.18;mesh('cylinder',['coral','yellow','blue','green','purple'][i%5],x,1.95,z,.045,.78,.045,0,0,.12*Math.cos(a));mesh('cone','paper',x+.05*Math.cos(a),2.37,z+.05*Math.sin(a),.045,.17,.045,0,0,.12*Math.cos(a));}
  // Metric ruler, long glue stick and capped markers laid on a low tool tray.
  box('yellow',-1.83,1.32,-.78,1.75,.055,.19);for(let i=0;i<=12;i++)box('black',-2.65+i*.137,1.356,-.78,.018,.012,i%3===0?.12:.065);
  mesh('cylinder','purple',.05,1.47,-.75,.105,.48,.105);mesh('cylinder','coral',.05,1.72,-.75,.115,.11,.115);box('paper',.05,1.82,-.75,.22,.04,.22);
  box('darkWood',4.0,1.28,-.78,1.68,.08,.54);
  for(let i=0;i<5;i++){const x=3.45+i*.27;mesh('cylinder',['coral','blue','green','purple','yellow'][i],x,1.54,-.78,.075,.53,.075,0,0,(i-2)*.04);mesh('cylinder','white',x,1.82,-.78,.08,.09,.08,0,0,(i-2)*.04);mesh('cylinder','black',x,1.27,-.78,.08,.12,.08,0,0,(i-2)*.04);}
  // A real classroom workflow: rinse tools at the double basin, then leave wet pictures on a wheeled rack.
  box('darkWood',9.36,.47,7.3,1.42,.9,3.05);box('wood',9.3,.96,7.3,1.62,.13,3.28);
  for(const z of [6.55,8.05]){
   box('metal',9.05,.99,z,.82,.045,1.18);
   box('black',9.02,1.025,z,.68,.025,1.02);
   for(const x of [8.62,9.42])box('metal',x,1.02,z,.045,.07,1.24);
   for(const dz of [-.61,.61])box('metal',9.02,1.02,z+dz,.84,.07,.045);
   mesh('cylinder','metal',9.05,1.2,z-.16,.035,.25,.035);
   mesh('cylinder','metal',8.91,1.39,z-.16,.19,.035,.035,0,0,Math.PI/2);
   mesh('cylinder','metal',8.76,1.31,z-.16,.035,.14,.035);
   for(const dz of [-.4,.4])mesh('cylinder','brass',9.02,1.18,z+dz,.065,.035,.065);
  }
  // Cabinet doors, small pulls, and exposed drain traps make the sink read as a built-in fixture.
  for(const z of [6.55,8.05]){box('trim',8.63,.47,z,.035,.68,1.34);mesh('cylinder','brass',8.57,.51,z+.48,.045,.055,.055,0,0,Math.PI/2);}
  mesh('cylinder','metal',9.12,.12,7.3,.035,.54,.035);mesh('cylinder','metal',9.12,-.08,7.3,.035,.035,.34,Math.PI/2);
  // A low tiled splash strip fits below the real window sill without covering the courtyard view.
  for(let i=0;i<10;i++){const z=5.85+i*.32;box(i%3===0?'teal':'trim',10.39,1.27,z,.13,.28,.29);if(i%2===0)box('blue',10.315,1.29,z,.025,.1,.1);}
  // Mobile wire drying rack: angled paper sheets sit on four open mesh shelves and the feet have casters.
  const rackX=-5.5,rackZ=6.6;
  for(const x of [rackX-.52,rackX+.52])for(const z of [rackZ-.92,rackZ+.92]){
   box('metal',x,1.12,z,.055,2.25,.055);
   mesh('cylinder','black',x,.11,z,.1,.06,.1,Math.PI/2,0,0);
  }
  for(let level=0;level<4;level++){
   const y=.38+level*.53;
   for(const x of [rackX-.54,rackX+.54])box('metal',x,y,rackZ,.045,.045,1.94);
   for(let i=0;i<9;i++)box('metal',rackX-.48+i*.12,y,rackZ,.025,.028,1.82);
   const sheet=box(level%2?'paper':'white',rackX,y+.11,rackZ-.04,.83,.025,1.36,.05,0,0);
   sheet.castShadow=false;
   for(const dz of [-.66,.66])box('coral',rackX,y+.14,rackZ+dz,.16,.025,.045);
  }
  for(const y of [.72,1.25,1.78])box('metal',rackX,y,rackZ-.94,1.06,.04,.045);
  // Child-height stools are spaced along the outside of each shared worktable.
  for(const [x,z] of [[-5.2,-1.83],[-3.3,-1.83],[3.3,-1.83],[5.2,-1.83]]){
   box('wood',x,.58,z,.72,.14,.72);
   for(const dx of [-.27,.27])for(const dz of [-.27,.27])box('metal',x+dx,.29,z+dz,.055,.55,.055);
   box('metal',x,.32,z,.58,.045,.58);
   stoolCount++;
  }
  // A small easel presents completed student art; its side tray holds paint and fan brushes.
  box('darkWood',7.85,2.0,4.15,.14,3.1,.14);box('darkWood',6.95,.52,4.25,.14,1.05,.14);box('darkWood',8.75,.52,4.25,.14,1.05,.14);
  box('paper',7.85,2.18,4.0,1.75,2.15,.08);box('coral',7.85,2.38,3.94,.92,.12,.035);
  mesh('cylinder','yellow',8.98,.87,3.92,.24,.44,.24);mesh('cylinder','coral',8.98,1.11,3.92,.245,.08,.245);mesh('cylinder','teal',8.98,.66,3.92,.19,.04,.19);
  mesh('cylinder','teal',9.6,.83,4.12,.34,.1,.34);mesh('cylinder','yellow',9.6,.9,4.12,.28,.055,.28);mesh('sphere','coral',9.6,1.12,4.12,.19,.22,.19);
  // An illustrated dictionary and wooden letter blocks make English a physical art-table activity.
  const lexiconX=-7.65,lexiconZ=7.25;
  box('darkWood',lexiconX,1.3,lexiconZ,1.95,.11,.72);
  box('coral',lexiconX,1.39,lexiconZ,1.22,.07,.66);
  box('paper',lexiconX-.29,1.45,lexiconZ,.55,.045,.58,0,0,-.035);
  box('paper',lexiconX+.29,1.45,lexiconZ,.55,.045,.58,0,0,.035);
  box('darkWood',lexiconX,1.46,lexiconZ,.045,.075,.63);
  for(let i=0;i<4;i++){
   const x=lexiconX-.54+i*.36,y=1.68+(i%2)*.035;
   box(['blue','coral','green','purple'][i],x,y,lexiconZ+.43,.28,.28,.28,0,(i-1.5)*.06,0);
   box('paper',x,y+.145,lexiconZ+.43,.19,.025,.19);
   const face=new T.Mesh(new T.PlaneGeometry(1,1),letterMaterial('ABCD'[i]));face.position.set(x,y,lexiconZ+.577);face.scale.set(.17,.17,1);group.add(face);
  }
  group.userData.artWorkshopPhysicalExhibits={english:{kind:'open-picture-dictionary-and-letter-blocks',bookPages:2,letterBlocks:4,visibleLetterFaces:4,targetId:'artwork_english'}};
  // Warm track heads illuminate the artwork while keeping the actual room geometry prominent.
  const muralLight=new T.SpotLight(0xffe6c4,.85,15,Math.PI/5,.48,1.3);muralLight.position.set(-1.5,4.12,-8.7);muralLight.target.position.set(0,2.8,-11.5);group.add(muralLight,muralLight.target);
  for(const x of [-7,7]){const fill=new T.PointLight(0xffeacb,.32,8,2);fill.position.set(x,3.6,4.5);group.add(fill);}
  // Targets overlap the actual learning props. The final exit returns to the real-world school courtyard.
  target('blackboard','黑板 · BLACKBOARD',-8.95,2.55,-9.86,2.8,2.2,1.0);
  target('mural','舞獅壁畫 · PICTURE',0,2.9,-10.9,8.5,3.2,1.35);
  target('pencil','鉛筆杯 · PENCIL',-4.55,1.95,-.72,1.6,1.7,1.7);
  target('ruler','量尺 · RULER',-1.83,1.35,-.78,2.2,1.0,1.3);
  target('glue','紙鱗片膠水 · GLUE',.05,1.48,-.75,1.4,1.2,1.3);
  target('marker','彩色筆盤 · MARKER',4.0,1.53,-.78,2.3,1.2,1.2);
  target('art','彩繪作品桌 · ART',7.85,2.0,4.15,3.2,3.2,2.1);
  target('english','繪本與字母積木 · ENGLISH',-7.65,1.65,7.4,2.45,1.35,1.0);
  const exit=target('exit','校園走廊出口 · 回新港國小',0,1.45,10.8,3.1,2.4,1.1);
  exit.userData.onClick=()=>{if(manager.switchZone('zone12')){w.player.pos.set(8.1,1.6,8.2);w.player.yaw=Math.PI;w.adventureProgress?.save(true);}};
  group.userData.artWorkshopDetails={courtyardWindows:windowViewCount,stools:stoolCount,sinkBasins:2,dryingRackShelves:4};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of staticMeshes){if(!o.isMesh||!o.geometry)continue;const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){if(items.length<2)continue;const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xfff1dc,0x6e6557,.48);group.add(hemi);const key=new T.DirectionalLight(0xffe4bf,.58);key.position.set(-5,9,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-16,right:16,top:14,bottom:-14,near:.5,far:40});group.add(key,key.target);
  root.ArtWorkshopChapter?.sync?.();
 }
 const api={bounds,colliders:()=>obstacles.map(o=>({...o})),build};root.ArtWorkshopScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
