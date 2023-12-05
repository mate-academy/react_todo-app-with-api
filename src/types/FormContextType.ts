export interface FormContextType {
  isCreating: boolean,
  setIsCreating: (value: boolean) => void,
  preparingTodoLabel: string,
  setPreparingTodoLabel: (value: string) => void,
  isUpdating: boolean,
  setIsUpdating: (value: boolean) => void,
  isClearing: boolean,
  setIsClearing: (value: boolean) => void,
  isToggleAll: boolean,
  setIsToggleAll: (value: boolean | ((prevValue: boolean) => boolean)) => void,
}
