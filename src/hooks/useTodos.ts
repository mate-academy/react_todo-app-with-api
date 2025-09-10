import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/types';
import { getTodos } from '../api/todos';
import { ErrorMessages } from '../types/enums';
import { useDeleteTodos } from './useDeleteTodos';
import { useEditTodos } from './useEditTodos';
import { useUpdateTodos } from './useUpdateTodos';
import { useAddTodos } from './useAddTodos';
import { useInputFocus } from './useInputFocus';

export const useTodos = (
  setCurrentError: Dispatch<SetStateAction<ErrorMessages | ''>>,
) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const { handleDeleteTodos, handleDeleteAllTodos } = useDeleteTodos(
    setTodos,
    setCurrentError,
    setLoadingTodos,
    todos,
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useInputFocus(loadingTodos, inputRef);

  const {
    handleEditTodo,
    editTodoTitle,
    activeTodoEdit,
    setActiveTodoEdit,
    setEditTodoTitle,
  } = useEditTodos(
    handleDeleteTodos,
    setTodos,
    setCurrentError,
    todos,
    setLoadingTodos,
  );

  const { tempTodo, handleAddTodo, setTempTodo } = useAddTodos(
    setCurrentError,
    setTodos,
    inputRef,
    setLoadingTodos,
  );

  const { handleCheckTodo, handleToggleAll } = useUpdateTodos(
    todos,
    setTodos,
    setCurrentError,
    setLoadingTodos,
  );

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data: Todo[] = await getTodos();

        setTodos(data);
      } catch (error) {
        setCurrentError(ErrorMessages.Load);
      } finally {
      }
    };

    loadTodos();
  }, []);

  return {
    todos,
    loadingTodos,
    setCurrentError,
    handleAddTodo,
    inputRef,
    tempTodo,
    handleDeleteTodos,
    handleDeleteAllTodos,
    setTempTodo,
    handleCheckTodo,
    handleToggleAll,
    handleEditTodo,
    editTodoTitle,
    activeTodoEdit,
    setActiveTodoEdit,
    setEditTodoTitle,
  };
};
