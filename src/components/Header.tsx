/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useState, useEffect, useCallback } from 'react';
import { useTodoContext } from '../context/TodoContext';
import { updateTodo } from '../api/todos';
import { TodoForm } from './TodoForm';
import { Error } from '../types/Error';

export const Header: React.FC = () => {
  const {
    todos,
    setTodos,
    setError,
    setTodoIdsInUpdating,
  } = useTodoContext();
  const [toggleStatus, setToggleStatus] = useState<boolean>(false);

  useEffect(() => {
    setToggleStatus(todos.every(todo => todo.completed));
  }, [todos]);

  const toggleAllComplete = useCallback(async (): Promise<void> => {
    if (todos.every(t => t.completed) || todos.every(t => !t.completed)) {
      setTodoIdsInUpdating(todos.map(todo => todo.id));
    } else {
      setTodoIdsInUpdating(
        todos.filter(todo => !todo.completed).map(todo => todo.id),
      );
    }

    try {
      await Promise.all(todos.map(todo => {
        const updatedTodo = {
          ...todo,
          completed: !toggleStatus,
        };

        return updateTodo(todo.id, updatedTodo);
      }));

      setTodos(prevTodos => prevTodos.map(todo => ({
        ...todo,
        completed: !toggleStatus,
      })));

      setToggleStatus(!toggleStatus);
    } catch {
      setError(Error.UPDATE);
    } finally {
      setTodoIdsInUpdating([]);
    }
  }, [todos, toggleStatus]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: todos.every((todo) => todo.completed),
        })}
        onClick={toggleAllComplete}
      />

      <TodoForm />
    </header>
  );
};
