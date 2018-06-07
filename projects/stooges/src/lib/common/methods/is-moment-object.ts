import { isObject } from "./is-object";
import { Moment } from "moment";

export function isMomentObject(value : any) : value is Moment {
    // note : 
    // 这样写是不可以的, (value as Object).constructor.name === 'Moment' 
    // 因为 Moment 最终会变 ugly 掉
    // 目前没有任何方法可以在不 import moment.js 的情况下判断对象是不是 moment, 暂时 hack 它吧.     
    return isObject(value) && value['_isAMomentObject'] === true;
}