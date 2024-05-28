import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';

import { USER_ID, addTodo, updateTodo } from '../../api/todos';

import cn from 'classnames';

interface Props {
  todos: Todo[];
  deleteIds: number[];
  setTodos: (todos: Todo[]) => void;
  setTempTodo: (tempTodo: Todo | null) => void;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: React.FC<Props> = ({
  todos,
  deleteIds,
  setTodos,
  setTempTodo,
  setError,
  loading,
  setLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading, deleteIds.length]);

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

    setLoading(true);

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
        setLoading(false);
        setTempTodo(null);
      });
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedState = !allCompleted;

    setLoading(true);

    try {
      const editedTodos = await Promise.all(
        todos.map(async todo => {
          if (todo.completed !== newCompletedState) {
            const editedTodo = await updateTodo(todo.id, {
              completed: newCompletedState,
            });

            return editedTodo;
          }

          return todo;
        }),
      );

      setTodos(editedTodos);
    } catch (error) {
      setError(Error.UnableEdit);
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      {!loading && !!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: !!todos.length && todos.every(todo => todo.completed),
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
          disabled={loading || !!deleteIds.length}
        />
      </form>
    </header>
  );
};
