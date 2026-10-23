/* Xiangshan-inspired tidal flat with a continuous raised trail and open wetland views. */
(function(root){
 'use strict';
 const bounds={minX:-12.2,maxX:12.2,minZ:-13.25,maxZ:13.25};
 const obstacles=[];
 function build(manager,group){
  const T=root.THREE,w=manager.world;
  const sky=manager.tex.xiangshanWetlandSky||manager.tex.landscapeDaySky;if(root.RealmLandscape)root.RealmLandscape.build(manager,group,'zone16',sky);
  const geo={box:new T.BoxGeometry(1,1,1),plane:new T.PlaneGeometry(1,1),cyl:new T.CylinderGeometry(1,1,1,14),sphere:new T.SphereGeometry(1,14,10),cone:new T.ConeGeometry(1,1,9)};
  const material={
   mud:new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.tidalMudflat,roughness:.98}),
   gravel:new T.MeshStandardMaterial({color:0xd2c9b4,map:manager.tex.weatherGravel,roughness:.94}),
   path:new T.MeshStandardMaterial({color:0xffffff,map:manager.tex.coastalConcrete,roughness:.93}),
   wood:new T.MeshStandardMaterial({color:0x726653,roughness:.86}),
   steel:new T.MeshStandardMaterial({color:0x818985,metalness:.48,roughness:.48}),
   rail:new T.MeshStandardMaterial({color:0x59635f,metalness:.34,roughness:.66}),
   water:new T.MeshStandardMaterial({color:0xb0c0bc,map:manager.tex.tidalWater,metalness:.01,roughness:.42,transparent:true,opacity:.7,depthWrite:false,side:T.DoubleSide}),
   pool:new T.MeshStandardMaterial({color:0xb8c6bd,map:manager.tex.tidalWater,metalness:.01,roughness:.46,transparent:true,opacity:.62,depthWrite:false,side:T.DoubleSide}),
   plant:new T.MeshStandardMaterial({color:0x687a5d,roughness:.96}),
   dryPlant:new T.MeshStandardMaterial({color:0x958b65,roughness:.96}),
   dark:new T.MeshStandardMaterial({color:0x39433f,roughness:.82}),
   cream:new T.MeshStandardMaterial({color:0xd9d5c8,roughness:.79}),
   rust:new T.MeshStandardMaterial({color:0xa7654b,roughness:.8}),
   crab:new T.MeshStandardMaterial({color:0x9d5a43,roughness:.76}),
   crabLight:new T.MeshStandardMaterial({color:0xe3d7c1,roughness:.7}),
   marshPhoto:new T.MeshStandardMaterial({map:manager.tex.xiangshanSaltmarsh||null,transparent:true,alphaTest:.36,depthWrite:false,roughness:1,side:T.DoubleSide}),
   crabPhoto:new T.MeshStandardMaterial({map:manager.tex.fiddlerCrabCutout||null,transparent:true,alphaTest:.32,depthWrite:false,roughness:.9,side:T.DoubleSide}),
   glass:new T.MeshStandardMaterial({color:0x9bc5c3,transparent:true,opacity:.36,roughness:.18,metalness:.04,depthWrite:false,side:T.DoubleSide})
  };
  const staticMeshes=[];
  function mesh(type,key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group,dynamic=false){const o=new T.Mesh(geo[type],material[key]);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=type!=='sphere';o.receiveShadow=true;parent.add(o);if(!dynamic&&parent===group)staticMeshes.push(o);return o;}
  function clue(id,name,x,y,z,sx=2.8,sy=2.4,sz=2.4){const hit=new T.Mesh(geo.box,new T.MeshBasicMaterial({visible:false}));hit.position.set(x,y,z);hit.scale.set(sx,sy,sz);hit.userData={id:'coast_'+id,name,label:name,hint:'觀察潮間帶地景，選出合適的英語，再口說完成。',onClick:()=>root.CoastChapter.open(id)};group.add(hit);w.interactables.push(hit);return hit;}
  function puddle(x,z,sx,sz,key='pool',seed=0){
   const n=18,positions=[x,.006,z],uvs=[.5,.5],indices=[];
   for(let i=0;i<n;i++){const a=i*Math.PI*2/n,edge=.83+.11*Math.sin(a*3+seed)+.055*Math.cos(a*5-seed*.7);positions.push(x+Math.cos(a)*sx*edge,.006,z+Math.sin(a)*sz*edge);uvs.push(.5+Math.cos(a)*edge*.48,.5+Math.sin(a)*edge*.48);}
   for(let i=0;i<n;i++){const next=(i+1)%n;indices.push(0,next+1,i+1);}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();const o=new T.Mesh(g,material[key]);o.receiveShadow=true;group.add(o);return o;
  }
  function waterChannel(points,width){
   const vertices=[],uvs=[],indices=[];let distance=0;
   for(let i=0;i<points.length;i++){const p=points[i],prev=points[Math.max(0,i-1)],next=points[Math.min(points.length-1,i+1)],dx=next[0]-prev[0],dz=next[1]-prev[1],len=Math.hypot(dx,dz)||1,nx=-dz/len,nz=dx/len;if(i>0)distance+=Math.hypot(p[0]-points[i-1][0],p[1]-points[i-1][1]);vertices.push(p[0]+nx*width/2,.009,p[1]+nz*width/2,p[0]-nx*width/2,.009,p[1]-nz*width/2);uvs.push(distance/4,.5-width/8,distance/4,.5+width/8);if(i<points.length-1){const a=2*i,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,b,c,d);}}
   const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();const o=new T.Mesh(g,material.water);o.receiveShadow=true;group.add(o);return o;
  }
  function addReeds(x,z,seed,count=6){
   const clump=new T.Group();clump.position.set(x,0,z);group.add(clump);
   if(manager.tex.xiangshanSaltmarsh){
    for(let j=0;j<2;j++){
     const card=new T.Mesh(geo.plane,material.marshPhoto);card.position.set((j?1:-1)*.06,.62+(j*.03),0);card.scale.set(1.4+(seed%3)*.1,.98+(seed%2)*.16,1);card.rotation.y=(seed*.31)+(j*Math.PI/2);card.castShadow=false;card.receiveShadow=false;clump.add(card);
    }
   }else{
    for(let j=0;j<count;j++){const a=j*2.399+seed*.17,h=.55+((j*7+seed)%5)*.12,r=.11+(j%3)*.055;const blade=mesh('cone',j%4===0?'dryPlant':'plant',Math.cos(a)*r,h*.43,Math.sin(a)*r,.045,h,.045,0,0,Math.cos(a)*-.27,clump);blade.castShadow=false;}
   }
  }
  // One broad, uninterrupted mud surface uses a single texture pass; the pools and channels break up its silhouette.
  mesh('box','mud',0,-.22,0,24.5,.42,27.5);
  puddle(-8.4,5.2,2.6,1.1,'pool',1);puddle(-8.9,1.9,2.1,.78,'water',2);puddle(-7.1,-1.4,2.8,1.05,'pool',3);
  puddle(7.8,2.2,2.7,1.08,'water',4);puddle(8.4,-2.1,2.4,1.2,'pool',5);puddle(7.3,-5.6,3.2,.9,'pool',6);
  puddle(-5.3,-8.9,2.8,.88,'water',7);puddle(5.4,-8.8,3.1,.82,'pool',8);
  waterChannel([[-10.2,7.7],[-9.3,5.3],[-9.8,3.2],[-8.4,1.2],[-8.7,-1.1],[-7.6,-3.6],[-7.1,-6.2],[-6.2,-9.2],[-6.9,-12.8]],1.05);
  waterChannel([[9.5,7.8],[8.5,5.9],[9.3,4.1],[8.4,2.4],[9.1,.5],[8.2,-1.3],[8.6,-3.4],[7.5,-5.4],[7.9,-7.6]],.74);
  waterChannel([[-6.5,-2.4],[-4.2,-2.9],[-2.3,-3.7],[-.5,-4.9],[1.8,-5.1],[4,-5.8],[6.6,-6.3]],.58);
  const shoal=mesh('box','gravel',0,-.005,-11.2,21,.045,2.8);shoal.rotation.y=.025;
  mesh('box','water',0,-.02,-13.05,24.2,.03,.42);
  // Salt-tolerant sedges cluster at habitat edges without hiding the open tidal flats.
  const reedSites=[[-10.5,9],[-9.1,6.8],[-10,0],[-8.8,-5.4],[-7.8,-10.4],[-5.7,7.2],[-5.2,-1],[-4.6,-7.2],[-3.5,-11],[4.8,7.8],[6.1,4.1],[9.8,6.6],[10,-.2],[9.4,-4.5],[6.8,-9.5],[4.1,-7.1],[2.5,-9.5]];
  reedSites.forEach((p,i)=>addReeds(p[0],p[1],i+3,4+(i%4)));
  // A continuous, gently curving raised concrete trail follows the crab-watching route.
  const routePoints=[[-1.45,11.45],[-1.6,8.25],[-1.35,5.15],[-.65,2.05],[.1,-1.1],[.95,-4.25],[1.65,-7.2],[1.7,-10.1]];
  const route=new T.CatmullRomCurve3(routePoints.map(p=>new T.Vector3(p[0],.35,p[1])),false,'centripetal');
  const length=route.getLength(),steps=Math.max(64,Math.ceil(length*4)),half=1.32,verts=[],uv=[],faces=[];
  for(let i=0;i<=steps;i++){const t=i/steps,p=route.getPoint(t),d=route.getTangent(t),nx=d.z,nz=-d.x;verts.push(p.x+nx*half,.35,p.z+nz*half,p.x-nx*half,.35,p.z-nz*half);uv.push(t*length/3.2,1,t*length/3.2,0);if(i<steps){const a=i*2,b=a+1,c=a+2,e=a+3;faces.push(a,b,c,b,e,c);}}
  const deckGeometry=new T.BufferGeometry();deckGeometry.setAttribute('position',new T.Float32BufferAttribute(verts,3));deckGeometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));deckGeometry.setIndex(faces);deckGeometry.computeVertexNormals();const deckMesh=new T.Mesh(deckGeometry,material.path);deckMesh.receiveShadow=true;deckMesh.castShadow=true;group.add(deckMesh);
  const railCurves=[];
  for(const side of [-1,1]){
   // Build offset rails from sampled tangents so the handrail follows every turn of the trail.
   const pts=[];for(let i=0;i<=steps;i++){const t=i/steps,p=route.getPoint(t),d=route.getTangent(t);pts.push(new T.Vector3(p.x+d.z*(half+.16)*side,1.02,p.z-d.x*(half+.16)*side));}
   const railCurve=new T.CatmullRomCurve3(pts,false,'centripetal');railCurves.push(railCurve);
   const top=new T.Mesh(new T.TubeGeometry(railCurve,steps,.045,7,false),material.rail);top.castShadow=true;top.receiveShadow=true;group.add(top);
   const midPts=pts.map(p=>new T.Vector3(p.x,.69,p.z)),midCurve=new T.CatmullRomCurve3(midPts,false,'centripetal');group.add(new T.Mesh(new T.TubeGeometry(midCurve,steps,.026,6,false),material.rail));
   for(let i=0;i<=steps;i+=5){const t=i/steps,p=route.getPoint(t),d=route.getTangent(t),x=p.x+d.z*(half+.16)*side,z=p.z-d.x*(half+.16)*side;mesh('cyl','steel',x,.72,z,.038,.76,.038);}
   for(let i=3;i<steps;i+=13){const t=i/steps,p=route.getPoint(t),d=route.getTangent(t),x=p.x+d.z*.98*side,z=p.z-d.x*.98*side;mesh('cyl','steel',x,.04,z,.105,.55,.105);}
  }
  // Expansion joints make the poured walkway legible at close range without interrupting its continuous curve.
  for(let distance=3.2;distance<length;distance+=3.2){const t=route.getUtoTmapping(0,distance),p=route.getPoint(t),d=route.getTangent(t),angle=Math.atan2(d.x,d.z);mesh('box','dark',p.x,.352,p.z,2.58,.008,.024,0,angle,0);}
  // The trail opens into a modest viewing deck instead of a roofed sign pavilion.
  mesh('box','path',1.7,.34,-11.25,4.8,.18,3.45);
  for(const x of [-.35,3.75])for(const z of [-12.45,-10.05])mesh('cyl','steel',x,.05,z,.115,.62,.115);
  // Small unobtrusive field notebook table on the landward bend.
  mesh('box','wood',-3.05,.66,-3.85,1.9,.13,1.05);for(const x of [-3.85,-2.25])for(const z of [-4.25,-3.45])mesh('cyl','steel',x,.32,z,.05,.64,.05);
  mesh('box','cream',-3.05,.77,-3.85,1.25,.035,.62,0,.03,-.03);
  for(const [x,key]of [[-3.45,'crab'],[-3.05,'crabLight'],[-2.65,'plant']]){mesh('cyl','glass',x,.98,-3.84,.12,.34,.12);mesh('sphere',key,x,1.17,-3.84,.095,.07,.095);}
  // Separate recycling and rubbish openings make the coast-care station recognizable without labels.
  for(const [x,key]of [[3.45,'plant'],[4.18,'cream']]){mesh('cyl',key,x,.63,-10.02,.31,1.05,.31);mesh('cyl','dark',x,1.18,-10.02,.34,.08,.34);mesh('box','dark',x,1.19,-10.02,.28,.08,.24);mesh('box','cream',x,1.41,-10.02,.44,.15,.05);}
  // Compact binoculars and a low bench establish human scale on the viewing deck.
  for(const x of [.55,2.82]){mesh('cyl','steel',x,.99,-11.25,.09,1.2,.09);mesh('box','dark',x,1.56,-11.25,.2,.11,.22);mesh('cyl','cream',x-.13,1.74,-11.34,.12,.22,.12);mesh('cyl','cream',x+.13,1.74,-11.34,.12,.22,.12);mesh('cyl','glass',x-.13,1.88,-11.34,.095,.07,.095);mesh('cyl','glass',x+.13,1.88,-11.34,.095,.07,.095);}
  mesh('box','wood',1.7,.77,-10.36,2.25,.13,.48);for(const x of [.82,2.58])for(const z of [-10.55,-10.17])mesh('cyl','steel',x,.43,z,.055,.74,.055);
  // Small fiddler crabs stay among the pools, away from the student route.
  function crab(x,z,s){
   const g=new T.Group();g.position.set(x,.025,z);g.scale.setScalar(s);group.add(g);
   if(manager.tex.fiddlerCrabCutout){const card=new T.Mesh(geo.plane,material.crabPhoto);card.position.y=.26;card.scale.set(.76,.51,1);card.rotation.y=.22;card.castShadow=false;card.receiveShadow=false;g.add(card);}
   else{mesh('sphere','crab',0,.2,0,.38,.22,.34,0,0,0,g);for(const side of [-1,1]){for(let j=0;j<3;j++){const a=side*(.35+j*.25),leg=mesh('cyl','crab',side*.34,.13,-.1+j*.1,.035,.38,.035,0,0,a,g);leg.castShadow=false;}mesh('cyl','crabLight',side*.42,.35,.12,.08,.22,.08,0,0,side*.45,g);}}
   return g;
  }
  [[-8.2,8.9,.74],[8.5,6.4,.77],[6.8,-6.8,.55],[-8.3,-4.8,.62]].forEach(v=>crab(...v));
  clue('beach','海岸線觀察點',-2.9,1.1,4.6,2.5,1.9,2.1);
  clue('sea','遠方海面',4.2,1.3,-10.15,2.7,2.4,2.2);
  clue('science','野外紀錄桌',-3.05,1.05,-3.85,2.5,2.2,2.3);
  clue('habitats','潮池與泥灘棲地',4.3,1.1,-3.4,2.9,1.9,2.3);
  clue('finding','招潮蟹觀察點',-8.2,1.0,8.9,2.5,2.1,2.4);
  clue('position','架高賞蟹步道',-.9,1.1,3.2,2.5,2.2,3.1);
  clue('look','觀察望遠鏡',1.7,1.8,-11.15,4.2,2.5,2.8);
  clue('trash','海岸守護分類桶',3.82,1.25,-10.02,2.8,2.2,2.1);
  const back=clue('exit','返回雲雨氣象觀測台',0,1.2,12.65,3.4,2.4,1.1);back.userData.onClick=()=>{if(manager.switchZone('zone15'))w.adventureProgress?.save(true);};
  group.updateMatrixWorld(true);const batches=new Map();for(const o of staticMeshes){const key=o.geometry.uuid+':'+o.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);}for(const items of batches.values()){if(items.length<2)continue;const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));inst.castShadow=inst.receiveShadow=true;group.add(inst);for(const o of items)o.parent.remove(o);}
  const hemi=new T.HemisphereLight(0xe9f1ed,0x5b6252,.18);group.add(hemi);const sun=new T.DirectionalLight(0xffe5bb,.28);sun.position.set(-12,18,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:.5,far:64});group.add(sun,sun.target);
  w.coastRefs={crabs:[],route};root.CoastChapter?.sync?.();
 }
 const api={bounds,colliders:()=>obstacles.map(x=>({...x})),build};root.CoastalScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
