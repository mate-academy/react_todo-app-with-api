import {
  createContext, useState,
} from 'react';

interface FormContextType {
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

export const FormContext = createContext<FormContextType>({
  isCreating: false,
  setIsCreating: () => { },
  preparingTodoLabel: '',
  setPreparingTodoLabel: () => { },
  isUpdating: false,
  setIsUpdating: () => { },
  isToggleAll: false,
  setIsToggleAll: () => { },
  isClearing: false,
  setIsClearing: () => { },
});

export const FormProvider = (
  { children }: { children: React.ReactNode },
) => {
  const [isCreating, setIsCreating] = useState(false);
  const [preparingTodoLabel, setPreparingTodoLabel] = useState('');
  const [isToggleAll, setIsToggleAll] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  return (
    <FormContext.Provider
      value={{
        isCreating,
        setIsCreating,
        preparingTodoLabel,
        setPreparingTodoLabel,
        isUpdating,
        setIsUpdating,
        isToggleAll,
        setIsToggleAll,
        isClearing,
        setIsClearing,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};
