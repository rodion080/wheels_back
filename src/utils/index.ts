export function objectClone(obj:object){
  const result = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  return result;
}