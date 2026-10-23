// The complete single-file distribution is generated from the same modules used in tests.
const fs=require('node:fs'),path=require('node:path');
const base=path.resolve(__dirname,'..');
const modules=['Code.gs','AdventureSchema.gs','AdventureCheckpoints.gs','LearningSchema.gs','StudentRecords.gs','LearningHub.gs','TeacherAccess.gs'];
function generate(){
 let content='/** GENERATED local development backend v2.8.0-dev (2026-10-23). Replace Code.gs only after review; retain the existing deployment URL.\n * Do not run initSpreadsheet on an existing database. Old separate helper files may remain.\n * Every module below is private so it cannot collide with old helper declarations.\n */\nvar WHIMSY_BACKEND_20261023=(function(){\nvar window={},globalThis=window;\n';
 for(const file of modules){
  content+='\n// --- '+file+' ---\n'+fs.readFileSync(path.join(base,'gas',file),'utf8').replace(/\r\n/g,'\n').replace(/[ \t]+$/gm,'')+'\n';
  if(file==='AdventureSchema.gs')content+='var AirportChapter=window.AirportChapter,GreenhouseChapter=window.GreenhouseChapter,WeatherChapter=window.WeatherChapter,RestaurantChapter=window.RestaurantChapter,SchoolChapter=window.SchoolChapter,HarmonicaChapter=window.HarmonicaChapter,LibraryChapter=window.LibraryChapter,MakerspaceChapter=window.MakerspaceChapter,RealmQuests=window.RealmQuests,AdventureProgress=window.AdventureProgress;\n';
  if(file==='LearningSchema.gs')content+='var LearningRewards=window.LearningRewards;\n';
 }
 content+='return {get:doGet,post:doPost,initialize:initSpreadsheet,configureTeacher:configureTeacherAccess};\n})();\n';
 content+='function doGet(e){return WHIMSY_BACKEND_20261023.get(e);}\nfunction doPost(e){return WHIMSY_BACKEND_20261023.post(e);}\nfunction initSpreadsheet(){return WHIMSY_BACKEND_20261023.initialize();}\nfunction configureTeacherAccess(){return WHIMSY_BACKEND_20261023.configureTeacher();}\n';
 return content;
}
if(require.main===module){const dir=path.join(base,'gas-release');fs.mkdirSync(dir,{recursive:true});const content=generate();fs.writeFileSync(path.join(dir,'Code.gs'),content);fs.writeFileSync(path.join(dir,'完整主程式_直接貼上.txt'),content);}
module.exports={modules,generate};
