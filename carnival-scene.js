/* Number Carnival: an open-air school fair with individually built stalls and countable props. */
(function(root){
  'use strict';

  const bounds={minX:-12.5,maxX:12.5,minZ:-12.5,maxZ:12.5};
  // Three stalls face the entrance from the far side; two on each wing leave a clear central approach.
  const boothPositions=[[-5.5,-8.2],[0,-8.7],[5.5,-8.2],[-9.1,-4.0],[-9.1,3.5],[9.1,-4.0],[9.1,3.5]];
  const booths=boothPositions.map(([x,z])=>({x,z,face:Math.atan2(-x,-z)}));
  const obstacles=[
    {minX:-12.5,maxX:-12.1,minZ:-12.5,maxZ:12.5},
    {minX:12.1,maxX:12.5,minZ:-12.5,maxZ:12.5},
    {minX:-12.5,maxX:12.5,minZ:-12.5,maxZ:-12.1},
    {minX:-10.8,maxX:-2.1,minZ:12.05,maxZ:12.5},
    {minX:2.1,maxX:10.8,minZ:12.05,maxZ:12.5},
    {minX:-2.2,maxX:2.2,minZ:-2.0,maxZ:1.7}
  ];
    for(const p of booths)obstacles.push({minX:p.x-1.9,maxX:p.x+1.9,minZ:p.z-1.9,maxZ:p.z+1.9});

  function build(manager,group){
    const T=root.THREE,w=manager.world;
    const geo={
      box:new T.BoxGeometry(1,1,1),
      plane:new T.PlaneGeometry(1,1),
      cyl:new T.CylinderGeometry(1,1,1,24),
      sphere:new T.SphereGeometry(1,16,12),
      torus:new T.TorusGeometry(1,.065,10,48),
      cone:new T.ConeGeometry(1,1,12)
    };
    const flagShape=new T.Shape();flagShape.moveTo(-.21,.22);flagShape.lineTo(0,-.16);flagShape.lineTo(.21,.22);flagShape.closePath();
    geo.flag=new T.ShapeGeometry(flagShape);
    function standard(color,extra={}){
      const material=new T.MeshStandardMaterial({color,roughness:.72,...extra});
      material.color?.convertSRGBToLinear?.();
      return material;
    }
    const mat={
      floor:standard(0xe3ddd2,{map:manager.tex.carnivalFloor,roughness:.92}),
      canopy:standard(0xffffff,{map:manager.tex.carnivalCanopy,roughness:.95,side:T.DoubleSide}),
      wood:standard(0xffffff,{map:manager.tex.carnivalBooth,roughness:.82}),
      tray:new T.MeshBasicMaterial({map:manager.tex.carnivalStarTray,transparent:true,alphaTest:.04,side:T.DoubleSide,toneMapped:false}),
      iron:standard(0x3a4549,{metalness:.42,roughness:.58}),
      brass:standard(0xc5a36b,{metalness:.58,roughness:.38}),
      dark:standard(0x302c37,{roughness:.68}),
      ivory:standard(0xe7ddc8,{roughness:.88}),
      coral:standard(0xb96f63,{roughness:.72}),
      teal:standard(0x3b7771,{roughness:.68}),
      blue:standard(0x526d91,{roughness:.65}),
      green:standard(0x345044,{roughness:.9}),
      foliage:standard(0x294b3e,{roughness:1}),
      foliageLight:standard(0x42644d,{roughness:1}),
      goldToken:standard(0xf0bd57,{metalness:.24,roughness:.32}),
      blueToken:standard(0x69b6cb,{metalness:.18,roughness:.28}),
      warmBulb:standard(0xffd78e,{emissive:0xe89a3b,emissiveIntensity:.9,roughness:.28}),
      coolBulb:standard(0xb8e2dc,{emissive:0x48a9a1,emissiveIntensity:.55,roughness:.3})
    };
    const flagMaterials=[0xb96f63,0x3b7771,0xe7ddc8,0x526d91].map(color=>standard(color,{side:T.DoubleSide,roughness:.88}));
    const canopyTints=[0xffffff,0xf0e5d0,0xdfe8dc,0xf0d9cd,0xe1e5ee,0xece2cd,0xd8e5e0].map(tint=>{
      const m=standard(tint,{map:manager.tex.carnivalCanopy,roughness:.95,side:T.DoubleSide});
      return m;
    });
    const staticMeshes=[];
    function mesh(kind,key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group){
      const material=typeof key==='string'?mat[key]:key;
      const o=new T.Mesh(geo[kind],material);
      o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);
      o.castShadow=kind!=='sphere';o.receiveShadow=true;parent.add(o);staticMeshes.push(o);return o;
    }
    const box=(key,x,y,z,sx,sy,sz,rx=0,ry=0,rz=0,parent=group)=>mesh('box',key,x,y,z,sx,sy,sz,rx,ry,rz,parent);
    function target(id,label,x,y,z,sx=3.3,sy=2.2,sz=3.1){
      const o=new T.Mesh(geo.box,new T.MeshBasicMaterial({visible:false}));
      o.position.set(x,y,z);o.scale.set(sx,sy,sz);
      o.userData={id:'carnival_'+id,name:label,label,hint:'看看這個攤位上有幾枚星籌，選出數量後，再口說完成。',onClick:()=>id==='exit'?leave():root.CarnivalChapter.open(id)};
      group.add(o);w.interactables.push(o);return o;
    }
    function leave(){if(manager.switchZone('zone2')){w.player.pos.set(0,1.6,9.4);w.player.yaw=Math.PI;w.adventureProgress?.save(true);}}

    // A broad paved approach makes the entry read as an outdoor plaza, not a roofed corridor.
    box('floor',0,-.2,0,54,.4,54);

    // Low, open perimeter fencing and a clear southern gate keep the fair legible in the night landscape.
    const fenceZ=-12.05;
    box('iron',0,.78,fenceZ,24.15,.12,.1);
    box('wood',0,.22,fenceZ,24.15,.18,.16);
    for(let x=-11.8;x<=11.81;x+=1.45){box('wood',x,.52,fenceZ,.09,.65,.12);}
    for(const x of [-11.9,-2.05,2.05,11.9])box('brass',x,.92,fenceZ,.18,.18,.18);
    for(const x of [-12.05,12.05]){
      box('iron',x,.78,0,.1,.12,24.1);box('wood',x,.22,0,.16,.18,24.1);
      for(let z=-11.8;z<=11.81;z+=1.45)box('wood',x,.52,z,.12,.65,.09);
    }
    for(let x=-12.05;x<=12.051;x+=1.45){
      if(Math.abs(x)<2.3)continue;
      box('wood',x,.53,12.05,.09,.66,.12);
    }
    for(const x of [-7,7]){box('iron',x,.78,12.05,9.8,.12,.1);box('wood',x,.22,12.05,9.8,.18,.16);}

    // Distant trees break the horizon without enclosing the fair with walls or a fake backdrop.
    const trees=[[-18,-14,5.2],[-22,-2,6.7],[-17,15,5.6],[18,-16,6.1],[22,-3,5.1],[17,15,6.8],[-11,21,5.3],[11,21,5.8]];
    for(let i=0;i<trees.length;i++){
      const [x,z,h]=trees[i],pot=new T.Group();pot.position.set(x,0,z);group.add(pot);
      mesh('cyl','dark',0,.42,0,.48,.82,.48,0,0,0,pot);
      mesh('cyl','wood',0,1.6,0,.18,h*.55,.18,0,0,0,pot);
      mesh('sphere',i%2?'foliage':'foliageLight',0,h*.8,0,1.75,2.0,1.5,0,0,0,pot);
      mesh('sphere','foliage',-.8,h*.67,.24,1.2,1.5,1.2,0,0,0,pot);
      mesh('sphere',i%2?'foliageLight':'foliage',.85,h*.7,-.15,1.25,1.55,1.25,0,0,0,pot);
    }

    // A small amount of practical festoon lighting replaces the former ceiling of oversized glowing spheres.
    for(const z of [-9.9,9.9]){
      box('iron',0,5.65,z,17,.035,.035);
      for(let i=0;i<4;i++)mesh('sphere',i===2?'coolBulb':'warmBulb',-6+i*4,5.24+(i%2)*.15,z,.065,.065,.065);
    }
    for(const [i,p] of [[-5.9,3.25,0],[5.9,3.25,0],[0,3.25,-5.9],[0,3.25,5.9],[0,4.2,0]].entries()){
      const light=new T.PointLight(i%2?0xffcb84:0x94d1cb,1.6,12,2);light.position.set(p[0],p[1],p[2]);light.castShadow=false;group.add(light);
    }

    function counter(p,number,index){
      const stall=new T.Group();stall.position.set(p.x,0,p.z);stall.rotation.y=p.face;group.add(stall);
      const frontColor=['coral','teal','blue','ivory','coral','teal','blue'][index];
      // Realistic timber counter, framed panels, foot rail and a small inset star medallion.
      box('wood',0,.8,0,2.75,1.2,1.58,0,0,0,stall);
      box(frontColor,0,.82,.805,2.5,.83,.055,0,0,0,stall);
      box('brass',0,1.28,.85,2.58,.08,.07,0,0,0,stall);
      box('brass',0,.35,.85,2.58,.07,.07,0,0,0,stall);
      box('wood',0,1.46,0,2.95,.14,1.82,0,0,0,stall);
      for(const x of [-1.15,1.15]){
        box('iron',x,.2,0,.12,.38,.12,0,0,0,stall);
        box('brass',x,.19,.0,.2,.08,.2,0,0,0,stall);
      }
      mesh('torus','brass',0,1.02,.9,.32,.035,.32,0,0,0,stall);
      mesh('sphere',index%2?'coolBulb':'warmBulb',0,1.02,.915,.12,.12,.05,0,0,0,stall);
      for(const x of [-1.08,1.08])for(const y of [.54,1.1])mesh('sphere','brass',x,y,.89,.055,.055,.045,0,0,0,stall);

      // Each booth has its own canvas roof and four slim supports; the central sky stays open.
      for(const x of [-1.72,1.72])for(const z of [-1.38,1.38]){
        box('iron',x,2.5,z,.075,3.85,.075,0,0,0,stall);
        box('brass',x,4.4,z,.13,.12,.13,0,0,0,stall);
      }
      mesh('box',canopyTints[index],0,4.43,0,3.78,.16,3.12,0,0,0,stall);
      box(frontColor,0,4.12,1.51,3.6,.46,.12,0,0,0,stall);
      box('ivory',0,3.91,1.58,3.4,.07,.055,0,0,0,stall);
      // Hand-sewn pennants and brass fixings give every stand a crafted, school-fair identity.
      for(let j=0;j<5;j++)mesh('flag',flagMaterials[(j+index)%flagMaterials.length],-1.4+j*.7,4.04,1.61,.9,.9,1,0,0,0,stall);
      // A short rail and one warm task lamp make the station feel used rather than decorated as a flat prop.
      box('brass',0,1.78,1.05,1.25,.055,.055,0,0,0,stall);
      mesh('sphere','warmBulb',0,3.82,1.1,.13,.13,.13,0,0,0,stall);

      // Countable enamel star tokens sit in orderly but comfortably spaced rows on the counter.
      const shape=new T.Shape();
      for(let k=0;k<10;k++){
        const a=-Math.PI/2+k*Math.PI/5,r=k%2?.5:1,x=Math.cos(a)*r,y=Math.sin(a)*r;
        if(k===0)shape.moveTo(x,y);else shape.lineTo(x,y);
      }
      shape.closePath();
      const starGeo=new T.ExtrudeGeometry(shape,{depth:.12,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.055,bevelThickness:.035});
      const starMat=index%2?mat.blueToken:mat.goldToken;
      const tokens=new T.InstancedMesh(starGeo,starMat,number),dummy=new T.Object3D();
      for(let n=0;n<number;n++){
        const col=n%5,row=Math.floor(n/5);
        dummy.position.set((col-2)*.43,1.56,.02+(row-1.5)*.38);
        dummy.rotation.set(-Math.PI/2,0,(n%3-1)*.08);dummy.scale.setScalar(.19);dummy.updateMatrix();tokens.setMatrixAt(n,dummy.matrix);
      }
      tokens.instanceMatrix.needsUpdate=true;tokens.castShadow=true;tokens.receiveShadow=true;tokens.userData.carnivalCount=number;stall.add(tokens);
      target(root.CarnivalChapter?.places[index]||['thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'][index],lessonsLabel(number),p.x*.76,1.2,p.z*.76);
    }
    booths.forEach((p,i)=>counter(p,13+i,i));

    // The compact prize dais and upright star wheel are the plaza's sightline anchor, not a giant platform.
    mesh('cyl','dark',0,.13,-.35,2.75,.26,2.75);
    mesh('cyl','wood',0,.29,-.35,2.55,.12,2.55);
    mesh('torus','brass',0,.38,-.35,2.38,.055,2.38,-Math.PI/2);
    box('wood',0,1.08,-.35,4.1,1.34,2.55);
    box('brass',0,1.78,-.35,4.2,.1,2.66);
    const tray=new T.Mesh(geo.plane,mat.tray);tray.position.set(0,1.85,-.35);tray.rotation.x=-Math.PI/2;tray.scale.set(3.55,2.38,1);tray.receiveShadow=true;group.add(tray);staticMeshes.push(tray);
    // Vertical star wheel behind the counter frames the final counting challenge.
    for(const x of [-1.18,1.18])box('iron',x,2.05,-1.18,.14,2.65,.16,0,0,(x<0?-.34:.34));
    mesh('torus','brass',0,3.42,-1.18,1.72,.1,1.72);
    mesh('torus','teal',0,3.42,-1.12,1.42,.045,1.42);
    mesh('sphere','warmBulb',0,3.42,-1.0,.22,.22,.14);
    for(let i=0;i<8;i++){
      const a=i*Math.PI/4;
      mesh('sphere',i%3?'warmBulb':'coolBulb',Math.cos(a)*1.72,3.42+Math.sin(a)*1.72,-1.14,.095,.095,.095);
    }
    target('twenty','二十枚星籌的嘉年華終站',0,1.35,-.35,4.3,2.9,3.5);

    // Four planted corners and a small gate arch add scale cues without filling the walkable plaza.
    for(const [x,z] of [[-10.8,-10.7],[10.8,-10.7],[-10.8,10.7],[10.8,10.7]]){
      mesh('cyl','dark',x,.22,z,.62,.44,.62);
      mesh('sphere','foliageLight',x,.82,z,.62,.82,.62);
    }
    box('wood',-2,2.05,11.72,.28,4.1,.28);box('wood',2,2.05,11.72,.28,4.1,.28);
    box('wood',0,4.13,11.72,4.28,.42,.3);box('brass',0,4.13,11.52,3.82,.09,.06);
    for(const x of [-1.05,-.35,.35,1.05])mesh('sphere','warmBulb',x,4.15,11.43,.065,.065,.065);
    const exit=new T.Mesh(geo.box,new T.MeshBasicMaterial({visible:false}));
    exit.position.set(0,1.75,11.38);exit.scale.set(4.0,4.0,1.35);
    exit.userData={id:'carnival_exit',name:'返回陽光微風市集',label:'返回陽光微風市集',hint:'由南側拱門回到陽光微風市集。',onClick:leave};group.add(exit);w.interactables.push(exit);

    // Batch repeated static details after resolving stall rotations; moving token groups remain independent.
    group.updateMatrixWorld(true);
    const invRoot=new T.Matrix4().copy(group.matrixWorld).invert(),batches=new Map();
    for(const o of staticMeshes){
      const key=o.geometry.uuid+':'+o.material.uuid;
      if(!batches.has(key))batches.set(key,[]);batches.get(key).push(o);
    }
    let instances=0;
    for(const list of batches.values())if(list.length>1){
      const inst=new T.InstancedMesh(list[0].geometry,list[0].material,list.length),local=new T.Matrix4();
      list.forEach((o,i)=>{local.multiplyMatrices(invRoot,o.matrixWorld);inst.setMatrixAt(i,local);});
      inst.instanceMatrix.needsUpdate=true;inst.castShadow=inst.receiveShadow=true;group.add(inst);
      for(const o of list)o.parent.remove(o);instances+=list.length;
    }
    return{meshes:group.children.filter(o=>o.isMesh).length,instanced:instances,interactables:9,openAir:true,individualStalls:7,clearEntry:true};
  }

  function lessonsLabel(n){return ({13:'十三枚星籌',14:'十四枚星籌',15:'十五枚星籌',16:'十六枚星籌',17:'十七枚星籌',18:'十八枚星籌',19:'十九枚星籌'})[n];}
  function colliders(){return obstacles.map(o=>({type:'box',...o}));}
  const api={bounds,colliders,build};root.CarnivalScene=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
