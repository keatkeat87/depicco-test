import { TControl } from "./models/TControl";
import { AbstractResourceService } from "../../entity/services/abstract-resource.service";
import { EntityConstructor, Entity } from "../../types";
export type TableCellType = 'Tick' | 'Image' | 'Youtube' | 'File' | 'Text' | 'Textarea' | 'Amount' | 'Date' | 'Datetime' | 'Time' | 'Enum' | 'ODataType'

export interface KeyAndTControl {
  // className and classDisplayName 是处理继承才需要用到的.
  className?: string
  classDisplayName?: string
  key: string // path 来的,resource 可以通过这个 path 获取到 value. e.g. : address.text 
  tControl: TControl
}

export interface TableGenerateRowNgClassFn<T> {
  (resource: T, index: number): {
    [propName: string]: boolean
  };
}
 
export type TableEntityItem<T extends Entity> = {
  Class: EntityConstructor,
  service: AbstractResourceService<T>
  displayName: string | null
  isAbstract: boolean,
  isRoot: boolean,
  layer: number, // 0 开始 
  parent: null | TableEntityItem<T>
}