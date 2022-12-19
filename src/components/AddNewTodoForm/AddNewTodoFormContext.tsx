import React, { useState } from 'react';

interface Props {
  children: React.ReactNode;
}

interface AddNewTodoContextInterface {
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  errorText: string,
  setErrorText: React.Dispatch<React.SetStateAction<string>>,
  isAdding: boolean,
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>,
}

export const AddNewTodoFormContext
  = React.createContext<AddNewTodoContextInterface>({
    title: '',
    setTitle: () => { },
    errorText: '',
    setErrorText: () => { },
    isAdding: false,
    setIsAdding: () => { },
  });

export const AddNewTodoFormProvider: React.FC<Props> = ({ children }) => {
  const [title, setTitle] = useState('');
  const [errorText, setErrorText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  return (
    <AddNewTodoFormContext.Provider value={{
      title,
      setTitle,
      errorText,
      setErrorText,
      isAdding,
      setIsAdding,
    }}
    >
      {children}
    </AddNewTodoFormContext.Provider>
  );
};
