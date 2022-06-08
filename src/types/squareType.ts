import { colorType } from "../enums/colorType";

/**@description display type of square */
export interface squareType {
    /**@description type of element, is that a ball or not */
    type: "ball" | null,
     /**@description color of the ball */
    color: colorType| null
}