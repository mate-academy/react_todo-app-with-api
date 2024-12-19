import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { ErrorMessage } from '../types/enum/Errors';
import { USER_ID } from '../api/constants';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onToggleAll: () => void;
  onChangeTempTodo: (tempdo: Todo | null) => void;
  setErrorMessage: (message: ErrorMessage) => void;
  onSubmit: (todo: Todo) => Promise<Todo | void>;
};

export const Header: React.FC<Props> = props => {
  const {
    tempTodo,
    todos,
    onToggleAll,
    onChangeTempTodo,
    setErrorMessage,
    onSubmit,
  } = props;

  const [value, setValue] = useState('');
  const isAllCompleted = todos.every(todo => todo.completed);
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current && tempTodo === null) {
      titleField.current.focus();
    }
  }, [tempTodo, todos.length]);

  const addingTodo = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: value.trim(),
      completed: false,
    };

    let todoCreatedSuccessfully = true;

    onSubmit(newTodo)
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        todoCreatedSuccessfully = false;
      })
      .finally(() => {
        if (todoCreatedSuccessfully) {
          setValue('');
        }

        onChangeTempTodo(null);
      });
  };

  return (
    <>
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: isAllCompleted })}
            data-cy="ToggleAllButton"
            onClick={onToggleAll}
          />
        )}

        <form onSubmit={addingTodo}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={value}
            ref={titleField}
            disabled={Boolean(tempTodo)}
            onChange={event => setValue(event.target.value)}
          />
        </form>
      </header>
    </>
  );
};
