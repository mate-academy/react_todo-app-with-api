import React, { FormEvent } from 'react';
import cn from 'classnames';
import { countCompletedTodos } from '../utils/helpers';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  handleUpdateAllTodoStatus: () => void,
  handleNewTodo: (event: FormEvent<HTMLFormElement>) => void,
  newTitleTodoRef: React.MutableRefObject<HTMLInputElement | null>,
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>,
  newTodoTitle: string,
  isLoading: boolean,
  setEditedTodo: React.Dispatch<React.SetStateAction<Todo | null>>,
};

export const Header: React.FC<Props> = ({
  todos,
  handleUpdateAllTodoStatus,
  handleNewTodo,
  newTitleTodoRef,
  setNewTodoTitle,
  newTodoTitle,
  isLoading,
  setEditedTodo,
}) => {
  return (
    <header className="todoapp__header">
      {!!todos.length && (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <button
          type="button"
          className={cn(
            'todoapp__toggle-all', {
              active: todos.length
              && countCompletedTodos(todos) === todos.length,
              'is-sr-only': !todos.length,
            },
          )}
          data-cy="ToggleAllButton"
          onClick={handleUpdateAllTodoStatus}
        />
      )}
      <form onSubmit={handleNewTodo}>
        <input
          ref={newTitleTodoRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setNewTodoTitle(event.target.value)}
          value={newTodoTitle}
          disabled={isLoading}
          onBlur={() => setEditedTodo(null)}
        />
      </form>
    </header>
  );
};
