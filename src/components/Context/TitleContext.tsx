import React, { useState } from 'react';

interface TitleProps {
  todoTitle: string,
  setTodoTitle: (titleText: string) => void,
}

export const TitleContext = React.createContext<TitleProps>({
  todoTitle: '',
  setTodoTitle: () => {},
});

interface ChildrenProps {
  children: React.ReactNode,
}

export const TitleProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [todoTitle, setTodoTitle] = useState('');

  return (
    <TitleContext.Provider value={{ todoTitle, setTodoTitle }}>
      { children }
    </TitleContext.Provider>
  );
};
