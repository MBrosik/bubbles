
/**
 * @description returns random Value from enum
 * @param anEnum enum target
 */
export default function randomEnum<T>(anEnum: T): T[keyof T] {
  let enumValues = Object.keys(anEnum)
    .map(n => Number.parseInt(n))
    .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
  
  if (enumValues.length == 0) {        
    enumValues = Object.keys(anEnum) as unknown as T[keyof T][]
  }

  const randomIndex = <keyof T> <unknown> enumValues[Math.floor(Math.random() * enumValues.length)]
  const randomEnumValue = anEnum[randomIndex]  

  return randomEnumValue;
}