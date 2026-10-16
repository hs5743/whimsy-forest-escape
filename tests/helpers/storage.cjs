module.exports=function storageFixture(initial={}){
 const data=new Map(Object.entries(initial));let failing=false;
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>{if(failing)throw Error('quota exceeded');data.set(k,String(v));},removeItem:k=>{if(failing)throw Error('quota exceeded');data.delete(k);},key:i=>[...data.keys()][i]??null,get length(){return data.size;}};
 return {storage,data,fail:state=>failing=state};
};
