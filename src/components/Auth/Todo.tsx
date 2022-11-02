import classNames from 'classnames';
import React, { useRef, FormEvent, useEffect } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: (event: FormEvent) => Promise<void>,
  title: string,
  toggleAllCompetedTodos: boolean,
  handleToggleAll: () => void,
  todos: Todo[]
};

export const Todos: React.FC<Props> = ({
  todos,
  setTitle,
  handleSubmit,
  title,
  toggleAllCompetedTodos,
  handleToggleAll,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          data-cy="ToggleAllButton"
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: toggleAllCompetedTodos },
          )}
          aria-label="a problem"
          onClick={handleToggleAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
