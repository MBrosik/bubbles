import Main from "../main";

/**
 * @description extension of main method 
 */
export function changeValuesDec(_target: any, _name: string, descriptor: any) {

    let func = descriptor.value;

    descriptor.value = function (...args: any[]) {
        func.bind(this)(...args)
        // if (this.type == "ball" && type.hasOwnProperty("type")) {
        if (this.type == "ball") {
            this.html.innerHTML = ""

            let ballHTML = document.createElement("div");
            ballHTML.classList.add("ball");
            ballHTML.style.backgroundColor = <string><unknown>this.color

            this.html.appendChild(ballHTML)
        }
        // else if (this.type == null && type.hasOwnProperty("type")) {
        else if (this.type == null) {
            this.html.innerHTML = "";
        }
    }
    return descriptor;
}