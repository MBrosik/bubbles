
 // {@link import("../square.ts").default} 

/**
 * @description extension of square method 
 */
export function setPoints(_target: any, _name: string, descriptor: any) {

    let func = descriptor.value;

    descriptor.value = function (...args: any[]) {
        let bool:boolean = func.bind(this)(...args)
        document.getElementById("points-container")!.innerText = this.result.toString();

        return bool
    }
}