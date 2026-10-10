/* Stationary 3D surroundings and a closed, camera-centred sky. */
(function(root){
  'use strict';
  const profiles={
    zone2:{sky:'landscapeDaySky',haze:0xc4dce3,ground:0x73845d,rock:0x9b9983,inner:30,hills:12,trees:85,town:26},
    zone3:{sky:'landscapeDaySky',haze:0xc3dfcf,ground:0x61764b,rock:0x888a71,inner:34,hills:18,trees:180},
    zone4:{sky:'landscapeDaySky',haze:0xcbdde5,ground:0x6d845d,rock:0x93998a,inner:37,hills:15,trees:95,town:8},
    zone5:{sky:'landscapeNightSky',haze:0x25354e,ground:0x404a42,rock:0x6d7481,inner:30,hills:15,trees:60,town:32,night:true},
    zone6:{sky:'landscapeDaySky',haze:0xb8d9e3,ground:0x6b8456,rock:0x979a89,inner:34,islands:true,trees:80},
    zone7:{sky:'landscapeNightSky',haze:0x253349,ground:0x555d64,rock:0x8a93a3,inner:34,hills:25,trees:25,night:true},
    zone8:{sky:'landscapeAuroraSky',haze:0x36485b,ground:0xc5d8de,rock:0x8ba2b0,inner:34,hills:32,trees:35,snow:true,night:true},
    zone9:{sky:'landscapeNightSky',haze:0x33354e,ground:0x7b8399,rock:0x656a86,inner:34,floating:true,night:true},
    zone10:{sky:'landscapeDaySky',haze:0xc8e1ed,ground:0x6e9872,rock:0x99a6ae,inner:34,floating:true}
  };
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
  function random(seed){let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
  function heightAt(profile,x,z){
    const r=Math.hypot(x,z),rise=smooth((r-profile.inner-2)/35);
    const ridges=.46+.22*Math.sin(x*.031+z*.017)+.17*Math.cos(z*.043-x*.023)+.12*Math.sin(x*.081)*Math.cos(z*.057);
    return -.22+rise*((profile.hills||12)*ridges+Math.sin(x*.17+z*.12)*1.1);
  }
  function seamWeight(u){return smooth(Math.min(u,1-u)/.035);}
  function skyKey(zoneId){return profiles[zoneId]?.sky||null;}
  function makeSky(T,texture,profile){
    const material=new T.ShaderMaterial({
      uniforms:{skyMap:{value:texture},haze:{value:new T.Color(profile.haze).convertSRGBToLinear()}},
      vertexShader:'varying vec3 direction; void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:`uniform sampler2D skyMap;uniform vec3 haze;varying vec3 direction;
        void main(){
          vec3 d=normalize(direction);float u=atan(d.z,d.x)/6.28318530718+0.5;
          float v=asin(clamp(d.y,-1.0,1.0))/3.14159265359+0.5;
          vec3 image=texture2D(skyMap,vec2(u,v)).rgb;
          vec3 edge=(texture2D(skyMap,vec2(0.001,v)).rgb+texture2D(skyMap,vec2(0.999,v)).rgb)*0.5;
          float blend=smoothstep(0.0,0.035,min(u,1.0-u));image=mix(edge,image,blend);
          vec3 pole=texture2D(skyMap,vec2(0.5,v>0.5?0.999:0.001)).rgb;
          image=mix(image,pole,smoothstep(0.96,1.0,abs(d.y)));
          vec3 color=pow(image,vec3(2.2));
          float horizon=1.0-smoothstep(0.0,0.15,abs(d.y));
          color=mix(color,haze,horizon*0.72);if(d.y<0.0)color=mix(color,haze,smoothstep(0.0,0.35,-d.y));
          gl_FragColor=vec4(color,1.0);
          #include <tonemapping_fragment>
          #include <encodings_fragment>
        }`,
      side:T.BackSide,depthWrite:false,fog:false
    });
    const sky=new T.Mesh(new T.SphereGeometry(220,64,32),material);sky.name='ContinuousSky';sky.renderOrder=-100;sky.frustumCulled=false;sky.userData.nonBlocking=true;return sky;
  }
  function terrain(T,profile){
    const segments=160,rings=24,positions=[],colors=[],uvs=[],indices=[];
    const low=new T.Color(profile.ground).convertSRGBToLinear(),rock=new T.Color(profile.rock).convertSRGBToLinear(),snow=new T.Color(0xe0edf0).convertSRGBToLinear();
    for(let j=0;j<=rings;j++){
      const r=profile.inner+(155-profile.inner)*j/rings;
      for(let i=0;i<=segments;i++){
        const angle=(i===segments?0:i)*Math.PI*2/segments,x=Math.cos(angle)*r,z=Math.sin(angle)*r,y=heightAt(profile,x,z);
        positions.push(x,y,z);uvs.push(x/18,z/18);
        const relief=smooth((y-3)/(profile.hills||12));const c=low.clone().lerp(profile.snow?snow:rock,relief*.7);
        const variation=.92+.08*Math.sin(x*.29+z*.14)*Math.cos(z*.22);c.multiplyScalar(variation);colors.push(c.r,c.g,c.b);
        if(j<rings&&i<segments){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,a+1,b,b,a+1,b+1);}
      }
    }
    const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);geometry.computeVertexNormals();
    const normals=geometry.attributes.normal;
    for(let j=0;j<=rings;j++){const a=j*(segments+1),b=a+segments,n=new T.Vector3(normals.getX(a)+normals.getX(b),normals.getY(a)+normals.getY(b),normals.getZ(a)+normals.getZ(b)).normalize();normals.setXYZ(a,n.x,n.y,n.z);normals.setXYZ(b,n.x,n.y,n.z);}
    const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({vertexColors:true,roughness:1,metalness:0}));mesh.name='HorizonTerrain';mesh.receiveShadow=true;return mesh;
  }
  function batches(T,group,rng){
    const object=new T.Object3D();
    return (name,geometry,material,placements)=>{
      if(!placements.length){geometry.dispose();material.dispose();return;}
      const mesh=new T.InstancedMesh(geometry,material,placements.length);mesh.name=name;
      placements.forEach((p,i)=>{object.position.set(p.x,p.y,p.z);object.rotation.set(p.rx||0,p.ry||0,p.rz||0);object.scale.set(p.sx||1,p.sy||1,p.sz||1);object.updateMatrix();mesh.setMatrixAt(i,object.matrix);if(p.color!==undefined)mesh.setColorAt(i,new T.Color(p.color).multiplyScalar(.9+rng()*.2));});
      mesh.instanceMatrix.needsUpdate=true;mesh.receiveShadow=true;group.add(mesh);return mesh;
    };
  }
  function trees(T,group,profile,rng,locations,manager){
    if(manager?.tex.landscapeTree&&!profile.snow){
      const placements=[],texture=manager.tex.landscapeTree;manager.ensureTexture(texture);
      for(const p of locations){const h=5+rng()*7,a=rng()*Math.PI*2;for(const offset of [0,Math.PI/2])placements.push({x:p.x,y:p.y+h*.5,z:p.z,sx:h*.83,sy:h,sz:1,ry:a+offset});}
      const tint=new T.Color(profile.night?0x718294:0xb8c2ae).convertSRGBToLinear();
      const mesh=batches(T,group,rng)('LandscapeTreeCutouts',new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:texture,color:tint,alphaTest:.48,side:T.DoubleSide,fog:true,depthWrite:true}),placements);
      if(mesh){mesh.visible=false;manager.world.animators.push(()=>{mesh.visible=manager.textureStatus?.get(texture)==='ready';});}return;
    }
    const trunks=[],leaves=[],batch=batches(T,group,rng);
    for(const point of locations){
      const h=4+rng()*6,angle=rng()*Math.PI*2;
      trunks.push({x:point.x,y:point.y+h*.36,z:point.z,sx:.14+h*.015,sy:h*.75,sz:.14+h*.015,ry:angle});
      for(let j=0;j<5;j++){
        const a=angle+j*2.4,width=h*(.2+(1-j/5)*.08);
        leaves.push({x:point.x+Math.cos(a)*width*.42,y:point.y+h*(.5+j*.095),z:point.z+Math.sin(a)*width*.42,sx:width,sy:width*.8,sz:width*.85,color:profile.snow?(j>2?0xc3d9d8:0x436568):[0x3c6043,0x547647,0x65864e,0x456e55][j%4]});
      }
    }
    batch('LandscapeTrunks',new T.CylinderGeometry(.8,1,1,7),new T.MeshStandardMaterial({color:0x655343,roughness:1}),trunks);
    batch('LandscapeCanopies',new T.IcosahedronGeometry(1,2),new T.MeshStandardMaterial({vertexColors:false,roughness:1}),leaves);
  }
  function town(T,group,profile,rng,manager){
    const walls=[],roofs=[],windows=[],frames=[],doors=[],batch=batches(T,group,rng);
    for(let i=0;i<(profile.town||0);i++){
      const a=i/(profile.town||1)*Math.PI*2+.18,r=profile.inner+10+rng()*16;
      const x=Math.cos(a)*r,z=Math.sin(a)*r,y=heightAt(profile,x,z),w=3+rng()*3.5,h=4+rng()*5,d=3+rng()*2.5;
      const facing=-a-Math.PI/2;
      walls.push({x,y:y+h/2,z,sx:w,sy:h,sz:d,ry:facing,color:profile.night?0x777e86:[0xd6c8aa,0xcaccc0,0xccb7a1][i%3]});
      roofs.push({x,y:y+h+.65,z,sx:w*.62,sy:1.6,sz:d*.76,ry:Math.PI/4+facing,color:profile.night?0x505a70:0x9d6550});
      const dx=-Math.cos(a),dz=-Math.sin(a),fx=-Math.sin(a),fz=Math.cos(a);
      for(let floor=0;floor<Math.floor(h/2);floor++)for(const side of [-1,1]){
        const wx=x+fx*side*w*.24+dx*(d/2+.055),wz=z+fz*side*w*.24+dz*(d/2+.055),wy=y+1.4+floor*2;
        frames.push({x:wx,y:wy,z:wz,sx:.9,sy:1.15,sz:.12,ry:facing});
        windows.push({x:wx+dx*.075,y:wy,z:wz+dz*.075,sx:.67,sy:.9,sz:.055,ry:facing});
      }
      doors.push({x:x+dx*(d/2+.06),y:y+.85,z:z+dz*(d/2+.06),sx:.8,sy:1.7,sz:.1,ry:facing});
    }
    batch('VillageWalls',new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({map:manager.tex.landscapeStone||null,roughness:.96}),walls);
    batch('VillageRoofs',new T.ConeGeometry(1,1,4),new T.MeshStandardMaterial({roughness:.92}),roofs);
    batch('VillageWindowFrames',new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:0x645c4f,roughness:.9}),frames);
    batch('VillageWindows',new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:profile.night?0xf7d391:0x67828c,emissive:profile.night?0xffc16f:0x182833,emissiveIntensity:profile.night?.65:.1,roughness:.3}),windows);
    batch('VillageDoors',new T.BoxGeometry(1,1,1),new T.MeshStandardMaterial({color:0x675545,roughness:.9}),doors);
  }
  function islands(T,group,profile,rng,manager){
    const locations=[],rock=new T.MeshStandardMaterial({map:manager.tex.landscapeStone||null,color:new T.Color(profile.rock).convertSRGBToLinear(),roughness:1}),green=new T.MeshStandardMaterial({color:new T.Color(profile.ground).convertSRGBToLinear(),roughness:1});
    const count=profile.floating?12:9;
    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2+.16,r=55+rng()*78,x=Math.cos(a)*r,z=Math.sin(a)*r,w=8+rng()*16,d=6+rng()*13;
      const y=profile.floating?-10+rng()*19:-.9;
      const g=new T.SphereGeometry(1,24,12),p=g.attributes.position;
      for(let j=0;j<p.count;j++){const vx=p.getX(j),vy=p.getY(j),vz=p.getZ(j);const warp=1+.1*Math.sin(vx*9+vz*6)*Math.cos(vy*5);p.setXYZ(j,vx*warp,vy>0?vy*.45:vy,vz*warp);}
      g.computeVertexNormals();const base=new T.Mesh(g,rock);base.position.set(x,y,z);base.scale.set(w,profile.floating?12:8,d);base.name=profile.floating?'FloatingIslandRock':'CoastalIslandRock';group.add(base);
      const top=new T.Mesh(new T.SphereGeometry(1,24,12),green);top.position.set(x,y+(profile.floating?4:2.9),z);top.scale.set(w*.9,1.5,d*.9);top.name='IslandVegetation';group.add(top);
      for(let j=0;j<7;j++){const ta=rng()*Math.PI*2,tr=rng()*.55;locations.push({x:x+Math.cos(ta)*w*tr,z:z+Math.sin(ta)*d*tr,y:top.position.y+1.5*Math.sqrt(1-tr*tr/(.9*.9))-.1});}
    }
    trees(T,group,profile,rng,locations,manager);
  }
  function build(manager,group,zoneId,texture){
    const profile=profiles[zoneId];if(!profile)return null;
    const T=root.THREE,world=manager.world,rng=random(9371+Number(zoneId.slice(4))*131);
    const surroundings=new T.Group();surroundings.name='RealmLandscape';surroundings.userData.landscape=true;surroundings.userData.nonBlocking=true;
    manager.ensureTexture?.(texture);
    const sky=makeSky(T,texture,profile);surroundings.add(sky);
    world.scene.fog=new T.FogExp2(profile.haze,profile.night?.0035:.003);
    world.animators.push(()=>{sky.position.x=world.player.pos.x;sky.position.z=world.player.pos.z;});
    if(profile.islands||profile.floating)islands(T,surroundings,profile,rng,manager);
    else{
      surroundings.add(terrain(T,profile));const locations=[];
      for(let i=0;i<profile.trees;i++){const a=rng()*Math.PI*2,r=profile.inner+9+rng()*78,x=Math.cos(a)*r,z=Math.sin(a)*r;locations.push({x,z,y:heightAt(profile,x,z)});}
      trees(T,surroundings,profile,rng,locations,manager);town(T,surroundings,profile,rng,manager);
    }
    surroundings.traverse(o=>{if(o.isMesh){o.userData.landscape=true;o.userData.nonBlocking=true;o.raycast=()=>{};}});group.add(surroundings);return surroundings;
  }
  root.RealmLandscape={profiles,skyKey,heightAt,seamWeight,random,build};if(typeof module!=='undefined')module.exports=root.RealmLandscape;
})(typeof window!=='undefined'?window:globalThis);
