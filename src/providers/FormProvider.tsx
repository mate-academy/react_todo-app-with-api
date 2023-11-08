import { useState, createContext } from 'react';
import { FormContextType } from '../types/FormContextType';

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
