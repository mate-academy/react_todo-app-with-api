import classNames from 'classnames';
import React, { ChangeEvent, FormEvent, useMemo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  createTodo: (event: FormEvent) => void,
  title: string,
  setTitle: (parameter: string) => void,
  todos: Todo[],
  updateState: (todoId: number, property: Partial<Todo>) => void,
  setIsToggle: (parameter: boolean) => void;
};

export const TodoHeader: React.FC<Props> = ({
  newTodoField,
  createTodo,
  title,
  setTitle,
  todos,
  updateState,
  setIsToggle,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const toggleAll = todos.every(({ completed }) => completed);

  const activeTodos = useMemo(() => todos
    .filter(todo => todo.completed === false), [todos]);

  const handleToggleAll = () => {
    if (activeTodos.length > 0) {
      setIsToggle(true);

      return activeTodos
        .map(({ id }) => updateState(id, { completed: true }));
    }

    setIsToggle(true);

    return todos.map(({ id }) => updateState(id, { completed: false }));
  };

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className={classNames('todoapp__toggle-all', { active: toggleAll })}
        aria-label="active"
        onClick={handleToggleAll}
      />

      <form onSubmit={createTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
