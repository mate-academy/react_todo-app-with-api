import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../Types/Todo';
import { postTodo, updateTodo, USER_ID } from '../../api/todos';

type Props = {
  todos: Todo[];
  setTodos: (updater: ((todos: Todo[]) => Todo[]) | Todo[]) => void;
  setToggleTodos: (updater: ((todos: number[]) => number[]) | number[]) => void;
  setTempTodo: (todo: Todo | null) => void;
  setError: (newError: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setToggleTodos,
  setTempTodo,
  setError,
}) => {
  const [query, setQuery] = useState('');
  const [disabled, setDisabled] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, [disabled, todos]);

  const onToggle = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const todoToUpdate = todos.filter(todo => todo.completed === allCompleted);

    todoToUpdate.forEach(todo =>
      setToggleTodos(previous => [...previous, todo.id]),
    );

    try {
      const updatedTodos = await Promise.all(
        todoToUpdate.map(todo =>
          updateTodo(todo.id, { completed: !todo.completed })
            .then(() => ({ ...todo, completed: !todo.completed }))
            .catch(() => {
              setError(`Unable to update todo with id ${todo.id}`);

              return todo;
            }),
        ),
      );

      const result = todos.map(
        todo => updatedTodos.find(updated => updated.id === todo.id) || todo,
      );

      setTodos(result);
    } catch {
      setError('Unable to update todos');
    } finally {
      setToggleTodos([]);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisabled(true);
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      setError('Title should not be empty');
      setDisabled(false);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: normalizedQuery,
      completed: false,
    };

    setTempTodo({ ...newTodo, id: 0 });

    postTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setQuery('');
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setDisabled(false);
        setTempTodo(null);
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 ? (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggle}
        />
      ) : null}

      <form onSubmit={event => onSubmit(event)}>
        <input
          ref={input}
          data-cy="NewTodoField"
          type="text"
          disabled={disabled}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
