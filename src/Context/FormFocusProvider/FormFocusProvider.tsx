import React, { createContext, useState } from 'react';

type FormFocusContextType = {
  isFocused: boolean,
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>
};

type Props = {
  children: React.ReactNode,
};

export const FormFocusContext = createContext<FormFocusContextType>({
  isFocused: true,
  setIsFocused: () => { },
});

export const FormFocusProvider: React.FC<Props> = ({ children }) => {
  const [isFocused, setIsFocused] = useState(true);

  return (
    <FormFocusContext.Provider value={{ isFocused, setIsFocused }}>
      {children}
    </FormFocusContext.Provider>
  );
};
