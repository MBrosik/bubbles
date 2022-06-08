import { setPoints } from "./decorators/setPoints";
import NextBallsContainer from "./NextBallsContainer";
import { pathFinder, square1 } from "./pathFinder";
import Square from "./square";
import extending from "./utils/extending";
import useSleep from "./utils/useSleep";

/** 
 * @description Główna klasa
 */
export default class Main {
   /** @description html element for game board */
   boardHTML: HTMLDivElement;
   /** 
    * {@link Square}
    * @description Array for squares 
    */
   board: Square[];
   /** @description length of game board in X dimension */
   lenX: number;
   /** @description length of game board in Y dimension */
   lenY: number;
   /** 
    * {@link NextBallsContainer}
    * @description class which is used to show next balls 
    */
   nextBalls: NextBallsContainer;
   /** @description variable which is used to store score*/
   result: number;
   /** @description container html element*/
   container: HTMLDivElement;


   constructor() {
      this.boardHTML = <HTMLDivElement>document.querySelector("#board");
      this.container = <HTMLDivElement> document.getElementById("container");
      this.lenX = 9;
      this.lenY = 9;
      this.board = [];

      this.result = 0;

      this.nextBalls = new NextBallsContainer(this);      


      this.init();
   }

   /** @description function which is called after constructor */
   async init() {
      this.setRecord();
      this.createSquares();
      this.randomizeBalls();
      this.nextBalls.randomizeColors();
      this.takeTurn();
   }

   /** @description this function shows the record */
   setRecord() {
      let { record } = window.localStorage
      document.getElementById("record-container")!.innerText = record == undefined ? 0 : record;
   }

   /** @description create squares in array */
   createSquares() {
      this.boardHTML.style.gridTemplateColumns = `repeat(${this.lenY},80px)`
      this.boardHTML.style.gridTemplateRows = `repeat(${this.lenX},80px)`
      // --------------------------
      // push Squares to array
      // --------------------------
      for (let x = 0; x < this.lenX; x++) {
         for (let y = 0; y < this.lenY; y++) {
            let square = new Square(this, this.boardHTML, x, y);
            this.board.push(square);
         }
      }

   }



   // -----------------------------------------------
   // Take turn
   // -----------------------------------------------


   /** @description Turn loop */
   async takeTurn() {      

      /** @description Table for promises */
      let promiseTable: Promise<Square>[] = [];
      /** @description variable used to store clicked ball */
      let chosenBall: Square | null = null;
      /** @description Boolean used to check if all squares are balls */
      let allBall = true;

      for ( const square of this.board) {


         // ---------------------------------------
         // Add event listeners to the balls
         // ---------------------------------------

         if (square.type == "ball") {            

            square.html.classList.add("clickable")
            square.html.onclick = () => {               
               chosenBall?.changeBlinkingStatus(false);

               let table = [
                  [-1,0],
                  [1,0],
                  [0,1],
                  [0,-1],
               ].filter(el1=>{
                  let f_square = this.board.find(el=>el.x == square.x+el1[0] && el.y == square.y + el1[1])

                  return f_square?.type != "ball" && f_square!=undefined
               })

               if (chosenBall != square  && table.length !=0) {
                  chosenBall = square;
                  chosenBall.changeBlinkingStatus(true);
               }
               else {
                  chosenBall = null;
               }
            }
         }

         // ------------------------------------------
         // Add event listeners to the other squares
         // ------------------------------------------
         else {
            allBall = false;

            let promise: Promise<Square> = new Promise(resolve => {
               square.html.onclick = () => {
                  if (
                     chosenBall != null
                     && this.getPath(chosenBall, square) != null
                  ) {
                     resolve(square);
                  }
               }
            });

            promiseTable.push(promise);

            square.html.onmouseleave = () => {
               this.board.forEach(el => {
                  el.html.classList.remove("pathing");
               })
            }

            square.html.onmouseenter = () => {
               if (chosenBall == null) return;

               let nicePath = this.getPath(chosenBall, square);

               nicePath?.forEach(el => {
                  el.html.classList.add("pathing");
               })
            }
         }
      }

      if (allBall) {
         this.endGame();
         return
      }

      /** @description square which is the meta of path */
      let meta = await Promise.race(promiseTable);

      /** @description the shortest path*/
      let nicePath = this.getPath(chosenBall!, meta);  

      // ---------------------------------------
      // clear squares
      // ---------------------------------------

      this.board.forEach(el => {
         el.html.onclick = () => { };
         el.html.onmouseleave = () => { };
         el.html.onmouseenter = () => { };
         el.html.setAttribute("class", "");
      })

      // ---------------------------------------
      // swap squares
      // ---------------------------------------
      if (nicePath != null) {
         /** @description color of the ball target*/
         let color = chosenBall!.color;

         nicePath?.forEach(el => {
            el.html.classList.add("end-pathing");
         })
         for (let index = 1; index < nicePath.length; index++) {
            const currElement = this.board.find(el => (el.x == nicePath![index].x && el.y == nicePath![index].y))!;
            const prevElement = this.board.find(el => (el.x == nicePath![index - 1].x && el.y == nicePath![index - 1].y))!;

            currElement.changeValues({ type: "ball", color: color });
            prevElement.changeValues({ type: null, color: null });

            await useSleep(40)
         }

      }



      await useSleep(300)

      nicePath?.forEach(el => {
         el.html.classList.remove("end-pathing");
      })

      /** @description smash balls*/
      let bool = this.pointCheck();

      if (!bool) {
         this.randomizeBalls();
         this.nextBalls.randomizeColors();
         let bool = this.pointCheck();
      }



      this.takeTurn();
   }

