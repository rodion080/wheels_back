export function objectClone(obj:Record<any, any>){
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
}
