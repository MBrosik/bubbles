/**
 * @description used to show if target number is in range
 * @param number target number
 * @param begin begin of range
 * @param end end of range
 */
export default function inRange(number:number, begin:number, end:number) {
   if (number >= begin && number < end) return true;
   else return false;
}