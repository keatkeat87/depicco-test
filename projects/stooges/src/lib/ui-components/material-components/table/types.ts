import { Constructor, Entity, EntityConstructor } from "../../../types";
import { AbstractResourceService } from "../../../entity/services";

export interface MatTableGenerateRowNgClassFn<T> {
  (resource: T, index: number): {
    [propName: string]: boolean
  };
}

export interface MatTableGenerateEditRouterLink<T> {
  (resource: T): any[] // 返回 routerLink array
}

export type MatTableEntityItem = {
  display: string,
  class: Constructor
  resourceService: AbstractResourceService<Entity>,
  parent: Constructor | null
};

export type EntityItem<T extends Entity> = {
  Class: EntityConstructor,
  service: AbstractResourceService<T>
  displayName: string | null
  isAbstract: boolean,
  isRoot: boolean,
  layer: number, // 0 开始 
  parent: null | EntityItem<T>
}