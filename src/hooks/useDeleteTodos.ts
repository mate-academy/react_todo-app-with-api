import { Dispatch, SetStateAction } from 'react';
import { deleteTodos } from '../api/todos';
import { ErrorMessages } from '../types/enums';
import { Todo } from '../types/types';

export const useDeleteTodos = (
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>,
  setCurrentError: (error: ErrorMessages | '') => void,
  setLoadingTodos: Dispatch<SetStateAction<number[]>>,
  todos: Todo[],
) => {
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDeleteTodos = async (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);
    try {
      await deleteTodos(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setCurrentError(ErrorMessages.Delete);
    } finally {
      setLoadingTodos(prev => {
        return prev.filter(id => id !== todoId);
      });
    }
  };

  const handleDeleteAllTodos = async () => {
    try {
      await Promise.all(completedTodos.map(item => handleDeleteTodos(item.id)));
    } catch (error) {
      setCurrentError(ErrorMessages.Delete);
    }
  };

  return { handleDeleteTodos, handleDeleteAllTodos };
};
