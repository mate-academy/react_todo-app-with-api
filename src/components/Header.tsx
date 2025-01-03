import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/todos';
import { TodoError } from '../types/types';
import cn from 'classnames';

import * as Server from '../api/todos';

interface Props {
  todos: Todo[];
  title: string;
  defaultTempTodo: Todo;
  tempTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: (todo: Todo | null) => void;
  setErrors: (error: TodoError | '') => void;
  setNewTodo: (todo: string) => void;
  deletedTodoId: number[] | null;
  toggleAll: () => void;
}

export const Header: React.FC<Props> = ({
  todos,
  title,
  defaultTempTodo,
  tempTodo,
  setTodos,
  setTempTodo,
  setErrors,
  setNewTodo,
  toggleAll,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos.length, tempTodo]);

  const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (title.trim()) {
      const todo: Todo = {
        id: Date.now(),
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      try {
        setTempTodo(defaultTempTodo);
        const task = await Server.createPost(todo);

        setTodos([...todos, task]);
        setNewTodo('');
      } catch {
        setErrors(TodoError.AddError);
        setTimeout(() => {
          setErrors('');
        }, 3000);
      } finally {
        setTempTodo(null);
      }
    } else {
      setErrors(TodoError.EmptyTitleError);
      setTimeout(() => {
        setErrors('');
      }, 3000);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={`todoapp__toggle-all ${cn({ active: todos.every(el => el.completed) })}`}
          data-cy="ToggleAllButton"
          onClick={toggleAll}
        />
      )}

      <form onSubmit={event => event.preventDefault()}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          value={title}
          onChange={event => setNewTodo(event.target.value)}
          onKeyDown={handleSubmit}
          disabled={Boolean(tempTodo)}
        />
      </form>
    </header>
  );
};
