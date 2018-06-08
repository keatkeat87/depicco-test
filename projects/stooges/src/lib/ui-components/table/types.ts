import { TControl } from "./models/TControl";
export type TableCellType = 'Tick' | 'Image' | 'Youtube' | 'File' | 'Text' | 'Textarea' | 'Amount' | 'Date' | 'Datetime' | 'Time' | 'Enum' | 'OdataType'

export interface KeyAndTControl {
    // className and classDisplayName 是处理继承才需要用到的.
    className?: string 
    classDisplayName?: string
    key: string // path 来的,resource 可以通过这个 path 获取到 value. e.g. : address.text 
    tControl: TControl
}