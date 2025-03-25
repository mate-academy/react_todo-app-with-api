/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  onAdd: (titleTd: string) => void;
  adding: boolean;
  errorMsg: string;
  todos: Todo[];
  onUpdate: (el: Todo[]) => void;
};

export const Header: React.FC<Props> = ({
  onAdd,
  adding,
  errorMsg,
  todos,
  onUpdate,
}) => {
  const [titleTd, setTitleTd] = useState('');
  const inputFocused = useRef<null | HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAdd(titleTd.trim());
  };

  useEffect(() => {
    if (errorMsg.length === 0 && !adding) {
      setTitleTd('');
    }

    inputFocused.current?.focus();
  }, [adding, todos.length]);

  useEffect(() => {
    inputFocused.current?.focus();
  }, []);

  const completedTds = todos.filter(el => el.completed);

  const changeAllCompleted = () => {
    const areAllCompleted = todos.every(td => td.completed);

    const updatedTodos = todos
      .filter(td => td.completed === areAllCompleted)
      .map(td => ({
        ...td,
        completed: !areAllCompleted,
      }));

    if (updatedTodos.length > 0) {
      onUpdate(updatedTodos);
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTds.length === todos.length,
          })}
          data-cy="ToggleAllButton"
          onClick={changeAllCompleted}
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          disabled={adding}
          ref={inputFocused}
          data-cy="NewTodoField"
          type="text"
          value={titleTd}
          onChange={e => setTitleTd(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
