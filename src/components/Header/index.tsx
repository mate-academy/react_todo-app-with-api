import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessages';
import cn from 'classnames';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onSetError: (val: ErrorMessage) => void;
  onSetTodoDefault: (val: Todo | null) => void;
  onSetNewTodo: (val: Todo) => Promise<Todo | void>;
  onToggleTodos: () => void;
};

export const Header: React.FC<Props> = ({
  todos,
  tempTodo,
  onSetError,
  onSetTodoDefault,
  onSetNewTodo,
  onToggleTodos,
}) => {
  const [title, setTitle] = useState('');

  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField || tempTodo !== null) {
      inputField.current?.focus();
    }
  }, [tempTodo, todos.length]);

  const handleHeaderSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      onSetError(ErrorMessage.Empty);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    onSetTodoDefault(newTodo);

    let todoAdded = true;

    onSetNewTodo(newTodo)
      .catch(() => {
        todoAdded = false;
        onSetError(ErrorMessage.Add);
      })
      .finally(() => {
        onSetTodoDefault(null);
        if (todoAdded) {
          setTitle('');
        }
      });
  };

  return (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed),
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleTodos}
        />
      )}

      <form onSubmit={handleHeaderSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => {
            setTitle(event.target.value);
          }}
          ref={inputField}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
