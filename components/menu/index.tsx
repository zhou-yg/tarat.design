import { action, signal } from 'atomic-signal';
import { useModule } from 'tarat-renderer';
import { h, PatternStructure, useLayout, useLogic, VirtualLayoutJSON } from 'tarat-renderer'
import { blockPattern } from '../../patterns';
import * as MenuItemModule from '../menu-item'
export interface MenuProps {
  items: MenuItemType[];
}
export interface MenuItemType {
  children?: MenuItemType[];
  label: string;
  key: string;

}


type LogicReturn = ReturnType<typeof logic>


export const logic = (props: MenuProps) => {
  const currentKey = signal<string>()
  const select = action((key: string) => {
    currentKey(() => key)
  })

  return {
    currentKey,
    select,
  }
}

export const layout = (props: MenuProps) => {
  const logic = useLogic<LogicReturn>()
  const MenuItemFunc = useModule<MenuItemModule.MenuItemProps>(MenuItemModule)

  return (
    <menuBox className="inline-block border border-slate-300 p-1">
      {props.items.map((item) => {
        const isSelected = logic.currentKey() === item.key
        return (
          <menuItem className="block my-1" key={item.key} onClick={() => logic.select(item.key)}>
            {MenuItemFunc({...item, selected: isSelected})}
          </menuItem>
        )
      })}
    </menuBox>
  )
}

export const designPattern = (props: MenuProps) => {
  const pattern = blockPattern
}

export const styleRules = (props: MenuProps) => {
  return []
}