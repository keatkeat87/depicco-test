import { TableCellType } from "../types";

export class TControl {
    constructor(data?: Partial<TControl>) {
      Object.assign(this, data);
    }
    displayName: string
    sortable: boolean // 表示这个 cell 在类型上是否支持 sort
    blockSort = false; // 我们可以用 condition 阻止 sort, 比如继承的情况下就需要.
    cellType: TableCellType
  }