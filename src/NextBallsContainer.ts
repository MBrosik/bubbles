import { colorType } from "./enums/colorType";
import Main from "./main";
import Square from "./square";
import randomEnum from "./utils/randomEnum";

/** @description display and randomize colors */
export default class NextBallsContainer {
   /** @description html container which presents next colors */
   html: HTMLDivElement;
   /** @description Array for next colors */
   arr: colorType[];   

   /**    
    * @param parent reference to parent element
    */
   constructor(
      public parent: Main
   ) {
      this.html = <HTMLDivElement>document.querySelector(".next-container");

      this.arr = [];

      this.randomizeColors();
   }

   /** @description randomize colors */
   randomizeColors() {
      this.arr = new Array(3).fill(null).map(el => randomEnum(colorType))

      this.html.innerHTML = "";

      this.arr.forEach(el => {
         let ball = document.createElement("div");
         ball.classList.add("ball");
         ball.style.backgroundColor = <string><unknown> el

         console.log(this.html);
         

         this.html.appendChild(ball);
      })
   }
}