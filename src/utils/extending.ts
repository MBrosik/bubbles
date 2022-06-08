declare global {
   interface Array<T> {
      myRandom(): T
      removeIf(func: (element: T, index: number, array: T[]) => Boolean): void
   }
}

/**@description extends Array */
export default function extending() {
   Array.prototype.myRandom = function () {
      return this[Math.floor(Math.random() * this.length)]
   }

   Array.prototype.removeIf = function (func: (element: any, index: number, array: any[]) => Boolean) {
      var i = 0;
      while (i < this.length) {
         if (func(this[i], i, this)) {
            this.splice(i, 1);
         }
         else {
            ++i;
         }
      }
   }
}