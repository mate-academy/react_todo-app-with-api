import React, { Ref } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { Errors } from '../types/Errors';

type Props = {
  onSubmit: (e: React.FormEvent) => void;
  onChange: (value: string) => void;
  inputRef: Ref<HTMLInputElement> | null;
  onUpdateTodos: (newTodo: Todo) => void;
  newTitle: string;
  isLoading: boolean;
  todos: Todo[];
  onError: (error: Errors) => void;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  onChange,
  inputRef,
  onUpdateTodos,
  newTitle,
  isLoading,
  todos,
  onError,
}) => {
  let isEveryTodoctive = todos.every(todo => todo.completed);

  if (!todos.length) {
    isEveryTodoctive = false;
  }

  const handletoggleAll = async () => {
    try {
      let unfinishedTasks = todos.filter(todo => !todo.completed);

      if (!unfinishedTasks.length) {
        unfinishedTasks = todos;
      }

      const updatingStatus = unfinishedTasks.map(todo =>
        updateTodo(todo.id, { ...todo, completed: !todo.completed }),
      );

      const newTodos = await Promise.all(updatingStatus);

      newTodos.map(newTodo => onUpdateTodos(newTodo as Todo));
    } catch {
      onError(Errors.Update);
    }
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isEveryTodoctive,
          })}
          data-cy="ToggleAllButton"
          onClick={handletoggleAll}
        />
      )}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          onChange={e => onChange(e.target.value)}
          value={newTitle}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
