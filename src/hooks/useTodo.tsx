import { useContext } from 'react';
import { TodoContext } from '../components/TodoProvider';

export const useTodo = () => {
  const {
    todos,
    handleAddTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    errorMessage,
    setErrorMessage,
    isLoadingTodoIds,
  } = useContext(TodoContext);

  return {
    todos,
    handleAddTodo,
    handleDeleteTodo,
    handleUpdateTodo,
    errorMessage,
    setErrorMessage,
    isLoadingTodoIds,
  };
};
