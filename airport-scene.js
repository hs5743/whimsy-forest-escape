/* Modelled modern international airport terminal and departure concourse.
   Vaulted architectural acoustic ceiling, high-end terrazzo flooring,
   panoramic apron curtain wall looking out to runway, jet bridge, and aircraft. */
(function(root){
 'use strict';
 const box=(x,z,w,d)=>({type:'box',minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 const obstacles=[box(-11,0,.3,28),box(11,0,.3,28),box(0,-14,22,.3),box(-6,14,10,.3),box(6,14,10,.3),box(-6.8,6,4.8,3),box(6.8,6,4.8,3),box(-6.8,-2,4.8,3),box(6.8,-2,4.8,3),box(-6.8,-10,4.8,3),box(6.8,-10,4.8,3),box(0,-10,3.2,3)];
 const bounds={minX:-10.65,maxX:10.65,minZ:-13.65,maxZ:13.65};

 function label(T,title,subtitle,badge='AIRPORT'){
  const c=root.document.createElement('canvas');c.width=1024;c.height=256;const q=c.getContext('2d');
  q.fillStyle='#0f172a';q.fillRect(0,0,1024,256);
  q.strokeStyle='#38bdf8';q.lineWidth=4;q.strokeRect(10,10,1004,236);
  q.fillStyle='#1e293b';q.fillRect(14,14,996,44);
  q.fillStyle='#38bdf8';q.font='bold 22px monospace';q.textAlign='left';q.fillText('✈️ STARLIGHT TERMINAL 1 · '+badge,32,44);
  q.fillStyle='#f8fafc';q.textAlign='center';q.font='bold 50px sans-serif';q.fillText(title,512,126,950);
  q.font='26px sans-serif';q.fillStyle='#94a3b8';q.fillText(subtitle,512,188,950);
  const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
 }

 function fidsTexture(T){
  const c=root.document.createElement('canvas');c.width=1024;c.height=512;const q=c.getContext('2d');
  q.fillStyle='#0b1120';q.fillRect(0,0,1024,512);
  q.strokeStyle='#f59e0b';q.lineWidth=6;q.strokeRect(8,8,1008,496);
  q.fillStyle='#1e293b';q.fillRect(16,16,992,56);
  q.fillStyle='#f59e0b';q.font='bold 28px sans-serif';q.textAlign='left';q.fillText('✈️ DEPARTURES · 航班出發時刻表',32,54);
  q.fillStyle='#38bdf8';q.font='bold 24px monospace';q.fillText('LOCAL TIME 08:45',780,54);
  q.fillStyle='#64748b';q.font='bold 20px monospace';
  q.fillText('FLIGHT     DESTINATION       SCHEDULED   GATE   REMARKS',32,106);
  q.strokeStyle='#334155';q.lineWidth=2;q.beginPath();q.moveTo(24,118);q.lineTo(1000,118);q.stroke();
  const flights=[
   ['SL-777','TOKYO / HND','09:15','02','NOW BOARDING', '#10b981'],
   ['SL-808','PARIS / CDG','09:40','04','ON TIME',      '#38bdf8'],
   ['SL-902','NEW YORK / JFK','10:05','06','ON TIME',   '#38bdf8'],
   ['SL-106','LONDON / LHR','10:30','01','DELAYED',     '#f43f5e'],
   ['SL-225','SINGAPORE / SIN','11:15','03','ON TIME',  '#38bdf8'],
   ['SL-318','SEOUL / ICN','11:45','05','GATE OPEN',    '#f59e0b'],
   ['SL-402','SYDNEY / SYD','12:20','02','ON TIME',     '#38bdf8']
  ];
  flights.forEach(([fl,dst,tm,gt,rm,col],i)=>{
   const y=156+i*48;
   q.fillStyle=i%2?'#0f172a':'#131c31';q.fillRect(20,y-32,984,42);
   q.fillStyle='#f8fafc';q.font='bold 22px monospace';q.fillText(fl,32,y-4);
   q.fillStyle='#cbd5e1';q.fillText(dst,210,y-4);
   q.fillStyle='#f59e0b';q.fillText(tm,540,y-4);
   q.fillStyle='#e2e8f0';q.fillText(gt,720,y-4);
   q.fillStyle=col;q.fillText(rm,810,y-4);
  });
  const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
 }

 function kioskTexture(T){
  const c=root.document.createElement('canvas');c.width=512;c.height=768;const q=c.getContext('2d');
  q.fillStyle='#0f172a';q.fillRect(0,0,512,768);
  q.strokeStyle='#38bdf8';q.lineWidth=6;q.strokeRect(10,10,492,748);
  q.fillStyle='#0284c7';q.fillRect(20,20,472,80);
  q.fillStyle='#ffffff';q.font='bold 34px sans-serif';q.textAlign='center';q.fillText('STARLIGHT AIR',256,72);
  q.font='20px sans-serif';q.fillText('SELF-SERVICE CHECK-IN · 自助報到',256,132);
  q.fillStyle='#1e293b';q.fillRect(40,170,432,240);
  q.strokeStyle='#334155';q.lineWidth=3;q.strokeRect(40,170,432,240);
  q.fillStyle='#38bdf8';q.font='bold 24px sans-serif';q.fillText('PLEASE SCAN BOARDING PASS',256,230);
  q.fillText('OR PASSPORT',256,268);
  q.fillStyle='#94a3b8';q.font='18px sans-serif';q.fillText('請掃描機票條碼或護照晶片',256,320);
  q.fillStyle='#0284c7';q.fillRect(80,350,352,44);
  q.fillStyle='#ffffff';q.font='bold 22px sans-serif';q.fillText('TAP HERE TO BEGIN · 點擊開始',256,380);
  q.fillStyle='#334155';q.fillRect(100,450,312,120);
  q.fillStyle='#22c55e';q.font='bold 20px monospace';q.fillText('SCANNER ACTIVE',256,515);
  q.fillStyle='#64748b';q.font='16px sans-serif';q.fillText('BAGGAGE TAG PRINTER READY',256,660);
  const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;
 }

 function build(manager,group){
  const T=root.THREE,w=manager.world,rng=root.RealmLandscape?.random(15487)||(()=>.5);
  const sky=manager.tex.landscapeNightSky||manager.tex.landscapeDaySky;
  if(sky&&root.RealmLandscape)root.RealmLandscape.build(manager,group,'zone15',sky);

  const geo={
   box:new T.BoxGeometry(1,1,1),
   ball:new T.SphereGeometry(1,12,8),
   stem:new T.CylinderGeometry(1,1,1,16),
   cone:new T.ConeGeometry(1,1,12),
   ring:new T.TorusGeometry(1,.08,8,24)
  };

  const colors={
   ceiling:0x1e293b,
   lightTroffer:0xfffbeb,
   steel:0x334155,
   brightSteel:0x64748b,
   brass:0xd97706,
   gold:0xf59e0b,
   terrazzoLight:0xf1f5f9,
   terrazzoGrey:0xcbd5e1,
   carpetNavy:0x0f172a,
   tarmacAsphalt:0x111827,
   runwayYellow:0xfacc15,
   runwayWhite:0xf8fafc,
   wallPanel:0x1e293b,
   woodSlat:0x3e2723,
   taxi:0xfacc15,
   navySeat:0x1e3a8a,
   emerald:0x10b981,
   screenCyan:0x38bdf8,
   black:0x0a0f1d,
   glassBlue:0x7dd3fc
  };

  const mat=Object.fromEntries(Object.entries(colors).map(([k,color])=>[
   k,
   new T.MeshStandardMaterial({
    color,
    roughness:['brass','gold','brightSteel'].includes(k)?.28:['terrazzoLight','terrazzoGrey','taxi'].includes(k)?.38:.85,
    metalness:['brass','gold','brightSteel','steel'].includes(k)?.7:.05
   })
  ]));
  mat.lightTroffer.emissive=new T.Color(0xfef08a);
  mat.lightTroffer.emissiveIntensity=0.65;
  mat.screenCyan.emissive=new T.Color(0x0284c7);
  mat.screenCyan.emissiveIntensity=0.45;

  const glass=new T.MeshStandardMaterial({
   color:0xbae6fd,
   transparent:true,
   opacity:.24,
   roughness:.08,
   metalness:.2,
   depthWrite:false,
   side:T.DoubleSide
  });

  for(const m of [...Object.values(mat),glass])m.color.convertSRGBToLinear();

  const statics=[];
  function mesh(g,m,x,y,z,a,b,c,rx=0,ry=0,rz=0,parent=group,dynamic=false){
   const o=new T.Mesh(geo[g],mat[m]);
   o.position.set(x,y,z);o.scale.set(a,b,c);o.rotation.set(rx,ry,rz);
   parent.add(o);
   if(!dynamic&&parent===group)statics.push(o);
   return o;
  }
  const b=(m,x,y,z,a,h,d)=>mesh('box',m,x,y,z,a,h,d);

  function plaque(title,subtitle,x,y,z,width=3.5,height=.85,rotation=0,badge='AIRPORT'){
   const p=new T.Mesh(new T.PlaneGeometry(width,height),new T.MeshBasicMaterial({map:label(T,title,subtitle,badge)}));
   p.position.set(x,y,z);p.rotation.y=rotation;group.add(p);return p;
  }
  function target(id,text,x,y,z,width=2,height=1.8,depth=1){
   const hit=new T.Mesh(new T.BoxGeometry(width,height,depth),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
   hit.position.set(x,y,z);
   hit.userData={id:'airport_'+id,name:text,label:text,hint:'先觀察航廈線索，再口說完成任務',onClick:()=>root.AirportChapter.open(id)};
   group.add(hit);w.interactables.push(hit);return hit;
  }

  // 1. FLOOR: Polished Terrazzo Concourse & Gate Lounge Carpet
  b('terrazzoGrey',0,-.16,0,22,.32,28);
  // High-traffic terrazzo tiles across the central and cross concourses
  for(let z=-13.6;z<=13.6;z+=.85)for(let x=-10.5;x<=10.5;x+=.85){
   const inLounge=x<-4.2&&x>-9.4&&z<-5.2&&z>-12.8;
   const inKiosk=x<-4.2&&x>-9.4&&z>-2.2&&z<2.2;
   const inBaggage=x>4.2&&x<9.4&&z>-2.2&&z<2.2;
   const tileMat=inLounge?'carpetNavy':inKiosk?'terrazzoLight':inBaggage?'steel':((Math.round(x+z)%2===0)?'terrazzoLight':'terrazzoGrey');
   b(tileMat,x,-.01,z,.82,.06,.82);
  }
  // Tactile brass guiding strips leading from entrance to information counter and gate
  for(const x of [-3.2,3.2]){
   b('black',x,.03,0,.3,.02,27);
   for(let z=-13.2;z<13.5;z+=.24)b('gold',x,.048,z,.28,.02,.05);
  }
  // Yellow queue waiting threshold lines before Gate 2 and Check-in desks
  for(let x=-3;x<=3;x+=.6)b('runwayYellow',x,.025,-6.2,.48,.01,.12);
  for(let x=-9;x<=-4.5;x+=.6)b('runwayYellow',x,.025,4.2,.48,.01,.12);

  // 2. CEILING & ROOF: Vaulted Architectural Acoustic Slat Ceiling with Linear Recessed LED Troffers
  b('ceiling',0,7.5,0,22.4,.4,28.4);
  // Transverse architectural acoustic slats spanning across the roof
  for(let z=-13.8;z<=13.8;z+=.55){
   b('steel',0,7.2,z,22.2,.16,.18);
  }
  // Longitudinal modern LED light troffers running along concourses
  for(const x of [-6.8,-3.2,0,3.2,6.8]){
   for(let z=-13.2;z<=13.2;z+=1.2){
    b('lightTroffer',x,7.1,z,.22,.08,.9);
   }
  }

  // 3. STRUCTURAL MASSIVE AIRPORT COMPOSITE COLUMNS
  for(const x of [-6.8,6.8])for(const z of [-8,0,8]){
   // Flared cylindrical structural column
   mesh('stem','brightSteel',x,3.6,z,.48,7.2,.48);
   mesh('ring','gold',x,.45,z,.54,.54,.54,Math.PI/2);
   mesh('ring','gold',x,6.85,z,.58,.58,.58,Math.PI/2);
   b('ceiling',x,7.1,z,1.6,.2,1.6);
  }

  // 4. NORTH CURTAIN WALL: Grand Apron & Runway Observation Glass Window (z = -14)
  // Floor to ceiling structural steel mullions dividing panoramic viewing bays
  for(let x=-11;x<=11;x+=2.75){
   b('steel',x,3.6,-13.98,.16,7.2,.22);
  }
  for(const y of [1.8,3.6,5.4]){
   b('steel',0,y,-13.98,22,.14,.18);
  }
  b('steel',0,7.2,-13.98,22.2,.3,.28);
  b('wallPanel',0,.4,-13.98,22,.8,.32);
  const northGlass=new T.Mesh(new T.PlaneGeometry(22,6.4),glass);
  northGlass.position.set(0,3.6,-13.94);
  northGlass.userData.nonBlocking=true;
  group.add(northGlass);

  // OUTSIDE RUNWAY APRON TARMAC (visible through the panoramic glass curtain wall)
  b('tarmacAsphalt',0,-.18,-24,36,.28,20);
  // Yellow aircraft taxiway centerline
  for(let z=-14.5;z>-34;z-=1.5)b('runwayYellow',0,-.035,z,.25,.015,1.0);
  // White runway threshold stripes in the distance
  for(let x=-14;x<=14;x+=2.0)b('runwayWhite',x,-.035,-31,.35,.015,3.2);
  // Glowing taxiway edge and runway elevated marker lights
  for(const x of [-10,-5,5,10])for(let z=-16;z>-32;z-=3.5){
   mesh('stem','brightSteel',x,.15,z,.04,.3,.04);
   mesh('ball',x<0?'screenCyan':'gold',x,.32,z,.08,.08,.08);
  }
  // Modern Enclosed Passenger Boarding Bridge (Jet Bridge / 空橋) connecting Gate 2 to aircraft!
  b('steel',0,2.8,-11.5,2.4,2.2,4.8);
  b('wallPanel',0,2.8,-11.5,2.3,2.1,4.7);
  for(const sign of [-1,1]){
   const bridgeGlass=new T.Mesh(new T.PlaneGeometry(4.6,1.4),glass);
   bridgeGlass.position.set(sign*1.16,2.8,-11.5);
   bridgeGlass.rotation.y=sign*Math.PI/2;
   group.add(bridgeGlass);
  }
  // Jet bridge telescopic head angled toward aircraft door
  b('brightSteel',0,2.8,-13.7,2.8,2.4,1.2);
  b('black',0,2.8,-14.3,2.6,2.2,.3);

  // 5. EAST & WEST INTERIOR ARCHITECTURAL CLADDING WALLS
  for(const sign of [-1,1]){
   const wx=sign*11;
   b('wallPanel',wx,3.6,0,.3,7.2,28);
   // Vertical acoustic wood and brushed aluminum slats
   for(let z=-13.5;z<=13.5;z+=.9){
    b((Math.round(z)%2===0)?'woodSlat':'brightSteel',sign*10.88,3.6,z,.08,7.0,.22);
   }
   b('gold',sign*10.82,2.4,0,.04,.06,28);
   b('gold',sign*10.82,4.8,0,.04,.06,28);
   // Large illuminated overhead concourse wayfinding signage
   const signTxt=sign>0?'🧳 BAGGAGE CLAIM 行李提領   ➔   🚖 TAXI 計程車接駁':'✈️ GATES A1–A10 候機大廳   ➔   🎫 SELF CHECK-IN 自助報到';
   plaque(signTxt,sign>0?'GROUND TRANSPORTATION & CAROUSEL':'BOARDING CONCOURSE & KIOSK ISLAND',sign*10.78,4.2,0,5.8,.9,sign*-Math.PI/2,sign>0?'ARRIVAL':'DEPARTURE');
  }

  // 6. SOUTH WALL: TERMINAL PORTAL & LINK TO CLOCK TOWER STATION (z = 14)
  for(const x of [-8.5,8.5])b('wallPanel',x,3.6,14,5,.2,7.2);
  b('steel',0,5.8,14,12,.3,3.2);
  b('wallPanel',0,6.5,14,12,.3,1.8);
  for(const x of [-3.2,3.2])b('brightSteel',x,2.6,14,.18,5.2,.24);
  // Automatic sliding glass doors
  for(const sign of [-1,1]){
   const dGlass=new T.Mesh(new T.PlaneGeometry(3.1,4.2),glass);
   dGlass.position.set(sign*1.6,2.1,13.92);
   group.add(dGlass);
  }
  plaque('星光國際機場 · 第一航廈','STARLIGHT AIRPORT · TERMINAL 1',0,5.1,13.88,6.8,1.25,Math.PI,'WELCOME');

  // 7. THE 8 AUTHENTIC AIRPORT FUNCTIONAL STATIONS

  // Station 1: 航廈迎賓櫃檯 (0, 10.7) - AIRPORT
  // Semicircular modern reception desk with backlit front panel and desktop monitors
  b('terrazzoLight',0,.65,10.7,3.6,1.0,1.2);
  b('screenCyan',0,.65,10.12,3.4,.8,.08);
  b('black',0,1.16,10.7,3.8,.08,1.35);
  for(const dx of [-.8,.8]){
   b('black',dx,1.4,10.5,.45,.35,.06);
   b('screenCyan',dx,1.4,10.46,.4,.3,.02);
   mesh('stem','brightSteel',dx+.4,1.3,10.5,.015,.35,.015);
  }
  // Overhead halo fixture with welcome emblem
  mesh('ring','gold',0,4.2,10.7,1.8,1.8,1.8,Math.PI/2);
  plaque('航廈迎賓櫃檯','INFORMATION · TERMINAL CONCIERGE',0,3.2,10.7,3.4,.8,0,'INFO');
  target('airport','航廈迎賓櫃檯 · AIRPORT',0,1.7,10.7);

  // Station 2: 停機坪全景觀景窗 (-6.8, 8) - PLANE
  // Chrome balustrade, floor observation markings, viewing telescope overlooking the runway
  b('carpetNavy',-6.8,.05,8,4.6,.08,2.8);
  for(const dx of [-2,-1,0,1,2]){
   mesh('stem','brightSteel',-6.8+dx,.65,9.2,.04,1.3,.04);
  }
  b('brightSteel',-6.8,1.3,9.2,4.4,.06,.06);
  b('glassBlue',-6.8,.75,9.2,4.2,.8,.04);
  // Free-standing observation telescope on pedestal
  mesh('stem','brightSteel',-6.8,.75,8,.12,1.2,.12);
  mesh('stem','brightSteel',-6.8,1.35,8,.08,.65,.08,0,0,Math.PI/6);
  mesh('ball','screenCyan',-6.8,1.45,7.75,.1,.1,.1);
  plaque('停機坪全景觀景區','APRON OBSERVATION DECK · VIEW RUNWAY & FLEET',-6.8,2.8,9.2,3.4,.8,Math.PI,'VIEW');
  target('plane','停機坪觀景窗 · PLANE',-6.8,1.7,8);

  // Station 3: 自助報到島 (-6.8, 0.1) - TICKET
  // Elevated island with 3 modern interactive kiosks
  b('steel',-6.8,.1,0.1,4.6,.18,2.8);
  b('gold',-6.8,.2,0.1,4.7,.04,2.9);
  const kioskMat=new T.MeshBasicMaterial({map:kioskTexture(T)});
  for(const [i,dx]of [-.9,0,.9].entries()){
   const kx=-6.8+dx*1.4,kz=0.1;
   b('wallPanel',kx,.85,kz,.65,1.5,.55);
   b('brightSteel',kx,.85,kz+.28,.55,1.2,.08);
   const scr=new T.Mesh(new T.PlaneGeometry(.48,.72),kioskMat);
   scr.position.set(kx,1.15,kz+.33);
   group.add(scr);
   b('screenCyan',kx,1.62,kz,.48,.08,.4);
  }
  plaque('智慧自助報到區','SELF-SERVICE CHECK-IN KIOSK ISLAND',-6.8,2.8,0.1,3.4,.8,0,'CHECK-IN');
  target('ticket','自助報到機 · TICKET',-6.8,1.8,0.1);

  // Station 4: 行李輸送帶 (6.8, 0.1) - BAG
  // Stainless steel oval carousel with center luggage slide
  b('steel',6.8,.1,0.1,4.6,.18,2.8);
  mesh('ring','brightSteel',6.8,.65,0.1,1.5,1.5,1.3,Math.PI/2);
  b('wallPanel',6.8,.65,0.1,2.0,.35,1.2);
  // Central sloped stainless baggage chute from wall
  b('brightSteel',8.4,1.1,0.1,1.8,.25,.9,0,0,-Math.PI/8);
  // Carousel pillar with flight display
  mesh('stem','brightSteel',6.8,1.4,0.1,.15,1.6,.15);
  b('black',6.8,2.2,0.1,1.4,.45,.45);
  b('gold',6.8,2.2,0.1,1.35,.4,.46);
  // 3 distinct luggage bags on the carousel belt
  const bags=[];
  const bagColors=['#ef4444','#0284c7','#f59e0b'];
  for(let i=0;i<3;i++){
   const bm=new T.MeshStandardMaterial({color:bagColors[i],roughness:.4,metalness:.2,transparent:true});
   bm.color.convertSRGBToLinear();
   const o=new T.Mesh(geo.box,bm);
   o.position.set(5.8+i*.8,.85,0.1+(i%2?-.3:.3));
   o.scale.set(.42,.26,.32);
   o.rotation.y=i*.6;
   group.add(o);
   bags.push(o);
  }
  plaque('行李提領轉盤 1 號','BAGGAGE CAROUSEL 01 · FLIGHT SL-808',6.8,2.8,0.1,3.4,.8,0,'BAG');
  target('bag','行李輸送帶 · BAG',6.8,1.8,0.1);

  // Station 5: 候機室指示燈與休息座 (-6.8, -7.8) - WAIT
  // Multiple rows of airport tandem beam seats in navy carpet lounge
  b('carpetNavy',-6.8,.05,-7.8,4.6,.08,2.8);
  for(const dz of [-.65,.65]){
   b('brightSteel',-6.8,.45,-7.8+dz,3.6,.08,.12);
   for(let i=-3;i<=3;i++){
    const sx=-6.8+i*.5,sz=-7.8+dz;
    b('brightSteel',sx,.35,sz,.04,.6,.04);
    b('navySeat',sx,.58,sz,.38,.08,.36);
    b('navySeat',sx,.85,sz-.16,.38,.45,.06);
   }
  }
  // USB/Power device charging tower
  b('wallPanel',-4.8,.8,-7.8,.3,1.4,.3);
  b('gold',-4.8,1.45,-7.8,.32,.08,.32);
  plaque('2號登機候機休息室','GATE 02 BOARDING LOUNGE · PLEASE WAIT',-6.8,2.8,-7.8,3.4,.8,0,'WAIT');
  target('wait','候機室指示燈 · WAIT',-6.8,1.7,-7.8);

  // Station 6: 登機門廣播台與空橋入口 (0, -7.8) - HURRY
  // Gate 2 agent podium, queue tensabarriers, gate monitor
  b('wallPanel',0,.75,-7.8,1.8,1.2,.65);
  b('brightSteel',0,1.38,-7.8,1.9,.08,.7);
  b('black',0,1.65,-7.85,.45,.35,.06);
  b('screenCyan',0,1.65,-7.82,.4,.3,.02);
  // Queue stanchions with taut retractable blue ribbon
  for(const dx of [-1.5,-.75,.75,1.5]){
   mesh('stem','brightSteel',dx,.5,-6.6,.035,.95,.035);
   mesh('stem','brightSteel',dx,.05,-6.6,.18,.08,.18);
  }
  b('screenCyan',-1.12,.8,-6.6,.75,.04,.01);
  b('screenCyan',1.12,.8,-6.6,.75,.04,.01);
  plaque('2 號登機門廣播台 · 空橋入口','GATE 02 BOARDING CALL · TOKYO / PARIS',0,2.8,-7.8,3.4,.8,0,'HURRY');
  target('hurry','登機門廣播台 · HURRY',0,1.8,-7.8);

  // Station 7: 計程車排班處 (6.8, 8) - TAXI
  // Ground transportation curb with yellow airport cab
  b('wallPanel',6.8,.1,8,4.6,.18,2.8);
  // Yellow and black safety curb hazard pattern
  for(let i=0;i<10;i++)b(i%2===0?'runwayYellow':'black',4.6+i*.44,.24,9.2,.42,.08,.14);
  // Yellow Airport Taxi Cab
  b('taxi',6.8,.92,8,2.4,.45,1.15);
  b('taxi',6.8,1.32,8,1.32,.36,.98);
  b('glassBlue',6.8,1.32,8,1.35,.28,.92);
  b('runwayWhite',6.8,1.55,8,.45,.12,.22);
  b('black',6.8,1.55,8,.38,.08,.24);
  for(const dx of [-.75,.75])for(const dz of [-.58,.58]){
   mesh('stem','black',6.8+dx,.72,8+dz,.22,.12,.22,Math.PI/2);
   mesh('stem','brightSteel',6.8+dx,.72,8+dz,.08,.14,.08,Math.PI/2);
  }
  plaque('地面交通 · 計程車排班處','TAXI STAND & GROUND TRANSPORTATION',6.8,2.8,8,3.4,.8,0,'TAXI');
  target('taxi','計程車乘車處 · TAXI',6.8,1.7,8);

  // Station 8: 航班時刻即時資訊大看板 (6.8, -7.8) - LATE
  // Massive multi-panel FIDS departure display board
  const fids=new T.Mesh(new T.PlaneGeometry(3.6,1.9),new T.MeshBasicMaterial({map:fidsTexture(T)}));
  fids.position.set(6.8,2.15,-7.8);
  group.add(fids);
  b('black',6.8,2.15,-7.85,3.75,2.05,.12);
  mesh('stem','brightSteel',5.2,1.1,-7.8,.05,2.1,.05);
  mesh('stem','brightSteel',8.4,1.1,-7.8,.05,2.1,.05);
  plaque('航班出發時刻資訊大看板','FLIGHT INFORMATION DISPLAY SYSTEM (FIDS)',6.8,3.4,-7.8,3.4,.8,0,'LATE');
  target('late','航班準點電子鐘 · LATE',6.8,1.7,-7.8);

  // Station 9: 航廈返程出口 (0, 13.1) - EXIT
  const exit=target('exit','返回星光鐘樓車站',0,1.6,13.1,2.8,2,.8);
  exit.userData.onClick=()=>{if(manager.switchZone('zone5'))w.adventureProgress?.save(true);};

  // 8. CENTRAL RUNWAY APRON JETLINER & ROTORS (0, -10)
  // Outside beyond gate, parked along lead-in line
  b('tarmacAsphalt',0,.3,-10,3.2,.6,3);
  b('gold',0,.63,-10,3.3,.07,3.1);
  for(let i=-4;i<=4;i++)b('runwayWhite',0,.62,-10+i*.3,.14,.02,.18);

  const plane=new T.Group();plane.position.set(0,1.65,-10);group.add(plane);
  mesh('stem','runwayWhite',0,0,0,.38,2.6,.38,Math.PI/2,0,0,plane);
  mesh('ball','runwayWhite',0,0,1.3,.37,.35,.55,0,0,0,plane);
  mesh('ball','screenCyan',0,.12,1.45,.26,.16,.32,0,0,0,plane);
  mesh('cone','runwayWhite',0,0,-1.55,.36,.65,.36,-Math.PI/2,0,0,plane);
  mesh('box','runwayWhite',0,.02,.1,3.6,.07,.55,0,0,0,plane);
  mesh('box','screenCyan',0,.48,-1.35,.08,.82,.48,.22,0,0,plane);
  mesh('box','runwayWhite',0,.12,-1.35,1.25,.05,.32,0,0,0,plane);
  const rotors=[];
  for(const sign of [-1,1]){
   mesh('box','screenCyan',sign*1.78,.22,.1,.06,.36,.24,0,0,-sign*.18,plane);
   mesh('stem','brightSteel',sign*.88,-.16,.25,.16,.48,.16,Math.PI/2,0,0,plane);
   const r=new T.Group();r.position.set(sign*.88,-.16,.5);plane.add(r);
   for(let k=0;k<4;k++)mesh('box','gold',0,0,0,.04,.26,.02,0,0,k*Math.PI/4,r);
   rotors.push(r);
  }
  const beacon=new T.Group();beacon.position.set(0,2.5,-10);group.add(beacon);
  for(let i=0;i<8;i++){
   const a=i*Math.PI/4;
   mesh('ball',i%2?'emerald':'gold',Math.cos(a)*1.2,Math.sin(i)*.1,Math.sin(a)*1.2,.09,.09,.09,0,0,0,beacon);
  }
  beacon.visible=false;

  // 9. INSTANCING BATCH OPTIMIZATION
  group.updateMatrixWorld(true);
  const batches=new Map();
  for(const o of statics){
   const key=o.geometry.uuid+':'+o.material.uuid;
   if(!batches.has(key))batches.set(key,[]);
   batches.get(key).push(o);
  }
  for(const items of batches.values()){
   const inst=new T.InstancedMesh(items[0].geometry,items[0].material,items.length);
   items.forEach((o,i)=>inst.setMatrixAt(i,o.matrix));
   inst.castShadow=inst.receiveShadow=true;
   group.add(inst);
   for(const o of items)o.parent.remove(o);
  }

  // 10. MODERN AIRPORT LIGHTING: Bright Interior Ceiling Lights + Cool Apron Night Floodlights
  const hemi=new T.HemisphereLight(0xe0f2fe,0x1e293b,1.1);
  group.add(hemi);
  const sun=new T.DirectionalLight(0xfffbeb,1.4);
  sun.position.set(0,14,0);
  sun.target.position.set(0,0,0);
  sun.castShadow=true;
  sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-16,right:16,top:18,bottom:-18,near:.5,far:50});
  sun.shadow.bias=-.0002;
  sun.shadow.normalBias=.035;
  group.add(sun,sun.target);

  // Exterior apron floodlight illuminating the jetliner and tarmac through the window
  const apronLight=new T.DirectionalLight(0x7dd3fc,1.2);
  apronLight.position.set(-8,10,-18);
  apronLight.target.position.set(0,1,-12);
  group.add(apronLight,apronLight.target);

  w.airportRefs={plane,beacon,bags};
  w.animators.push(t=>{
   const motion=w.settings?.reducedMotion?0:Math.sin(t*2.4)*.06;
   plane.position.y=1.65+motion;
   for(const r of rotors)r.rotation.z=w.settings?.reducedMotion?0:t*8;
  });
  root.AirportChapter.sync?.();

  if(root.ModelAssetManager&&root.ModelAssetManager.isReady&&root.ModelAssetManager.upgradeAirportScene){
   root.ModelAssetManager.upgradeAirportScene(group);
  }
 }

 function buildEntrance(manager,group){
  const T=root.THREE,w=manager.world,g=new T.Group();
  g.position.set(-7.5,0,7.5);g.rotation.y=Math.PI/4;group.add(g);
  const frame=new T.MeshStandardMaterial({color:0x1e293b,roughness:.45,metalness:.6}),gold=new T.MeshStandardMaterial({color:0xf59e0b,metalness:.75,roughness:.25});
  for(const x of [-1.1,1.1]){
   const p=new T.Mesh(new T.BoxGeometry(.18,3.2,.18),frame);p.position.set(x,1.6,0);g.add(p);
   const cap=new T.Mesh(new T.SphereGeometry(.18,12,8),gold);cap.position.set(x,3.25,0);g.add(cap);
  }
  const arch=new T.Mesh(new T.TorusGeometry(1.1,.1,8,32,Math.PI),gold);arch.position.y=2.9;g.add(arch);
  const sign=new T.Mesh(new T.PlaneGeometry(3.2,.95),new T.MeshBasicMaterial({map:label(T,'星光國際機場','完成車站驗票任務後開放','EXPRESS')}));
  sign.position.set(0,3.9,.1);g.add(sign);
  const hit=new T.Mesh(new T.BoxGeometry(2.4,2.6,1.1),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
  hit.position.y=1.4;
  hit.userData={
   id:'station_airport_entry',
   name:'星光國際機場快線入口',
   label:'星光國際機場 · 新的八字冒險',
   hint:'先完成車站的準時驗票任務',
   onClick:()=>{
    if(!root.RealmQuests.solved('zone5',w.gameState.realmPuzzles?.zone5)){
     w.showToast('先完成星光車站的準時驗票任務，再搭乘機場快線前往星光國際機場！');
     return;
    }
    if(manager.switchZone('zone15'))w.adventureProgress?.save(true);
   }
  };
  g.add(hit);w.interactables.push(hit);
 }

 const api={bounds,colliders:()=>obstacles.map(c=>({...c})),build,buildEntrance};
 root.AirportScene=api;
 if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
