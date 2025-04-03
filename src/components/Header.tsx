import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { createTodo, USER_ID } from '../api/todos';
import { ErrorType } from '../types/Error';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  setTodos: (array: Todo[]) => void;
  setError: (value: ErrorType, time?: number) => void;
  setTempTodo: (value: Todo | null) => void;
  tempTodo: Todo | null;
  onUpdateAllTodosStatus: (value: boolean) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  setTodos,
  setError,
  setTempTodo,
  tempTodo,
  onUpdateAllTodosStatus,
}) => {
  const [title, setTitle] = useState('');
  const inputFocus = useRef<HTMLInputElement>(null);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setError(ErrorType.empty_value, 3000);

      return;
    }

    try {
      setTempTodo({ title: title, id: 0, completed: false, userId: USER_ID });
      const newTodo = await createTodo({
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTodos([...todos, newTodo]);
      setTitle('');
    } catch (err) {
      setError(ErrorType.adding_error, 3000);
    } finally {
      setTempTodo(null);
    }
  };

  const areAllCompleted = todos.every(todo => todo.completed);


  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  }, [tempTodo, todos]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => onUpdateAllTodosStatus(areAllCompleted)}
        />
      )}

      <form onSubmit={submitHandler}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          disabled={tempTodo !== null}
        />
      </form>
    </header>
  );
};
