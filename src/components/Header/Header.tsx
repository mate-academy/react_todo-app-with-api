import cn from 'classnames';
import React, { useEffect, useRef } from 'react';

import { ErrorType } from '../../types/ErorTypes';
import { Todo } from '../../types/Todo';

type Props = {
  isAllCompleted: boolean;
  onAdd: (todoTitle: string) => void;
  onError: (error: ErrorType) => void;
  onNewTodoTitle: (title: string) => void,
  newTodoTitle: string
  onUpdate: (id: number, todo: Todo) => void;
  todos: Todo[]
};

export const Header: React.FC<Props> = ({
  isAllCompleted,
  onAdd,
  onError,
  onNewTodoTitle,
  newTodoTitle,
  onUpdate,
  todos,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmitAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newTodoTitle.trim()) {
      onAdd(newTodoTitle);
    } else {
      onError(ErrorType.TitleError);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [newTodoTitle]);

  const handleUpdateTodoStatus = () => {
    const newStatus = todos.some(todo => !todo.completed);

    todos.forEach(todo => {
      onUpdate(todo.id, {
        ...todo,
        completed: newStatus,
      });
    });
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          aria-labelledby="button-label"
          onClick={handleUpdateTodoStatus}
        />

      )}
      <form onSubmit={handleSubmitAdd}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => onNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
