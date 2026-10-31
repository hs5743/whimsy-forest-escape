#!/usr/bin/env node
/* Zero-dependency local static server for development.
   Usage: npm run dev            -> http://localhost:5173/?dev=1
          npm run dev -- 8080    -> custom port
   Binds to 127.0.0.1 only. Dev mode (level select) is enabled only on localhost. */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.argv[2])||5173;
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 let rel=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(rel.endsWith('/'))rel+='index.html';
 const file=path.join(root,rel);
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden');}
 fs.readFile(file,(err,data)=>{
  if(err){res.writeHead(404);return res.end('Not found');}
  res.writeHead(200,{'Content-Type':types[path.extname(file).toLowerCase()]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 });
}).listen(port,'127.0.0.1',()=>{
 console.log('Whimsy Forest dev server running:');
 console.log('  遊戲（開發者模式）  http://localhost:'+port+'/?dev=1');
 console.log('  直接進機場第 5 步   http://localhost:'+port+'/?dev=1&zone=zone15&stage=5');
 console.log('按 Ctrl+C 停止。');
});
