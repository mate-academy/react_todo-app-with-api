import { Dispatch, SetStateAction } from 'react';
import { Todo } from '../types/types';
import { updateTodos } from '../api/todos';
import { ErrorMessages } from '../types/enums';

export const useUpdateTodos = (
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[]>>,
  setCurrentError: Dispatch<SetStateAction<ErrorMessages | ''>>,
  setLoadingTodos: Dispatch<SetStateAction<number[]>>,
) => {
  const handleCheckTodo = async (todoId: number) => {
    setLoadingTodos(prev => [...prev, todoId]);

    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      if (!todoToUpdate) {
        return;
      }

      const data = { ...todoToUpdate, completed: !todoToUpdate.completed };

      await updateTodos(data, todoId);
      setTodos(prev =>
        prev.map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
        ),
      );
    } catch (error) {
      setCurrentError(ErrorMessages.Update);
    } finally {
      setLoadingTodos(prev => {
        return prev.filter(id => id !== todoId);
      });
    }
  };

  const handleToggleAll = async () => {
    try {
      const allCompleted = todos.every(todo => todo.completed);

      await Promise.all(
        todos
          .filter(todo => todo.completed === allCompleted)
          .map(todo => handleCheckTodo(todo.id)),
      );
    } catch (error) {
      setCurrentError(ErrorMessages.Update);
    }
  };

  return {
    handleCheckTodo,
    handleToggleAll,
  };
};
