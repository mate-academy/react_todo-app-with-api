/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React from 'react';

type Props = {
  todosLength: number,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  todoTitle: string,
  setTodoTitle: (input: string) => void;
  isTodoLoading: boolean;
  numberCompletedTodos: number,
  onToggleAll: (completed: boolean, todoId?: number) => void,
  allTodosCompleted: boolean,
};

export const Header: React.FC<Props> = ({
  todosLength,
  onSubmit,
  todoTitle,
  setTodoTitle,
  isTodoLoading,
  numberCompletedTodos,
  onToggleAll,
  allTodosCompleted,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  const toggleTodosAll = () => {
    onToggleAll(!allTodosCompleted);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: todosLength === numberCompletedTodos },
        )}
        onClick={toggleTodosAll}
      />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isTodoLoading}
        />
      </form>
    </header>
  );
};
