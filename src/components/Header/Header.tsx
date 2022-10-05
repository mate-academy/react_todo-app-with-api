import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (event: FormEvent) => void,
  setTitle: (value:string) => void,
  title: string;
  changeProperty: (todoId: number, property: Partial<Todo>) => void,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  createTodo,
  setTitle,
  title,
  todos,
  changeProperty,
}) => {
  const handleSetTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const toggleAll = todos.every(({ completed }) => completed);

  const activeTodos = useMemo(() => todos
    .filter(todo => todo.completed === false), [todos]);

  const handleToggleAll = () => {
    if (activeTodos.length > 0) {
      return activeTodos
        .map(({ id }) => changeProperty(id, { completed: true }));
    }

    return todos.map(({ id }) => changeProperty(id, { completed: false }));
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', { active: toggleAll })}
        aria-label="toggle-button"
        onClick={handleToggleAll}
      />

      <form
        onSubmit={createTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleSetTitle}
        />
      </form>
    </header>
  );
};
