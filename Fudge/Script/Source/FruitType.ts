namespace GantryGlutton {
  /**
   * Types of fruit.
  */
 export enum FruitType {
  Banana,
  Blueberry,
  Cherry,
  Pear,
 }

 export const getRandomFruitType = (): FruitType => {
  return Math.floor(4 * Math.random());
 }
}