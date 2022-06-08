/**
 * @description stop the async code for chosen time
 * @param time time of sleep 
 */
export default function useSleep(time:number){
   return new Promise(resolve=>{
      setTimeout(function(){
         resolve(true)
      },time)
   })
}