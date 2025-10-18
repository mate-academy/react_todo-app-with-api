import React, { useEffect, useRef } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  setTitle: (value: string) => void;
  handleCompletedAll: () => void;
  handleSubmit: (event: React.FormEvent<Element>) => void;
  title: string;
  serverLoading: boolean;
  completedAll: boolean;
  todoList: Todo[];
};

export const Headers: React.FC<Props> = ({
  completedAll,
  title,
  serverLoading,
  todoList,
  handleCompletedAll,
  handleSubmit,
  setTitle,
}) => {
  const titleFild = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFild.current) {
      titleFild.current.focus();
    }
  }, [serverLoading, todoList]);

  return (
    <header className="todoapp__header">
      {todoList.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: completedAll,
          })}
          data-cy="ToggleAllButton"
          onClick={handleCompletedAll}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={titleFild}
          value={title}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={serverLoading}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
