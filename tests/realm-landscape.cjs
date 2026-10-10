const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const T=require('../three.min.js');globalThis.THREE=T;const L=require('../realm-landscape.js'),P=require('../game-polish.js');
const base=path.resolve(__dirname,'..');
function fixture(zone){const group=new T.Group(),world={scene:new T.Scene(),animators:[],player:{pos:new T.Vector3(0,1.6,0)}};const tex={landscapeDaySky:new T.Texture(),landscapeNightSky:new T.Texture(),landscapeAuroraSky:new T.Texture(),landscapeTree:new T.Texture(),landscapeStone:new T.Texture()};const manager={world,tex,textureStatus:new Map([[tex.landscapeTree,'ready']]),ensureTexture(){}};const landscape=L.build(manager,group,zone,tex[L.skyKey(zone)]);return {group,world,manager,landscape};}
test('every outdoor realm uses the appropriate new sky and a fully closed dome',()=>{
 for(let i=2;i<=10;i++){const id='zone'+i,f=fixture(id),sky=f.landscape.getObjectByName('ContinuousSky');assert.equal(sky.geometry.type,'SphereGeometry');assert.equal(sky.material.side,T.BackSide);assert.equal(sky.material.uniforms.skyMap.value,f.manager.tex[L.skyKey(id)]);assert.equal(sky.geometry.parameters.phiLength,Math.PI*2);assert.equal(sky.geometry.parameters.thetaLength,Math.PI);}
 assert.equal(L.skyKey('zone5'),'landscapeNightSky');assert.equal(L.skyKey('zone8'),'landscapeAuroraSky');assert.equal(L.skyKey('zone1'),null);
});
test('the terrain loop closes at identical positions and normals without a lighting seam',()=>{
 const f=fixture('zone3'),g=f.landscape.getObjectByName('HorizonTerrain').geometry,segments=160;
 for(let j=0;j<=24;j++)for(const attr of ['position','normal']){const data=g.attributes[attr],a=j*(segments+1),b=a+segments;for(const axis of ['X','Y','Z'])assert.equal(data['get'+axis](a),data['get'+axis](b));}
 assert.ok(g.attributes.normal.getY(0)>0);for(const v of g.attributes.position.array)assert.ok(Number.isFinite(v));
});
test('the sky follows translation while the terrain and villages remain stationary in the world',()=>{
 const f=fixture('zone2'),sky=f.landscape.getObjectByName('ContinuousSky'),ground=f.landscape.getObjectByName('HorizonTerrain'),town=f.landscape.getObjectByName('VillageWalls'),matrix=new T.Matrix4();town.getMatrixAt(0,matrix);const initial=matrix.clone();
 f.world.player.pos.set(8,1.6,-12);f.world.animators.forEach(fn=>fn(100,1/60));assert.equal(sky.position.x,8);assert.equal(sky.position.z,-12);assert.equal(sky.rotation.y,0);assert.equal(ground.position.x,0);town.getMatrixAt(0,matrix);assert.ok(matrix.equals(initial));
});
test('tree cutouts wait for a loaded alpha texture and remain opaque cutouts instead of sorting ghosts',()=>{
 const f=fixture('zone6'),trees=f.landscape.getObjectByName('LandscapeTreeCutouts');assert.equal(trees.visible,false);assert.equal(trees.material.transparent,false);assert.ok(trees.material.alphaTest>0);f.world.animators.forEach(fn=>fn());assert.equal(trees.visible,true);
 f.manager.textureStatus.set(f.manager.tex.landscapeTree,'failed');f.world.animators.forEach(fn=>fn());assert.equal(trees.visible,false);
});
test('decorative surroundings cannot steal interaction or create new shadow maps',()=>{
 const f=fixture('zone6');let meshes=0;f.landscape.traverse(o=>{if(o.isMesh){meshes++;assert.equal(o.userData.nonBlocking,true);const hits=[];o.raycast({},hits);assert.equal(hits.length,0);}});assert.ok(meshes>10);
 const renderer={toneMappingExposure:1},world={activeZoneGroup:f.group,renderer};P.applySceneStyle(world,'zone6');f.landscape.traverse(o=>{if(o.isMesh)assert.equal(o.castShadow,false);});
});
test('scene disposal releases landscape geometry and materials once while preserving shared textures',()=>{
 const f=fixture('zone6'),geometries=new Set(),materials=new Set(),counts=new Map();f.landscape.traverse(o=>{if(o.isMesh){geometries.add(o.geometry);materials.add(o.material);}});for(const resource of [...geometries,...materials]){counts.set(resource,0);resource.addEventListener('dispose',()=>counts.set(resource,counts.get(resource)+1));}let textureDisposals=0;for(const texture of Object.values(f.manager.tex))texture.addEventListener('dispose',()=>textureDisposals++);
 P.releaseGroup(f.group,new Set(Object.values(f.manager.tex)));assert.equal(textureDisposals,0);for(const count of counts.values())assert.equal(count,1);
});
test('the sky edge blend is continuous and symmetric at the full-turn boundary',()=>{
 assert.equal(L.seamWeight(0),0);assert.equal(L.seamWeight(1),0);assert.ok(L.seamWeight(1e-8)<1e-10);assert.ok(Math.abs(L.seamWeight(.01)-L.seamWeight(.99))<1e-12);assert.equal(L.seamWeight(.1),1);
});
test('the actual scene manager delegates every panorama path including the sky islands to the new surroundings',()=>{
 let calls=[];const window={RealmLandscape:{skyKey:L.skyKey,build:(...args)=>{calls.push(args);return 'landscape';}},addEventListener(){}};const c=vm.createContext({window,console,THREE:T});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',c);const m=Object.create(window.Manager.prototype);m.tex={landscapeDaySky:new T.Texture(),landscapeNightSky:new T.Texture(),landscapeAuroraSky:new T.Texture()};
 for(let i=2;i<=9;i++)assert.equal(m.buildZoneSkyPanorama({},'zone'+i,new T.Texture()),'landscape');assert.equal(m.buildSkyIslesAtmosphere({}),'landscape');assert.equal(calls.length,9);for(const call of calls)assert.equal(call[3],m.tex[L.skyKey(call[2])]);
});