   /** @description end Game void. Called when game is ended */
   endGame() {
      this.board.forEach(el => {
         el.changeBlinkingStatus(false);
         el.html.classList.remove("clickable");
      })

      if (parseInt(window.localStorage["record"]) < this.result || window.localStorage["record"] == undefined) {
         window.localStorage["record"] = this.result;
         this.setRecord();
      }

      /** @description download template */
      let template = <HTMLTemplateElement>document.getElementById("end-game-template")!
      /** @description template content */
      let content = <HTMLDivElement>template.content.cloneNode(true)

      /** @description set score to endGame window */
      let endGameP = <HTMLParagraphElement>content.querySelector(".end-game-p")!
      endGameP.innerText = `Twój wynik: ${this.result}`;

      this.container.appendChild(content)      
   }

   // ---------------------------------------
   // randomize balls
   // ---------------------------------------

   /** @description chose square where will be ball */
   randomizeBalls() {

      this.nextBalls.arr.forEach(el => {
         /** @description store square */
         let square: Square;

         do {
            square = this.board.myRandom();
         } while (square.type == "ball" && !this.board.every(el => el.type == "ball"));

         square.changeValues({
            type: "ball",
            color: el
         });
      })

   }

   /**
    * @description function used to get path 
    * @param chosenBall start of path
    * @param square end of path
    */
   getPath(chosenBall: Square, square: Square) {
      /** @description create special array for path finding */
      let findTable: square1[] = this.board.map(el => {
         return {
            x: el.x,
            y: el.y,
            html: el.html,
            status: el == chosenBall
               ? "S"
               : el == square
                  ? "M"
                  : el.type == "ball"
                     ? "B"
                     : null,
         }
      })

      return pathFinder(findTable);
   }

   /** @description function used to smash the balls */
   @setPoints
   pointCheck() {
      /** @description storage for balls */
      let doubleArr: Square[][] = []
      /** @description storage for balls */
      let arr: Square[];
      /** @description bool that is used to show if any ball has been hit or not */
      let bool = false;

      /** @description function used add balls to array */
      let deleteBalls = () => {
         if (arr.length >= 5) {          
            doubleArr.push([...arr])
            bool = true;
         }
      }

      [true, false].forEach(elBool => {
         arr = [];

         for (let x = 0; x < (elBool ? this.lenX : this.lenY); x++) {

            for (let y = 0; y < (elBool ? this.lenY : this.lenX); y++) {
               const element = this.board.find(el =>
                  el[elBool ? "x" : "y"] == x
                  && el[elBool ? "y" : "x"] == y
               )!;

               if (arr.length == 0) {
                  if (element.type == "ball") {
                     arr.push(element);
                  }
               }
               else if (arr[arr.length - 1].color != element.color) {
                  deleteBalls();
                  arr = []
                  if (element.type == "ball") {
                     arr.push(element)
                  }
               }
               else {
                  arr.push(element)
               }
            }

            deleteBalls();

            arr = []
         }
      });
     
      let loopOver = (y1: number, bool: boolean, elBool: boolean) => {
         let y = y1;
         let x = 0;

         if (!elBool) {
            let z = y;
            x = y;

            y = bool ? this.lenY - 1 : 0;
         }

         while (true) {
            let el: Square = this.board.find(el =>
               el["x"] == x
               && el["y"] == y
            )!;

            if (el != undefined) {

               if (arr.length == 0) {
                  if (el.type == "ball") {
                     arr.push(el);
                  }
               }
               else if (arr[arr.length - 1].color != el.color) {
                  deleteBalls();
                  arr = []
                  if (el.type == "ball") {
                     arr.push(el)
                  }
               }
               else {
                  arr.push(el)
               }

               if (bool) {
                  x++;
                  y--;
               }
               else {
                  x++;
                  y++;
               }
            }
            else {
               deleteBalls();
               arr = [];

               break;
            }
         }
      }

      [true, false].forEach(elBool => {
         arr = []

         let max = elBool ? this.lenY : this.lenX

         for (let y1 = 0; y1 < max; y1++) {
            loopOver(y1, true, elBool);
         }
      });


      [true, false].forEach(elBool => {
         arr = []

         let max = elBool ? this.lenY : this.lenX

         for (let y1 = max - 1; y1 >= 0; y1--) {
            loopOver(y1, false, elBool);
         }
      });

      // this.setPoints(doubleArr)
      for (const arr of doubleArr) {
         for (const square of arr) {
            if (square.type != null) {
               square.changeValues({ color: null, type: null });
               this.result++;               
            }
         }
      }

      return bool;
   }
}


window.addEventListener("load", () => {
   new Main();
})


extending();