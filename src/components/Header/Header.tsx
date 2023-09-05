import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  isActiveButton: boolean,
  nrOfTodos: number,
  formSummit: (event: React.FormEvent) => void,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
  patchTodos: (patch: object) => void,
  tempTodo: Todo | null,
}

function creatPatchTodo(key: string, value: string | boolean) {
  return { [key]: value };
}

export const Header: React.FC<Props> = ({
  isActiveButton,
  nrOfTodos,
  formSummit,
  todoTitle,
  setTodoTitle,
  patchTodos,
  tempTodo,
}) => {
  const activeButton = useMemo(() => {
    return isActiveButton;
  }, [isActiveButton]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const handleAllCompleted = () => {
    patchTodos(creatPatchTodo('completed', !activeButton));
  };

  return (
    <header className="todoapp__header">
      {!!nrOfTodos && (
        <button
          onClick={handleAllCompleted}
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: activeButton },
          )}
          aria-label="select-all"
        />
      )}

      <form onSubmit={formSummit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleChange}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
