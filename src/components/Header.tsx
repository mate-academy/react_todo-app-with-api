import React from 'react';
import { NewTodoInput } from './NewTodoInput';
import { ErrorTypes } from '../types/ErrorTypes';

type HeaderProps = {
  todosCount: number;
  handleAddTodo: (title: string) => Promise<void>;
  addTodo: boolean;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorTypes | null>>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  toggleAllTodos: () => Promise<void>;
  allCompleted: boolean;
  loading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Header: React.FC<HeaderProps> = ({
  todosCount,
  handleAddTodo,
  addTodo,
  setErrorMessage,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  toggleAllTodos,
  allCompleted,
  loading,
  setIsLoading,
}) => {
  return (
    <header className="todoapp__header">
      <NewTodoInput
        todosCount={todosCount}
        addTodo={addTodo}
        setErrorMessage={setErrorMessage}
        handleAddTodo={handleAddTodo}
        newTodoTitle={newTodoTitle}
        setNewTodoTitle={setNewTodoTitle}
        inputRef={inputRef}
        loading={loading}
        setIsLoading={setIsLoading}
        toggleAllTodos={toggleAllTodos}
        allCompleted={allCompleted}
      />
    </header>
  );
};
