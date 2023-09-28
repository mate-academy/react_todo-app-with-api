import { useContext } from 'react';
import { TodoContext } from '../components/TodoProvider';

export const useTodo = () => {
  const {
    todos,
    addTodoHandler,
    deleteTodoHandler,
    updateTodoHandler,
    errorMessage,
    setErrorMessage,
    isLoadingTodoIds,
  } = useContext(TodoContext);

  return {
    todos,
    addTodoHandler,
    deleteTodoHandler,
    updateTodoHandler,
    errorMessage,
    setErrorMessage,
    isLoadingTodoIds,
  };
};
