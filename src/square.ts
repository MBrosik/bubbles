import { squareType } from "./types/squareType";
import Main from "./main";
import { colorType } from "./enums/colorType";
import { changeValuesDec } from "./decorators/changeValuesDec";

/**@description class which stores information about square */
export default class Square implements squareType {
    /**@description square html element */
    html: HTMLDivElement;
    /**@description type of element, is that a ball or not */
    type: "ball" | null;
    /**@description color of the ball */
    color: colorType | null;    


    /**
     * 
     * @param parent reference to parent class
     * @param boardHTML board html element with squares
     * @param x x coordinate
     * @param y y coordinate
     */
    constructor(
        public parent: Main,
        public boardHTML: HTMLDivElement,
        public x: number,
        public y: number
    ) {
        this.html = document.createElement('div');
        this.boardHTML.appendChild(this.html)

        this.type = null;
        this.color = null;        
    }    
    /**
     * @description functions which is used to change values of class
     * @param type object with elements of class to change
     */
    @changeValuesDec    
    changeValues(type: { [x in keyof this]?: this[x] }) {
        for (const key in type) {                                
            this[(<keyof this>key)] = <never>type[key]
        }
    }

    /**@description change css of the html element */
    changeBlinkingStatus(bool: Boolean) {
        this.html.classList[bool ? "add" : "remove"]("blinking")
    }
}