test('near foliage has real branch volume, cutout depth and no decorative interaction occlusion',()=>{
 const f=fixture('zone3');f.manager.tex.naturalBark=new T.Texture();f.manager.tex.nearLeaves=new T.Texture();f.manager.textureStatus.set(f.manager.tex.nearLeaves,'ready');
 const result=L.buildNearTrees(f.manager,f.group,[{x:4,y:0,z:-3,height:6,width:2}]);assert.equal(result.trunk.count,1);assert.equal(result.branch.count,16);assert.equal(result.foliage.count,48);assert.equal(result.foliage.material.transparent,false);assert.equal(result.foliage.material.depthWrite,true);assert.equal(result.foliage.visible,false);f.world.animators.forEach(fn=>fn());assert.equal(result.foliage.visible,true);
 for(const mesh of Object.values(result)){const hits=[];mesh.raycast({},hits);assert.equal(hits.length,0);assert.equal(mesh.userData.nonBlocking,true);}const matrix=new T.Matrix4();result.branch.getMatrixAt(1,matrix);assert.ok(matrix.elements.every(Number.isFinite));
});
test('near foliage stays invisible when its alpha texture fails',()=>{
 const f=fixture('zone3');f.manager.tex.nearLeaves=new T.Texture();f.manager.textureStatus.set(f.manager.tex.nearLeaves,'failed');const result=L.buildNearTrees(f.manager,f.group,[{x:0,y:0,z:0,height:6}]);f.world.animators.forEach(fn=>fn());assert.equal(result.foliage.visible,false);
});
test('the actual ancient tree retains its original TREE hitbox, callbacks and four lanterns',()=>{
 const window={RealmLandscape:L,addEventListener(){}};const c=vm.createContext({window,console,THREE:T});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',c);const m=Object.create(window.Manager.prototype);m.tex={naturalBark:new T.Texture(),nearLeaves:new T.Texture()};m.textureStatus=new Map();m.ensureTexture=()=>{};m.world={animators:[],interactables:[]};const group=new T.Group();let invoked=0;const callback=()=>invoked++;m.buildAncientWorldTree(group,4.8,0,-4.5,'TREE label','TREE',callback);
 assert.equal(m.world.interactables.length,1);const hit=m.world.interactables[0];assert.equal(hit.userData.id,'TREE');assert.equal(hit.userData.onClick,callback);assert.equal(hit.position.y,2.4);assert.equal(hit.geometry.parameters.radiusTop,2.2);assert.equal(group.children[0].position.x,4.8);assert.equal(group.children[0].position.z,-4.5);hit.userData.onClick();assert.equal(invoked,1);let lights=0;group.traverse(o=>{if(o.isPointLight)lights++;});assert.equal(lights,4);assert.ok(group.getObjectByName('NaturalLeafClusters'));
});

