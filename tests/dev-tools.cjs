const test=require('node:test'),assert=require('node:assert/strict');
const DevTools=require('../dev-tools.js');
const mods={
 AirportChapter:require('../airport-chapter.js'),
 GreenhouseChapter:require('../greenhouse-chapter.js'),
 HarmonicaChapter:require('../harmonica-chapter.js'),
 SchoolChapter:require('../school-chapter.js'),
 RestaurantChapter:require('../restaurant-chapter.js'),
 WeatherChapter:require('../weather-chapter.js'),
 CoastChapter:require('../coastal-chapter.js'),
 LibraryChapter:require('../library-chapter.js'),
 MakerspaceChapter:require('../makerspace-chapter.js'),
 CarnivalChapter:require('../carnival-chapter.js'),
 ArtWorkshopChapter:require('../art-workshop-chapter.js'),
 RealmQuests:require('../realm-quests.js')
};

test('dev tools stage recipes produce valid states across all 11 chapters and 9 realm quests',()=>{
 for(const [zone,cfg]of Object.entries(DevTools.chapters)){
  const C=mods[cfg.module];
  assert.equal(DevTools.stageCount(zone),cfg.steps);
  for(let n=0;n<=cfg.steps;n++){
   const s=DevTools.stateAt(zone,n,mods);
   assert.ok(s,`${zone} stage ${n} state should exist`);
   const validated=C.validate(s);
   assert.deepEqual(validated,s,`${zone} stage ${n} state must pass validate()`);
   assert.equal(C.solved(s),n===cfg.steps,`${zone} stage ${n} solved check`);
  }
  assert.equal(C.solved(DevTools.stateAt(zone,'max',mods)),true);
 }
 for(const zone of Object.keys(DevTools.quests)){
  assert.equal(DevTools.stageCount(zone),1);
  const fresh=DevTools.stateAt(zone,0,mods);
  const done=DevTools.stateAt(zone,1,mods);
  assert.equal(mods.RealmQuests.solved(zone,fresh),false,`${zone} fresh should not be solved`);
  assert.equal(mods.RealmQuests.solved(zone,done),true,`${zone} solved recipe should solve quest`);
 }
});
