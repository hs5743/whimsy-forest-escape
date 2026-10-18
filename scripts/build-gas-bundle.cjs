// The complete single-file distribution is generated from the same modules used in tests.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const modules=['Code.gs','AdventureSchema.gs','AdventureCheckpoints.gs','LearningSchema.gs','StudentRecords.gs','LearningHub.gs','TeacherAccess.gs'];
function generate(){
 let content='/** GENERATED complete v2.6.0 backend. Replace Code.gs; retain the existing deployment URL.\n * Do not run initSpreadsheet on an existing database. Old separate helper files may remain.\n * Every module below is private so it cannot collide with old helper declarations.\n */\nvar WHIMSY_BACKEND_20261017=(function(){\nvar window={},globalThis=window;\n';
 for(const file of modules){
  content+='\n// --- '+file+' ---\n'+fs.readFileSync(path.join(base,'gas',file),'utf8').replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'')+'\n';
  if(file==='AdventureSchema.gs')content+='var AirportChapter=window.AirportChapter,GreenhouseChapter=window.GreenhouseChapter,RestaurantChapter=window.RestaurantChapter,SchoolChapter=window.SchoolChapter,HarmonicaChapter=window.HarmonicaChapter,RealmQuests=window.RealmQuests,AdventureProgress=window.AdventureProgress;\n';
  if(file==='LearningSchema.gs')content+='var LearningRewards=window.LearningRewards;\n';
 }
 content+='return {get:doGet,post:doPost,initialize:initSpreadsheet,configureTeacher:configureTeacherAccess};\n})();\n';
 content+='function doGet(e){return WHIMSY_BACKEND_20261017.get(e);}\nfunction doPost(e){return WHIMSY_BACKEND_20261017.post(e);}\nfunction initSpreadsheet(){return WHIMSY_BACKEND_20261017.initialize();}\nfunction configureTeacherAccess(){return WHIMSY_BACKEND_20261017.configureTeacher();}\n';
 return content;
}
if(require.main===module){const dir=path.join(base,'gas-release');fs.mkdirSync(dir,{recursive:true});const content=generate();fs.writeFileSync(path.join(dir,'Code.gs'),content);fs.writeFileSync(path.join(dir,'完整主程式_直接貼上.txt'),content);}
module.exports={modules,generate};