test('snow pines use needle cutouts and separate volumetric drifts around radial branches',()=>{
 const f=fixture('zone8');f.manager.tex.snowNeedles=new T.Texture();f.manager.textureStatus.set(f.manager.tex.snowNeedles,'ready');const result=L.buildSnowPines(f.manager,f.group,[{x:0,y:0,z:0,height:6.2,width:2.5}]);assert.equal(result.branch.count,26);assert.equal(result.foliage.count,54);assert.equal(result.drifts.count,26);assert.equal(result.drifts.geometry.type,'SphereGeometry');assert.equal(result.foliage.material.transparent,false);f.world.animators.forEach(fn=>fn());assert.equal(result.foliage.visible,true);for(const mesh of Object.values(result)){const hits=[];mesh.raycast({},hits);assert.equal(hits.length,0);}
});
test('winter tree keeps the WINTER speech callback, rewards, lanterns and original hitbox',()=>{
 const window={RealmLandscape:L,addEventListener(){}};const c=vm.createContext({window,console,THREE:T});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',c);const m=Object.create(window.Manager.prototype);m.tex={naturalBark:new T.Texture(),pineBark:new T.Texture(),snowNeedles:new T.Texture(),snowFrost:new T.Texture(),glacialIce:new T.Texture()};m.textureStatus=new Map();m.ensureTexture=()=>{};let word,passed,xp=0,checks=0;m.checkZoneCompletionStatus=()=>checks++;m.world={animators:[],interactables:[],openSpeechCard:(w,fn)=>{word=w;passed=fn;},addXP:v=>xp+=v};const group=new T.Group();m.buildGlacialWinterPine(group,6.5,0,-1);assert.equal(m.world.interactables.length,1);const hit=m.world.interactables[0];assert.equal(hit.userData.id,'interact_WINTER');assert.equal(hit.geometry.parameters.height,6.6);assert.equal(hit.position.y,3.2);hit.userData.onClick();assert.equal(word,'WINTER');passed();assert.equal(xp,60);assert.equal(checks,1);assert.ok(group.getObjectByName('SnowPineNeedles'));let cones=0;group.traverse(o=>{if(o.geometry?.type==='ConeGeometry')cones++;});assert.equal(cones,20);
});

 test('fountain bowls expose water while preserving the WATER interaction and stable animation',()=>{
 const window={addEventListener(){}};const c=vm.createContext({window,console,THREE:T});vm.runInContext(fs.readFileSync(path.join(base,'spatial-zone-manager.js'),'utf8')+';window.Manager=SpatialZoneManager;',c);const m=Object.create(window.Manager.prototype);m.tex={marbleFountain:new T.Texture()};m.getSoftParticleTexture=()=>null;m.world={animators:[],interactables:[]};const group=new T.Group();let invoked=0;const callback=()=>invoked++;m.buildMarbleFountain(group,0,0,0,'WATER','WATER',callback);const hit=m.world.interactables[0];assert.equal(m.world.interactables.length,1);assert.equal(hit.geometry.parameters.radiusTop,2.8);assert.equal(hit.position.y,1.3);hit.userData.onClick();assert.equal(invoked,1);let bowls=0;group.traverse(o=>{if(o.geometry?.type==='LatheGeometry'){bowls++;for(const v of o.geometry.attributes.position.array)assert.ok(Number.isFinite(v));for(const v of o.geometry.attributes.normal.array)assert.ok(Number.isFinite(v));}});assert.equal(bowls,2);for(let i=0;i<120;i++)m.world.animators.forEach(fn=>fn(i/60,1/60));group.traverse(o=>assert.ok(Number.isFinite(o.position.y)));
});
