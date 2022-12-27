import { h, SignalProps, useLogic, ConvertToLayoutTreeDraft, useModule, PropTypes, useComponentModule } from 'tarat-renderer';
import { Signal, action, after, signal } from 'atomic-signal'
import * as InputModule from '../input'
import * as MenuModule from '../menu'

export let meta: {
  props: SelectProps,
  layoutStruct: SelectLayout
  patchCommands: []
}

export interface SelectProps {
  value?: Signal<string | number>
  options: { label: string, value: any }[]
  disabled?: boolean
  onChange?: (value: string | number) => void
}

export const propTypes = {
  value: PropTypes.signal.isRequired.default(signal(''))
}

export const logic = (props: SelectProps) => {
  const current = signal(props.value())
  const focused = signal(false)
  const optionItems = signal((props.options || []).map((option) => {
    return {
      label: option.label,
      key: option.value,
      selected: current() === option.value,
    }
  }))

  const selectItem = (function (item: MenuModule.MenuItemProps) {
    console.log('item: ', item);
    // setTimeout(() => {
    //   current(() => item.key)
    //   focused(() => false)
    //   props.onChange?.(item.key)
    // })
    current(() => item.key)
    focused(() => false)
    props.onChange?.(item.key)
  })

  after(() => {
    console.log('current 4: ', current());
  }, [current])

  return {
    optionItems,
    current,
    selectItem,
    focused,
  }
}
type LogicReturn = ReturnType<typeof logic>

export type SelectLayout = {
  type: 'selectContainer',
  children: [
  ]
}

export const layout = (props: SelectProps) => {
  const {
    optionItems,
    current,
    selectItem,
    focused,
  } = useLogic<LogicReturn>()
  const Input = useModule(InputModule)

  const Menu = useComponentModule(MenuModule)

  console.log('current 3:', current())
  console.log('focused:', focused())

  return (
    <selectContainer
      className="block relative rounded">
      <Input 
        disabled={props.disabled}
        value={current} 
        onFocus={() => focused(true)}
        // onBlur={() => focused(false)} 
      />
      {optionItems().length > 0 && focused() ? (
        <optionList className="block border absolute z-10 left-0 shadow rounded p-1 w-full bg-white" style={{ top: '40px' }}>
          <Menu items={optionItems} onClick={selectItem} />
        </optionList>
      ) : ''}
    </selectContainer>
  )
}

export const styleRules = (props: SelectProps, layout: ConvertToLayoutTreeDraft<SelectLayout>) => {
  return [
  ]
}

export const designPattern = (props: SelectProps, layout: ConvertToLayoutTreeDraft<SelectLayout>) => {
  const logic = useLogic<LogicReturn>()
  return {}
}