import React, { useEffect, useState } from 'react';
import { createTodo, changeTodoStatus } from '../api/todos';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
type Props = {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
};
const Header = ({
  todos,
  setTodos,
  inputRef,
  setTempTodo,
  setError,
  isLoading,
  setIsLoading,
  setActiveTodoIds,
}: Props) => {
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  const addTodo = async () => {
    const temp: Todo = {
      id: 0,
      title: query.trim(),
      completed: false,
      userId: 0,
    };

    setTempTodo(temp);
    setIsLoading(true);
    try {
      const newTodo = await createTodo(query);

      setTempTodo(newTodo);
      setError('');
      setQuery('');
    } catch {
      setError('Unable to add a todo');
      setTempTodo(null);
      setQuery(temp.title);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() === '') {
      return setError('Title should not be empty');
    }

    addTodo();
  };

  const handleToggleAll = () => {
    const hasIncomplete = todos.some(todo => !todo.completed);
    const newCompletedStatus = hasIncomplete;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.map(async todo => {
      setActiveTodoIds(current => [...current, todo.id]);
      try {
        await changeTodoStatus(todo.id, newCompletedStatus);
        setTodos(prev =>
          prev.map(t =>
            t.id === todo.id ? { ...t, completed: newCompletedStatus } : t,
          ),
        );
      } catch {
        setError('Unable to update todos');
      } finally {
        setActiveTodoIds(current => current.filter(id => id !== todo.id));
      }
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          onClick={handleToggleAll}
          disabled={isLoading}
        />
      )}

      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
