interface preSquare {
   x: number;
   y: number;
   html: HTMLElement
}

export interface square1 extends preSquare {
   status: "S" | "M" | "B" | null;
}

interface findSquare extends preSquare {
   status: "S" | "M" | "B" | null | "R" | "C";
   calc?: {
      total: number;
      toStart: number;
      toMeta: number;
      path: number;
   }
   parent?: findSquare;
}

/**
 * @description function which is searching the best path
 * @param table table of squares
 */
export function pathFinder(table: square1[]) {

   let table1 = <findSquare[]>table;

   // --------------------------
   // set start and meta
   // --------------------------

   let start = table1.find(el => el.status == "S")!;
   let meta = table1.find(el => el.status == "M")!;

   let toMeta = Math.sqrt(Math.pow(start.x - meta.x, 2) + Math.pow(start.y - meta.y, 2));

   start.calc = { toStart: 0, toMeta: toMeta, total: toMeta, path: 0 }

   // --------------------------
   // create tables
   // --------------------------

   let openTable: findSquare[] = [start];
   let closedTable: findSquare[] = [];

   let crossSearch = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
   ]


   // --------------------------
   // loops
   // --------------------------

   while (true) {
      if (openTable.length == 0) break;
      // --------------------------
      // check for best Square
      // --------------------------
      let current = openTable.reduce((previous, current) => {
         if (previous.calc!.total < current.calc!.total) {
            return previous
         }
         else if (previous.calc!.total == current.calc!.total && previous.calc!.toMeta < current.calc!.toMeta) {
            return previous
         }
         else {
            return current
         }
      })

      // --------------------------
      // Migrate Square
      // --------------------------

      openTable.removeIf(el => el == current);
      closedTable.push(current);

      // --------------------------
      // if meta
      // --------------------------

      if (current == meta) break;

      // --------------------------
      // check for neighbors
      // --------------------------

      for (const cross of crossSearch) {
         let neighbor = table1.find(el => el.x == current.x + cross[0] && el.y == current.y + cross[1]);

         if (neighbor == undefined) continue;

         // ---------------------------------------
         // if neighbor is in closed arr or border
         // ---------------------------------------

         if (neighbor.status == "B" || closedTable.find(el => el == neighbor) != null) continue;

         // ---------------------------------------
         // if not in openTable
         // ---------------------------------------
         let toParent = Math.sqrt(Math.pow(neighbor.x - current.x, 2) + Math.pow(neighbor.y - current.y, 2));

         if (openTable.find(el => el == neighbor) == null) {
            let toStart = Math.sqrt(Math.pow(neighbor.x - start.x, 2) + Math.pow(neighbor.y - start.y, 2));
            let toMeta = Math.sqrt(Math.pow(neighbor.x - meta.x, 2) + Math.pow(neighbor.y - meta.y, 2));
            let total = toStart + toMeta;


            neighbor.calc = { toStart, toMeta, total, path: current.calc!.path + toParent }
            neighbor.parent = current;

            openTable.push(neighbor)
         }
         // --------------------------
         // change parent
         // --------------------------         
         else if (current.calc!.path + toParent  < current.calc!.path) {
            neighbor.parent = current;
         }
      }
   }

   // --------------------------
   // set road
   // --------------------------


   let old = closedTable[closedTable.length - 1];
   if (old == meta) {


      let path = [old];

      while (true) {
         path.unshift(old.parent!)
         old = old.parent!
         if (old.status == "S") break;
      }

      return path;
   }
   else {
      return null;
   }
}