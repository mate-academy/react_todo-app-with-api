import React, { FormEvent, useCallback, useState } from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  addTodoToServer: (title: string) => Promise<void>;
  todos: Todo[];
  completedTodos: Todo[];
  notify: (data: string) => unknown;
  handleToggleAll: () => Promise<void>
};

export const Header: React.FC<Props> = React.memo(({
  addTodoToServer,
  todos,
  completedTodos,
  notify,
  handleToggleAll,
}) => {
  const [todoTitle, setTodoTitle] = useState<string>('');

  const handleSubmitForm = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      if (!todoTitle.length) {
        notify('Cant add empty todo....');

        return;
      }

      addTodoToServer(todoTitle);
      setTodoTitle('');
    }, [todoTitle],
  );

  const handleTodoTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      setTodoTitle(value);
    }, [],
  );

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classnames(
          'todoapp__toggle-all', {
            active: todos.length === completedTodos.length,
          },
        )}
        aria-label="Toggle all active todos"
        onClick={handleToggleAll}
      />

      <form onSubmit={handleSubmitForm}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleTodoTitle}
        />
      </form>
    </header>
  );
});
