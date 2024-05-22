import { useEffect, useRef, useState } from 'react';

import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

import { USER_ID, addTodo, updateTodo } from '../../api/todos';

interface Props {
  todos: Todo[];
  deleteIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<Props> = ({
  todos,
  deleteIds,
  setTodos,
  setTempTodo,
  setError,
  isLoading,
  setIsLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [isLoading, deleteIds.length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = newTitle.trim();

    if (!trimmedTitle) {
      setError(Error.EmptyTitle);

      return;
    }

    setIsLoading(true);

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    addTodo(newTodo)
      .then((todo: Todo) => {
        setTodos([...todos, todo]);
        setNewTitle('');
      })
      .catch(() => {
        setError(Error.UnableAdd);
        setNewTitle(newTodo.title);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedState = !allCompleted;

    setIsLoading(true);

    try {
      const updatedTodos = await Promise.all(
        todos.map(async todo => {
          if (todo.completed !== newCompletedState) {
            const updatedTodo = await updateTodo(todo.id, {
              completed: newCompletedState,
            });

            return updatedTodo;
          }

          return todo;
        }),
      );

      setTodos(updatedTodos);
    } catch (error) {
      setError(Error.UnableUpdate);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {!isLoading && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.length > 0 && todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTitle}
          ref={inputRef}
          data-cy="NewTodoField"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleChange}
          autoFocus
          disabled={isLoading || !!deleteIds.length}
        />
      </form>
    </header>
  );
};
