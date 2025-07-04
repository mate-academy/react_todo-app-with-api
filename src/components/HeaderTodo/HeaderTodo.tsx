import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Todo } from 'types/Todo';
import React from 'react';

interface Props {
  todos: Todo[];
  onInvalidTitle: () => void;
  onAddTodo: (todo: Todo) => Promise<boolean>;
  toggleAllTodos: () => void;
  isTempTodoCreating: boolean;
  inputField: React.RefObject<HTMLInputElement>;
}

export const HeaderTodo: FC<Props> = ({
  todos,
  onAddTodo,
  onInvalidTitle,
  toggleAllTodos,
  isTempTodoCreating,
  inputField,
}: Props) => {
  const areAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const [title, setTitle] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      onInvalidTitle();

      return;
    }

    const success = await onAddTodo({
      id: 0,
      title: trimmed,
      userId: 0,
      completed: false,
    });

    if (success) {
      setTitle('');
    }
  };

  useEffect(() => {
    if (!isTempTodoCreating) {
      inputField.current?.focus();
    }
  }, [isTempTodoCreating, inputField]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {!!todos.length && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: areAllCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={toggleAllTodos}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={handleChange}
          ref={inputField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isTempTodoCreating}
        />
      </form>
    </header>
  );
};
